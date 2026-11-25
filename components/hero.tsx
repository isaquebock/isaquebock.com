import { CalendarIcon, SendIcon } from "lucide-react";
import { profile } from "@/data/profile";
import { ButtonLink } from "./button";
import { HLine, Row } from "./frame";
import { GithubGraph } from "./github-graph";
import { Socials } from "./socials";
import { Build } from "./swarm/swarm";
import { DitherHorizon } from "./dither/horizon";
import Image from "next/image";

export function Hero() {
  return (
    <>
      <Row className="p-3">
        <Build id="hero-band">
          <div className="relative h-[140px] sm:h-[220px] overflow-hidden rounded-[10px]">
            <DitherHorizon className="absolute inset-0" />
          </div>
        </Build>
      </Row>
      <HLine />

      <Row className="p-3">
        <div className="flex items-end gap-3">
          <Build id="hero-avatar" className="w-fit">
            <div className="rounded-[14px] border border-border p-[4px] bg-background">
              <Image
                src={profile.avatar}
                alt={profile.name}
                width={176}
                height={176}
                priority
                className="size-[88px] rounded-[10px] object-cover"
              />
            </div>
          </Build>
          <div className="flex flex-col gap-0.5 py-1">
            <h1 className="text-[1.75rem] font-semibold leading-[1.05] tracking-tight text-title">
              <Build id="hero-name" as="span" className="block" text={profile.name} />
            </h1>
            <p className="text-sm text-mutedForeground">
              <Build id="hero-role" as="span" className="block" text={profile.role} />
            </p>
          </div>
        </div>
      </Row>
      <HLine />

      <Row className="p-3">
        <div className="flex flex-col gap-3 text-[15px] leading-relaxed">
          {profile.bio.map((p, i) => (
            <p key={p}>
              <Build id={`hero-bio-${i}`} as="span" className="block" text={p} />
            </p>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-4.5">
          <Build id="hero-cta-call" className="w-fit">
            <ButtonLink href={profile.calLink} icon={CalendarIcon}>
              Book a call
            </ButtonLink>
          </Build>
          <Build id="hero-cta-mail" className="w-fit">
            <ButtonLink href={`mailto:${profile.email}`} icon={SendIcon} variant="secondary">
              Send email
            </ButtonLink>
          </Build>
        </div>

        <Socials />

        <Build id="github-graph" className="pt-1.5">
          <GithubGraph />
        </Build>
      </Row>
      <HLine />
    </>
  );
}
