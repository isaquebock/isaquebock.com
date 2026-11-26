import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HLine, Row } from "@/components/frame";
import { getPost, posts } from "@/data/writing";
import { profile } from "@/data/profile";
import { htmlLang, intlLocale, localePath } from "@/lib/i18n";
import { Markdown } from "@/lib/markdown";
import { JsonLd, breadcrumbJsonLd, pageMetadata, siteUrl } from "@/lib/seo";
import { getI18n } from "@/lib/locale-server";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/[lang]/writing/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const { locale } = await getI18n();
  const post = getPost(slug);
  if (!post) return {};
  const meta = pageMetadata({
    locale,
    title: post.title[locale],
    description: post.summary[locale],
    path: `/writing/${post.slug}`,
    type: "article",
  });
  return {
    ...meta,
    openGraph: { ...meta.openGraph, type: "article", publishedTime: post.date, authors: [profile.name], tags: post.tags },
  };
}

export default async function PostPage(props: PageProps<"/[lang]/writing/[slug]">) {
  const { slug } = await props.params;
  const { locale, dict } = await getI18n();
  const post = getPost(slug);
  if (!post) notFound();

  const t = dict.writingPage;
  const title = post.title[locale];
  const url = `${siteUrl}${localePath(locale, `/writing/${post.slug}`)}`;
  const date = new Intl.DateTimeFormat(intlLocale[locale], { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${post.date}T12:00:00Z`),
  );

  return (
    <article>
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            [t.title, "/writing"],
            [title, `/writing/${post.slug}`],
          ]),
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: title,
            description: post.summary[locale],
            datePublished: post.date,
            inLanguage: htmlLang[locale],
            url,
            mainEntityOfPage: url,
            keywords: post.tags.join(", "),
            author: { "@id": `${siteUrl}/#person` },
          },
        ]}
      />
      <Row className="p-3 flex flex-col gap-3">
        <p className="flex items-center gap-2 font-mono text-xs text-muted">
          <Link href={localePath(locale, "/writing")} className="hover:text-mutedForeground transition-colors">
            {t.title}
          </Link>
          <span>/</span>
          <span className="text-mutedForeground">{post.kind === "log" ? t.log : t.article}</span>
        </p>
        <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-title">{title}</h1>
        <time dateTime={post.date} className="font-mono text-xs text-muted">
          {date}
        </time>
      </Row>
      <HLine />
      <Row className="p-3 py-6">
        <Markdown source={post.body[locale]} />
      </Row>
      <HLine />
      <Row className="p-2">
        <div className="flex justify-center">
          <Link
            data-cuelume-navigate="select"
            href={localePath(locale, "/writing")}
            className="text-sm font-medium text-muted hover:text-mutedForeground transition-colors duration-300"
          >
            ← {t.back}
          </Link>
        </div>
      </Row>
      <HLine />
    </article>
  );
}
