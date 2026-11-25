import { profile } from "@/data/profile";

export function Quote() {
  return (
    <blockquote className="flex flex-col items-center gap-2 py-6 sm:py-8 text-center">
      <p className="text-xl font-medium tracking-tight text-title">“{profile.quote.text}”</p>
      <cite className="font-mono text-xs not-italic text-muted">— {profile.quote.author}</cite>
    </blockquote>
  );
}
