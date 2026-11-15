import React from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Github, Linkedin, ArrowUpRight, FileText, Download } from 'lucide-react';
import { useCardTilt } from '../utils/useCardTilt';

export const ContactSection: React.FC = () => {
  const { style: emailTiltStyle, bind: emailTiltBind } = useCardTilt(3, 8);
  const { style: resumeTiltStyle, bind: resumeTiltBind } = useCardTilt(3, 8);
  const emailAddress = 'contactattapas@gmail.com';
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}`;

  return (
    <section id="connect" className="py-[var(--section-spacing-y)] px-6 md:px-12 max-w-7xl mx-auto border-t border-slate-900/80">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header with gentle scroll reveal (once only) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 text-center md:text-left"
        >
          <div className="text-xs font-mono text-[#FFA800] uppercase tracking-widest">
            CONTACT
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Let's Build Something Together
          </h2>
          <p className="max-w-2xl text-sm sm:text-base text-slate-300 font-normal leading-relaxed mx-auto md:mx-0">
            Have an interesting idea, a project opportunity, or want to connect? I'm always open to conversations with developers, technology enthusiasts, and people building meaningful products.
          </p>
        </motion.div>

        {/* Primary Clickable Email Card */}
        <motion.div
          {...emailTiltBind}
          style={emailTiltStyle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -3, borderColor: 'rgba(255, 168, 0, 0.4)', transition: { duration: 0.2 } }}
          className="p-6 sm:p-8 rounded-2xl bg-[#0c0e14] border border-slate-800 transition-colors duration-300 shadow-xl will-change-transform"
        >
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Direct Email</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <a
                href={gmailComposeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm sm:text-lg md:text-xl font-mono font-bold text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap min-h-[44px] py-1 select-text"
                title="Compose in Gmail (opens new tab)"
              >
                <span>{emailAddress}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-200 shrink-0" />
              </a>

              <div className="text-[11px] sm:text-xs font-mono text-slate-400 flex items-center gap-1.5 flex-wrap">
                <span>Opens in Gmail.</span>
                <span>Or use</span>
                <a
                  href={`mailto:${emailAddress}`}
                  className="text-slate-300 hover:text-amber-400 underline underline-offset-2 transition-colors min-h-[32px] inline-flex items-center"
                  title="Open in default mail client (Apple Mail, Outlook, etc.)"
                >
                  default mail app (mailto)
                </a>
              </div>
            </div>

            <span className="text-xs font-mono text-slate-400 hidden lg:block shrink-0">
              Click to compose in Gmail
            </span>
          </div>
        </motion.div>

        {/* Minimal Resume Download Block */}
        <motion.div
          id="resume"
          {...resumeTiltBind}
          style={resumeTiltStyle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -3, borderColor: 'rgba(255, 168, 0, 0.4)', transition: { duration: 0.2 } }}
          className="p-6 sm:p-7 rounded-2xl bg-[#0c0e14] border border-slate-800 shadow-xl transition-colors duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-5 will-change-transform"
        >
          <div className="space-y-1">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Resume</span>
            </div>
            <p className="text-sm text-slate-300 font-normal">
              Download my resume (PDF)
            </p>
          </div>

          <a
            href="/Tapas_Karmakar_Resume.pdf"
            download="Tapas_Karmakar_Resume.pdf"
            className="group min-h-[44px] px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2 shadow-sm shrink-0 w-full sm:w-auto"
          >
            <Download className="w-4 h-4 text-slate-950 transition-transform group-hover:translate-y-0.5 duration-200 shrink-0" />
            <span>Download Resume</span>
          </a>
        </motion.div>

        {/* Location & Social Profiles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono"
        >
          <div className="p-5 rounded-xl bg-[#0c0e14] border border-slate-800 space-y-1.5">
            <div className="text-slate-400 uppercase flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Base Location</span>
            </div>
            <div className="text-slate-200 font-medium">Mumbai, Maharashtra</div>
            <div className="text-slate-400">India (IST · UTC+5:30)</div>
          </div>

          <div className="p-5 rounded-xl bg-[#0c0e14] border border-slate-800 space-y-1.5">
            <div className="text-slate-400 uppercase flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Social / Network</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-0.5">
              <a
                href="https://github.com/Tapas7t"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center text-slate-200 hover:text-amber-400 gap-1.5 transition-colors group"
              >
                <span>GitHub</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-amber-400 transition-colors shrink-0" />
              </a>

              <a
                href="https://www.linkedin.com/in/tapas-karmakar-276a37438"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center text-slate-200 hover:text-amber-400 gap-1.5 transition-colors group"
              >
                <Linkedin className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-amber-400 transition-colors shrink-0" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
