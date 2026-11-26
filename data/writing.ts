/**
 * Everything on /writing: articles and study logs. Each entry has its own page
 * at /writing/<slug>. Logs only appear in the list when the visitor turns on
 * the "study logs" switch, but their pages are always reachable.
 *
 * `body` is Markdown (see lib/markdown.tsx for what's supported), one per language.
 */
type Text = { en: string; "pt-br": string };

export type Post = {
  slug: string;
  kind: "article" | "log";
  /** YYYY-MM-DD */
  date: string;
  title: Text;
  /** One or two sentences, shown in the list and in search results. */
  summary: Text;
  tags: string[];
  body: Text;
};

export const posts: Post[] = [
  {
    slug: "starting-go-and-rust",
    kind: "log",
    date: "2026-11-26",
    title: { en: "Starting Go and Rust", "pt-br": "Começando Go e Rust" },
    summary: {
      en: "Started studying Go and Rust, to get closer to the systems side of the products I build.",
      "pt-br": "Comecei a estudar Go e Rust, para chegar mais perto do lado de sistemas dos produtos que construo.",
    },
    tags: ["go", "rust"],
    body: {
      en: `Started studying **Go** and **Rust**, to get closer to the systems side of the products I build.

I'll keep notes here as I go: what clicked, what didn't, and the small projects I use to practice.`,
      "pt-br": `Comecei a estudar **Go** e **Rust**, para chegar mais perto do lado de sistemas dos produtos que construo.

Vou registrar aqui o que for aprendendo: o que fez sentido, o que não fez e os pequenos projetos que uso para praticar.`,
    },
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
