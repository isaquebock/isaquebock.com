export const profile = {
  name: "Isaque Böck",
  role: "Software Engineer",
  email: "you@example.com",
  avatar: "/images/avatar.png",
  calLink: "https://cal.com/your-username",
  githubUsername: "isaquebock",
  /** true: the graph uses sample data (data/github-mock.ts) instead of the GitHub API. */
  githubMock: true,
  bio: [
    "I'm a full-stack developer who loves building fast, beautiful and easy-to-use products, from the database down to the last pixel of the interface.",
    "I work with whatever stack the problem calls for and I'm open to new opportunities.",
  ],
  socials: [
    { name: "GitHub", href: "https://github.com/isaquebock", icon: "github" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/isaquebock/", icon: "linkedin" },
    { name: "X", href: "https://x.com/isaquebock", icon: "x" },
    { name: "Email", href: "mailto:you@example.com", icon: "mail" },
  ],
  quote: {
    text: "Stay hungry, stay foolish.",
    author: "Steve Jobs",
  },
} as const;

export type SocialIcon = (typeof profile.socials)[number]["icon"];
