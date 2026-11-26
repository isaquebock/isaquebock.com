import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { GithubIcon } from "@/components/brand-icons";
import { DashedGrid, HLine, Row } from "@/components/frame";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description: `Projects built by ${profile.name}: products, experiments and open source work.`,
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <Row className="p-3">
        <h1 className="text-[1.75rem] font-semibold tracking-tight text-title">Projects</h1>
        <p className="text-sm text-mutedForeground">All projects</p>
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
            <span className="text-sm font-medium">Coming soon</span>
          </a>
        </DashedGrid>
      </Row>
      <HLine />
      <Row className="p-2">
        <p className="text-center text-sm text-muted">
          More projects on{" "}
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
