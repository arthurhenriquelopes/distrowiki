export interface Distro {
  id: string;
  name: string;
  logo: string;
  family: string;
  desktopEnvironments: string[];
  lastRelease: string;
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

export const distros: Distro[] = [
  {
    id: "ubuntu",
    name: "Ubuntu",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/9e/UbuntuCoF.svg",
    family: "Debian",
    desktopEnvironments: ["GNOME", "KDE", "XFCE", "LXQt", "MATE", "Budgie"],
    lastRelease: "2024-10-10",
    score: 9.5,
    ramIdle: 1200,
    cpuScore: 87,
    ioScore: 92,
    website: "https://ubuntu.com",
    packageManager: "APT",
    description: "Distribuição Linux baseada em Debian, focada em facilidade de uso e grande comunidade.",
    releaseModel: "6 meses",
    ltsSupport: true,
    minRam: 4096,
    minStorage: 25,
    architectures: ["x86_64", "ARM64"],
  },
  {
    id: "fedora",
    name: "Fedora",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/Fedora_icon_%282021%29.svg",
    family: "Independente (RPM)",
    desktopEnvironments: ["GNOME", "KDE", "XFCE", "LXQt", "Cinnamon", "MATE"],
    lastRelease: "2024-11-01",
    score: 9.2,
    ramIdle: 1400,
    cpuScore: 89,
    ioScore: 88,
    website: "https://fedoraproject.org",
    packageManager: "DNF",
    description: "Distribuição inovadora e estável, patrocinada pela Red Hat, sempre com tecnologias mais recentes.",
    releaseModel: "6 meses",
    ltsSupport: false,
    minRam: 2048,
    minStorage: 20,
    architectures: ["x86_64", "ARM64"],
  },
  {
    id: "linux-mint",
    name: "Linux Mint",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Linux_Mint_logo_without_wordmark.svg",
    family: "Ubuntu/Debian",
    desktopEnvironments: ["Cinnamon", "MATE", "XFCE"],
    lastRelease: "2024-09-15",
    score: 9.1,
    ramIdle: 900,
    cpuScore: 85,
    ioScore: 90,
    website: "https://linuxmint.com",
    packageManager: "APT",
    description: "Baseado no Ubuntu, focado em simplicidade e experiência familiar para usuários Windows.",
    releaseModel: "Anual",
    ltsSupport: true,
    minRam: 2048,
    minStorage: 20,
    architectures: ["x86_64"],
  },
  {
    id: "manjaro",
    name: "Manjaro",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Manjaro-logo.svg",
    family: "Arch",
    desktopEnvironments: ["KDE", "GNOME", "XFCE"],
    lastRelease: "2024-10-20",
    score: 9.0,
    ramIdle: 1100,
    cpuScore: 91,
    ioScore: 89,
    website: "https://manjaro.org",
    packageManager: "Pacman",
    description: "Arch Linux de forma acessível, com instalador gráfico e configuração facilitada.",
    releaseModel: "Rolling Release",
    ltsSupport: false,
    minRam: 2048,
    minStorage: 30,
    architectures: ["x86_64"],
  },
  {
    id: "debian",
    name: "Debian",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/66/Openlogo-debianV2.svg",
    family: "Independente",
    desktopEnvironments: ["GNOME", "KDE", "XFCE", "LXQt", "MATE", "Cinnamon"],
    lastRelease: "2023-06-10",
    score: 8.9,
    ramIdle: 800,
    cpuScore: 82,
    ioScore: 86,
    website: "https://debian.org",
    packageManager: "APT",
    description: "Uma das distribuições mais estáveis e respeitadas, base para muitas outras distros.",
    releaseModel: "2 anos",
    ltsSupport: true,
    minRam: 1024,
    minStorage: 10,
    architectures: ["x86_64", "i386", "ARM64", "ARM"],
  },
  {
    id: "arch",
    name: "Arch Linux",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Archlinux-icon-crystal-64.svg",
    family: "Independente",
    desktopEnvironments: ["Manual"],
    lastRelease: "2024-11-01",
    score: 8.8,
    ramIdle: 400,
    cpuScore: 95,
    ioScore: 94,
    website: "https://archlinux.org",
    packageManager: "Pacman",
    description: "Distribuição rolling release minimalista, focada em simplicidade e controle total do sistema.",
    releaseModel: "Rolling Release",
    ltsSupport: false,
    minRam: 512,
    minStorage: 20,
    architectures: ["x86_64"],
  },
  {
    id: "pop-os",
    name: "Pop!_OS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/01/Pop_OS-Logo-nobg.svg",
    family: "Ubuntu/Debian",
    desktopEnvironments: ["GNOME (COSMIC)"],
    lastRelease: "2024-08-30",
    score: 8.7,
    ramIdle: 1300,
    cpuScore: 88,
    ioScore: 91,
    website: "https://pop.system76.com",
    packageManager: "APT",
    description: "Desenvolvido pela System76, otimizado para criadores de conteúdo e desenvolvedores.",
    releaseModel: "6 meses",
    ltsSupport: true,
    minRam: 4096,
    minStorage: 20,
    architectures: ["x86_64"],
  },
  {
    id: "zorin-os",
    name: "Zorin OS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/48/Zorin_OS_logo.svg",
    family: "Ubuntu/Debian",
    desktopEnvironments: ["GNOME (Zorin Desktop)"],
    lastRelease: "2024-07-15",
    score: 8.6,
    ramIdle: 1250,
    cpuScore: 84,
    ioScore: 87,
    website: "https://zorin.com/os",
    packageManager: "APT",
    description: "Interface elegante e familiar, ideal para transição do Windows ou macOS.",
    releaseModel: "Anual",
    ltsSupport: true,
    minRam: 2048,
    minStorage: 25,
    architectures: ["x86_64"],
  },
  {
    id: "elementary",
    name: "elementary OS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Elementary_logo.svg",
    family: "Ubuntu/Debian",
    desktopEnvironments: ["Pantheon"],
    lastRelease: "2024-06-20",
    score: 8.5,
    ramIdle: 1150,
    cpuScore: 83,
    ioScore: 86,
    website: "https://elementary.io",
    packageManager: "APT",
    description: "Design minimalista e elegante, inspirado no macOS, com foco em privacidade.",
    releaseModel: "Anual",
    ltsSupport: true,
    minRam: 4096,
    minStorage: 32,
    architectures: ["x86_64"],
  },
  {
    id: "opensuse",
    name: "openSUSE Tumbleweed",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/OpenSUSE_Logo.svg",
    family: "Independente (RPM)",
    desktopEnvironments: ["KDE", "GNOME", "XFCE"],
    lastRelease: "2024-11-05",
    score: 8.4,
    ramIdle: 1350,
    cpuScore: 86,
    ioScore: 85,
    website: "https://opensuse.org",
    packageManager: "Zypper",
    description: "Distribuição profissional com ferramentas poderosas como YaST e suporte empresarial.",
    releaseModel: "Rolling Release",
    ltsSupport: false,
    minRam: 2048,
    minStorage: 20,
    architectures: ["x86_64", "ARM64"],
  },
  {
    id: "endeavouros",
    name: "EndeavourOS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/74/Endeavouros-icon.png",
    family: "Arch",
    desktopEnvironments: ["KDE", "GNOME", "XFCE", "i3", "Budgie", "Cinnamon"],
    lastRelease: "2024-10-25",
    score: 8.3,
    ramIdle: 950,
    cpuScore: 90,
    ioScore: 88,
    website: "https://endeavouros.com",
    packageManager: "Pacman",
    description: "Arch Linux amigável, com instalador gráfico e comunidade acolhedora.",
    releaseModel: "Rolling Release",
    ltsSupport: false,
    minRam: 2048,
    minStorage: 25,
    architectures: ["x86_64"],
  },
  {
    id: "garuda",
    name: "Garuda Linux",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Garuda-linux-logo.png",
    family: "Arch",
    desktopEnvironments: ["KDE", "GNOME", "XFCE", "LXQt-kwin", "Wayfire"],
    lastRelease: "2024-10-28",
    score: 8.2,
    ramIdle: 1450,
    cpuScore: 93,
    ioScore: 90,
    website: "https://garudalinux.org",
    packageManager: "Pacman",
    description: "Arch Linux com visual gaming e performance otimizada, muitos temas pré-configurados.",
    releaseModel: "Rolling Release",
    ltsSupport: false,
    minRam: 4096,
    minStorage: 40,
    architectures: ["x86_64"],
  },
];

export const getDistroById = (id: string): Distro | undefined => {
  return distros.find((d) => d.id === id);
};

export const getTopDistros = (limit: number = 3): Distro[] => {
  return [...distros].sort((a, b) => b.score - a.score).slice(0, limit);
};

export const filterDistros = (
  filters: {
    family?: string;
    desktopEnvironment?: string;
    releaseDateMonths?: number;
  }
): Distro[] => {
  return distros.filter((distro) => {
    if (filters.family && distro.family !== filters.family) return false;
    if (
      filters.desktopEnvironment &&
      !distro.desktopEnvironments.includes(filters.desktopEnvironment)
    )
      return false;
    if (filters.releaseDateMonths) {
      const releaseDate = new Date(distro.lastRelease);
      const monthsAgo = new Date();
      monthsAgo.setMonth(monthsAgo.getMonth() - filters.releaseDateMonths);
      if (releaseDate < monthsAgo) return false;
    }
    return true;
  });
};
