/**
 * Transforma dados da API (snake_case) para o formato da aplicação (camelCase)
 */
export interface DistroAPI {
  id: string;
  name: string;
  family?: string;
  desktop_environments?: string[];
  latest_release_date?: string;
  rating?: number;
  homepage?: string;
  summary?: string;
  description?: string;
  based_on?: string;
  package_manager?: string;
  package_management?: string;
  architecture?: string[];
  origin?: string;
  category?: string;
  status?: string;
  ranking?: number;
  ram_idle?: number;
  idle_ram_usage?: number;
  cpu_score?: number;
  io_score?: number;
  release_model?: string;
  lts_support?: boolean;
  release_year?: number;
  requirements?: any;
}

export interface Distro {
  // Campos obrigatórios
  id: string;
  name: string;
  family: string;
  
  // Logo/Imagem
  logo?: string;
  
  // Desktop Environments - aceita ambos os formatos
  desktopEnvironments?: string[];
  desktop_environments?: string[];
  
  // Datas - aceita ambos os formatos
  lastRelease?: string;
  latest_release_date?: string;
  release_year?: number;
  
  // Score/Rating - aceita ambos os formatos
  score?: number;
  rating?: number;
  
  // Performance - snake_case (API) e camelCase (legacy)
  idle_ram_usage?: number;
  ramIdle?: number;
  
  cpu_score?: number;
  cpuScore?: number;
  
  io_score?: number;
  ioScore?: number;
  
  // Requisitos
  requirements?: any;
  
  // Website/Homepage - aceita ambos
  website?: string;
  homepage?: string;
  
  // Package Manager - aceita ambos os formatos
  packageManager?: string;
  package_management?: string;
  
  // Descrição/Sumário - aceita ambos
  description?: string;
  summary?: string;
  
  // Release Model & LTS
  releaseModel?: string;
  release_model?: string;
  ltsSupport?: boolean;
  lts_support?: boolean;
  
  // Arquiteturas - aceita ambos
  architecture?: string;
  architectures?: string[];
  
  // Base system - aceita ambos os formatos
  baseSystem?: string;
  based_on?: string;
  
  // Campos adicionais da API
  category?: string;
  status?: string;
  origin?: string;
  ranking?: number;
}

/**
 * Transforma uma distro da API para o formato da aplicação
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
    
    // Desktop Environments - ambos os formatos
    desktopEnvironments: desktopEnvs,
    desktop_environments: desktopEnvs,
    
    // Datas - ambos os formatos
    lastRelease: apiDistro.latest_release_date || new Date().toISOString(),
    latest_release_date: apiDistro.latest_release_date || null,
    release_year: apiDistro.release_year ?? null,
    
    // Score/Rating - ambos os formatos
    score: apiDistro.rating || 0,
    rating: apiDistro.rating || 0,
    
    // Performance - ambos os formatos
    idle_ram_usage: apiDistro.idle_ram_usage ?? apiDistro.ram_idle ?? null,
    ramIdle: apiDistro.idle_ram_usage ?? apiDistro.ram_idle,
    cpu_score: apiDistro.cpu_score ?? null,
    cpuScore: apiDistro.cpu_score,
    io_score: apiDistro.io_score ?? null,
    ioScore: apiDistro.io_score,
    
    // Logo
    logo: `/logos/${apiDistro.id}.svg`,
    
    // Website - ambos os formatos
    website: apiDistro.homepage || "",
    homepage: apiDistro.homepage,
    
    // Descrição - ambos os formatos
    description: apiDistro.summary || apiDistro.description || "",
    summary: apiDistro.summary || apiDistro.description,
    
    // Base System - ambos os formatos
    baseSystem: apiDistro.based_on || apiDistro.family || "Independent",
    based_on: apiDistro.based_on,
    
    // Package Manager - ambos os formatos
    packageManager: apiDistro.package_management || apiDistro.package_manager,
    package_management: apiDistro.package_management || apiDistro.package_manager,
    
    // Arquitetura - string único (compatível com definição antiga)
    architecture: apiDistro.architecture ? apiDistro.architecture.join(", ") : undefined,
    architectures: apiDistro.architecture,
    
    // Release Model - ambos os formatos
    releaseModel: apiDistro.release_model || "Unknown",
    release_model: apiDistro.release_model,
    
    // LTS Support - ambos os formatos
    ltsSupport: apiDistro.lts_support || false,
    lts_support: apiDistro.lts_support,
    
    // Campos adicionais
    origin: apiDistro.origin,
    category: apiDistro.category,
    status: apiDistro.status,
    ranking: apiDistro.ranking,
    requirements: apiDistro.requirements || null,
  };
}

/**
 * Transforma um array de distros da API
 */
export function transformDistros(apiDistros: DistroAPI[]): Distro[] {
  return apiDistros.map(transformDistro);
}
