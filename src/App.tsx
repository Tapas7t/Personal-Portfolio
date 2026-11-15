import React, { useState } from 'react';
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

export default function App() {
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectItem | null>(null);

  const handleOpenContact = () => {
    const contactElement = document.getElementById('connect');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', '#connect');
    }
  };

  return (
    <div className="relative min-h-screen text-[#e2e8f0] selection:bg-amber-400/30 selection:text-amber-200">
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
