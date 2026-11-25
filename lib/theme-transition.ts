"use client";

import { useCallback } from "react";
import { useTheme } from "next-themes";
import { sfx } from "@/lib/sound";

/**
 * Troca o tema com uma cortina de cima para baixo (View Transitions API).
 * Sem suporte no navegador, ou com movimento reduzido, troca na hora.
 */
export function useThemeTransition() {
  const { resolvedTheme, setTheme } = useTheme();

  return useCallback(() => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    sfx("toggle", { direction: next === "dark" ? "back" : "forward" });
    const apply = () => {
      // Aplica a classe já, para a "foto" do novo tema sair certa;
      // o next-themes só a aplica num efeito, depois da foto.
      const root = document.documentElement;
      root.classList.toggle("dark", next === "dark");
      root.classList.toggle("light", next === "light");
      root.style.colorScheme = next;
      setTheme(next);
    };

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) {
      apply();
      return;
    }
    document.startViewTransition(apply);
  }, [resolvedTheme, setTheme]);
}
