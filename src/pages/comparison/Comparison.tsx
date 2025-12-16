import { useComparison } from "@/contexts/ComparisonContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, X, Share2, Check, Info, Trophy, Zap, HardDrive, Cpu, Monitor, Globe, Calendar, Package, MapPin } from "lucide-react";
import { DesktopEnvList } from "@/components/DesktopEnvBadge";
import { calculatePerformanceScore } from "@/utils/scoreCalculation";
import ScoreBadge from "@/components/ScoreBadge";
import { useEffect, useState } from "react";
import {
  fetchDistrosByIds,
  getBestValue,
  isBestValue,
  hasPerformanceData,
} from "@/utils/comparisonHelpers";
import { SEO } from "@/components/SEO";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
  
  // Encontrar o vencedor geral (maior score)
  const winnerDistro = selectedDistros.reduce((prev, current) => 
    calculatePerformanceScore(current) > calculatePerformanceScore(prev) ? current : prev
  );

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
        
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">Comparação de Distros</h1>
        <p className="text-muted-foreground">
          Analisando {selectedDistros.length} distribuições lado a lado
        </p>
      </motion.div>

      {/* Cards de Distro - Header Sticky */}
      <motion.div 
        className="sticky top-16 z-40 -mx-4 px-4 sm:mx-0 sm:px-0 py-3 bg-background/80 backdrop-blur-xl border-b border-border/50 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div 
          className="grid gap-2 sm:gap-3 md:gap-4"
          style={{ gridTemplateColumns: `repeat(${selectedDistros.length}, 1fr)` }}
        >
          {selectedDistros.map((distro) => {
            const score = calculatePerformanceScore(distro);
            const isWinner = distro.id === winnerDistro.id && selectedDistros.length > 1;
            const shortName = distro.name.split(' ')[0];
            
            return (
              <motion.div
                key={distro.id}
                className={cn(
                  "relative rounded-xl border transition-all duration-300",
                  // Padding responsivo
                  "p-2 sm:p-3 md:p-4",
                  isWinner 
                    ? "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/50 shadow-lg shadow-primary/10" 
                    : "bg-card/50 border-border/50 hover:border-border"
                )}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Badge de vencedor - compacto em mobile */}
                {isWinner && (
                  <div className="absolute -top-3 sm:-top-2 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs font-medium shadow-lg">
                      <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span className="hidden sm:inline">Melhor</span>
                    </span>
                  </div>
                )}
                
                {/* Botão remover - apenas em desktop */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
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

                {/* Link clicável para detalhes - todo o card em mobile */}
                <Link 
                  to={`/distro/${distro.id}`}
                  className="block"
                >
                  {/* Layout Mobile: compacto e vertical */}
                  <div className="flex flex-col items-center text-center sm:hidden">
                    <img
                      src={distro.logo || `/logos/${distro.id}.svg`}
                      alt={distro.name}
                      className="w-8 h-8 object-contain rounded-md mb-1"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(distro.name)}&background=random&size=32`;
                      }}
                    />
                    <h2 className="font-bold text-xs truncate w-full max-w-[80px]">{shortName}</h2>
                    <div className="mt-1">
                      <ScoreBadge score={score} size="sm" />
                    </div>
                  </div>

                  {/* Layout Desktop: horizontal com mais info */}
                  <div className="hidden sm:flex items-center gap-3">
                    <img
                      src={distro.logo || `/logos/${distro.id}.svg`}
                      alt={distro.name}
                      className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(distro.name)}&background=random&size=48`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-sm md:text-lg truncate">{distro.name}</h2>
                      <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                        {distro.family || distro.based_on || 'Independente'}
                      </p>
                    </div>
                    <ScoreBadge score={score} size="md" />
                  </div>
                </Link>
                
                {/* Link para detalhes - apenas em desktop */}
                <Link 
                  to={`/distro/${distro.id}`}
                  className="hidden sm:flex mt-2 md:mt-3 items-center justify-center gap-1 text-[10px] md:text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Ver detalhes <ExternalLink className="w-2.5 h-2.5 md:w-3 md:h-3" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Tabela de Comparação */}
      <div className="space-y-4">
        
        {/* Seção: Descrição */}
        <ComparisonSection title="Descrição" icon={<Info className="w-4 h-4" />}>
          <div 
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${selectedDistros.length}, 1fr)` }}
          >
            {selectedDistros.map((distro) => (
              <div key={distro.id} className="text-sm text-muted-foreground leading-relaxed">
                {distro.description || "Descrição não disponível."}
              </div>
            ))}
          </div>
        </ComparisonSection>

        {/* Seção: Desempenho */}
        {performanceAvailable && (
          <ComparisonSection title="Desempenho" icon={<Zap className="w-4 h-4" />} highlight>
            <div className="space-y-4">
              {/* RAM Idle */}
              <ComparisonRow 
                label="RAM Idle"
                tooltip="Memória usada após a inicialização. Menos é melhor."
                icon={<HardDrive className="w-3.5 h-3.5" />}
              >
                {selectedDistros.map((distro) => {
                  const value = distro.idle_ram_usage;
                  const best = getBestValue(selectedDistros, "idle_ram_usage", true);
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
                label="CPU Score"
                tooltip="Desempenho do processador. Maior é melhor."
                icon={<Cpu className="w-3.5 h-3.5" />}
              >
                {selectedDistros.map((distro) => {
                  const value = distro.cpu_score;
                  const best = getBestValue(selectedDistros, "cpu_score");
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
                label="I/O Score"
                tooltip="Velocidade de leitura/escrita. Maior é melhor."
                icon={<HardDrive className="w-3.5 h-3.5" />}
              >
                {selectedDistros.map((distro) => {
                  const value = distro.io_score;
                  const best = getBestValue(selectedDistros, "io_score");
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
              <ComparisonRow label="Requisitos">
                {selectedDistros.map((distro) => (
                  <span key={distro.id} className="text-sm font-medium">
                    {distro.requirements || "N/A"}
                  </span>
                ))}
              </ComparisonRow>
            </div>
          </ComparisonSection>
        )}

        {/* Seção: Ambientes Gráficos */}
        <ComparisonSection title="Ambientes Gráficos" icon={<Monitor className="w-4 h-4" />}>
          <div 
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${selectedDistros.length}, 1fr)` }}
          >
            {selectedDistros.map((distro) => {
              const desktops = distro.desktopEnvironments || distro.desktop_environments || [];
              return (
                <div key={distro.id} className="flex justify-center">
                  <DesktopEnvList environments={desktops} size="md" />
                </div>
              );
            })}
          </div>
        </ComparisonSection>

        {/* Seção: Informações Gerais */}
        <ComparisonSection title="Informações Gerais" icon={<Globe className="w-4 h-4" />}>
          <div className="space-y-3">
            <ComparisonRow label="Site Oficial" icon={<Globe className="w-3.5 h-3.5" />}>
              {selectedDistros.map((distro) => (
                <div key={distro.id}>
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
                    <span className="text-sm text-muted-foreground">N/A</span>
                  )}
                </div>
              ))}
            </ComparisonRow>

            <ComparisonRow label="Último Lançamento" icon={<Calendar className="w-3.5 h-3.5" />}>
              {selectedDistros.map((distro) => (
                <span key={distro.id} className="text-sm font-medium">
                  {distro.lastRelease || distro.latest_release_date 
                    ? new Date(distro.lastRelease || distro.latest_release_date).toLocaleDateString("pt-BR")
                    : "N/A"}
                </span>
              ))}
            </ComparisonRow>

            <ComparisonRow label="Categoria">
              {selectedDistros.map((distro) => (
                <span key={distro.id} className="text-sm font-medium">
                  {distro.category || "N/A"}
                </span>
              ))}
            </ComparisonRow>

            <ComparisonRow label="Status">
              {selectedDistros.map((distro) => (
                <span 
                  key={distro.id} 
                  className={cn(
                    "text-sm font-medium",
                    distro.status === 'Active' && "text-green-500"
                  )}
                >
                  {distro.status || "N/A"}
                </span>
              ))}
            </ComparisonRow>
          </div>
        </ComparisonSection>

        {/* Seção: Detalhes Técnicos */}
        <ComparisonSection title="Detalhes Técnicos" icon={<Package className="w-4 h-4" />}>
          <div className="space-y-3">
            <ComparisonRow label="Base">
              {selectedDistros.map((distro) => (
                <span key={distro.id} className="text-sm font-medium">
                  {distro.based_on || distro.baseSystem || "Independente"}
                </span>
              ))}
            </ComparisonRow>

            <ComparisonRow label="Arquitetura">
              {selectedDistros.map((distro) => (
                <span key={distro.id} className="text-sm font-medium font-mono">
                  {distro.architecture || "x86_64"}
                </span>
              ))}
            </ComparisonRow>

            <ComparisonRow label="Origem" icon={<MapPin className="w-3.5 h-3.5" />}>
              {selectedDistros.map((distro) => (
                <span key={distro.id} className="text-sm font-medium">
                  {distro.origin || "N/A"}
                </span>
              ))}
            </ComparisonRow>

            <ComparisonRow label="Gerenciador de Pacotes" icon={<Package className="w-3.5 h-3.5" />}>
              {selectedDistros.map((distro) => (
                <span key={distro.id} className="text-sm font-medium font-mono">
                  {distro.packageManager || distro.package_management || "N/A"}
                </span>
              ))}
            </ComparisonRow>
          </div>
        </ComparisonSection>

      </div>
    </div>
  );
};

// Componente auxiliar: Seção de Comparação
interface ComparisonSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  highlight?: boolean;
}

const ComparisonSection = ({ title, icon, children, highlight }: ComparisonSectionProps) => (
  <motion.div
    className={cn(
      "rounded-xl border p-5",
      highlight 
        ? "bg-gradient-to-br from-primary/5 via-transparent to-transparent border-primary/20" 
        : "bg-card/30 border-border/50"
    )}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="flex items-center justify-center gap-2 mb-4">
      {icon && <span className="text-primary">{icon}</span>}
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
    </div>
    {children}
  </motion.div>
);

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
              <span className="text-xs text-muted-foreground cursor-help flex items-center gap-1">
                {label}
                <Info className="w-3 h-3 opacity-50" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <span className="text-xs text-muted-foreground">{label}</span>
        )}
      </div>
      <div 
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${selectedDistros.length}, 1fr)` }}
      >
        {children}
      </div>
    </div>
  );
};

export default Comparison;
