import { lang } from "next/root-params";
import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

/** Current locale in Server Components (from the [lang] root segment). */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  return isLocale(value) ? value : defaultLocale;
}

/** Current locale and its interface strings. */
export async function getI18n() {
  const locale = await getLocale();
  return { locale, dict: getDictionary(locale) };
}
