import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import DistroCard from "@/components/distro/DistroCard";
import DistroCardSkeleton from "@/components/DistroCardSkeleton";
import CatalogFilters from "@/components/catalog/CatalogFilters";
import CatalogSearch from "../../components/catalog/CatalogSearch";
import ActiveFilterChips from "@/components/catalog/ActiveFilterChips";
import { useComparison } from "@/contexts/ComparisonContext";
import { useDistros } from "@/hooks/useDistros";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { calculatePerformanceScore } from "@/utils/scoreCalculation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GitCompare, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SEO } from "@/components/SEO";

const Catalog = () => {
  const { selectedDistros, addDistro, removeDistro, isSelected } = useComparison();
  const [sortBy, setSortBy] = useState<string>("score");
  const [filterFamily, setFilterFamily] = useState<string>("all");
  const [filterDE, setFilterDE] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSpecs, setShowSpecs] = useLocalStorage("catalog-show-specs", false);
  const [viewMode, setViewMode] = useLocalStorage<"list" | "grid" | "terminal">("catalog-view-mode", "list");
  const { t } = useTranslation();

  // Usar hook customizado para buscar distros
  const { distros, loading, error } = useDistros();

  const families = Array.from(new Set(distros.map((d) => d.family)));
  const allDEs = Array.from(
    new Set(distros.flatMap((d) => d.desktopEnvironments))
  ).sort();

  const familyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    distros.forEach((d) => {
      counts[d.family] = (counts[d.family] || 0) + 1;
    });
    return counts;
  }, [distros]);

  const deCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    distros.forEach((d) => {
      d.desktopEnvironments?.forEach((de) => {
        counts[de] = (counts[de] || 0) + 1;
      });
    });
    return counts;
  }, [distros]);

  const activeFilters = useMemo(() => {
    const filters = [];
    if (filterFamily !== "all") {
      filters.push({ id: "family", label: filterFamily, value: filterFamily });
    }
    if (filterDE !== "all") {
      filters.push({ id: "de", label: filterDE, value: filterDE });
    }
    return filters;
  }, [filterFamily, filterDE]);

  const handleRemoveFilter = (id: string) => {
    if (id === "family") setFilterFamily("all");
    if (id === "de") setFilterDE("all");
  };

  const handleClearAllFilters = () => {
    setFilterFamily("all");
    setFilterDE("all");
    setSearchQuery("");
  };

  const filteredAndSortedDistros = useMemo(() => {
    let filtered = [...distros];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.family.toLowerCase().includes(query) ||
          d.description?.toLowerCase().includes(query) ||
          d.desktopEnvironments.some((de: string) =>
            de.toLowerCase().includes(query)
          )
      );
    }

    if (filterFamily !== "all") {
      filtered = filtered.filter((d) => d.family === filterFamily);
    }

    if (filterDE !== "all") {
      filtered = filtered.filter((d) =>
        d.desktopEnvironments.includes(filterDE)
      );
    }

    // Cache scores before sort to avoid O(n log n) * 2 recalculations
    if (sortBy === "score") {
      const scoreCache = new Map<string, number>();
      filtered.forEach(d => {
        scoreCache.set(d.id, calculatePerformanceScore(d));
      });
      filtered.sort((a, b) => (scoreCache.get(b.id) || 0) - (scoreCache.get(a.id) || 0));
    } else {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "name":
            return a.name.localeCompare(b.name);
          case "release":
            if (!a.releaseYear && !b.releaseYear) return 0;
            if (!a.releaseYear) return 1;
            if (!b.releaseYear) return -1;
            return b.releaseYear - a.releaseYear;
          default:
            return 0;
        }
      });
    }

    const selected = filtered.filter((d) => isSelected(d.id));
    const unselected = filtered.filter((d) => !isSelected(d.id));
    return [...selected, ...unselected];
  }, [distros, sortBy, filterFamily, filterDE, searchQuery, selectedDistros]);

  const handleSelectToggle = (distro: any) => {
    if (isSelected(distro.id)) {
      removeDistro(distro.id);
    } else if (selectedDistros.length < 4) {
      addDistro(distro);
    }
  };

  const catalogDescription = filteredAndSortedDistros.length > 0 
    ? `Explore ${filteredAndSortedDistros.length} distribuições Linux. Compare características, desempenho e encontre a distro ideal para suas necessidades.`
    : "Explore o catálogo completo de distribuições Linux. Compare características, desempenho e encontre a distro ideal.";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Catálogo de Distribuições Linux",
    "description": catalogDescription,
    "url": "https://distrowiki.site/catalogo",
    "inLanguage": t('common.langCode') || "pt-BR",
    "numberOfItems": distros.length,
    "itemListElement": filteredAndSortedDistros.slice(0, 10).map((distro, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "SoftwareApplication",
        "name": distro.name,
        "applicationCategory": "Operating System",
        "operatingSystem": "Linux",
        "url": `https://distrowiki.site/distro/${distro.id}`
      }
    }))
  };

  return (
    <div className={`container mx-auto px-4 py-12 min-h-screen ${viewMode === "terminal" ? "terminal-scanlines" : ""}`}>
      <SEO
        title="Catálogo de Distribuições Linux"
        description={catalogDescription}
        canonical="https://distrowiki.site/catalogo"
        keywords="linux, distribuições, catálogo, ubuntu, fedora, arch, debian, opensuse, manjaro"
        structuredData={structuredData}
      />
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {viewMode === "terminal" ? (
          <div className="font-mono text-green-400">
            <div className="text-xl mb-2">
              <span className="text-blue-400">user@distrowiki</span>
              <span className="text-gray-400">:</span>
              <span className="text-purple-400">~/catalog</span>
              <span className="text-gray-400">$</span> ls -la
            </div>
            <p className="text-sm text-gray-400">
              {loading
                ? "Loading distros..."
                : `total ${distros.length} Linux distributions found`}
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("catalog.title")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {loading
                ? t("catalog.loading")
                : t("catalog.explore", { count: distros.length })}
            </p>
          </>
        )}
      </motion.div>

      {loading && (
        <div
          className={`grid gap-6 mb-12 ${
            viewMode === "grid"
              ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              : viewMode === "terminal"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <DistroCardSkeleton key={i} viewMode={viewMode} />
          ))}
        </div>
      )}

      {error && !loading && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("catalog.error")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && (
        <>
          <div className="mb-6">
            <CatalogSearch
              value={searchQuery}
              onChange={setSearchQuery}
              resultCount={filteredAndSortedDistros.length}
              totalCount={distros.length}
            />
          </div>

          <CatalogFilters
            sortBy={sortBy}
            setSortBy={setSortBy}
            filterFamily={filterFamily}
            setFilterFamily={setFilterFamily}
            filterDE={filterDE}
            setFilterDE={setFilterDE}
            families={families}
            allDEs={allDEs}
            familyCounts={familyCounts}
            deCounts={deCounts}
            showSpecs={showSpecs}
            setShowSpecs={setShowSpecs}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          {(activeFilters.length > 0 || searchQuery) && (
            <div className="mb-6">
              <ActiveFilterChips
                filters={activeFilters}
                onRemove={handleRemoveFilter}
                onClearAll={handleClearAllFilters}
              />
            </div>
          )}

          <motion.div
            className={`grid gap-6 mb-12 ${
              viewMode === "grid"
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                : viewMode === "terminal"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {filteredAndSortedDistros.length > 0 ? (
              filteredAndSortedDistros.map((distro) => (
                <motion.div key={distro.id}>
                  <DistroCard
                    distro={distro}
                    isSelected={isSelected(distro.id)}
                    onSelectToggle={() => handleSelectToggle(distro)}
                    showCheckbox={true}
                    showSpecs={showSpecs}
                    viewMode={viewMode}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                 <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <AlertCircle className="w-10 h-10 text-muted-foreground" />
                 </div>
                 <h3 className="text-xl font-bold mb-2">{t("catalog.noResultsTitle") || "Nenhuma distribuição encontrada"}</h3>
                 <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                   {t("catalog.noResultsDesc") || "Tente ajustar seus filtros ou busca para encontrar o que procura."}
                 </p>
                 <Button onClick={handleClearAllFilters} variant="outline">
                   {t("catalog.filters.clearAll")}
                 </Button>
              </div>
            )}
          </motion.div>

          {selectedDistros.length >= 2 && (
            <motion.div className="fixed bottom-8 right-8 z-50">
              <Link to={`/comparacao/${selectedDistros.map(d => d.id).join('+')}`}>
                <Button size="lg" className="shadow-2xl gap-2">
                <GitCompare className="w-5 h-5" />
                {t("catalog.compare", { count: selectedDistros.length })}
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
