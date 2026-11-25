import Image from "next/image";
import type { Experience } from "@/data/experiences";

export function ExperienceItem({ exp, detailed }: { exp: Experience; detailed?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-stretch justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="shrink-0 size-11 sm:size-12 rounded-[10px] border border-border p-[2px] bg-background">
            {exp.logo ? (
              <Image
                src={exp.logo}
                alt={exp.company}
                width={48}
                height={48}
                unoptimized
                className="size-full rounded-[8px] object-cover select-none"
              />
            ) : (
              <span className="size-full grid place-items-center rounded-[8px] bg-mutedBackground font-semibold text-mutedForeground select-none">
                {exp.company[0]}
              </span>
            )}
          </div>
          <div className="flex flex-col justify-between h-full py-0.5">
            <p className="font-semibold text-title leading-tight">{exp.role}</p>
            <p className="text-sm text-mutedForeground">{exp.company}</p>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between py-0.5 text-right">
          <p className="text-xs sm:text-sm tabular-nums text-foreground">{exp.period}</p>
          {exp.location && <p className="text-xs sm:text-sm text-muted">{exp.location}</p>}
        </div>
      </div>
      {detailed && exp.bullets.length > 0 && (
        <div className="ml-[56px] sm:ml-[60px] flex flex-col gap-2.5">
          <ul className="list-disc pl-4 flex flex-col gap-1 text-sm text-mutedForeground marker:text-muted">
            {exp.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          {exp.stack && (
            <div className="flex flex-wrap gap-1.5">
              {exp.stack.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-full border border-border bg-mutedBackground font-mono text-[11px] text-mutedForeground"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
