/**
 * Curated links shown on /resources. Edit freely: each category has a title
 * and items with a short note in both languages.
 */
type Text = { en: string; "pt-br": string };

export type Resource = { name: string; href: string; note: Text };
export type ResourceCategory = { id: string; title: Text; items: Resource[] };

export const resources: ResourceCategory[] = [
  {
    id: "inspiration",
    title: { en: "Inspiration", "pt-br": "Inspiração" },
    items: [
      {
        name: "Are.na",
        href: "https://www.are.na",
        note: { en: "A calm place to collect references", "pt-br": "Um lugar calmo para guardar referências" },
      },
      {
        name: "Recent",
        href: "https://recent.design",
        note: { en: "Design curated daily", "pt-br": "Design selecionado todo dia" },
      },
      {
        name: "Cosmos",
        href: "https://www.cosmos.so",
        note: { en: "Visual curation without the noise", "pt-br": "Curadoria visual sem ruído" },
      },
      {
        name: "Mobbin",
        href: "https://mobbin.com",
        note: { en: "Real app screens and flows to search", "pt-br": "Telas e fluxos de apps reais para pesquisar" },
      },
      {
        name: "X",
        href: "https://x.com",
        note: { en: "Where I follow designers and engineers", "pt-br": "Onde acompanho designers e engenheiros" },
      },
      {
        name: "60fps",
        href: "https://60fps.design",
        note: { en: "Motion and interaction references from real apps", "pt-br": "Referências de movimento e interação de apps reais" },
      },
      {
        name: "Awwwards",
        href: "https://www.awwwards.com",
        note: { en: "Award-winning websites to study", "pt-br": "Sites premiados para estudar" },
      },
    ],
  },
  {
    id: "agent-skills",
    title: { en: "Agent skills", "pt-br": "Skills para agentes" },
    items: [
      {
        name: "/grill-me",
        href: "https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me",
        note: { en: "A skill that makes the agent question your plan", "pt-br": "Uma skill que faz o agente questionar seu plano" },
      },
      {
        name: "Pocket Design MCP",
        href: "https://github.com/jasonmello/pocket-design-mcp",
        note: { en: "An MCP server that gives agents design context", "pt-br": "Um servidor MCP que dá contexto de design aos agentes" },
      },
    ],
  },
  {
    id: "components",
    title: { en: "Components", "pt-br": "Componentes" },
    items: [
      {
        name: "shadcn/ui",
        href: "https://ui.shadcn.com",
        note: { en: "Accessible components you copy and make your own", "pt-br": "Componentes acessíveis que você copia e adapta" },
      },
      {
        name: "21st.dev",
        href: "https://21st.dev",
        note: { en: "A community registry of React components", "pt-br": "Um registro comunitário de componentes React" },
      },
      {
        name: "coss ui",
        href: "https://coss.com/ui",
        note: {
          en: "Accessible React components from Cal.com, built on Base UI and Tailwind",
          "pt-br": "Componentes React acessíveis do Cal.com, feitos com Base UI e Tailwind",
        },
      },
    ],
  },
  {
    id: "utilities",
    title: { en: "Utilities", "pt-br": "Utilitários" },
    items: [
      {
        name: "SVGOMG",
        href: "https://jakearchibald.github.io/svgomg/",
        note: { en: "Shrink SVGs right in the browser", "pt-br": "Otimize SVGs direto no navegador" },
      },
      {
        name: "Coolors",
        href: "https://coolors.co",
        note: { en: "Generate and explore color palettes", "pt-br": "Gere e explore paletas de cores" },
      },
      {
        name: "OpenShaders",
        href: "https://openshaders.com",
        note: { en: "Open shaders to learn from and reuse", "pt-br": "Shaders abertos para estudar e reaproveitar" },
      },
    ],
  },
  {
    id: "product",
    title: { en: "Product", "pt-br": "Produto" },
    items: [
      {
        name: "PostHog",
        href: "https://posthog.com",
        note: { en: "Product analytics, flags and session replay in one place", "pt-br": "Analytics de produto, feature flags e replays num só lugar" },
      },
      {
        name: "Linear",
        href: "https://linear.app",
        note: { en: "Issue tracking that stays out of the way", "pt-br": "Gestão de tarefas que não atrapalha" },
      },
    ],
  },
  {
    id: "fonts",
    title: { en: "Fonts", "pt-br": "Fontes" },
    items: [
      {
        name: "Fontshare",
        href: "https://www.fontshare.com",
        note: { en: "Quality typefaces, free for any use", "pt-br": "Fontes de qualidade, grátis para qualquer uso" },
      },
      {
        name: "Google Fonts",
        href: "https://fonts.google.com",
        note: { en: "The default open font library", "pt-br": "A biblioteca padrão de fontes abertas" },
      },
      {
        name: "Plau",
        href: "https://plau.co",
        note: { en: "Brazilian type foundry with character", "pt-br": "Fundição de tipos brasileira cheia de personalidade" },
      },
      {
        name: "Pintassilgo Prints",
        href: "https://pintassilgoprints.com/fonts/",
        note: { en: "Expressive typefaces from a Brazilian studio", "pt-br": "Fontes expressivas de um estúdio brasileiro" },
      },
    ],
  },
  {
    id: "icons",
    title: { en: "Icons", "pt-br": "Ícones" },
    items: [
      {
        name: "Lucide",
        href: "https://lucide.dev",
        note: { en: "Open source icons, the set this site uses", "pt-br": "Ícones open source, o conjunto que este site usa" },
      },
      {
        name: "Phosphor Icons",
        href: "https://phosphoricons.com",
        note: { en: "Flexible icon family in six weights", "pt-br": "Família de ícones flexível em seis pesos" },
      },
      {
        name: "Tabler Icons",
        href: "https://tabler.io/icons",
        note: { en: "Thousands of free, consistent icons", "pt-br": "Milhares de ícones gratuitos e consistentes" },
      },
      {
        name: "Nucleo",
        href: "https://nucleoapp.com",
        note: { en: "Premium icon library with an app to manage it", "pt-br": "Biblioteca premium de ícones com um app para organizar" },
      },
      {
        name: "Radix Icons",
        href: "https://www.radix-ui.com/icons",
        note: { en: "Crisp 15px icons, ready as React components", "pt-br": "Ícones nítidos de 15px, prontos como componentes React" },
      },
      {
        name: "Hugeicons",
        href: "https://hugeicons.com",
        note: { en: "Large icon library, free and paid", "pt-br": "Grande biblioteca de ícones, grátis e paga" },
      },
      {
        name: "Central Icons",
        href: "https://centralicons.com",
        note: { en: "A carefully drawn icon collection", "pt-br": "Uma coleção de ícones desenhada com cuidado" },
      },
      {
        name: "SVGL",
        href: "https://svgl.app",
        note: { en: "Searchable SVG logos of brands and products", "pt-br": "Logos SVG de marcas e produtos, com busca" },
      },
      {
        name: "Pixelarticons",
        href: "https://pixelarticons.com",
        note: { en: "Pixel-perfect icons with a retro grid", "pt-br": "Ícones pixelados com grid retrô" },
      },
    ],
  },
  {
    id: "design-systems",
    title: { en: "Design systems", "pt-br": "Design systems" },
    items: [
      {
        name: "Design Systems Brasileiros",
        href: "https://designsystemsbrasileiros.com",
        note: { en: "A directory of Brazilian design systems", "pt-br": "Um diretório de design systems brasileiros" },
      },
      {
        name: "components.design",
        href: "https://components.design",
        note: { en: "How design systems name and build components", "pt-br": "Como design systems nomeiam e constroem componentes" },
      },
    ],
  },
  {
    id: "motion",
    title: { en: "Motion", "pt-br": "Movimento" },
    items: [
      {
        name: "Motion",
        href: "https://motion.dev",
        note: { en: "Animation library for React, Vue and vanilla JS", "pt-br": "Biblioteca de animação para React, Vue e JS puro" },
      },
      {
        name: "GSAP",
        href: "https://gsap.com",
        note: { en: "Battle-tested timeline animation for the web", "pt-br": "Animação com timelines, testada em batalha na web" },
      },
      {
        name: "Transitions.dev",
        href: "https://transitions.dev",
        note: { en: "Ready-made transition snippets", "pt-br": "Trechos prontos de transições" },
      },
      {
        name: "LottieFiles",
        href: "https://lottiefiles.com",
        note: { en: "Lightweight vector animations", "pt-br": "Animações vetoriais leves" },
      },
    ],
  },
  {
    id: "sound",
    title: { en: "Sound", "pt-br": "Som" },
    items: [
      {
        name: "Cuelume",
        href: "https://cuelume-site.pages.dev",
        note: { en: "Web Audio interface sounds, the ones you hear on this site", "pt-br": "Sons de interface com Web Audio, os que você ouve neste site" },
      },
      {
        name: "@web-kits/audio",
        href: "https://audio.raphaelsalaja.com",
        note: { en: "Synthesized sound effects for interfaces", "pt-br": "Efeitos sonoros sintetizados para interfaces" },
      },
    ],
  },
  {
    id: "learning",
    title: { en: "Learning", "pt-br": "Aprendizado" },
    items: [
      {
        name: "Devouring Details",
        href: "https://devouringdetails.com",
        note: { en: "Interaction design, taken apart detail by detail", "pt-br": "Design de interação destrinchado detalhe por detalhe" },
      },
      {
        name: "animations.dev",
        href: "https://animations.dev",
        note: { en: "A course on animating for the web", "pt-br": "Um curso sobre animação para a web" },
      },
      {
        name: "Invisible Details",
        href: "https://invisibledetails.com",
        note: { en: "The small decisions that make interfaces feel right", "pt-br": "As pequenas decisões que fazem uma interface parecer certa" },
      },
      {
        name: "Interfaces",
        href: "https://interfaces.dev",
        note: { en: "A magazine about design engineering", "pt-br": "Uma revista sobre design engineering" },
      },
      {
        name: "Interface Craft",
        href: "https://www.interfacecraft.dev",
        note: { en: "A library of well-crafted interface work", "pt-br": "Uma biblioteca de interfaces bem acabadas" },
      },
    ],
  },
];

export const resourceCount = resources.reduce((n, c) => n + c.items.length, 0);
