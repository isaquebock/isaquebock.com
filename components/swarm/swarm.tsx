"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AGENTS, type AgentState, type Rect } from "./agents";
import { SwarmOverlay, SwarmPill } from "./overlay";
import { sfx } from "@/lib/sound";

type Status = "hidden" | "building" | "done";
export type Phase = "idle" | "running" | "done";
type Meta = { el: HTMLElement; typing?: number };

type Ctx = {
  register: (id: string, meta: Meta) => () => void;
  statusOf: (id: string) => Status;
};

const SwarmContext = createContext<Ctx | null>(null);

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason);
    const t = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(t);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

/** Cor de fundo (ou do texto) do bloco em hexadecimal, para o chip de cor. */
function hexOf(el: HTMLElement) {
  const target = (el.querySelector(":scope > :not([data-swarm-skeleton])") as HTMLElement) ?? el;
  const cs = getComputedStyle(target);
  const pick = cs.backgroundColor.startsWith("rgba(0, 0, 0, 0)") ? cs.color : cs.backgroundColor;
  const m = pick.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return null;
  return "#" + m.slice(1, 4).map((n) => Number(n).toString(16).padStart(2, "0")).join("").toUpperCase();
}

/** Bloco visível na tela (descontando a navbar e uma margem no rodapé da janela). */
function inView(el: HTMLElement, below = 0) {
  const r = el.getBoundingClientRect();
  return r.bottom > 56 && r.top < window.innerHeight - 40 + below;
}

export function SwarmProvider({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const registry = useRef(new Map<string, Meta>());
  const abortRef = useRef<AbortController | null>(null);
  /** Last known mouse position (viewport), kept across phases. */
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [phase, setPhase] = useState<Phase>("idle");
  const [agents, setAgents] = useState<Record<string, AgentState>>({});
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [waiting, setWaiting] = useState(false);
  /** Ponto onde o enxame se junta num só avatar quando o mouse fica parado. */
  const [merge, setMerge] = useState<{ x: number; y: number } | null>(null);

  const register = useCallback((id: string, meta: Meta) => {
    registry.current.set(id, meta);
    return () => {
      registry.current.delete(id);
    };
  }, []);

  const ctx = useMemo<Ctx>(
    () => ({
      register,
      statusOf: (id) => (phase === "done" ? "done" : (status[id] ?? "hidden")),
    }),
    [register, phase, status],
  );

  useEffect(() => {
    const ac = new AbortController();
    abortRef.current = ac;
    const { signal } = ac;

    const update = (id: string, patch: Partial<AgentState>) =>
      setAgents((a) => ({ ...a, [id]: { ...a[id], ...patch } }));
    const mark = (id: string, s: Status) => setStatus((prev) => ({ ...prev, [id]: s }));

    async function run() {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      await document.fonts?.ready;
      await sleep(200, signal);

      // Movimento reduzido ou tela de toque (sem cursor para o enxame seguir):
      // a página aparece já montada, sem agentes.
      if (
        matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !matchMedia("(pointer: fine)").matches
      ) {
        setPhase("done");
        return;
      }

      const wrap = wrapRef.current;
      if (!wrap) return;
      const rel = (el: HTMLElement): Rect => {
        const r = el.getBoundingClientRect();
        const w = wrap.getBoundingClientRect();
        return { x: r.left - w.left, y: r.top - w.top, w: r.width, h: r.height };
      };
      const meta = (id: string) => registry.current.get(id);

      // Blocos na ordem visual (de cima para baixo, da esquerda para a direita).
      const ids = [...registry.current.keys()]
        .map((id) => ({ id, r: rel(meta(id)!.el) }))
        .sort((a, b) => (Math.abs(a.r.y - b.r.y) > 8 ? a.r.y - b.r.y : a.r.x - b.r.x))
        .map((t) => t.id);

      const claimed = new Set<string>();
      const doneIds: string[] = [];
      let busy = 0;
      const finished = () => doneIds.length >= ids.length;
      const pending = (below = 0) =>
        ids.filter((id) => !claimed.has(id) && meta(id) && inView(meta(id)!.el, below));

      /** Próximo bloco visível que ninguém pegou ainda. */
      const take = () => {
        const id = pending()[0];
        if (id) claimed.add(id);
        return id ?? null;
      };

      const complete = (id: string) => {
        mark(id, "done");
        doneIds.push(id);
        setProgress({ done: doneIds.length, total: ids.length });
      };

      /** Agente ocioso espera perto da borda de baixo da tela, acompanhando o scroll. */
      const park = (id: string, slot: number) => {
        const w = wrap.getBoundingClientRect();
        const y = Math.min(window.innerHeight - 110 - w.top + (slot % 2) * 26, wrap.scrollHeight - 30);
        const col = Math.min(690, w.width);
        const x = (w.width - col) / 2 + col * (0.08 + slot * 0.16);
        setAgents((a) => {
          const cur = a[id];
          if (cur && Math.abs(cur.x - x) < 3 && Math.abs(cur.y - y) < 3 && !cur.sel)
            return a;
          return { ...a, [id]: { ...cur, x, y, visible: true, follow: false, sel: null, hex: null } };
        });
      };

      setProgress({ done: 0, total: ids.length });
      setPhase("running");

      // Os agentes entram pelo canto superior direito da tela.
      const W = wrap.clientWidth;
      const topNow = 60 - wrap.getBoundingClientRect().top;
      setAgents(
        Object.fromEntries(
          AGENTS.map((a, i) => [a.id, { x: W + 30 + i * 6, y: topNow + i * 10, visible: true }]),
        ),
      );

      const builder = async (id: string, slot: number) => {
        await sleep(slot * 160, signal);
        while (!finished()) {
          const task = take();
          if (!task) {
            // Everything on screen is built: while the user doesn't scroll, the
            // swarm follows the cursor (see effect below) instead of parking.
            const idle = busy === 0 && pending(0).length === 0;
            if (idle) setWaiting(true);
            if (!idle || !matchMedia("(pointer: fine)").matches) park(id, slot);
            await sleep(220, signal);
            continue;
          }
          busy++;
          setWaiting(false);
          const m = meta(task)!;
          const r = rel(m.el);
          if (r.w < 2 || r.h < 2) {
            // Bloco vazio (ex.: gráfico sem dados): nada para construir.
            complete(task);
            busy--;
            continue;
          }
          // Com muitos blocos na fila (scroll rápido), os agentes aceleram.
          const backlog = pending().length;
          const speed = backlog > 5 ? 0.5 : backlog > 2 ? 0.75 : 1;
          mark(task, "building");
          update(id, {
            x: r.x + Math.min(r.w * rand(0.25, 0.75), 260),
            y: r.y + Math.min(r.h * rand(0.3, 0.7), 120),
            visible: true,
            follow: false,
            sel: null,
            hex: null,
          });
          await sleep(Math.max(rand(380, 460) * speed, 260), signal);
          update(id, { sel: r, hex: Math.random() < 0.35 ? hexOf(m.el) : null });
          if (m.typing) {
            mark(task, "done");
            await sleep(Math.min(Math.max(m.typing * 14, 380), 1100), signal);
            doneIds.push(task);
            setProgress({ done: doneIds.length, total: ids.length });
          } else {
            await sleep(rand(260, 480) * speed, signal);
            complete(task);
            await sleep(120, signal);
          }
          update(id, { sel: null, hex: null });
          busy--;
        }
      };

      await Promise.all(AGENTS.map((a, i) => builder(a.id, i)));

      // Tudo montado. Com mouse, os agentes ficam e passam a seguir o cursor;
      // em telas de toque, saem de cena.
      setWaiting(false);
      const follow = matchMedia("(pointer: fine)").matches;
      setAgents((prev) =>
        Object.fromEntries(
          Object.entries(prev).map(([id, s], i) => [
            id,
            follow
              ? { ...s, follow: true, sel: null, hex: null }
              : { ...s, x: W + 40, y: s.y - 60 + i * 4, sel: null, hex: null },
          ]),
        ),
      );
      sfx("success");
      setPhase("done");
      if (!follow) {
        await sleep(500, signal);
        setAgents({});
      }
    }

    run().catch(() => {});
    return () => ac.abort();
  }, []);

  const skip = useCallback(() => {
    abortRef.current?.abort();
    const follow = matchMedia("(pointer: fine)").matches;
    setAgents((prev) =>
      follow
        ? Object.fromEntries(
            Object.entries(prev).map(([id, s]) => [
              id,
              { ...s, follow: true, sel: null, hex: null },
            ]),
          )
        : {},
    );
    setWaiting(false);
    setPhase("done");
  }, []);

  // Always remember where the mouse is, so the swarm can jump to it right away.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") pointerRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // The swarm follows the cursor after the build, and also mid-build while
  // everything on screen is done and the user hasn't scrolled to new blocks.
  const following = phase === "done" || (phase === "running" && waiting);

  useEffect(() => {
    if (!following || !matchMedia("(pointer: fine)").matches) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    let pointer = pointerRef.current;
    let raf = 0;
    let idleTimer = 0;
    let merged = false;

    const apply = () => {
      raf = 0;
      if (!pointer) return;
      const w = wrap.getBoundingClientRect();
      const px = pointer.x - w.left;
      const py = pointer.y - w.top;

      if (merged) {
        // Mouse parado: os agentes ficam onde estão e se dissolvem em pixels,
        // que formam o avatar logo abaixo e à direita do cursor (ver overlay).
        setMerge({ x: px + 34, y: py + 30 });
        return;
      }

      setAgents((prev) => {
        const next: Record<string, AgentState> = {};
        AGENTS.forEach((a, i) => {
          // Cada agente ocupa um lugar num anel em volta do cursor.
          const angle = (i / AGENTS.length) * Math.PI * 2 + 0.5;
          const radius = 38 + (i % 2) * 22;
          const cur = prev[a.id] ?? { x: px, y: py, visible: false };
          const dx = Math.cos(angle) * radius;
          const dy = Math.sin(angle) * radius * 0.75;
          next[a.id] = {
            ...cur,
            x: px + dx,
            y: py + dy,
            visible: true,
            follow: true,
            sel: null,
            hex: null,
          };
        });
        return next;
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer = { x: e.clientX, y: e.clientY };
      if (merged) {
        // Voltou a mexer: o avatar se desfaz e o enxame volta a seguir.
        merged = false;
        setMerge(null);
      }
      schedule();
      startIdleTimer();
    };
    const onLeave = () => {
      clearTimeout(idleTimer);
      merged = false;
      setMerge(null);
      setAgents((prev) =>
        Object.fromEntries(Object.entries(prev).map(([id, s]) => [id, { ...s, visible: false }])),
      );
    };

    const startIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        merged = true;
        sfx("ready", { emphasis: "subtle" });
        schedule();
      }, 1500);
    };
    if (pointer) {
      schedule();
      startIdleTimer();
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
      // Back to building: undo the merged avatar so the agents reappear.
      setMerge(null);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", schedule);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [following]);

  return (
    <SwarmContext.Provider value={ctx}>
      <noscript>
        <style>{`[data-swarm]>:not([data-swarm-skeleton]){opacity:1!important;filter:none!important;transform:none!important}[data-swarm-skeleton]{display:none}`}</style>
      </noscript>
      <div ref={wrapRef} className="relative">
        {children}
        <SwarmOverlay agents={agents} merge={merge} />
      </div>
      <SwarmPill phase={phase} progress={progress} waiting={waiting} onSkip={skip} />
    </SwarmContext.Provider>
  );
}

type BuildProps = {
  id: string;
  className?: string;
  as?: "div" | "span";
  /** Texto digitado letra a letra quando o bloco é construído. */
  text?: string;
  children?: React.ReactNode;
};

/**
 * Bloco que os agentes constroem quando aparece na tela. Fora de um SwarmProvider, renderiza normalmente.
 * Os filhos diretos precisam ser elementos (não texto solto) para o efeito de revelação.
 */
export function Build({ id, className, as: Tag = "div", text, children }: BuildProps) {
  const ctx = useContext(SwarmContext);
  const ref = useRef<HTMLElement>(null);
  const register = ctx?.register;

  useEffect(() => {
    if (!register || !ref.current) return;
    return register(id, { el: ref.current, typing: text?.length });
  }, [register, id, text]);

  const status: Status = ctx ? ctx.statusOf(id) : "done";

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLSpanElement>}
      data-swarm={ctx ? status : undefined}
      className={`relative ${className ?? ""}`}
    >
      {ctx && <span data-swarm-skeleton aria-hidden />}
      {text != null ? (
        ctx && status === "done" ? (
          <TypeText text={text} />
        ) : (
          <span>{text}</span>
        )
      ) : (
        children
      )}
    </Tag>
  );
}

function TypeText({ text }: { text: string }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    const duration = Math.min(Math.max(text.length * 14, 380), 1100);
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      setN(Math.round(p * text.length));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);

  return (
    <span>
      {text.slice(0, n)}
      {n < text.length && (
        <span aria-hidden className="inline-block w-[2px] h-[1em] -mb-[0.12em] bg-current animate-pulse" />
      )}
      <span aria-hidden className="invisible">
        {text.slice(n)}
      </span>
    </span>
  );
}
