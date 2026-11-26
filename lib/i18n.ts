/**
 * Locales and URL helpers. English lives at the bare paths (/projects) and is
 * rewritten to /en/... by proxy.ts; Portuguese lives under /pt-br/...
 */
export const locales = ["en", "pt-br"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Cookie that remembers the visitor's choice from the language toggle. */
export const LOCALE_COOKIE = "lang";

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (locales as readonly string[]).includes(value);

/** Value for <html lang> and hreflang. */
export const htmlLang: Record<Locale, string> = { en: "en", "pt-br": "pt-BR" };
/** Value for og:locale. */
export const ogLocale: Record<Locale, string> = { en: "en_US", "pt-br": "pt_BR" };
/** Value for Intl formatters. */
export const intlLocale: Record<Locale, string> = { en: "en-US", "pt-br": "pt-BR" };

/** Public URL path of `path` (locale-free, starting with "/") in `locale`. */
export function localePath(locale: Locale, path = "/") {
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Drops the locale prefix from a pathname: /pt-br/projects → /projects. */
export function stripLocale(pathname: string) {
  for (const l of locales) {
    if (pathname === `/${l}`) return "/";
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1);
  }
  return pathname;
}
