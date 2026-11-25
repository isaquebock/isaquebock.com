import {
  siDocker,
  siExpress,
  siFigma,
  siGit,
  siGithub,
  siGo,
  siGsap,
  siJavascript,
  siLinux,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siReact,
  siRedis,
  siRust,
  siTailwindcss,
  siTanstack,
  siTypescript,
  siVuedotjs,
  type SimpleIcon,
} from "simple-icons";

export type Skill = {
  name: string;
  /** Logo da marca (simple-icons) ou um ícone genérico quando não há logo disponível. */
  icon: SimpleIcon | "cloud" | "database" | "motion";
};

export const skills: Skill[] = [
  { name: "React", icon: siReact },
  { name: "Next.js", icon: siNextdotjs },
  { name: "Vue", icon: siVuedotjs },
  { name: "React Native", icon: siReact },
  { name: "TanStack", icon: siTanstack },
  { name: "Node.js", icon: siNodedotjs },
  { name: "Express", icon: siExpress },
  { name: "Go", icon: siGo },
  { name: "Rust", icon: siRust },
  { name: "PostgreSQL", icon: siPostgresql },
  { name: "Redis", icon: siRedis },
  { name: "SQL", icon: "database" },
  { name: "AWS", icon: "cloud" },
  { name: "Docker", icon: siDocker },
  { name: "Tailwind", icon: siTailwindcss },
  { name: "Motion", icon: "motion" },
  { name: "GSAP", icon: siGsap },
  { name: "JavaScript", icon: siJavascript },
  { name: "TypeScript", icon: siTypescript },
  { name: "Git", icon: siGit },
  { name: "GitHub", icon: siGithub },
  { name: "Figma", icon: siFigma },
  { name: "Linux", icon: siLinux },
];
