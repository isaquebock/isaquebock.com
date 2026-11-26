import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/data/profile";
import { DitherDots, horizonTone } from "@/lib/og";
import { siteUrl } from "@/lib/seo";

export const alt = `${profile.name} · ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const avatar = await readFile(join(process.cwd(), "public", profile.avatar));
  const avatarSrc = `data:image/png;base64,${avatar.toString("base64")}`;
  const cell = 10;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#000",
          color: "#d6d6d6",
          fontFamily: "sans-serif",
        }}
      >
        <DitherDots
          cols={size.width / cell}
          rows={size.height / cell}
          cell={cell}
          color="#3a3a3a"
          tone={horizonTone}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            padding: "72px 96px",
            gap: 36,
          }}
        >
          <div
            style={{
              display: "flex",
              padding: 8,
              width: 176,
              height: 176,
              borderRadius: 28,
              border: "2px solid #2a2a2a",
              background: "#000",
            }}
          >
            <img src={avatarSrc} width={156} height={156} style={{ borderRadius: 20, objectFit: "cover" }} alt="" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 76, fontWeight: 700, color: "#fff", letterSpacing: -2, lineHeight: 1 }}>
              {profile.name}
            </div>
            <div style={{ fontSize: 34, color: "#9a9a9a" }}>{profile.role}</div>
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#8a8a8a", fontFamily: "monospace" }}>
            {siteUrl.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
