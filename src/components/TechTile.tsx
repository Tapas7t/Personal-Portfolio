import React from 'react';
import {
  SiReact,
  SiNextdotjs,
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiMongoose,
  SiGit,
  SiGithub,
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import { Network, ShieldCheck, Code2 } from 'lucide-react';

export interface TechMeta {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

export const TECH_MAP: Record<string, TechMeta> = {
  'React.js': { icon: SiReact, color: '#61DAFB' },
  'React': { icon: SiReact, color: '#61DAFB' },
  'Next.js': { icon: SiNextdotjs, color: '#FFFFFF' },
  'JavaScript (ES6+)': { icon: SiJavascript, color: '#F7DF1E' },
  'TypeScript': { icon: SiTypescript, color: '#3178C6' },
  'HTML5': { icon: SiHtml5, color: '#E34F26' },
  'CSS3': { icon: SiCss, color: '#1572B6' },
  'Tailwind CSS': { icon: SiTailwindcss, color: '#06B6D4' },
  'Node.js': { icon: SiNodedotjs, color: '#5FA04E' },
  'Express.js': { icon: SiExpress, color: '#E5E7EB' },
  'RESTful API design': { icon: Network, color: '#F59E0B' },
  'MongoDB': { icon: SiMongodb, color: '#47A248' },
  'Session-based authentication (email and password)': { icon: ShieldCheck, color: '#10B981' },
  'Mongoose': { icon: SiMongoose, color: '#E22B2B' },
  'Git': { icon: SiGit, color: '#F05032' },
  'GitHub': { icon: SiGithub, color: '#F1F5F9' },
  'VS Code': { icon: VscVscode, color: '#007ACC' },
};

export const TechTile: React.FC<{ name: string; className?: string }> = ({ name, className = '' }) => {
  const meta = TECH_MAP[name];
  const Icon = meta ? meta.icon : Code2;
  const color = meta ? meta.color : '#F5A800';

  return (
    <div
      className={`group/tile inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#07090e]/85 border border-slate-800/90 shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.6)] hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-none transition-all duration-200 select-none max-w-full ${className}`}
    >
      <Icon
        className="w-3.5 h-3.5 shrink-0 transition-all duration-200 opacity-65 group-hover/tile:opacity-100 group-hover/tile:scale-110"
        style={{ color }}
      />
      <span className="text-xs font-medium text-[rgba(245,245,245,0.8)] group-hover/tile:text-white transition-colors duration-200 leading-normal break-words">
        {name}
      </span>
    </div>
  );
};
