import type { Distro, DistroAPI } from "@/types";

/**
 * Transforms a distro from API format to application format
 */
export function transformDistro(apiDistro: DistroAPI): Distro {
  const desktopEnvs = (() => {
    const des = apiDistro.desktop_environments || [];
    if (des.length === 0 || des.some((de) => de.includes("None"))) {
      return ["None"];
    }
    return des;
  })();

  return {
    id: apiDistro.id,
    name: apiDistro.name,
    family: apiDistro.family || "Independent",
    logo: `/logos/${apiDistro.id}.svg`,
    
    // Desktop environments
    desktopEnvironments: desktopEnvs,
    
    // Dates
    lastRelease: apiDistro.latest_release_date || new Date().toISOString(),
    releaseYear: apiDistro.release_year ?? undefined,
    
    // Score
    score: apiDistro.rating || 0,
    
    // Performance metrics
    idleRamUsage: apiDistro.idle_ram_usage ?? apiDistro.ram_idle ?? undefined,
    cpuScore: apiDistro.cpu_score ?? undefined,
    ioScore: apiDistro.io_score ?? undefined,
    
    // URLs
    website: apiDistro.homepage || "",
    homepage: apiDistro.homepage,
    
    // Description
    description: apiDistro.summary || apiDistro.description || "",
    
    // Base system
    baseSystem: apiDistro.based_on || apiDistro.family || "Independent",
    basedOn: apiDistro.based_on,
    
    // Package management
    packageManager: apiDistro.package_management || apiDistro.package_manager,
    
    // Architecture (join array to string)
    architecture: apiDistro.architecture?.join(", "),
    
    // Release info
    releaseModel: apiDistro.release_model || "Unknown",
    ltsSupport: apiDistro.lts_support || false,
    
    // Metadata
    origin: apiDistro.origin,
    category: apiDistro.category,
    status: apiDistro.status,
    ranking: apiDistro.ranking,
    requirements: apiDistro.requirements || undefined,
    osType: apiDistro.os_type,
  };
}

/**
 * Transforms an array of distros from API format
 */
export function transformDistros(apiDistros: DistroAPI[]): Distro[] {
  return apiDistros.map(transformDistro);
}
