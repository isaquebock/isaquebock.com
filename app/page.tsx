import { Hero } from "@/components/hero";
import { Section } from "@/components/section";
import { DashedGrid, DashedList, HLine, Row } from "@/components/frame";
import { ProjectCard } from "@/components/project-card";
import { ExperienceItem } from "@/components/experience-item";
import { Skills } from "@/components/skills";
import { Newsletter } from "@/components/newsletter";
import { Quote } from "@/components/quote";
import { Build, SwarmProvider } from "@/components/swarm/swarm";
import { projects } from "@/data/projects";
import { experiences } from "@/data/experiences";
import { skills } from "@/data/skills";

export default function Home() {
  const featured = projects.filter((p) => p.featured).slice(0, 4);

  return (
    <SwarmProvider>
      <Hero />

      <Section title="Projects" aside={`${projects.length} projects`} viewAllHref="/projects">
        <DashedGrid>
          {featured.map((p) => (
            <Build key={p.slug} id={`project-${p.slug}`} className="flex h-full">
              <ProjectCard project={p} />
            </Build>
          ))}
        </DashedGrid>
      </Section>

      <Section title="Experience" aside={`${experiences.length} positions`} viewAllHref="/experiences">
        <DashedList>
          {experiences.slice(0, 3).map((e, i) => (
            <Build key={e.company + e.period} id={`experience-${i}`}>
              <ExperienceItem exp={e} />
            </Build>
          ))}
        </DashedList>
      </Section>

      <Section title="Skills & Technologies" aside={`${skills.length}`} contentClassName="p-3">
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
