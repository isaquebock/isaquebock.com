import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { GithubIcon } from "@/components/brand-icons";
import { DashedGrid, HLine, Row } from "@/components/frame";
import { profile } from "@/data/profile";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { getProjects } from "@/data/localized";
import { getI18n } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  return pageMetadata({
    locale,
    title: dict.projectsPage.title,
    description: dict.projectsPage.description(profile.name),
    path: "/projects",
  });
}

export default async function ProjectsPage() {
  const { locale, dict } = await getI18n();
  const projects = getProjects(locale);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, [[dict.projectsPage.title, "/projects"]])} />
      <Row className="p-3">
        <h1 className="text-[1.75rem] font-semibold tracking-tight text-title">{dict.projectsPage.title}</h1>
        <p className="text-sm text-mutedForeground">{dict.projectsPage.subtitle}</p>
      </Row>
      <HLine />
      <Row>
        <DashedGrid>
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
          <a
            key="coming-soon"
            href={`https://github.com/${profile.githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 h-full min-h-[220px] rounded-[14px] border border-dashed border-border bg-checker text-muted hover:text-mutedForeground transition-colors duration-300"
          >
            <GithubIcon className="size-6" />
            <span className="text-sm font-medium">{dict.projectsPage.comingSoon}</span>
          </a>
        </DashedGrid>
      </Row>
      <HLine />
      <Row className="p-2">
        <p className="text-center text-sm text-muted">
          {dict.projectsPage.moreOn}{" "}
          <a
            href={`https://github.com/${profile.githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-mutedForeground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </p>
      </Row>
      <HLine />
    </>
  );
}
