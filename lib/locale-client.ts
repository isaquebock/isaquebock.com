"use client";

import { useParams } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

/** Current locale in Client Components (from the [lang] route param). */
export function useLocale(): Locale {
  const { lang } = useParams<{ lang?: string }>();
  return isLocale(lang) ? lang : defaultLocale;
}

export function useI18n() {
  const locale = useLocale();
  return { locale, dict: getDictionary(locale) };
}
