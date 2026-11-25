"use client";

import { useEffect, useState } from "react";
import { ArrowUpRightIcon } from "lucide-react";
import { Heatmap } from "@/components/dithercn/heatmap";
import { profile } from "@/data/profile";
import { mockContributions } from "@/data/github-mock";

type Data = { total: number; contributions: { date: string; count: number }[] };

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

export function GithubGraph() {
  const [data, setData] = useState<Data | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const load: Promise<Data> = profile.githubMock
      ? Promise.resolve().then(() => mockContributions())
      : fetch("/api/github").then((r) => (r.ok ? r.json() : Promise.reject()));
    load
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  if (failed) return null;

  const days = data?.contributions.length ?? 0;
  const average = data && days > 0 ? data.total / days : 0;

  return (
    <div className="rounded-[14px] border border-border bg-card p-4 sm:p-5">
      <div className="flex items-end justify-between gap-3 pb-4">
        <div className="flex flex-col gap-1">
          <p className="font-mono text-xs text-muted">contributions in the last year</p>
          <p className="text-3xl font-medium leading-none text-title tabular-nums">
            {data ? number.format(data.total) : "–"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <a
            href={`https://github.com/${profile.githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 font-mono text-xs text-muted hover:text-mutedForeground transition-colors"
          >
            @{profile.githubUsername}
            <ArrowUpRightIcon className="size-3" />
          </a>
          <p className="text-sm text-mutedForeground">
            <span className="text-title tabular-nums">{number.format(average)}</span> per day on average
          </p>
        </div>
      </div>
      {data ? (
        <Heatmap
          data={data.contributions.map((c) => ({ date: c.date, value: c.count }))}
          unit={{ one: "contribution", other: "contributions" }}
          bloom="low"
        />
      ) : (
        <div className="h-[120px] w-full rounded-[8px] bg-checker" />
      )}
    </div>
  );
}
