import React, { useState, useEffect } from 'react';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WorksSection } from './components/WorksSection';
import { SkillsSection } from './components/SkillsSection';
import { CertificatesSection } from './components/CertificatesSection';
import { ExperienceEducation } from './components/ExperienceEducation';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { ProjectItem } from './utils/portfolio-logic';
import { initSmoothScroll, scrollToTarget } from './utils/smoothScroll';

export default function App() {
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectItem | null>(null);

  useEffect(() => {
    return initSmoothScroll();
  }, []);

  const handleOpenContact = () => {
    scrollToTarget('#connect', { offset: -85, duration: 0.9 });
    if (window.location.hash !== '#connect') {
      window.history.replaceState(null, '', '#connect');
    }
  };

  return (
    <div className="relative min-h-screen text-[var(--text)] selection:bg-[var(--gold)]/30 selection:text-amber-200">
      {/* Dynamic Animated Backdrop & Film Grain with Developer Portrait */}
      <AnimatedBackground />

      {/* Primary Top Bar */}
      <Navbar onOpenContact={handleOpenContact} />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section */}
        <Hero onOpenContact={handleOpenContact} />

        {/* Selected Works Grid */}
        <WorksSection
          onSelectProject={(project) => setActiveProjectModal(project)}
        />

        {/* Technical Capabilities Matrix */}
        <SkillsSection />

        {/* Real Certified Credentials */}
        <CertificatesSection />

        {/* Professional Experience & Academic Education */}
        <ExperienceEducation />

        {/* Direct Connect & Inquiry Hub */}
        <ContactSection />
      </main>

      {/* Minimalist Footnotes */}
      <Footer />

      {/* Interactive Project Case Study Dialog */}
      <ProjectModal
        project={activeProjectModal}
        onClose={() => setActiveProjectModal(null)}
      />
    </div>
  );
}
