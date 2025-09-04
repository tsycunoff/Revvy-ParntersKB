import React from 'react';
import type { KnowledgeBase } from '../types';

interface SidebarProps {
  knowledgeBase: KnowledgeBase;
  selectedPageId: string | null;
  onSelectPage: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ knowledgeBase, selectedPageId, onSelectPage }) => {
  return (
    <div className="w-full md:w-80 bg-white/60 backdrop-blur-lg border-r border-slate-200/80 flex flex-col p-4 h-[calc(100vh_-_4rem)] sticky top-[4rem] shrink-0">
      
      <nav className="flex-1 overflow-y-auto -mr-4 pr-4 pt-4">
        {knowledgeBase.map(section => (
          <div key={section.id} className="mb-6">
            <h2 className="flex items-center text-sm font-bold text-blue-700 uppercase tracking-wider mb-3 px-2">
              <section.icon className="w-4 h-4 mr-2" />
              {section.title}
            </h2>
            <ul>
              {section.pages.map(page => (
                <li key={page.id}>
                  <button
                    onClick={() => onSelectPage(page.id)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-200 flex items-center border-l-2 ${
                      selectedPageId === page.id
                        ? 'bg-blue-50 text-blue-700 font-semibold border-blue-600'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-transparent'
                    }`}
                  >
                    <span className="ml-1">{page.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;