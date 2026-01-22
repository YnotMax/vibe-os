
import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface BentoCardProps {
  // Added key to props to resolve assignment error in map function
  key?: React.Key;
  id: string;
  title: string;
  desc: string;
  icon: string;
  className?: string;
  index: number;
}

const BentoCard = ({ title, desc, icon, className, index }: BentoCardProps) => {
  const { scrollYProgress } = useScroll();
  
  // Transform values for tilt based on scroll
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, index % 2 === 0 ? 15 : -15]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, index % 2 === 0 ? -15 : 15]);
  
  const springX = useSpring(rotateX, { stiffness: 100, damping: 30 });
  const springY = useSpring(rotateY, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      style={{ rotateX: springX, rotateY: springY, perspective: 1000 }}
      className={`relative group p-8 glass-morphism rounded-[2.5rem] border border-zinc-800 overflow-hidden min-h-[300px] flex flex-col justify-end ${className}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-8 left-8 text-4xl mb-6 transform group-hover:scale-110 transition-transform">{icon}</div>
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-cyan-400 transition-colors">{title}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-[250px]">{desc}</p>
      </div>
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />
    </motion.div>
  );
};

export const BentoGrid = () => {
  const cards = [
    { id: 'neuro-sync', title: "Neuro-Sync 1.0", desc: "Integração direta entre pensamento e estrutura de dados.", icon: "🧠", col: "md:col-span-2" },
    { id: 'latency', title: "Latência Zero", desc: "Processamento distribuído em redes neurais globais.", icon: "⚡", col: "" },
    { id: 'bio-design', title: "Bio-Design", desc: "Interfaces que evoluem organicamente conforme o uso.", icon: "🌱", col: "" },
    { id: 'quantum-sec', title: "Segurança Quântica", desc: "Criptografia baseada em entropia natural.", icon: "🛡️", col: "md:col-span-2" },
  ];

  return (
    <section className="py-24 px-4 bg-[#050505]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold tracking-tighter">ECOSSISTEMA VIBE</h2>
          <p className="text-zinc-500 mt-2 font-light">A infraestrutura que sustenta a consciência digital</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <BentoCard 
              key={card.id} 
              id={card.id}
              title={card.title} 
              desc={card.desc} 
              icon={card.icon} 
              index={i} 
              className={card.col} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};
