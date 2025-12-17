import { Package, GitCompare, Users, CheckCircle2, Shield, TrendingUp, Globe, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export const useHomeContent = () => {
  const { t } = useTranslation();

  const STATS = [
    { icon: Package, value: "50+", label: t("home.stats.distros") },
    { icon: GitCompare, value: "1000+", label: t("home.stats.comparisons") },
    { icon: Users, value: "100%", label: t("home.stats.openSource") }
  ];

  const BENEFITS = [
    {
      icon: CheckCircle2,
      title: t("home.benefitCards.informed.title"),
      description: t("home.benefitCards.informed.description"),
      color: "from-blue-500/20 to-primary/20"
    },
    {
      icon: Shield,
      title: t("home.benefitCards.transparency.title"),
      description: t("home.benefitCards.transparency.description"),
      color: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: TrendingUp,
      title: t("home.benefitCards.updated.title"),
      description: t("home.benefitCards.updated.description"),
      color: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: Globe,
      title: t("home.benefitCards.ptbr.title"),
      description: t("home.benefitCards.ptbr.description"),
      color: "from-orange-500/20 to-yellow-500/20"
    },
  ];

  const HOW_IT_WORKS_STEPS = [
    {
      icon: Search,
      step: "1",
      title: t("home.howItWorksSteps.filter.title"),
      description: t("home.howItWorksSteps.filter.description"),
    },
    {
      icon: GitCompare,
      step: "2",
      title: t("home.howItWorksSteps.compare.title"),
      description: t("home.howItWorksSteps.compare.description"),
    },
    {
      icon: CheckCircle2,
      step: "3",
      title: t("home.howItWorksSteps.decide.title"),
      description: t("home.howItWorksSteps.decide.description"),
    },
  ];

  return { STATS, BENEFITS, HOW_IT_WORKS_STEPS };
};

// Keep static exports for backward compatibility
export const STATS = [
  { icon: Package, value: "50+", label: "Distribuições" },
  { icon: GitCompare, value: "1000+", label: "Comparações" },
  { icon: Users, value: "100%", label: "Open Source" }
];

export const BENEFITS = [
  {
    icon: CheckCircle2,
    title: "Decisão Informada",
    description: "Compare métricas reais de desempenho, uso de recursos e especificações técnicas.",
    color: "from-blue-500/20 to-primary/20"
  },
  {
    icon: Shield,
    title: "Transparência Total",
    description: "Metodologia aberta e dados verificáveis. Sem viés comercial.",
    color: "from-green-500/20 to-emerald-500/20"
  },
  {
    icon: TrendingUp,
    title: "Sempre Atualizado",
    description: "Informações sobre lançamentos recentes e evolução das distribuições.",
    color: "from-purple-500/20 to-pink-500/20"
  },
  {
    icon: Globe,
    title: "100% em PT-BR",
    description: "Conteúdo totalmente em português brasileiro, acessível para todos.",
    color: "from-orange-500/20 to-yellow-500/20"
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    icon: Search,
    step: "1",
    title: "Filtrar",
    description: "Busque por família, ambiente gráfico ou data de lançamento.",
  },
  {
    icon: GitCompare,
    step: "2",
    title: "Comparar",
    description: "Selecione até 4 distros e compare lado a lado.",
  },
  {
    icon: CheckCircle2,
    step: "3",
    title: "Decidir",
    description: "Tome sua decisão baseada em dados objetivos.",
  },
];

