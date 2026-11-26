"use client";

import { ditherMaskStyle, fillStyle } from "@/lib/dither";

/**
 * Pill button with a dithered texture behind its label: sparse dots at rest,
 * a denser dithered fill on hover. `icon` buttons are a small circle.
 */
export function DitherButton({
  children,
  icon,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: boolean }) {
  return (
    <button
      type="button"
      {...props}
      className={`group relative isolate overflow-hidden rounded-full border border-border bg-background/90 backdrop-blur-sm cursor-pointer text-title shadow-lg transition-colors duration-300 ${
        icon ? "grid size-7 place-items-center" : "flex items-center gap-1.5 px-4 py-2 text-sm font-medium"
      } ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-dither-ink opacity-25 transition-opacity duration-300 group-hover:opacity-0"
        style={ditherMaskStyle(0.125, { cell: 2 })}
      />
      <span
        aria-hidden
        className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-35"
        style={fillStyle("gradient", { edge: "bottom", length: 12, from: 0.75, to: 0.125, cell: 2 })}
      />
      {children}
    </button>
  );
}
