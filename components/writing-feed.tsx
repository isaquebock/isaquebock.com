"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { ditherMaskStyle, fillStyle } from "@/lib/dither";
import { sfx } from "@/lib/sound";
import { DashedList, HLine, Row } from "./frame";

export type FeedItem = {
  kind: "article" | "log";
  slug: string;
  href: string;
  date: string;
  dateLabel: string;
  title: string;
  summary: string;
  tags: string[];
};

const STORAGE_KEY = "writing:show-logs";

/** On/off switch drawn in dither: sparse dots when off, a dithered fill when on. */
function DitherSwitch({ on, label, onToggle }: { on: boolean; label: string; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className="group flex items-center gap-2.5 cursor-pointer text-[13px] font-medium text-muted hover:text-mutedForeground transition-colors duration-300 outline-none"
    >
      {label}
      <span className="relative block h-[22px] w-[42px] rounded-full border border-border bg-mutedBackground p-[2px] group-focus-visible:ring-2 group-focus-visible:ring-border">
        <span className="absolute inset-[2px] overflow-hidden rounded-full">
          <span
            className={`absolute inset-0 bg-dither-ink transition-opacity duration-300 ${on ? "opacity-0" : "opacity-40 group-hover:opacity-70"}`}
            style={ditherMaskStyle(0.125, { cell: 2 })}
          />
          <span
            className={`absolute inset-0 transition-opacity duration-300 ${on ? "opacity-100" : "opacity-0"}`}
            style={fillStyle("gradient", { edge: "left", length: 14, from: 1, to: 0.125, cell: 2 })}
          />
        </span>
        <span
          className={`relative block size-4 rounded-full border border-border bg-background shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            on ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

/**
 * Articles, optionally mixed with study logs by date. Every item links to its
 * own page. The switch is the visitor's choice, remembered in localStorage.
 */
export function WritingFeed({
  items,
  labels,
}: {
  items: FeedItem[];
  labels: { title: string; subtitle: string; showLogs: string; log: string; empty: string; emptyWithLogs: string };
}) {
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    // Restore the saved choice after hydration (the server always renders articles only).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (localStorage.getItem(STORAGE_KEY) === "1") setShowLogs(true);
  }, []);

  const toggle = () => {
    const next = !showLogs;
    setShowLogs(next);
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    sfx("toggle", { direction: next ? "forward" : "back" });
  };

  const visible = items.filter((i) => showLogs || i.kind === "article");

  return (
    <>
      <Row className="p-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[1.75rem] font-semibold tracking-tight text-title">{labels.title}</h1>
          <p className="text-sm text-mutedForeground">{labels.subtitle}</p>
        </div>
        <DitherSwitch on={showLogs} label={labels.showLogs} onToggle={toggle} />
      </Row>
      <HLine />
      <Row>
        {visible.length === 0 ? (
          <div className="m-3 grid min-h-[200px] place-items-center rounded-[14px] border border-dashed border-border bg-checker">
            <p className="px-6 text-center text-sm font-medium text-muted">
              {showLogs ? labels.emptyWithLogs : labels.empty}
            </p>
          </div>
        ) : (
          <DashedList>
            {visible.map((item) => (
              <Link
                key={item.slug}
                data-cuelume-navigate="select"
                href={item.href}
                className="group flex flex-col gap-1"
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="truncate font-medium text-title">{item.title}</span>
                  {/* Logs are marked in the meta column, as plain text next to the date. */}
                  <span className="shrink-0 font-mono text-xs text-muted tabular-nums">
                    {item.kind === "log" && <span className="lowercase">{labels.log} · </span>}
                    <time dateTime={item.date}>{item.dateLabel}</time>
                  </span>
                </span>
                <span className="flex items-end justify-between gap-3">
                  <span className="text-sm text-mutedForeground line-clamp-2">{item.summary}</span>
                  <ArrowRightIcon className="size-3.5 shrink-0 mb-0.5 text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </span>
              </Link>
            ))}
          </DashedList>
        )}
      </Row>
      <HLine />
    </>
  );
}
