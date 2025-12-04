import { Distro } from "@/data/distros";

/**
 * Gera URL de comparação com os IDs das distros
 * Exemplo: /comparacao/ubuntu+fedora+arch
 */
export const generateComparisonUrl = (distros: Distro[]): string => {
  if (distros.length < 2) return '/comparacao';
  const ids = distros.map(d => d.id.toLowerCase()).join('+');
  return `/comparacao/${ids}`;
};

/**
 * Extrai IDs das distros da URL de comparação
 * Exemplo: "ubuntu+fedora+arch" => ["ubuntu", "fedora", "arch"]
 */
export const parseComparisonUrl = (distroIds: string): string[] => {
  return distroIds.split('+').map(id => id.toLowerCase().trim()).filter(Boolean);
};
