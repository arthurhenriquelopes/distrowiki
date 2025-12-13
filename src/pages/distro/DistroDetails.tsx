import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Loader2, GitCompare } from "lucide-react";
import { getDesktopEnvColor } from "@/utils/desktopEnvColors";
import { calculatePerformanceScore } from "@/utils/scoreCalculation";
import ScoreBadge from "@/components/ScoreBadge";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useComparison } from "@/contexts/ComparisonContext";
import { SEO } from "@/components/SEO";

const DistroDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { replaceSelection } = useComparison();
  const [distro, setDistro] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allDistros, setAllDistros] = useState<any[]>([]);
  const [compareWith, setCompareWith] = useState<string>("");

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
        
        // Mapear campos da API para formato esperado
        const mappedData = {
          ...data,
          package_manager: data['Package Management'] || data.package_management || data.package_manager || data.packageManager,
          office_manager: data['Office Suite'] || data.office_suite || data.office_manager || data.officeManager,
          rating: calculatePerformanceScore(data),
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

  useEffect(() => {
    const fetchAllDistros = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_ || 'https://distrowiki-api.vercel.app';
        const response = await fetch(`${apiBase}/distros?page=1&page_size=100&sort_by=name&order=asc`);
        
        if (!response.ok) return;
        
        const data = await response.json();
        const transformed = (data.distros || []).map((d: any) => ({
          id: d.id,
          name: d.name,
          family: d.family || "Independent",
          desktopEnvironments: d.desktop_environments || [],
          lastRelease: d.latest_release_date || new Date().toISOString(),
          score: d.rating || 0,
          logo: `/logos/${d.id}.svg`,
          website: d.homepage,
          description: d.summary || d.description,
          ramIdle: d.ram_idle || 0,
          cpuScore: d.cpu_score || 0,
          ioScore: d.io_score || 0,
          releaseModel: d.release_model || "Unknown",
          ltsSupport: d.lts_support || false,
          packageManager: d.package_manager || "N/A",
        }));
        
        setAllDistros(transformed);
      } catch (err) {
        console.error('Erro ao buscar distros:', err);
      }
    };

    fetchAllDistros();
  }, []);

  const handleCompare = () => {
    if (!compareWith || !distro) return;

    const d1 = { 
      ...distro, 
      id: distro.id || id,
      score: distro.rating || 0,
      desktopEnvironments: distro.desktop_environments || [],
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
          <p className="text-lg text-muted-foreground">Carregando distribuição...</p>
        </div>
      </div>
    );
  }

  if (error || !distro) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <SEO
          title="Distribuição não encontrada"
          description="A distribuição Linux solicitada não foi encontrada no catálogo."
          canonical={`https://distrowiki.site/distro/${id}`}
        />
        <Link to="/catalogo">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Catálogo
          </Button>
        </Link>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Distribuição não encontrada</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link to="/catalogo">
            <Button>Ir para o Catálogo</Button>
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
        keywords={`${distro.name}, ${distro.family}, linux, distro, ${(distro.desktop_environments || []).join(', ')}`}
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
            Voltar ao Catálogo
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
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{distro.name}</h1>
            <p className="text-xl text-muted-foreground mb-4">{distro.family || 'Independente'}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start items-center">
              <ScoreBadge score={calculatePerformanceScore(distro)} size="lg" />
              {distro.homepage && (
                <a href={distro.homepage} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Site Oficial
                  </Button>
                </a>
              )}
              
              {/* Select de Comparação */}
              <div className="flex gap-2 items-center">
                <Select value={compareWith} onValueChange={setCompareWith}>
                  <SelectTrigger className="w-[200px] h-10">
                    <SelectValue placeholder="Comparar com..." />
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
                  Comparar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="specs">Especificações</TabsTrigger>
          <TabsTrigger value="links">Links Úteis</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Sobre {distro.name}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {distro.summary || distro.description || 'Sem descrição disponível'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Família/Base</p>
                <p className="font-medium">{distro.family || 'Independente'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Origem</p>
                <p className="font-medium">{distro.origin || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="font-medium">{distro.status || 'N/A'}</p>
              </div>
            </div>
          </div>

          {distro.desktop_environments && distro.desktop_environments.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Ambientes Gráficos Disponíveis</h3>
              <div className="flex flex-wrap gap-2">
                {distro.desktop_environments.map((de: string) => (
                  <span
                    key={de}
                    className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${getDesktopEnvColor(de)}`}
                  >
                    {de}
                  </span>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Specs */}
        <TabsContent value="specs" className="space-y-6 animate-fade-in">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Especificações Técnicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Baseado em</p>
                  <p className="text-lg font-medium">{distro.based_on || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Categoria</p>
                  <p className="text-lg font-medium">{distro.category || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Package Manager</p>
                  <p className="text-lg font-medium">{distro.package_manager || 'N/A'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">OS Type</p>
                  <p className="text-lg font-medium">{distro.os_type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Requirements</p>
                  <p className="text-lg font-medium">{distro.requirements || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Office Manager</p>
                  <p className="text-lg font-medium">{distro.office_manager || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Links */}
        <TabsContent value="links" className="space-y-6 animate-fade-in">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Links Úteis</h2>
            
            <div className="space-y-3">
              {distro.homepage && (
                <a
                  href={distro.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 smooth-transition group"
                >
                  <span className="font-medium">Site Oficial</span>
                  <ExternalLink className="w-5 h-5 text-primary group-hover:translate-x-1 smooth-transition" />
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
