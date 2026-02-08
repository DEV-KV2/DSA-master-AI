
import React from 'react';
import { DSA_TOPICS } from '../constants';

interface SidebarProps {
  onSelectTopic: (topic: string) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectTopic, isOpen }) => {
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 transition-transform duration-300 lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
            D
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">DSA Master</h1>
            <p className="text-slate-400 text-xs font-medium">Interactive Tutor</p>
          </div>
        </div>

        <div className="space-y-1 overflow-y-auto flex-1">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2 px-2">Core Concepts</p>
          {DSA_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic.title)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{topic.icon}</span>
              <div className="text-left">
                <p className="text-sm font-semibold truncate">{topic.title}</p>
                <p className="text-[10px] text-slate-500 truncate">{topic.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-800">
          <div className="bg-slate-800/50 p-4 rounded-xl">
            <h3 className="text-white text-xs font-semibold mb-1">Learning Progress</h3>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-[45%]" />
            </div>
            <p className="text-slate-400 text-[10px] mt-2 italic">Keep it up! Consistency is key.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
