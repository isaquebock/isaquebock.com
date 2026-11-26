"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PlayIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { DitherHorizon } from "@/components/dither/horizon";
import { sfx } from "@/lib/sound";
import { RunnerGame } from "./runner-game";
import { DitherButton } from "@/components/dither-button";

type Labels = { play: string; again: string; howTo: string; over: string; best: string; exit: string };

const HOVER_DELAY = 1500;

/**
 * O banner em dither do topo. Com o mouse parado em cima por 1,5 s aparece
 * "Play game"; ao clicar, o banner vira um corredor infinito.
 */
export function HeroBanner({ labels }: { labels: Labels }) {
  const [hint, setHint] = useState(false);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(0);

  const clearTimer = () => window.clearTimeout(timer.current);

  const start = () => {
    clearTimer();
    setHint(false);
    setPlaying(true);
    sfx("open");
  };

  const exit = useCallback(() => {
    setPlaying(false);
    sfx("close");
  }, []);

  // Enquanto joga, os cursores do enxame somem para não atrapalhar.
  useEffect(() => {
    document.documentElement.classList.toggle("game-active", playing);
    return () => document.documentElement.classList.remove("game-active");
  }, [playing]);

  useEffect(() => clearTimer, []);

  return (
    <div
      className="relative h-[140px] sm:h-[220px] overflow-hidden rounded-[10px]"
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse" || playing) return;
        clearTimer();
        timer.current = window.setTimeout(() => setHint(true), HOVER_DELAY);
      }}
      onPointerLeave={() => {
        clearTimer();
        setHint(false);
      }}
    >
      {playing ? (
        <RunnerGame labels={labels} onExit={exit} />
      ) : (
        <>
          <DitherHorizon className="absolute inset-0" />
          <AnimatePresence>
            {hint && (
              <motion.div
                key="hint"
                className="absolute inset-0 grid place-items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  initial={{ scale: 0.9, filter: "blur(4px)" }}
                  animate={{ scale: 1, filter: "blur(0px)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <DitherButton onClick={start}>
                    <PlayIcon className="size-3.5 fill-current" />
                    {labels.play}
                  </DitherButton>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
