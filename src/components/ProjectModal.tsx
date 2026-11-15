import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { X, CheckCircle2, Server, Code, Github, ArrowUpRight } from 'lucide-react';
import { ProjectItem, medconsultsConfig } from '../utils/portfolio-logic';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const githubUrl = medconsultsConfig.github.trim() || 'https://github.com/Tapas7t/MedConsults';
  const hasLiveDemo = Boolean(medconsultsConfig.liveDemo.trim());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl my-auto rounded-2xl bg-[#0d1017] border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] will-change-transform"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090b10]">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <span>{project.subtitle}</span>
            {medconsultsConfig.status && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">{medconsultsConfig.status}</span>
              </>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-8 overflow-y-auto">
          {/* Header & Overview */}
          <div>
            <h2 id="modal-project-title" className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              {project.title}
            </h2>
            <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed">
              {project.summary}
            </p>
          </div>

          {/* Architecture & Tech Stack Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
                <Server className="w-4 h-4" />
                <span>Architecture Blueprint</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {project.architecture}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
                <Code className="w-4 h-4" />
                <span>Technologies Applied</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800/80 text-slate-200 border border-slate-700/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Planned Features List */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Key Engineered Capabilities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 text-xs text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-slate-800 bg-[#090b10]">
          <div className="flex items-center gap-3">
            {/* GitHub Button */}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[40px] px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-white transition-all flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5 text-slate-300" />
              <span>{medconsultsConfig.github.trim() ? 'View Repository' : 'GitHub (Profile)'}</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </a>

            {/* Live Demo Button */}
            {hasLiveDemo ? (
              <a
                href={medconsultsConfig.liveDemo.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[40px] px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
              >
                <span>Live Demo</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="min-h-[40px] px-4 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-500 text-xs font-mono cursor-not-allowed select-none opacity-80"
              >
                Live Demo — Coming Soon
              </button>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono uppercase tracking-wider text-slate-200 transition-colors ml-auto"
          >
            Close Overview
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
