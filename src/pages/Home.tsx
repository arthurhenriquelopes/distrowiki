import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, Globe, Search, GitCompare, CheckCircle2 } from "lucide-react";
import { getTopDistros } from "@/data/distros";
import ScoreBadge from "@/components/ScoreBadge";

const Home = () => {
  const topDistros = getTopDistros(3);

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <motion.div 
          className="text-center space-y-8"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.h1 className="text-5xl md:text-7xl font-bold gradient-text" variants={fadeIn}>
            DistroWiki
          </motion.h1>
          <motion.p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto" variants={fadeIn}>
            Descubra a <span className="text-primary font-semibold">melhor Distro Linux</span> para a sua maior necessidade
          </motion.p>
          <motion.p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto" variants={fadeIn}>
            Plataforma open source para comparar distribuições Linux de forma objetiva, transparente e em português.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4" variants={fadeIn}>
            <Link to="/catalogo">
              <Button size="lg" className="text-base px-8 group">
                Explorar Catálogo
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 smooth-transition" />
              </Button>
            </Link>
            <Link to="/comparacao">
              <Button size="lg" variant="outline" className="text-base px-8">
                Comparar Agora
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Top Distros */}
      <section className="container mx-auto px-4 py-16">
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
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Por que DistroWiki?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: CheckCircle2,
              title: "Decisão Informada",
              description: "Compare métricas reais de desempenho, uso de recursos e especificações técnicas.",
            },
            {
              icon: Shield,
              title: "Transparência Total",
              description: "Metodologia aberta e dados verificáveis. Sem viés comercial.",
            },
            {
              icon: TrendingUp,
              title: "Sempre Atualizado",
              description: "Informações sobre lançamentos recentes e evolução das distribuições.",
            },
            {
              icon: Globe,
              title: "100% em PT-BR",
              description: "Conteúdo totalmente em português brasileiro, acessível para todos.",
            },
          ].map((benefit, index) => (
            <div
              key={benefit.title}
              className="bg-card border border-border rounded-xl p-6 card-hover animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <benefit.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Como Funciona
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
            <div
              key={step.step}
              className="text-center space-y-4 animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                  <div className="relative bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
                    {step.step}
                  </div>
                </div>
              </div>
              <step.icon className="w-12 h-12 text-primary mx-auto" />
              <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para encontrar sua distro ideal?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore nosso catálogo completo ou comece comparando as distribuições mais populares.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalogo">
              <Button size="lg" className="text-base px-8">
                Ver Catálogo Completo
              </Button>
            </Link>
            <Link to="/sobre">
              <Button size="lg" variant="outline" className="text-base px-8">
                Saiba Mais
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
