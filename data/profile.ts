export const profile = {
  name: "Isaque Böck",
  role: "Product Engineer",
  email: "you@example.com",
  avatar: "/images/avatar.png",
  calLink: "https://cal.com/your-username",
  githubUsername: "isaquebock",
  /** true: the graph uses sample data (data/github-mock.ts) instead of the GitHub API. */
  githubMock: true,
  bio: [
    "I'm a product engineer who builds products full cycle: from understanding the problem and shaping the solution to shipping, measuring and improving it.",
    "What drives me is delivering great experiences that create real value for the people who use them.",
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
