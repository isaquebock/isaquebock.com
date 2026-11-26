"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcwIcon, XIcon } from "lucide-react";
import { MASCOT_CELLS, MASCOT_COLOR, MASCOT_LEG_ROWS } from "@/lib/claude-mascot";
import { sfx } from "@/lib/sound";
import { DitherButton } from "@/components/dither-button";

/**
 * Corredor infinito em pixel: o mascote do Claude Code pula blocos em dither.
 * Tudo é desenhado num canvas, numa grade de 3px para combinar com o dither do site.
 */

type Labels = { again: string; howTo: string; over: string; best: string; exit: string };

const PX = 3; // tamanho de um "pixel" do jogo, em CSS px (igual à --dither-cell)
const SPRITE = 2; // cada célula do mascote vira 2×2 CSS px → 32px de altura
const GROUND_GAP = 22; // distância do chão até a base do canvas
const GRAVITY = 0.0024; // px/ms²
const JUMP = -0.72; // px/ms
const BEST_KEY = "runner-best";

type Obstacle = { x: number; w: number; h: number };
type Star = { x: number; y: number; speed: number };

/** Lê uma cor do tema (CSS var) já resolvida. */
const cssVar = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

export function RunnerGame({ labels, onExit }: { labels: Labels; onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const jumpRef = useRef<() => void>(() => {});
  const restartRef = useRef<() => void>(() => {});
  const [over, setOver] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    // Cores do tema, relidas quando o tema muda.
    let ink = "";
    let muted = "";
    const readColors = () => {
      ink = cssVar("--dither-ink", "#8b9cff");
      muted = cssVar("--muted-color", "#555");
    };
    readColors();
    const themeObserver = new MutationObserver(readColors);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const bestSaved = Number(localStorage.getItem(BEST_KEY) ?? 0) || 0;
    let bestScore = bestSaved;
    setBest(bestSaved);

    const spriteSize = 16 * SPRITE;
    const runnerX = 36;
    const groundY = () => height - GROUND_GAP;

    // Estado do jogo
    let y = 0; // altura acima do chão (px, positivo = no ar)
    let vy = 0;
    let speed = 0.3; // px/ms
    let distance = 0;
    let nextGap = 0;
    let obstacles: Obstacle[] = [];
    let alive = true;
    let lastMilestone = 0;
    let lastPoints = -1;
    let groundOffset = 0;
    const stars: Star[] = Array.from({ length: 22 }, () => ({
      x: Math.random() * 1200,
      y: Math.random() * 0.6,
      speed: 0.15 + Math.random() * 0.35,
    }));

    const reset = () => {
      y = 0;
      vy = 0;
      speed = 0.3;
      distance = 0;
      nextGap = 260;
      obstacles = [];
      alive = true;
      lastMilestone = 0;
      lastPoints = -1;
      setOver(false);
      setScore(0);
    };
    reset();

    const jump = () => {
      if (!alive) return;
      if (y === 0) {
        vy = JUMP;
        sfx("tap", { emphasis: "subtle" });
      }
    };
    jumpRef.current = jump;
    restartRef.current = () => {
      reset();
      sfx("open", { emphasis: "subtle" });
    };

    const spawn = () => {
      const blocks = Math.random() < 0.25 ? 2 : 1;
      const w = blocks * 4 * PX + (blocks - 1) * PX;
      const h = (5 + Math.floor(Math.random() * 6)) * PX;
      obstacles.push({ x: width + 10, w, h });
      // Quanto mais rápido, mais espaço entre obstáculos para continuar justo.
      nextGap = (220 + Math.random() * 260) * (0.8 + speed);
    };

    /** Desenha um bloco em dither: borda cheia e miolo em xadrez. */
    const drawBlock = (o: Obstacle) => {
      const top = groundY() - o.h;
      ctx.fillStyle = ink;
      for (let by = 0; by < o.h; by += PX) {
        for (let bx = 0; bx < o.w; bx += PX) {
          const edge = by === 0 || bx === 0 || bx + PX >= o.w;
          const checker = ((bx / PX) + (by / PX)) % 2 === 0;
          if (edge || checker) ctx.fillRect(Math.round(o.x + bx), Math.round(top + by), PX, PX);
        }
      }
    };

    const drawMascot = (time: number) => {
      const baseX = runnerX;
      const baseY = groundY() - spriteSize - y;
      // Pernas alternam enquanto corre no chão.
      const frame = y === 0 && alive ? Math.floor(time / 110) % 2 : -1;
      const hidden = frame === 0 ? [5, 12] : frame === 1 ? [3, 10] : [];
      ctx.fillStyle = MASCOT_COLOR;
      for (const c of MASCOT_CELLS) {
        if (c.row === MASCOT_LEG_ROWS[1] && hidden.includes(c.col)) continue;
        ctx.fillRect(baseX + c.col * SPRITE, Math.round(baseY + c.row * SPRITE), SPRITE, SPRITE);
      }
    };

    const drawGround = () => {
      const gy = groundY();
      ctx.fillStyle = muted;
      // Linha tracejada que corre com o jogo, e uns pontos de "terra" esparsos.
      for (let x = -((groundOffset % 14) + 14); x < width; x += 14) ctx.fillRect(Math.round(x), gy, 6, 1);
      for (let x = -(groundOffset % 37); x < width; x += 37) ctx.fillRect(Math.round(x + 9), gy + 6, PX, 1);
      for (let x = -(groundOffset * 0.7) % 53; x < width; x += 53) ctx.fillRect(Math.round(x + 21), gy + 11, 2, 1);
    };

    const collides = (o: Obstacle) => {
      const inset = 4;
      const ax1 = runnerX + inset;
      const ax2 = runnerX + spriteSize - inset;
      const ay2 = groundY() - y - 2;
      const ay1 = ay2 - spriteSize + inset * 2;
      const bx1 = o.x;
      const bx2 = o.x + o.w;
      const by1 = groundY() - o.h;
      return ax1 < bx2 && ax2 > bx1 && ay2 > by1 && ay1 < groundY();
    };

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 40); // aba em segundo plano não faz o jogo "pular"
      last = now;

      if (alive) {
        speed = Math.min(0.85, speed + dt * 0.0000085);
        const dx = speed * dt;
        distance += dx;
        groundOffset += dx;

        vy += GRAVITY * dt;
        y = Math.max(0, y - vy * dt);
        if (y === 0) vy = 0;

        nextGap -= dx;
        if (nextGap <= 0) spawn();
        for (const o of obstacles) o.x -= dx;
        obstacles = obstacles.filter((o) => o.x + o.w > -10);
        for (const s of stars) s.x -= s.speed * dx * 0.15;

        const points = Math.floor(distance / 12);
        if (points !== lastPoints) {
          lastPoints = points;
          setScore(points);
        }
        if (points - lastMilestone >= 100) {
          lastMilestone = points - (points % 100);
          sfx("select", { emphasis: "subtle" });
        }
        if (obstacles.some(collides)) {
          alive = false;
          sfx("error");
          if (points > bestScore) {
            bestScore = points;
            localStorage.setItem(BEST_KEY, String(points));
            setBest(points);
          }
          setOver(true);
        }
      }

      // Desenho
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = muted;
      for (const s of stars) {
        const sx = ((s.x % (width + 20)) + width + 20) % (width + 20);
        ctx.fillRect(Math.round(sx), Math.round(s.y * (groundY() - 20)), 2, 2);
      }
      drawGround();
      obstacles.forEach(drawBlock);
      drawMascot(now);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  // Teclado: espaço/↑/W pulam (e reiniciam após perder), Esc sai.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onExit();
        return;
      }
      if (e.code === "Space" || e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
        e.preventDefault(); // não rolar a página enquanto joga
        if (over) restartRef.current();
        else jumpRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [over, onExit]);

  return (
    <div className="absolute inset-0 select-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full cursor-pointer touch-manipulation"
        onPointerDown={(e) => {
          e.preventDefault();
          if (over) restartRef.current();
          else jumpRef.current();
        }}
        aria-label={labels.howTo}
        role="img"
      />

      <div className="absolute left-2 top-2 z-10">
        <DitherButton icon onClick={onExit} aria-label={labels.exit} title={`${labels.exit} (Esc)`} className="shadow-none">
          <XIcon className="size-3.5" />
        </DitherButton>
      </div>

      <div className="pointer-events-none absolute right-3 top-2.5 flex items-center gap-3 text-xs tabular-nums">
        <span className="text-muted">
          {labels.best} {String(best).padStart(5, "0")}
        </span>
        <span className="text-title font-medium">{String(score).padStart(5, "0")}</span>
      </div>

      {score === 0 && !over && (
        <p className="pointer-events-none absolute inset-x-0 top-1/3 text-center text-xs text-mutedForeground">
          {labels.howTo}
        </p>
      )}

      {over && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium text-title">{labels.over}</p>
            <DitherButton onClick={() => restartRef.current()}>
              <RotateCcwIcon className="size-3.5" />
              {labels.again}
            </DitherButton>
          </div>
        </div>
      )}
    </div>
  );
}
