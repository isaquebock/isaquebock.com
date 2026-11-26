"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALE_COOKIE, localePath, stripLocale, type Locale } from "@/lib/i18n";
import { useI18n } from "@/lib/locale-client";
import { sfx } from "@/lib/sound";

/** Saves the choice (read by proxy.ts) and opens the same page in the other language. */
export function useSwitchLocale() {
  const router = useRouter();
  const pathname = usePathname();
  return (next: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.push(localePath(next, stripLocale(pathname)));
  };
}

/**
 * Flat, single-colour flags drawn in currentColor: the shapes are cut out of
 * the field (fill-rule evenodd) or shaded with opacity, so they follow the
 * icon colour like the other navbar icons.
 */
function FlagBR({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" className={className} fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M0 0h20v14H0Z M10 2 2 7l8 5 8-5Z" opacity="0.55" />
      <path fillRule="evenodd" d="M10 2 2 7l8 5 8-5Z M10 4.1a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 1 0 0-5.8Z" opacity="0.25" />
      <circle cx="10" cy="7" r="2.9" />
    </svg>
  );
}

function FlagUS({ className }: { className?: string }) {
  const h = 14 / 13;
  return (
    <svg viewBox="0 0 20 14" className={className} fill="currentColor" aria-hidden>
      {[0, 2, 4, 6, 8, 10, 12].map((k) => (
        <rect key={k} y={k * h} width="20" height={h} opacity="0.55" />
      ))}
      <rect width="9" height={h * 7} />
    </svg>
  );
}

/** One button showing the flag of the other language: BR on English pages, US on Portuguese ones. */
export function LanguageToggle() {
  const { locale, dict } = useI18n();
  const switchLocale = useSwitchLocale();
  const next: Locale = locale === "en" ? "pt-br" : "en";
  const Flag = next === "pt-br" ? FlagBR : FlagUS;

  return (
    <button
      type="button"
      aria-label={dict.language.switchTo}
      className="relative w-fit cursor-pointer p-1.5 text-muted hover:text-mutedForeground transition-colors duration-300"
      onClick={() => {
        sfx("toggle", { direction: next === "en" ? "back" : "forward" });
        switchLocale(next);
      }}
    >
      <span className="grid size-4 place-items-center">
        <Flag className="w-4 h-[11px] rounded-[1.5px]" />
      </span>
    </button>
  );
}
