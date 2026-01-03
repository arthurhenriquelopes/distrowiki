/**
 * Distro data from API
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
  popularity_rank?: number;
  ram_idle?: number;
  idle_ram_usage?: number;
  cpu_score?: number;
  io_score?: number;
  release_model?: string;
  release_type?: string;
  init_system?: string;
  file_systems?: string[];
  lts_support?: boolean;
  release_year?: number;
  requirements?: string;
  os_type?: string;
  office_suite?: string;
}

/**
 * Distro data for the application (normalized)
 * Uses camelCase consistently for all fields
 */
export interface Distro {
  id: string;
  name: string;
  family: string;
  logo: string;

  // Desktop environments
  desktopEnvironments: string[];

  // Dates
  lastRelease: string;
  releaseYear?: number;

  // Score
  score: number;

  // Performance metrics
  idleRamUsage?: number;
  cpuScore?: number;
  ioScore?: number;

  // Requirements
  requirements?: string;

  // URLs
  website?: string;
  homepage?: string;

  // Package management
  packageManager?: string;

  // Description
  description?: string;

  // Release info
  releaseModel?: string;
  releaseType?: string;
  ltsSupport?: boolean;

  // Architecture
  architecture?: string;

  // System details
  initSystem?: string;
  fileSystems?: string[];

  // Base system
  baseSystem?: string;
  basedOn?: string;

  // Metadata
  category?: string;
  status?: string;
  origin?: string;
  osType?: string;
  ranking?: number;
  popularityRank?: number;
}
