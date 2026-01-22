
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { generateArchitectResponse } from '../services/geminiService';
import { Message, AgentStep } from '../types';
import { useVibeStore } from '../store/vibeStore';

const INITIAL_STEPS_TEMPLATE: AgentStep[] = [
  { id: '1', label: 'Iniciando Percepção', status: 'idle', icon: '🧠' },
  { id: '2', label: 'Análise Semântica', status: 'idle', icon: '🔍' },
  { id: '3', label: 'Síntese de Interface', status: 'idle', icon: '🎨' },
  { id: '4', label: 'Validação Estrutural', status: 'idle', icon: '🛡️' },
];

export const ChatInterface = () => {
  const { setTheme, setSteps, setIsThinking, updateStep } = useVibeStore();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'VIBE_OS Online. Ativando protocolos de UI Generativa.', type: 'text' }
  ]);
  const [input, setInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSend = async (hasImage: boolean = false) => {
    if (!input.trim() && !hasImage) return;

    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: input || "Análise multimodal solicitada", 
      type: 'text' 
    };
    
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    
    // Deep copy steps to avoid mutation
    const runSteps = INITIAL_STEPS_TEMPLATE.map(s => ({ ...s }));
    setIsThinking(true);
    setSteps(runSteps);
    
    // Simulated sequence for UX immersion
    for (const step of runSteps) {
      updateStep(step.id, 'processing');
      await new Promise(r => setTimeout(r, 400 + Math.random() * 300));
      updateStep(step.id, 'complete');
    }

    const response = await generateArchitectResponse(currentInput, hasImage);
    
    if (response.themeShift) {
      setTheme(response.themeShift);
    }

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.content,
      type: response.type,
      data: response.data
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsThinking(false);
  };

  return (
    <section className="py-24 px-4 min-h-screen transition-colors duration-[1500ms]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-black tracking-tight flex items-center gap-4">
            ARCHITECT <span className="text-xs bg-cyan-400 text-black px-2 py-1 rounded font-bold">V3.1</span>
          </h2>
          <p className="text-zinc-500 mt-2 font-mono text-sm tracking-widest">SISTEMA DE INTERFACE REATIVA</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[750px]">
          {/* Chat Panel */}
          <motion.div 
            animate={{ scale: isDragOver ? 1.01 : 1 }}
            className={`lg:col-span-3 flex flex-col glass-morphism rounded-[2.5rem] overflow-hidden border transition-all ${
              isDragOver ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/10'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => { 
              e.preventDefault(); 
              setIsDragOver(false); 
              handleSend(true); 
            }}
          >
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth scrollbar-hide">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[90%] space-y-4 flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-5 rounded-3xl ${
                        m.role === 'user' 
                          ? 'bg-white text-black font-bold shadow-xl shadow-white/5' 
                          : 'bg-zinc-900/80 text-zinc-200 border border-white/5 backdrop-blur-md'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                      </div>

                      {/* Generative Components */}
                      {m.type === 'system-alert' && (
                        <div className="w-full p-4 border border-red-500/30 bg-red-500/10 rounded-2xl text-red-400 text-xs font-mono animate-pulse">
                          [!] ERROR_LOG_DATA: {JSON.stringify(m.data)}
                        </div>
                      )}

                      {m.type === 'tracker' && m.data && (
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }} 
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-72 p-6 glass-morphism rounded-[2rem] border border-cyan-400/30 bg-gradient-to-br from-cyan-400/10 to-transparent shadow-2xl"
                        >
                          <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Market Tracker</p>
                          <div className="flex items-end justify-between">
                            <div>
                              <h4 className="text-3xl font-black">{m.data.price}</h4>
                              <p className="text-xs text-zinc-500">{m.data.label} / USD</p>
                            </div>
                            <span className="text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded-full">{m.data.change}</span>
                          </div>
                        </motion.div>
                      )}

                      {m.type === 'palette' && m.data && (
                        <motion.div 
                          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                          className="flex gap-2 p-2 glass-morphism rounded-2xl shadow-lg"
                        >
                          {m.data.colors.map((c: string, i: number) => (
                            <div key={`${m.id}-color-${i}`} className="group relative">
                              <div className="w-12 h-12 rounded-xl border border-white/10 cursor-pointer shadow-inner" style={{ backgroundColor: c }} />
                              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-[8px] p-1 rounded transition-opacity whitespace-nowrap z-20">{c}</div>
                            </div>
                          ))}
                        </motion.div>
                      )}

                      {m.type === 'chart' && m.data && (
                        <motion.div className="w-full h-64 glass-morphism p-6 rounded-[2rem] border border-white/5 shadow-2xl">
                           <p className="text-xs font-bold text-zinc-500 mb-6 uppercase tracking-widest">{m.data.title}</p>
                           <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={m.data.items}>
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px', fontSize: '10px' }}
                                />
                                <Bar dataKey="value" fill="url(#gradient)" radius={[10, 10, 10, 10]} />
                                <defs>
                                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00f2ff" />
                                    <stop offset="100%" stopColor="#bc13fe" />
                                  </linearGradient>
                                </defs>
                              </BarChart>
                           </ResponsiveContainer>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="p-6 bg-black/40 backdrop-blur-xl border-t border-white/5">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={isDragOver ? "SOLTE O ARQUIVO AQUI" : "Envie um comando ou arraste uma imagem..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl py-5 px-8 focus:outline-none focus:border-cyan-400 transition-all text-sm font-medium pr-32 backdrop-blur-md"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-3">
                    <button className="p-2 text-zinc-500 hover:text-white transition-colors cursor-trigger">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </button>
                    <button 
                      onClick={() => handleSend()} 
                      className="px-6 py-2.5 bg-cyan-400 text-black rounded-xl font-bold hover:scale-105 active:scale-95 transition-all text-xs tracking-tighter shadow-lg shadow-cyan-400/20"
                    >
                      SINTETIZAR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Side Control */}
          <div className="hidden lg:flex flex-col gap-6">
            <div className="glass-morphism rounded-[2rem] p-6 border border-white/5 flex-1 shadow-2xl">
               <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">Estado do Sistema</h5>
               <div className="space-y-6">
                 <div>
                   <div className="flex justify-between text-[10px] mb-2">
                     <span className="text-zinc-400">LATÊNCIA NEURAL</span>
                     <span className="text-cyan-400 font-mono">14ms</span>
                   </div>
                   <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                     <motion.div animate={{ width: ['20%', '25%', '22%'] }} transition={{ repeat: Infinity, duration: 2 }} className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(0,242,255,0.8)]" />
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between text-[10px] mb-2">
                     <span className="text-zinc-400">MEMÓRIA DE CONTEXTO</span>
                     <span className="text-purple-400 font-mono">82%</span>
                   </div>
                   <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                     <div className="h-full bg-purple-400 w-[82%] shadow-[0_0_8px_rgba(188,19,254,0.8)]" />
                   </div>
                 </div>
               </div>
            </div>
            <div className="glass-morphism rounded-[2rem] p-6 border border-white/5 h-48 flex flex-col justify-center items-center text-center shadow-2xl">
               <div className="w-12 h-12 rounded-full border-2 border-cyan-400 flex items-center justify-center mb-4 relative">
                 <div className="w-8 h-8 rounded-full bg-cyan-400/20 animate-ping absolute" />
                 <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f2ff]" />
               </div>
               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Gemini 3 Flash</p>
               <p className="text-xs text-white font-mono mt-1 italic opacity-80">Vibe Active</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
