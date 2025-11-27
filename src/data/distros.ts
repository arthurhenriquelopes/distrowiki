// src/data/distros.ts

export interface Distro {
  id: string;
  name: string;
  logo: string;
  family: string;
  desktopEnvironments: string[];
  releasedIn: string;
  lastRelease?: string;
  score: number;
  ramIdle: number;
  cpuScore: number;
  ioScore: number;
  website: string;
  packageManager: string;
  description: string;
  releaseModel: string;
  ltsSupport: boolean;
  minRam: number;
  minStorage: number;
  architectures: string[];
}

export const distros: Distro[] = [];
