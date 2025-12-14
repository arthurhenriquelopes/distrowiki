import { useComparison } from "@/contexts/ComparisonContext";
import { motion } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, X, Share2, Check, Info } from "lucide-react";
import { getDesktopEnvColor } from "@/utils/desktopEnvColors";
import { calculatePerformanceScore } from "@/utils/scoreCalculation";
import ScoreBadge from "@/components/ScoreBadge";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import {
  fetchDistrosByIds,
  getBestValue,
  isBestValue,
  hasPerformanceData,
} from "@/utils/comparisonHelpers";
import { SEO } from "@/components/SEO";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const Comparison = () => {
  const { selectedDistros, removeDistro, replaceSelection } = useComparison();
  const { distroIds } = useParams<{ distroIds?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
          <p className="text-muted-foreground">Carregando comparação...</p>
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
          <h1 className="text-4xl font-bold">Nenhuma Distro Selecionada</h1>
          <p className="text-lg text-muted-foreground">
            Selecione pelo menos 2 distribuições no catálogo para comparar.
          </p>
          <Link to="/catalogo">
            <Button size="lg">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Ir para o Catálogo
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Usar helpers utilitários
  const performanceAvailable = hasPerformanceData(selectedDistros);

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
        "ratingValue": calculatePerformanceScore(distro).toFixed(1),
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16 min-h-screen">
      <SEO
        title={comparisonTitle}
        description={comparisonDescription}
        canonical={comparisonUrl}
        keywords={`comparação, ${selectedDistros.map(d => d.name).join(', ')}, linux, benchmark`}
        structuredData={structuredData}
      />
      <motion.div 
        className="mb-8 md:mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <Link to="/catalogo">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Catálogo
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleShare}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copiado!
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                Compartilhar
              </>
            )}
          </Button>
        </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 tracking-tight">Comparação de Distros</h1>
        <p className="text-base md:text-lg text-muted-foreground">
          Comparando {selectedDistros.length} distribuições lado a lado
        </p>
      </motion.div>

      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <motion.div 
          className="grid gap-4 md:gap-6 lg:gap-8 pb-4" 
          style={{ 
            gridTemplateColumns: selectedDistros.length === 2 
              ? 'repeat(auto-fit, minmax(300px, 1fr))'
              : `repeat(${selectedDistros.length}, minmax(280px, 1fr))` 
          }}
          initial="initial"
          animate="animate"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {selectedDistros.map((distro) => (
            <motion.div 
              key={distro.id} 
              className="bg-card border border-border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              variants={{
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 }
              }}
            >
              <div className="p-6 md:p-8 border-b border-border relative bg-gradient-to-br from-card to-muted/20">
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
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 smooth-transition"
                  aria-label={`Remover ${distro.name} da comparação`}
                >
                  <X className="w-4 h-4" />
                </button>
                <img
                  src={distro.logo || `/logos/${distro.id}.svg`}
                  alt={`${distro.name} logo`}
                  className="w-24 h-24 object-contain mx-auto mb-5"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(distro.name)}&background=random&size=80`;
                  }}
                />
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 tracking-tight">{distro.name}</h2>
                <p className="text-sm text-muted-foreground text-center mb-5">
                  {distro.family || distro.based_on || 'Independente'}
                </p>
                <div className="flex justify-center">
                  <ScoreBadge score={calculatePerformanceScore(distro)} size="lg" />
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                {/* Descrição */}
                {distro.description && (
                  <div className="pb-6 -mx-6 md:-mx-8 px-6 md:px-8 border-b border-border">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                      Descrição
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 min-h-[5.6rem]">
                      {distro.description}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                    Informações Básicas
                  </h3>
                  <div className="space-y-0 -mx-6 md:-mx-8">
                    <div className="px-6 md:px-8 py-3 hover:bg-muted/40 transition-colors">
                      <p className="text-xs text-muted-foreground mb-1.5">Site Oficial</p>
                      {distro.website || distro.homepage ? (
                        <a
                          href={distro.website || distro.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                        >
                          Visitar <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">N/A</p>
                      )}
                    </div>
                    {distro.lastRelease || distro.latest_release_date ? (
                      <div className="px-6 md:px-8 py-3 bg-accent/30 hover:bg-accent/40 transition-colors">
                        <p className="text-xs text-muted-foreground mb-1.5">Último Lançamento</p>
                        <p className="text-sm font-medium">
                          {new Date(distro.lastRelease || distro.latest_release_date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    ) : null}
                    <div className="px-6 md:px-8 py-3 hover:bg-muted/40 transition-colors">
                      <p className="text-xs text-muted-foreground mb-1.5">Categoria</p>
                      <p className="text-sm font-medium">{distro.category || 'N/A'}</p>
                    </div>
                    <div className="px-6 md:px-8 py-3 bg-accent/30 hover:bg-accent/40 transition-colors">
                      <p className="text-xs text-muted-foreground mb-1.5">Status</p>
                      <p className="text-sm">
                        <span className={distro.status === 'Active' ? 'text-success' : ''}>
                          {distro.status || 'N/A'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {(distro.desktopEnvironments || distro.desktop_environments)?.length > 0 && (
                  <div className="pt-6 -mx-6 md:-mx-8 px-6 md:px-8 border-t border-border">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                      Ambientes Gráficos
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(distro.desktopEnvironments || distro.desktop_environments).map((de: string) => (
                        <span
                          key={de}
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getDesktopEnvColor(de)}`}
                        >
                          {de}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {performanceAvailable ? (
                  <div className="pt-6 -mx-6 md:-mx-8 px-6 md:px-8 border-t border-border">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                      Desempenho
                    </h3>
                    <div className="space-y-0 -mx-6 md:-mx-8">
                      {distro.idle_ram_usage ? (
                        <div className="px-6 md:px-8 py-3 hover:bg-muted/40 transition-colors">
                          <div className="flex justify-between items-center mb-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 cursor-help">
                                  RAM Idle
                                  <Info className="w-3 h-3" />
                                </p>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Quantidade de memória RAM usada após a inicialização. Menos é melhor para liberar recursos para seus aplicativos.</p>
                              </TooltipContent>
                            </Tooltip>
                            <p
                              className={`text-sm font-semibold ${
                                isBestValue(distro.idle_ram_usage, getBestValue(selectedDistros, "idle_ram_usage", true))
                                  ? "text-success"
                                  : ""
                              }`}
                            >
                              {distro.idle_ram_usage} MB
                            </p>
                          </div>
                          <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-primary to-primary/80 rounded-full h-2.5 smooth-transition shadow-sm"
                              style={{ width: `${Math.min((distro.idle_ram_usage / 2000) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : null}

                      {distro.cpu_score ? (
                        <div className="px-6 md:px-8 py-3 bg-accent/30 hover:bg-accent/40 transition-colors">
                          <div className="flex justify-between items-center mb-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 cursor-help">
                                  CPU Score
                                  <Info className="w-3 h-3 opacity-50" />
                                </p>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="text-xs">Desempenho do processador medido por benchmark. Quanto maior, melhor para tarefas intensivas.</p>
                              </TooltipContent>
                            </Tooltip>
                            <p
                              className={`text-sm font-semibold ${
                                isBestValue(distro.cpu_score, getBestValue(selectedDistros, "cpu_score"))
                                  ? "text-success"
                                  : ""
                              }`}
                            >
                              {distro.cpu_score}/10
                            </p>
                          </div>
                          <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-primary to-primary/80 rounded-full h-2.5 smooth-transition shadow-sm"
                              style={{ width: `${(distro.cpu_score / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      ) : null}

                      {distro.io_score ? (
                        <div className="px-6 md:px-8 py-3 hover:bg-muted/40 transition-colors">
                          <div className="flex justify-between items-center mb-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 cursor-help">
                                  I/O Score
                                  <Info className="w-3 h-3 opacity-50" />
                                </p>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="text-xs">Velocidade de leitura/escrita em disco. Importante para boot, instalação de programas e transferência de arquivos.</p>
                              </TooltipContent>
                            </Tooltip>
                            <p
                              className={`text-sm font-semibold ${
                                isBestValue(distro.io_score, getBestValue(selectedDistros, "io_score"))
                                  ? "text-success"
                                  : ""
                              }`}
                            >
                              {distro.io_score}/10
                            </p>
                          </div>
                          <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-primary to-primary/80 rounded-full h-2.5 smooth-transition shadow-sm"
                              style={{ width: `${(distro.io_score / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      ) : null}

                      {/* Requirements */}
                      {distro.requirements && (
                        <div className="flex justify-between px-6 md:px-8 py-3 bg-accent/30 hover:bg-accent/40 transition-colors">
                          <span className="text-xs text-muted-foreground">Requisitos</span>
                          <span className="text-sm font-medium">
                            {distro.requirements}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // Placeholder enquanto backend não tiver dados
                  <div className="bg-muted/30 rounded-lg p-6 border border-dashed border-border">
                    <p className="text-sm text-center text-muted-foreground">
                      📊 Dados de performance em breve
                    </p>
                  </div>
                )}

                {/* Technical Details */}
                <div className="pt-6 -mx-6 md:-mx-8 px-6 md:px-8 border-t border-border">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                    Detalhes Técnicos
                  </h3>
                  <div className="space-y-0 -mx-6 md:-mx-8 text-sm">
                    <div className="flex justify-between px-6 md:px-8 py-3 hover:bg-muted/40 transition-colors">
                      <span className="text-muted-foreground">Baseado em</span>
                      <span className="font-medium">{distro.based_on || distro.baseSystem || 'Independente'}</span>
                    </div>
                    <div className="flex justify-between px-6 md:px-8 py-3 bg-accent/30 hover:bg-accent/40 transition-colors">
                      <span className="text-muted-foreground">Arquitetura</span>
                      <span className="font-medium">{distro.architecture || 'x86_64'}</span>
                    </div>
                    <div className="flex justify-between px-6 md:px-8 py-3 hover:bg-muted/40 transition-colors">
                      <span className="text-muted-foreground">Origem</span>
                      <span className="font-medium">{distro.origin || 'N/A'}</span>
                    </div>
                    {(distro.packageManager || distro.package_management) && (
                      <div className="flex justify-between px-6 md:px-8 py-3 bg-accent/30 hover:bg-accent/40 transition-colors">
                        <span className="text-muted-foreground">Pacotes</span>
                        <span className="font-medium">{distro.packageManager || distro.package_management}</span>
                      </div>
                    )}
                    {distro.officeManager && (
                      <div className="flex justify-between px-6 md:px-8 py-3 hover:bg-muted/40 transition-colors">
                        <span className="text-muted-foreground">Office</span>
                        <span className="font-medium">{distro.officeManager}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <Link to={`/distro/${distro.id}`} className="block">
                  <Button variant="outline" className="w-full group hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                    Ver Detalhes Completos
                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Comparison;
