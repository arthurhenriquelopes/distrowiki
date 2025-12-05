interface PerformanceData {
  cpuScore?: number;
  cpu_score?: number;
  'CPU Score'?: number;
  ioScore?: number;
  io_score?: number;
  'I/O Score'?: number;
  idleRamUsage?: number;
  idle_ram_usage?: number;
  'Idle RAM Usage'?: number;
  ram_idle?: number;
}

export const calculatePerformanceScore = (distro: PerformanceData): number => {
  const cpuScore = distro['CPU Score'] || distro.cpuScore || distro.cpu_score || 0;
  const ioScore = distro['I/O Score'] || distro.ioScore || distro.io_score || 0;
  const ramIdle = distro['Idle RAM Usage'] || distro.idleRamUsage || distro.idle_ram_usage || distro.ram_idle || 0;

  // Se não tiver dados de performance, retorna 0
  if (!cpuScore || !ioScore || !ramIdle) {
    return 0;
  }

  // Calcula o multiplicador de RAM com penalização linear
  // Cada 100MB de RAM reduz o multiplicador em 0.5%
  // Fórmula: 1 - (ramIdle / 100) * 0.005
  // Exemplos:
  // 300MB -> 1 - (300/100) * 0.005 = 1 - 0.015 = 0.985 (1.5% penalização)
  // 500MB -> 1 - (500/100) * 0.005 = 1 - 0.025 = 0.975 (2.5% penalização)
  // 1000MB -> 1 - (1000/100) * 0.005 = 1 - 0.05 = 0.950 (5% penalização)
  // 2000MB -> 1 - (2000/100) * 0.005 = 1 - 0.10 = 0.900 (10% penalização)
  const ramMultiplier = Math.max(0.7, 1 - (ramIdle / 100) * 0.005); // Mínimo de 0.7 (30% penalização máxima)

  // Fórmula: CPU Score * IO Score * RAM Multiplier
  const score = (cpuScore * ioScore * ramMultiplier) + 20;

  return Math.min(score, 100); // Limita a 100
};
