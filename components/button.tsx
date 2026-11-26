import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Props = {
  href: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: "primary" | "secondary";
  external?: boolean;
};

const inner =
  "flex items-center gap-1.5 px-3.5 text-sm font-medium overflow-hidden whitespace-nowrap select-none transition-colors duration-300";

function SlideIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="relative w-4 h-4 overflow-hidden">
      <Icon className="absolute inset-0 size-4 transition-transform duration-400 ease-out group-hover:-translate-y-6" />
      <Icon className="absolute inset-0 size-4 translate-y-6 transition-transform duration-400 ease-out group-hover:translate-y-0" />
    </span>
  );
}

/**
 * Button with an icon that slides on hover. The primary variant is white with a
 * double frame (outer border with 2px of breathing room + inner fill).
 */
export function ButtonLink({ href, children, icon, variant = "primary", external }: Props) {
  const isExternal = external ?? /^(https?:|mailto:)/.test(href);
  const linkProps = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};
  const label = (
    <>
      {icon && <SlideIcon icon={icon} />}
      <span className="translate-y-0 group-hover:animate-[slideDown_0.5s_ease-out]">{children}</span>
    </>
  );

  if (variant === "secondary") {
    return (
      <Link
        data-cuelume-tap=""
        href={href}
        {...linkProps}
        className={`${inner} py-[8px] sm:py-[6px] group w-fit shrink-0 rounded-full border border-border bg-mutedBackground hover:bg-mutedBackgroundHover text-foreground`}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link data-cuelume-tap="" href={href} {...linkProps} className="group block w-fit shrink-0 rounded-full border border-border p-[2px]">
      <span className={`${inner} py-[6px] sm:py-1 rounded-full bg-white group-hover:bg-zinc-200 text-black`}>
        {label}
      </span>
    </Link>
  );
}
