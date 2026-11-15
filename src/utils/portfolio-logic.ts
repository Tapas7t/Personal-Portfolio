// ============================================================================
// MEDCONSULTS PROJECT CONFIGURATION
// When your project goes live, simply update the URLs and status below:
// - github: Paste your public repository URL (e.g. "https://github.com/Tapas7t/medconsults")
// - liveDemo: Paste your live deployment URL (e.g. "https://medconsults.vercel.app")
// - status: Set to "Completed", "Live", or "" to remove the "In Development" badge
// ============================================================================
export const medconsultsConfig = {
  github: 'https://github.com/Tapas7t/MedConsults', // MedConsults project repository
  liveDemo: '', // When empty, displays "Live Demo — Coming Soon" (disabled)
  status: 'In Development', // Badge label on card; set to "" or "Live" when complete
};

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'all' | 'frontend' | 'backend' | 'ai-ml' | 'fullstack';
  status: 'In Development' | 'Planned' | 'Completed';
  technologies: string[];
  summary: string;
  features: string[];
  architecture: string;
  highlightMetric?: string;
  demoType: 'portfolio' | 'medconsults';
}

export interface SkillCategory {
  title: string;
  skills: { name: string; level: number; category: string }[];
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'medconsults',
    title: 'MedConsults',
    subtitle: 'Medical Appointment Booking Application | Full-Stack Web Application',
    category: 'fullstack',
    status: (medconsultsConfig.status || 'In Development') as 'In Development' | 'Planned' | 'Completed',
    technologies: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Mongoose',
    ],
    summary:
      'A full-stack medical appointment booking platform that simplifies scheduling by enabling patients to discover healthcare professionals and book consultations online.',
    features: [
      'Built a full-stack platform that lets patients find doctors and book consultations, simplifying the appointment process.',
      'Developed a responsive, type-safe frontend using Next.js, React, TypeScript, and Tailwind CSS.',
      'Designed RESTful APIs with Node.js and Express.js to handle appointments, users, and application data.',
      'Modeled data in MongoDB with Mongoose schemas, hosted on MongoDB Atlas.',
      'Implemented secure session-based authentication with email and password login.',
      'Structured the codebase for maintainability, with clear separation of frontend and backend layers.',
    ],
    architecture:
      'Next.js & React frontend with Tailwind CSS styling and TypeScript type safety, coupled with an Express.js & Node.js REST API layer and MongoDB Atlas database managed via Mongoose schemas.',
    highlightMetric: medconsultsConfig.status,
    demoType: 'medconsults',
  },
];

export function filterProjects(
  projects: ProjectItem[],
  selectedCategory: string,
  searchQuery: string = ''
): ProjectItem[] {
  return projects.filter((project) => {
    const matchesCategory =
      selectedCategory === 'all' || project.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === '' ||
      project.title.toLowerCase().includes(query) ||
      project.subtitle.toLowerCase().includes(query) ||
      project.technologies.some((tech) => tech.toLowerCase().includes(query)) ||
      project.summary.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });
}

export interface ContactFormInput {
  name: string;
  email: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: {
    name?: string;
    email?: string;
    message?: string;
  };
}

export function validateContactForm(input: ContactFormInput): ValidationResult {
  const errors: { name?: string; email?: string; message?: string } = {};

  if (!input.name || input.name.trim().length < 2) {
    errors.name = 'Please provide a valid name (at least 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email || !emailRegex.test(input.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!input.message || input.message.trim().length < 10) {
    errors.message = 'Please provide a message of at least 10 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatAcademicStatus(gradYear: number, cgpa: number): string {
  return `BSc Information Technology · University of Mumbai · CGPA ${cgpa.toFixed(2)}`;
}

export interface MagneticOffset {
  x: number;
  y: number;
}

export function calculateMagneticOffset(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
  strength: number = 0.35,
  maxOffset: number = 18
): MagneticOffset {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const rawX = (clientX - centerX) * strength;
  const rawY = (clientY - centerY) * strength;

  const clampedX = Math.max(-maxOffset, Math.min(maxOffset, rawX));
  const clampedY = Math.max(-maxOffset, Math.min(maxOffset, rawY));

  return {
    x: Math.round(clampedX * 100) / 100,
    y: Math.round(clampedY * 100) / 100,
  };
}

export interface CardTilt {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
}

export function calculateCardTilt(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
  maxRotation: number = 7
): CardTilt {
  if (rect.width === 0 || rect.height === 0) {
    return { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 };
  }
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const percentX = x / rect.width;
  const percentY = y / rect.height;

  // Invert Y for standard natural 3D tilt
  const rotateX = (percentY - 0.5) * -maxRotation * 2;
  const rotateY = (percentX - 0.5) * maxRotation * 2;

  return {
    rotateX: (Math.round(rotateX * 10) / 10) || 0,
    rotateY: (Math.round(rotateY * 10) / 10) || 0,
    glareX: Math.round(percentX * 100),
    glareY: Math.round(percentY * 100),
  };
}

