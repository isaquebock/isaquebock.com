import type { Metadata } from "next";
import { WritingFeed, type FeedItem } from "@/components/writing-feed";
import { posts } from "@/data/writing";
import { intlLocale, localePath } from "@/lib/i18n";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { getI18n } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  return pageMetadata({ locale, title: dict.writingPage.title, description: dict.writingPage.description, path: "/writing" });
}

export default async function WritingPage() {
  const { locale, dict } = await getI18n();
  const format = new Intl.DateTimeFormat(intlLocale[locale], { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

  // Articles and study logs in one list, newest first; the client decides whether logs show.
  const items: FeedItem[] = [...posts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((p) => ({
      kind: p.kind,
      slug: p.slug,
      href: localePath(locale, `/writing/${p.slug}`),
      date: p.date,
      dateLabel: format.format(new Date(`${p.date}T12:00:00Z`)),
      title: p.title[locale],
      summary: p.summary[locale],
      tags: p.tags,
    }));

  const t = dict.writingPage;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, [[t.title, "/writing"]])} />
      <WritingFeed
        items={items}
        labels={{
          title: t.title,
          subtitle: t.subtitle,
          showLogs: t.showLogs,
          log: t.log,
          empty: t.empty,
          emptyWithLogs: t.emptyWithLogs,
        }}
      />
    </>
  );
}
