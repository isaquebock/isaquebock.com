import type { Metadata } from "next";
import { profile } from "@/data/profile";
import { experiences } from "@/data/experiences";
import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale, htmlLang, localePath, locales, ogLocale, type Locale } from "@/lib/i18n";

/** Public URL of the site. Override with NEXT_PUBLIC_SITE_URL (e.g. preview deploys). */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://isaquebock.com").replace(/\/$/, "");

export const siteName = profile.name;

export const siteDescription = getDictionary(defaultLocale).seo.description;

/** hreflang alternates for a locale-free path: every locale plus x-default. */
export function languageAlternates(path: string) {
  return {
    ...Object.fromEntries(locales.map((l) => [htmlLang[l], localePath(l, path)])),
    "x-default": localePath(defaultLocale, path),
  };
}

export const keywords = [
  "Isaque Böck",
  "Isaque Bock",
  "isaquebock",
  "Product Engineer",
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
  locale = defaultLocale,
  title,
  description = getDictionary(locale).seo.description,
  path = "/",
  type = "website",
}: {
  locale?: Locale;
  title?: string;
  description?: string;
  /** Locale-free path, e.g. "/projects". */
  path?: string;
  type?: "website" | "profile" | "article";
}): Metadata {
  const fullTitle = title ? `${title} · ${siteName}` : `${siteName} · ${profile.role}`;
  const url = localePath(locale, path);
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type,
      url,
      siteName,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
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
export function siteJsonLd(locale: Locale = defaultLocale) {
  const description = getDictionary(locale).seo.description;
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
        description,
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
        description,
        inLanguage: locales.map((l) => htmlLang[l]),
        publisher: { "@id": `${siteUrl}/#person` },
      },
    ],
  };
}

/** Serialises JSON-LD for a <script> tag, escaping `<` so it can't close the tag. */
export const jsonLdScript = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
