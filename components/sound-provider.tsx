"use client";

import { useEffect } from "react";
import { bind, unlock } from "cuelume";
import { initSound } from "@/lib/sound";

/** Liga os atributos data-cuelume-* da página e libera o áudio no primeiro gesto. */
export function SoundProvider() {
  useEffect(() => {
    initSound();
    const unbind = bind();
    const firstGesture = () => {
      void unlock();
    };
    window.addEventListener("pointerdown", firstGesture, { once: true });
    window.addEventListener("keydown", firstGesture, { once: true });
    return () => {
      unbind();
      window.removeEventListener("pointerdown", firstGesture);
      window.removeEventListener("keydown", firstGesture);
    };
  }, []);
  return null;
}
