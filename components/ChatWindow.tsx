
import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Loader2, Sparkles, User, Bot, RotateCcw, Paperclip, X, ExternalLink, ArrowUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message, Sender } from '../types';
import { geminiService } from '../services/geminiService';

interface ChatWindowProps {
  initialTopic?: string;
}

interface GroundingSource {
  title: string;
  uri: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ initialTopic }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: Sender.AI,
      text: "How can I help you with Data Structures and Algorithms today?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [currentSources, setCurrentSources] = useState<GroundingSource[]>([]);
  const [selectedImage, setSelectedImage] = useState<{ data: string, mimeType: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialTopic) {
      handleSend(`Explain ${initialTopic} with a focus on core concepts and efficiency.`);
    }
  }, [initialTopic]);

  // Enhanced auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current;
      scrollRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, streamingText, isLoading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setSelectedImage({ data: base64String, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (text: string = input) => {
    if ((!text.trim() && !selectedImage) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: Sender.USER,
      text: text || "Analyze this image.",
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    const imageToSubmit = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);
    setStreamingText('');
    setCurrentSources([]);

    try {
      const response = await geminiService.sendMessage(
        text, 
        (chunk, sources) => {
          setStreamingText(chunk);
          if (sources) setCurrentSources(sources);
        },
        imageToSubmit || undefined
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.AI,
        text: response.text,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
      setStreamingText('');
      setCurrentSources([]);
    } catch (error: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: Sender.AI,
        text: `Error: ${error?.message || "I encountered a technical issue. Please try again."}`,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#212121] text-slate-200">
      {/* Scrollable Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto w-full scroll-smooth scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {/* Increased bottom padding (pb-60) to prevent message bar overlap */}
        <div className="max-w-3xl mx-auto px-4 pt-12 pb-60 space-y-12">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-5 group animate-in animate-slide-in-from-bottom ${msg.sender === Sender.USER ? 'flex-row-reverse' : ''}`}>
              {/* Avatar Icon */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-1 border shadow-sm ${
                msg.sender === Sender.USER 
                  ? 'bg-slate-700 border-slate-600' 
                  : 'bg-emerald-600 border-emerald-500'
              }`}>
                {msg.sender === Sender.USER ? <User size={20} className="text-slate-300" /> : <Bot size={20} className="text-white" />}
              </div>

              {/* Message Content */}
              <div className={`flex flex-col gap-2 max-w-[calc(100%-60px)] ${msg.sender === Sender.USER ? 'items-end' : ''}`}>
                <div className={`text-[16px] leading-[1.75] tracking-normal ${
                  msg.sender === Sender.USER 
                    ? 'bg-[#2f2f2f] px-5 py-3 rounded-2xl text-slate-200 shadow-sm' 
                    : 'prose prose-invert max-w-none prose-p:mb-6 prose-p:leading-[1.75] prose-li:my-2 prose-headings:text-slate-100 prose-headings:mb-4 prose-strong:text-emerald-400 prose-code:text-emerald-300'
                }`}>
                  {msg.sender === Sender.AI ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Streaming Response Block */}
          {streamingText && (
            <div className="flex gap-5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-1 border bg-emerald-600 border-emerald-500 shadow-sm">
                <Sparkles size={20} className="text-white animate-pulse" />
              </div>
              <div className="flex flex-col gap-3 max-w-[calc(100%-60px)] w-full">
                <div className="prose prose-invert max-w-none text-[16px] leading-[1.75] tracking-normal prose-p:mb-6 prose-p:leading-[1.75] prose-li:my-2 prose-code:text-emerald-300">
                  <ReactMarkdown>{streamingText}</ReactMarkdown>
                </div>
                
                {currentSources.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                    {currentSources.map((source, i) => (
                      <a 
                        key={i} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2f2f2f] border border-white/5 rounded-full text-xs text-slate-400 hover:text-white hover:border-white/20 transition-all shadow-sm"
                      >
                        <ExternalLink size={12} />
                        {source.title.length > 25 ? source.title.substring(0, 25) + '...' : source.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {isLoading && !streamingText && (
            <div className="flex gap-5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-1 border bg-emerald-600 border-emerald-500 shadow-sm">
                <Loader2 size={20} className="text-white animate-spin" />
              </div>
              <div className="h-10 flex items-center gap-1 px-2">
                 <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Input Area - Fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#212121] via-[#212121] to-transparent pt-12 pb-8 px-4 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          {selectedImage && (
            <div className="mb-4 animate-in animate-slide-in-from-bottom">
              <div className="relative inline-block">
                <img 
                  src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`} 
                  className="h-24 w-24 object-cover rounded-xl border border-white/10 shadow-2xl"
                />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1.5 border border-white/10 hover:bg-slate-700 transition-colors shadow-lg"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          )}

          <div className="relative bg-[#2f2f2f] rounded-[26px] border border-white/10 focus-within:border-white/20 transition-all shadow-2xl p-2 pl-4 flex items-end">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-slate-400 hover:text-white transition-colors shrink-0 mb-0.5 rounded-full hover:bg-white/5"
              title="Attach diagram"
            >
              <Paperclip size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload}
            />
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Message DSA Master AI..."
              className="w-full bg-transparent text-slate-100 py-3.5 px-2 focus:outline-none placeholder:text-slate-500 text-[16px] leading-[1.5] resize-none max-h-48 overflow-y-auto"
              rows={1}
              style={{ minHeight: '48px' }}
              disabled={isLoading}
            />
            
            <button
              onClick={() => handleSend()}
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className="h-10 w-10 flex items-center justify-center bg-white text-black rounded-full hover:bg-slate-200 disabled:bg-[#3d3d3d] disabled:text-slate-600 transition-all shadow-md shrink-0 mb-1 mr-1"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <ArrowUp size={22} strokeWidth={3} />}
            </button>
          </div>
          
          <p className="text-center text-[12px] text-slate-500 mt-4 font-normal">
            Gemini can make mistakes. Consider checking important algorithmic details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
