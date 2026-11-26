import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, defaultLocale, isLocale, locales } from "@/lib/i18n";

/**
 * English is served at the bare paths and rewritten to /en/... internally;
 * other locales keep their prefix (/pt-br/...). /en/... is redirected to the
 * bare path so each page has a single URL per language.
 *
 * First visit with no saved choice: a browser that prefers Portuguese is sent
 * to /pt-br. The language toggle saves the choice in the `lang` cookie.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (first === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }
  if (isLocale(first)) return;

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const preferred = isLocale(saved) ? saved : fromHeader(request);
  if (preferred !== defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(url);
}

/** Best supported locale from Accept-Language (pt, pt-BR, pt-PT → pt-br). */
function fromHeader(request: NextRequest) {
  const header = request.headers.get("accept-language") ?? "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().toLowerCase().split(";q=");
      return { tag, q: q ? Number(q) : 1 };
    })
    .filter((l) => l.tag)
    .sort((a, b) => b.q - a.q);
  for (const { tag } of ranked) {
    if (tag.startsWith("pt")) return "pt-br" as const;
    if (tag.startsWith("en")) return defaultLocale;
    const exact = locales.find((l) => l === tag);
    if (exact) return exact;
  }
  return defaultLocale;
}

export const config = {
  // Everything except Next internals, API routes, metadata files and static assets.
  matcher: [
    "/((?!_next|api|images|icon|apple-icon|opengraph-image|robots.txt|sitemap.xml|manifest.webmanifest|favicon.ico|.*\\.[a-z0-9]+$).*)",
  ],
};
