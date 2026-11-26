import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CommandMenu } from "@/components/command-menu";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SoundProvider } from "@/components/sound-provider";
import { Row } from "@/components/frame";
import { profile } from "@/data/profile";
import { jsonLdScript, keywords, pageMetadata, siteJsonLd, siteName, siteUrl } from "@/lib/seo";
import { htmlLang, locales } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import "../globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  // Canonical is set per page (home in page.tsx), so 404s don't inherit "/".
  const { alternates: _, ...base } = pageMetadata({ locale, type: "profile" });
  return {
    ...base,
    metadataBase: new URL(siteUrl),
    title: { default: `${profile.name} · ${profile.role}`, template: `%s · ${profile.name}` },
    applicationName: siteName,
    authors: [{ name: profile.name, url: siteUrl }],
    creator: profile.name,
    publisher: profile.name,
    keywords,
    category: "technology",
    formatDetection: { email: false, address: false, telephone: false },
    // Search Console / Bing Webmaster ownership, set in the deploy environment.
    verification: {
      ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
      ...(process.env.BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } } : {}),
    },
    // Indexing is the default; only widen Google's previews (keeps 404's noindex unchallenged).
    robots: { googleBot: { "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "light dark",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  return (
    <html lang={htmlLang[locale]} suppressHydrationWarning>
      <body
        className={`${geist.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(siteJsonLd(locale)) }}
        />
        <ThemeProvider>
          <Navbar />
          <main className="w-full flex-1 overflow-x-clip flex flex-col">
            {children}
            {/* Keeps the column side borders down to the footer on short pages. */}
            <Row className="flex-1 w-full" />
          </main>
          <Footer />
          <CommandMenu />
          <ScrollToTop />
          <SoundProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
