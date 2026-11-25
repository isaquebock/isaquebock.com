"use client";

import { useState } from "react";
import { fillStyle } from "@/lib/dither";

export function Newsletter() {
  const [sent, setSent] = useState(false);

  return (
    <div className="relative isolate flex flex-col gap-4 p-4 sm:p-6 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-2/3 -z-10 opacity-40"
        style={fillStyle("gradient", { edge: "right", length: 70, from: 0.5, to: 0 })}
      />
      <div>
        <p className="text-lg font-medium tracking-tight text-title">Newsletter</p>
        <p className="text-sm text-mutedForeground">Get updates about my projects and articles.</p>
      </div>
      {sent ? (
        <p className="text-sm font-medium text-foreground">Thanks! You&apos;ll get the next updates.</p>
      ) : (
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="flex-1 min-w-0 rounded-full border border-border p-[2px] bg-background">
            <input
              data-cuelume-type=""
              type="email"
              required
              aria-label="Your email"
              placeholder="you@email.com"
              className="w-full px-3.5 py-[6px] text-sm rounded-full border border-border bg-background text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors duration-300"
            />
          </div>
          <button
            type="submit"
            disabled
            title="Coming soon"
            className="group shrink-0 rounded-full border border-border p-[2px] bg-background cursor-not-allowed opacity-50"
          >
            <span className="flex h-full items-center justify-center px-4 text-sm font-medium rounded-full bg-white text-black">
              Subscribe
            </span>
          </button>
        </form>
      )}
    </div>
  );
}
