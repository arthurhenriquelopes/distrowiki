import { useComparison } from "@/contexts/ComparisonContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, X, Share2, Check, Info, Trophy, Zap, HardDrive, Cpu, Monitor, Globe, Calendar, Package, MapPin, ChevronDown, Plus, Eye, EyeOff } from "lucide-react";
import { DesktopEnvList } from "@/components/DesktopEnvBadge";
import { calculatePerformanceScore } from "@/utils/scoreCalculation";
import ScoreBadge from "@/components/ScoreBadge";
import React, { useEffect, useState } from "react";
import {
  fetchDistrosByIds,
  getBestValue,
  isBestValue,
  hasPerformanceData,
} from "@/utils/comparisonHelpers";
import { SEO } from "@/components/SEO";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

// Helper para formatar datas relativas (usa i18n)
const formatRelativeDate = (
  dateString: string | undefined | null, 
  t: (key: string, options?: Record<string, unknown>) => string
): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return t('comparison.relativeDate.future');
  if (diffDays === 0) return t('comparison.relativeDate.today');
  if (diffDays === 1) return t('comparison.relativeDate.yesterday');
  if (diffDays < 30) return t('comparison.relativeDate.daysAgo', { count: diffDays });
  if (diffDays < 60) return t('comparison.relativeDate.oneMonthAgo');
  if (diffDays < 365) return t('comparison.relativeDate.monthsAgo', { count: Math.floor(diffDays / 30) });
  if (diffDays < 730) return t('comparison.relativeDate.oneYearAgo');
  return t('comparison.relativeDate.yearsAgo', { count: Math.floor(diffDays / 365) });
};

const Comparison = () => {
  const { t } = useTranslation();
  const { selectedDistros, removeDistro, replaceSelection } = useComparison();
  const { distroIds } = useParams<{ distroIds?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);

  // Scroll listener para compactar header
  useEffect(() => {
    const handleScroll = () => {
      // Compactar quando scrollar mais de 200px
      setIsCompact(window.scrollY > 200);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Carregar distros da URL se houver parâmetros
  useEffect(() => {
    if (!distroIds || selectedDistros.length >= 2) return;

    const loadDistrosFromUrl = async () => {
      setLoading(true);
      try {
        const ids = distroIds.split('+');
        const loadedDistros = await fetchDistrosByIds(ids);
        
        if (loadedDistros.length >= 2) {
          replaceSelection(loadedDistros);
        }
      } catch (error) {
        console.error('Erro ao carregar distros da URL:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDistrosFromUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distroIds]);

  // Atualizar URL quando distros mudarem (sem distroIds inicial)
  useEffect(() => {
    if (selectedDistros.length >= 2 && !distroIds) {
      const ids = selectedDistros.map(d => d.id).join('+');
      navigate(`/comparacao/${ids}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDistros.length]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('comparison.loading')}</p>
        </div>
      </div>
    );
  }

  if (selectedDistros.length < 2) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-screen">
        <SEO
          title="Comparar Distribuições Linux"
          description="Compare até 4 distribuições Linux lado a lado. Analise desempenho, uso de recursos e especificações técnicas."
          canonical="https://distrowiki.site/comparacao"
        />
        <div className="text-center space-y-6 max-w-2xl mx-auto animate-fade-in">
          <h1 className="text-4xl font-bold">{t('comparison.noSelection.title')}</h1>
          <p className="text-lg text-muted-foreground">
            {t('comparison.noSelection.subtitle')}
          </p>
          <Link to="/catalogo">
            <Button size="lg">
              <ArrowLeft className="mr-2 h-5 w-5" />
              {t('comparison.noSelection.goToCatalog')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Usar helpers utilitários
  const performanceAvailable = hasPerformanceData(selectedDistros);
  
  // Calcular scores UMA vez e cachear (evita N*2 recálculos)
  const scoreMap = React.useMemo(() => {
    const map = new Map<string, number>();
    selectedDistros.forEach(d => map.set(d.id, calculatePerformanceScore(d)));
    return map;
  }, [selectedDistros]);
  
  // Encontrar o vencedor geral (maior score) usando cache
  const winnerDistro = React.useMemo(() => {
    return selectedDistros.reduce((prev, current) => 
      (scoreMap.get(current.id) || 0) > (scoreMap.get(prev.id) || 0) ? current : prev
    );
  }, [selectedDistros, scoreMap]);

  const comparisonTitle = `Comparar ${selectedDistros.map(d => d.name).join(' vs ')}`;
  const comparisonDescription = `Comparação detalhada entre ${selectedDistros.map(d => d.name).join(', ')}. Analise métricas de desempenho, uso de RAM, benchmarks e especificações técnicas.`;
  const comparisonUrl = `https://distrowiki.site/comparacao/${selectedDistros.map(d => d.id).join('+')}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ComparisonTable",
    "name": comparisonTitle,
    "description": comparisonDescription,
    "url": comparisonUrl,
    "inLanguage": "pt-BR",
    "about": selectedDistros.map(distro => ({
      "@type": "SoftwareApplication",
      "name": distro.name,
      "applicationCategory": "Operating System",
      "operatingSystem": "Linux",
      "url": `https://distrowiki.site/distro/${distro.id}`,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": (scoreMap.get(distro.id) || 0).toFixed(1),
        "bestRating": "10"
      }
    }))
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar URL:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen">
      <SEO
        title={comparisonTitle}
        description={comparisonDescription}
        canonical={comparisonUrl}
        keywords={`comparação, ${selectedDistros.map(d => d.name).join(', ')}, linux, benchmark`}
        structuredData={structuredData}
      />
      
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <Link to="/catalogo">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('comparison.backToCatalog')}
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            {/* Botão Adicionar Distro */}
            {selectedDistros.length < 4 && (
              <Link to="/catalogo">
                <Button variant="default" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Adicionar</span>
                </Button>
              </Link>
            )}
            
            {/* Botão Desktop - só desktop */}
            <Button 
              variant={showDesktop ? "default" : "outline"}
              size="sm"
              onClick={() => setShowDesktop(!showDesktop)}
              className="gap-2 hidden sm:flex"
            >
              {showDesktop ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              Desktop
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleShare}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  {t('comparison.copied')}
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  {t('comparison.share')}
                </>
              )}
            </Button>
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">{t('comparison.title')}</h1>
        <p className="text-muted-foreground">
          {t('comparison.comparing', { count: selectedDistros.length })}
        </p>
      </motion.div>

      {/* Cards de Distro - Header Sticky */}
      <motion.div 
        className="sticky top-16 z-40 -mx-4 px-4 sm:mx-0 sm:px-4 py-4 bg-background/80 backdrop-blur-xl border-b border-border/50 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div 
          className="grid gap-2 sm:gap-3 md:gap-4"
          style={{ gridTemplateColumns: `repeat(${selectedDistros.length}, 1fr)` }}
        >
          {selectedDistros.map((distro) => {
            const score = scoreMap.get(distro.id) || 0;
            const isWinner = distro.id === winnerDistro.id && selectedDistros.length > 1;
            // Primeiro nome para mobile (ex: "Arch Linux" -> "Arch")
            const shortName = distro.name.split(' ')[0];
            
            return (
              <motion.div
                key={distro.id}
                className={cn(
                  "relative rounded-xl p-2 sm:p-4 border transition-all duration-300 min-w-0",
                  isWinner 
                    ? "bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border-primary ring-2 ring-primary/30 shadow-xl shadow-primary/20" 
                    : "bg-card/30 border-border/40 opacity-80 hover:opacity-100 hover:border-border"
                )}
                whileHover={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Badge de vencedor - troféu no topo centralizado */}
                {isWinner && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                    {/* Mobile: só ícone */}
                    <span className="sm:hidden inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground shadow-lg">
                      <Trophy className="w-3 h-3" />
                    </span>
                    {/* Desktop: ícone + texto */}
                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-lg">
                      <Trophy className="w-3 h-3" />
                      {t('comparison.best')}
                    </span>
                  </div>
                )}
                
                {/* Botão remover */}
                <button
                  onClick={() => {
                    removeDistro(distro.id);
                    const remaining = selectedDistros.filter(d => d.id !== distro.id);
                    if (remaining.length >= 2) {
                      const ids = remaining.map(d => d.id).join('+');
                      navigate(`/comparacao/${ids}`, { replace: true });
                    } else {
                      navigate('/comparacao', { replace: true });
                    }
                  }}
                  className="absolute top-1 right-1 sm:top-2 sm:right-2 p-0.5 sm:p-1 rounded-full bg-background/80 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors z-10"
                  aria-label={`Remover ${distro.name}`}
                >
                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>

                {/* Mobile: Layout vertical compacto */}
                <div className="flex flex-col items-center sm:hidden pt-4 overflow-hidden">
                  <img
                    src={distro.logo || `/logos/${distro.id}.svg`}
                    alt={distro.name}
                    className="w-10 h-10 object-contain rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(distro.name)}&background=random&size=40`;
                    }}
                  />
                  <div className="w-full overflow-x-auto scrollbar-hide mt-1">
                    <h2 className="font-bold text-xs text-center whitespace-nowrap">{shortName}</h2>
                  </div>
                  <div className="mt-2.5">
                    <ScoreBadge score={score} size="sm" />
                  </div>
                </div>

                {/* Desktop: Layout condicional (expandido/compacto/screenshot) */}
                <div className={cn(
                  "hidden sm:flex flex-col items-center text-center transition-all duration-300 ease-out overflow-hidden",
                  isCompact ? "py-1" : "py-2"
                )}>
                  {showDesktop && !isCompact ? (
                    /* Modo Screenshot Desktop */
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted/50">
                      <img
                        src={`/logos/desktop/${distro.id}.png`}
                        alt={`${distro.name} Desktop`}
                        className="w-full h-full object-cover object-bottom"
                        onError={(e) => {
                          e.currentTarget.src = distro.logo || `/logos/${distro.id}.svg`;
                          e.currentTarget.className = "w-full h-full object-contain p-4 opacity-30";
                        }}
                      />
                      {/* Overlay com nome e score */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <div className="flex items-center justify-between">
                          <h2 className="font-bold text-sm text-white truncate">{distro.name}</h2>
                          <ScoreBadge score={score} size="sm" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Modo Normal (expandido/compacto) */
                    <>
                      <div className={cn(
                        "flex items-center gap-3 transition-all duration-300",
                        isCompact ? "flex-row" : "flex-col"
                      )}>
                        <img
                          src={distro.logo || `/logos/${distro.id}.svg`}
                          alt={distro.name}
                          className={cn(
                            "object-contain rounded-lg transition-all duration-300",
                            isCompact ? "w-8 h-8" : "w-14 h-14 mb-2"
                          )}
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(distro.name)}&background=random&size=56`;
                          }}
                        />
                        <div className={cn(
                          "transition-all duration-300",
                          isCompact ? "text-left" : "text-center w-full"
                        )}>
                          <h2 className={cn(
                            "font-bold truncate transition-all duration-300",
                            isCompact ? "text-sm" : "text-base w-full px-1"
                          )}>{isCompact ? shortName : distro.name}</h2>
                          {!isCompact && (
                            <p className="text-xs text-muted-foreground truncate w-full px-1 mb-2">
                              {distro.family || distro.basedOn || t('comparison.independent')}
                            </p>
                          )}
                        </div>
                        <ScoreBadge score={score} size={isCompact ? "sm" : "md"} />
                      </div>
                      
                      {/* Link para detalhes - só no modo expandido */}
                      {!isCompact && (
                        <Link 
                          to={`/distro/${distro.id}`}
                          className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          {t('comparison.sections.viewDetails')} <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Tabela de Comparação */}
      <div className="space-y-4">
        
        {/* Seção: Descrição - escondida em mobile por questão de espaço */}
        <div className="hidden sm:block">
          <ComparisonSection title={t('comparison.sections.description')} icon={<Info className="w-4 h-4" />}>
            <div 
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${selectedDistros.length}, 1fr)` }}
            >
              {selectedDistros.map((distro) => (
                <div key={distro.id} className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                  {distro.description || "Descrição não disponível."}
                </div>
              ))}
            </div>
          </ComparisonSection>
        </div>

        {/* Seção: Desempenho */}
        {performanceAvailable && (
          <ComparisonSection title={t('comparison.sections.performance')} icon={<Zap className="w-4 h-4" />} highlight>
            <div className="space-y-4">
              {/* RAM Idle */}
              <ComparisonRow 
                label={t('comparison.sections.ramIdle')}
                tooltip={t('comparison.sections.ramIdleTooltip')}
                icon={<HardDrive className="w-3.5 h-3.5" />}
              >
                {selectedDistros.map((distro) => {
                  const value = distro.idleRamUsage;
                  const best = getBestValue(selectedDistros, "idleRamUsage", true);
                  const isBest = value && isBestValue(value, best);
                  
                  return (
                    <div key={distro.id} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "text-sm font-medium",
                          isBest && "text-green-500"
                        )}>
                          {value ? `${value} MB` : "N/A"}
                        </span>
                        {isBest && <Trophy className="w-3.5 h-3.5 text-green-500" />}
                      </div>
                      {value && (
                        <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className={cn(
                              "h-2 rounded-full",
                              isBest ? "bg-green-500" : "bg-primary/70"
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((value / 2000) * 100, 100)}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </ComparisonRow>

              {/* CPU Score */}
              <ComparisonRow 
                label={t('comparison.sections.cpuScore')}
                tooltip={t('comparison.sections.cpuScoreTooltip')}
                icon={<Cpu className="w-3.5 h-3.5" />}
              >
                {selectedDistros.map((distro) => {
                  const value = distro.cpuScore;
                  const best = getBestValue(selectedDistros, "cpuScore");
                  const isBest = value && isBestValue(value, best);
                  
                  return (
                    <div key={distro.id} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "text-sm font-medium",
                          isBest && "text-green-500"
                        )}>
                          {value ? `${value}/10` : "N/A"}
                        </span>
                        {isBest && <Trophy className="w-3.5 h-3.5 text-green-500" />}
                      </div>
                      {value && (
                        <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className={cn(
                              "h-2 rounded-full",
                              isBest ? "bg-green-500" : "bg-primary/70"
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${(value / 10) * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </ComparisonRow>

              {/* I/O Score */}
              <ComparisonRow 
                label={t('comparison.sections.ioScore')}
                tooltip={t('comparison.sections.ioScoreTooltip')}
                icon={<HardDrive className="w-3.5 h-3.5" />}
              >
                {selectedDistros.map((distro) => {
                  const value = distro.ioScore;
                  const best = getBestValue(selectedDistros, "ioScore");
                  const isBest = value && isBestValue(value, best);
                  
                  return (
                    <div key={distro.id} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "text-sm font-medium",
                          isBest && "text-green-500"
                        )}>
                          {value ? `${value}/10` : "N/A"}
                        </span>
                        {isBest && <Trophy className="w-3.5 h-3.5 text-green-500" />}
                      </div>
                      {value && (
                        <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className={cn(
                              "h-2 rounded-full",
                              isBest ? "bg-green-500" : "bg-primary/70"
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${(value / 10) * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </ComparisonRow>

              {/* Requisitos */}
              <ComparisonRow label={t('comparison.sections.requirements')}>
                {selectedDistros.map((distro) => (
                  <span key={distro.id} className="text-sm font-medium text-center block">
                    {distro.requirements || "N/A"}
                  </span>
                ))}
              </ComparisonRow>
            </div>
          </ComparisonSection>
        )}

        {/* Seção: Ambientes Gráficos */}
        <ComparisonSection title={t('comparison.sections.desktopEnv')} icon={<Monitor className="w-4 h-4" />}>
          <div 
            className="grid gap-2 sm:gap-4"
            style={{ gridTemplateColumns: `repeat(${selectedDistros.length}, 1fr)` }}
          >
            {selectedDistros.map((distro) => {
              const desktops = distro.desktopEnvironments || [];
              return (
                <div key={distro.id} className="flex justify-center overflow-x-auto">
                  <div className="flex-shrink-0">
                    {/* Mobile: sm, Desktop: md */}
                    <div className="sm:hidden">
                      <DesktopEnvList environments={desktops} size="sm" />
                    </div>
                    <div className="hidden sm:block">
                      <DesktopEnvList environments={desktops} size="md" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ComparisonSection>

        {/* Seção: Informações Gerais */}
        <ComparisonSection title={t('comparison.sections.basicInfo')} icon={<Globe className="w-4 h-4" />}>
          <div className="space-y-3">
            <ComparisonRow label={t('comparison.sections.officialSite')} icon={<Globe className="w-3.5 h-3.5" />}>
              {selectedDistros.map((distro) => (
                <div key={distro.id}>
                  {distro.website || distro.homepage ? (
                    <a
                      href={distro.website || distro.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {t('comparison.sections.visit')} <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">{t('common.na')}</span>
                  )}
                </div>
              ))}
            </ComparisonRow>

            <ComparisonRow label={t('comparison.sections.lastRelease')} icon={<Calendar className="w-3.5 h-3.5" />}>
              {selectedDistros.map((distro) => (
                <Tooltip key={distro.id}>
                  <TooltipTrigger asChild>
                    <span className="text-sm font-medium cursor-help">
                      {formatRelativeDate(distro.lastRelease, t)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {distro.lastRelease 
                        ? new Date(distro.lastRelease).toLocaleDateString("pt-BR", { 
                            day: '2-digit', 
                            month: 'long', 
                            year: 'numeric' 
                          })
                        : "Data não disponível"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </ComparisonRow>

            <ComparisonRow label={t('comparison.sections.category')}>
              {selectedDistros.map((distro) => (
                <span key={distro.id} className="text-sm font-medium">
                  {distro.category || t('common.na')}
                </span>
              ))}
            </ComparisonRow>

            <ComparisonRow label={t('comparison.sections.status')}>
              {selectedDistros.map((distro) => (
                <span 
                  key={distro.id} 
                  className={cn(
                    "text-sm font-medium",
                    distro.status === 'Active' && "text-green-500"
                  )}
                >
                  {distro.status || t('common.na')}
                </span>
              ))}
            </ComparisonRow>
          </div>
        </ComparisonSection>

        {/* Seção: Detalhes Técnicos */}
        <ComparisonSection title={t('comparison.sections.technicalDetails')} icon={<Package className="w-4 h-4" />}>
          <div className="space-y-3">
            <ComparisonRow label={t('comparison.sections.basedOn')}>
              {selectedDistros.map((distro) => (
                <span key={distro.id} className="text-sm font-medium">
                  {distro.basedOn || distro.baseSystem || t('comparison.independent')}
                </span>
              ))}
            </ComparisonRow>

            <ComparisonRow label={t('comparison.sections.architecture')}>
              {selectedDistros.map((distro) => (
                <span key={distro.id} className="text-sm font-medium font-mono">
                  {distro.architecture || t('common.na')}
                </span>
              ))}
            </ComparisonRow>

            <ComparisonRow label={t('comparison.sections.origin')} icon={<MapPin className="w-3.5 h-3.5" />}>
              {selectedDistros.map((distro) => (
                <span key={distro.id} className="text-sm font-medium">
                  {distro.origin || t('common.na')}
                </span>
              ))}
            </ComparisonRow>

            <ComparisonRow label={t('comparison.sections.packages')} icon={<Package className="w-3.5 h-3.5" />}>
              {selectedDistros.map((distro) => (
                <span key={distro.id} className="text-sm font-medium font-mono">
                  {distro.packageManager || t('common.na')}
                </span>
              ))}
            </ComparisonRow>
          </div>
        </ComparisonSection>

      </div>
    </div>
  );
};

// Componente auxiliar: Seção de Comparação (Colapsável)
interface ComparisonSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  highlight?: boolean;
  defaultCollapsed?: boolean;
}

const ComparisonSection = ({ 
  title, 
  icon, 
  children, 
  highlight,
  defaultCollapsed = false 
}: ComparisonSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  
  return (
    <motion.div
      className={cn(
        "rounded-xl border overflow-hidden",
        highlight 
          ? "bg-gradient-to-br from-primary/5 via-transparent to-transparent border-primary/20" 
          : "bg-card/30 border-border/50"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header clicável */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-center gap-2 p-4 hover:bg-muted/30 transition-colors"
      >
        {icon && <span className="text-primary">{icon}</span>}
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground font-heading">
          {title}
        </h3>
        <ChevronDown 
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200",
            isCollapsed && "-rotate-90"
          )} 
        />
      </button>
      
      {/* Conteúdo colapsável */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-5 pb-5"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Componente auxiliar: Linha de Comparação
interface ComparisonRowProps {
  label: string;
  tooltip?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const ComparisonRow = ({ label, tooltip, icon, children }: ComparisonRowProps) => {
  const { selectedDistros } = useComparison();
  
  return (
    <div className="py-2 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-1.5 mb-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        {tooltip ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-xs text-muted-foreground cursor-help flex items-center gap-1 font-rounded">
                {label}
                <Info className="w-3 h-3 opacity-50" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <span className="text-xs text-muted-foreground font-rounded">{label}</span>
        )}
      </div>
      <div 
        className="grid gap-1 sm:gap-4"
        style={{ gridTemplateColumns: `repeat(${selectedDistros.length}, 1fr)` }}
      >
        {React.Children.map(children, (child) => (
          <div className="truncate text-xs sm:text-sm text-center">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comparison;
