import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Loader2, GitCompare, HardDrive, Cpu, Zap, Copy, Check } from "lucide-react";
import { MetricBar } from "@/components/comparison/MetricBar";
import { DesktopEnvBadge } from "@/components/DesktopEnvBadge";
import { calculatePerformanceScore } from "@/utils/scoreCalculation";
import { transformDistro } from "@/utils/apiTransform";
import ScoreBadge from "@/components/ScoreBadge";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useComparison } from "@/contexts/ComparisonContext";
import { useDistros } from "@/hooks/useDistros";
import { SEO } from "@/components/SEO";

import { ProposeEditModal } from "@/components/community/ProposeEditModal";
import { VoteButtons } from "@/components/community/VoteButtons";
import { Edit3 } from "lucide-react";

const DistroDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { replaceSelection } = useComparison();
  const [distro, setDistro] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compareWith, setCompareWith] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { t } = useTranslation();

  // Buscar distro atual
  useEffect(() => {
    const fetchDistro = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const apiBase = import.meta.env.VITE_API_BASE_ || 'https://distrowiki-api.vercel.app';
        const response = await fetch(`${apiBase}/distros/${id}`);

        if (!response.ok) {
          throw new Error(`Distribuição não encontrada`);
        }

        const data = await response.json();

        const normalized = transformDistro(data);

        const mappedData = {
          ...data,
          ...normalized,
          package_manager: data['Package Management'] || data.package_management || data.package_manager || data.packageManager,
          office_manager: data['Office Suite'] || data.office_suite || data.office_manager || data.officeManager,
          rating: calculatePerformanceScore(normalized),
        };

        setDistro(mappedData);
      } catch (err: any) {
        console.error('Erro ao buscar distro:', err);
        setError(err.message || 'Erro ao carregar distribuição');
      } finally {
        setLoading(false);
      }
    };

    fetchDistro();
  }, [id]);

  const { distros: allDistros } = useDistros();

  const handleCompare = () => {
    if (!compareWith || !distro) return;

    const d1 = {
      ...distro,
      id: distro.id || id,
      score: distro.rating || 0,
      desktopEnvironments: distro.desktopEnvironments || distro.desktop_environments || [],
      lastRelease: distro.latest_release_date || new Date().toISOString(),
    };
    const d2 = allDistros.find((d) => d.id === compareWith);

    if (d1 && d2) {
      replaceSelection([d1, d2]);
      setTimeout(() => {
        navigate("/comparacao");
      }, 0);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">{t("distroDetails.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !distro) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <SEO
          title={t("distroDetails.notFound")}
          description="A distribuição Linux solicitada não foi encontrada no catálogo."
          canonical={`https://distrowiki.site/distro/${id}`}
        />
        <Link to="/catalogo">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("distroDetails.backToCatalog")}
          </Button>
        </Link>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t("distroDetails.notFound")}</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link to="/catalogo">
            <Button>{t("distroDetails.goToCatalog")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const distroDescription = distro.summary || distro.description || `${distro.name} é uma distribuição Linux ${distro.family ? `baseada em ${distro.family}` : 'independente'}. Explore características técnicas, métricas de desempenho e mais informações.`;
  const distroScore = calculatePerformanceScore(distro);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": distro.name,
    "applicationCategory": "Operating System",
    "operatingSystem": "Linux",
    "description": distroDescription,
    "url": `https://distrowiki.site/distro/${distro.id}`,
    "image": `https://distrowiki.site/logos/${distro.id}.svg`,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": distroScore > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": distroScore.toFixed(1),
      "bestRating": "10",
      "worstRating": "0"
    } : undefined,
    "datePublished": distro.latest_release_date || distro.lastRelease,
    "publisher": {
      "@type": "Organization",
      "name": distro.name
    },
    "softwareVersion": distro.latest_release_date ? new Date(distro.latest_release_date).getFullYear().toString() : undefined,
    "releaseNotes": distro.homepage || distro.website,
    "softwareRequirements": distro.requirements ? JSON.stringify(distro.requirements) : undefined
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <SEO
        title={`${distro.name} - Análise Completa`}
        description={distroDescription}
        canonical={`https://distrowiki.site/distro/${distro.id}`}
        keywords={`${distro.name}, ${distro.family}, linux, distro, ${(distro.desktopEnvironments || distro.desktop_environments || []).join(', ')}`}
        ogImage={`https://distrowiki.site/logos/${distro.id}.svg`}
        structuredData={structuredData}
      />
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link to="/catalogo">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("distroDetails.backToCatalog")}
          </Button>
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        className="bg-card border border-border rounded-xl p-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <img
            src={`/logos/${distro.id || id}.svg`}
            alt={`${distro.name} logo`}
            className="w-32 h-32 object-contain"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(distro.name)}&background=random&size=128`;
            }}
          />
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-4xl md:text-5xl font-bold">{distro.name}</h1>
              <VoteButtons distroName={distro.id || id || ''} layout="horizontal" size="sm" />
            </div>
            <p className="text-xl text-muted-foreground mb-4">{distro.family || t("distroDetails.independent")}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start items-center">
              <ScoreBadge score={calculatePerformanceScore(distro)} size="lg" />
              {distro.homepage && (
                <a href={distro.homepage} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    {t("distroDetails.officialSite")}
                  </Button>
                </a>
              )}

              <Button variant="outline" className="gap-2" onClick={() => setIsEditModalOpen(true)}>
                <Edit3 className="w-4 h-4" />
                Sugerir Edição
              </Button>

              <ProposeEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                distroName={distro.name}
              />
              {/* Select de Comparação */}
              <div className="flex gap-2 items-center">
                <Select value={compareWith} onValueChange={setCompareWith}>
                  <SelectTrigger className="w-[200px] h-10">
                    <SelectValue placeholder={t("distroDetails.compareWith")} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {allDistros
                      .filter(d => d.id !== (distro.id || id))
                      .map((d) => (
                        <SelectItem key={d.id} value={d.id} className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <img src={d.logo} alt={d.name} className="w-5 h-5 object-contain" />
                            <span>{d.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleCompare}
                  disabled={!compareWith}
                  variant="outline"
                  className="gap-2"
                >
                  <GitCompare className="w-4 h-4" />
                  {t("distroDetails.compare")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">{t("distroDetails.tabs.overview")}</TabsTrigger>
          <TabsTrigger value="performance">{t("comparison.sections.performance")}</TabsTrigger>
          <TabsTrigger value="specs">{t("distroDetails.tabs.specs")}</TabsTrigger>
          <TabsTrigger value="links">{t("distroDetails.tabs.links")}</TabsTrigger>
        </TabsList>

        {/* Performance */}
        <TabsContent value="performance" className="space-y-6 animate-fade-in">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              {t("comparison.sections.performance")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              {/* RAM Idle */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <HardDrive className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{t("comparison.sections.ramIdle")}</span>
                </div>
                {(distro.idle_ram_usage || distro.ram_idle || distro.idleRamUsage) ? (
                  <MetricBar
                    value={distro.idle_ram_usage || distro.ram_idle || distro.idleRamUsage}
                    maxValue={2000}
                    isBest={(distro.idle_ram_usage || distro.ram_idle || distro.idleRamUsage) < 600}
                    formatValue={(v) => `${v} MB`}
                  />
                ) : (
                  <span className="text-muted-foreground italic text-sm">Dados não disponíveis</span>
                )}
              </div>

              {/* CPU Score */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Cpu className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{t("comparison.sections.cpuScore")}</span>
                </div>
                {distro.cpu_score ? (
                  <MetricBar
                    value={distro.cpu_score}
                    maxValue={10}
                    isBest={distro.cpu_score >= 8}
                    formatValue={(v) => `${v}/10`}
                    delay={0.1}
                  />
                ) : (
                  <span className="text-muted-foreground italic text-sm">Dados não disponíveis</span>
                )}
              </div>

              {/* I/O Score */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <HardDrive className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{t("comparison.sections.ioScore")}</span>
                </div>
                {distro.io_score ? (
                  <MetricBar
                    value={distro.io_score}
                    maxValue={10}
                    isBest={distro.io_score >= 8}
                    formatValue={(v) => `${v}/10`}
                    delay={0.2}
                  />
                ) : (
                  <span className="text-muted-foreground italic text-sm">Dados não disponíveis</span>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">{t("distroDetails.overview.about", { name: distro.name })}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {distro.summary || distro.description || t("distroDetails.overview.noDescription")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("distroDetails.overview.family")}</p>
                <p className="font-medium">{distro.family || t("distroDetails.independent")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("distroDetails.overview.origin")}</p>
                <p className="font-medium">{distro.origin || t("common.na")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("distroDetails.overview.status")}</p>
                <p className="font-medium">{distro.status || t("common.na")}</p>
              </div>
            </div>
          </div>

          {(distro.desktopEnvironments || distro.desktop_environments) && (distro.desktopEnvironments || distro.desktop_environments).length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">{t("distroDetails.overview.desktopEnv")}</h3>
              <div className="flex flex-wrap gap-2">
                {(distro.desktopEnvironments || distro.desktop_environments).map((de: string) => (
                  <DesktopEnvBadge key={de} name={de} size="md" />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Specs */}
        <TabsContent value="specs" className="space-y-6 animate-fade-in">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-primary" />
              {t("distroDetails.specs.title")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Based On */}
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Baseado em</p>
                <p className="text-lg font-semibold">{distro.based_on || distro.family || "Independente"}</p>
              </div>

              {/* Category */}
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Categoria</p>
                <p className="text-lg font-semibold">{distro.category || "Desktop"}</p>
              </div>

              {/* Package Manager */}
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Gerenciador de Pacotes</p>
                <p className="text-lg font-semibold">{distro.package_management || distro.package_manager || "N/A"}</p>
              </div>

              {/* Architecture */}
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Arquitetura</p>
                <p className="text-lg font-semibold">{distro.architecture || "x86_64"}</p>
              </div>

              {/* Requirements */}
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Requisitos</p>
                <p className="text-lg font-semibold">{distro.requirements || "Médio"}</p>
              </div>

              {/* Image Size */}
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Tamanho da ISO</p>
                <p className="text-lg font-semibold">{distro.image_size ? `${distro.image_size} GB` : "N/A"}</p>
              </div>

              {/* Office Suite */}
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Suite Office</p>
                <p className="text-lg font-semibold">{distro.office_suite || distro.office_manager || "N/A"}</p>
              </div>

              {/* First Release */}
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Ano de Lançamento</p>
                <p className="text-lg font-semibold">{distro.release_year || "N/A"}</p>
              </div>

              {/* Latest Release */}
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Última Versão</p>
                <p className="text-lg font-semibold">{distro.latest_release_date || distro.lastRelease || "N/A"}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Links */}
        <TabsContent value="links" className="space-y-6 animate-fade-in">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ExternalLink className="w-6 h-6 text-primary" />
              {t("distroDetails.links.title")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Official Website */}
              {distro.homepage && (
                <a
                  href={distro.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-primary/10 border border-transparent hover:border-primary/30 smooth-transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Site Oficial</p>
                      <p className="text-sm text-muted-foreground">{new URL(distro.homepage).hostname}</p>
                    </div>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180 group-hover:translate-x-1 transition-transform" />
                </a>
              )}

              {/* DistroWatch */}
              <a
                href={`https://distrowatch.com/table.php?distribution=${distro.id || distro.name?.toLowerCase()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-orange-500/10 border border-transparent hover:border-orange-500/30 smooth-transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <span className="text-orange-500 font-bold text-sm">DW</span>
                  </div>
                  <div>
                    <p className="font-semibold">DistroWatch</p>
                    <p className="text-sm text-muted-foreground">Rankings e reviews</p>
                  </div>
                </div>
                <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Wikipedia */}
              <a
                href={`https://en.wikipedia.org/wiki/${encodeURIComponent(distro.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30 smooth-transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <span className="text-blue-500 font-bold text-sm">W</span>
                  </div>
                  <div>
                    <p className="font-semibold">Wikipedia</p>
                    <p className="text-sm text-muted-foreground">História e detalhes</p>
                  </div>
                </div>
                <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Download */}
              {distro.homepage && (
                <a
                  href={`${distro.homepage}/download`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-green-500/10 border border-transparent hover:border-green-500/30 smooth-transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <HardDrive className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Download</p>
                      <p className="text-sm text-muted-foreground">Baixar ISO</p>
                    </div>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180 group-hover:translate-x-1 transition-transform" />
                </a>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DistroDetails;
