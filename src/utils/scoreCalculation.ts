import type { Distro } from "@/types";

/**
 * Calcula o score de performance de uma distro.
 * 
 * Fórmula com 4 métricas:
 * - RAM: Peso 35% - Menor RAM = melhor
 * - CPU: Peso 25% - Maior CPU = melhor
 * - I/O: Peso 20% - Maior I/O = melhor
 * - Atualização: Peso 20% - Mais recente = melhor
 */
export const calculatePerformanceScore = (distro: Distro): number => {
  const cpuScore = distro.cpuScore || 0;
  const ioScore = distro.ioScore || 0;
  const ramIdle = distro.idleRamUsage || 0;
  const lastRelease = distro.lastRelease;

  // Se não tiver dados de performance, retorna 0
  if (!cpuScore && !ioScore && !ramIdle) {
    return 0;
  }

  // Ranges calibrados para os dados reais
  const RAM_MIN = 250;
  const RAM_MAX = 1200;
  const CPU_MIN = 5;
  const CPU_MAX = 9.5;
  const IO_MIN = 5;
  const IO_MAX = 9.5;

  // RAM Score (invertido - menor RAM = maior score)
  let ramScore = 50;
  if (ramIdle > 0) {
    if (ramIdle <= RAM_MIN) {
      ramScore = 100;
    } else if (ramIdle >= RAM_MAX) {
      ramScore = 20;
    } else {
      const normalized = (RAM_MAX - ramIdle) / (RAM_MAX - RAM_MIN);
      ramScore = 20 + (normalized * 80);
    }
  }

  // CPU Score
  let cpuNormScore = 50;
  if (cpuScore > 0) {
    const normalized = Math.min(1, Math.max(0, (cpuScore - CPU_MIN) / (CPU_MAX - CPU_MIN)));
    cpuNormScore = 30 + (normalized * 70);
  }

  // I/O Score
  let ioNormScore = 50;
  if (ioScore > 0) {
    const normalized = Math.min(1, Math.max(0, (ioScore - IO_MIN) / (IO_MAX - IO_MIN)));
    ioNormScore = 30 + (normalized * 70);
  }

  // Release Freshness Score (distros atualizadas recentemente = maior score)
  let freshnessScore = 50;
  if (lastRelease) {
    const releaseDate = new Date(lastRelease);
    const now = new Date();
    const monthsOld = (now.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (monthsOld <= 3) {
      freshnessScore = 100; // Atualizado nos últimos 3 meses = máximo
    } else if (monthsOld <= 6) {
      freshnessScore = 85;
    } else if (monthsOld <= 12) {
      freshnessScore = 70;
    } else if (monthsOld <= 24) {
      freshnessScore = 50;
    } else {
      freshnessScore = 30; // Mais de 2 anos sem atualização
    }
  }

  // Pesos
  const RAM_WEIGHT = 0.35;
  const CPU_WEIGHT = 0.25;
  const IO_WEIGHT = 0.20;
  const FRESHNESS_WEIGHT = 0.20;

  // Score ponderado
  let totalWeight = 0;
  let weightedScore = 0;

  if (ramIdle > 0) {
    weightedScore += ramScore * RAM_WEIGHT;
    totalWeight += RAM_WEIGHT;
  }
  if (cpuScore > 0) {
    weightedScore += cpuNormScore * CPU_WEIGHT;
    totalWeight += CPU_WEIGHT;
  }
  if (ioScore > 0) {
    weightedScore += ioNormScore * IO_WEIGHT;
    totalWeight += IO_WEIGHT;
  }
  if (lastRelease) {
    weightedScore += freshnessScore * FRESHNESS_WEIGHT;
    totalWeight += FRESHNESS_WEIGHT;
  }

  // Normaliza
  let finalScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
  
  // Boost para scores altos (maior diferenciação no topo)
  if (finalScore > 60) {
    const boost = (finalScore - 60) * 0.25;
    finalScore = finalScore + boost;
  }

  return Math.min(100, Math.round(finalScore * 10) / 10);
};
