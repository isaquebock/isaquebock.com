import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { now } from "@/data/now";
import { localePath, locales } from "@/lib/i18n";
import { languageAlternates, siteUrl } from "@/lib/seo";

const pages = [
  { path: "/", priority: 1 },
  { path: "/projects", priority: 0.8 },
  { path: "/experiences", priority: 0.8 },
  ...projects.filter((p) => !p.draft).map((p) => ({ path: `/projects/${p.slug}`, priority: 0.6 })),
];

const absolute = (languages: Record<string, string>) =>
  Object.fromEntries(Object.entries(languages).map(([k, v]) => [k, `${siteUrl}${v === "/" ? "" : v}`]));

/** Every page in every language, each listing its translations (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap(({ path, priority }) =>
    locales.map((locale) => {
      const url = localePath(locale, path);
      return {
        url: `${siteUrl}${url === "/" ? "" : url}`,
        // The "Now" date is the most reliable signal of when the content last changed.
        lastModified: now.updated,
        changeFrequency: "monthly" as const,
        priority,
        alternates: { languages: absolute(languageAlternates(path)) },
      };
    }),
  );
}
