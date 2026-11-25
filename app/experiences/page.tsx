import type { Metadata } from "next";
import { ExperienceItem } from "@/components/experience-item";
import { DashedList, HLine, Row } from "@/components/frame";
import { experiences } from "@/data/experiences";

export const metadata: Metadata = { title: "Experience" };

export default function ExperiencesPage() {
  return (
    <>
      <Row className="p-3">
        <h1 className="text-[1.75rem] font-semibold tracking-tight text-title">Experience</h1>
        <p className="text-sm text-mutedForeground">Where I&apos;ve worked and what I&apos;ve built</p>
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
