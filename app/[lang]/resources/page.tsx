import type { Metadata } from "next";
import { DashedGrid, HLine, Row } from "@/components/frame";
import { resourceCount, resources, type Resource } from "@/data/resources";
import { intlLocale, type Locale } from "@/lib/i18n";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { getI18n } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  return pageMetadata({
    locale,
    title: dict.resourcesPage.title,
    description: dict.resourcesPage.description,
    path: "/resources",
  });
}

const domain = (href: string) => new URL(href).hostname.replace(/^www\./, "");

/** Site favicon via Google's favicon service. */
const favicon = (href: string) => `https://www.google.com/s2/favicons?domain=${domain(href)}&sz=64`;

/** One compact line: favicon + name. The note shows as a tooltip and is read by screen readers. */
function ResourceLink({ item, locale }: { item: Resource; locale: Locale }) {
  return (
    <a
      data-cuelume-tap=""
      data-cuelume-emphasis="subtle"
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      title={item.note[locale]}
      className="group flex items-center gap-2 py-[5px] text-sm text-mutedForeground hover:text-title transition-colors duration-200"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={favicon(item.href)}
        alt=""
        width={14}
        height={14}
        loading="lazy"
        className="size-3.5 shrink-0 rounded-[3px] grayscale opacity-70 transition duration-200 group-hover:grayscale-0 group-hover:opacity-100"
      />
      <span className="truncate">{item.name}</span>
      <span className="sr-only">: {item.note[locale]}</span>
    </a>
  );
}

export default async function ResourcesPage() {
  const { locale, dict } = await getI18n();
  const collator = new Intl.Collator(intlLocale[locale], { sensitivity: "base", ignorePunctuation: true });

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, [[dict.resourcesPage.title, "/resources"]])} />
      <Row className="p-3">
        <h1 className="text-[1.75rem] font-semibold tracking-tight text-title">{dict.resourcesPage.title}</h1>
        <p className="text-sm text-mutedForeground">{dict.resourcesPage.subtitle(resourceCount)}</p>
      </Row>
      <HLine />
      <Row>
        <DashedGrid>
          {resources.map((category) => (
            <section key={category.id} id={category.id} className="flex flex-col gap-1.5 scroll-mt-16">
              <h2 className="flex items-baseline justify-between font-mono text-xs text-muted">
                <span>{category.title[locale]}</span>
                <span className="tabular-nums">{category.items.length}</span>
              </h2>
              <ul className="flex flex-col">
                {[...category.items]
                  .sort((a, b) => collator.compare(a.name, b.name))
                  .map((item) => (
                    <li key={item.href}>
                      <ResourceLink item={item} locale={locale} />
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </DashedGrid>
      </Row>
      <HLine />
    </>
  );
}
