"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useThemeTransition } from "@/lib/theme-transition";
import { useI18n } from "@/lib/locale-client";

export const iconButton =
  "relative w-fit cursor-pointer p-1.5 rounded-full hover:bg-mutedBackground border border-transparent hover:border-border transition-colors duration-300 text-muted hover:text-mutedForeground";

export function ThemeToggle() {
  const toggleTheme = useThemeTransition();
  const { dict } = useI18n();
  return (
    <button
      type="button"
      aria-label={dict.theme.toggle}
      className={iconButton}
      onClick={toggleTheme}
    >
      <SunIcon className="size-4 hidden dark:block" />
      <MoonIcon className="size-4 block dark:hidden" />
    </button>
  );
}
