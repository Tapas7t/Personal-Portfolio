import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Mail, MapPin, Github, Linkedin, ArrowUpRight, Download, ArrowUp } from 'lucide-react';
import GlassCard from './GlassCard';
import { scrollToTarget } from '../utils/smoothScroll';

export const ContactSection: React.FC = () => {
  const emailAddress = 'contactattapas@gmail.com';
  const currentYear = new Date().getFullYear();

  const headerRef = useRef<HTMLDivElement>(null);
  const emailCardRef = useRef<HTMLDivElement>(null);
  const locationTileRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const scrollToTop = () => {
    scrollToTarget(0, { offset: 0, duration: 0.9 });
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  return (
    <section
      id="connect"
      className="py-[var(--section-spacing-y)] px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 w-full max-w-[1720px] mx-auto border-t border-slate-900/80 scroll-mt-24"
    >
      <div className="w-full">
        {/* Header with gentle scroll reveal */}
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
          className="space-y-4"
        >
          <div className="text-[0.75rem] uppercase font-medium tracking-[0.12em] text-[var(--gold)]">
            CONTACT
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-[var(--text)] tracking-[-0.03em] leading-[1.1]">
            Let's Build Something <span className="bg-gradient-to-r from-sky-400 via-[#38BDF8] to-blue-500 bg-clip-text text-transparent">Together</span>
          </h2>
          <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-[rgba(245,245,245,0.7)] font-normal">
            Have an interesting idea, a project opportunity, or want to connect? I'm always open to conversations with developers, technology enthusiasts, and people building meaningful products.
          </p>
        </motion.div>

        {/* Tidy Contact Block Grid (Desktop: 2 columns, Mobile: neat stack) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-10 items-stretch">
          {/* Left Column: Email Card & Download Resume */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            {/* Primary Clickable Email Card */}
            <motion.div
              ref={emailCardRef}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: shouldReduceMotion ? 0.3 : 0.6,
                delay: 0.12,
                ease: shouldReduceMotion ? 'easeOut' : [0.22, 1, 0.36, 1],
              }}
              onAnimationComplete={() => {
                if (emailCardRef.current) {
                  emailCardRef.current.style.willChange = 'auto';
                  emailCardRef.current.style.transform = 'none';
                }
              }}
              className="flex-1"
            >
              <GlassCard className="p-6 sm:p-8 flex flex-col justify-between h-full select-none">
                <div className="space-y-4">
                  <div className="text-[0.75rem] uppercase tracking-[0.12em] font-medium text-[rgba(245,245,245,0.55)] flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[var(--gold)] shrink-0" />
                    <span>Direct Email</span>
                  </div>

                  <div>
                    <a
                      href={`mailto:${emailAddress}`}
                      data-depth="1"
                      className="group inline-flex items-center gap-2 text-base sm:text-lg md:text-xl font-medium text-[var(--gold)] hover:text-[var(--gold-soft)] transition-colors whitespace-nowrap min-h-[44px] py-1 select-text"
                      title="Send email to Tapas Karmakar"
                    >
                      <span>{emailAddress}</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-200 shrink-0" />
                    </a>
                    <p className="text-xs text-[rgba(245,245,245,0.55)] mt-1">
                      Click to compose in your preferred email client
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800/80 mt-6" id="resume">
                  <a
                    href="/Tapas_Karmakar_Resume.pdf"
                    download="Tapas_Karmakar_Resume.pdf"
                    className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[var(--gold)] hover:bg-[var(--gold-soft)] text-slate-950 text-[0.75rem] uppercase tracking-[0.12em] font-medium transition-all inline-flex items-center justify-center gap-2 shadow-sm shrink-0 w-full sm:w-auto group"
                  >
                    <Download className="w-4 h-4 text-slate-950 transition-transform group-hover:translate-y-0.5 duration-200 shrink-0" />
                    <span>Download Resume</span>
                  </a>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Right Column: Location & Social Icon Links */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Location Tile */}
            <motion.div
              ref={locationTileRef}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: shouldReduceMotion ? 0.3 : 0.6,
                delay: 0.24,
                ease: shouldReduceMotion ? 'easeOut' : [0.22, 1, 0.36, 1],
              }}
              onAnimationComplete={() => {
                if (locationTileRef.current) {
                  locationTileRef.current.style.willChange = 'auto';
                  locationTileRef.current.style.transform = 'none';
                }
              }}
              className="flex-1"
            >
              <div className="p-6 rounded-2xl bg-[#080a10]/80 border border-slate-800/80 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.6)] h-full flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-[0.75rem] uppercase tracking-[0.12em] font-medium text-[rgba(245,245,245,0.55)] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                    <span>Base Location</span>
                  </div>
                  <div className="text-base text-[var(--text)] font-medium">
                    Mumbai, Maharashtra, India
                  </div>
                  <div className="text-xs text-[var(--muted)]">
                    IST · UTC+5:30
                  </div>
                </div>

                {/* Social Icon Links */}
                <div className="pt-4 border-t border-slate-800/80">
                  <div className="text-[0.75rem] uppercase tracking-[0.12em] font-medium text-[rgba(245,245,245,0.55)] mb-3">
                    Profiles
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href="https://github.com/Tapas7t"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group min-h-[44px] px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-[0.75rem] uppercase tracking-[0.12em] font-medium text-[var(--text)] hover:text-[var(--gold)] transition-all inline-flex items-center gap-2"
                      title="GitHub Profile"
                    >
                      <Github className="w-4 h-4 text-slate-300 group-hover:text-[var(--gold)] transition-colors shrink-0" />
                      <span>GitHub</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[var(--gold)] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                    </a>

                    <a
                      href="https://www.linkedin.com/in/tapas-karmakar-276a37438"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group min-h-[44px] px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-[0.75rem] uppercase tracking-[0.12em] font-medium text-[var(--text)] hover:text-[var(--gold)] transition-all inline-flex items-center gap-2"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4 text-slate-300 group-hover:text-[var(--gold)] transition-colors shrink-0" />
                      <span>LinkedIn</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[var(--gold)] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[0.75rem] uppercase tracking-[0.12em] font-medium text-[rgba(245,245,245,0.55)]">
          <div>
            © {currentYear} Tapas
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="min-h-[44px] px-3 flex items-center gap-1.5 text-[rgba(245,245,245,0.55)] hover:text-[var(--text)] transition-colors cursor-pointer select-none"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
