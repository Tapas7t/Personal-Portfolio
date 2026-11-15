import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import GlassCard from './GlassCard';
import { GoldOrbits } from './GoldOrbits';

// ============================================================================
// CERTIFICATES DATA CONFIGURATION
// To add a new certificate, simply duplicate an object below with your details:
// ============================================================================
export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  instructor: string;
  date: string;
  length?: string;
  url: string;
}

export const CERTIFICATES_DATA: CertificateItem[] = [
  {
    id: 'python-ml-beginner-to-pro',
    title: 'Python Machine Learning: From Beginner to Pro',
    issuer: 'Udemy',
    instructor: 'Learnify IT',
    date: 'Nov 2025',
    length: '5.5 hours',
    url: 'https://ude.my/UC-e5b552c3-63e8-404d-b4b5-e57251104a96',
  },
  {
    id: 'ai-engineer-explorer',
    title: 'AI Engineer Explorer Certificate Course',
    issuer: 'Udemy',
    instructor: 'School of AI',
    date: 'Jul 2026',
    length: '12.5 hours',
    url: 'https://ude.my/UC-7d9776e6-ce04-4c10-914e-7918bbf8413a',
  },
];

const CertificateCard: React.FC<{ item: CertificateItem; index: number }> = ({ item, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={cardRef}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: shouldReduceMotion ? 0.3 : 0.6,
        delay: 0.12 + index * 0.12,
        ease: shouldReduceMotion ? 'easeOut' : [0.22, 1, 0.36, 1],
      }}
      onAnimationComplete={() => {
        if (cardRef.current) {
          cardRef.current.style.willChange = 'auto';
          cardRef.current.style.transform = 'none';
        }
      }}
      className="flex"
    >
      <GlassCard className="flex flex-col justify-between p-6 sm:p-8 space-y-6 w-full select-none cursor-pointer">
        <div className="space-y-4">
          {/* Date row */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[0.75rem] uppercase tracking-[0.12em] font-medium text-[rgba(245,245,245,0.55)]">
            <span className="bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800 text-[rgba(245,245,245,0.7)]">
              {item.date}
            </span>
          </div>

          {/* Course Title */}
          <div className="space-y-2">
            <h3 data-depth="1" className="text-xl font-medium text-[var(--text)] tracking-[-0.02em] leading-snug">
              {item.title}
            </h3>
            <div className="text-sm text-[rgba(245,245,245,0.7)]">
              <span className="text-[var(--gold)] font-medium">{item.issuer}</span>
              <span className="text-slate-500 mx-2">·</span>
              <span className="text-[var(--muted)]">Instructor: {item.instructor}</span>
            </div>
          </div>
        </div>

        {/* View Certificate Link */}
        <div className="pt-4 border-t border-slate-800/80 mt-auto">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link min-h-[44px] inline-flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.12em] font-medium text-[var(--text)] hover:text-[var(--gold)] transition-colors"
          >
            <span>View Certificate</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover/link:text-[var(--gold)] transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 duration-200 shrink-0" />
          </a>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export const CertificatesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="certificates"
      ref={sectionRef}
      className="py-[var(--section-spacing-y)] px-6 md:px-12 max-w-7xl mx-auto border-t border-slate-900/80 scroll-mt-24 relative overflow-hidden"
    >
      {/* 3D Perspective Gold Orbits & Tokens (behind cards) */}
      <GoldOrbits containerRef={sectionRef} />

      {/* Centered Editorial Section Header matching reference */}
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
        className="mb-12 sm:mb-16 text-center relative z-10"
      >
        <div className="text-[0.75rem] uppercase font-medium tracking-[0.12em] text-[var(--gold)] mb-2.5">
          CERTIFICATIONS
        </div>
        <h2 className="font-serif-accent italic text-3xl sm:text-4xl md:text-5xl font-normal tracking-[-0.03em] inline-block select-none leading-[1.1]">
          <span className="bg-gradient-to-b from-amber-50 via-amber-200 to-amber-300 bg-clip-text text-transparent">
            Certi
          </span>
          <span className="bg-gradient-to-b from-amber-300 via-amber-400 to-[var(--gold)] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(245,168,0,0.45)]">
            ficates
          </span>
        </h2>
      </motion.div>

      {/* Responsive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch relative z-10">
        {CERTIFICATES_DATA.map((item, index) => (
          <CertificateCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
};
