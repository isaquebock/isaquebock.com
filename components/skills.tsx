import { CloudIcon, DatabaseIcon, MoveIcon } from "lucide-react";
import { skills, type Skill } from "@/data/skills";

export function Chip({ children, href }: { children: React.ReactNode; href?: string }) {
  const cls =
    "flex items-center px-2 py-1 text-sm font-medium text-foreground bg-mutedBackground hover:bg-mutedBackgroundHover transition-colors duration-200 select-none rounded-full";
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
    </a>
  ) : (
    <span className={cls}>{children}</span>
  );
}

/** Cor da marca no hover, exceto marcas quase pretas, que sumiriam no tema escuro. */
function brandColor(icon: Skill["icon"]) {
  if (typeof icon === "string") return undefined;
  const n = parseInt(icon.hex, 16);
  const luminance = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return luminance < 60 ? undefined : `#${icon.hex}`;
}

function SkillIcon({ icon }: { icon: Skill["icon"] }) {
  const cls = "size-3.5 shrink-0";
  if (icon === "cloud") return <CloudIcon className={cls} aria-hidden />;
  if (icon === "database") return <DatabaseIcon className={cls} aria-hidden />;
  if (icon === "motion") return <MoveIcon className={cls} aria-hidden />;
  return (
    <svg viewBox="0 0 24 24" className={cls} fill="currentColor" aria-hidden>
      <path d={icon.path} />
    </svg>
  );
}

export function Skills() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-[8px]">
      {skills.map((s) => {
        const brand = brandColor(s.icon);
        return (
          <a
            data-cuelume-tap=""
            data-cuelume-hover=""
            data-cuelume-emphasis="subtle"
            key={s.name}
            href={`https://www.google.com/search?q=${encodeURIComponent(s.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={brand ? ({ "--brand": brand } as React.CSSProperties) : undefined}
            className="group flex-1 min-w-fit flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full border border-border font-mono text-xs text-mutedForeground hover:text-foreground hover:border-mutedForeground/60 hover:bg-mutedBackground hover:scale-[1.04] hover:z-10 transition-[color,background-color,border-color,transform] duration-300 ease-out select-none"
          >
            <span className="flex text-muted transition-colors duration-300 group-hover:text-[var(--brand,currentColor)]">
              <SkillIcon icon={s.icon} />
            </span>
            {s.name}
          </a>
        );
      })}
    </div>
  );
}
