import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import DistroCard from "@/components/DistroCard";
import { useComparison } from "@/contexts/ComparisonContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GitCompare, SlidersHorizontal, Loader2, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Catalog = () => {
  const { selectedDistros, addDistro, removeDistro, isSelected } = useComparison();
  const [sortBy, setSortBy] = useState<string>("score");
  const [filterFamily, setFilterFamily] = useState<string>("all");
  const [filterDE, setFilterDE] = useState<string>("all");
  const [distros, setDistros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar distros da API
  useEffect(() => {
    const fetchDistros = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/distros?page_size=100');
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar distribuições: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transformar dados da API para formato do frontend
        const transformedDistros = (data.distros || []).map((d: any) => ({
          id: d.id,
          name: d.name,
          family: d.family || 'Independent',
          desktopEnvironments: d.desktop_environments || [],
          lastRelease: d.latest_release_date || new Date().toISOString(),
          score: d.rating || 0,
          logo: d.logo_url || `/api/distros/${d.id}/logo`,
          website: d.homepage,
          description: d.summary || d.description,
          // Adicionar campos necessários para compatibilidade
          baseSystem: d.based_on || d.family,
          packageManager: d.package_manager,
          architecture: d.architecture,
          origin: d.origin,
          category: d.category,
          status: d.status,
          ranking: d.ranking
        }));
        
        setDistros(transformedDistros);
      } catch (err: any) {
        console.error('Erro ao buscar distros:', err);
        setError(err.message || 'Erro ao carregar distribuições');
      } finally {
        setLoading(false);
      }
    };

    fetchDistros();
  }, []);

  const families = Array.from(new Set(distros.map((d) => d.family)));
  const allDEs = Array.from(
    new Set(distros.flatMap((d) => d.desktopEnvironments))
  ).sort();

  const filteredAndSortedDistros = useMemo(() => {
    let filtered = [...distros];

    if (filterFamily !== "all") {
      filtered = filtered.filter((d) => d.family === filterFamily);
    }

    if (filterDE !== "all") {
      filtered = filtered.filter((d) => d.desktopEnvironments.includes(filterDE));
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.score - a.score;
        case "name":
          return a.name.localeCompare(b.name);
        case "release":
          return new Date(b.lastRelease).getTime() - new Date(a.lastRelease).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [distros, sortBy, filterFamily, filterDE]);

  const handleSelectToggle = (distro: any) => {
    if (isSelected(distro.id)) {
      removeDistro(distro.id);
    } else {
      if (selectedDistros.length < 4) {
        addDistro(distro);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      {/* Header */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Catálogo de Distribuições</h1>
        <p className="text-lg text-muted-foreground">
          {loading ? 'Carregando distribuições...' : `Explore ${distros.length} distribuições Linux para desktop`}
        </p>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">Carregando distribuições da API...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar dados</AlertTitle>
          <AlertDescription>
            {error}
            <br />
            <span className="text-sm mt-2 block">
              Certifique-se de que a API está rodando em http://localhost:8000
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Content - only show if not loading and no error */}
      {!loading && !error && (
        <>

      {/* Filters and Sort */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8 animate-slide-up">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Filtros e Ordenação</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-muted-foreground">
              Família/Base
            </label>
            <Select value={filterFamily} onValueChange={setFilterFamily}>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {families.map((family) => (
                  <SelectItem key={family} value={family}>
                    {family}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-muted-foreground">
              Ambiente Gráfico
            </label>
            <Select value={filterDE} onValueChange={setFilterDE}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {allDEs.map((de) => (
                  <SelectItem key={de} value={de}>
                    {de}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-muted-foreground">
              Ordenar por
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Score (maior)</SelectItem>
                <SelectItem value="name">Nome (A-Z)</SelectItem>
                <SelectItem value="release">Lançamento (recente)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {(filterFamily !== "all" || filterDE !== "all") && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            {filterFamily !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {filterFamily}
                <button
                  onClick={() => setFilterFamily("all")}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {filterDE !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {filterDE}
                <button
                  onClick={() => setFilterDE("all")}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Exibindo <span className="text-foreground font-semibold">{filteredAndSortedDistros.length}</span> distribuições
        </p>
      </div>

      {/* Distros Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        initial="initial"
        animate="animate"
        variants={{
          animate: {
            transition: {
              staggerChildren: 0.05
            }
          }
        }}
      >
        {filteredAndSortedDistros.map((distro) => (
          <motion.div
            key={distro.id}
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 }
            }}
          >
            <DistroCard
              distro={distro}
              isSelected={isSelected(distro.id)}
              onSelectToggle={() => handleSelectToggle(distro)}
              showCheckbox={true}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Floating Compare Button */}
      {selectedDistros.length >= 2 && (
        <motion.div 
          className="fixed bottom-8 right-8 z-50"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Link to="/comparacao">
            <Button size="lg" className="shadow-2xl gap-2">
              <GitCompare className="w-5 h-5" />
              Comparar {selectedDistros.length} distros
            </Button>
          </Link>
        </motion.div>
      )}
      </>
      )}
    </div>
  );
};

export default Catalog;
