import type { Locale } from "@/lib/i18n";

/** Interface strings. Content (bio, experiences, projects...) lives in data/localized.ts. */
const en = {
  nav: { home: "Home", projects: "Projects", experience: "Experience", resources: "Resources", writing: "Writing", search: "Search (⌘K)" },
  language: { label: "Language", switchTo: "Switch to Portuguese" },
  theme: { toggle: "Toggle theme" },
  sound: { mute: "Mute sounds", unmute: "Unmute sounds" },
  hero: { bookCall: "Book a call", sendEmail: "Send email", socials: "my socials" },
  game: {
    play: "Play game",
    again: "Play again",
    howTo: "Space, ↑ or click to jump",
    over: "Game over",
    best: "Best",
    exit: "Exit game",
  },
  github: {
    title: "contributions in the last year",
    perDay: "per day on average",
    unit: { one: "contribution", other: "contributions" },
  },
  sections: {
    projects: "Projects",
    experience: "Experience",
    skills: "Skills & Technologies",
    now: "Now",
    viewAll: "View all",
    projectsCount: (n: number) => `${n} ${n === 1 ? "project" : "projects"}`,
    positionsCount: (n: number) => `${n} ${n === 1 ? "position" : "positions"}`,
    updated: (date: string) => `Updated ${date}`,
  },
  project: { view: "View project", stack: "Tech stack" },
  projectsPage: {
    title: "Projects",
    subtitle: "All projects",
    description: (name: string) => `Projects built by ${name}: products, experiments and open source work.`,
    comingSoon: "Coming soon",
    moreOn: "More projects on",
  },
  experiencePage: {
    title: "Experience",
    subtitle: "Where I've worked and what I've built",
    description: (name: string, companies: string) =>
      `${name}'s work experience: ${companies}. Roles, responsibilities and the stack behind each one.`,
  },
  resourcesPage: {
    title: "Resources",
    subtitle: (n: number) => `${n} tools and references I keep coming back to`,
    description:
      "Tools and references Isaque Böck keeps coming back to: courses, inspiration, components, icons, fonts, motion, design systems and agent skills.",
  },
  writingPage: {
    title: "Writing",
    subtitle: "Articles on building products and interfaces, plus my study logs",
    description: "Articles by Isaque Böck about building products, interfaces for people and AI agents, and the craft of product engineering, plus a study log.",
    showLogs: "Show study logs",
    log: "Log",
    article: "Article",
    back: "All writing",
    empty: "Nothing published yet. The first articles are on the way.",
    emptyWithLogs: "Nothing here yet.",
  },
  newsletter: {
    title: "Newsletter",
    subtitle: "Get updates about my projects and articles.",
    thanks: "Thanks! You'll get the next updates.",
    email: "Your email",
    placeholder: "you@email.com",
    subscribe: "Subscribe",
    soon: "Coming soon",
  },
  command: {
    label: "Search",
    placeholder: "Search pages, projects, links...",
    empty: "No results found.",
    pages: "Pages",
    projects: "Projects",
    socials: "Socials",
    theme: "Theme",
    language: "Language",
    switchLanguage: "View in Portuguese",
  },
  swarm: {
    scroll: "Scroll to continue",
    live: (n: number) => `${n} agents live`,
    skip: "Skip",
    done: (n: number) => `Page built by ${n} agents`,
  },
  scrollTop: "Back to top",
  notFound: { title: "Page not found.", back: "Back to home" },
  seo: {
    description:
      "Isaque Böck is a product engineer building fast, accessible and well-crafted web products with TypeScript, React, Next.js, Vue and Node.js.",
  },
};

export type Dictionary = typeof en;

const ptBr: Dictionary = {
  nav: { home: "Início", projects: "Projetos", experience: "Experiência", resources: "Recursos", writing: "Escrita", search: "Buscar (⌘K)" },
  language: { label: "Idioma", switchTo: "Mudar para inglês" },
  theme: { toggle: "Alternar tema" },
  sound: { mute: "Desligar sons", unmute: "Ligar sons" },
  hero: { bookCall: "Agendar conversa", sendEmail: "Enviar email", socials: "minhas redes" },
  game: {
    play: "Jogar",
    again: "Jogar de novo",
    howTo: "Espaço, ↑ ou clique para pular",
    over: "Fim de jogo",
    best: "Recorde",
    exit: "Sair do jogo",
  },
  github: {
    title: "contribuições no último ano",
    perDay: "por dia em média",
    unit: { one: "contribuição", other: "contribuições" },
  },
  sections: {
    projects: "Projetos",
    experience: "Experiência",
    skills: "Habilidades e Tecnologias",
    now: "Agora",
    viewAll: "Ver todos",
    projectsCount: (n) => `${n} ${n === 1 ? "projeto" : "projetos"}`,
    positionsCount: (n) => `${n} ${n === 1 ? "cargo" : "cargos"}`,
    updated: (date) => `Atualizado em ${date}`,
  },
  project: { view: "Ver projeto", stack: "Tecnologias" },
  projectsPage: {
    title: "Projetos",
    subtitle: "Todos os projetos",
    description: (name) => `Projetos criados por ${name}: produtos, experimentos e open source.`,
    comingSoon: "Em breve",
    moreOn: "Mais projetos no",
  },
  experiencePage: {
    title: "Experiência",
    subtitle: "Onde trabalhei e o que construí",
    description: (name, companies) =>
      `Experiência profissional de ${name}: ${companies}. Cargos, responsabilidades e as tecnologias de cada um.`,
  },
  resourcesPage: {
    title: "Recursos",
    subtitle: (n) => `${n} ferramentas e referências que eu sempre revisito`,
    description:
      "Ferramentas e referências que Isaque Böck sempre revisita: cursos, inspiração, componentes, ícones, fontes, movimento, design systems e skills para agentes.",
  },
  writingPage: {
    title: "Escrita",
    subtitle: "Artigos sobre construir produtos e interfaces, e meus logs de estudo",
    description: "Artigos de Isaque Böck sobre construir produtos, interfaces para pessoas e agentes de IA e o ofício de product engineering, além de um log de estudos.",
    showLogs: "Mostrar logs de estudo",
    log: "Log",
    article: "Artigo",
    back: "Todos os textos",
    empty: "Nada publicado ainda. Os primeiros artigos estão a caminho.",
    emptyWithLogs: "Nada por aqui ainda.",
  },
  newsletter: {
    title: "Newsletter",
    subtitle: "Receba novidades sobre meus projetos e artigos.",
    thanks: "Valeu! Você vai receber as próximas novidades.",
    email: "Seu email",
    placeholder: "voce@email.com",
    subscribe: "Inscrever",
    soon: "Em breve",
  },
  command: {
    label: "Buscar",
    placeholder: "Buscar páginas, projetos, links...",
    empty: "Nenhum resultado.",
    pages: "Páginas",
    projects: "Projetos",
    socials: "Redes",
    theme: "Tema",
    language: "Idioma",
    switchLanguage: "Ver em inglês",
  },
  swarm: {
    scroll: "Role para continuar",
    live: (n) => `${n} agentes ativos`,
    skip: "Pular",
    done: (n) => `Página montada por ${n} agentes`,
  },
  scrollTop: "Voltar ao topo",
  notFound: { title: "Página não encontrada.", back: "Voltar ao início" },
  seo: {
    description:
      "Isaque Böck é product engineer e cria produtos web rápidos, acessíveis e bem acabados com TypeScript, React, Next.js, Vue e Node.js.",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, "pt-br": ptBr };
export const getDictionary = (locale: Locale) => dictionaries[locale];
