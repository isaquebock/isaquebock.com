/**
 * Content per locale. The English source stays in each data file; this file
 * holds the Portuguese (pt-br) overrides and the getters that merge them.
 * When you edit English content, update the matching entry here.
 */
import type { Locale } from "@/lib/i18n";
import { profile } from "./profile";
import { experiences, type Experience } from "./experiences";
import { projects, type Project } from "./projects";
import { now } from "./now";

const pt = {
  bio: [
    "Eu sou product engineer e construo produtos de ponta a ponta, desde entender o problema e desenhar a solução até colocar no ar, medir os resultados e evoluir.",
    "O que me move é entregar boas experiências que gerem valor real para quem usa.",
  ],
  now: {
    Working: { label: "Trabalhando", text: "Criando interfaces para pessoas e agentes de IA na Azion com Astro, Nuxt e Vue." },
    Crafting: { label: "Criando", text: "Dois produtos ainda em segredo. Novidades em breve." },
    Studying: { label: "Estudando", text: "Go e Rust." },
  } as Record<string, { label: string; text: string }>,
  projects: {
    "stealth-one": { title: "Privado", description: "Algo novo está sendo construído. Detalhes em breve." },
    "stealth-two": { title: "Privado", description: "Em segredo por enquanto. Fique ligado." },
  } as Record<string, Partial<Pick<Project, "title" | "description" | "highlights" | "tags">>>,
  experiences: {
    Azion: {
      period: "jul 2025 – atual",
      bullets: [
        "Construo e evoluo interfaces com Astro, Svelte, Vue.js e TypeScript, estilizadas com Tailwind CSS, da primeira implementação até a produção.",
        "Desenho componentes reutilizáveis e a arquitetura de interface por trás deles, para que novas telas sejam montadas com peças consistentes e bem testadas.",
        "Cuido do gerenciamento de estado de fluxos complexos com stores e signals, mantendo o fluxo de dados previsível conforme as features crescem.",
        "Trabalho junto com design nos detalhes de UX/UI, com atenção a performance, acessibilidade, responsividade e usabilidade.",
        "Colaboro em um time multidisciplinar num contexto próximo de infraestrutura e escalabilidade, contribuindo com decisões técnicas e a evolução do produto.",
      ],
    },
    enjoei: {
      period: "ago 2024 – jul 2025",
      bullets: [
        "Frontend: construí e mantive interfaces com Astro, Svelte, Vue.js, TypeScript e Tailwind CSS, com foco em componentização, arquitetura de interface e UX/UI.",
        "Gerenciei o estado das aplicações com stores, signals e context APIs, mantendo telas complexas consistentes e fáceis de evoluir.",
        "Backend: criei, mantive e otimizei APIs REST com Node.js e Java, integrando com sistemas internos e seguindo boas práticas de arquitetura.",
        "DevOps e infra: trabalhei com Docker, Kubernetes, pipelines de CI/CD e ambientes Unix/Linux para manter as aplicações escaláveis e observáveis.",
        "Qualidade: escrevi testes automatizados unitários, de integração e end-to-end com Jest e Playwright, aumentando a confiança em cada release.",
      ],
    },
    Accountfy: {
      period: "nov 2023 – ago 2024",
      bullets: [
        "Desenvolvi o módulo de relatórios e dashboards da plataforma, da apresentação dos dados às interações que os usuários usam para ler seus números.",
        "Construí telas com muitos dados em Angular com TypeScript, JavaScript e SCSS, com foco em clareza, consistência e responsividade.",
        "Integrei o frontend com APIs REST e atuei na stack toda com Java e Node.js quando as features pediam mudanças no backend.",
        "Escrevi testes unitários com Jest e Jasmine para manter relatórios e dashboards confiáveis conforme o módulo evoluía.",
      ],
    },
    Neon: {
      period: "jul 2022 – out 2023",
      bullets: [
        "Desenvolvi e testei os sistemas de gestão do Neon, contribuindo com sua construção, evolução e manutenção no dia a dia em produção.",
        "Construí interfaces em Angular com TypeScript, JavaScript, SCSS e Tailwind CSS, organizadas em componentes reutilizáveis.",
        "Integrei telas com APIs REST e apoiei demandas de backend com Node.js.",
        "Cobri features com testes unitários em Jest e Jasmine, pegando regressões antes de chegarem aos usuários.",
      ],
    },
    "Vnda Ecommerce": {
      period: "jun 2021 – jun 2022",
      location: "Porto Alegre, Brasil",
      bullets: [
        "Desenvolvi lojas virtuais de ponta a ponta no frontend, transformando layouts em lojas responsivas e prontas para produção.",
        "Implementei novas funcionalidades e corrigi bugs em diversos projetos de clientes.",
        "Construí páginas e templates com JavaScript (ES6+), HTML, CSS, jQuery e a template engine Liquid 4.",
        "Versionei e revisei código com Git e GitLab como parte do fluxo de entrega do time.",
      ],
    },
    "Olina Lab": {
      role: "Estagiário de Desenvolvimento de Software",
      period: "fev 2021 – jun 2021",
      location: "Canoas, Brasil",
      bullets: [
        "Desenvolvi e mantive o sistema interno da empresa com C#.",
        "Automatizei processos internos com VBA, reduzindo trabalho manual repetitivo do time.",
        "Atendi chamados de suporte, investigando problemas e entregando correções para usuários internos.",
        "Primeira experiência profissional em desenvolvimento de software, trabalhando com usuários reais e sistemas em produção.",
      ],
    },
  } as Record<string, Partial<Experience>>,
};

export function getProfile(locale: Locale) {
  if (locale === "en") return profile;
  return { ...profile, bio: pt.bio };
}

export function getExperiences(locale: Locale): Experience[] {
  if (locale === "en") return experiences;
  return experiences.map((e) => ({ ...e, ...pt.experiences[e.company] }));
}

export function getProjects(locale: Locale): Project[] {
  if (locale === "en") return projects;
  return projects.map((p) => ({ ...p, ...pt.projects[p.slug] }));
}

export const getProject = (locale: Locale, slug: string) => getProjects(locale).find((p) => p.slug === slug);

export function getNow(locale: Locale) {
  if (locale === "en") return now;
  return { ...now, items: now.items.map((i) => ({ ...i, ...pt.now[i.label] })) };
}
