
import React, { useEffect } from 'react';
import { Hero } from './components/Hero';
import { ScrollyTelling } from './components/ScrollyTelling';
import { ChatInterface } from './components/ChatInterface';
import { AgentSwarm } from './components/AgentSwarm';
import { BentoGrid } from './components/BentoGrid';
import { Cursor } from './components/Cursor';
import { ArtifactsPanel } from './components/ArtifactsPanel';
import { useVibeStore } from './store/vibeStore';

const App: React.FC = () => {
  const { theme } = useVibeStore();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    console.log("VIBE_OS v3.1 Engine Online");
  }, []);

  // Theme mapping
  const themeStyles = {
    'obsidian': 'bg-[#050505] text-white',
    'trust-blue': 'bg-[#000d1a] text-blue-50',
    'cyberpunk-neon': 'bg-[#0a0510] text-fuchsia-50',
    'glass-white': 'bg-[#f0f0f0] text-black',
  };

  return (
    <div className={`relative min-h-screen transition-colors duration-[2000ms] ease-in-out ${themeStyles[theme]} selection:bg-cyan-400 selection:text-black`}>
      <Cursor />
      <ArtifactsPanel />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-8 py-8 flex justify-between items-center mix-blend-difference">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-white rotate-45" />
          <div className="text-2xl font-black tracking-tighter uppercase italic">VIBE_OS</div>
        </div>
        <div className="flex gap-10 text-[10px] uppercase font-bold tracking-[0.4em] opacity-40 hover:opacity-100 transition-all duration-500">
          <a href="#" className="hover:text-cyan-400 hover:tracking-[0.6em]">Fluxo</a>
          <a href="#" className="hover:text-cyan-400 hover:tracking-[0.6em]">Architect</a>
          <a href="#" className="hover:text-cyan-400 hover:tracking-[0.6em]">Terminal</a>
        </div>
      </nav>

      <main className="relative">
        {/* Visual theme overlay gradient */}
        <div className={`fixed inset-0 pointer-events-none z-[-1] transition-opacity duration-[2000ms] ${
          theme === 'obsidian' ? 'opacity-100' : 'opacity-40'
        }`} style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0, 242, 255, 0.05) 0%, transparent 70%)' }} />

        <Hero />
        <div id="architect">
          <ChatInterface />
        </div>
        <ScrollyTelling />
        <AgentSwarm />
        <BentoGrid />
      </main>

      <footer className="py-32 px-4 border-t border-white/5 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-8xl font-black tracking-tighter gradient-text mb-12 italic opacity-20">VIBE_OS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-[10px] uppercase font-bold tracking-widest text-zinc-600">
            <div className="space-y-2">
              <p className="text-zinc-400">Local</p>
              <p>São Paulo, BR</p>
            </div>
            <div className="space-y-2">
              <p className="text-zinc-400">Versão</p>
              <p>3.1.2-Stable</p>
            </div>
            <div className="space-y-2">
              <p className="text-zinc-400">Núcleo</p>
              <p>Gemini 3 Flash</p>
            </div>
            <div className="space-y-2">
              <p className="text-zinc-400">Status</p>
              <p className="text-cyan-400">Sincronizado</p>
            </div>
          </div>
          <p className="mt-20 text-[9px] text-zinc-700 tracking-[0.5em] font-mono">
            PROTOCOL_VIBE_CODING_ENABLED // END_OF_LINE
          </p>
        </div>
        
        {/* Footer Mesh */}
        <div className="absolute bottom-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)', backgroundSize: '100px 100px', transform: 'perspective(500px) rotateX(60deg) scale(2)' }} />
      </footer>
    </div>
  );
};

export default App;
