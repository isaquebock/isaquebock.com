import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { Section } from "@/components/section";
import { DashedGrid, DashedList, HLine, Row } from "@/components/frame";
import { ProjectCard } from "@/components/project-card";
import { ExperienceItem } from "@/components/experience-item";
import { Skills } from "@/components/skills";
import { Newsletter } from "@/components/newsletter";
import { Quote } from "@/components/quote";
import { Now } from "@/components/now";
import { Build, SwarmProvider } from "@/components/swarm/swarm";
import { getExperiences, getProjects } from "@/data/localized";
import { getI18n, getLocale } from "@/lib/locale-server";
import { JsonLd, pageMetadata, profilePageJsonLd } from "@/lib/seo";
import { skills } from "@/data/skills";

export async function generateMetadata(): Promise<Metadata> {
  const { alternates } = pageMetadata({ locale: await getLocale(), path: "/" });
  return { alternates };
}

export default async function Home() {
  const { locale, dict } = await getI18n();
  const projects = getProjects(locale);
  const experiences = getExperiences(locale);
  const featured = projects.filter((p) => p.featured).slice(0, 4);

  return (
    <SwarmProvider>
      <JsonLd data={profilePageJsonLd(locale)} />
      <Hero />

      <Section id="projects" title={dict.sections.projects} aside={dict.sections.projectsCount(projects.length)} viewAllHref="/projects">
        <DashedGrid>
          {featured.map((p) => (
            <Build key={p.slug} id={`project-${p.slug}`} className="flex h-full">
              <ProjectCard project={p} />
            </Build>
          ))}
        </DashedGrid>
      </Section>

      <Now />

      <Section id="experience" title={dict.sections.experience} aside={dict.sections.positionsCount(experiences.length)} viewAllHref="/experiences">
        <DashedList>
          {experiences.slice(0, 3).map((e, i) => (
            <Build key={e.company + e.period} id={`experience-${i}`}>
              <ExperienceItem exp={e} />
            </Build>
          ))}
        </DashedList>
      </Section>

      <Section id="skills" title={dict.sections.skills} aside={`${skills.length}`} contentClassName="p-3">
        <Build id="skills">
          <Skills />
        </Build>
      </Section>

      <Row>
        <Build id="newsletter">
          <Newsletter />
        </Build>
      </Row>
      <HLine />
      <Row className="p-3">
        <Build id="quote">
          <Quote />
        </Build>
      </Row>
      <HLine />
    </SwarmProvider>
  );
}
