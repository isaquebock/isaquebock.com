"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * O next-themes injeta um <script> que aplica o tema antes da primeira pintura.
 * No servidor ele precisa rodar como JavaScript; no cliente, o React 19 acusa
 * "Encountered a script tag while rendering React component" quando o renderiza.
 * Marcar o script como não-JavaScript só no cliente mantém o tema sem flash e
 * silencia o erro (o script já rodou no HTML do servidor).
 */
const scriptProps =
  typeof window === "undefined" ? undefined : ({ type: "application/json" } as const);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      scriptProps={scriptProps}
    >
      {children}
    </NextThemesProvider>
  );
}
