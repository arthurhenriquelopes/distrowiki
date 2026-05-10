import type { Distro } from "@/types";

/**
 * Calcula o score de performance de uma distro.
 *
 * Usa média ponderada de 5 dimensões:
 * - RAM (20%) — menor idle RAM = melhor
 * - CPU (25%) — score de CPU 1-10
 * - I/O (20%) — score de I/O 1-10
 * - Popularidade (15%) — ranking DistroWatch
 * - Freshness (20%) — data do último release
 *
 * Retorna null se não houver dados suficientes (menos de 2 métricas).
 * Caso contrário retorna score 0-100, normalizado pela soma dos pesos reais.
 */
export const calculatePerformanceScore = (distro: Distro): number | null => {
  let totalWeight = 0;
  let weightedScore = 0;

  // ── RAM Score (menor é melhor) ──
  // Range calibrado: 300 MB (minimalista) → 1500 MB (pesado)
  if (distro.idleRamUsage && distro.idleRamUsage > 0) {
    const RAM_BEST = 300;
    const RAM_WORST = 1500;
    const clamped = Math.max(RAM_BEST, Math.min(RAM_WORST, distro.idleRamUsage));
    const ramScore = ((RAM_WORST - clamped) / (RAM_WORST - RAM_BEST)) * 100;
    weightedScore += ramScore * 0.20;
    totalWeight += 0.20;
  }

  // ── CPU Score (1-10 scale) ──
  // Range calibrado baseado nos dados reais (6.0 a 9.2)
  if (distro.cpuScore && distro.cpuScore > 0) {
    const CPU_FLOOR = 6.0;
    const CPU_CEIL = 9.2;
    const clamped = Math.max(CPU_FLOOR, Math.min(CPU_CEIL, distro.cpuScore));
    const cpuScore = ((clamped - CPU_FLOOR) / (CPU_CEIL - CPU_FLOOR)) * 100;
    weightedScore += cpuScore * 0.25;
    totalWeight += 0.25;
  }

  // ── I/O Score (1-10 scale) ──
  // Range calibrado baseado nos dados reais (6.0 a 9.0)
  if (distro.ioScore && distro.ioScore > 0) {
    const IO_FLOOR = 6.0;
    const IO_CEIL = 9.0;
    const clamped = Math.max(IO_FLOOR, Math.min(IO_CEIL, distro.ioScore));
    const ioScore = ((clamped - IO_FLOOR) / (IO_CEIL - IO_FLOOR)) * 100;
    weightedScore += ioScore * 0.20;
    totalWeight += 0.20;
  }

  // ── Popularity Score (ranking 1-150) ──
  const ranking = (distro as any).ranking || distro.popularityRank;
  if (ranking && ranking > 0 && ranking <= 150) {
    // Logarithmic decay mais suave (base 100)
    const popularityScore = Math.max(0, 100 - (Math.log(ranking) / Math.log(100)) * 100);
    weightedScore += popularityScore * 0.15;
    totalWeight += 0.15;
  }

  // ── Freshness Score (last release date) ──
  if (distro.lastRelease) {
    const date = new Date(distro.lastRelease);
    if (!isNaN(date.getTime())) {
      const now = new Date();
      const monthsSince = Math.max(0, (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30));

      let freshnessScore: number;
      if (monthsSince <= 12) {
        freshnessScore = 100;       // Até 1 ano = pontuação máxima (menos punitivo)
      } else if (monthsSince <= 24) {
        freshnessScore = 85;        // 1-2 anos
      } else if (monthsSince <= 36) {
        freshnessScore = 65;        // 2-3 anos
      } else {
        freshnessScore = 40;        // 3+ anos
      }

      weightedScore += freshnessScore * 0.20;
      totalWeight += 0.20;
    }
  }

  // Precisa de pelo menos 2 métricas para ter um score significativo
  if (totalWeight < 0.35) {
    return null;
  }

  // Score base (0-100)
  const rawScore = (weightedScore / totalWeight) / 100;

  // Curva de impulsionamento: eleva a nota para que os tops atinjam 90+
  // Math.pow(x, 0.45) empurra valores altos mais para perto de 1.0
  const boostedScore = Math.pow(rawScore, 0.45) * 100;

  // Cap em 99 para evitar "score perfeito" artificial
  return Math.min(99, Math.round(boostedScore * 10) / 10);
};

/**
 * Retorna os dados brutos do radar chart (5 dimensões, 0-100 cada).
 * Útil para visualização detalhada das métricas individuais.
 */
export const getRadarChartData = (distro: Distro) => {
  const RAM_BEST = 300;
  const RAM_WORST = 1500;
  const CPU_FLOOR = 6.0;
  const CPU_CEIL = 9.2;
  const IO_FLOOR = 6.0;
  const IO_CEIL = 9.0;

  const ram = distro.idleRamUsage && distro.idleRamUsage > 0
    ? ((RAM_WORST - Math.max(RAM_BEST, Math.min(RAM_WORST, distro.idleRamUsage))) / (RAM_WORST - RAM_BEST)) * 100
    : null;

  const cpu = distro.cpuScore && distro.cpuScore > 0
    ? ((Math.max(CPU_FLOOR, Math.min(CPU_CEIL, distro.cpuScore)) - CPU_FLOOR) / (CPU_CEIL - CPU_FLOOR)) * 100
    : null;

  const io = distro.ioScore && distro.ioScore > 0
    ? ((Math.max(IO_FLOOR, Math.min(IO_CEIL, distro.ioScore)) - IO_FLOOR) / (IO_CEIL - IO_FLOOR)) * 100
    : null;

  const ranking = (distro as any).ranking || distro.popularityRank;
  const popularity = ranking && ranking > 0 && ranking <= 150
    ? Math.max(0, 100 - (Math.log(ranking) / Math.log(100)) * 100)
    : null;

  let freshness: number | null = null;
  if (distro.lastRelease) {
    const date = new Date(distro.lastRelease);
    if (!isNaN(date.getTime())) {
      const monthsSince = Math.max(0, (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30));
      if (monthsSince <= 12) freshness = 100;
      else if (monthsSince <= 24) freshness = 85;
      else if (monthsSince <= 36) freshness = 65;
      else freshness = 40;
    }
  }

  return { ram, cpu, io, popularity, freshness };
};
