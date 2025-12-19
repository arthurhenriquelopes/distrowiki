import { transformDistro } from "./apiTransform";
import type { Distro, DistroAPI } from "@/types";

const API_BASE = import.meta.env.VITE_API_BASE_ || "https://distrowiki-api.vercel.app";

/**
 * Carrega uma distro individual da API
 */
export async function fetchDistroById(id: string): Promise<Distro | null> {
  try {
    const response = await fetch(`${API_BASE}/distros/${id.toLowerCase()}`);
    
    if (!response.ok) {
      console.error(`Erro ao buscar distro ${id}: ${response.status}`);
      return null;
    }
    
    const data: DistroAPI = await response.json();
    return transformDistro(data);
  } catch (error) {
    console.error(`Erro ao buscar distro ${id}:`, error);
    return null;
  }
}

/**
 * Carrega múltiplas distros em paralelo
 */
export async function fetchDistrosByIds(ids: string[]): Promise<Distro[]> {
  const promises = ids.map(id => fetchDistroById(id));
  const results = await Promise.all(promises);
  return results.filter((d): d is Distro => d !== null);
}

/**
 * Identifica o melhor valor em um conjunto de distros
 */
export function getBestValue(
  distros: Distro[],
  key: keyof Distro,
  reverse = false
): number | string | null {
  const values = distros
    .map((d) => d[key])
    .filter((v): v is number | string => v != null && v !== 0);
  
  if (values.length === 0) return null;
  
  if (typeof values[0] === "number") {
    return reverse
      ? Math.min(...(values as number[]))
      : Math.max(...(values as number[]));
  }
  
  return values[0];
}

/**
 * Verifica se um valor é o melhor da comparação
 */
export function isBestValue(value: any, bestValue: any): boolean {
  return value != null && value !== 0 && value === bestValue;
}

/**
 * Verifica se alguma distro tem dados de performance
 */
export function hasPerformanceData(distros: Distro[]): boolean {
  return distros.some((d) => d.idleRamUsage || d.cpuScore || d.ioScore);
}
