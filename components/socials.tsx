import { profile } from "@/data/profile";
import { SocialIcon } from "./brand-icons";
import { Build } from "./swarm/swarm";

export function Socials() {
  return (
    <div className="py-4.5 flex flex-col gap-2">
      <p className="font-mono text-xs text-muted">
        <Build id="socials-label" as="span" className="block w-fit" text="my socials" />
      </p>
      <div className="flex gap-[7px] items-center flex-wrap">
        {profile.socials.map((s) => (
          <Build key={s.name} id={`social-${s.icon}`} className="w-fit">
            <a
              data-cuelume-tap=""
              href={s.href}
              target={s.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex items-center group px-2.5 py-1 border border-border bg-mutedBackground hover:bg-mutedBackgroundHover hover:border-mutedForeground/40 transition-colors duration-200 select-none rounded-full"
            >
              <SocialIcon name={s.icon} className="size-3.5 text-mutedForeground group-hover:text-foreground transition-colors" />
              <span className="ml-1.5 text-sm font-medium text-foreground">{s.name}</span>
            </a>
          </Build>
        ))}
      </div>
    </div>
  );
}
