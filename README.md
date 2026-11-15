# Tapas Karmakar — Developer Portfolio

A modern, high-performance personal portfolio website built with React 19, TypeScript, Tailwind CSS, and Motion. Designed with an atmospheric glassmorphic aesthetic, custom physics-based 3D card tilt interactions, and robust smooth-scrolling navigation.

---

## 🚀 Overview

This repository houses the source code for the developer portfolio of **Tapas Karmakar** — Full-Stack Developer & AI Enthusiast based in Mumbai, India. The application showcases full-stack web engineering projects, technical skill competencies, verified professional certifications, and academic background.

---

## ✨ Features

- **Atmospheric Visual Design**: Deep space aesthetic featuring dynamic canvas rendering, ambient luminous lighting, and responsive floating elements.
- **Physics-Based 3D Tilt**: Custom glassmorphic cards with pointer-reactive 3D tilt, specular lighting highlights, and mobile/touch detection.
- **Featured Project Showcase**: Interactive project spotlight for full-stack applications (including MedConsults) with in-depth technical architecture dialogs.
- **Engineering Capabilities Matrix**: Categorized technical toolset covering Frontend, Backend, Databases, Authentication, and Developer Tooling.
- **Verified Credentials**: Direct links to verified professional certifications and academic milestones.
- **Deterministic Navigation**: Programmatic smooth-scrolling navigation with scrollbar gutter stabilization and Lenis render loop integration.
- **Smart Contact Routing**: Seamless communication bridge detecting mobile devices for native mailto handling or opening web mail clients on desktop.
- **Responsive & Accessible**: Strict support for mobile viewports, high-density displays, and `prefers-reduced-motion` accessibility standards.

---

## 🛠️ Tech Stack

- **Core Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Motion & Physics**: [Motion](https://motion.dev/)
- **Smooth Scroll**: [Lenis](https://github.com/darkroomengineering/lenis)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Project Structure

```text
├── public/
│   ├── assets/
│   │   └── portrait.png              # Developer portrait
│   ├── favicon.svg                   # Vector site favicon
│   └── Tapas_Karmakar_Resume.pdf     # Downloadable resume
├── src/
│   ├── components/
│   │   ├── AnimatedBackground.tsx    # Ambient luminous glow layers
│   │   ├── CertificatesSection.tsx   # Verified certifications grid
│   │   ├── ContactSection.tsx        # Direct contact and social links
│   │   ├── ExperienceEducation.tsx   # Career timeline and education
│   │   ├── Footer.tsx                # Site footer
│   │   ├── GlassCard.tsx             # 3D interactive tilt container
│   │   ├── GoldOrbits.tsx            # Background decorative accents
│   │   ├── Hero.tsx                  # Hero section with headline & CTA
│   │   ├── HeroFloatingElements.tsx  # Floating particles & ambient physics
│   │   ├── HeroTerrain.tsx           # 3D canvas isometric grid
│   │   ├── Navbar.tsx                # Sticky floating navigation bar
│   │   ├── ProjectModal.tsx          # Full-screen project case study dialog
│   │   ├── SkillsSection.tsx         # Engineering toolset cards
│   │   ├── TechTile.tsx              # Interactive skill chip component
│   │   └── WorksSection.tsx          # Featured work showcase
│   ├── utils/
│   │   ├── portfolio-logic.ts        # Project data and validation helpers
│   │   ├── portfolio-logic.test.ts   # Unit test suite
│   │   └── smoothScroll.ts           # Programmatic scrolling & Lenis sync
│   ├── App.tsx                       # Main application component
│   ├── index.css                     # Global design tokens and styles
│   └── main.tsx                      # Vite React entrypoint
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Tapas7t/Personal-Portfolio.git
cd Personal-Portfolio
npm install
```

### Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3005](http://localhost:3005) in your browser.

### Production Build

Create an optimized production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Type Checking & Tests

Run strict TypeScript type verification and unit tests:

```bash
node node_modules/typescript/bin/tsc --noEmit
node --import tsx src/utils/portfolio-logic.test.ts
```

---

## 📬 Contact & Connect

- **Developer**: Tapas Karmakar
- **Location**: Mumbai, India
- **GitHub**: [@Tapas7t](https://github.com/Tapas7t)
- **LinkedIn**: [Tapas Karmakar](https://www.linkedin.com/in/tapas-karmakar-276a37438)
- **Email**: [contactattapas@gmail.com](mailto:contactattapas@gmail.com)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
