import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { calculateMagneticOffset } from '../utils/portfolio-logic';

interface NavbarProps {
  onOpenContact: () => void;
}

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, isActive, onClick }) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const mag = calculateMagneticOffset(e.clientX, e.clientY, rect, 0.3, 8);
    setOffset(mag);
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <motion.a
      ref={linkRef}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 280, damping: 18, mass: 0.1 }}
      className={`relative px-2.5 lg:px-3 py-2 min-h-[44px] flex items-center text-xs uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 group ${
        isActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-white font-medium'
      }`}
    >
      <span className="relative z-10">{label}</span>
      <span
        className={`absolute bottom-1.5 left-2 right-2 h-[2px] bg-[#FFA800] transition-transform origin-center duration-250 ease-out ${
          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      />
    </motion.a>
  );
};

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setScrolled(scrollY > 40);

          const sections = ['works', 'skills', 'certificates', 'experience', 'connect', 'resume'];
          const scrollPos = scrollY + 220;
          let current = '';

          for (let i = sections.length - 1; i >= 0; i--) {
            const el = document.getElementById(sections[i]);
            if (el && el.offsetTop <= scrollPos) {
              current = sections[i];
              break;
            }
          }

          setActiveSection(current);

          // Dynamically sync URL hash without reloading or polluting history
          if (current) {
            if (window.location.hash !== `#${current}`) {
              window.history.replaceState(null, '', `#${current}`);
            }
          } else if (scrollY < 200) {
            if (window.location.hash) {
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
          }

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

  return (
    <header
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07080b]/90 backdrop-blur-md border-b border-slate-800/80 py-4 shadow-xl'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between gap-4 lg:gap-8">
        {/* Brand Wordmark */}
        <a
          href="#hero"
          className="text-lg md:text-xl font-black tracking-widest text-slate-100 hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 min-h-[44px] group"
          aria-label="Tapas Home"
        >
          <span>TAPAS</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFA800] group-hover:scale-125 transition-transform duration-200" />
        </a>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-2 lg:gap-5"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              href={link.href}
              label={link.label}
              isActive={activeSection === link.id}
            />
          ))}
        </nav>

        {/* Primary CTA */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <motion.button
            onClick={onOpenContact}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="group flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 rounded-md hover:bg-amber-300 transition-colors shadow-sm whitespace-nowrap shrink-0"
          >
            <span>Get In Touch</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-200" />
          </motion.button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-h-[44px] min-w-[44px] p-2.5 flex items-center justify-center text-slate-300 hover:text-white rounded-md border border-slate-800 bg-slate-900/60 transition-colors"
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="md:hidden bg-[#0a0c10] border-b border-slate-800 px-6 py-6 space-y-4"
        >
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`min-h-[44px] px-3 py-2.5 text-sm uppercase tracking-wider font-medium flex items-center rounded-lg transition-colors ${
                  activeSection === link.id ? 'text-amber-400 font-bold bg-slate-900/60' : 'text-slate-300 hover:text-amber-400 hover:bg-slate-900/30'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-800">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full min-h-[44px] py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 rounded-md hover:bg-amber-300 transition-colors text-center flex items-center justify-center"
            >
              Get In Touch
            </motion.button>
          </div>
        </motion.div>
      )}
    </header>
  );
};
