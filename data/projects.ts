export type Project = {
  slug: string;
  title: string;
  description: string;
  /** Which dithered cover to draw (see components/dither/project-cover.tsx). */
  cover: 0 | 1 | 2;
  tags: string[];
  stack: string[];
  highlights: string[];
  links: { github?: string; website?: string };
  featured?: boolean;
  /** Not launched yet: listed on the site but kept out of search results and the sitemap. */
  draft?: boolean;
};

export const projects: Project[] = [
  {
    slug: "stealth-one",
    title: "Private",
    description: "Something new is being built. Details coming soon.",
    cover: 0,
    tags: [],
    stack: [],
    highlights: [],
    links: {},
    featured: true,
    draft: true,
  },
  {
    slug: "stealth-two",
    title: "Private",
    description: "Under wraps for now. Stay tuned.",
    cover: 1,
    tags: [],
    stack: [],
    highlights: [],
    links: {},
    featured: true,
    draft: true,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
