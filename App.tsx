
import React, { useEffect } from 'react';
import { Hero } from './components/Hero';
import { ScrollyTelling } from './components/ScrollyTelling';
import { ArchitectMode } from './components/ArchitectMode';
import { AgentSwarm } from './components/AgentSwarm';
import { BentoGrid } from './components/BentoGrid';
import { Cursor } from './components/Cursor';

const App: React.FC = () => {
  useEffect(() => {
    // Smooth scrolling using native CSS (as Lenis would need a full lib import)
    // We simulate luxury scrolling behavior via CSS scroll-behavior: smooth and frame management.
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Title animation logic or other global inits
    console.log("VIBE_OS v3.1 Initialized");
  }, []);

  return (
    <div className="relative bg-[#050505] text-white selection:bg-cyan-400 selection:text-black">
      <Cursor />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-8 py-6 flex justify-between items-center mix-blend-difference">
        <div className="text-2xl font-black tracking-tighter">VIBE_OS</div>
        <div className="flex gap-8 text-[10px] uppercase font-bold tracking-[0.3em] opacity-60 hover:opacity-100 transition-opacity">
          <a href="#" className="hover:text-cyan-400">Início</a>
          <a href="#" className="hover:text-cyan-400">Scrolly</a>
          <a href="#" className="hover:text-cyan-400">IA Architect</a>
          <a href="#" className="hover:text-cyan-400">Enxame</a>
        </div>
      </nav>

      <main>
        <Hero />
        <ScrollyTelling />
        <ArchitectMode />
        <AgentSwarm />
        <BentoGrid />
      </main>

      <footer className="py-20 px-4 border-t border-zinc-900 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-6xl font-black tracking-tighter gradient-text mb-8 italic">SINTA A VIBE.</h2>
          <div className="flex justify-center gap-12 text-zinc-600 text-xs uppercase font-bold tracking-widest">
            <p>© 2026 VIBE_OS LABS</p>
            <p>CONSTRUÍDO COM GEMINI 3</p>
            <p>SÃO PAULO // BRASIL</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
