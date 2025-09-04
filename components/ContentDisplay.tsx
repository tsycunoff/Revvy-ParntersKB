import React from 'react';
import type { Page, ContentBlock } from '../types';

const URL_REGEX = /https?:\/\/[^\s/$.?#].[^\s]*/gi;

const renderFormattedText = (text: string) => {
  const parts = text.split(new RegExp(`(\\*\\*.*?\\*\\*|\`.*?\`|${URL_REGEX.source})`, 'g'));

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="bg-blue-50 text-blue-800 ring-1 ring-blue-200 rounded px-1.5 py-0.5 font-mono text-sm">{part.slice(1, -1)}</code>;
    }
    if (part.match(URL_REGEX)) {
        return <a href={part} key={index} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{part}</a>
    }
    return part;
  });
};

const renderBlock = (block: ContentBlock, index: number) => {
    const content = block.content;

    if (content.startsWith('❗️')) {
        return (
            <div key={index} className="my-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                <p className="text-amber-900 leading-relaxed"><span className="font-bold">Внимание:</span> {renderFormattedText(content.substring(1).trim())}</p>
            </div>
        );
    }

    if (content.includes('\n• ')) {
        const lines = content.split('\n').filter(line => line.trim() !== '');
        return (
             <ul key={index} className="kb-list my-4 space-y-2 text-slate-700 leading-relaxed">
                {lines.map((line, lineIndex) => (
                    <li key={lineIndex}>{renderFormattedText(line.replace('• ', '').trim())}</li>
                ))}
            </ul>
        )
    }

    switch (block.type) {
      case 'heading':
        return (
            <h2 key={index} className="text-3xl font-bold text-slate-800 mt-12 mb-6 pb-3 border-b border-slate-200 relative">
                {block.content}
                <div className="absolute bottom-[-1px] left-0 h-[3px] w-20 bg-gradient-to-r from-[#0D6EFD] to-blue-400 rounded-full"></div>
            </h2>
        );
      case 'paragraph':
        return <p key={index} className="text-slate-700 leading-relaxed my-4 whitespace-pre-line">{renderFormattedText(block.content)}</p>;
      default:
        return null;
    }
}


const ContentDisplay: React.FC<{ page: Page | null }> = ({ page }) => {
  if (!page) {
    return (
      <div className="flex-1 p-8 md:p-12 flex items-center justify-center h-[calc(100vh_-_4rem)]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">Добро пожаловать в базу знаний Revvy</h1>
          <p className="mt-2 text-slate-500">Выберите тему в меню, чтобы начать.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 md:p-12 overflow-y-auto h-[calc(100vh_-_4rem)]">
      <article key={page.id} className="max-w-none prose prose-slate animate-fade-in-up">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-8 border-b border-slate-200 pb-4">
          <span className="animated-gradient-text">{page.title}</span>
        </h1>
        {page.content.map(renderBlock)}
      </article>
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        @keyframes fade-in-up {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }

        .kb-list {
          list-style: none;
          padding-left: 0.5rem;
        }
        .kb-list li {
          position: relative;
          padding-left: 1.75rem;
        }
        .kb-list li::before {
          content: '•';
          position: absolute;
          left: 0.5rem;
          top: 0;
          color: #3b82f6; /* theme(colors.blue.500) */
          font-weight: bold;
          font-size: 1.1em;
          line-height: 1.45;
        }
        
        .prose { max-width: 80ch; }
        .prose h1 { margin-bottom: 2rem; }
        .prose h2 { margin-top: 2.5rem; margin-bottom: 1rem; }
        .prose p { margin-top: 1.25rem; margin-bottom: 1.25rem; }
        .prose ul { margin-top: 1.25rem; margin-bottom: 1.25rem; }

        .animated-gradient-text {
          background: linear-gradient(45deg, #0D6EFD, #3b82f6, #60a5fa);
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: gradient-text-flow 4s ease-in-out infinite;
        }

        @keyframes gradient-text-flow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default ContentDisplay;