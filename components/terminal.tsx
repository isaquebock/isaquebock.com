"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { getExperiences } from "@/data/localized";
import { useI18n } from "@/lib/locale-client";
import { sfx } from "@/lib/sound";
import { buildFileSystem, resolvePath } from "@/lib/terminal-files";
import { RunnerGame } from "./game/runner-game";

/**
 * Easter-egg terminal inside the command menu (type "/" in the search).
 * Commands: help [cmd], whoami, ls, cd <dir>, cat <file>, pwd, play, clear, exit.
 * Files and folders come from lib/terminal-files.ts.
 */

type Line = { kind: "input" | "output" | "error"; text: string; cwd?: string };

const prompt = (cwd: string) => `${profile.githubUsername}@site ${cwd} %`;
const COMMANDS = ["help", "whoami", "ls", "cd", "cat", "pwd", "play", "clear", "exit"];

export function Terminal({ onExit }: { onExit: () => void }) {
  const { locale, dict } = useI18n();
  const t = dict.terminal;
  const [lines, setLines] = useState<Line[]>([{ kind: "output", text: t.welcome }]);
  const [value, setValue] = useState("");
  const [playing, setPlaying] = useState(false);
  const [cwd, setCwd] = useState("~");
  const fs = useMemo(() => buildFileSystem(locale), [locale]);
  const history = useRef<string[]>([]);
  const cursor = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, playing]);

  const stopGame = () => {
    setPlaying(false);
    sfx("close", { emphasis: "subtle" });
    setLines((l) => [...l, { kind: "output", text: t.closed }]);
  };

  useEffect(() => {
    if (!playing) {
      inputRef.current?.focus();
      return;
    }
    // While playing, Esc closes the game only (not the whole dialog), and the
    // swarm cursors hide like they do for the banner game.
    document.documentElement.classList.add("game-active");
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopImmediatePropagation();
      stopGame();
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => {
      document.documentElement.classList.remove("game-active");
      window.removeEventListener("keydown", onKey, { capture: true });
    };
  }, [playing]);

  const run = (raw: string) => {
    const input = raw.trim();
    const out: Line[] = [{ kind: "input", text: input, cwd }];
    if (input) {
      history.current.push(input);
      cursor.current = -1;
    }
    const [cmd, ...args] = input.split(/\s+/);

    switch (cmd) {
      case "":
        break;
      case "help": {
        const topic = args[0];
        if (topic) {
          const entry = t.help.find(([c]) => c.split(" ")[0] === topic);
          if (!entry) {
            out.push({ kind: "error", text: t.notFound(topic) });
            break;
          }
          out.push({ kind: "output", text: `${entry[0]}\n  ${entry[1]}\n\n${t.example}: ${t.examples[topic] ?? topic}` });
          break;
        }
        const width = Math.max(...t.help.map(([c]) => c.length)) + 3;
        out.push({
          kind: "output",
          text: [...t.help.map(([c, d]) => `  ${c.padEnd(width)}${d}`), "", t.helpTips].join("\n"),
        });
        break;
      }
      case "whoami": {
        const current = getExperiences(locale)[0];
        out.push({
          kind: "output",
          text: [`${profile.name} · ${profile.role}`, current ? `${t.working} ${current.company}` : ""]
            .filter(Boolean)
            .join("\n"),
        });
        break;
      }
      case "pwd":
        out.push({ kind: "output", text: cwd });
        break;
      case "ls": {
        const target = resolvePath(cwd, args[0]);
        if (fs.dirs[target]) out.push({ kind: "output", text: fs.dirs[target].join("   ") });
        else if (fs.files[target]) out.push({ kind: "output", text: args[0] });
        else out.push({ kind: "error", text: `ls: ${args[0]}: No such file or directory` });
        break;
      }
      case "cd": {
        const target = resolvePath(cwd, args[0]);
        if (fs.dirs[target]) setCwd(target);
        else if (fs.files[target]) out.push({ kind: "error", text: `cd: not a directory: ${args[0]}` });
        else out.push({ kind: "error", text: `cd: no such file or directory: ${args[0]}` });
        break;
      }
      case "cat":
        if (!args.length) {
          out.push({ kind: "error", text: "usage: cat <file>" });
          break;
        }
        for (const name of args) {
          const target = resolvePath(cwd, name);
          if (fs.files[target]) out.push({ kind: "output", text: fs.files[target] });
          else if (fs.dirs[target]) out.push({ kind: "error", text: `cat: ${name}: Is a directory` });
          else out.push({ kind: "error", text: `cat: ${name}: No such file or directory` });
        }
        break;
      case "play":
        out.push({ kind: "output", text: t.launching });
        setLines((l) => [...l, ...out]);
        setValue("");
        setPlaying(true);
        sfx("open", { emphasis: "subtle" });
        return;
      case "clear":
        setLines([]);
        setValue("");
        return;
      case "exit":
        setValue("");
        onExit();
        return;
      default:
        out.push({ kind: "error", text: t.notFound(cmd) });
    }
    setLines((l) => [...l, ...out]);
    setValue("");
  };

  /** Tab completes the command, or a file/folder name in the current folder. */
  const complete = () => {
    const parts = value.split(" ");
    const last = parts[parts.length - 1];
    let pool: string[] = [];
    if (parts.length === 1) pool = COMMANDS;
    else if (parts[0] === "help") pool = COMMANDS;
    else if (["cd", "cat", "ls"].includes(parts[0])) {
      const entries = fs.dirs[cwd] ?? [];
      pool = parts[0] === "cd" ? entries.filter((e) => e.endsWith("/")) : entries;
    }
    const matches = pool.filter((p) => p.startsWith(last));
    if (matches.length === 1) {
      parts[parts.length - 1] = matches[0];
      setValue(parts.join(" ") + (parts.length === 1 ? " " : ""));
    } else if (matches.length > 1) {
      setLines((l) => [...l, { kind: "input", text: value, cwd }, { kind: "output", text: matches.join("   ") }]);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Keep cmdk from treating Enter/arrows as list navigation.
    e.stopPropagation();
    if (e.key === "Enter") run(value);
    else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const h = history.current;
      if (!h.length) return;
      if (e.key === "ArrowUp") cursor.current = cursor.current < 0 ? h.length - 1 : Math.max(0, cursor.current - 1);
      else cursor.current = cursor.current < 0 || cursor.current + 1 >= h.length ? -1 : cursor.current + 1;
      setValue(cursor.current < 0 ? "" : h[cursor.current]);
    } else if (e.key.toLowerCase() === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div onClick={() => !playing && inputRef.current?.focus()}>
      <div ref={scrollRef} className="h-[min(380px,60vh)] overflow-y-auto px-3.5 py-3 font-mono text-[12.5px] leading-relaxed">
        {lines.map((line, i) =>
          line.kind === "input" ? (
            <p key={i} className="whitespace-pre-wrap break-words text-foreground">
              <span className="text-[#00d26a]">{prompt(line.cwd ?? "~")}</span> {line.text}
            </p>
          ) : (
            <pre
              key={i}
              className={`whitespace-pre-wrap break-words font-mono ${line.kind === "error" ? "text-[#ff6b6b]" : "text-mutedForeground"}`}
            >
              {line.text}
            </pre>
          ),
        )}
        {playing ? (
          <div className="relative my-2 h-[180px] overflow-hidden rounded-[10px] border border-border">
            <RunnerGame labels={dict.game} onExit={stopGame} />
          </div>
        ) : (
          <label className="flex items-center gap-2 text-foreground">
            <span className="shrink-0 text-[#00d26a]">{prompt(cwd)}</span>
            <input
              ref={inputRef}
              data-cuelume-type=""
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              aria-label="Terminal"
              className="min-w-0 flex-1 bg-transparent outline-none caret-[#00d26a]"
            />
          </label>
        )}
      </div>
    </div>
  );
}
