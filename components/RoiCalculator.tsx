import React, { useState, useMemo, useEffect } from 'react';

// --- Reusable Components ---

const AnimatedCounter: React.FC<{ value: number; format: (val: number) => string; duration?: number }> = ({ 
  value, 
  format, 
  duration = 800 
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const startTime = Date.now();
    const startValue = displayValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentValue = startValue + (value - startValue) * easeOutQuart;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value); // Ensure it ends on the exact value
      }
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return <span>{format(displayValue)}</span>;
};

interface CardProps {
    title: string;
    children: React.ReactNode;
    colorClass?: string;
}

const Card: React.FC<CardProps> = ({ title, children, colorClass = 'bg-slate-700' }) => (
    <div className="bg-white rounded-lg shadow-md border border-slate-200/80 overflow-hidden h-full">
        <h3 className={`text-white font-bold p-3 text-center text-sm ${colorClass}`}>
            {title}
        </h3>
        <div className="p-4 space-y-4">
            {children}
        </div>
    </div>
);

interface DataRowProps {
    label: string;
    value: React.ReactNode;
}
const DataRow: React.FC<DataRowProps> = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm border-b border-dashed border-slate-200 pb-2">
        <span className="text-slate-600">{label}</span>
        <span className="font-bold text-slate-800 text-right">{value}</span>
    </div>
);


// --- Main Calculator Component ---

const RoiCalculator: React.FC = () => {
    // --- State for Inputs (per branch) ---
    const [ordersPerMonth, setOrdersPerMonth] = useState(2100);
    const [avgCheck, setAvgCheck] = useState(1350);
    const [reviewsPerMonth, setReviewsPerMonth] = useState(8);
    const [totalReviews, setTotalReviews] = useState(1300);
    const [currentRating, setCurrentRating] = useState(4.4);
    
    const [branches, setBranches] = useState(1);
    const [discount, setDiscount] = useState(0.10); // 10%
    const [tariffPlanPrice, setTariffPlanPrice] = useState(6990);

    // --- Constants from Sheet Logic ---
    const constants = useMemo(() => ({
        NEGATIVE_INTERCEPTION_PROBABILITY: 0.7,
        CLIENT_RETENTION_RATE: 0.4,
        UPSELL_CONVERSION_RATE: 0.025,
        NEW_REVIEW_WEIGHT_FACTOR: 2.0, // Give new reviews 2x more weight for a more realistic impact
    }), []);

    // --- Calculations using useMemo ---
    const calculations = useMemo(() => {
        // Scale metrics by the number of branches
        const totalOrdersPerMonth = ordersPerMonth * branches;
        const totalOverallReviews = totalReviews * branches;
        
        // Work with Reviews (based on user's updated logic)
        const requestsSent = totalOrdersPerMonth * 0.93;
        const assessmentsReceived = requestsSent * 0.45;
        const newProjectedReviewsPerMonth = assessmentsReceived * 0.13;

        const negativeAssessments = assessmentsReceived * (1 - (currentRating / 5));
        const negativeIntercepted = negativeAssessments * constants.NEGATIVE_INTERCEPTION_PROBABILITY;
        const clientsRetained = negativeIntercepted * constants.CLIENT_RETENTION_RATE;

        // Potential Benefit
        const costReduction = clientsRetained * avgCheck;
        const projectedUpsell = totalOrdersPerMonth * constants.UPSELL_CONVERSION_RATE;
        const upsellRevenue = projectedUpsell * avgCheck;
        const totalBenefit = costReduction + upsellRevenue;

        // Sales and Financials
        const totalCost = tariffPlanPrice * branches * (1 - discount);
        const netBenefit = totalBenefit - totalCost;
        const servicePriceInOrders = totalCost > 0 && avgCheck > 0 ? totalCost / avgCheck : 0;
        const paybackInMonths = netBenefit > 0 ? totalCost / netBenefit : Infinity;

        // Map Dynamics with weighted model for new reviews
        const dynamics = [3, 6, 9, 12].map(months => {
            const newReviewsOverPeriod = newProjectedReviewsPerMonth * months;
            const futureReviewCount = totalOverallReviews + newReviewsOverPeriod;

            // Weighted average calculation where new reviews have more impact
            const weightedOldRating = totalOverallReviews * currentRating;
            const weightedNewRating = (newReviewsOverPeriod * constants.NEW_REVIEW_WEIGHT_FACTOR) * 5; // Assume 5 stars for new reviews

            const totalWeight = totalOverallReviews + (newReviewsOverPeriod * constants.NEW_REVIEW_WEIGHT_FACTOR);
            const futureRating = totalWeight > 0 ? (weightedOldRating + weightedNewRating) / totalWeight : 5;
            
            return {
                period: `Через ${months} мес`,
                rating: Math.min(5, futureRating).toFixed(1),
                reviewCount: Math.round(futureReviewCount)
            };
        });

        return {
            requestsSent,
            reviewsReceived: assessmentsReceived,
            negativeIntercepted,
            clientsRetained,
            costReduction,
            projectedReviewsPerMonth: newProjectedReviewsPerMonth,
            projectedUpsell,
            upsellRevenue,
            totalBenefit,
            totalCost,
            netBenefit,
            servicePriceInOrders,
            paybackInMonths,
            dynamics,
        };
    }, [ordersPerMonth, avgCheck, totalReviews, currentRating, branches, discount, tariffPlanPrice, constants]);
    
    // --- Formatters ---
    const formatCurrency = (val: number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);
    const formatNumber = (val: number) => new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);
    const formatDecimal = (val: number) => new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(val);

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
                <span className="animated-gradient-text">Калькулятор окупаемости для HoReCa</span>
            </h1>
            <p className="text-slate-500 mb-8">Оцените потенциальную выгоду от использования Revvy, изменив показатели ниже.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* --- INPUTS --- */}
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Показатели бизнеса (на 1 филиал)" colorClass="bg-orange-500">
                        <InputSlider label="Количество заказов" value={ordersPerMonth} setValue={setOrdersPerMonth} min={100} max={10000} step={50} format={formatNumber} />
                        <InputSlider label="Средний чек" value={avgCheck} setValue={setAvgCheck} min={300} max={5000} step={50} format={formatCurrency} />
                        <InputSlider label="Текущее кол-во отзывов/мес" value={reviewsPerMonth} setValue={setReviewsPerMonth} min={0} max={200} step={1} format={formatNumber} />
                        <InputSlider label="Общее кол-во отзывов" value={totalReviews} setValue={setTotalReviews} min={0} max={10000} step={100} format={formatNumber} />
                        <InputSlider label="Рейтинг на картах" value={currentRating} setValue={setCurrentRating} min={1} max={5} step={0.1} format={formatDecimal} />
                    </Card>

                     <Card title="Параметры продажи" colorClass="bg-orange-500">
                        <SelectInput label="Количество филиалов" value={branches} setValue={setBranches} options={[1,2,3,4,5,10,15,20]}/>
                        <SelectInput label="Размер скидки" value={discount} setValue={setDiscount} options={{'0%':0, '10%':0.1, '15%':0.15, '20%':0.2}}/>
                        <SelectInput label="Тарифный план" value={tariffPlanPrice} setValue={setTariffPlanPrice} options={{'Базовый (6,990₽)': 6990, 'Расширенный (9,990₽)': 9990}}/>
                        <div className="!mt-6 text-center bg-slate-50 p-3 rounded-lg">
                           <p className="text-sm text-slate-500">Итого стоимость в месяц</p>
                           <p className="text-2xl font-extrabold text-orange-600"><AnimatedCounter value={calculations.totalCost} format={formatCurrency}/></p>
                        </div>
                    </Card>
                </div>
                
                {/* --- RESULTS --- */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="Работа с отзывами">
                            <DataRow label="Количество запросов" value={<AnimatedCounter value={calculations.requestsSent} format={formatNumber} />} />
                            <DataRow label="Количество полученных оценок (ОС)" value={<AnimatedCounter value={calculations.reviewsReceived} format={formatNumber} />} />
                            <DataRow label="Перехвачено негатива" value={<AnimatedCounter value={calculations.negativeIntercepted} format={formatNumber} />} />
                            <DataRow label="Сохранено клиентов" value={<AnimatedCounter value={calculations.clientsRetained} format={formatNumber} />} />
                        </Card>
                        <Card title="Потенциальная выгода">
                            <DataRow label="Сокращение издержек" value={<AnimatedCounter value={calculations.costReduction} format={formatCurrency} />} />
                            <DataRow label="Прогноз отзывов/мес" value={<AnimatedCounter value={calculations.projectedReviewsPerMonth} format={formatNumber} />} />
                            <DataRow label="Прогноз допродаж" value={<AnimatedCounter value={calculations.projectedUpsell} format={formatDecimal} />} />
                            <DataRow label="Выручка с допродаж" value={<AnimatedCounter value={calculations.upsellRevenue} format={formatCurrency} />} />
                            <DataRow label="Общая выгода/мес" value={<span className="text-green-600"><AnimatedCounter value={calculations.totalBenefit} format={formatCurrency} /></span>} />
                        </Card>
                    </div>

                    <Card title="Динамика на картах">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            {calculations.dynamics.map(d => (
                                <div key={d.period}>
                                    <p className="text-xs text-slate-500 font-semibold">{d.period}</p>
                                    <p className="font-bold text-blue-600 text-lg">{d.rating} ★</p>
                                    <p className="text-xs text-slate-600"><AnimatedCounter value={d.reviewCount} format={formatNumber}/> отзывов</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="Финансовые результаты">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="bg-orange-50 p-4 rounded-lg">
                                <p className="text-sm text-slate-500">Цена сервиса в заказах</p>
                                <p className="text-2xl font-extrabold text-orange-600"><AnimatedCounter value={calculations.servicePriceInOrders} format={formatDecimal} /></p>
                            </div>
                             <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm text-slate-500">Чистая выгода/мес</p>
                                <p className="text-2xl font-extrabold text-green-600"><AnimatedCounter value={calculations.netBenefit} format={formatCurrency} /></p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-slate-500">Окупаемость</p>
                                <p className="text-2xl font-extrabold text-blue-600">
                                    {calculations.paybackInMonths === Infinity ? '∞' : <><AnimatedCounter value={calculations.paybackInMonths * 30} format={formatNumber}/> дней</>}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// --- Input Sub-components ---

const InputSlider: React.FC<{
    label: string, value: number, setValue: (v: number) => void,
    min: number, max: number, step: number, format: (v: number) => string
}> = ({ label, value, setValue, min, max, step, format }) => {
    const progress = (value - min) / (max - min) * 100;
    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <label className="text-sm font-medium text-slate-700">{label}</label>
                <span className="text-sm font-bold text-blue-700">{format(value)}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={e => setValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #0D6EFD ${progress}%, #e2e8f0 ${progress}%)` }}
            />
        </div>
    );
};

const SelectInput: React.FC<{
    label: string, value: any, setValue: (v: any) => void,
    options: any[] | Record<string, any>
}> = ({ label, value, setValue, options }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <div className="relative">
            <select
                value={value}
                onChange={e => setValue(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-slate-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition shadow-sm appearance-none"
            >
                {Array.isArray(options) 
                    ? options.map(opt => <option key={opt} value={opt}>{opt}</option>)
                    : Object.entries(options).map(([key, val]) => <option key={key} value={val}>{key}</option>)
                }
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
    </div>
);

export default RoiCalculator;