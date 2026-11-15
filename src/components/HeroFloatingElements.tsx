import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'motion/react';

interface HeroFloatingElementsProps {
  heroRef?: React.RefObject<HTMLElement | null>;
}

interface DustParticle {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  baseAlpha: number;
  seed: number;
  isLarge: boolean;
}

export const HeroFloatingElements: React.FC<HeroFloatingElementsProps> = ({ heroRef }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isInView, setIsInView] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Mouse parallax motion values (damped spring)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothMouseX = useSpring(mouseX, { stiffness: 45, damping: 25, mass: 0.6 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 45, damping: 25, mass: 0.6 });

  // Responsive and accessibility detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const onMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', onMotionChange);
    window.addEventListener('resize', checkMobile);

    return () => {
      motionQuery.removeEventListener('change', onMotionChange);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Track hero visibility to pause everything when off-screen
  useEffect(() => {
    const target = heroRef?.current || containerRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [heroRef]);

  // Window mousemove tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  // Fine gold dust canvas simulation
  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const isLowEnd =
      typeof navigator !== 'undefined' &&
      navigator.hardwareConcurrency != null &&
      navigator.hardwareConcurrency <= 4;
    const particleCount = isMobile ? 20 : isLowEnd ? 35 : 60;
    const particles: DustParticle[] = [];

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, isLowEnd || isMobile ? 1.5 : 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Initialize particles within current dimensions
      if (particles.length === 0) {
        for (let i = 0; i < particleCount; i++) {
          const isLarge = Math.random() < 0.25;
          particles.push({
            x: Math.random() * rect.width,
            y: Math.random() * rect.height,
            r: isLarge ? 1.5 + Math.random() * 0.9 : 0.6 + Math.random() * 0.8,
            vy: -(0.18 + Math.random() * 0.32),
            vx: (Math.random() - 0.5) * 0.12,
            baseAlpha: 0.2 + Math.random() * 0.45,
            seed: Math.random() * 100,
            isLarge,
          });
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let startTime = performance.now();

    const render = (now: number) => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      const elapsed = (now - startTime) * 0.001;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Drift upward with gentle horizontal oscillation
        p.y += p.vy;
        p.x += p.vx + Math.sin(elapsed * 1.2 + p.seed) * 0.18;

        // Wrap around vertically
        if (p.y < -15) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Gentle breathing pulse
        const alpha = Math.max(
          0.05,
          Math.min(0.85, p.baseAlpha + Math.sin(elapsed * 2 + p.seed) * 0.15)
        );

        if (p.isLarge) {
          // Soft out-of-focus golden bokeh glow for depth of field
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.2);
          grad.addColorStop(0, `rgba(255, 225, 130, ${alpha})`);
          grad.addColorStop(0.45, `rgba(255, 185, 55, ${alpha * 0.6})`);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Sharp distant pinpoint
          ctx.fillStyle = `rgba(255, 205, 80, ${alpha * 0.9})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (isInView) {
        animId = requestAnimationFrame(render);
      }
    };

    if (isInView) {
      animId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isInView, isMobile, prefersReducedMotion]);

  // Parallax transforms for distinct depth tiers
  // Shallow depth (foreground)
  const pxShallow = useTransform(smoothMouseX, [0, 1], [-18, 18]);
  const pyShallow = useTransform(smoothMouseY, [0, 1], [-14, 14]);

  // Medium depth
  const pxMid = useTransform(smoothMouseX, [0, 1], [-10, 10]);
  const pyMid = useTransform(smoothMouseY, [0, 1], [-8, 8]);

  // Deep depth (background tier)
  const pxDeep = useTransform(smoothMouseX, [0, 1], [-5, 5]);
  const pyDeep = useTransform(smoothMouseY, [0, 1], [-4, 4]);

  const isStatic = prefersReducedMotion;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-[3]"
      aria-hidden="true"
    >
      {/* Fine Gold Dust Canvas Layer */}
      {!prefersReducedMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      )}

      {/* Floating 3D Gold Objects */}
      {/* 1. Sparkle Star (Top-Left corner) */}
      <motion.div
        style={{
          left: isMobile ? '4%' : '3%',
          top: isMobile ? '6%' : '9%',
          x: isStatic ? 0 : pxDeep,
          y: isStatic ? 0 : pyDeep,
        }}
        className="absolute z-10 will-change-transform"
      >
        <motion.div
          animate={
            isStatic || !isInView
              ? undefined
              : {
                  scale: [0.85, 1.25, 0.85],
                  opacity: [0.65, 1, 0.65],
                  rotate: [0, 45, 0],
                }
          }
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-5 flex items-center justify-center"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 drop-shadow-[0_0_12px_rgba(255,190,60,0.85)]">
            <defs>
              <radialGradient id="sparkle-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#FFE58F" />
                <stop offset="70%" stopColor="#FFA800" />
                <stop offset="100%" stopColor="#D97706" />
              </radialGradient>
            </defs>
            <path
              d="M 12 0 Q 12 12 0 12 Q 12 12 12 24 Q 12 12 24 12 Q 12 12 12 0 Z"
              fill="url(#sparkle-grad)"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* 2. Frosted Glass Cube 1 (Top-Right on mobile, Top-Center on desktop) */}
      <motion.div
        style={{
          left: isMobile ? undefined : '48%',
          right: isMobile ? '6%' : undefined,
          top: isMobile ? '8%' : '12%',
          x: isStatic ? 0 : pxShallow,
          y: isStatic ? 0 : pyShallow,
        }}
        className="absolute z-10 will-change-transform"
      >
        <motion.div
          animate={
            isStatic || !isInView
              ? undefined
              : {
                  y: [0, -12, 0],
                  rotateZ: [8, -8, 8],
                  rotateY: [-28, -14, -28],
                }
          }
          transition={{ duration: 7.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            transform: 'perspective(600px) rotateX(28deg) rotateY(-24deg) rotateZ(8deg)',
            transformStyle: 'preserve-3d',
          }}
          className={`${
            isMobile ? 'w-8 h-8' : 'w-10 h-10'
          } rounded-lg border border-amber-300/35 bg-gradient-to-br from-white/15 via-amber-300/[0.08] to-transparent backdrop-blur-md shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),0_8px_22px_rgba(0,0,0,0.65),0_0_16px_rgba(255,190,60,0.18)]`}
        >
          <div className="absolute inset-1 rounded-md border-t border-l border-white/35 pointer-events-none" />
        </motion.div>
      </motion.div>

      {/* 3. Gold Coin 1 (Bottom-Left on mobile & desktop) */}
      <motion.div
        style={{
          left: isMobile ? '5%' : '11%',
          bottom: isMobile ? '15%' : '16%',
          x: isStatic ? 0 : pxMid,
          y: isStatic ? 0 : pyMid,
        }}
        className="absolute z-10 will-change-transform"
      >
        <motion.div
          animate={
            isStatic || !isInView
              ? undefined
              : {
                  y: [0, -10, 0],
                  rotateZ: [-18, -8, -18],
                }
          }
          transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            transform: 'perspective(600px) rotateX(42deg) rotateY(16deg) rotateZ(-18deg)',
            transformStyle: 'preserve-3d',
          }}
          className={`${
            isMobile ? 'w-8 h-8' : 'w-9 h-9'
          } rounded-full bg-gradient-to-br from-[#FFF9E6] via-[#F6C358] to-[#78350f] p-[2px] shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9),inset_0_-2px_2.5px_rgba(0,0,0,0.7),0_6px_18px_rgba(0,0,0,0.7),0_0_14px_rgba(255,180,50,0.25)] border border-amber-300/80`}
        >
          <div className="w-full h-full rounded-full border border-amber-200/40 bg-gradient-to-tl from-[#B87A14] via-[#F6C358] to-[#FFF9E6] flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-200/30 border border-white/40" />
          </div>
        </motion.div>
      </motion.div>

      {/* Desktop-Only Additional Objects (Total = 8 on desktop) */}
      {!isMobile && (
        <>
          {/* 4. Metallic Gold Capsule / Pill (Top-Left, above title) */}
          <motion.div
            style={{
              left: '5%',
              top: '16%',
              x: isStatic ? 0 : pxMid,
              y: isStatic ? 0 : pyMid,
            }}
            className="absolute z-10 will-change-transform"
          >
            <motion.div
              animate={
                isStatic || !isInView
                  ? undefined
                  : {
                      y: [0, -14, 0],
                      rotateZ: [14, 22, 14],
                      rotateX: [20, 26, 20],
                    }
              }
              transition={{ duration: 6.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                transform: 'perspective(600px) rotateX(22deg) rotateY(-24deg) rotateZ(16deg)',
                transformStyle: 'preserve-3d',
              }}
              className="w-14 h-7 rounded-full bg-gradient-to-r from-[#FFF7D6] via-[#F6C358] to-[#92400e] shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.85),inset_0_-2px_3px_rgba(0,0,0,0.6),0_8px_24px_rgba(0,0,0,0.7),0_0_16px_rgba(255,180,50,0.3)] border border-amber-200/70"
            >
              <div className="absolute top-1 left-2.5 right-2.5 h-1 rounded-full bg-gradient-to-r from-white/70 via-white/20 to-transparent pointer-events-none" />
            </motion.div>
          </motion.div>

          {/* 5. Coin 2 (Far Left margin, mid-height outside text block) */}
          <motion.div
            style={{
              left: '2%',
              top: '46%',
              x: isStatic ? 0 : pxShallow,
              y: isStatic ? 0 : pyShallow,
            }}
            className="absolute z-10 will-change-transform"
          >
            <motion.div
              animate={
                isStatic || !isInView
                  ? undefined
                  : {
                      y: [0, -11, 0],
                      rotateZ: [-24, -14, -24],
                      rotateY: [12, 22, 12],
                    }
              }
              transition={{ duration: 7.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                transform: 'perspective(600px) rotateX(46deg) rotateY(16deg) rotateZ(-20deg)',
                transformStyle: 'preserve-3d',
              }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFF9E6] via-[#F6C358] to-[#78350f] p-[2px] shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9),inset_0_-2px_2.5px_rgba(0,0,0,0.7),0_6px_18px_rgba(0,0,0,0.7),0_0_14px_rgba(255,180,50,0.25)] border border-amber-300/80"
            >
              <div className="w-full h-full rounded-full border border-amber-200/40 bg-gradient-to-tl from-[#B87A14] via-[#F6C358] to-[#FFF9E6] flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-amber-200/30 border border-white/40" />
              </div>
            </motion.div>
          </motion.div>

          {/* 6. Coin 3 (Bottom edge of photo area, well below face) */}
          <motion.div
            style={{
              right: '24%',
              bottom: '13%',
              x: isStatic ? 0 : pxDeep,
              y: isStatic ? 0 : pyDeep,
            }}
            className="absolute z-10 will-change-transform"
          >
            <motion.div
              animate={
                isStatic || !isInView
                  ? undefined
                  : {
                      y: [0, -8, 0],
                      rotateZ: [10, 20, 10],
                    }
              }
              transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                transform: 'perspective(600px) rotateX(38deg) rotateY(-18deg) rotateZ(14deg)',
                transformStyle: 'preserve-3d',
              }}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFF9E6] via-[#F6C358] to-[#78350f] p-[2px] shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9),inset_0_-2px_2.5px_rgba(0,0,0,0.7),0_6px_18px_rgba(0,0,0,0.7),0_0_14px_rgba(255,180,50,0.25)] border border-amber-300/80"
            >
              <div className="w-full h-full rounded-full border border-amber-200/40 bg-gradient-to-tl from-[#B87A14] via-[#F6C358] to-[#FFF9E6]" />
            </motion.div>
          </motion.div>

          {/* 7. Thin Gold Ring (Top-Right, above photo head) */}
          <motion.div
            style={{
              right: '12%',
              top: '10%',
              x: isStatic ? 0 : pxMid,
              y: isStatic ? 0 : pyMid,
            }}
            className="absolute z-10 will-change-transform"
          >
            <motion.div
              animate={
                isStatic || !isInView
                  ? undefined
                  : {
                      y: [0, -13, 0],
                      rotateZ: [18, 28, 18],
                      rotateX: [50, 58, 50],
                    }
              }
              transition={{ duration: 8.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                transform: 'perspective(600px) rotateX(54deg) rotateY(-26deg) rotateZ(22deg)',
                transformStyle: 'preserve-3d',
              }}
              className="w-12 h-12 flex items-center justify-center"
            >
              <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-[0_6px_16px_rgba(0,0,0,0.8)] drop-shadow-[0_0_12px_rgba(255,190,60,0.35)]">
                <defs>
                  <linearGradient id="gold-ring-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="25%" stopColor="#FFF2B2" />
                    <stop offset="55%" stopColor="#F6C358" />
                    <stop offset="85%" stopColor="#B87A14" />
                    <stop offset="100%" stopColor="#633108" />
                  </linearGradient>
                </defs>
                <circle cx="24" cy="24" r="19" fill="none" stroke="url(#gold-ring-grad)" strokeWidth="3" />
              </svg>
            </motion.div>
          </motion.div>

          {/* 8. Frosted Glass Cube 2 (Far Outer Right Margin, well outside photo face) */}
          <motion.div
            style={{
              right: '3%',
              top: '28%',
              x: isStatic ? 0 : pxDeep,
              y: isStatic ? 0 : pyDeep,
            }}
            className="absolute z-10 will-change-transform"
          >
            <motion.div
              animate={
                isStatic || !isInView
                  ? undefined
                  : {
                      y: [0, -9, 0],
                      rotateZ: [-12, -4, -12],
                    }
              }
              transition={{ duration: 6.9, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                transform: 'perspective(600px) rotateX(32deg) rotateY(36deg) rotateZ(-8deg)',
                transformStyle: 'preserve-3d',
              }}
              className="w-8 h-8 rounded-lg border border-amber-300/35 bg-gradient-to-br from-white/15 via-amber-300/[0.08] to-transparent backdrop-blur-md shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_8px_20px_rgba(0,0,0,0.65),0_0_15px_rgba(255,190,60,0.15)]"
            >
              <div className="absolute inset-1 rounded-md border-t border-l border-white/30 pointer-events-none" />
            </motion.div>
          </motion.div>
        </>
      )}
    </div>
  );
};
