import type { Metadata } from "next";
import { profile } from "@/data/profile";
import { experiences } from "@/data/experiences";

/** Public URL of the site. Override with NEXT_PUBLIC_SITE_URL (e.g. preview deploys). */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://isaquebock.com").replace(/\/$/, "");

export const siteName = profile.name;

export const siteDescription =
  "Isaque Böck is a full-stack software engineer building fast, accessible and well-crafted web products with TypeScript, React, Next.js, Vue and Node.js.";

export const keywords = [
  "Isaque Böck",
  "Isaque Bock",
  "isaquebock",
  "Software Engineer",
  "Full-stack Developer",
  "Frontend Engineer",
  "TypeScript",
  "React",
  "Next.js",
  "Vue.js",
  "Svelte",
  "Node.js",
  "Tailwind CSS",
  "Portfolio",
];

/** X handle taken from the socials list, for twitter:creator. */
const xHandle = (() => {
  const x = profile.socials.find((s) => s.icon === "x");
  return x ? `@${x.href.split("/").filter(Boolean).pop()}` : undefined;
})();

/** Public profiles (no mailto) for schema.org sameAs. */
export const sameAs = profile.socials.filter((s) => s.href.startsWith("http")).map((s) => s.href);

/**
 * Metadata for one page: title, description, canonical URL and the matching
 * Open Graph / Twitter fields. Child `openGraph` replaces the parent's object
 * instead of merging, so every page builds the full set from here.
 */
export function pageMetadata({
  title,
  description = siteDescription,
  path = "/",
  type = "website",
}: {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "profile" | "article";
}): Metadata {
  const fullTitle = title ? `${title} · ${siteName}` : `${siteName} · ${profile.role}`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName,
      locale: "en_US",
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(xHandle ? { creator: xHandle, site: xHandle } : {}),
    },
  };
}

/** schema.org graph for the whole site: the person and the website. */
export function siteJsonLd() {
  const current = experiences[0];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: profile.name,
        alternateName: ["Isaque Bock", "isaquebock"],
        url: siteUrl,
        image: `${siteUrl}${profile.avatar}`,
        jobTitle: profile.role,
        description: siteDescription,
        sameAs,
        ...(current && /present/i.test(current.period)
          ? { worksFor: { "@type": "Organization", name: current.company } }
          : {}),
        knowsAbout: ["Software Engineering", "Web Development", "TypeScript", "React", "Next.js", "Vue.js", "Node.js", "UI Engineering"],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        description: siteDescription,
        inLanguage: "en",
        publisher: { "@id": `${siteUrl}/#person` },
      },
    ],
  };
}

/** Serialises JSON-LD for a <script> tag, escaping `<` so it can't close the tag. */
export const jsonLdScript = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
