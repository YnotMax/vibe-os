
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVibeStore } from '../store/vibeStore';

export const ArtifactsPanel = () => {
  const { steps, isThinking } = useVibeStore();

  if (!isThinking && steps.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed top-24 right-8 w-72 z-40 hidden xl:block"
    >
      <div className="glass-morphism rounded-3xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase">Artifacts / Thought</h4>
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {steps.map((step, idx) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm border ${
                  step.status === 'complete' 
                    ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400' 
                    : step.status === 'processing'
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-400 animate-pulse'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                }`}>
                  {step.status === 'complete' ? '✓' : step.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-bold ${step.status === 'complete' ? 'text-white' : 'text-zinc-500'}`}>
                    {step.label}
                  </p>
                  <div className="h-[2px] w-full bg-zinc-800 mt-2 overflow-hidden rounded-full">
                    {step.status === 'processing' && (
                      <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="h-full w-1/2 bg-cyan-400"
                      />
                    )}
                    {step.status === 'complete' && <div className="h-full w-full bg-cyan-400" />}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-[10px] text-zinc-600 font-mono leading-relaxed">
            AGENT_LOOP_V4.2 <br />
            STATUS: {isThinking ? 'SYNTHESIZING...' : 'IDLE'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
