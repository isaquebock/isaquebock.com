import { ImageResponse } from "next/og";
import { DitherDots, cornerTone } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#000",
          borderRadius: 0,
          overflow: "hidden",
        }}
      >
        <DitherDots cols={30} rows={30} cell={6} color="#4a4a4a" tone={cornerTone} />
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 20,
            fontSize: 112,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: -6,
          }}
        >
          ib
        </div>
      </div>
    ),
    size,
  );
}
