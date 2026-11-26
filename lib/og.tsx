/**
 * Pieces shared by the generated icons and Open Graph image (next/og).
 * Satori can't run the dither shader, so the dither is drawn as a grid of
 * square dots, lit with the same 4x4 Bayer matrix the engine uses.
 */
const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/**
 * Absolutely positioned dots for a dithered field. `tone(u, v)` returns ink
 * coverage in [0, 1] for the cell at u, v (0..1, top-left origin).
 */
export function DitherDots({
  cols,
  rows,
  cell,
  color,
  tone,
}: {
  cols: number;
  rows: number;
  cell: number;
  color: string;
  tone: (u: number, v: number) => number;
}) {
  const dots = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const t = tone((x + 0.5) / cols, (y + 0.5) / rows);
      if (t > (BAYER4[y % 4][x % 4] + 0.5) / 16) {
        dots.push(
          <div
            key={`${x}-${y}`}
            style={{
              position: "absolute",
              left: x * cell,
              top: y * cell,
              width: cell,
              height: cell,
              background: color,
            }}
          />,
        );
      }
    }
  }
  return <>{dots}</>;
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

/** Horizon glow: dense at the bottom, rising in a soft arc toward the middle. */
export const horizonTone = (u: number, v: number) => {
  const arc = 0.74 + 0.18 * Math.pow((u - 0.5) * 2, 2);
  return smooth(arc - 0.05, 1.02, v);
};

/** Corner glow used by the icons: dense at the bottom-right corner. */
export const cornerTone = (u: number, v: number) => smooth(0.35, 1.25, (u + v) / 1.4);
