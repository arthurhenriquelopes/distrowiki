import { motion } from "framer-motion";
import { Shield, Target, Code, Users, Heart, Github, ExternalLink, Database, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

const About = () => {
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

  const { t } = useTranslation();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": t("about.title"),
    "description": t("about.subtitle"),
    "url": "https://distrowiki.site/sobre",
    "inLanguage": t('common.langCode') || "pt-BR",
    "mainEntity": {
      "@type": "Organization",
      "name": "DistroWiki",
      "url": "https://distrowiki.site",
      "logo": "https://distrowiki.site/logo/logo.svg",
      "sameAs": [
        "https://github.com/arthurhenriquelopes/DistroWiki"
      ],
      "description": t("about.subtitle")
    }
  };

  const features = [
    {
      icon: Target,
      title: t("about.whyUseful.items.informed.title"),
      description: t("about.whyUseful.items.informed.description"),
    },
    {
      icon: Shield,
      title: t("about.whyUseful.items.transparency.title"),
      description: t("about.whyUseful.items.transparency.description"),
    },
    {
      icon: Database,
      title: t("about.whyUseful.items.realData.title"),
      description: t("about.whyUseful.items.realData.description"),
    },
    {
      icon: Code,
      title: t("about.whyUseful.items.desktop.title"),
      description: t("about.whyUseful.items.desktop.description"),
    },
    {
      icon: Users,
      title: t("about.whyUseful.items.community.title"),
      description: t("about.whyUseful.items.community.description"),
    },
    {
      icon: Heart,
      title: t("about.whyUseful.items.free.title"),
      description: t("about.whyUseful.items.free.description"),
    },
  ];

  const techStack = [
    { name: "React", description: t("about.techStack.items.react") },
    { name: "TypeScript", description: t("about.techStack.items.typescript") },
    { name: "Vite", description: t("about.techStack.items.vite") },
    { name: "Tailwind CSS", description: t("about.techStack.items.tailwind") },
    { name: "Framer Motion", description: t("about.techStack.items.framer") },
    { name: "Vercel", description: t("about.techStack.items.vercel") },
  ];

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <SEO
        title={t("about.title")}
        description={t("about.subtitle")}
        canonical="https://distrowiki.site/sobre"
        keywords="sobre, distrowiki, open source, linux, comparação"
        structuredData={structuredData}
      />

      {/* Hero */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("about.title")}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t("about.subtitle")}
        </p>
      </motion.div>

      {/* Mission */}
      <motion.section
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 rounded-2xl p-8 max-w-4xl mx-auto text-center">
          <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">{t("about.mission.title")}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t("about.missionDescription")}
          </p>
        </div>
      </motion.section>

      {/* What We Offer */}
      <section className="mb-16">
        <motion.h2
          className="text-3xl font-bold text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {t("about.whatWeOffer")}
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
        >
          {features.map((item) => (
            <motion.div key={item.title} variants={fadeIn}>
              <div className="bg-card border border-border rounded-xl p-6 h-full hover:border-primary/30 transition-all duration-300">
                <item.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <div className="bg-card border border-border rounded-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Como Calculamos o Score</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Nosso sistema combina <strong>dados do DistroWatch</strong> com <strong>métricas técnicas</strong> para criar uma pontuação justa e transparente:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-sm font-mono">RANK</span>
                <span>Popularidade no DistroWatch (55% do peso) - quanto menor o rank, maior a pontuação base</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm font-mono">RAM</span>
                <span>Uso de memória em idle - distros mais leves ganham mais pontos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm font-mono">CPU</span>
                <span>Benchmark de desempenho do processador</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm font-mono">I/O</span>
                <span>Velocidade de leitura/escrita em disco</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-sm font-mono">FRESH</span>
                <span>Distros com lançamentos recentes são valorizadas</span>
              </li>
            </ul>
            <p className="text-sm bg-warning/10 border border-warning/20 rounded-lg p-4 mt-4">
              <strong className="text-warning">⚠️ Importante:</strong> O score é uma referência, não uma verdade absoluta.
              A melhor distro é aquela que atende suas necessidades específicas.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">{t("about.techStack.title")}</h2>
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="bg-card border border-border rounded-lg px-4 py-2 hover:border-primary/30 transition-colors"
            >
              <span className="font-medium">{tech.name}</span>
              <span className="text-muted-foreground text-sm ml-2">• {tech.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contribute */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-12 text-center max-w-4xl mx-auto">
          <Github className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">{t("about.contribute.title")}</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("about.contribute.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://github.com/arthurhenriquelopes/DistroWiki" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-base px-8">
                <Github className="mr-2 h-5 w-5" />
                {t("about.contribute.visitGithub")}
              </Button>
            </a>
            <a href="https://github.com/arthurhenriquelopes/DistroWiki/issues" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-base px-8 border-2">
                <ExternalLink className="mr-2 h-5 w-5" />
                {t("about.contribute.reportProblem")}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* License */}
      <section className="text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">{t("about.license.title")}</h2>
          <p className="text-muted-foreground mb-4">
            {t("about.license.description")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("about.license.privacy")}
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;

