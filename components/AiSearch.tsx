import React, { useState, useCallback } from 'react';
import { queryKnowledgeBase } from '../services/geminiService';
import type { KnowledgeBase } from '../types';
import { SearchIcon, LoadingSpinner } from './IconComponents';

interface AiSearchProps {
  knowledgeBase: KnowledgeBase;
}

const AiSearch: React.FC<AiSearchProps> = ({ knowledgeBase }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');
    setResult('');
    setIsModalOpen(true);

    try {
      const response = await queryKnowledgeBase(query, knowledgeBase);
      setResult(response);
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [query, knowledgeBase]);
  
  const closeModal = () => {
    setIsModalOpen(false);
    setQuery('');
    setResult('');
    setError('');
  };

  return (
    <>
      <form onSubmit={handleSearch} className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Спросить AI Ассистента..."
          className="w-full bg-white/50 border border-slate-300 rounded-md py-2 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition shadow-sm"
        />
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-slate-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800">AI Ассистент</h2>
                <p className="text-sm text-slate-500 mt-1">
                    <span className="font-medium text-slate-700">Запрос:</span> {query}
                </p>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {isLoading && (
                <div className="flex flex-col items-center justify-center space-y-3 text-slate-600">
                  <LoadingSpinner className="w-8 h-8 text-blue-600"/>
                  <p>Ищем в базе знаний...</p>
                </div>
              )}
              {error && <p className="text-red-500">{error}</p>}
              {result && (
                <div className="text-slate-700 whitespace-pre-wrap space-y-4">
                  {result.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 text-right bg-slate-50 rounded-b-lg">
                <button 
                    onClick={closeModal}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-md transition"
                >
                    Закрыть
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AiSearch;