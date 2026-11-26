import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";
import { siteDescription } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} · ${profile.role}`,
    short_name: profile.name,
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
