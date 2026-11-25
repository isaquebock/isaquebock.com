/** Contribuições falsas, mas com cara de reais: determinísticas (mesma semente), 365 dias até hoje. */
export function mockContributions(days = 365) {
  let seed = 20251125;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const today = new Date();
  const end = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const contributions: { date: string; count: number }[] = [];
  let total = 0;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end - i * 86_400_000);
    const weekday = d.getUTCDay();
    const week = Math.floor((days - 1 - i) / 7);
    const weekend = weekday === 0 || weekday === 6;
    // Ondas de semanas mais intensas (sprints) e alguns dias parados.
    const sprint = 0.6 + 0.8 * Math.max(0, Math.sin(week / 3.2)) + (week % 11 === 4 ? 1.2 : 0);
    const r = rand();
    let count = 0;
    if (r > (weekend ? 0.7 : 0.18)) count = Math.round(rand() * 9 * sprint * (weekend ? 0.5 : 1));
    total += count;
    contributions.push({ date: d.toISOString().slice(0, 10), count });
  }
  return { total, contributions };
}
