"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { OPEN_COMMAND_MENU } from "./command-menu";
import { ThemeToggle, iconButton } from "./theme-toggle";
import { SoundToggle } from "./sound-toggle";
import { HLine, Row } from "./frame";
import { LanguageToggle } from "./language-toggle";
import { Tooltip } from "./tooltip";
import { localePath, stripLocale } from "@/lib/i18n";
import { useI18n } from "@/lib/locale-client";

export function Navbar() {
  const { locale, dict } = useI18n();
  const pathname = stripLocale(usePathname());
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const linkClass = (active: boolean) =>
    `text-[13px] leading-5 font-medium transition-colors duration-300 ${active ? "text-foreground" : "text-muted hover:text-mutedForeground"}`;
  const links = [
    { href: "/", label: dict.nav.home },
    { href: "/projects", label: dict.nav.projects },
    { href: "/experiences", label: dict.nav.experience },
    { href: "/resources", label: dict.nav.resources },
    { href: "/writing", label: dict.nav.writing },
  ];
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <Row as="nav" className="px-3 h-12 flex items-center justify-between">
        {/* On narrow screens the links scroll sideways instead of pushing the buttons off. */}
        <div className="flex min-w-0 items-center gap-4">
          <ul className="flex items-center gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <li key={l.href} className="flex shrink-0">
                  <Link
                    data-cuelume-navigate="select"
                    href={localePath(locale, l.href)}
                    className={linkClass(active)}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Tooltip label={dict.nav.search}>
            <button
              type="button"
              aria-label={dict.nav.search}
              className={`${iconButton} flex items-center gap-1.5`}
              onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_MENU))}
            >
              <SearchIcon className="size-4" />
              <kbd className="hidden sm:block text-[11px] font-mono">⌘K</kbd>
            </button>
          </Tooltip>
          <SoundToggle />
          <Tooltip label={dict.theme.toggle}>
            <ThemeToggle />
          </Tooltip>
          <Tooltip label={dict.language.switchTo} align="end">
            <LanguageToggle />
          </Tooltip>
        </div>
      </Row>
      <HLine />
    </header>
  );
}
