import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { HeroTerrain } from './HeroTerrain';
import { HeroFloatingElements } from './HeroFloatingElements';

interface HeroProps {
  onOpenContact?: () => void;
  isClone?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isClone = false }) => {
  const heroRef = useRef<HTMLElement>(null);
  const [isReducedMotionOrMobile, setIsReducedMotionOrMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkState = () => {
      const isMobile = window.innerWidth < 768;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsReducedMotionOrMobile(isMobile || reduced);
    };
    checkState();
    window.addEventListener('resize', checkState);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', checkState);
    return () => {
      window.removeEventListener('resize', checkState);
      mq.removeEventListener('change', checkState);
    };
  }, []);

  // Scroll parallax for monumental typography and portrait
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.6, 0]);
  const portraitScrollY = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const portraitScrollOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.5, 0]);

  // Subtle pointer parallax on portrait (desktop only, damped physics, moves only ~4px)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const smoothMouseX = useSpring(mouseX, { stiffness: 70, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 70, damping: 20 });

  const portraitParallaxX = useTransform(smoothMouseX, [0, 1], [-4, 4]);

  // Light perspective tilt for hero title
  const titleRotateX = useTransform(smoothMouseY, [0, 1], [3, -3]);
  const titleRotateY = useTransform(smoothMouseX, [0, 1], [-4, 4]);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current || isClone) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(Math.max(0, Math.min(1, x)));
    mouseY.set(Math.max(0, Math.min(1, y)));
  };

  return (
    <section
      id={isClone ? undefined : 'hero'}
      ref={isClone ? undefined : heroRef}
      onMouseMove={isClone ? undefined : handleHeroMouseMove}
      className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-between pt-32 pb-12 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Layer 1: Dark Matte Tiled Block Terrain (faint gold rim light, ambient drift & parallax) */}
      {!isClone && <HeroTerrain heroRef={heroRef} />}

      {/* Layer 2: Atmospheric Portrait Anchor with Subtle Scale Drift & Mouse Parallax (moves only ~4px) */}
      <motion.div
        style={{
          y: portraitScrollY,
          opacity: portraitScrollOpacity,
          x: isReducedMotionOrMobile ? 0 : portraitParallaxX,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[280px] sm:w-[380px] md:w-[480px] lg:w-[540px] aspect-[4/5] pointer-events-none z-[1] select-none overflow-hidden [mask-image:radial-gradient(ellipse_at_60%_45%,black_35%,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_at_60%_45%,black_35%,transparent_75%)] will-change-transform"
      >
        <motion.img
          src="/assets/portrait.png"
          alt="Tapas — Full-Stack Developer & AI Enthusiast"
          animate={{
            scale: [1, 1.025, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-full h-full object-cover object-top filter grayscale contrast-[1.14] brightness-[0.92] blur-[2.5px] will-change-transform"
        />
      </motion.div>

      {/* Layer 3: Dark gradient overlay ensuring optimal contrast for hero text & buttons */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#06070a]/90 via-[#06070a]/50 to-transparent pointer-events-none z-[2]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-transparent to-[#06070a]/40 pointer-events-none z-[2]" />

      {/* Layer 3B: Floating Gold Objects & Fine Gold Dust */}
      {!isClone && <HeroFloatingElements heroRef={heroRef} />}

      {/* Layer 4: Top Editorial Status with gentle initial fade-in */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap items-center text-xs font-mono uppercase tracking-widest text-slate-400 pt-2 z-10 break-words"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
          <span>STATUS · AVAILABLE FOR ROLES · MUMBAI, INDIA</span>
        </div>
      </motion.div>

      {/* Layer 4: Main Typography & Statement with Clean, Staggered Entrance & 3D Title Tilt */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="my-auto py-8 md:py-16 select-none relative z-10 max-w-5xl"
      >
        <div className="space-y-6">
          <div className="space-y-3">
            {/* Professional Category Label */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FFA800]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFA800]" />
              <span>FULL-STACK DEVELOPER · AI ENTHUSIAST</span>
            </motion.div>

            {/* Clean Staggered Headings Hierarchy with 3D Perspective Tilt */}
            <motion.div
              style={{
                rotateX: isReducedMotionOrMobile ? 0 : titleRotateX,
                rotateY: isReducedMotionOrMobile ? 0 : titleRotateY,
                transformPerspective: 800,
                transformStyle: 'preserve-3d',
              }}
              className="space-y-1 sm:space-y-2 will-change-transform"
            >
              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] break-words"
              >
                Full-Stack Developer
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] break-words"
              >
                <span>& </span>
                <span className="text-[#FFA800]">AI Enthusiast</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Sequential entrance of description */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl text-base sm:text-lg text-slate-300 font-normal leading-relaxed"
          >
            Building modern web applications and practical AI solutions.
          </motion.p>

          {/* Interactive CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="pt-2 flex flex-wrap items-center gap-4"
          >
            <motion.a
              href="#works"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="min-h-[44px] px-7 py-3 rounded-lg bg-white text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition-colors shadow-sm flex items-center justify-center cursor-pointer"
            >
              Explore My Work
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* Layer 4: Hero Footnotes / Technologies */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
        className="pt-8 border-t border-slate-800/80 text-xs font-mono text-slate-400 z-10"
      >
        <div className="space-y-1">
          <div className="text-slate-400 uppercase tracking-widest font-semibold">
            ENGINEERING & WEB TECHNOLOGIES
          </div>
          <div className="text-slate-200 break-words">
            HTML · CSS · JavaScript · React · Node.js · Express.js · MongoDB · Git · GitHub
          </div>
        </div>
      </motion.div>

      {/* Layer 4: Editorial Scroll Prompt Indicator */}
      <motion.a
        href="#works"
        aria-label="Scroll to Works"
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden md:flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1.5 absolute bottom-10 right-8 text-slate-500 hover:text-white transition-colors cursor-pointer group z-20"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
          Scroll
        </span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-slate-600 to-slate-400 group-hover:to-[#FFA800] transition-colors" />
        <svg
          className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FFA800] group-hover:translate-y-1 transition-all"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.a>
    </section>
  );
};
