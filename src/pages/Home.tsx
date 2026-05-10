import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
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
import { useHomeContent } from "@/constants/homeContent";
import { SEO } from "@/components/SEO";
import { VoteButtons } from "@/components/community/VoteButtons";

const Home = () => {
  const navigate = useNavigate();
  const { replaceSelection } = useComparison();
  const [distro1, setDistro1] = useState<string>("");
  const [distro2, setDistro2] = useState<string>("");
  const { t, i18n } = useTranslation();
  const { STATS, BENEFITS, HOW_IT_WORKS_STEPS } = useHomeContent();

  const { distros, loading } = useDistros();

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
    "url": "https://www.distrowiki.site",
    "description": "Plataforma open source para comparar distribuições Linux de forma objetiva e transparente",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.distrowiki.site/catalogo?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "inLanguage": t('common.langCode') || "pt-BR",
    "publisher": {
      "@type": "Organization",
      "name": "DistroWiki",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.distrowiki.site/logo/logo.svg"
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      <SEO
        structuredData={structuredData}
      />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-start pt-8 md:pt-12 overflow-hidden">
        {/* Full-width Grid Background - Breaking out of any containers */}
        <div className="absolute inset-0 w-[100vw] left-1/2 -translate-x-1/2 tui-grid pointer-events-none"></div>
        {/* Radial mask for the grid to fade it out in the center */}
        <div className="absolute inset-0 w-[100vw] left-1/2 -translate-x-1/2 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_80%)]"></div>

        <motion.div
          className="container mx-auto px-4 text-center space-y-1 md:space-y-2 relative z-10"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold flex flex-col items-center justify-center gap-0" variants={fadeIn}>
            <div className="relative -mb-8 sm:-mb-16 md:-mb-24 z-10">
              <img
                src="/newlogo.png"
                alt="DistroWiki Logo"
                className="h-[18vh] sm:h-[22vh] md:h-[30vh] lg:h-[32vh] w-auto object-contain relative z-10 translate-y-1 sm:translate-y-2 md:translate-y-4"
              />
            </div>
            <div className="flex items-baseline z-20">
              <span className="text-primary">Distro</span>
              <span className="text-foreground">Wiki</span>
            </div>
          </motion.h1>

          <div className="space-y-1 md:space-y-2">
            <motion.p className="text-base sm:text-lg md:text-2xl lg:text-3xl text-foreground max-w-3xl mx-auto px-2" variants={fadeIn}>
              {t("home.subtitle").split("<highlight>")[0]}<span className="text-primary font-semibold">{t("home.subtitle").match(/<highlight>(.*?)<\/highlight>/)?.[1]}</span>{t("home.subtitle").split("</highlight>")[1]}
            </motion.p>

            <motion.p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4 hidden sm:block mt-6 md:mt-10" variants={fadeIn}>
              {t("home.description")}
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4 sm:gap-4 justify-center items-center pt-6 sm:pt-0 px-4 sm:px-0 w-full max-w-sm mx-auto sm:max-w-none" variants={fadeIn}>
              <Link to="/catalogo" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-12 px-8 text-lg font-bold transition-colors duration-300">
                  {t("home.exploreCatalog")}
                </Button>
              </Link>
              <Link to="/quiz" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full h-12 px-8 text-lg font-bold">
                  {t("quiz.start")}
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 px-8 text-lg font-bold border-2"
                onClick={() => document.getElementById('compare-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t("home.compareNow")}
              </Button>
            </motion.div>
          </div>

          <motion.div variants={fadeIn} className="pt-1 flex items-center justify-center gap-2 text-sm text-muted-foreground hidden sm:flex">
            <span>{t("home.trending") || "Em alta:"}</span>
            <Link to="/comparacao/linuxmint+ubuntu" className="px-3 py-1 bg-muted/50 rounded-none hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-1 group border border-transparent hover:border-primary/20">
              Mint vs Ubuntu <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link to="/comparacao/popos+fedora" className="px-3 py-1 bg-muted/50 rounded-none hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-1 group border border-transparent hover:border-primary/20">
              Pop!_OS vs Fedora <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
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
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20  ">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <GitCompare className="w-12 h-12 text-primary mx-auto mb-3" />
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{t("home.quickCompare.title")}</h2>
                <p className="text-muted-foreground">{t("home.quickCompare.subtitle")}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <DistroSelect
                  value={distro1}
                  onValueChange={setDistro1}
                  distros={distros}
                  excludeId={distro2}
                  label={t("home.quickCompare.firstDistro")}
                  ariaLabel={t("home.quickCompare.selectFirst")}
                />
                <DistroSelect
                  value={distro2}
                  onValueChange={setDistro2}
                  distros={distros}
                  excludeId={distro1}
                  label={t("home.quickCompare.secondDistro")}
                  ariaLabel={t("home.quickCompare.selectSecond")}
                />
              </div>

              <Button
                onClick={handleCompare}
                disabled={!distro1 || !distro2}
                size="lg"
                className="w-full h-12 text-base   shadow-primary/20"
              >
                {t("home.quickCompare.compareButton")}
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
          {t("home.featured")}
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
        >
          {loading || distros.length === 0 ? (
            // Loading skeleton
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-full bg-card border border-border rounded-none p-6 animate-pulse">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-muted rounded-none" />
                    <div className="flex-1">
                      <div className="h-5 w-24 bg-muted rounded mb-2" />
                      <div className="h-3 w-16 bg-muted rounded" />
                    </div>
                  </div>
                  <div className="h-10 bg-muted/50 rounded-none mb-4" />
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-muted rounded-none" />
                    <div className="h-6 w-24 bg-muted rounded-none" />
                  </div>
                  <div className="pt-4 border-t border-border/50 flex justify-between">
                    <div className="h-4 w-16 bg-muted rounded" />
                    <div className="h-8 w-12 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </>
          ) : (
            distros
              .map(d => ({ ...d, calculatedScore: calculatePerformanceScore(d) ?? 0 }))
              .sort((a, b) => b.calculatedScore - a.calculatedScore)
              .slice(0, 3)
              .map((distro, index) => (
                <motion.div key={distro.id} variants={fadeIn} className="h-full">
                  <Link
                    to={`/distro/${distro.id}`}
                    className="block h-full bg-gradient-to-br from-card to-muted/20 border border-border rounded-none p-6 transition-colors duration-300   hover:  hover:shadow-primary/10 hover:border-primary/30 relative overflow-hidden group"
                  >
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Ranking Badge */}
                    <div className={`absolute top-0 right-0 p-3 rounded-none font-bold flex flex-col items-center justify-center min-w-[50px] shadow-sm z-10 ${index === 0 ? 'bg-yellow-500/10 text-yellow-600 border-l border-b border-yellow-500/20' :
                      index === 1 ? 'bg-slate-300/10 text-slate-500 border-l border-b border-slate-300/20' :
                        'bg-amber-600/10 text-amber-700 border-l border-b border-amber-600/20'
                      }`}>
                      <span className="text-xs uppercase text-[10px] opacity-70">Rank</span>
                      <span className="text-xl">#{index + 1}</span>
                    </div>

                    <div className="flex items-center gap-4 mb-6 relative z-10">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <img
                          src={distro.logo}
                          alt={`${distro.name} logo`}
                          className="w-16 h-16 object-contain relative z-10 drop-shadow-md group-hover:drop-shadow-none transition-colors"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-foreground truncate group-hover:text-primary transition-colors">{distro.name}</h3>
                          <VoteButtons distroName={distro.id} layout="horizontal" size="sm" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="truncate">{distro.family || "Independent"}</span>
                          {distro.desktopEnvironments?.[0] && (
                            <>
                              <span className="w-1 h-1 rounded-none bg-muted-foreground/50"></span>
                              <span className="truncate max-w-[100px]">{distro.desktopEnvironments[0]}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="space-y-3 relative z-10 mb-4">
                      {/* RAM Usage */}
                      {distro.idleRamUsage && (
                        <div className="bg-muted/30 rounded-none p-2.5 flex items-center justify-between group-hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BarChart3 className="w-3.5 h-3.5" />
                            <span>RAM Idle</span>
                          </div>
                          <span className="font-mono font-medium text-sm">{distro.idleRamUsage} MB</span>
                        </div>
                      )}

                      {/* Category or Other Info */}
                      <div className="flex gap-2">
                        <span className="text-xs px-2.5 py-1 rounded-none bg-primary/5 text-primary border border-primary/10">
                          {distro.category || "Desktop"}
                        </span>
                        {distro.lastRelease && (
                          <span className="text-xs px-2.5 py-1 rounded-none bg-background/50 text-primary border border-primary/20 font-bold uppercase tracking-tighter">
                            {t("catalog.card.updatedAt")}: {new Date(distro.lastRelease).toLocaleDateString(i18n.language, { month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Score Footer */}
                    <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-end relative z-10">
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground mb-1">Performance</span>
                        <ScoreBadge score={distro.calculatedScore} size="lg" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
          )}
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
            {t("home.benefits.title")}
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t("home.benefits.subtitle")}
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
            {t("home.howItWorks.title")}
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t("home.howItWorks.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {/* Connector lines between cards - hidden on mobile */}
          <div className="hidden md:block absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-8 h-[2px] bg-gradient-to-r from-primary/60 to-primary/30 z-10"></div>
          <div className="hidden md:block absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 w-8 h-[2px] bg-gradient-to-r from-primary/60 to-primary/30 z-10"></div>

          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <HowItWorksStep key={step.step} {...step} index={index} showConnector={false} />
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-none blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-none blur-3xl"></div>

            <div className="relative z-10">
              <BarChart3 className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("home.cta.title")}
              </h2>
              <p className="text-lg text-muted-foreground mb-4 max-w-2xl mx-auto">
                {t("home.cta.subtitle")}
              </p>

              {/* Social Proof */}
              <div className="flex items-center justify-center gap-4 mb-8 text-sm text-muted-foreground">
                <a
                  href="https://github.com/arthurhenriquelopes/DistroWiki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-background/50 rounded-none px-4 py-2 hover:bg-background/80 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                  <span className="font-medium">Open Source</span>
                </a>
                <span className="text-muted-foreground/50">•</span>
                <span>100% Gratuito</span>
                <span className="text-muted-foreground/50">•</span>
                <span>Sem Anúncios</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/catalogo">
                  <Button size="lg" className="text-base px-8   shadow-primary/20">
                    {t("home.cta.viewCatalog")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/sobre">
                  <Button size="lg" variant="outline" className="text-base px-8 border-2">
                    {t("home.cta.learnMore")}
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
