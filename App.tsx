import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import ContentDisplay from './components/ContentDisplay';
import DynamicBackground from './components/DynamicBackground';
import Header from './components/Header';
import Footer from './components/Footer';
import RoiCalculator from './components/RoiCalculator';
import {
  PositioningIcon,
  FeaturesIcon,
  MedicalIcon,
  IntegrationsIcon,
  PricingIcon,
  ClientCriteriaIcon,
  AlternativesIcon,
  FaqIcon,
  ContactIcon
} from './components/IconComponents';
import type { KnowledgeBase } from './types';

const knowledgeBaseData: KnowledgeBase = [
  {
    id: 'sec_positioning',
    title: 'Позиционирование',
    icon: PositioningIcon,
    pages: [
      {
        id: 'page_what_is_revvy',
        title: 'Что такое Revvy?',
        content: [
          { type: 'paragraph', content: '**Revvy** — это сервис автоматизации работы с отзывами для ресторанов, доставок еды и медицинских клиник. Помогает привлекать положительные отзывы на картах (Яндекс, Google, 2ГИС, Tripadvisor) и перехватывать негативные отзывы до их публикации.' },
        ],
      },
      {
        id: 'page_how_it_works',
        title: 'Как работает Revvy?',
        content: [
          { type: 'paragraph', content: 'К стандартному бизнес-процессу:' },
          { type: 'paragraph', content: '**Заказ → Приготовление → Доставка → Оплата**' },
          { type: 'paragraph', content: 'Мы добавляем недостающий "ингредиент" — обратную связь:' },
          { type: 'paragraph', content: '**Заказ → Приготовление → Доставка → Оплата → Запрос отзыва**' },
          { type: 'paragraph', content: '**Если клиент доволен (оценка 8-10):** Revvy перенаправляет его на карты для публичного отзыва' },
          { type: 'paragraph', content: '**Если клиент недоволен (оценка 1-7):** Сервис узнает детали и передает запрос управляющему для личного решения проблемы' },
        ],
      },
      {
        id: 'page_target_segments',
        title: 'Целевые сегменты',
        content: [
          { type: 'heading', content: '1. HoReCa (основной сегмент)' },
          { type: 'paragraph', content: '• Доставки еды\n• Рестораны и кафе\n• Требования: 100+ оцифрованных контактов/заказов в месяц' },
          { type: 'heading', content: '2. Медицинские клиники' },
          { type: 'paragraph', content: '• Интеграция через `МедФлекс`\n• Все типы медицинских учреждений из списка поддерживаемых `МИС`' },
          { type: 'heading', content: '3. Beauty & другие сегменты' },
          { type: 'paragraph', content: '• Салоны красоты\n• Автосервисы\n• Ремонтные службы' },
        ],
      },
    ],
  },
   {
    id: 'sec_calculator',
    title: 'Калькулятор ROI',
    icon: PricingIcon,
    pages: [
        {
            id: 'page_roi_calculator_horeca',
            title: 'ROI для HoReCa',
            content: [],
            component: RoiCalculator,
        }
    ]
  },
  {
    id: 'sec_features',
    title: 'Возможности Revvy',
    icon: FeaturesIcon,
    pages: [
      {
        id: 'page_main_functionality',
        title: 'Основной функционал',
        content: [
          { type: 'heading', content: '📋 Запрос отзывов' },
          { type: 'paragraph', content: 'Автоматическая отправка запроса обратной связи после заказа/визита с маршрутизацией:\n• Довольные клиенты → внешние площадки отзывов\n• Недовольные клиенты → внутренняя обработка' },
        ],
      },
      {
        id: 'page_communication_channels',
        title: 'Каналы связи',
        content: [
          { type: 'heading', content: 'Доступные каналы:' },
          { type: 'paragraph', content: '• **Telegram** (Tg personal)\n• **WhatsApp Business API (WABA)** - официальный WhatsApp business API\n• **WhatsApp Серый** (WhatsApp personal)\n• **ВКонтакте**' },
        ],
      },
      {
        id: 'page_upsell_tech_info',
        title: 'Тех. инфо о допродажах',
        content: [
          { type: 'paragraph', content: 'Анализ клиентской активности происходит по следующему алгоритму:' },
          { type: 'heading', content: 'Для CRM с прямым API (анализ в реальном времени):' },
          { type: 'paragraph', content: '• **`Bitrix24`:** Система анализирует все сделки клиента за последние 360 дней. Если прошло заданное количество дней с последнего заказа, автоматически запускается допродажная кампания.' },
          { type: 'paragraph', content: '• **`iikoTransport`:** Анализ ведется за 90 дней по номеру телефона с прогнозированием следующего заказа.' },
          { type: 'paragraph', content: '• **`AmoCRM`:** Работа ограничена анализом последних 75,000 сделок. Если клиента нет в этой выборке, система отправляет допродажное сообщение.' },
          { type: 'heading', content: 'Для CRM без прямого API (непрямой анализ):' },
          { type: 'paragraph', content: '• **`Гуляш`, `iikoPlugin`:** Система сохраняет данные о заказах в локальную таблицу. При отсутствии заказа в таблице система обращается к журналу активности. Триггер срабатывает при достижении заданного интервала с момента последнего заказа.' },
        ],
      },
      {
        id: 'page_order_status_notifications',
        title: 'Уведомления о статусе заказа',
        content: [
          { type: 'paragraph', content: '**(эксклюзивно для `iiko`)**' },
          { type: 'heading', content: 'Техническая реализация:' },
          { type: 'paragraph', content: '`iiko` — единая система управления рестораном, которая контролирует все этапы от кухни до доставки. Стандартно `iiko` отправляет уведомления через SMS или push-уведомления. Revvy заменяет эти каналы на WhatsApp.' },
          { type: 'heading', content: 'Принцип работы:' },
          { type: 'paragraph', content: 'Когда оператор в `iiko` переводит заказ в определенный статус, система Revvy автоматически получает эту информацию через API и мгновенно отправляет соответствующее уведомление клиенту в WhatsApp.' },
          { type: 'heading', content: 'Доступные статусы для автоматических уведомлений:' },
          { type: 'paragraph', content: '1. **Заказ принят** — подтверждение получения заказа от ресторана\n2. **Заказ готовится** — блюда поступили на кухню и находятся в процессе приготовления\n3. **Заказ готов** — блюда приготовлены и упакованы, ожидают курьера\n4. **Курьер в пути** — заказ передан курьеру, который направляется к клиенту\n5. **Курьер у подъезда** — курьер прибыл по указанному адресу\n6. **Заказ доставлен** — успешное завершение доставки' },
          { type: 'heading', content: 'Персонализация сообщений:' },
          { type: 'paragraph', content: 'В каждое уведомление автоматически подставляются актуальные данные:\n• Номер заказа\n• Время доставки\n• Адрес доставки\n• Имя курьера (если доступно)\n• Контактный телефон ресторана\n• Ссылка для отслеживания заказа' },
          { type: 'heading', content: 'Пример уведомления:' },
          { type: 'paragraph', content: '"Добрый день! Ваш заказ №82712 создан и будет у вас в течение 40 минут. Курьер: Антон Иванов. Приятного аппетита!"' },
        ],
      },
    ],
  },
  {
    id: 'sec_medical',
    title: 'Revvy Med',
    icon: MedicalIcon,
    pages: [
        {
            id: 'page_med_integration_details',
            title: 'Детали интеграции',
            content: [
              { type: 'heading', content: 'Архитектура подключения:' },
              { type: 'paragraph', content: '`МИС` клиники → `МедФлекс` (FHIR-совместимая платформа) → `Revvy` → Пациент (WhatsApp)' },
              { type: 'heading', content: 'Почему требуется ПроДокторов:' },
              { type: 'paragraph', content: 'Даже если клиника не использует ПроДокторов для привлечения пациентов, онлайн-запись на этой платформе служит техническим требованием для работы `МедФлекс`. Это обязательное условие для корректной передачи данных из `МИС`.' },
            ]
        },
        {
            id: 'page_med_notifications',
            title: 'Медицинские уведомления',
            content: [
                { type: 'heading', content: '1. Массовые vs индивидуальные напоминания:' },
                { type: 'paragraph', content: '• **Массовая отправка:** все пациенты, записанные на завтра, получают напоминание в заданное время (например, ежедневно в 11:00)\n• **Индивидуальная отправка:** каждому пациенту сообщение приходит за определенное количество часов до приема (от 1 до 99 часов)' },
                { type: 'heading', content: '2. Переменные для медицинских шаблонов:' },
                { type: 'paragraph', content: '• `{patient_name}` — полное имя пациента\n• `{doctor_name}` — имя врача\n• `{appointment_date}` — дата приема\n• `{appointment_time}` — точное время приема\n• `{clinic_address}` — адрес клиники\n• `{clinic_phone}` — контактный телефон\n• `{specialty}` — специальность врача\n• `{room_number}` — номер кабинета\n• `{procedure_name}` — название процедуры\n• `{preparation_instructions}` — инструкции по подготовке' },
                { type: 'heading', content: '3. Соответствие 152-ФЗ:' },
                { type: 'paragraph', content: 'Все персональные данные пациентов обрабатываются через сертифицированную платформу `МедФлекс` с соблюдением требований федерального закона "О персональных данных". Revvy не хранит медицинские данные, а только обрабатывает их для отправки уведомлений.' },
            ]
        },
        {
            id: 'page_medflex_integration',
            title: 'Интеграция с МедФлекс',
            content: [
                { type: 'heading', content: 'Наш партнёр — МедРокет:' },
                { type: 'paragraph', content: '• **ПроДокторов** — крупнейший сайт отзывов о врачах и клиниках с онлайн-записью\n• **`МедФлекс`** — защищённая платформа для передачи данных между `МИС` и внешними сервисами' },
                { type: 'heading', content: 'Важно для внедрения:' },
                { type: 'paragraph', content: 'Клиент должен иметь профиль на ПроДокторов (даже если не планирует его использовать). Подключение ПроДокторов и `МедФлекс` **бесплатное**.' },
            ]
        },
        {
            id: 'page_supported_mis',
            title: 'Поддерживаемые МИС',
            content: [
                { type: 'paragraph', content: 'Полный список: https://medflex.ru/services/' },
                { type: 'heading', content: 'Основные системы:' },
                { type: 'paragraph', content: '• `Архимед`, `Медлок`\n• `1С Бит Управление медицинским центром`\n• `1С Медицина` (Стоматология, Поликлиника, Больница)\n• `1С МедАнгел`, `1С Бит Стоматология`\n• `IDENT`, `MedWork`\n• `Инфоклиника`, `Инфодент`\n• `Renovatio`\n• `UNIVERSE-Медицина`, `UNIVERSE-Красота`\n• `1denta` (SQNS, Дента, Арника, Клиникон, Клиника Онлайн)\n• `Медиалог`, `Dental4Windows`' },
                { type: 'paragraph', content: '❗️ **`UNIVERSE`** берёт деньги за интеграцию с МедФлексом (более 10,000₽)' },
            ]
        },
        {
            id: 'page_med_notification_types',
            title: 'Типы уведомлений для медклиник',
            content: [
                { type: 'heading', content: '1. Уведомление о создании записи' },
                { type: 'paragraph', content: 'Отправляется сразу после записи пациента на приём.' },
                { type: 'heading', content: '2. Уведомление с подтверждением записи' },
                { type: 'paragraph', content: 'Два варианта:\n• Массовая отправка в заданное время (например, каждый день в 11:00 всем записанным на завтра)\n• Индивидуальная отправка за заданное количество часов до приёма (от 1 до 99 часов)' },
                { type: 'paragraph', content: '**Важно:** Статус подтверждения не передаётся в `МИС`. Ответ клиента видно в личном кабинете Revvy, в WhatsApp и на почте клиники.' },
                { type: 'heading', content: '3. Напоминание о записи' },
                { type: 'paragraph', content: 'Автоматическое напоминание за заданное время до визита.' },
                { type: 'heading', content: '4. Уведомление об изменении записи' },
                { type: 'paragraph', content: 'При изменении даты, времени или врача.' },
                { type: 'heading', content: '5. Уведомление об удалении записи' },
                { type: 'paragraph', content: 'При отмене записи.' },
                { type: 'heading', content: 'Особенности:' },
                { type: 'paragraph', content: '• Все уведомления можно редактировать в личном кабинете\n• В любое уведомление можно добавить картинку\n• Время отправки нельзя ограничить (например, с 9 до 18)' },
            ]
        },
    ],
  },
  {
    id: 'sec_integrations',
    title: 'Интеграции',
    icon: IntegrationsIcon,
    pages: [
        {
            id: 'page_integrations_unlimited',
            title: 'Без ограничений',
            content: [
              { type: 'paragraph', content: '• **`YumaPOS`** (yumapos.ru)\n• **`Mobidel`** (mobidel.ru)\n• **`YCLIENTS/Altegio`** (yclients.com)\n• **`Bitrix24`** (bitrix24.ru)\n• **`AmoCRM`** (amocrm.ru)\n• **`Ремонлайн`** (remonline.ru)\n• **`Dalionauto`** (auto.dalion.ru)\n• **`BonusPlus`** (bonusplus.pro)\n• **`RetailCRM`** (www.retailcrm.ru)\n• **`Renovation`** (rnova.ru)\n• **`Vetmanager`** (vetmanager.ru)\n• **`UDS`** (uds.app)' },
            ]
        },
        {
            id: 'page_integrations_conditional',
            title: 'С условиями',
            content: [
              { type: 'paragraph', content: '• **`iiko`** (iiko.ru)\n• **`FrontPad`** (frontpad.ru)\n• **`PremiumBonus`** (premiumbonus.ru)\n• **`Гуляш`** (goulash.tech)\n• **`Jupiter (Юпитер)`** (jupiter.systems)\n• **`Мой склад`** (moysklad.ru)\n• **`Инфодент`, `инфоклиника`** (sdsys.ru)\n• **`1С`** (1c.ru)\n• **`Медохват`** (medohvat.ru)\n• **`Aдента`** (adenta.pro)\n• **`Dooglys (Дуглас)`** (dooglys.com)\n• **`r_k Delivery`** (модуль доставки от r_keeper)' },
            ]
        },
        {
            id: 'page_integrations_none',
            title: 'Нет интеграций',
            content: [
              { type: 'paragraph', content: '• **`Presto`** (sbis.ru)\n• **`Bnovo PMS`** (bnovo.ru)\n• **`MEDODS`** (medods.ru)\n• **`СберФуд`** (sberfood.ru)\n• **`iTigris`** (itigris.ru)\n• **`Дента`** (1denta.ru)\n• **`iDent`** (dent-it.ru)\n• **`TravelLine`** (travelline.ru)\n• **`Logus`** (librahospitality.com/logus_hms)\n• **`OtelMS`** (otelms.com/ru)\n• **`Google Таблицы`** (google.ru/intl/ru/sheets/about)\n• **`Посифлора`** (posiflora.com)' },
            ]
        },
        {
            id: 'page_integrations_never',
            title: 'Не будет интеграций',
            content: [
              { type: 'paragraph', content: '• **`Bloknot`** (bloknotapp.com)\n• **`Арника`** (arnica.pro)\n• **`Listokcrm`** (listokcrm.ru)\n• **`Restik`** (restik.com)\n• **`Plazius`** (plazius.biz)\n• **`Tillypad`** (tillypad.ru)' },
            ]
        }
    ]
  },
  {
      id: 'sec_tariffs',
      title: 'Тарифы',
      icon: PricingIcon,
      pages: [
          {
              id: 'page_tariffs_main',
              title: 'Все тарифы',
              content: [
                  { type: 'heading', content: 'HoReCa (рестораны/доставка)' },
                  { type: 'paragraph', content: '• **Базовый:** 6,990₽/месяц\n• **Расширенный:** 9,990₽/месяц (включает маркетинговые рассылки и допродажи)' },
                  { type: 'heading', content: 'Медицина' },
                  { type: 'paragraph', content: '• **Единый тариф:** 9,990₽/месяц' },
                  { type: 'heading', content: 'Beauty и прочие сегменты' },
                  { type: 'paragraph', content: '• **Базовый:** 4,990₽/месяц\n• **Расширенный:** 5,990₽/месяц' },
              ]
          }
      ]
  },
  {
      id: 'sec_criteria',
      title: 'Критерии клиента',
      icon: ClientCriteriaIcon,
      pages: [
          {
              id: 'page_criteria_horeca',
              title: 'Критерии для HoReCa',
              content: [
                  { type: 'heading', content: 'Обязательные условия:' },
                  { type: 'paragraph', content: '1. **Оцифрованная клиентская база:** Бизнес постоянно собирает контакты клиентов (имя/телефон) и хранит их в CRM, с которой у нас есть интеграция.' },
                  { type: 'paragraph', content: '2. **Минимум 100 контактов/заказов в месяц:** Если менее 100 заказов/контактов в месяц, продаем только от 3-х месяцев подписки (месячную подписку не продаем).' },
                  { type: 'paragraph', content: '3. **Собственные заказы, а не только агрегаторы:** Бизнес должен иметь свои заказы. Заказы только через агрегаторов (Яндекс.Еда, Delivery Club) нам не подходят, так как бизнес не знает контакты этих клиентов.' },
                  { type: 'paragraph', content: '4. **Профили на площадках отзывов:** У бизнеса должны быть зарегистрированы профили на площадках, где он хочет собирать отзывы.' },
              ]
          },
          {
              id: 'page_criteria_reviews_importance',
              title: 'Почему важны отзывы',
              content: [
                  { type: 'heading', content: 'Влияние рейтинга на заявки:' },
                  { type: 'paragraph', content: '• Высокий рейтинг помогает продавать, низкий - наоборот\n• Рестораны с высоким рейтингом показываются выше в Яндекс.Картах\n• Есть сортировка по рейтингу в картах и 2ГИС' },
                  { type: 'heading', content: 'Статистика от исследований:' },
                  { type: 'paragraph', content: '**BrightLocal (декабрь 2020):**\n• **87%** потребителей читают отзывы о местных компаниях\n• **92%** откажутся от покупки при негативных отзывах\n• **82%** доверяют отзывам как рекомендациям друзей\n• **72%** написали бы отзыв, если их попросить\n• В среднем потребитель читает **10 отзывов** перед обращением в компанию\n• **73%** считают отзывы актуальными не более месяца\n• **50%** учитывают только отзывы за последние 2 недели' },
                  { type: 'paragraph', content: '**Womply Research:**\n• Прямая зависимость между рейтингом и прибылью\n• Оптимальный рейтинг: 4,5-4,9 звезд\n• Компании с идеальным рейтингом 5,0 уступают по прибыли компаниям с 4,5-4,9' },
                  { type: 'heading', content: 'Факты о Яндекс.Картах:' },
                  { type: 'paragraph', content: '• **44%** пользователей выбирают компании из локальной выдачи карт\n• 50+ млн активных пользователей Яндекс.Карт ежемесячно\n• **76%** пользователей посещают организацию в день локального поиска' },
              ]
          }
      ]
  },
  {
      id: 'sec_alternatives',
      title: 'Альтернативы',
      icon: AlternativesIcon,
      pages: [
          {
              id: 'page_alternatives_main',
              title: 'Альтернативные решения',
              content: [
                  { type: 'heading', content: '1. Накрутка отзывов' },
                  { type: 'paragraph', content: '**Минусы:**\n• Яндекс удаляет фальшивые отзывы\n• Клиенты распознают подделки\n• Репутационные риски' },
                  { type: 'heading', content: '2. Обзвон клиентов администратором' },
                  { type: 'paragraph', content: '**Минусы:**\n• Дорого (время сотрудника)\n• Низкая результативность\n• Неполная картина обратной связи' },
                  { type: 'heading', content: '3. Отзыв за подарок/бонус' },
                  { type: 'paragraph', content: '**Минусы:**\n• Подрывает доверие к отзывам\n• Не перехватывает негативные отзывы\n• Один негативный отзыв убивает эффект от трех положительных' },
                  { type: 'heading', content: '4. QR-коды' },
                  { type: 'paragraph', content: '**Минусы:**\n• Конверсия 1-2%\n• Чаще пишут недовольные клиенты\n• Не перехватывает негативные отзывы' },
                  { type: 'heading', content: '5. Мобильные приложения (push-уведомления)' },
                  { type: 'paragraph', content: '**Минусы:**\n• Клиент должен установить приложение\n• Отзывы остаются внутри приложения\n• Не влияют на рейтинг в картах' },
              ]
          }
      ]
  },
  {
      id: 'sec_faq',
      title: 'Частые вопросы',
      icon: FaqIcon,
      pages: [
          {
              id: 'page_faq_implementation',
              title: 'О внедрении и настройке',
              content: [
                  { type: 'paragraph', content: '**Q: Сколько времени занимает внедрение?**\n\nA: Для всех систем, с которыми у нас есть интеграции: 1-3 рабочих дня.' },
                  { type: 'paragraph', content: '**Q: Что если у нас нет CRM?**\n\nA: Мы НЕ помогаем с выбором и настройкой CRM. У клиента должна быть готовая CRM с нашей интеграцией.' },
                  { type: 'paragraph', content: '**Q: Какая конверсия в отзывы?**\n\nA: Средняя конверсия 15-25%, но она НЕ гарантированная и зависит от множества факторов: качества сервиса, настройки шаблонов, специфики бизнеса и других условий.' },
              ]
          },
          {
              id: 'page_faq_functionality',
              title: 'О функциональности',
              content: [
                  { type: 'paragraph', content: '**Q: Можно ли отключить запросы для конкретных клиентов?**\n\nA: Да, запросы можно отключать точечно для конкретных номеров телефонов.' },
                  { type: 'paragraph', content: '**Q: Работаете ли с франшизами?**\n\nA: Да, есть специальные решения для франшиз с возможностью настройки каждой точки отдельно.' },
                  { type: 'paragraph', content: '**Q: Есть ли интеграция с системами лояльности?**\n\nA: Нет, такой возможности у нас нет.' },
                  { type: 'paragraph', content: '**Q: Жалуются ли клиенты на спам?**\n\nA: Жалобы на спам получают менее 0,1% клиентов, так как сообщения отправляются только после реального заказа/визита.' },
                  { type: 'paragraph', content: '**Q: Гарантируете ли рост рейтинга?**\n\nA: Мы гарантируем рост количества отзывов и перехват негативных ситуаций. Рост рейтинга зависит от качества сервиса клиента.' },
              ]
          }
      ]
  },
  {
      id: 'sec_contacts',
      title: 'Контакты',
      icon: ContactIcon,
      pages: [
          {
              id: 'page_contacts_main',
              title: 'Контактная информация',
              content: [
                  { type: 'heading', content: 'Техподдержка' },
                  { type: 'paragraph', content: '• Email: support@revvy.ru\n• Время работы: 9:00-18:00 (МСК)' },
                  { type: 'heading', content: 'Отдел продаж' },
                  { type: 'paragraph', content: '• Email: sales@revvy.ru\n• Телефон: +7 (495) 123-45-67' },
              ]
          }
      ]
  }
];


const App: React.FC = () => {
  const [selectedPageId, setSelectedPageId] = useState<string | null>('page_what_is_revvy');

  const selectedPage = useMemo(() => {
    if (!selectedPageId) return null;
    for (const section of knowledgeBaseData) {
      const page = section.pages.find(p => p.id === selectedPageId);
      if (page) return page;
    }
    return null;
  }, [selectedPageId]);

  return (
    <div className="min-h-screen text-slate-700 relative bg-slate-50">
      <DynamicBackground />
      <Header />
      <div className="relative z-10 max-w-screen-2xl mx-auto pt-16">
        <main className="flex flex-col md:flex-row">
          <Sidebar 
            knowledgeBase={knowledgeBaseData} 
            selectedPageId={selectedPageId}
            onSelectPage={setSelectedPageId}
          />
          <ContentDisplay page={selectedPage} />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;