import type { Distro } from "@/types";

/**
 * Distros famosas com boost de popularidade baseado em reconhecimento global.
 * Tier 1: Distros extremamente populares (90+ base)
 * Tier 2: Distros muito populares (85+ base)
 * Tier 3: Distros populares (80+ base)
 */
const POPULARITY_BOOST: Record<string, number> = {
  // Tier 1 - Legendary (base 92-95)
  'ubuntu': 95,
  'linuxmint': 94,
  'debian': 93,
  'fedora': 93,
  'arch': 92,
  'manjaro': 91,
  'pop_os': 91,
  'elementary': 90,

  // Tier 2 - Very Popular (base 85-89)
  'opensuse': 89,
  'zorin': 89,
  'kali': 88,
  'endeavouros': 87,
  'garuda': 87,
  'mxlinux': 86,
  'solus': 86,
  'deepin': 85,
  'kubuntu': 85,
  'xubuntu': 85,
  'lubuntu': 84,
  'void': 84,

  // Tier 3 - Popular (base 78-83)
  'gentoo': 83,
  'nixos': 83,
  'arcolinux': 82,
  'artix': 81,
  'cachyos': 81,
  'nobara': 81,
  'peppermint': 80,
  'lmde': 80,
  'budgie': 79,
  'antix': 78,
  'sparky': 78,
};

/**
 * Calcula o score de uma distro combinando:
 * 1. Popularidade/Reputação (peso 60%)
 * 2. Métricas técnicas quando disponíveis (peso 40%)
 * 
 * Garante que distros famosas fiquem no topo com scores 90+
 */
export const calculatePerformanceScore = (distro: Distro): number => {
  const distroId = (distro.id || distro.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  // Usar popularity_rank do scraping se disponível, senão usar boost estático
  let popularityBase: number;

  // Prioridade: ranking da API > popularityRank > boost estático
  const apiRanking = (distro as any).ranking || (distro as any).popularity_rank || distro.popularityRank;

  if (apiRanking && apiRanking > 0 && apiRanking <= 100) {
    // Converte ranking (1-100) para score (95-50)
    // Rank 1 = 95 pontos, Rank 100 = 50 pontos
    popularityBase = Math.max(50, 96 - (apiRanking * 0.45));
  } else {
    // Fallback para boost estático
    popularityBase = POPULARITY_BOOST[distroId] || 70;
  }

  // Calcular score técnico se houver dados disponíveis
  const technicalScore = calculateTechnicalScore(distro);

  // Se não tiver dados técnicos, usa apenas popularidade
  if (technicalScore === null) {
    // Adiciona pequena variação para não ter scores idênticos
    const variation = (distroId.charCodeAt(0) % 5) - 2; // -2 a +2
    return Math.min(99, Math.max(50, popularityBase + variation));
  }

  // Combina popularidade (55%) com score técnico (45%) - mais peso em métricas técnicas
  const POPULARITY_WEIGHT = 0.55;
  const TECHNICAL_WEIGHT = 0.45;

  const combinedScore = (popularityBase * POPULARITY_WEIGHT) + (technicalScore * TECHNICAL_WEIGHT);

  // Garante que distros tier 1 não caiam muito por métricas técnicas ruins
  const minScore = popularityBase * 0.9; // Não pode cair mais que 10% da base

  const finalScore = Math.max(minScore, combinedScore);

  return Math.min(99, Math.round(finalScore * 10) / 10);
};

/**
 * Calcula score técnico baseado em CPU, RAM, I/O e Freshness.
 * Retorna null se não houver dados suficientes.
 */
const calculateTechnicalScore = (distro: Distro): number | null => {
  const cpuScore = distro.cpuScore || 0;
  const ioScore = distro.ioScore || 0;
  const ramIdle = distro.idleRamUsage || 0;
  const lastRelease = distro.lastRelease;

  // Precisa de pelo menos uma métrica técnica
  if (!cpuScore && !ioScore && !ramIdle && !lastRelease) {
    return null;
  }

  // Ranges calibrados
  const RAM_MIN = 250;
  const RAM_MAX = 1500;
  const CPU_MIN = 5;
  const CPU_MAX = 10;
  const IO_MIN = 5;
  const IO_MAX = 10;

  let totalWeight = 0;
  let weightedScore = 0;

  // RAM Score (invertido - menor RAM = maior score)
  if (ramIdle > 0) {
    let ramScore: number;
    if (ramIdle <= RAM_MIN) {
      ramScore = 100;
    } else if (ramIdle >= RAM_MAX) {
      ramScore = 50;
    } else {
      const normalized = (RAM_MAX - ramIdle) / (RAM_MAX - RAM_MIN);
      ramScore = 50 + (normalized * 50);
    }
    weightedScore += ramScore * 0.25;
    totalWeight += 0.25;
  }

  // CPU Score
  if (cpuScore > 0) {
    const normalized = Math.min(1, Math.max(0, (cpuScore - CPU_MIN) / (CPU_MAX - CPU_MIN)));
    const cpuNormScore = 50 + (normalized * 50);
    weightedScore += cpuNormScore * 0.30;
    totalWeight += 0.30;
  }

  // I/O Score
  if (ioScore > 0) {
    const normalized = Math.min(1, Math.max(0, (ioScore - IO_MIN) / (IO_MAX - IO_MIN)));
    const ioNormScore = 50 + (normalized * 50);
    weightedScore += ioNormScore * 0.25;
    totalWeight += 0.25;
  }

  // Freshness Score
  if (lastRelease) {
    const releaseDate = new Date(lastRelease);
    const now = new Date();
    const monthsOld = (now.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

    let freshnessScore: number;
    if (monthsOld <= 3) {
      freshnessScore = 100;
    } else if (monthsOld <= 6) {
      freshnessScore = 90;
    } else if (monthsOld <= 12) {
      freshnessScore = 80;
    } else if (monthsOld <= 24) {
      freshnessScore = 70;
    } else {
      freshnessScore = 60;
    }
    weightedScore += freshnessScore * 0.20;
    totalWeight += 0.20;
  }

  if (totalWeight === 0) {
    return null;
  }

  return weightedScore / totalWeight;
};
