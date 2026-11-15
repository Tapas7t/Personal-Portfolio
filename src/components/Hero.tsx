import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { HeroTerrain } from './HeroTerrain';
import { HeroFloatingElements } from './HeroFloatingElements';
import { scrollToSection } from '../utils/smoothScroll';

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
      className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-between pt-28 sm:pt-32 pb-10 sm:pb-12 px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 w-full max-w-[1720px] mx-auto overflow-hidden"
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
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[280px] sm:w-[380px] md:w-[480px] lg:w-[560px] xl:w-[640px] 2xl:w-[720px] aspect-[4/5] pointer-events-none z-[1] select-none overflow-hidden [mask-image:radial-gradient(ellipse_at_60%_45%,black_35%,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_at_60%_45%,black_35%,transparent_75%)] will-change-transform"
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

      {/* Layer 3: Dark gradient overlay ensuring optimal contrast for hero text & buttons, smoothly fading to transparent at bottom to blend with subsequent sections */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/92 via-[#030712]/55 to-transparent pointer-events-none z-[2] [mask-image:linear-gradient(to_bottom,black_50%,transparent_95%)] [-webkit-mask-image:linear-gradient(to_bottom,black_50%,transparent_95%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/0 via-transparent to-[#030712]/40 pointer-events-none z-[2] [mask-image:linear-gradient(to_bottom,black_50%,transparent_95%)] [-webkit-mask-image:linear-gradient(to_bottom,black_50%,transparent_95%)]" />

      {/* Layer 3B: Floating Gold Objects & Fine Gold Dust */}
      {!isClone && <HeroFloatingElements heroRef={heroRef} />}

      {/* Layer 4: Main Typography & Statement with Clean, Staggered Entrance & 3D Title Tilt */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="my-auto py-6 sm:py-10 md:py-12 select-none relative z-10 max-w-5xl"
      >
        <div className="space-y-5 sm:space-y-6">
          <div className="space-y-2.5 sm:space-y-3">
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
                style={{ fontFamily: 'var(--font-hero)' }}
                className="text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] font-medium tracking-[-0.035em] text-[var(--text)] leading-[1.08] break-words"
              >
                Full-Stack Developer
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontFamily: 'var(--font-hero)' }}
                className="text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] font-medium tracking-[-0.035em] text-[var(--text)] leading-[1.08] break-words"
              >
                <span>& </span>
                <span
                  style={{ fontFamily: 'var(--font-serif)' }}
                  className="font-serif-accent italic font-normal text-[1.12em] bg-gradient-to-b from-sky-100 via-[#38BDF8] to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(56,189,248,0.55)] inline-block select-none pr-1"
                >
                  AI Enthusiast
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* Sequential entrance of description */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl text-base sm:text-lg leading-relaxed text-[rgba(245,245,245,0.7)] font-normal"
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
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('works');
              }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="min-h-[44px] px-7 py-3 rounded-lg bg-[var(--text)] text-[#030712] font-medium text-[0.75rem] uppercase tracking-[0.12em] hover:bg-slate-200 transition-colors shadow-sm flex items-center justify-center cursor-pointer"
            >
              Explore My Work
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* Layer 4: Editorial Scroll Prompt Indicator */}
      <motion.a
        href="#works"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection('works');
        }}
        aria-label="Scroll to Works"
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden md:flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1.5 absolute bottom-10 right-8 text-[rgba(245,245,245,0.4)] hover:text-white transition-colors cursor-pointer group z-20"
      >
        <span className="text-[0.75rem] font-sans tracking-[0.12em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
          Scroll
        </span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-white/20 to-white/40 group-hover:to-[var(--gold)] transition-colors" />
        <svg
          className="w-3.5 h-3.5 text-[rgba(245,245,245,0.5)] group-hover:text-[var(--gold)] group-hover:translate-y-1 transition-all"
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
