
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AGENTS = [
  { id: '1', name: 'ORQUESTRADOR', role: 'Planner', color: '#00f2ff', pos: { x: 50, y: 50 } },
  { id: '2', name: 'ARQUITETO', role: 'Coder', color: '#bc13fe', pos: { x: 20, y: 80 } },
  { id: '3', name: 'ANALISTA', role: 'Reviewer', color: '#ffea00', pos: { x: 80, y: 80 } },
  { id: '4', name: 'DADOS', role: 'Context', color: '#00ff41', pos: { x: 50, y: 20 } },
];

const Packet = ({ from, to }: { from: any, to: any }) => {
  return (
    <motion.div
      initial={{ x: `${from.x}%`, y: `${from.y}%`, opacity: 0, scale: 0.5 }}
      animate={{ x: `${to.x}%`, y: `${to.y}%`, opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="absolute w-2 h-2 rounded-full blur-[2px] z-10"
      style={{ backgroundColor: from.color }}
    />
  );
};

export const AgentSwarm = () => {
  const [activeAgent, setActiveAgent] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const logMessages = [
        "Iniciando análise heurística...",
        "Tokenização concluída (45ms)",
        "Gerando pesos sinápticos...",
        "Validando esquema JSON...",
        "Injetando contexto de usuário...",
        "Ajustando gradiente de descida...",
      ];
      setLogs(prev => [logMessages[Math.floor(Math.random() * logMessages.length)], ...prev.slice(0, 10)]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-black h-[800px] flex flex-col items-center">
      <div className="max-w-4xl text-center mb-16 px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">ENXAME DE AGENTES</h2>
        <p className="text-zinc-500">Fluxo autônomo e colaborativo em tempo real</p>
      </div>

      <div className="relative w-full max-w-4xl h-full border border-zinc-900 rounded-[3rem] bg-[#050505] overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Connections/Packets */}
        <Packet from={AGENTS[0].pos} to={AGENTS[1].pos} />
        <Packet from={AGENTS[0].pos} to={AGENTS[2].pos} />
        <Packet from={AGENTS[3].pos} to={AGENTS[0].pos} />
        <Packet from={AGENTS[1].pos} to={AGENTS[2].pos} />
        <Packet from={AGENTS[2].pos} to={AGENTS[1].pos} />

        {/* Network Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="white" strokeWidth="1" />
          <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="white" strokeWidth="1" />
          <line x1="50%" y1="50%" x2="50%" y2="20%" stroke="white" strokeWidth="1" />
          <line x1="20%" y1="80%" x2="80%" y2="80%" stroke="white" strokeWidth="1" />
        </svg>

        {/* Agents */}
        {AGENTS.map((agent) => (
          <motion.div
            key={agent.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
            style={{ left: `${agent.pos.x}%`, top: `${agent.pos.y}%` }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setActiveAgent(agent)}
          >
            <div className="relative">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center border-2 shadow-2xl transition-all duration-300"
                style={{ 
                  borderColor: agent.color, 
                  backgroundColor: `${agent.color}22`,
                  boxShadow: `0 0 20px ${agent.color}44` 
                }}
              >
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: agent.color }} />
              </div>
              <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">{agent.role}</p>
                <p className="text-sm font-bold">{agent.name}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Terminal Overlay */}
        <AnimatePresence>
          {activeAgent && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="absolute top-10 right-10 bottom-10 w-80 glass-morphism rounded-3xl border border-zinc-800 z-50 p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h5 className="font-bold text-cyan-400">LOGS: {activeAgent.name}</h5>
                <button onClick={() => setActiveAgent(null)} className="text-zinc-500 hover:text-white">✕</button>
              </div>
              <div className="flex-1 font-mono text-[10px] text-zinc-400 space-y-2 overflow-hidden">
                {logs.map((log, i) => (
                  <p key={i} className={i === 0 ? "text-cyan-300" : ""}>
                    <span className="text-zinc-600">[{new Date().toLocaleTimeString()}]</span> {log}
                  </p>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-500">Status: <span className="text-green-500 uppercase font-bold">Operacional</span></p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
