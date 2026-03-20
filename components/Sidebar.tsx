
import React from 'react';
import { DSA_TOPICS } from '../constants';
import { Plus, LayoutGrid, Terminal } from 'lucide-react';

interface SidebarProps {
  onSelectTopic: (topic: string) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectTopic, isOpen }) => {
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-[#171717] border-r border-white/5 transition-transform duration-300 lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full p-3">
        {/* New Chat Button */}
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center justify-between w-full p-3 mb-6 rounded-lg hover:bg-white/5 text-slate-200 group transition-all border border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center">
              <Plus size={16} />
            </div>
            <span className="text-sm font-medium">New Chat</span>
          </div>
        </button>

        <div className="space-y-4 overflow-y-auto flex-1 px-1">
          <div>
            <p className="text-[#8e8ea0] text-[11px] font-bold uppercase tracking-wider mb-2 px-2">Core Concepts</p>
            <div className="space-y-0.5">
              {DSA_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => onSelectTopic(topic.title)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2f2f2f] transition-all group text-left"
                >
                  <span className="text-base group-hover:scale-110 transition-transform shrink-0">{topic.icon}</span>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">{topic.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User / Settings Placeholder */}
        <div className="mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#2f2f2f] cursor-pointer text-slate-300 transition-all">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              DS
            </div>
            <span className="text-sm font-medium">DSA Student</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
