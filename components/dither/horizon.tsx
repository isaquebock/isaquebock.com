"use client";

import { cssColor, DitherShader } from "@/lib/dither";
import type { DitherShaderProps } from "@/lib/dither";

/**
 * Um horizonte em dither: uma crista ondulando devagar, densa na borda e
 * dissolvendo para baixo, com estrelas esparsas piscando acima.
 */
const FIELD = `
float hzStars(vec2 uv, vec2 res, float t) {
  vec2 cellId = floor(uv * res / 2.0);
  float h = hash21(cellId);
  float twinkle = 0.55 + 0.45 * sin(t * 1.3 + h * 60.0);
  return step(0.985, h) * twinkle;
}

float field(vec2 uv, vec2 res, float t) {
  float aspect = res.x / res.y;
  float x = uv.x * aspect;
  float crest = hzCrest
    + 0.07 * sin(x * 1.7 + t * 0.22)
    + 0.05 * snoise(vec2(x * 0.9 - t * 0.04, t * 0.03));
  float depth = crest - uv.y;
  float rim = exp(-(depth * depth) * 260.0);
  float grain = 0.45 + 0.55 * fbm(vec2(x * 2.5 + t * 0.05, uv.y * 5.0 - t * 0.02));
  float body = smoothstep(-0.01, 0.04, depth) * exp(-max(depth, 0.0) * hzFalloff) * grain;
  float sky = hzStars(uv, res, t) * smoothstep(0.02, 0.12, -depth) * hzStarAmount;
  float tone = max(max(rim * 0.95, body * 0.8), sky);
  return clamp(tone * hzIntensity, 0.0, 1.0);
}
`;

export type DitherHorizonProps = Omit<DitherShaderProps, "field" | "uniforms" | "fallback"> & {
  /** Altura da crista, de 0 (base) a 1 (topo). Padrão 0.32. */
  crest?: number;
  /** Quantidade de estrelas acima da crista, 0 a 1. Padrão 1. */
  stars?: number;
  /** Quão rápido o horizonte dissolve para baixo. Padrão 3.2. */
  falloff?: number;
  /** Intensidade geral, 0 a 1. Padrão 1. */
  intensity?: number;
};

export function DitherHorizon({
  crest = 0.32,
  stars = 1,
  falloff = 3.2,
  intensity = 1,
  palette = ["--dither-paper", "--dither-ink"],
  matrix = "bayer4",
  ...props
}: DitherHorizonProps) {
  const ink = cssColor(palette.at(-1) ?? palette[1]);
  return (
    <DitherShader
      {...props}
      field={FIELD}
      palette={palette}
      matrix={matrix}
      speed={0.8}
      stillTime={5}
      uniforms={{ hzCrest: crest, hzStarAmount: stars, hzFalloff: falloff, hzIntensity: intensity }}
      fallback={
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: cssColor(palette[0]),
            backgroundImage: `linear-gradient(to top, transparent, color-mix(in oklch, ${ink} 35%, transparent) ${(1 - crest) * 100}%, transparent ${(1 - crest) * 100 + 4}%)`,
          }}
        />
      }
    />
  );
}
