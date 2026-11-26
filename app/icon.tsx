import { ImageResponse } from "next/og";
import { DitherDots, cornerTone } from "@/lib/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#000",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <DitherDots cols={16} rows={16} cell={4} color="#4a4a4a" tone={cornerTone} />
        <div
          style={{
            position: "absolute",
            left: 10,
            top: 6,
            fontSize: 40,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: -2,
          }}
        >
          ib
        </div>
      </div>
    ),
    size,
  );
}
