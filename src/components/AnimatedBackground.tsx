import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const AnimatedBackground: React.FC = () => {
  // Pointer-responsive subtle ambient glow (fades in on pointer movement, fades out when pointer leaves)
  const pointerX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
  const pointerY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 400);
  const pointerOpacity = useMotionValue(0);

  const springPointerX = useSpring(pointerX, { stiffness: 50, damping: 25, mass: 0.5 });
  const springPointerY = useSpring(pointerY, { stiffness: 50, damping: 25, mass: 0.5 });
  const springPointerOpacity = useSpring(pointerOpacity, { stiffness: 80, damping: 22 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePointerMove = (e: MouseEvent) => {
      pointerX.set(e.clientX);
      pointerY.set(e.clientY);
      pointerOpacity.set(1);
    };

    const handleMouseLeave = () => {
      pointerOpacity.set(0);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [pointerX, pointerY, pointerOpacity]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#030712] transform-gpu">
      {/* Film Grain Texture Layer */}
      <div className="absolute inset-0 bg-grain z-20 pointer-events-none opacity-35" />

      {/* Atmospheric Luminous Blue Nebulas (matching the reference glass blue aesthetic) */}
      <div className="absolute -top-[10%] -right-[5%] w-[85vw] max-w-[1000px] h-[85vh] max-h-[900px] rounded-full bg-[radial-gradient(circle_at_65%_40%,rgba(37,99,235,0.36)_0%,rgba(14,165,233,0.18)_38%,transparent_72%)] blur-[80px] pointer-events-none z-0" />
      <div className="absolute top-[45%] -left-[10%] w-[70vw] max-w-[800px] h-[70vh] max-h-[750px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(29,78,216,0.22)_0%,rgba(6,182,212,0.10)_45%,transparent_75%)] blur-[90px] pointer-events-none z-0" />

      {/* Pointer-Responsive Ambient Light Layer */}
      <motion.div
        style={{
          x: springPointerX,
          y: springPointerY,
          opacity: springPointerOpacity,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="absolute top-0 left-0 w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.08)_0%,rgba(30,58,138,0.04)_45%,transparent_70%)] blur-[80px] pointer-events-none z-10 will-change-transform hidden md:block"
      />

      {/* Subtle Gentle Breathing Azure Core Light */}
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.75, 1, 0.75],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[900px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.12)_0%,rgba(30,58,138,0.06)_50%,transparent_75%)] blur-[70px] pointer-events-none z-0"
      />

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(3,7,18,0.85)_100%)] z-10 pointer-events-none" />
    </div>
  );
};
