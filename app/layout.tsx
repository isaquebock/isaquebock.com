import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CommandMenu } from "@/components/command-menu";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SoundProvider } from "@/components/sound-provider";
import { Row } from "@/components/frame";
import { profile } from "@/data/profile";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: profile.name, template: `%s · ${profile.name}` },
  description: `${profile.name} · ${profile.role}`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
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
