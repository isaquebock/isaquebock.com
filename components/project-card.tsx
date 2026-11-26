import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import type { Project } from "@/data/projects";
import { ProjectCover } from "./dither/project-cover";
import { localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/locale-server";

export async function ProjectCard({ project }: { project: Project }) {
  const { locale, dict } = await getI18n();
  return (
    <Link data-cuelume-navigate="select" href={localePath(locale, `/projects/${project.slug}`)} className="group flex flex-col gap-2 w-full">
      <div className="p-[4px] rounded-[14px] border border-border bg-card">
        <div className="relative w-full aspect-[16/7] overflow-hidden rounded-[10px] border border-border bg-mutedBackground">
          <ProjectCover
            variant={project.cover}
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 px-1">
        <h3 className="font-medium tracking-tight text-title">{project.title}</h3>
        <p className="text-sm text-mutedForeground line-clamp-2">{project.description}</p>
        <span className="flex items-center gap-1 pt-1 text-sm font-medium text-muted group-hover:text-foreground transition-colors duration-300">
          {dict.project.view}
          <ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
