
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text, PerspectiveCamera, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const FluidSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));

  useFrame((state) => {
    if (!meshRef.current) return;
    const { x, y } = state.mouse;
    mouse.current.lerp(new THREE.Vector2(x, y), 0.1);
    
    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.005;
    
    // Pulse effect
    const time = state.clock.getElapsedTime();
    meshRef.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.05);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 128, 128]} />
      <MeshDistortMaterial
        color="#00f2ff"
        speed={3}
        distort={0.4}
        radius={1}
        emissive="#bc13fe"
        emissiveIntensity={0.5}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  );
};

export const Hero = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 z-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f2ff" />
          <pointLight position={[-10, -10, -10]} intensity={1.5} color="#bc13fe" />
          <FluidSphere />
        </Canvas>
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-xl md:text-2xl font-light tracking-[0.4em] text-cyan-400 mb-4">VIBE CODING CHEGOU</h2>
          <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter leading-tight">
            VIBE_OS<br />
            <span className="gradient-text italic">CONSCIÊNCIA</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            Bem-vindo à era do desenvolvimento imersivo. Onde a intenção se torna arquitetura e o código respira.
          </p>
          
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
            <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
              INICIAR PROTOCOLO
            </button>
            <button className="px-8 py-4 glass-morphism text-white font-bold rounded-full border border-zinc-700 hover:border-cyan-400 transition-colors">
              VER DOCUMENTAÇÃO
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-[1px] h-12 bg-gradient-to-b from-cyan-400 to-transparent"></div>
      </div>
    </section>
  );
};
