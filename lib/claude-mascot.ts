/**
 * O mascote em pixel do Claude Code decomposto em células. O desenho original
 * (viewBox 24×24) segue uma grade de 1,5 unidade, então 16×16 células
 * reproduzem a forma exata. Usado pelo avatar do enxame e pelo jogo do banner.
 */
export const MASCOT_GRID = 16;
export const MASCOT_COLOR = "#10b981";

export type MascotCell = { col: number; row: number };

export const MASCOT_CELLS: MascotCell[] = (() => {
  const inside = (x: number, y: number) => {
    const between = (v: number, a: number, b: number) => v >= a && v <= b;
    const eye = between(y, 8.102, 10.949) && (between(x, 6, 7.488) || between(x, 16.51, 18));
    const body = between(x, 3, 21) && between(y, 5, 17.079) && !eye;
    const arms = between(y, 10.95, 14.05) && (between(x, 0, 3) || between(x, 21, 24));
    const legs = between(y, 17.079, 20) && [4.487, 7.488, 15, 18].some((left) => between(x, left, left + 1.513));
    return body || arms || legs;
  };
  const cells: MascotCell[] = [];
  for (let row = 0; row < MASCOT_GRID; row++)
    for (let col = 0; col < MASCOT_GRID; col++)
      if (inside(0.75 + col * 1.5, 0.75 + row * 1.5)) cells.push({ col, row });
  return cells;
})();

/** Linhas das pernas (as duas últimas linhas ocupadas). */
export const MASCOT_LEG_ROWS = [11, 12];
