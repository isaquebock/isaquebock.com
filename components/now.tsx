import { getNow } from "@/data/localized";
import { intlLocale } from "@/lib/i18n";
import { getI18n } from "@/lib/locale-server";
import { Build } from "./swarm/swarm";
import { DashedList } from "./frame";
import { Section } from "./section";

/** "Now" section: what I'm working on at the moment (data/now.ts). */
export async function Now() {
  const { locale, dict } = await getI18n();
  const now = getNow(locale);
  const updated = new Date(`${now.updated}T12:00:00Z`).toLocaleDateString(intlLocale[locale], {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  return (
    <Section id="now" title={dict.sections.now} aside={dict.sections.updated(updated)}>
      <DashedList>
        {now.items.map((item, i) => (
          <div key={item.label} className="flex items-baseline gap-3">
            <Build id={`now-label-${i}`} as="span" className="w-[72px] shrink-0">
              <span className="font-mono text-xs text-muted">{item.label}</span>
            </Build>
            <p className="text-[15px] leading-relaxed text-foreground">
              <Build id={`now-${i}`} as="span" className="block" text={item.text} />
            </p>
          </div>
        ))}
      </DashedList>
    </Section>
  );
}
