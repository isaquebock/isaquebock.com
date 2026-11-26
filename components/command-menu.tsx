"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/sound";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useThemeTransition } from "@/lib/theme-transition";
import { Command } from "cmdk";
import { BookmarkIcon, BriefcaseIcon, PenLineIcon, FolderIcon, HomeIcon, LanguagesIcon, MoonIcon, SunIcon, TerminalIcon } from "lucide-react";
import { Terminal } from "./terminal";
import { profile } from "@/data/profile";
import { SocialIcon } from "./brand-icons";
import { localePath } from "@/lib/i18n";
import { useI18n } from "@/lib/locale-client";
import { getProjects } from "@/data/localized";
import { useSwitchLocale } from "./language-toggle";

export const OPEN_COMMAND_MENU = "open-command-menu";

const item =
  "flex items-center gap-2.5 px-2.5 py-2 text-sm rounded-[8px] cursor-pointer text-foreground data-[selected=true]:bg-mutedBackground data-[selected=true]:text-title select-none";
const group =
  "[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:text-muted";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [terminal, setTerminal] = useState(false);
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
  const { locale, dict } = useI18n();
  const projects = getProjects(locale);
  const switchLocale = useSwitchLocale();
  const go = (path: string) => router.push(localePath(locale, path));
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

  const changeOpen = (next: boolean) => {
    setOpen(next);
    if (!next) {
      // Ao fechar, a busca volta ao normal na próxima vez.
      setTerminal(false);
      setSearch("");
    }
  };

  const run = useCallback((fn: () => void) => {
    selected.current = true;
    sfx("select");
    setOpen(false);
    fn();
  }, []);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={changeOpen}
      shouldFilter={!terminal}
      label={dict.command.label}
      overlayClassName="fixed inset-0 z-[100] bg-black/30 backdrop-blur-xs"
      contentClassName="fixed left-1/2 top-[18%] z-[101] w-[calc(100%-2rem)] max-w-[520px] -translate-x-1/2 rounded-[14px] border border-border bg-card shadow-2xl overflow-hidden"
    >
      {terminal ? (
        <Terminal
          onExit={() => {
            setTerminal(false);
            setSearch("");
          }}
          onClose={() => changeOpen(false)}
        />
      ) : (
      <>
      <Command.Input
        value={search}
        onValueChange={setSearch}
        placeholder={dict.command.placeholder}
        className="w-full px-4 py-3 text-sm bg-transparent border-b border-border outline-none text-foreground placeholder:text-muted"
      />
      <Command.List className="max-h-[340px] overflow-y-auto p-1.5">
        {/* Easter egg: só aparece quando a busca começa com "/". */}
        {search.startsWith("/") && (
          <Command.Item
            value="/terminal"
            className={item}
            onSelect={() => {
              sfx("open", { emphasis: "subtle" });
              setTerminal(true);
            }}
          >
            <TerminalIcon className="size-4 text-muted" /> /terminal
            <span className="ml-auto text-xs text-muted">{dict.command.terminal}</span>
          </Command.Item>
        )}
        <Command.Empty className="py-6 text-center text-sm text-muted">{dict.command.empty}</Command.Empty>

        <Command.Group heading={dict.command.pages} className={group}>
          <Command.Item className={item} onSelect={() => run(() => go("/"))}>
            <HomeIcon className="size-4 text-muted" /> {dict.nav.home}
          </Command.Item>
          <Command.Item className={item} onSelect={() => run(() => go("/projects"))}>
            <FolderIcon className="size-4 text-muted" /> {dict.nav.projects}
          </Command.Item>
          <Command.Item className={item} onSelect={() => run(() => go("/experiences"))}>
            <BriefcaseIcon className="size-4 text-muted" /> {dict.nav.experience}
          </Command.Item>
          <Command.Item className={item} onSelect={() => run(() => go("/resources"))}>
            <BookmarkIcon className="size-4 text-muted" /> {dict.nav.resources}
          </Command.Item>
          <Command.Item className={item} onSelect={() => run(() => go("/writing"))}>
            <PenLineIcon className="size-4 text-muted" /> {dict.nav.writing}
          </Command.Item>
        </Command.Group>

        <Command.Group heading={dict.command.projects} className={group}>
          {projects.map((p) => (
            <Command.Item
              key={p.slug}
              value={`project ${p.title} ${p.slug}`}
              className={item}
              onSelect={() => run(() => go(`/projects/${p.slug}`))}
            >
              <FolderIcon className="size-4 text-muted" /> {p.title}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading={dict.command.socials} className={group}>
          {profile.socials.map((s) => (
            <Command.Item key={s.name} className={item} onSelect={() => run(() => window.open(s.href, "_blank"))}>
              <SocialIcon name={s.icon} className="size-4 text-muted" /> {s.name}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading={dict.command.theme} className={group}>
          <Command.Item
            className={item}
            onSelect={() => run(toggleTheme)}
          >
            {resolvedTheme === "dark" ? <SunIcon className="size-4 text-muted" /> : <MoonIcon className="size-4 text-muted" />}
            {dict.theme.toggle}
          </Command.Item>
        </Command.Group>

        <Command.Group heading={dict.command.language} className={group}>
          <Command.Item
            className={item}
            onSelect={() => run(() => switchLocale(locale === "en" ? "pt-br" : "en"))}
          >
            <LanguagesIcon className="size-4 text-muted" />
            {dict.command.switchLanguage}
          </Command.Item>
        </Command.Group>
      </Command.List>
      </>
      )}
    </Command.Dialog>
  );
}
