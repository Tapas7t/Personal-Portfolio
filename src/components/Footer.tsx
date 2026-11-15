import React from 'react';
import { motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-900 bg-[#050608] py-8 text-xs font-mono text-slate-400">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Minimal Tapas with copyright year */}
        <div className="text-slate-400">
          © {currentYear} Tapas
        </div>

        {/* Right: Scroll to top */}
        <div className="flex items-center">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="min-h-[44px] px-3 flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};
