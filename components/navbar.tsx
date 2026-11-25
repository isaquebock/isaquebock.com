"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { OPEN_COMMAND_MENU } from "./command-menu";
import { ThemeToggle, iconButton } from "./theme-toggle";
import { SoundToggle } from "./sound-toggle";
import { HLine, Row } from "./frame";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/experiences", label: "Experience" },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <Row as="nav" className="px-3 h-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ul className="flex items-center gap-3">
            {links.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    data-cuelume-navigate="select"
                    href={l.href}
                    className={`text-sm font-medium transition-colors duration-300 ${active ? "text-foreground" : "text-muted hover:text-mutedForeground"}`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Search (⌘K)"
            className={`${iconButton} flex items-center gap-1.5`}
            onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_MENU))}
          >
            <SearchIcon className="size-4" />
            <kbd className="hidden sm:block text-[11px] font-mono">⌘K</kbd>
          </button>
          <SoundToggle />
          <ThemeToggle />
        </div>
      </Row>
      <HLine />
    </header>
  );
}
