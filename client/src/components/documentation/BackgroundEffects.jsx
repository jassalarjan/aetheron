import React from 'react';
import { motion } from 'framer-motion';

const BackgroundEffects = () => {
  return (
    <>
      {/* Grid background */}
      <div className="fixed inset-0 bg-grid opacity-10 pointer-events-none z-0" />
      
      {/* Gradient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full filter blur-3xl opacity-50 animate-pulse-slow"
          style={{ animationDelay: '0s' }}
        />
        <div 
          className="absolute top-1/4 -left-40 w-96 h-96 bg-accent-500/10 rounded-full filter blur-3xl opacity-50 animate-pulse-slow"
          style={{ animationDelay: '2s' }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full filter blur-3xl opacity-50 animate-pulse-slow"
          style={{ animationDelay: '4s' }}
        />
      </div>
      
      {/* Small floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <ParticleGroup />
      </div>
    </>
  );
};

// Helper component to create multiple particles
const ParticleGroup = () => {
  // Generate random particles
  const particles = Array.from({ length: 20 }).map((_, index) => {
    const size = Math.random() * 4 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 10;
    
    return (
      <motion.div
        key={index}
        className="absolute rounded-full bg-primary-400/20"
        style={{
          width: size,
          height: size,
          left: `${x}%`,
          top: `${y}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.8, 0.2],
        }}
        transition={{
          duration,
          repeat: Infinity,
          delay,
          ease: "easeInOut",
        }}
      />
    );
  });

  return <>{particles}</>;
};

export default BackgroundEffects;