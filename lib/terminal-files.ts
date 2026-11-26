import { skills } from "@/data/skills";
import { getExperiences, getProfile, getProjects } from "@/data/localized";
import type { Locale } from "@/lib/i18n";

/**
 * The tiny filesystem behind the site terminal. Paths look like "~",
 * "~/projects" and "~/projects/<slug>.md". Every file is Markdown generated
 * from the same data as the pages, in the visitor's language.
 */
export type FileSystem = { dirs: Record<string, string[]>; files: Record<string, string> };

const t = {
  en: { socials: "Socials", experience: "Experience", skills: "Skills & Technologies", stack: "Stack", private: "private", links: "Links" },
  "pt-br": { socials: "Redes", experience: "Experiência", skills: "Habilidades e Tecnologias", stack: "Stack", private: "privado", links: "Links" },
} satisfies Record<Locale, Record<string, string>>;

export function buildFileSystem(locale: Locale): FileSystem {
  const l = t[locale];
  const profile = getProfile(locale);
  const projects = getProjects(locale);

  const files: Record<string, string> = {
    "~/socials.md": [
      `# ${l.socials}`,
      "",
      ...profile.socials
        .filter((s) => !s.href.includes("example.com"))
        .map((s) => `- ${s.name}: ${s.href.replace(/^mailto:/, "")}`),
    ].join("\n"),
    "~/experience.md": [
      `# ${l.experience}`,
      ...getExperiences(locale).flatMap((e) => [
        "",
        `## ${e.role} @ ${e.company}`,
        `${e.period}${e.location ? ` · ${e.location}` : ""}`,
        "",
        ...e.bullets.map((b) => `- ${b}`),
        ...(e.stack?.length ? ["", `${l.stack}: ${e.stack.join(", ")}`] : []),
      ]),
    ].join("\n"),
    "~/skills.md": [`# ${l.skills}`, "", ...skills.map((s) => `- ${s.name}`)].join("\n"),
  };

  for (const p of projects) {
    files[`~/projects/${p.slug}.md`] = [
      `# ${p.title}${p.draft ? ` (${l.private})` : ""}`,
      "",
      p.description,
      ...(p.highlights.length ? ["", ...p.highlights.map((h) => `- ${h.replace(/\*\*/g, "")}`)] : []),
      ...(p.stack.length ? ["", `${l.stack}: ${p.stack.join(", ")}`] : []),
      ...(p.links.website || p.links.github
        ? ["", `${l.links}: ${[p.links.website, p.links.github].filter(Boolean).join(" · ")}`]
        : []),
    ].join("\n");
  }

  return {
    dirs: {
      "~": ["projects/", "socials.md", "experience.md", "skills.md"],
      "~/projects": projects.map((p) => `${p.slug}.md`),
    },
    files,
  };
}

/** Resolves `arg` against `cwd` into a "~/..." path (handles ~, .., . and trailing /). */
export function resolvePath(cwd: string, arg = "~") {
  const raw = arg.replace(/\/+$/, "") || "~";
  const start = raw === "~" || raw.startsWith("~/") || raw.startsWith("/") ? [] : cwd.split("/").slice(1);
  const parts = raw.replace(/^~\/?|^\//, "").split("/").filter(Boolean);
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") start.pop();
    else start.push(part);
  }
  return ["~", ...start].join("/");
}
