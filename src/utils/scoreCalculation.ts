import type { Distro } from "@/types";

export const calculatePerformanceScore = (distro: Distro): number => {
  const cpuScore = distro.cpuScore || 0;
  const ioScore = distro.ioScore || 0;
  const ramIdle = distro.idleRamUsage || 0;

  // Se não tiver dados de performance, retorna 0
  if (!cpuScore || !ioScore || !ramIdle) {
    return 0;
  }

  // Calcula o multiplicador de RAM com penalização linear
  // Cada 100MB de RAM reduz o multiplicador em 0.5%
  const ramMultiplier = Math.max(0.7, 1 - (ramIdle / 100) * 0.005);

  // Fórmula: CPU Score * IO Score * RAM Multiplier
  const score = (cpuScore * ioScore * ramMultiplier) + 20;

  return Math.min(score, 100);
};
