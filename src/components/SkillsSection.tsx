import React from 'react';
import { motion } from 'motion/react';
import { Code2, Server, Wrench } from 'lucide-react';
import { useCardTilt } from '../utils/useCardTilt';

interface ToolGroup {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  items: string[];
  accentColor: string;
}

const TOOL_GROUPS: ToolGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    description: 'Modern, component-driven user interfaces and responsive web applications.',
    icon: Code2,
    items: [
      'React.js',
      'Next.js',
      'JavaScript (ES6+)',
      'TypeScript',
      'HTML5',
      'CSS3',
      'Tailwind CSS',
    ],
    accentColor: '#FFA800',
  },
  {
    id: 'backend',
    title: 'Backend, Database & Auth',
    description: 'Server architectures, RESTful API design, MongoDB data persistence, and secure session authentication.',
    icon: Server,
    items: [
      'Node.js',
      'Express.js',
      'RESTful API design',
      'MongoDB',
      'Session-based authentication (email and password)',
    ],
    accentColor: '#FFA800',
  },
  {
    id: 'tools',
    title: 'Tools',
    description: 'Engineering workflows, developer environments, and version control tooling.',
    icon: Wrench,
    items: ['Git', 'GitHub', 'VS Code'],
    accentColor: '#FFA800',
  },
];

const SkillCard: React.FC<{ group: ToolGroup; index: number }> = ({ group, index }) => {
  const { style: tiltStyle, bind: tiltBind } = useCardTilt(3.5, 9);
  const Icon = group.icon;

  return (
    <motion.div
      {...tiltBind}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -5,
        borderColor: 'rgba(255, 168, 0, 0.45)',
        transition: { duration: 0.2 },
      }}
      style={tiltStyle}
      className="p-6 md:p-8 rounded-2xl bg-[#0c0e14] border border-slate-800/90 flex flex-col justify-between transition-colors duration-300 relative overflow-hidden group shadow-lg shadow-black/20 will-change-transform cursor-pointer select-none"
    >
      {/* Top ambient hairline accent on hover */}
      <div
        className="absolute top-0 inset-x-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to right, transparent, ${group.accentColor}, transparent)`,
        }}
      />

      <div>
        <div className="mb-4">
          <div
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center transition-colors group-hover:border-slate-700"
            style={{ color: group.accentColor }}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
          {group.title}
        </h3>
        <p className="mt-2 text-xs text-slate-300 font-normal leading-relaxed">
          {group.description}
        </p>
      </div>

      {/* Technologies Pill Badges */}
      <div className="mt-6 pt-5 border-t border-slate-800/80">
        <div className="flex flex-wrap gap-2">
          {group.items.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-900/90 text-slate-200 border border-slate-800 group-hover:border-slate-700 hover:border-amber-400/50 hover:-translate-y-0.5 transition-all duration-200 cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="py-[var(--section-spacing-y)] px-6 md:px-12 max-w-7xl mx-auto border-t border-slate-900/80">
      {/* Section Header with gentle scroll reveal (once only) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12"
      >
        <div className="text-xs font-mono text-[#FFA800] uppercase tracking-widest mb-2">
          TECHNICAL STACK
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          Engineering Toolset
        </h2>
      </motion.div>

      {/* Grouped Toolset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TOOL_GROUPS.map((group, index) => (
          <SkillCard key={group.id} group={group} index={index} />
        ))}
      </div>
    </section>
  );
};
