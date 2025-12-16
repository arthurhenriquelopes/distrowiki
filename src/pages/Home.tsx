import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, GitCompare, BarChart3 } from "lucide-react";
import ScoreBadge from "@/components/ScoreBadge";
import { calculatePerformanceScore } from "@/utils/scoreCalculation";
import { Card, CardContent } from "@/components/ui/card";
import { useComparison } from "@/contexts/ComparisonContext";
import { useDistros } from "@/hooks/useDistros";
import { DistroSelect } from "@/components/home/DistroSelect";
import { StatCard } from "@/components/home/StatCard";
import { BenefitCard } from "@/components/home/BenefitCard";
import { HowItWorksStep } from "@/components/home/HowItWorksStep";
import { STATS, BENEFITS, HOW_IT_WORKS_STEPS } from "@/constants/homeContent";
import { SEO } from "@/components/SEO";

const Home = () => {
  const navigate = useNavigate();
  const { replaceSelection } = useComparison();
  const [distro1, setDistro1] = useState<string>("");
  const [distro2, setDistro2] = useState<string>("");

  const { distros, loading } = useDistros();


  const topDistros = [...distros]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const handleCompare = () => {
    if (!distro1 || !distro2) return;

    const d1 = distros.find((d) => d.id === distro1);
    const d2 = distros.find((d) => d.id === distro2);

    if (d1 && d2) {
      replaceSelection([d1, d2]);
      navigate(`/comparacao/${distro1}+${distro2}`);
    }
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DistroWiki",
    "url": "https://distrowiki.site",
    "description": "Plataforma open source para comparar distribuições Linux de forma objetiva e transparente",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://distrowiki.site/catalogo?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "pt-BR",
    "publisher": {
      "@type": "Organization",
      "name": "DistroWiki",
      "logo": {
        "@type": "ImageObject",
        "url": "https://distrowiki.site/logo/logo.svg"
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      <SEO 
        structuredData={structuredData}
      />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      
      <section className="container mx-auto px-4 py-4 sm:py-8 md:py-16 lg:py-24 relative">
        <div className="absolute top-10 sm:top-20 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-primary/20 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none"></div>
        
        <motion.div 
          className="text-center space-y-3 sm:space-y-5 md:space-y-6 relative z-10"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div variants={fadeIn}>
            <div className="inline-block px-2.5 sm:px-4 py-1 sm:py-2 bg-primary/10 border border-primary/20 rounded-full mb-2 sm:mb-4">
              <span className="text-primary font-semibold text-xs sm:text-sm md:text-base">🐧 A melhor plataforma para escolher sua distro</span>
            </div>
          </motion.div>
          
          <motion.h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold gradient-text flex items-center justify-center gap-1 sm:gap-2" variants={fadeIn}>
            DistroWiki
            <img 
              src="/logo/logo.svg" 
              alt="DistroWiki Logo" 
              className="h-10 w-10 sm:h-14 sm:w-14 md:h-20 md:w-20 lg:h-28 lg:w-28 inline-block"
            />
          </motion.h1>
          
          <motion.p className="text-sm sm:text-base md:text-xl lg:text-2xl text-foreground max-w-3xl mx-auto px-2" variants={fadeIn}>
            Descubra a <span className="text-primary font-semibold">melhor Distro Linux</span> para a sua maior necessidade
          </motion.p>
          
          <motion.p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4 hidden sm:block" variants={fadeIn}>
            Plataforma open source para comparar distribuições Linux de forma objetiva, transparente e em português.
          </motion.p>
          
          <motion.div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center pt-1 sm:pt-4 px-4 sm:px-0" variants={fadeIn}>
            <Link to="/catalogo" className="w-full sm:w-auto">
              <Button size="default" className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-8 h-10 sm:h-11 group shadow-lg shadow-primary/20">
                Explorar Catálogo
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 smooth-transition" />
              </Button>
            </Link>
            <Button 
              size="default" 
              variant="outline" 
              className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-8 h-10 sm:h-11 border-2"
              onClick={() => document.getElementById('compare-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Comparar Agora
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <section id="compare-section" className="container mx-auto px-4 pb-16 scroll-mt-20">
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
                <DistroSelect
                  value={distro1}
                  onValueChange={setDistro1}
                  distros={distros}
                  excludeId={distro2}
                  label="Primeira Distro"
                  ariaLabel="Selecionar primeira distribuição Linux para comparar"
                />
                <DistroSelect
                  value={distro2}
                  onValueChange={setDistro2}
                  distros={distros}
                  excludeId={distro1}
                  label="Segunda Distro"
                  ariaLabel="Selecionar segunda distribuição Linux para comparar"
                />
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

      <section className="container mx-auto px-4 pb-16">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
        >
          {STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} variants={fadeIn} />
          ))}
        </motion.div>
      </section>

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
              <ScoreBadge score={calculatePerformanceScore(distro)} size="lg" />
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
          {BENEFITS.map((benefit, index) => (
            <BenefitCard key={benefit.title} {...benefit} index={index} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
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
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <HowItWorksStep key={step.step} {...step} index={index} showConnector={index < 2} />
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
