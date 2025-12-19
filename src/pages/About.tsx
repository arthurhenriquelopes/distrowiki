import { motion } from "framer-motion";
import { Shield, TrendingUp, Target, Code, Users, Heart } from "lucide-react";
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
    "name": "Sobre o DistroWiki",
    "description": "Conheça o DistroWiki, plataforma open source para comparação objetiva e transparente de distribuições Linux",
    "url": "https://distrowiki.site/sobre",
    "inLanguage": "pt-BR",
    "mainEntity": {
      "@type": "Organization",
      "name": "DistroWiki",
      "url": "https://distrowiki.site",
      "logo": "https://distrowiki.site/logo/logo.svg",
      "sameAs": [
        "https://github.com/arthurhenrique/DistroWiki"
      ],
      "description": "Plataforma open source para comparar distribuições Linux de forma objetiva, transparente e em português"
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <SEO
        title="Sobre o DistroWiki"
        description="Conheça o DistroWiki, plataforma open source para comparação objetiva e transparente de distribuições Linux. Nossa missão, metodologia e roadmap público."
        canonical="https://distrowiki.site/sobre"
        keywords="sobre, distrowiki, open source, linux, missão, metodologia"
        structuredData={structuredData}
      />
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

      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-card border border-border rounded-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{t("about.mission.title")}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("about.mission.description")}
          </p>
        </div>
      </motion.section>

      {/* Why Useful */}
      <section className="mb-16">
        <motion.h2 
          className="text-3xl font-bold text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {t("about.whyUseful.title")}
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
        >
          {[
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
              icon: TrendingUp,
              title: t("about.whyUseful.items.timeSaving.title"),
              description: t("about.whyUseful.items.timeSaving.description"),
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
          ].map((item) => (
            <motion.div key={item.title} variants={fadeIn}>
              <div className="bg-card border border-border rounded-xl p-6 card-hover">
                <item.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Methodology */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">{t("about.methodology.title")}</h2>
        
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-primary">{t("about.methodology.whatWeMeasure.title")}</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">{t("about.methodology.whatWeMeasure.informative.title")}</h4>
                <p className="text-sm text-muted-foreground">
                  {t("about.methodology.whatWeMeasure.informative.description")}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">{t("about.methodology.whatWeMeasure.practical.title")}</h4>
                <p className="text-sm text-muted-foreground">
                  {t("about.methodology.whatWeMeasure.practical.description")}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">{t("about.methodology.whatWeMeasure.consolidated.title")}</h4>
                <p className="text-sm text-muted-foreground">
                  {t("about.methodology.whatWeMeasure.consolidated.description")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-primary">{t("about.methodology.howWeScore.title")}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t("about.methodology.howWeScore.intro")}
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span dangerouslySetInnerHTML={{ __html: t("about.methodology.howWeScore.performance") }} />
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span dangerouslySetInnerHTML={{ __html: t("about.methodology.howWeScore.stability") }} />
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span dangerouslySetInnerHTML={{ __html: t("about.methodology.howWeScore.usability") }} />
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span dangerouslySetInnerHTML={{ __html: t("about.methodology.howWeScore.community") }} />
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span dangerouslySetInnerHTML={{ __html: t("about.methodology.howWeScore.updates") }} />
              </li>
            </ul>
          </div>

          <div className="bg-warning/10 border border-warning/20 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-warning">{t("about.methodology.limitations.title")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {(t("about.methodology.limitations.items", { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-warning mr-2">⚠</span>
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">{t("about.roadmap.title")}</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { status: "✓", text: t("about.roadmap.items.catalog"), done: true },
            { status: "✓", text: t("about.roadmap.items.comparison"), done: true },
            { status: "✓", text: t("about.roadmap.items.filters"), done: true },
            { status: "⏳", text: t("about.roadmap.items.search"), done: false },
            { status: "⏳", text: t("about.roadmap.items.charts"), done: false },
            { status: "⏳", text: t("about.roadmap.items.pdf"), done: false },
            { status: "⏳", text: t("about.roadmap.items.api"), done: false },
            { status: "⏳", text: t("about.roadmap.items.contribution"), done: false },
          ].map((item, index) => (
            <div
              key={index}
              className={`flex items-center space-x-4 p-4 rounded-lg ${
                item.done
                  ? "bg-success/10 border border-success/20"
                  : "bg-card border border-border"
              } animate-slide-up`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className={`text-2xl ${item.done ? "text-success" : "text-muted-foreground"}`}>
                {item.status}
              </span>
              <span className={item.done ? "text-foreground font-medium" : "text-muted-foreground"}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Contribute */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{t("about.contribute.title")}</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("about.contribute.subtitle")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-background/50 backdrop-blur rounded-xl p-4">
              <h3 className="font-bold mb-2">{t("about.contribute.feedback.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("about.contribute.feedback.description")}
              </p>
            </div>
            <div className="bg-background/50 backdrop-blur rounded-xl p-4">
              <h3 className="font-bold mb-2">{t("about.contribute.data.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("about.contribute.data.description")}
              </p>
            </div>
            <div className="bg-background/50 backdrop-blur rounded-xl p-4">
              <h3 className="font-bold mb-2">{t("about.contribute.code.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("about.contribute.code.description")}
              </p>
            </div>
          </div>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="text-base px-8">
              {t("about.contribute.visitGithub")}
            </Button>
          </a>
        </div>
      </section>

      {/* License */}
      <section className="text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">{t("about.license.title")}</h2>
          <p className="text-muted-foreground mb-4" dangerouslySetInnerHTML={{ __html: t("about.license.description") }} />
          <p className="text-sm text-muted-foreground">
            {t("about.license.privacy")}
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
