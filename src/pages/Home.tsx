import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, Globe, Search, GitCompare, CheckCircle2, Users, Package, BarChart3 } from "lucide-react";
import ScoreBadge from "@/components/ScoreBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useComparison } from "@/contexts/ComparisonContext";

const Home = () => {
  const navigate = useNavigate();
  const { replaceSelection } = useComparison();
  const [distro1, setDistro1] = useState<string>("");
  const [distro2, setDistro2] = useState<string>("");

  // Estado para distros vindas da API
  const [distros, setDistros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar distros da API
  useEffect(() => {
    const fetchDistros = async () => {
      try {
        setLoading(true);
        const apiBase = import.meta.env.VITE_API_BASE_ || "https://distrowiki-api.vercel.app";
        const url = `${apiBase}/distros?page=1&page_size=100&sort_by=name&order=asc&force_refresh=false`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error("Erro ao buscar distribuições");
        }
        
        const data = await response.json();

        const transformedDistros = (data.distros || []).map((d: any) => ({
          id: d.id,
          name: d.name,
          family: d.family || "Independent",
          desktopEnvironments: d.desktop_environments || [],
          lastRelease: d.latest_release_date || new Date().toISOString(),
          score: d.rating || 0,
          logo: `/logos/${d.id}.svg`,
          website: d.homepage,
          description: d.summary || d.description,
          baseSystem: d.based_on || d.family,
          packageManager: d.package_manager,
          architecture: d.architecture,
          origin: d.origin,
          category: d.category,
          status: d.status,
          ranking: d.ranking,
          ramIdle: d.ram_idle || 0,
          cpuScore: d.cpu_score || 0,
          ioScore: d.io_score || 0,
          releaseModel: d.release_model || "Unknown",
          ltsSupport: d.lts_support || false,
        }));

        setDistros(transformedDistros);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDistros();
  }, []);

  // Calcula top 3 pelo score
  const topDistros = [...distros]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const handleCompare = () => {
    if (!distro1 || !distro2) return;

    const d1 = distros.find((d) => d.id === distro1);
    const d2 = distros.find((d) => d.id === distro2);

    // Substitui toda a seleção de uma vez (resolve o bug de acúmulo)
    if (d1 && d2) {
      replaceSelection([d1, d2]);
    }

    setTimeout(() => {
      navigate("/comparacao");
    }, 0);
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 relative">
        {/* Decorative Blur */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <motion.div 
          className="text-center space-y-8 relative z-10"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div variants={fadeIn}>
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <span className="text-primary font-semibold">🐧 A melhor plataforma para escolher sua distro</span>
            </div>
          </motion.div>
          
          <motion.h1 className="text-5xl md:text-7xl font-bold gradient-text flex items-center justify-center gap-2" variants={fadeIn}>
            DistroWiki
            <img 
              src="/logo/logo.png" 
              alt="DistroWiki Logo" 
              className="h-32 w-32 md:h-30 md:w-30 inline-block"
            />
          </motion.h1>
          
          <motion.p className="text-xl md:text-2xl text-foreground max-w-3xl mx-auto" variants={fadeIn}>
            Descubra a <span className="text-primary font-semibold">melhor Distro Linux</span> para a sua maior necessidade
          </motion.p>
          
          <motion.p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto" variants={fadeIn}>
            Plataforma open source para comparar distribuições Linux de forma objetiva, transparente e em português.
          </motion.p>
          
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4" variants={fadeIn}>
            <Link to="/catalogo">
              <Button size="lg" className="text-base px-8 group shadow-lg shadow-primary/20">
                Explorar Catálogo
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 smooth-transition" />
              </Button>
            </Link>
            <Link to="/comparacao">
              <Button size="lg" variant="outline" className="text-base px-8 border-2">
                Comparar Agora
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Quick Comparison Section */}
      <section className="container mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <GitCompare className="w-12 h-12 text-primary mx-auto mb-3" />
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Compare Rapidamente</h2>
                <p className="text-muted-foreground">Selecione duas distribuições e veja as diferenças lado a lado</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Primeira Distro</label>
                  <Select value={distro1} onValueChange={setDistro1}>
                    <SelectTrigger className="h-12 bg-background border-2 border-border hover:border-primary transition-colors">
                      <SelectValue placeholder="Escolha uma distro..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {distros
                        .filter(d => d.id !== distro2)
                        .map((distro) => (
                          <SelectItem key={distro.id} value={distro.id} className="cursor-pointer">
                            <div className="flex items-center gap-3">
                              <img src={distro.logo} alt={distro.name} className="w-6 h-6 object-contain" />
                              <span className="font-medium">{distro.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Segunda Distro</label>
                  <Select value={distro2} onValueChange={setDistro2}>
                    <SelectTrigger className="h-12 bg-background border-2 border-border hover:border-primary transition-colors">
                      <SelectValue placeholder="Escolha uma distro..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {distros
                        .filter(d => d.id !== distro1)
                        .map((distro) => (
                          <SelectItem key={distro.id} value={distro.id} className="cursor-pointer">
                            <div className="flex items-center gap-3">
                              <img src={distro.logo} alt={distro.name} className="w-6 h-6 object-contain" />
                              <span className="font-medium">{distro.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleCompare}
                disabled={!distro1 || !distro2}
                size="lg"
                className="w-full h-12 text-base shadow-lg shadow-primary/20"
              >
                Comparar Distros
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 pb-16">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
        >
          {[
            { icon: Package, value: "50+", label: "Distribuições" },
            { icon: GitCompare, value: "1000+", label: "Comparações" },
            { icon: Users, value: "100%", label: "Open Source" }
          ].map((stat) => (
            <motion.div key={stat.label} variants={fadeIn}>
              <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
                <CardContent className="p-6 text-center">
                  <stat.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                  <div className="text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Top Distros */}
      <section className="container mx-auto px-4 pt-8 pb-16">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Distribuições em Destaque
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
        >
          {topDistros.map((distro) => (
            <motion.div key={distro.id} variants={fadeIn}>
              <Link
                to={`/distro/${distro.id}`}
                className="block bg-card border border-border rounded-xl p-6 card-hover"
              >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={distro.logo}
                  alt={`${distro.name} logo`}
                  className="w-16 h-16 object-contain"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground">{distro.name}</h3>
                  <p className="text-sm text-muted-foreground">{distro.family}</p>
                </div>
              </div>
              <ScoreBadge score={distro.score} size="lg" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Por que DistroWiki?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            A plataforma definitiva para tomar decisões informadas sobre distribuições Linux
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
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
          ].map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-gradient-to-br ${benefit.color} border-border/50 card-hover h-full`}>
                <CardContent className="p-6">
                  <div className="bg-background/50 w-14 h-14 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm">
                    <benefit.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none rounded-3xl"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Como Funciona
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Três passos simples para encontrar a distribuição Linux perfeita
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {[
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
          ].map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              <Card className="text-center bg-card/50 backdrop-blur-sm border-border/50 card-hover h-full">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                      <div className="relative bg-gradient-to-br from-primary to-primary-hover text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                        {step.step}
                      </div>
                    </div>
                  </div>
                  <step.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
              
              {/* Connector Line */}
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border-2 border-primary/30 rounded-3xl p-12 text-center overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <BarChart3 className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto para encontrar sua distro ideal?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Explore nosso catálogo completo ou comece comparando as distribuições mais populares.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/catalogo">
                  <Button size="lg" className="text-base px-8 shadow-lg shadow-primary/20">
                    Ver Catálogo Completo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/sobre">
                  <Button size="lg" variant="outline" className="text-base px-8 border-2">
                    Saber Mais
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
