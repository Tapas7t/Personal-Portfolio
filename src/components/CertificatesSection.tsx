import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useCardTilt } from '../utils/useCardTilt';

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
  const { style: tiltStyle, bind: tiltBind } = useCardTilt(3, 8);

  return (
    <motion.div
      {...tiltBind}
      style={tiltStyle}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, borderColor: 'rgba(255, 168, 0, 0.35)', transition: { duration: 0.2 } }}
      className="flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-[#0c0e14] border border-slate-800/80 hover:border-slate-700 space-y-6 shadow-xl transition-colors duration-300 will-change-transform"
    >
      <div className="space-y-4">
        {/* Date row */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
          <span className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
            {item.date}
          </span>
        </div>

        {/* Course Title */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white leading-snug">
            {item.title}
          </h3>
          <div className="text-sm font-mono text-slate-300">
            <span className="text-amber-400 font-semibold">{item.issuer}</span>
            <span className="text-slate-500 mx-2">·</span>
            <span className="text-slate-400">Instructor: {item.instructor}</span>
          </div>
        </div>
      </div>

      {/* View Certificate Link */}
      <div className="pt-4 border-t border-slate-800/80 mt-auto">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group min-h-[44px] inline-flex items-center gap-2 text-xs font-mono font-medium text-slate-200 hover:text-amber-400 transition-colors"
        >
          <span>View Certificate</span>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-200 shrink-0" />
        </a>
      </div>
    </motion.div>
  );
};

export const CertificatesSection: React.FC = () => {
  return (
    <section
      id="certificates"
      className="py-[var(--section-spacing-y)] px-6 md:px-12 max-w-7xl mx-auto border-t border-slate-900/80"
    >
      {/* Short Section Header without extra paragraphs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12"
      >
        <div className="text-xs font-mono text-[#FFA800] uppercase tracking-widest mb-2">
          CERTIFICATIONS
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          Certificates
        </h2>
      </motion.div>

      {/* Responsive Cards Grid: 1 col on mobile, 2 cols on tablet & desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
        {CERTIFICATES_DATA.map((item, index) => (
          <CertificateCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
};
