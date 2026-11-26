import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: siteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/projects`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/experiences`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((p) => ({
      url: `${siteUrl}/projects/${p.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
