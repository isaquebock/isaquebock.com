"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/sound";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useThemeTransition } from "@/lib/theme-transition";
import { Command } from "cmdk";
import { BriefcaseIcon, FolderIcon, HomeIcon, MoonIcon, SunIcon } from "lucide-react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { SocialIcon } from "./brand-icons";

export const OPEN_COMMAND_MENU = "open-command-menu";

const item =
  "flex items-center gap-2.5 px-2.5 py-2 text-sm rounded-[8px] cursor-pointer text-foreground data-[selected=true]:bg-mutedBackground data-[selected=true]:text-title select-none";
const group =
  "[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:text-muted";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const firstRender = useRef(true);
  const selected = useRef(false);

  // Som ao abrir e fechar a busca (escolher um item já toca "select").
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (open) sfx("open");
    else if (!selected.current) sfx("close");
    selected.current = false;
  }, [open]);
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const toggleTheme = useThemeTransition();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_MENU, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_MENU, onOpen);
    };
  }, []);

  const run = useCallback((fn: () => void) => {
    selected.current = true;
    sfx("select");
    setOpen(false);
    fn();
  }, []);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Search"
      overlayClassName="fixed inset-0 z-[100] bg-black/30 backdrop-blur-xs"
      contentClassName="fixed left-1/2 top-[18%] z-[101] w-[calc(100%-2rem)] max-w-[520px] -translate-x-1/2 rounded-[14px] border border-border bg-card shadow-2xl overflow-hidden"
    >
      <Command.Input
        placeholder="Search pages, projects, links..."
        className="w-full px-4 py-3 text-sm bg-transparent border-b border-border outline-none text-foreground placeholder:text-muted"
      />
      <Command.List className="max-h-[340px] overflow-y-auto p-1.5">
        <Command.Empty className="py-6 text-center text-sm text-muted">No results found.</Command.Empty>

        <Command.Group heading="Pages" className={group}>
          <Command.Item className={item} onSelect={() => run(() => router.push("/"))}>
            <HomeIcon className="size-4 text-muted" /> Home
          </Command.Item>
          <Command.Item className={item} onSelect={() => run(() => router.push("/projects"))}>
            <FolderIcon className="size-4 text-muted" /> Projects
          </Command.Item>
          <Command.Item className={item} onSelect={() => run(() => router.push("/experiences"))}>
            <BriefcaseIcon className="size-4 text-muted" /> Experience
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Projects" className={group}>
          {projects.map((p) => (
            <Command.Item
              key={p.slug}
              value={`project ${p.title} ${p.slug}`}
              className={item}
              onSelect={() => run(() => router.push(`/projects/${p.slug}`))}
            >
              <FolderIcon className="size-4 text-muted" /> {p.title}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Socials" className={group}>
          {profile.socials.map((s) => (
            <Command.Item key={s.name} className={item} onSelect={() => run(() => window.open(s.href, "_blank"))}>
              <SocialIcon name={s.icon} className="size-4 text-muted" /> {s.name}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Theme" className={group}>
          <Command.Item
            className={item}
            onSelect={() => run(toggleTheme)}
          >
            {resolvedTheme === "dark" ? <SunIcon className="size-4 text-muted" /> : <MoonIcon className="size-4 text-muted" />}
            Toggle theme
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
