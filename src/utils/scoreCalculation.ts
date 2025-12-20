import type { Distro } from "@/types";

/**
 * Lista de distros populares/famosas que recebem boost de visibilidade.
 * IDs baseados nos arquivos em public/logos/*.svg
 */
const POPULAR_DISTROS: Record<string, number> = {
  // Tier SS - Elite (boost +40)
  "popos": 40,
  "ubuntu": 40,
  "fedora": 40,
  "debian": 40,
  "cachyos": 40,
  
  // Tier S - Gigantes (boost +20)
  "archlinux": 20,
  "linuxmint": 20,
  
  // Tier A - Muito Populares (boost +10)
  "manjaro": 10,
  "zorin": 10,
  "elementary": 10,
  "opensuse": 10,
  "kubuntu": 10,
  "xubuntu": 10,
  "kali": 10,
  "garuda": 10,
  
  // Tier B - Populares (boost +7)
  "endeavouros": 7,
  "nobara": 7,
  "mxlinux": 7,
  "lubuntu": 7,
  "kdeneon": 7,
  "centos": 7,
  "rockylinux": 7,
  "alma": 7,
  "regataos": 7,
  "nixos": 7,
  "rhel": 7,
  
  // Tier C - Conhecidas (boost +4)
  "archcraft": 4,
  "arcolinux": 4,
  "solus": 4,
  "void": 4,
  "artixlinux": 4,
  "gentoo": 4,
  "slackware": 4,
  "deepin": 4,
  "peppermint": 4,
  "antix": 4,
  "q4os": 4,
  "tails": 4,
  "parrotos": 4,
  "alpine": 4,
  "omarchy": 4,
  "biglinux": 4,
  "bazzite": 4,
  "steamos": 4,
  "holoiso": 4,
};

/**
 * Famílias principais recebem um pequeno boost por serem bem suportadas
 */
const FAMILY_BOOST: Record<string, number> = {
  "Debian": 4,
  "Ubuntu": 4,
  "Arch": 2,
  "Fedora": 3,
  "openSUSE": 2,
  "Independent": 0,
};

/**
 * Categoria da distro dá boost adicional
 */
const CATEGORY_BOOST: Record<string, number> = {
  "Gaming": 10,
  "Desktop": 5,
  "Desktop/Gaming": 10,
  "Gaming/Desktop": 10,
};

/**
 * Calcula o score de performance de uma distro.
 * 
 * Fórmula balanceada com 4 métricas + boost de popularidade:
 * - CPU: Peso 25% - Maior CPU = melhor
 * - I/O: Peso 20% - Maior I/O = melhor
 * - RAM: Peso 15% - Menor RAM = melhor
 * - Freshness: Peso 20% - Mais recente = melhor
 * - Popularity: Peso 20% - Distros famosas ganham boost
 */
export const calculatePerformanceScore = (distro: Distro): number => {
  const cpuScore = distro.cpuScore || 0;
  const ioScore = distro.ioScore || 0;
  const ramIdle = distro.idleRamUsage || 0;
  const lastRelease = distro.lastRelease;

  // Se não tiver dados de performance, retorna score base por popularidade
  if (!cpuScore && !ioScore && !ramIdle) {
    const popularityBoost = POPULAR_DISTROS[distro.id] || 0;
    // Distros populares sem dados ainda começam com score alto
    return popularityBoost > 0 ? Math.min(95, 60 + popularityBoost) : 0;
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
      ramScore = 40;
    } else {
      const normalized = (RAM_MAX - ramIdle) / (RAM_MAX - RAM_MIN);
      ramScore = 40 + (normalized * 60);
    }
  }

  // CPU Score - Range expandido para mais diferenciação
  let cpuNormScore = 50;
  if (cpuScore > 0) {
    const normalized = Math.min(1, Math.max(0, (cpuScore - CPU_MIN) / (CPU_MAX - CPU_MIN)));
    cpuNormScore = 40 + (normalized * 60);
  }

  // I/O Score
  let ioNormScore = 50;
  if (ioScore > 0) {
    const normalized = Math.min(1, Math.max(0, (ioScore - IO_MIN) / (IO_MAX - IO_MIN)));
    ioNormScore = 40 + (normalized * 60);
  }

  // Release Freshness Score
  let freshnessScore = 50;
  if (lastRelease) {
    const releaseDate = new Date(lastRelease);
    const now = new Date();
    const monthsOld = (now.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (monthsOld <= 3) {
      freshnessScore = 100;
    } else if (monthsOld <= 6) {
      freshnessScore = 85;
    } else if (monthsOld <= 12) {
      freshnessScore = 70;
    } else if (monthsOld <= 24) {
      freshnessScore = 55;
    } else {
      freshnessScore = 40;
    }
  }

  // Popularity Score (0-100) + Category Boost
  const popularityBoost = POPULAR_DISTROS[distro.id] || 0;
  const familyBoost = FAMILY_BOOST[distro.family] || 0;
  const categoryBoost = CATEGORY_BOOST[distro.category || ""] || 0;
  const popularityScore = Math.min(100, 50 + (popularityBoost * 4) + (familyBoost * 2) + categoryBoost);

  // Pesos - Popularidade domina, RAM mínimo
  const POPULARITY_WEIGHT = 0.40
  const CPU_WEIGHT = 0.15
  const IO_WEIGHT = 0.15
  const FRESHNESS_WEIGHT = 0.15
  const RAM_WEIGHT = 0.15

  // Score ponderado
  let totalWeight = POPULARITY_WEIGHT; // Sempre conta popularidade
  let weightedScore = popularityScore * POPULARITY_WEIGHT;

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
  
  // Boost suave para manter diferenciação
  if (finalScore > 55) {
    const boost = (finalScore - 55) * 0.15;
    finalScore = finalScore + boost;
  }

  return Math.min(100, Math.round(finalScore * 10) / 10);
};
