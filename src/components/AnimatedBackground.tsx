import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const AnimatedBackground: React.FC = () => {
  // Pointer-responsive subtle ambient glow
  const pointerX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
  const pointerY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 400);

  const springPointerX = useSpring(pointerX, { stiffness: 50, damping: 25, mass: 0.5 });
  const springPointerY = useSpring(pointerY, { stiffness: 50, damping: 25, mass: 0.5 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePointerMove = (e: MouseEvent) => {
      pointerX.set(e.clientX);
      pointerY.set(e.clientY);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('mousemove', handlePointerMove);
  }, [pointerX, pointerY]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#06070a] transform-gpu">
      {/* Film Grain Texture Layer */}
      <div className="absolute inset-0 bg-grain z-20 pointer-events-none opacity-30" />

      {/* Pointer-Responsive Ambient Light Layer */}
      <motion.div
        style={{
          x: springPointerX,
          y: springPointerY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="absolute top-0 left-0 w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(255,168,0,0.035)_0%,rgba(15,23,42,0.06)_45%,transparent_70%)] blur-[90px] pointer-events-none z-10 will-change-transform hidden md:block"
      />

      {/* Subtle Warm Amber Core Ambient Light with gentle breathing motion */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[900px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,168,0,0.03)_0%,rgba(15,23,42,0.06)_50%,transparent_75%)] pointer-events-none"
      />

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(6,7,10,0.85)_100%)] z-10 pointer-events-none" />
    </div>
  );
};
