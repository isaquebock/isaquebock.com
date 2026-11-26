export type Experience = {
  company: string;
  role: string;
  logo: string;
  period: string;
  /** Optional: only shown when known. */
  location?: string;
  bullets: string[];
  /** Technologies used in this role. */
  stack?: string[];
};

/** Source: LinkedIn profile export (Profile.pdf). */
export const experiences: Experience[] = [
  {
    company: "Azion",
    role: "Software Engineer",
    logo: "/images/experience/azion.jpg",
    period: "Jul 2025 – Present",
    location: "Porto Alegre, Brazil",
    bullets: [
      "Contribute to building Azion's Console, website, documentation and marketing engineering projects, from first implementation to production.",
      "Build interfaces for people and AI agents with Astro, Nuxt, Vue.js and TypeScript, styled with Tailwind CSS.",
      "Design reusable components and the interface architecture behind them, so new screens are assembled from consistent, well-tested building blocks.",
      "Own state management for complex flows using stores and signals, keeping data flow predictable as features grow.",
      "Work closely with design on UX/UI details, with attention to performance, accessibility, responsiveness and overall usability.",
      "Collaborate in a multidisciplinary team in a context close to infrastructure and scalability, contributing to technical decisions and the evolution of the product.",
    ],
    stack: ["Astro", "Nuxt", "Vue.js", "TypeScript", "Tailwind CSS"],
  },
  {
    company: "enjoei",
    role: "Software Engineer",
    logo: "/images/experience/enjoei.jpg",
    period: "Aug 2024 – Jul 2025",
    location: "Remote",
    bullets: [
      "Frontend: built and maintained interfaces with Astro, Svelte, Vue.js, TypeScript and Tailwind CSS, with strong focus on componentization, interface architecture and UX/UI.",
      "Managed application state with stores, signals and context APIs, keeping complex screens consistent and easy to evolve.",
      "DevOps & infra: worked with Docker, Kubernetes, CI/CD pipelines and Unix/Linux environments to keep applications scalable and observable.",
      "Quality: wrote automated unit, integration and end-to-end tests with Jest and Playwright, raising confidence in every release.",
    ],
    stack: ["Astro", "Svelte", "Vue.js", "Docker", "Kubernetes", "Jest", "Playwright"],
  },
  {
    company: "Accountfy",
    role: "Software Engineer",
    logo: "/images/experience/accountfy.jpg",
    period: "Nov 2023 – Aug 2024",
    location: "Remote",
    bullets: [
      "Developed the platform's reports and dashboards module, from data presentation to the interactions users rely on to read their numbers.",
      "Built data-heavy screens in Angular with TypeScript, JavaScript and SCSS, focused on clarity, consistency and responsiveness.",
      "Integrated the frontend with REST APIs and worked across the stack with Java and Node.js when features required backend changes.",
      "Wrote unit tests with Jest and Jasmine to keep the reports and dashboards reliable as the module evolved.",
    ],
    stack: ["Angular", "TypeScript", "JavaScript", "SCSS", "Java", "Node.js", "Jest", "Jasmine"],
  },
  {
    company: "Neon",
    role: "Software Engineer",
    logo: "/images/experience/neon.jpg",
    period: "Jul 2022 – Oct 2023",
    location: "Remote",
    bullets: [
      "Developed and tested Neon's management systems, contributing to their construction, evolution and day-to-day maintenance in production.",
      "Built interfaces in Angular with TypeScript, JavaScript, SCSS and Tailwind CSS, organized into reusable components.",
      "Integrated screens with REST APIs and supported backend needs with Node.js.",
      "Covered features with unit tests in Jest and Jasmine, catching regressions before they reached users.",
    ],
    stack: ["Angular", "TypeScript", "JavaScript", "SCSS", "Tailwind CSS", "Node.js", "Jest", "Jasmine"],
  },
  {
    company: "Vnda Ecommerce",
    role: "Frontend Software Engineer",
    logo: "/images/experience/olist.jpg",
    period: "Jun 2021 – Jun 2022",
    location: "Porto Alegre, Brazil",
    bullets: [
      "Developed e-commerce storefronts end to end on the frontend, turning layouts into responsive, production-ready stores.",
      "Implemented new store features and fixed bugs across multiple client projects.",
      "Built pages and templates with JavaScript (ES6+), HTML, CSS, jQuery and the Liquid 4 template engine.",
      "Versioned and reviewed code with Git and GitLab as part of the team's delivery workflow.",
    ],
    stack: ["JavaScript ES6+", "HTML", "CSS", "Liquid", "jQuery", "Git/GitLab"],
  },
  {
    company: "Olina Lab",
    role: "Software Development Intern",
    logo: "/images/experience/olina.jpg",
    period: "Feb 2021 – Jun 2021",
    location: "Canoas, Brazil",
    bullets: [
      "Developed and maintained the company's internal system with C#.",
      "Automated internal processes with VBA, reducing repetitive manual work for the team.",
      "Handled support tickets, investigating issues and delivering fixes to internal users.",
      "First professional experience in software development, working with real users and production systems.",
    ],
    stack: ["VBA", "C#"],
  },
];
