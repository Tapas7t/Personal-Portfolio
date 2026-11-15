import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import type { Variants } from 'motion/react';
import { Code2, Server, Wrench } from 'lucide-react';
import GlassCard from './GlassCard';
import { TechTile } from './TechTile';

interface ToolGroup {
  id: string;
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  items: string[];
  accentColor: string;
}

const TOOL_GROUPS: ToolGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend',
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
    accentColor: '#38BDF8',
  },
  {
    id: 'backend',
    title: 'Backend, Database & Auth',
    icon: Server,
    items: [
      'Node.js',
      'Express.js',
      'RESTful API design',
      'MongoDB',
      'Session-based authentication (email and password)',
    ],
    accentColor: '#38BDF8',
  },
  {
    id: 'tools',
    title: 'Tools',
    icon: Wrench,
    items: ['Git', 'GitHub', 'VS Code'],
    accentColor: '#38BDF8',
  },
];

const SkillCard: React.FC<{
  group: ToolGroup;
  index: number;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  animationState: 'hidden' | 'visible';
}> = ({ group, index, isMobile, prefersReducedMotion, animationState }) => {
  const Icon = group.icon;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isCleanedUp, setIsCleanedUp] = useState(false);

  const isMiddle = index === 1;
  const isFrontend = index === 0;

  const easeCurve = [0.22, 1, 0.36, 1] as const;

  // Middle card (Backend, Database & Auth): from opacity 0, y 50, scale 0.95 to full, duration 1.0s, delay 0
  const middleVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
      x: 0,
      rotateY: 0,
      transition: { duration: 0 },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      x: 0,
      rotateY: 0,
      transition: {
        duration: 1.0,
        delay: 0,
        ease: easeCurve,
      },
    },
  };

  // Frontend card: from opacity 0, x -160, rotateY 20deg to full, duration 1.3s, delay 0.4s
  const frontendVariants: Variants = {
    hidden: {
      opacity: 0,
      x: -160,
      rotateY: 20,
      y: 0,
      scale: 1,
      transition: { duration: 0 },
    },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.3,
        delay: 0.4,
        ease: easeCurve,
      },
    },
  };

  // Tools card: from opacity 0, x 160, rotateY -20deg to full, duration 1.3s, delay 0.4s
  const toolsVariants: Variants = {
    hidden: {
      opacity: 0,
      x: 160,
      rotateY: -20,
      y: 0,
      scale: 1,
      transition: { duration: 0 },
    },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.3,
        delay: 0.4,
        ease: easeCurve,
      },
    },
  };

  // Mobile (under 768px): y 30 only, duration 0.9s, 0.2s stagger
  const mobileVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
      x: 0,
      rotateY: 0,
      scale: 1,
      transition: { duration: 0 },
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      rotateY: 0,
      scale: 1,
      transition: {
        duration: 0.9,
        delay: index * 0.2,
        ease: easeCurve,
      },
    },
  };

  // With prefers-reduced-motion: a simple fade, 0.4s
  const reducedMotionVariants: Variants = {
    hidden: {
      opacity: 0,
      x: 0,
      y: 0,
      rotateY: 0,
      scale: 1,
      transition: { duration: 0 },
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      rotateY: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  const variants: Variants = prefersReducedMotion
    ? reducedMotionVariants
    : isMobile
    ? mobileVariants
    : isMiddle
    ? middleVariants
    : isFrontend
    ? frontendVariants
    : toolsVariants;

  // Silently reset styles when transitioning to hidden so Motion can apply start state without residue
  useEffect(() => {
    if (animationState === 'hidden') {
      setIsCleanedUp(false);
      if (wrapperRef.current) {
        wrapperRef.current.style.transform = '';
        wrapperRef.current.style.willChange = '';
      }
    }
  }, [animationState]);

  // After the entrance completes, remove will-change and leftover transforms from the wrappers
  const handleAnimationComplete = (definition: any) => {
    if (animationState === 'visible' && (definition === 'visible' || !definition)) {
      setIsCleanedUp(true);
      if (wrapperRef.current) {
        wrapperRef.current.style.transform = 'none';
        wrapperRef.current.style.willChange = 'auto';
      }
    }
  };

  // Z-order: middle card sits on top (z-20) while side cards move in from behind/around it (z-10)
  const zClass = isMiddle ? 'z-20' : 'z-10';

  return (
    <motion.div
      ref={wrapperRef}
      initial="hidden"
      animate={animationState}
      variants={variants}
      onAnimationComplete={handleAnimationComplete}
      style={isCleanedUp ? { transform: 'none', willChange: 'auto' } : undefined}
      className={`flex relative h-full ${zClass}`}
    >
      <GlassCard className="p-6 md:p-8 flex flex-col w-full h-full cursor-pointer select-none">
        {/* Card Content */}
        <div>
          <div className="mb-4">
            <div
              className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center transition-colors shadow-md"
              style={{ color: group.accentColor }}
            >
              <Icon className="w-5 h-5" />
            </div>
          </div>

          <h3 data-depth="1" className="text-xl font-medium text-[var(--text)] tracking-[-0.02em]">
            {group.title}
          </h3>
        </div>

        {/* Technologies Tiles with Real Logos */}
        <div data-depth="1" className="mt-6 pt-5 border-t border-slate-800/80 flex-1 flex flex-col justify-start">
          <div className={group.id === 'tools' ? 'grid grid-cols-1 gap-2.5' : 'flex flex-wrap gap-2'}>
            {group.items.map((tech) => (
              <TechTile
                key={tech}
                name={tech}
                className={group.id === 'tools' ? 'w-full py-2.5 px-4' : ''}
              />
            ))}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export const SkillsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Driven by ONE observer on the Skills section:
  // - Entering: when at least 25% of the Skills section is in view
  // - Leaving: when section completely leaves viewport (0% in view), silently reset with duration 0
  const isEnterInView = useInView(sectionRef, { amount: 0.25 });
  const isAnyInView = useInView(sectionRef, { amount: 0 });

  const [animationState, setAnimationState] = useState<'hidden' | 'visible'>('hidden');

  useEffect(() => {
    if (isEnterInView) {
      setAnimationState('visible');
    } else if (!isAnyInView) {
      setAnimationState('hidden');
    }
  }, [isEnterInView, isAnyInView]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const onMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', onMotionChange);
    window.addEventListener('resize', checkMobile);

    return () => {
      motionQuery.removeEventListener('change', onMotionChange);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      style={{ overflowX: 'clip', perspective: 1200 }}
      className="py-[var(--section-spacing-y)] px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 w-full max-w-[1720px] mx-auto border-t border-slate-900/80 scroll-mt-24 overflow-x-clip [perspective:1200px]"
    >
      {/* Section Header with gentle scroll reveal (once only) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12"
      >
        <div className="text-[0.75rem] uppercase font-medium tracking-[0.12em] text-[var(--gold)] mb-2">
          TECHNICAL STACK
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-[var(--text)] tracking-[-0.03em] leading-[1.1]">
          Engineering Toolset
        </h2>
      </motion.div>

      {/* Grouped Toolset Grid with 3D perspective for child cards */}
      <div
        style={{
          perspective: 1200,
          transformStyle: 'preserve-3d',
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 relative [perspective:1200px] [transform-style:preserve-3d]"
      >
        {TOOL_GROUPS.map((group, index) => (
          <SkillCard
            key={group.id}
            group={group}
            index={index}
            isMobile={isMobile}
            prefersReducedMotion={prefersReducedMotion}
            animationState={animationState}
          />
        ))}
      </div>
    </section>
  );
};
