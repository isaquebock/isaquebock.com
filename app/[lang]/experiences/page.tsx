import type { Metadata } from "next";
import { ExperienceItem } from "@/components/experience-item";
import { DashedList, HLine, Row } from "@/components/frame";
import { profile } from "@/data/profile";
import { pageMetadata } from "@/lib/seo";
import { getExperiences } from "@/data/localized";
import { getI18n } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  const companies = getExperiences(locale).map((e) => e.company).join(", ");
  return pageMetadata({
    locale,
    title: dict.experiencePage.title,
    description: dict.experiencePage.description(profile.name, companies),
    path: "/experiences",
  });
}

export default async function ExperiencesPage() {
  const { locale, dict } = await getI18n();
  const experiences = getExperiences(locale);
  return (
    <>
      <Row className="p-3">
        <h1 className="text-[1.75rem] font-semibold tracking-tight text-title">{dict.experiencePage.title}</h1>
        <p className="text-sm text-mutedForeground">{dict.experiencePage.subtitle}</p>
      </Row>
      <HLine />
      <Row>
        <DashedList>
          {experiences.map((e) => (
            <ExperienceItem key={e.company + e.period} exp={e} detailed />
          ))}
        </DashedList>
      </Row>
      <HLine />
    </>
  );
}
