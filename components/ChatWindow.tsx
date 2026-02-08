
import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Loader2, Sparkles, User, Bot, RotateCcw } from 'lucide-react';
import ReactMarkdown from  'react-markdown';
import { Message, Sender } from '../types';
import { geminiService } from '../services/geminiService';

interface ChatWindowProps {
  initialTopic?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ initialTopic }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: Sender.AI,
      text: "Hello! I'm your DSA Tutor. What data structure or algorithm would you like to explore today? I can help you with conceptual explanations, code implementations, or complexity analysis.",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTopic) {
      handleSend(`Tell me about ${initialTopic}`);
    }
  }, [initialTopic]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: Sender.USER,
      text: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingText('');

    try {
      const fullResponse = await geminiService.sendMessage(text, (chunk) => {
        setStreamingText(chunk);
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.AI,
        text: fullResponse,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
      setStreamingText('');
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: Sender.AI,
        text: "I'm sorry, I encountered an error. Please try again or check your API configuration.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    geminiService.resetChat();
    setMessages([{
      id: 'welcome-reset',
      sender: Sender.AI,
      text: "Chat context cleared. How can I help you next?",
      timestamp: Date.now()
    }]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
      
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900/50 border-b border-slate-800 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <Terminal className="text-indigo-400" size={20} />
          <h2 className="text-slate-100 font-semibold text-sm">Session Terminal</h2>
        </div>
        <button 
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-xs border border-slate-800"
        >
          <RotateCcw size={14} />
          Reset Chat
        </button>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.sender === Sender.USER ? 'flex-row-reverse' : ''} max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-lg ${msg.sender === Sender.USER ? 'bg-indigo-600' : 'bg-slate-800 border border-slate-700'}`}>
              {msg.sender === Sender.USER ? <User size={20} className="text-white" /> : <Bot size={20} className="text-indigo-400" />}
            </div>
            <div className={`flex flex-col gap-1 max-w-[85%] ${msg.sender === Sender.USER ? 'items-end' : ''}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === Sender.USER 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none prose prose-invert max-w-none prose-pre:bg-slate-800 prose-pre:p-0 prose-code:text-indigo-300'
              }`}>
                {msg.sender === Sender.AI ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  <p>{msg.text}</p>
                )}
              </div>
              <span className="text-[10px] text-slate-600 mt-1 font-medium">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {streamingText && (
          <div className="flex gap-4 max-w-4xl mx-auto">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-slate-800 border border-slate-700">
              <Sparkles size={20} className="text-indigo-400 animate-pulse" />
            </div>
            <div className="flex flex-col gap-1 max-w-[85%]">
              <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 text-slate-200 text-sm prose prose-invert max-w-none prose-pre:bg-slate-800 prose-pre:p-0 prose-code:text-indigo-300">
                <ReactMarkdown>{streamingText}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
        {isLoading && !streamingText && (
          <div className="flex gap-4 max-w-4xl mx-auto">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-slate-800 border border-slate-700">
              <Loader2 className="animate-spin text-indigo-400" size={20} />
            </div>
            <div className="flex items-center text-slate-500 text-xs italic bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800/50">
              Thinking about DSA...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 lg:p-6 bg-slate-900/50 border-t border-slate-800 backdrop-blur-md">
        <div className="max-w-4xl mx-auto relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about sorting, trees, Big O, or specific code problems..."
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 pl-5 pr-14 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-500 text-sm shadow-xl"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </div>
        <p className="max-w-4xl mx-auto text-center mt-3 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-semibold">
          AI Powered DSA Instruction • Ready for Input
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
