
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { generateArchitectResponse } from '../services/geminiService';
import { Message } from '../types';

export const ArchitectMode = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Protocolo de Arquitetura Ativo. Como posso manifestar seu projeto hoje?', type: 'text' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await generateArchitectResponse(input);
    
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.content || 'Dados processados.',
      type: response.type || 'text',
      data: response.data
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  return (
    <section className="py-24 px-4 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">MODO ARQUITETO</h2>
            <p className="text-zinc-500 mt-2">UI Generativa Real-Time via Gemini 3</p>
          </div>
          <div className="flex items-center gap-6 glass-morphism p-4 rounded-2xl border border-zinc-800">
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Temperatura</span>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="accent-cyan-400 bg-zinc-800"
            />
            <span className="text-cyan-400 font-mono text-sm">{temperature.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[700px]">
          {/* Chat Panel */}
          <div className="lg:col-span-2 flex flex-col glass-morphism rounded-3xl overflow-hidden border border-zinc-800">
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
            >
              <AnimatePresence>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] p-4 rounded-2xl relative transition-all duration-300 ${
                        m.role === 'user' 
                          ? 'bg-cyan-600/20 border border-cyan-500/30 text-white' 
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-300'
                      }`}
                      style={{
                        animation: temperature > 0.8 ? `vibrate ${1 - temperature}s infinite` : 'none',
                        filter: `blur(${Math.max(0, (temperature - 0.7) * 2)}px)`
                      }}
                    >
                      <div className="text-sm font-light leading-relaxed whitespace-pre-wrap">
                        {m.content}
                      </div>

                      {m.type === 'chart' && m.data && (
                        <div className="mt-4 bg-black/50 p-4 rounded-xl border border-zinc-800 h-64 w-full">
                           <p className="text-xs font-bold text-zinc-500 mb-2 uppercase">{m.data.title || 'Análise de Dados'}</p>
                           <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={m.data.data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                                <XAxis dataKey="name" stroke="#555" fontSize={10} />
                                <YAxis stroke="#555" fontSize={10} />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                                  itemStyle={{ color: '#00f2ff' }}
                                />
                                <Bar dataKey="value" fill="#00f2ff" radius={[4, 4, 0, 0]} />
                              </BarChart>
                           </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl animate-pulse text-zinc-500 text-xs">
                      Sintetizando interface...
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 border-t border-zinc-800 bg-black/20">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Peça um gráfico de vendas ou pergunte sobre arquitetura..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-full py-4 px-6 focus:outline-none focus:border-cyan-400 transition-colors pr-16 text-sm"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 p-3 bg-cyan-400 text-black rounded-full hover:scale-105 transition-transform"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Side Info */}
          <div className="glass-morphism rounded-3xl p-8 border border-zinc-800 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 mb-4">Dicas de Comando</h4>
              <ul className="space-y-4 text-sm text-zinc-400">
                <li className="flex gap-3 items-start">
                  <span className="text-cyan-400 font-mono">•</span>
                  "Mostre estatísticas de vendas do último trimestre"
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-cyan-400 font-mono">•</span>
                  "Compare a performance de 3 modelos de IA"
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-cyan-400 font-mono">•</span>
                  "Como estruturar um microsserviço escalável?"
                </li>
              </ul>
            </div>
            
            <div className="mt-8 pt-8 border-t border-zinc-800/50">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center text-xl">🤖</div>
                  <div>
                    <p className="font-bold text-sm">VIBE_OS Engine</p>
                    <p className="text-xs text-zinc-500">v3.1 Stable Release</p>
                  </div>
               </div>
               <p className="text-xs text-zinc-500 leading-relaxed italic">
                 "Aumentar a temperatura torna a interface instável mas criativa. Use com cautela."
               </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes vibrate {
          0% { transform: translate(0, 0); }
          25% { transform: translate(1px, -1px); }
          50% { transform: translate(-1px, 1px); }
          75% { transform: translate(1px, 1px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </section>
  );
};
