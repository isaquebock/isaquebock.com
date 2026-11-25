export type AgentRole = "builder";

export type Agent = {
  id: string;
  name: string;
  initial: string;
  color: string;
  role: AgentRole;
};

/** Builders only, each named after a Claude model. */
export const AGENTS: Agent[] = [
  { id: "opus", name: "Opus 5.5", initial: "O", color: "#d97757", role: "builder" },
  { id: "sonnet", name: "Sonnet 5.5", initial: "S", color: "#3b82f6", role: "builder" },
  { id: "haiku", name: "Haiku 5.5", initial: "H", color: "#10b981", role: "builder" },
  { id: "fable", name: "Fable 5.2", initial: "F", color: "#ec4899", role: "builder" },
];

/** Ponta da seta no SVG do cursor (viewBox 18×18): é o ponto exato que o cursor marca. */
export const ARROW_TIP = { x: 2, y: 1.5 } as const;

/** Direção para onde a seta aponta sem rotação (da base até a ponta), em graus. */
export const ARROW_HEADING = (Math.atan2(ARROW_TIP.y - 8.5, ARROW_TIP.x - 8.5) * 180) / Math.PI;

export type Rect = { x: number; y: number; w: number; h: number };

export type AgentState = {
  x: number;
  y: number;
  visible: boolean;
  /** Caixa de seleção do bloco em construção. */
  sel?: Rect | null;
  hex?: string | null;
  /** Depois da montagem: o agente segue o cursor do usuário. */
  follow?: boolean;
};
