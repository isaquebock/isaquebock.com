import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Build } from "./swarm/swarm";
import { HLine, Row } from "./frame";
import { localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/locale-server";

export async function Section({
  id,
  title,
  aside,
  viewAllHref,
  contentClassName = "",
  children,
}: {
  /** Stable id for the swarm (titles change with the language). */
  id: string;
  title: string;
  aside?: string;
  viewAllHref?: string;
  contentClassName?: string;
  children: React.ReactNode;
}) {
  const { locale, dict } = await getI18n();
  return (
    <section>
      <Row className="p-3">
        <Build id={`section-${id}`} className="flex items-center justify-between">
          <h2 className="text-xl font-medium tracking-tight text-title">{title}</h2>
          {aside && <span className="font-mono text-xs text-muted tabular-nums">{aside}</span>}
        </Build>
      </Row>
      <HLine />
      <Row className={contentClassName}>{children}</Row>
      <HLine />
      {viewAllHref && (
        <>
          <Row className="p-2">
            <div className="flex items-center justify-center select-none">
              <Link
                data-cuelume-navigate="select"
                href={localePath(locale, viewAllHref)}
                className="flex items-center gap-1 text-sm font-medium text-muted hover:text-mutedForeground transition-colors duration-300 group"
              >
                {dict.sections.viewAll}
                <ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Row>
          <HLine />
        </>
      )}
    </section>
  );
}
