import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't let `next dev` (re)create AGENTS.md; agent instructions live in .claude/.
  agentRules: false,
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
