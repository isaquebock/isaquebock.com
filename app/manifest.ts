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
      { src: "/favicon.ico", sizes: "16x16 32x32 48x48 64x64 128x128 256x256", type: "image/x-icon" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
