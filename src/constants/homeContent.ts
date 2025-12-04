import { Package, GitCompare, Users, CheckCircle2, Shield, TrendingUp, Globe, Search } from "lucide-react";

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
