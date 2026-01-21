
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, MeshWobbleMaterial, Float, Environment, ContactShadows } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const MorphingObject = ({ scrollProgress }: { scrollProgress: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Rotation based on scroll
    meshRef.current.rotation.y = scrollProgress * Math.PI * 4;
    meshRef.current.rotation.x = scrollProgress * Math.PI;

    // Morphing Scale/Shape logic (simulated by scale and rotation speed)
    const s = 1 + Math.sin(scrollProgress * Math.PI) * 0.5;
    meshRef.current.scale.set(s, s, s);
  });

  return (
    <mesh ref={meshRef}>
      {scrollProgress < 0.25 ? (
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
      ) : scrollProgress < 0.5 ? (
        <boxGeometry args={[1.5, 1.5, 1.5]} />
      ) : scrollProgress < 0.75 ? (
        <octahedronGeometry args={[1.8]} />
      ) : (
        <planeGeometry args={[3, 2]} />
      )}
      <MeshWobbleMaterial
        color={scrollProgress > 0.75 ? "#fff" : scrollProgress > 0.5 ? "#bc13fe" : "#00f2ff"}
        factor={0.5 - scrollProgress * 0.4}
        speed={2}
        roughness={0}
        metalness={1}
      />
    </mesh>
  );
};

export const ScrollyTelling = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=400%",
        pin: true,
        scrub: true,
        onUpdate: (self) => setProgress(self.progress),
      });

      // Text animations
      const titles = gsap.utils.toArray(".scrolly-text");
      titles.forEach((title: any, i) => {
        gsap.fromTo(title, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, y: 0, 
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `${i * 25}% top`,
              end: `${(i + 1) * 25}% top`,
              scrub: true,
            }
          }
        );
        gsap.to(title, {
          opacity: 0, y: -50,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `${(i + 0.8) * 25}% top`,
            end: `${(i + 1) * 25}% top`,
            scrub: true,
          }
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="h-screen w-full relative overflow-hidden bg-black">
      <div ref={canvasContainerRef} className="absolute inset-0 z-0">
        <Canvas shadowMap>
          <PerspectiveCamera makeDefault position={[0, 0, 6]} />
          <ambientLight intensity={0.2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
          <pointLight position={[-10, -10, -10]} color="#bc13fe" intensity={1} />
          <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <MorphingObject scrollProgress={progress} />
          </Float>
          <Environment preset="city" />
          <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="max-w-4xl w-full px-10 text-center relative h-full flex flex-col justify-center">
          <div className="scrolly-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <h3 className="text-4xl md:text-7xl font-bold tracking-tighter">O PROMPT É A SEMENTE</h3>
            <p className="text-zinc-400 mt-4 text-xl">Tudo começa com uma intenção clara em linguagem natural.</p>
          </div>
          <div className="scrolly-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0">
            <h3 className="text-4xl md:text-7xl font-bold tracking-tighter">ESTRUTURANDO O CAOS</h3>
            <p className="text-zinc-400 mt-4 text-xl">O raciocínio do Gemini 3 converte palavras em lógica pura.</p>
          </div>
          <div className="scrolly-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0">
            <h3 className="text-4xl md:text-7xl font-bold tracking-tighter">CÉLULAS DE CÓDIGO</h3>
            <p className="text-zinc-400 mt-4 text-xl">A interface se auto-organiza em tempo real.</p>
          </div>
          <div className="scrolly-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0">
            <h3 className="text-4xl md:text-7xl font-bold tracking-tighter">O SONHO MANIFESTADO</h3>
            <p className="text-zinc-400 mt-4 text-xl">Aplicação funcional, otimizada e pronta para o futuro.</p>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 h-64 w-[2px] bg-zinc-800 z-20">
        <div 
          className="w-full bg-cyan-400 transition-all duration-100 ease-out" 
          style={{ height: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
};
