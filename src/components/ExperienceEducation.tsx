import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { Briefcase, GraduationCap, CheckCircle2 } from 'lucide-react';
import { useCardTilt } from '../utils/useCardTilt';

const ExperienceCard: React.FC<{ timelineScaleY: MotionValue<number> }> = ({ timelineScaleY }) => {
  const { style: tiltStyle, bind: tiltBind } = useCardTilt(3, 8);

  const bullets = [
    'Managed and followed up with prospective customer leads, keeping the sales pipeline active.',
    'Communicated with prospects to understand their needs and recommend suitable training programs.',
    'Scheduled meetings and supported the course enrollment process from inquiry to sign-up.',
    'Maintained lead and customer records and prepared reports for internal teams.',
    'Coordinated with cross-functional teams to support daily business operations.',
  ];

  return (
    <motion.div
      {...tiltBind}
      initial={{ opacity: 0, y: 25, x: -8 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, borderColor: 'rgba(255, 168, 0, 0.35)', transition: { duration: 0.2 } }}
      style={tiltStyle}
      className="flex-1 flex flex-col p-6 md:p-8 rounded-2xl bg-[#0c0e14] border border-slate-800/80 space-y-6 relative overflow-hidden shadow-xl transition-colors duration-300 will-change-transform cursor-pointer select-none"
    >
      {/* Integrated vertical timeline hairline accent with scroll draw */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-slate-800">
        <motion.div
          style={{ scaleY: timelineScaleY }}
          className="w-full h-full bg-gradient-to-b from-[#FFA800] to-transparent origin-top will-change-transform"
        />
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
            May 2026 – September 2026
          </span>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white leading-snug">
            Business Development Executive – <span className="text-amber-400 font-semibold">Diglok Trainer</span>
          </h3>
        </div>

        <ul className="space-y-2.5 text-xs text-slate-300 pt-1">
          {bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const EducationCard: React.FC<{ timelineScaleY: MotionValue<number> }> = ({ timelineScaleY }) => {
  const { style: tiltStyle, bind: tiltBind } = useCardTilt(3, 8);

  const coreSubjects = [
    'Data Structures & Algorithms: Practical implementation of linear and non-linear data structures, searching, and sorting algorithms.',
    'Database Management Systems (DBMS): Relational database architecture, ER modeling, SQL querying, and transaction integrity.',
    'Object-Oriented & Web Programming: OOP paradigms in C++ and Core Java, coupled with web technologies (HTML5, CSS3, JavaScript).',
    'Operating Systems & Computer Networks: Process scheduling, memory management, TCP/IP network protocol stack, and socket fundamentals.',
    'Software Engineering & Projects: Software Development Life Cycle (SDLC), agile practices, testing, and capstone software project.',
  ];

  return (
    <motion.div
      {...tiltBind}
      initial={{ opacity: 0, y: 25, x: 8 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, borderColor: 'rgba(255, 168, 0, 0.35)', transition: { duration: 0.2 } }}
      style={tiltStyle}
      className="flex-1 flex flex-col p-6 md:p-8 rounded-2xl bg-[#0c0e14] border border-slate-800/80 space-y-6 relative overflow-hidden shadow-xl transition-colors duration-300 will-change-transform cursor-pointer select-none"
    >
      {/* Integrated vertical timeline hairline accent with scroll draw */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-slate-800">
        <motion.div
          style={{ scaleY: timelineScaleY }}
          className="w-full h-full bg-gradient-to-b from-[#FFA800] to-transparent origin-top will-change-transform"
        />
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
            2023 – 2026
          </span>
          <span className="text-xs font-mono text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/30">
            CGPA: 6.95/10
          </span>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white leading-snug">
            Bachelor of Science in Information Technology (B.Sc. IT)
          </h3>
          <div className="text-sm text-amber-400 font-medium mt-0.5">
            University of Mumbai (Vasai College of Science and Technology)
          </div>
        </div>

        <ul className="space-y-2.5 text-xs text-slate-300 pt-1">
          {coreSubjects.map((subject, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{subject}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export const ExperienceEducation: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 85%', 'end 85%'],
  });

  const timelineScaleY = useTransform(scrollYProgress, [0, 1], [0.15, 1]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-[var(--section-spacing-y)] px-6 md:px-12 max-w-7xl mx-auto border-t border-slate-900/80 relative"
    >
      {/* Section Header with gentle scroll reveal (once only) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12"
      >
        <div className="text-xs font-mono text-[#FFA800] uppercase tracking-widest mb-2">
          CAREER & ACADEMIA
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          Experience & Education
        </h2>
      </motion.div>

      {/* Balanced 2-Column Grid eliminating empty space */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 relative items-stretch">
        {/* Left: Professional Experience */}
        <div className="flex flex-col space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 pb-3 border-b border-slate-800"
          >
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span>Professional Experience</span>
          </motion.div>

          <ExperienceCard timelineScaleY={timelineScaleY} />
        </div>

        {/* Right: Education */}
        <div className="flex flex-col space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 pb-3 border-b border-slate-800"
          >
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Education</span>
          </motion.div>

          <EducationCard timelineScaleY={timelineScaleY} />
        </div>
      </div>
    </section>
  );
};
