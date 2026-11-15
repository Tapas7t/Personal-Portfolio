import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Github, CheckCircle2 } from 'lucide-react';
import { ProjectItem, PROJECTS_DATA, medconsultsConfig } from '../utils/portfolio-logic';
import GlassCard from './GlassCard';
import { TechTile } from './TechTile';

interface WorksSectionProps {
  onSelectProject?: (project: ProjectItem) => void;
  isClone?: boolean;
}

export const WorksSection: React.FC<WorksSectionProps> = ({
  onSelectProject,
  isClone = false,
}) => {
  const project = PROJECTS_DATA[0];
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const githubUrl = medconsultsConfig.github.trim() || 'https://github.com/Tapas7t/MedConsults';
  const hasLiveDemo = Boolean(medconsultsConfig.liveDemo.trim());
  const isDevelopment = Boolean(medconsultsConfig.status && medconsultsConfig.status.trim());

  return (
    <section id={isClone ? undefined : 'works'} className="py-[var(--section-spacing-y)] px-6 md:px-12 max-w-7xl mx-auto border-t border-slate-900/80 scroll-mt-24">
      {/* Header with gentle scroll reveal (once only) */}
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
        className="mb-12"
      >
        <div className="text-xs font-mono text-[#FFA800] uppercase tracking-widest mb-2">
          FEATURED PROJECT
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          Selected Work
        </h2>
      </motion.div>

      {/* Featured Project Card */}
      <div className="max-w-4xl">
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
        >
          <GlassCard className="p-6 sm:p-8 md:p-10 select-none space-y-6">
            {/* Card Header Row */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span className="text-xs font-mono text-amber-400 font-medium tracking-wide">
                  {project.subtitle}
                </span>

                {isDevelopment && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-[11px] font-mono text-amber-300 font-semibold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>{medconsultsConfig.status}</span>
                  </span>
                )}
              </div>

              <h3 data-depth="1" className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {project.title}
              </h3>

              <p className="mt-3 text-sm md:text-base text-slate-300 leading-relaxed font-normal">
                {project.summary}
              </p>
            </div>

            {/* Key Engineered Capabilities (Highlights) */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Key Highlights & Architecture
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies Tiles with Real Logos */}
            <div data-depth="1" className="pt-4 border-t border-slate-800/80 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Technologies
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {project.technologies.map((t) => (
                  <TechTile key={t} name={t} />
                ))}
              </div>
            </div>

            {/* Action Links & Status Controls */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4">
              {/* GitHub Button */}
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/50 text-xs font-mono font-medium text-white transition-all flex items-center justify-center gap-2 group/btn"
                title={medconsultsConfig.github.trim() ? 'Open GitHub Repository' : 'Open Developer GitHub Profile'}
              >
                <Github className="w-4 h-4 text-slate-300 group-hover/btn:text-amber-400 transition-colors" />
                <span>{medconsultsConfig.github.trim() ? 'View Repository' : 'GitHub (Profile)'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-amber-400 group-hover/btn:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>

              {/* Live Demo Button (Active vs Disabled Coming Soon) */}
              {hasLiveDemo ? (
                <a
                  href={medconsultsConfig.liveDemo.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Live Demo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="min-h-[44px] px-5 py-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-500 text-xs font-mono font-medium tracking-wide flex items-center justify-center gap-2 cursor-not-allowed select-none opacity-80"
                  title="Live deployment is currently in development"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  <span>Live Demo — Coming Soon</span>
                </button>
              )}

              {onSelectProject && (
                <button
                  type="button"
                  onClick={() => onSelectProject(project)}
                  className="min-h-[44px] px-4 py-2.5 text-xs font-mono text-slate-400 hover:text-amber-400 transition-colors ml-auto hidden sm:inline-flex items-center gap-1"
                >
                  <span>System Overview</span>
                  <span>→</span>
                </button>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};
