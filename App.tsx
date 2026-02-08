
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>();

  const handleTopicSelection = (topic: string) => {
    setSelectedTopic(topic);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        onSelectTopic={handleTopicSelection} 
        isOpen={isSidebarOpen} 
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-full">
        {/* Mobile Toggle */}
        <button 
          className="lg:hidden absolute top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-slate-200 border border-slate-700 shadow-xl"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Chat Component */}
        <ChatWindow initialTopic={selectedTopic} />
      </main>
    </div>
  );
};

export default App;
