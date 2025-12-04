import { useComparison } from "@/contexts/ComparisonContext";
import { motion } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, X } from "lucide-react";
import ScoreBadge from "@/components/ScoreBadge";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import {
  fetchDistrosByIds,
  getBestValue,
  isBestValue,
  hasPerformanceData,
} from "@/utils/comparisonHelpers";

const Comparison = () => {
  const { selectedDistros, removeDistro, replaceSelection } = useComparison();
  const { distroIds } = useParams<{ distroIds?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/catalogo">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Catálogo
          </Button>
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Comparação de Distros</h1>
        <p className="text-muted-foreground">
          Comparando {selectedDistros.length} distribuições lado a lado
        </p>
      </motion.div>

      <div className="overflow-x-auto">
        <motion.div 
          className="grid gap-6" 
          style={{ gridTemplateColumns: `repeat(${selectedDistros.length}, minmax(280px, 1fr))` }}
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
              className="bg-card border border-border rounded-xl overflow-hidden"
              variants={{
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 }
              }}
            >
              <div className="p-6 border-b border-border relative">
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
                  className="absolute top-4 right-4 text-muted-foreground hover:text-destructive smooth-transition"
                  aria-label={`Remover ${distro.name} da comparação`}
                >
                  <X className="w-5 h-5" />
                </button>
                <img
                  src={distro.logo || `/logos/${distro.id}.svg`}
                  alt={`${distro.name} logo`}
                  className="w-20 h-20 object-contain mx-auto mb-4"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(distro.name)}&background=random&size=80`;
                  }}
                />
                <h2 className="text-2xl font-bold text-center mb-2">{distro.name}</h2>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  {distro.family || distro.based_on || 'Independente'}
                </p>
                <div className="flex justify-center">
                  <ScoreBadge score={distro.score || distro.rating || 0} size="lg" />
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                    Informações Básicas
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Site Oficial</p>
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
                      <div>
                        <p className="text-xs text-muted-foreground">Último Lançamento</p>
                        <p className="text-sm">
                          {new Date(distro.lastRelease || distro.latest_release_date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    ) : null}
                    <div>
                      <p className="text-xs text-muted-foreground">Categoria</p>
                      <p className="text-sm">{distro.category || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="text-sm">
                        <span className={distro.status === 'Active' ? 'text-success' : ''}>
                          {distro.status || 'N/A'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {(distro.desktopEnvironments || distro.desktop_environments)?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                      Ambientes Gráficos
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(distro.desktopEnvironments || distro.desktop_environments).map((de: string) => (
                        <Badge key={de} variant="secondary" className="text-xs">
                          {de}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {performanceAvailable ? (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                      Desempenho
                    </h3>
                    <div className="space-y-3">
                      {distro.idle_ram_usage ? (
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-xs text-muted-foreground">RAM Idle</p>
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
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary rounded-full h-2 smooth-transition"
                              style={{ width: `${Math.min((distro.idle_ram_usage / 2000) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : null}

                      {distro.cpu_score ? (
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-xs text-muted-foreground">CPU Score</p>
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
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary rounded-full h-2 smooth-transition"
                              style={{ width: `${(distro.cpu_score / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      ) : null}

                      {distro.io_score ? (
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-xs text-muted-foreground">I/O Score</p>
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
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary rounded-full h-2 smooth-transition"
                              style={{ width: `${(distro.io_score / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      ) : null}

                      {/* Requirements */}
                      {distro.requirements && (
                        <div className="flex justify-between pt-2">
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
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <p className="text-xs text-center text-muted-foreground">
                      📊 Dados de performance em breve
                    </p>
                  </div>
                )}

                {/* Technical Details */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                    Detalhes Técnicos
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Baseado em</span>
                      <span className="font-medium">{distro.based_on || distro.baseSystem || 'Independente'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Arquitetura</span>
                      <span className="font-medium">{distro.architecture || 'x86_64'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Origem</span>
                      <span className="font-medium">{distro.origin || 'N/A'}</span>
                    </div>
                    {(distro.packageManager || distro.package_management) && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gerenciador</span>
                        <span className="font-medium">{distro.packageManager || distro.package_management}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <Link to={`/distro/${distro.id}`}>
                  <Button variant="outline" className="w-full">
                    Ver Detalhes Completos
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
