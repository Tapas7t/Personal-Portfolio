import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import GlassCard from './GlassCard';
import { GoldOrbits } from './GoldOrbits';

const ExperienceCard: React.FC<{ timelineScaleY: MotionValue<number> }> = ({ timelineScaleY }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const bullets = [
    'Managed and followed up with prospective customer leads, keeping the sales pipeline active.',
    'Communicated with prospects to understand their needs and recommend suitable training programs.',
    'Scheduled meetings and supported the course enrollment process from inquiry to sign-up.',
    'Maintained lead and customer records and prepared reports for internal teams.',
    'Coordinated with cross-functional teams to support daily business operations.',
  ];

  return (
    <motion.div
      ref={cardRef}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: shouldReduceMotion ? 0.3 : 0.6,
        delay: 0.12,
        ease: shouldReduceMotion ? 'easeOut' : [0.22, 1, 0.36, 1],
      }}
      onAnimationComplete={() => {
        if (cardRef.current) {
          cardRef.current.style.willChange = 'auto';
          cardRef.current.style.transform = 'none';
        }
      }}
      className="flex-1 flex"
    >
      <GlassCard className="flex-1 flex flex-col p-6 md:p-8 space-y-6 select-none cursor-pointer overflow-hidden">
        {/* Integrated vertical timeline hairline accent with scroll draw */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-slate-800 pointer-events-none">
          <motion.div
            style={{ scaleY: timelineScaleY }}
            className="w-full h-full bg-gradient-to-b from-[var(--gold)] to-transparent origin-top will-change-transform"
          />
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[0.75rem] uppercase font-medium tracking-[0.12em] text-[rgba(245,245,245,0.7)] bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800">
              May 2026 – September 2026
            </span>
          </div>

          <div>
            <h3 data-depth="1" className="text-xl font-medium text-[var(--text)] tracking-[-0.02em] leading-snug">
              Business Development Executive – <span className="text-[var(--gold)] font-medium">Diglok Trainer</span>
            </h3>
          </div>

          <ul className="space-y-2.5 text-sm text-[rgba(245,245,245,0.7)] pt-1">
            {bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--gold)] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const EducationCard: React.FC<{ timelineScaleY: MotionValue<number> }> = ({ timelineScaleY }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const coreSubjects = [
    'Data Structures & Algorithms: Practical implementation of linear and non-linear data structures, searching, and sorting algorithms.',
    'Database Management Systems (DBMS): Relational database architecture, ER modeling, SQL querying, and transaction integrity.',
    'Object-Oriented & Web Programming: OOP paradigms in C++ and Core Java, coupled with web technologies (HTML5, CSS3, JavaScript).',
    'Operating Systems & Computer Networks: Process scheduling, memory management, TCP/IP network protocol stack, and socket fundamentals.',
    'Software Engineering & Projects: Software Development Life Cycle (SDLC), agile practices, testing, and capstone software project.',
  ];

  return (
    <motion.div
      ref={cardRef}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: shouldReduceMotion ? 0.3 : 0.6,
        delay: 0.27, // 0.12s + 0.15s stagger
        ease: shouldReduceMotion ? 'easeOut' : [0.22, 1, 0.36, 1],
      }}
      onAnimationComplete={() => {
        if (cardRef.current) {
          cardRef.current.style.willChange = 'auto';
          cardRef.current.style.transform = 'none';
        }
      }}
      className="flex-1 flex"
    >
      <GlassCard className="flex-1 flex flex-col p-6 md:p-8 space-y-6 select-none cursor-pointer overflow-hidden">
        {/* Integrated vertical timeline hairline accent with scroll draw */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-slate-800 pointer-events-none">
          <motion.div
            style={{ scaleY: timelineScaleY }}
            className="w-full h-full bg-gradient-to-b from-[var(--gold)] to-transparent origin-top will-change-transform"
          />
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[0.75rem] uppercase font-medium tracking-[0.12em] text-[rgba(245,245,245,0.7)] bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800">
              2023 – 2026
            </span>
            <span className="text-[0.75rem] uppercase font-medium tracking-[0.12em] text-[var(--gold)] bg-[var(--gold)]/10 px-2.5 py-1 rounded-md border border-[var(--gold)]/30">
              CGPA: 6.95/10
            </span>
          </div>

          <div>
            <h3 data-depth="1" className="text-xl font-medium text-[var(--text)] tracking-[-0.02em] leading-snug">
              Bachelor of Science in Information Technology (B.Sc. IT)
            </h3>
            <div className="text-sm text-[var(--gold)] font-normal mt-0.5">
              University of Mumbai (Vasai College of Science and Technology)
            </div>
          </div>

          <ul className="space-y-2.5 text-sm text-[rgba(245,245,245,0.7)] pt-1">
            {coreSubjects.map((subject, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--gold)] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{subject}</span>
              </li>
            ))}
          </ul>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export const ExperienceEducation: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 85%', 'end 85%'],
  });

  const timelineScaleY = useTransform(scrollYProgress, [0, 1], [0.15, 1]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-[var(--section-spacing-y)] px-6 md:px-12 max-w-7xl mx-auto border-t border-slate-900/80 relative scroll-mt-24 overflow-hidden"
    >
      {/* 3D Perspective Gold Orbits & Tokens (behind cards) */}
      <GoldOrbits containerRef={sectionRef} />

      {/* Section Header with gentle scroll reveal (once only) */}
      <motion.div
        ref={headerRef}
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
        whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: shouldReduceMotion ? 0.3 : 0.6,
          delay: 0,
          ease: shouldReduceMotion ? 'easeOut' : [0.22, 1, 0.36, 1],
        }}
        onAnimationComplete={() => {
          if (headerRef.current) {
            headerRef.current.style.willChange = 'auto';
            headerRef.current.style.transform = 'none';
          }
        }}
        className="mb-12 relative z-10"
      >
        <div className="text-[0.75rem] uppercase font-medium tracking-[0.12em] text-[var(--gold)] mb-2">
          CAREER & ACADEMIA
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-[var(--text)] tracking-[-0.03em] leading-[1.1]">
          Experience & Education
        </h2>
      </motion.div>

      {/* Balanced 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 relative items-stretch z-10">
        <ExperienceCard timelineScaleY={timelineScaleY} />
        <EducationCard timelineScaleY={timelineScaleY} />
      </div>
    </section>
  );
};
