"use client";

import { cssColor, DitherShader } from "@/lib/dither";
import type { DitherShaderProps } from "@/lib/dither";

/**
 * Dithered cover for a project card. Three looks, picked by `variant`:
 * 0 — radar rings pulsing out from a point,
 * 1 — topographic contour lines drifting slowly,
 * 2 — a lit planet with a tilted ring.
 */
const FIELD = `
float pcRings(vec2 c, float t) {
  vec2 o = c - vec2(-0.35, -0.12);
  float r = length(o);
  float wave = 0.5 + 0.5 * sin(r * 34.0 - t * 1.6);
  float band = smoothstep(0.55, 0.95, wave);
  float env = exp(-r * 1.6);
  float core = exp(-r * r * 90.0);
  return max(band * env * 0.95, core);
}

float pcContours(vec2 p, float t) {
  float n = 0.5 + 0.5 * snoise(p * 1.1 + vec2(t * 0.05, -t * 0.04));
  n += 0.15 * snoise(p * 2.3 - vec2(t * 0.03, 0.0));
  float d = abs(fract(n * 5.0) - 0.5);
  float lines = 1.0 - smoothstep(0.06, 0.16, d);
  return clamp(lines * 0.95 + smoothstep(0.75, 1.1, n) * 0.35, 0.0, 1.0);
}

float pcPlanet(vec2 c, float t) {
  vec2 q = c - vec2(0.22, -0.05);
  float rad = 0.3;
  float r = length(q);
  float body = 0.0;
  if (r < rad) {
    vec3 nrm = vec3(q / rad, sqrt(max(0.0, 1.0 - dot(q, q) / (rad * rad))));
    float a = t * 0.25;
    vec3 light = normalize(vec3(cos(a) * -0.8, 0.5, 0.6));
    float lit = clamp(dot(nrm, light), 0.0, 1.0);
    float bands = 0.85 + 0.15 * sin(q.y * 60.0 + fbm(q * 6.0 + t * 0.05) * 4.0);
    body = lit * bands;
  }
  vec2 rq = mat2(0.94, 0.34, -0.34, 0.94) * q;
  float ell = length(vec2(rq.x, rq.y * 4.2));
  float ringTone = exp(-pow((ell - 0.5) * 22.0, 2.0)) * 0.8;
  if (r < rad && rq.y > 0.0) ringTone = 0.0;
  float halo = exp(-max(r - rad, 0.0) * 30.0) * 0.12 * step(rad, r);
  return clamp(max(max(body, ringTone), halo), 0.0, 1.0);
}

float field(vec2 uv, vec2 res, float t) {
  float aspect = res.x / res.y;
  vec2 c = (uv - 0.5) * vec2(aspect, 1.0);
  vec2 p = vec2(uv.x * aspect, uv.y);
  float tone;
  if (pcVariant < 0.5) tone = pcRings(c, t);
  else if (pcVariant < 1.5) tone = pcContours(p, t);
  else tone = pcPlanet(c, t);
  return tone * pcIntensity;
}
`;

export type ProjectCoverProps = Omit<DitherShaderProps, "field" | "uniforms" | "fallback"> & {
  /** 0 rings, 1 contours, 2 planet. */
  variant?: 0 | 1 | 2;
  /** Overall intensity, 0 to 1. Default 1. */
  intensity?: number;
};

export function ProjectCover({
  variant = 0,
  intensity = 1,
  palette = ["--dither-paper", "--cover-ink"],
  matrix = "bayer4",
  ...props
}: ProjectCoverProps) {
  const ink = cssColor(palette.at(-1) ?? palette[1]);
  return (
    <DitherShader
      {...props}
      field={FIELD}
      palette={palette}
      matrix={matrix}
      speed={0.7}
      stillTime={4}
      uniforms={{ pcVariant: variant, pcIntensity: intensity }}
      fallback={
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: cssColor(palette[0]),
            backgroundImage: `radial-gradient(circle at 35% 60%, color-mix(in oklch, ${ink} 30%, transparent), transparent 60%)`,
          }}
        />
      }
    />
  );
}
