import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GlobeIcon, CodeIcon } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { Chip } from "@/components/skills";
import { HLine, Row } from "@/components/frame";
import { ProjectCover } from "@/components/dither/project-cover";
import { projects } from "@/data/projects";
import { getProject } from "@/data/localized";
import { localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/locale-server";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const { locale } = await getI18n();
  const project = getProject(locale, slug);
  return project
    ? pageMetadata({ locale, title: project.title, description: project.description, path: `/projects/${project.slug}`, type: "article" })
    : {};
}

/** Turns **bold** into <strong>. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") ? (
          <strong key={i} className="font-medium text-strong">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default async function ProjectPage(props: PageProps<"/[lang]/projects/[slug]">) {
  const { slug } = await props.params;
  const { locale, dict } = await getI18n();
  const project = getProject(locale, slug);
  if (!project) notFound();

  return (
    <article>
      <Row className="p-3 flex flex-col gap-3">
        <h1 className="text-[1.75rem] font-semibold tracking-tight text-title">
          <Link href={localePath(locale, "/projects")} className="text-muted hover:text-mutedForeground transition-colors">
            {dict.projectsPage.title}
          </Link>
          <span className="text-muted">/</span>
          {project.title}
        </h1>
        {(project.links.github || project.links.website) && (
          <div className="flex flex-wrap items-center gap-2">
            {project.links.github && (
              <ButtonLink href={project.links.github} icon={CodeIcon} variant="secondary">
                GitHub
              </ButtonLink>
            )}
            {project.links.website && (
              <ButtonLink href={project.links.website} icon={GlobeIcon}>
                Website
              </ButtonLink>
            )}
          </div>
        )}
      </Row>
      <HLine />

      <Row className="p-3">
        <div className="rounded-[14px] border border-border p-[4px] bg-card">
          <div className="relative overflow-hidden rounded-[10px] border border-border aspect-[16/8]">
            <ProjectCover variant={project.cover} className="absolute inset-0" />
          </div>
        </div>
      </Row>
      <HLine />

      <Row className="p-3 flex flex-col gap-6">
      {project.tags.length > 0 && (
        <div className="flex gap-[7px] flex-wrap">
          {project.tags.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="leading-relaxed">{project.description}</p>
        {project.highlights.length > 0 && (
        <ul className="list-disc pl-5 flex flex-col gap-1.5 text-[15px] marker:text-muted">
          {project.highlights.map((h) => (
            <li key={h}>
              <Rich text={h} />
            </li>
          ))}
        </ul>
        )}
      </div>

      {project.stack.length > 0 && (
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium tracking-tight text-title">{dict.project.stack}</h2>
        <div className="flex gap-[7px] flex-wrap">
          {project.stack.map((s) => (
            <Chip key={s} href={`https://www.google.com/search?q=${encodeURIComponent(s)}`}>
              {s}
            </Chip>
          ))}
        </div>
      </div>
      )}
      </Row>
      <HLine />
    </article>
  );
}
