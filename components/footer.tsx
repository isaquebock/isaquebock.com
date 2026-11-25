import { profile } from "@/data/profile";
import { SocialIcon } from "./brand-icons";
import { HLine, Row } from "./frame";
import { DitherHorizon } from "./dither/horizon";

async function Year() {
  "use cache";
  return new Date().getFullYear();
}

export function Footer() {
  return (
    <footer>
      <Row className="p-3">
        <div className="relative h-[90px] sm:h-[140px] overflow-hidden rounded-[10px]">
          <DitherHorizon className="absolute inset-0" crest={0.78} stars={0.35} falloff={1.6} intensity={0.85} />
        </div>
      </Row>
      <HLine />
      <Row className="px-3 pb-6 pt-3 flex items-center justify-between gap-3 font-mono text-xs text-muted">
        <p>
          © <Year /> {profile.name}
        </p>
        <div className="flex items-center gap-3">
          {profile.socials.map((s) => (
            <a
              data-cuelume-tap=""
              data-cuelume-emphasis="subtle"
              key={s.name}
              href={s.href}
              aria-label={s.name}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-mutedForeground transition-colors duration-300"
            >
              <SocialIcon name={s.icon} className="size-4" />
            </a>
          ))}
        </div>
      </Row>
    </footer>
  );
}
