import { profile } from "@/data/profile";
import { skills } from "@/data/skills";
import { resources } from "@/data/resources";
import { posts } from "@/data/writing";
import { getExperiences, getNow, getProfile, getProjects } from "@/data/localized";
import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale, localePath } from "@/lib/i18n";
import { sameAs, siteUrl } from "@/lib/seo";

/**
 * llms.txt (https://llmstxt.org): a Markdown summary of the site for language
 * models and AI agents, built from the same data as the pages. English is the
 * main text; the Portuguese pages are linked as alternates.
 */

const url = (path: string, locale = defaultLocale) => {
  const p = localePath(locale, path);
  return `${siteUrl}${p === "/" ? "" : p}`;
};

/** Real contact links only (skips placeholder emails). */
const contacts = () =>
  profile.socials.filter((s) => !s.href.includes("example.com")).map((s) => `- [${s.name}](${s.href})`);

function header() {
  const en = getProfile("en");
  const now = getNow("en");
  return [
    `# ${profile.name}`,
    "",
    `> ${getDictionary("en").seo.description}`,
    "",
    ...en.bio.flatMap((p, i) => (i ? ["", p] : [p])),
    "",
    `Right now (updated ${now.updated}):`,
    ...now.items.map((i) => `- ${i.label}: ${i.text}`),
  ];
}

/** Short index: who, what's on the site and where to read more. */
export function llmsIndex() {
  const projects = getProjects("en");
  return [
    ...header(),
    "",
    "## Pages",
    "",
    `- [Home](${url("/")}): bio, current focus, featured projects, recent experience and skills`,
    `- [Experience](${url("/experiences")}): every role, with responsibilities and stack`,
    `- [Projects](${url("/projects")}): all projects`,
    `- [Resources](${url("/resources")}): curated links to courses, inspiration, components, icons, fonts, motion, design systems and agent skills`,
    `- [Writing](${url("/writing")}): articles on building products and interfaces, plus an optional study log`,
    ...projects.map((p) => `- [${p.title}](${url(`/projects/${p.slug}`)}): ${p.description}`),
    "",
    "## Full content",
    "",
    `- [llms-full.txt](${siteUrl}/llms-full.txt): everything above plus full experience details and skills, in one file`,
    "",
    "## Contact",
    "",
    ...contacts(),
    "",
    "## Optional",
    "",
    `- [Versão em português](${url("/", "pt-br")}): the same site in Brazilian Portuguese`,
    `- [Sitemap](${siteUrl}/sitemap.xml)`,
    "",
  ].join("\n");
}

/** Everything in one file: bio, current focus, experience, projects, skills, links. */
export function llmsFull() {
  const experiences = getExperiences("en");
  const projects = getProjects("en");
  return [
    ...header(),
    "",
    "## Experience",
    "",
    ...experiences.flatMap((e) => [
      `### ${e.role} at ${e.company}`,
      "",
      `${e.period}${e.location ? ` · ${e.location}` : ""}`,
      "",
      ...e.bullets.map((b) => `- ${b}`),
      ...(e.stack?.length ? ["", `Stack: ${e.stack.join(", ")}`] : []),
      "",
    ]),
    "## Projects",
    "",
    ...projects.flatMap((p) => [
      `### ${p.title}`,
      "",
      `${p.description} ([page](${url(`/projects/${p.slug}`)}))`,
      ...(p.highlights.length ? ["", ...p.highlights.map((h) => `- ${h.replace(/\*\*/g, "")}`)] : []),
      ...(p.stack.length ? ["", `Stack: ${p.stack.join(", ")}`] : []),
      ...(p.links.website ? [`Website: ${p.links.website}`] : []),
      ...(p.links.github ? [`Code: ${p.links.github}`] : []),
      "",
    ]),
    "## Skills",
    "",
    skills.map((s) => s.name).join(", "),
    "",
    "## Writing and study log",
    "",
    ...[...posts]
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((p) => `- ${p.date} (${p.kind}): [${p.title.en}](${url(`/writing/${p.slug}`)}): ${p.summary.en}`),
    "",
    "## Resources I recommend",
    "",
    ...resources.flatMap((c) => [`### ${c.title.en}`, "", ...c.items.map((r) => `- [${r.name}](${r.href}): ${r.note.en}`), ""]),
    "",
    "## Links",
    "",
    `- Website: ${siteUrl}`,
    ...sameAs.map((href) => `- ${href}`),
    `- Portuguese version: ${url("/", "pt-br")}`,
    "",
  ].join("\n");
}
