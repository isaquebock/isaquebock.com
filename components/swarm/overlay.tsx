"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/locale-client";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDownIcon, CheckIcon } from "lucide-react";
import { AGENTS, ARROW_HEADING, ARROW_TIP, type AgentState, type Rect } from "./agents";
import type { Phase } from "./swarm";

const ease = [0.22, 1, 0.36, 1] as const;
const box = (r: Rect) => ({ left: r.x, top: r.y, width: r.w, height: r.h });

function Cursor({
  color,
  name,
  arrowRef,
}: {
  color: string;
  name: string;
  arrowRef?: (el: SVGSVGElement | null) => void;
}) {
  return (
    <div className="relative">
      <svg
        ref={arrowRef}
        width="18"
        height="18"
        viewBox="0 0 18 18"
        className="drop-shadow-sm"
        aria-hidden
        // Gira em torno da ponta da seta, que é o ponto exato do cursor.
        style={{ transformOrigin: `${ARROW_TIP.x}px ${ARROW_TIP.y}px` }}
      >
        <path
          d="M2 1.5 15.5 8.2 9.2 9.7 6.3 15.8Z"
          fill={color}
          stroke="white"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="absolute left-3.5 top-4 whitespace-nowrap px-1.5 py-[1px] rounded-[5px] font-mono text-[10px] font-medium text-white shadow-sm"
        style={{ background: color }}
      >
        {name}
      </span>
    </div>
  );
}

function Selection({ r, color, hex }: { r: Rect; color: string; hex?: string | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="absolute"
      style={{ ...box(r), border: `1.5px solid ${color}` }}
    >
      {(["-left-[4px] -top-[4px]", "-right-[4px] -top-[4px]", "-left-[4px] -bottom-[4px]", "-right-[4px] -bottom-[4px]"] as const).map(
        (pos) => (
          <span
            key={pos}
            className={`absolute ${pos} size-[7px] bg-white`}
            style={{ border: `1.5px solid ${color}` }}
          />
        ),
      )}
      <span
        className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+5px)] whitespace-nowrap px-1 rounded-[3px] font-mono text-[10px] text-white"
        style={{ background: color }}
      >
        {Math.round(r.w)} × {Math.round(r.h)}
      </span>
      {hex && (
        <span className="absolute left-0 -top-6 flex items-center gap-1 whitespace-nowrap px-1 py-[1px] rounded-[4px] border border-border bg-background font-mono text-[10px] text-foreground shadow-sm">
          <span className="size-2 rounded-[2px] border border-border" style={{ background: hex }} />
          {hex}
        </span>
      )}
    </motion.div>
  );
}

/**
 * Enquanto os agentes seguem o cursor do usuário, gira cada seta a cada quadro
 * para apontar da posição atual do agente (ainda em movimento) até o mouse.
 */
function useAimAtPointer(following: boolean) {
  const arrows = useRef(new Map<string, SVGSVGElement>());

  useEffect(() => {
    const els = arrows.current;
    if (!following) {
      els.forEach((el) => (el.style.transform = ""));
      return;
    }
    let pointer: { x: number; y: number } | null = null;
    const angles = new Map<string, number>();
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") pointer = { x: e.clientX, y: e.clientY };
    };
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!pointer) return;
      els.forEach((el, id) => {
        // Mede o div do cursor (que não gira), não o SVG rotacionado.
        const box = (el.parentElement ?? el).getBoundingClientRect();
        const tipX = box.left + ARROW_TIP.x;
        const tipY = box.top + ARROW_TIP.y;
        const dx = pointer!.x - tipX;
        const dy = pointer!.y - tipY;
        if (Math.hypot(dx, dy) < 4) return;
        const target = (Math.atan2(dy, dx) * 180) / Math.PI - ARROW_HEADING;
        const current = angles.get(id) ?? target;
        // Caminho mais curto entre os ângulos, com suavização leve.
        const delta = ((((target - current) % 360) + 540) % 360) - 180;
        const next = current + delta * 0.35;
        angles.set(id, next);
        el.style.transform = `rotate(${next}deg)`;
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [following]);

  return (id: string) => (el: SVGSVGElement | null) => {
    if (el) arrows.current.set(id, el);
    else arrows.current.delete(id);
  };
}

const CLAUDE_ORANGE = "#D97757";

/**
 * O avatar do Claude Code decomposto em células. O desenho original (viewBox 24×24)
 * segue uma grade de 1,5 unidade, então 16×16 células reproduzem a forma exata.
 */
const AVATAR_GRID = 16;
const AVATAR_CELLS: { col: number; row: number }[] = (() => {
  const inside = (x: number, y: number) => {
    const between = (v: number, a: number, b: number) => v >= a && v <= b;
    const eye = between(y, 8.102, 10.949) && (between(x, 6, 7.488) || between(x, 16.51, 18));
    const body = between(x, 3, 21) && between(y, 5, 17.079) && !eye;
    const arms = between(y, 10.95, 14.05) && (between(x, 0, 3) || between(x, 21, 24));
    const legs =
      between(y, 17.079, 20) &&
      [4.487, 7.488, 15, 18].some((left) => between(x, left, left + 1.513));
    return body || arms || legs;
  };
  const cells: { col: number; row: number }[] = [];
  for (let row = 0; row < AVATAR_GRID; row++)
    for (let col = 0; col < AVATAR_GRID; col++)
      if (inside(0.75 + col * 1.5, 0.75 + row * 1.5)) cells.push({ col, row });
  return cells;
})();
const AVATAR_SIZE = 48; // 3px por célula: posições inteiras, sem frestas
const CELL = AVATAR_SIZE / AVATAR_GRID;

/** Pseudo-aleatório estável por índice, para atrasos orgânicos sem mudar a cada render. */
const jitter = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Os pixels do avatar. Cada um nasce no cursor do agente mais próximo da sua posição
 * final, escoa até ela mudando da cor do agente para o laranja e, ao separar, volta.
 */
function MorphAvatar({
  merge,
  agents,
}: {
  merge: { x: number; y: number };
  agents: Record<string, AgentState>;
}) {
  const left = Math.round(merge.x - AVATAR_SIZE / 2);
  const top = Math.round(merge.y - AVATAR_SIZE / 2);
  const sources = AGENTS.map((a) => ({ a, s: agents[a.id] })).filter((x) => x.s);

  return (
    <>
      {AVATAR_CELLS.map((cell, i) => {
        const tx = left + cell.col * CELL;
        const ty = top + cell.row * CELL;
        // Cada agente doa os pixels do lado do avatar voltado para ele (fatias por ângulo),
        // então os 6 participam da formação.
        const cellAngle = Math.atan2(ty + CELL / 2 - merge.y, tx + CELL / 2 - merge.x);
        const angleTo = (x: number, y: number) => {
          const d = Math.atan2(y - merge.y, x - merge.x) - cellAngle;
          return Math.abs(Math.atan2(Math.sin(d), Math.cos(d)));
        };
        const src = sources.reduce(
          (best, cur) => (angleTo(cur.s.x, cur.s.y) < angleTo(best.s.x, best.s.y) ? cur : best),
          sources[0],
        );
        const sx = (src?.s.x ?? tx) + (jitter(i) - 0.5) * 14;
        const sy = (src?.s.y ?? ty) + (jitter(i + 99) - 0.5) * 14;
        const color = src?.a.color ?? CLAUDE_ORANGE;
        // Forma de cima para baixo, com variação: parece crescer, não aparecer.
        const delay = cell.row * 0.028 + jitter(i + 7) * 0.12;
        return (
          <motion.span
            key={`px-${i}`}
            className="absolute left-0 top-0 block"
            style={{ width: CELL + 0.5, height: CELL + 0.5 }}
            initial={{ x: sx, y: sy, opacity: 0, scale: 0.3, backgroundColor: color }}
            animate={{
              x: tx,
              y: ty,
              opacity: 1,
              scale: 1,
              backgroundColor: CLAUDE_ORANGE,
              transition: {
                x: { type: "spring", stiffness: 140, damping: 17, mass: 0.9, delay },
                y: { type: "spring", stiffness: 140, damping: 17, mass: 0.9, delay },
                scale: { type: "spring", stiffness: 220, damping: 14, delay },
                opacity: { duration: 0.15, delay },
                backgroundColor: { duration: 0.7, delay: delay + 0.1, ease: "easeInOut" },
              },
            }}
            exit={{
              x: sx,
              y: sy,
              opacity: 0,
              scale: 0.3,
              backgroundColor: color,
              transition: {
                duration: 0.42,
                delay: (AVATAR_GRID - cell.row) * 0.012 + jitter(i + 3) * 0.06,
                ease: [0.4, 0, 0.2, 1],
              },
            }}
          />
        );
      })}
      <motion.span
        key="claude-label"
        className="absolute left-0 top-0 -translate-x-1/2 px-1.5 py-[1px] rounded-[5px] font-mono text-[10px] font-medium text-white whitespace-nowrap"
        style={{ left: merge.x, top: merge.y + AVATAR_SIZE / 2 + 4, background: CLAUDE_ORANGE }}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.75, duration: 0.3 } }}
        exit={{ opacity: 0, transition: { duration: 0.12 } }}
      >
        Claude
      </motion.span>
    </>
  );
}

export function SwarmOverlay({
  agents,
  merge,
}: {
  agents: Record<string, AgentState>;
  merge: { x: number; y: number } | null;
}) {
  const following = Object.values(agents).some((s) => s.follow);
  const arrowRef = useAimAtPointer(following);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-40">
      <AnimatePresence>{merge && <MorphAvatar key="morph" merge={merge} agents={agents} />}</AnimatePresence>
      {AGENTS.map((a, i) => {
        const s = agents[a.id];
        if (!s) return null;
        return (
          <div key={a.id}>
            <AnimatePresence>
              {s.sel && <Selection key={`s-${s.sel.x}-${s.sel.y}`} r={s.sel} color={a.color} hex={s.hex} />}
            </AnimatePresence>
            <motion.div
              className="absolute left-0 top-0 z-10"
              initial={false}
              animate={{ x: s.x, y: s.y, opacity: s.visible && !merge ? 1 : 0 }}
              transition={
                s.follow
                  ? {
                      // Molas diferentes por agente: o enxame chega em tempos diferentes.
                      x: { type: "spring", stiffness: 240 - i * 28, damping: 20 + i * 2, mass: 0.6 + i * 0.12 },
                      y: { type: "spring", stiffness: 240 - i * 28, damping: 20 + i * 2, mass: 0.6 + i * 0.12 },
                      // Ao se juntar, somem só depois de chegar ao ponto; ao se separar, aparecem na hora.
                      opacity: merge ? { duration: 0.18 } : { duration: 0.25, delay: 0.3 },
                    }
                  : { x: { duration: 0.42, ease }, y: { duration: 0.42, ease }, opacity: { duration: 0.3 } }
              }
            >
              <Cursor color={a.color} name={a.name} arrowRef={arrowRef(a.id)} />
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

type PillProps = {
  phase: Phase;
  progress: { done: number; total: number };
  waiting: boolean;
  onSkip: () => void;
};

export function SwarmPill({ phase, progress, waiting, onSkip }: PillProps) {
  const { dict } = useI18n();
  const [hidden, setHidden] = useState(false);
  const completed = progress.total > 0 && progress.done >= progress.total;

  useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(() => setHidden(true), completed ? 3000 : 0);
    return () => clearTimeout(t);
  }, [phase, completed]);

  const show = phase === "running" || (phase === "done" && completed && !hidden);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
          transition={{ duration: 0.3, ease }}
          className="fixed top-[60px] right-3 z-[60] flex items-center gap-2.5 pl-1.5 pr-1.5 py-1.5 rounded-full border border-border bg-background/90 backdrop-blur-sm shadow-lg"
        >
          <div className="flex -space-x-1.5">
            {AGENTS.map((a) => (
              <span
                key={a.id}
                title={a.name}
                className="size-5 grid place-items-center rounded-full text-[9px] font-bold text-white ring-2 ring-background"
                style={{ background: a.color }}
              >
                {a.initial}
              </span>
            ))}
          </div>
          {phase === "running" ? (
            <>
              <span className="flex items-center gap-1.5 font-mono text-[13px] text-foreground whitespace-nowrap">
                {waiting ? (
                  <>
                    <ArrowDownIcon className="size-3.5 text-mutedForeground animate-bounce" />
                    {dict.swarm.scroll}
                  </>
                ) : (
                  <>
                    <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                    {dict.swarm.live(AGENTS.length)}
                  </>
                )}
                <span className="tabular-nums text-muted">
                  {progress.done}/{progress.total}
                </span>
              </span>
              <button
                data-cuelume-tap=""
                type="button"
                onClick={onSkip}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-nonHover hover:bg-hover text-background transition-colors cursor-pointer"
              >
                {dict.swarm.skip}
              </button>
            </>
          ) : (
            <span className="flex items-center gap-1.5 pr-2 text-xs font-medium text-foreground whitespace-nowrap">
              <CheckIcon className="size-3.5 text-green-500" strokeWidth={3} />
              {dict.swarm.done(AGENTS.length)}
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
