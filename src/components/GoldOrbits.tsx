import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface GoldOrbitsProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

export const GoldOrbits: React.FC<GoldOrbitsProps> = ({ containerRef }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isInView, setIsInView] = useState(true);

  // Responsive & reduced-motion detection
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

  // Track section visibility to pause token motion when off-screen
  useEffect(() => {
    const target = containerRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [containerRef]);

  // Motion scroll hook: lines draw themselves as section enters view
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'end 25%'],
  });

  // Path length draws from 0 to 1 with scroll
  const pathLengthDraw = useTransform(scrollYProgress, [0, 0.65], [0, 1]);

  // Subtle rotation with scroll (perspective spin)
  const orbitScrollRotate = useTransform(scrollYProgress, [0, 1], [-8, 12]);

  const path1 = 'M 80 310 a 520 210 0 1 0 1040 0 a 520 210 0 1 0 -1040 0';
  const path2 = 'M 140 310 a 460 175 0 1 0 920 0 a 460 175 0 1 0 -920 0';

  const isStatic = prefersReducedMotion;

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_82%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_82%)]"
      aria-hidden="true"
    >
      <motion.div
        style={{
          rotate: isStatic ? 0 : orbitScrollRotate,
          transformPerspective: 1000,
          transformStyle: 'preserve-3d',
        }}
        className="w-[1200px] h-[620px] max-w-none shrink-0 relative pointer-events-none opacity-60"
      >
        <svg
          viewBox="0 0 1200 620"
          className="w-full h-full overflow-visible pointer-events-none"
          fill="none"
        >
          <defs>
            {/* Primary Orbit Metallic Gold Gradient */}
            <linearGradient id="orbit-gold-grad-1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F5A800" stopOpacity="0.15" />
              <stop offset="25%" stopColor="#FFE27D" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#F5A800" stopOpacity="0.95" />
              <stop offset="80%" stopColor="#D97706" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#F5A800" stopOpacity="0.15" />
            </linearGradient>

            {/* Secondary Orbit Metallic Gold Gradient */}
            <linearGradient id="orbit-gold-grad-2" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F5A800" stopOpacity="0.15" />
              <stop offset="30%" stopColor="#FFE58F" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.85" />
              <stop offset="85%" stopColor="#B45309" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#F5A800" stopOpacity="0.15" />
            </linearGradient>

            {/* Soft Glow Filter for Orbit Halo */}
            <filter id="orbit-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Token Gold Drop Shadow */}
            <filter id="orbit-token-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#F5A800" floodOpacity="0.85" />
            </filter>

            {/* Minted Gold Coin Radial Gradient */}
            <radialGradient id="orbit-coin-grad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FFF2B2" />
              <stop offset="65%" stopColor="#F5A800" />
              <stop offset="90%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>

            {/* Glossy 3D Gold Sphere Gradient */}
            <radialGradient id="orbit-sphere-grad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#FFE27D" />
              <stop offset="65%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#92400e" />
            </radialGradient>
          </defs>

          {/* ============================================================ */}
          {/* ORBIT 1: Primary Ellipse (-12deg tilt in perspective)       */}
          {/* ============================================================ */}
          <g transform="rotate(-12 600 310)">
            {/* Soft Ambient Halo Line */}
            <path
              d={path1}
              stroke="#F5A800"
              strokeWidth="4"
              strokeOpacity="0.18"
              filter="url(#orbit-soft-glow)"
              className="pointer-events-none"
            />

            {/* Sharp Core Orbit Line with Scroll Self-Drawing */}
            <motion.path
              d={path1}
              stroke="url(#orbit-gold-grad-1)"
              strokeWidth="1.2"
              strokeLinecap="round"
              style={{
                pathLength: isStatic ? 1 : pathLengthDraw,
              }}
              className="pointer-events-none"
            />

            {/* Orbit 1 Token: Minted Gold Coin travelling along the path */}
            {!isStatic && isInView && (
              <g className="pointer-events-none">
                <animateMotion
                  path={path1}
                  dur="24s"
                  repeatCount="indefinite"
                  rotate="auto"
                />
                {/* 3D Coin Body */}
                <circle
                  r="7"
                  fill="url(#orbit-coin-grad)"
                  stroke="#FFE27D"
                  strokeWidth="0.8"
                  filter="url(#orbit-token-glow)"
                />
                {/* Inner Concentric Rim */}
                <circle
                  r="4"
                  fill="none"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="0.6"
                />
              </g>
            )}
          </g>

          {/* ============================================================ */}
          {/* ORBIT 2: Secondary Counter-Tilted Ellipse (+16deg)          */}
          {/* (Hidden on mobile for simpler single-orbit experience)       */}
          {/* ============================================================ */}
          {!isMobile && (
            <g transform="rotate(16 600 310)">
              {/* Soft Ambient Halo Line */}
              <path
                d={path2}
                stroke="#F5A800"
                strokeWidth="3.5"
                strokeOpacity="0.16"
                filter="url(#orbit-soft-glow)"
                className="pointer-events-none"
              />

              {/* Sharp Core Orbit Line with Scroll Self-Drawing */}
              <motion.path
                d={path2}
                stroke="url(#orbit-gold-grad-2)"
                strokeWidth="1.1"
                strokeLinecap="round"
                style={{
                  pathLength: isStatic ? 1 : pathLengthDraw,
                }}
                className="pointer-events-none"
              />

              {/* Orbit 2 Token: Glossy 3D Gold Sphere */}
              {!isStatic && isInView && (
                <g className="pointer-events-none">
                  <animateMotion
                    path={path2}
                    dur="18s"
                    repeatCount="indefinite"
                    rotate="auto"
                  />
                  <circle
                    r="5"
                    fill="url(#orbit-sphere-grad)"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="0.5"
                    filter="url(#orbit-token-glow)"
                  />
                </g>
              )}
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
};
