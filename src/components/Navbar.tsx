import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { scrollToTarget, stopScroll, startScroll } from '../utils/smoothScroll';

interface NavbarProps {
  onOpenContact: () => void;
}

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, isActive, onClick }) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`relative px-3 py-2 min-h-[44px] flex items-center text-[0.75rem] font-sans uppercase tracking-[0.12em] transition-colors duration-200 whitespace-nowrap shrink-0 group select-none ${
        isActive ? 'text-[var(--text)] font-semibold' : 'text-[rgba(245,245,245,0.55)] hover:text-[var(--text)] font-medium'
      }`}
    >
      <span className="relative z-10 transition-colors duration-200">{label}</span>
      {isActive && (
        <motion.div
          layoutId="active-navbar-indicator"
          className="absolute bottom-1 left-2.5 right-2.5 h-[2px] bg-gradient-to-r from-sky-400 via-[#38BDF8] to-blue-500 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.85)]"
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
    </a>
  );
};

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [pillDimensions, setPillDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Pill container ref for --nav-h tracking and 3D pointer tilt
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect touch and reduced-motion capabilities
    const touchQuery = window.matchMedia('(hover: none), (pointer: coarse)');
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0 || touchQuery.matches);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const motionListener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionListener);

    return () => motionQuery.removeEventListener('change', motionListener);
  }, []);

  // Lock scroll when mobile menu is open, unlock when closed
  useEffect(() => {
    if (mobileMenuOpen) {
      stopScroll();
      document.body.style.overflow = 'hidden';
    } else {
      startScroll();
      document.body.style.overflow = '';
    }
    return () => {
      startScroll();
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile drawer on desktop resize to prevent stuck overflow lock
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Measure pill dimensions and update rect geometry via ResizeObserver
  useEffect(() => {
    const el = pillRef.current;
    if (!el) return;

    const measurePill = () => {
      if (pillRef.current) {
        const rect = pillRef.current.getBoundingClientRect();
        const w = Math.round(rect.width);
        const h = Math.round(rect.height);
        setPillDimensions({ width: w, height: h });
        pillRef.current.style.setProperty('--nav-h', `${h}px`);
      }
    };

    measurePill();

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const rect = entry.target.getBoundingClientRect();
        const w = Math.round(rect.width);
        const h = Math.round(rect.height);
        setPillDimensions({ width: w, height: h });
        if (pillRef.current) {
          pillRef.current.style.setProperty('--nav-h', `${h}px`);
        }
      }
    });

    ro.observe(el);
    window.addEventListener('resize', measurePill);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measurePill);
    };
  }, []);

  // Continuously track rect dimensions during the scroll shrink/expand transition
  useEffect(() => {
    const el = pillRef.current;
    if (!el) return;

    let animId: number;
    const startTime = performance.now();
    const duration = 350;

    const updateFrame = (now: number) => {
      if (pillRef.current) {
        const rect = pillRef.current.getBoundingClientRect();
        const w = Math.round(rect.width);
        const h = Math.round(rect.height);
        setPillDimensions({ width: w, height: h });
        pillRef.current.style.setProperty('--nav-h', `${h}px`);
      }
      if (now - startTime < duration) {
        animId = requestAnimationFrame(updateFrame);
      }
    };

    animId = requestAnimationFrame(updateFrame);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [scrolled]);

  // Viewport-relative Single Scroll-Spy (30-40% viewport line)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setScrolled(scrollY > 25);

          const sectionIds = ['works', 'skills', 'certificates', 'experience', 'resume'];

          // At top of the page (Hero area): no section link is active, clear hash
          if (scrollY < 120) {
            setActiveSection((prev) => {
              if (prev !== '') {
                if (window.location.hash) {
                  window.history.replaceState(null, '', window.location.pathname + window.location.search);
                }
                return '';
              }
              return prev;
            });
            ticking = false;
            return;
          }

          // Active line is roughly 35% from the top of viewport (below floating navbar)
          const viewportThreshold = window.innerHeight * 0.35;
          let current = '';

          // Check if at the very bottom of page
          const isAtBottom =
            window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;

          if (isAtBottom) {
            current = 'resume';
          } else {
            // Find section that encompasses the 35% threshold line
            for (const id of sectionIds) {
              const el = document.getElementById(id);
              if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= viewportThreshold && rect.bottom > viewportThreshold) {
                  current = id;
                  break;
                }
              }
            }

            // Fallback: closest section whose top is nearest below/at navbar
            if (!current) {
              let minDistance = Infinity;
              for (const id of sectionIds) {
                const el = document.getElementById(id);
                if (el) {
                  const rect = el.getBoundingClientRect();
                  const distance = Math.abs(rect.top - viewportThreshold);
                  if (rect.top <= viewportThreshold && distance < minDistance) {
                    minDistance = distance;
                    current = id;
                  }
                }
              }
            }
          }

          setActiveSection((prev) => {
            if (current !== prev) {
              if (current) {
                if (window.location.hash !== `#${current}`) {
                  window.history.replaceState(null, '', `#${current}`);
                }
              } else {
                if (window.location.hash) {
                  window.history.replaceState(null, '', window.location.pathname + window.location.search);
                }
              }
              return current;
            }
            return prev;
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Works', href: '#works', id: 'works' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Certificates', href: '#certificates', id: 'certificates' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Resume', href: '#resume', id: 'resume' },
  ];

  // Smooth scroll with offset for floating navbar height
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    scrollToTarget('#' + targetId, { offset: -85, duration: 0.9 });
    setActiveSection(targetId);
    if (window.location.hash !== `#${targetId}`) {
      window.history.replaceState(null, '', `#${targetId}`);
    }
  };

  const rectW = pillDimensions.width > 2 ? pillDimensions.width - 2 : 'calc(100% - 2px)';
  const rectH = pillDimensions.height > 2 ? pillDimensions.height - 2 : 'calc(100% - 2px)';
  const rectRx = pillDimensions.height > 2 ? (pillDimensions.height - 2) / 2 : undefined;

  return (
    <header
      id="navbar"
      className="fixed top-3 sm:top-5 inset-x-0 mx-auto z-50 w-[calc(100%-1.25rem)] sm:w-[calc(100%-2.5rem)] max-w-5xl [perspective:1200px]"
    >
      {/* 3D Motion Wrapper with Page-Load Drop-in Spring */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { y: -65, opacity: 0 }}
        animate={
          prefersReducedMotion
            ? { opacity: 1 }
            : {
                y: 0,
                opacity: 1,
                scale: scrolled ? 0.985 : 1,
              }
        }
        transition={{
          y: { type: 'spring', stiffness: 120, damping: 18, mass: 0.8 },
          scale: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        }}
        className="w-full relative [transform-style:preserve-3d]"
      >
        {/* Real 3D Glass Pill Container */}
        <div
          ref={pillRef}
          onPointerMove={(e) => {
            if (isTouchDevice || prefersReducedMotion) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            const tx = -py * 4; // at most 2deg
            const ty = px * 4;  // at most 2deg
            e.currentTarget.style.setProperty('--tx', `${tx.toFixed(2)}deg`);
            e.currentTarget.style.setProperty('--ty', `${ty.toFixed(2)}deg`);
          }}
          onPointerLeave={(e) => {
            e.currentTarget.style.setProperty('--tx', '0deg');
            e.currentTarget.style.setProperty('--ty', '0deg');
          }}
          className={`nav-pill px-4 sm:px-6 md:px-8 ${
            scrolled ? 'py-1.5 sm:py-2' : 'py-2 sm:py-2.5'
          } flex items-center justify-between gap-3 transition-all duration-300`}
        >
          {/* 1. THIN BEAM around the full border (constant speed) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20"
            fill="none"
          >
            <defs>
              <linearGradient id="nav-beam-glow-mask-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
                <stop offset="5%" stopColor="#fff" stopOpacity="0.5" />
                <stop offset="12%" stopColor="#fff" stopOpacity="1" />
                <stop offset="88%" stopColor="#fff" stopOpacity="1" />
                <stop offset="95%" stopColor="#fff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0.35" />
              </linearGradient>
              <mask id="nav-beam-glow-mask" maskContentUnits="objectBoundingBox">
                <rect x="0" y="0" width="1" height="1" fill="url(#nav-beam-glow-mask-grad)" />
              </mask>
            </defs>
            {prefersReducedMotion ? (
              <rect
                x="1"
                y="1"
                width={rectW}
                height={rectH}
                rx={rectRx}
                pathLength="100"
                className="nav-border-rect nav-beam-reduced"
              />
            ) : (
              <>
                {/* a) track: stroke rgba(255,255,255,.06), 1px */}
                <rect
                  x="1"
                  y="1"
                  width={rectW}
                  height={rectH}
                  rx={rectRx}
                  pathLength="100"
                  className="nav-border-rect nav-beam-track"
                />
                {/* b) glow: stroke #38bdf8, 1.5px, filter blur(2px), opacity .75, stroke-dasharray "7 93", stroke-linecap round */}
                <rect
                  x="1"
                  y="1"
                  width={rectW}
                  height={rectH}
                  rx={rectRx}
                  pathLength="100"
                  mask="url(#nav-beam-glow-mask)"
                  stroke="#38bdf8"
                  className="nav-border-rect nav-beam-glow"
                />
                {/* c) core: stroke #e0f2fe, 1px, stroke-dasharray "7 93", stroke-linecap round */}
                <rect
                  x="1"
                  y="1"
                  width={rectW}
                  height={rectH}
                  rx={rectRx}
                  pathLength="100"
                  stroke="#e0f2fe"
                  className="nav-border-rect nav-beam-core"
                />
              </>
            )}
          </svg>

          {/* 3D Embossed Icy Sapphire Wordmark: TAPAS (lifted with translateZ(12px)) */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget(0, { offset: 0, duration: 0.9 });
              setActiveSection('');
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }}
            style={{ transform: 'translateZ(12px)' }}
            className="flex items-center text-xl sm:text-2xl md:text-[26px] font-black tracking-wider transition-transform hover:scale-105 duration-200 whitespace-nowrap shrink-0 min-h-[44px] select-none group relative z-10 will-change-transform"
            aria-label="Tapas Home"
          >
            {/* T */}
            <span
              style={{
                filter:
                  'drop-shadow(0 1px 0 #0369a1) drop-shadow(0 2px 0 #075985) drop-shadow(0 4px 6px rgba(0,0,0,0.8)) drop-shadow(0 0 14px rgba(56,189,248,0.45))',
              }}
              className="bg-gradient-to-b from-[#F0F9FF] via-[#7DD3FC] to-[#0284C7] bg-clip-text text-transparent font-black"
            >
              T
            </span>

            {/* A (Distinctly brighter, radiant sapphire cyan accent) */}
            <span
              style={{
                filter:
                  'drop-shadow(0 1px 0 #0284c7) drop-shadow(0 2px 0 #0369a1) drop-shadow(0 4px 8px rgba(0,0,0,0.9)) drop-shadow(0 0 20px rgba(56,189,248,0.85))',
              }}
              className="bg-gradient-to-b from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] bg-clip-text text-transparent font-black px-0.5"
            >
              A
            </span>

            {/* PAS */}
            <span
              style={{
                filter:
                  'drop-shadow(0 1px 0 #0369a1) drop-shadow(0 2px 0 #075985) drop-shadow(0 4px 6px rgba(0,0,0,0.8)) drop-shadow(0 0 14px rgba(56,189,248,0.45))',
              }}
              className="bg-gradient-to-b from-[#F0F9FF] via-[#7DD3FC] to-[#0284C7] bg-clip-text text-transparent font-black"
            >
              PAS
            </span>
          </a>

          {/* Desktop Navigation Links with Smooth Sliding Indicator */}
          <nav
            className="hidden md:flex items-center gap-1 lg:gap-2 relative z-10"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                href={link.href}
                label={link.label}
                isActive={activeSection === link.id}
                onClick={(e) => scrollToSection(e, link.id)}
              />
            ))}
          </nav>

          {/* Primary CTA: Outlined Cyan/Blue Pill with Soft Glow & Arrow Shift (lifted with translateZ(12px)) */}
          <div
            style={{ transform: 'translateZ(12px)' }}
            className="hidden md:flex items-center gap-3 shrink-0 relative z-10 will-change-transform"
          >
            <motion.button
              onClick={onOpenContact}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="group flex items-center gap-2 px-5 py-2 min-h-[44px] text-[0.75rem] font-sans font-semibold uppercase tracking-[0.12em] text-[#38BDF8] hover:text-sky-200 bg-sky-400/[0.08] hover:bg-sky-400/[0.2] border border-sky-400/80 hover:border-sky-300 rounded-full transition-all duration-200 shadow-[0_0_15px_rgba(56,189,248,0.22)] hover:shadow-[0_0_28px_rgba(56,189,248,0.5)] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Get In Touch</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8] group-hover:text-sky-200 transition-transform duration-250 ease-out group-hover:translate-x-1.5" />
            </motion.button>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="md:hidden flex items-center relative z-10">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-h-[44px] min-w-[44px] p-2 flex items-center justify-center text-[rgba(245,245,245,0.7)] hover:text-white rounded-full border border-white/10 bg-[var(--surface)]/80 transition-colors"
              aria-label="Toggle mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[var(--gold)]" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Drawer: Smoked Glass Island */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              backgroundColor: 'rgba(8, 14, 28, 0.94)',
              WebkitBackdropFilter: 'blur(28px) saturate(180%)',
              backdropFilter: 'blur(28px) saturate(180%)',
              boxShadow: `
                inset 0 1px 1px 0 rgba(255, 255, 255, 0.18),
                0 25px 50px -12px rgba(0, 0, 0, 0.85)
              `,
            }}
            className="md:hidden mt-2 rounded-2xl border border-white/[0.12] border-t-white/[0.24] px-5 py-5 space-y-4"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    scrollToSection(e, link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`min-h-[44px] px-3.5 py-2.5 text-[0.75rem] font-sans uppercase tracking-[0.12em] flex items-center rounded-xl transition-colors ${
                    activeSection === link.id
                      ? 'text-[var(--gold)] font-semibold bg-[var(--gold)]/10 border border-[var(--gold)]/20'
                      : 'text-[rgba(245,245,245,0.65)] hover:text-white hover:bg-white/[0.05] font-medium'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-white/[0.08]">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full min-h-[44px] py-2.5 px-4 text-[0.75rem] font-sans font-semibold uppercase tracking-[0.12em] text-[var(--gold)] bg-[var(--gold)]/10 hover:bg-[var(--gold)]/20 border border-[var(--gold)]/80 rounded-full transition-colors text-center flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(245,168,0,0.18)]"
              >
                <span>Get In Touch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </header>
  );
};
