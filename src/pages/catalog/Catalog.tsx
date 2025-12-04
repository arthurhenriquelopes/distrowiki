import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import DistroCard from "@/components/distro/DistroCard";
import DistroCardSkeleton from "@/components/DistroCardSkeleton";
import CatalogFilters from "@/components/catalog/CatalogFilters";
import CatalogSearch from "../../components/catalog/CatalogSearch";
import ActiveFilterChips from "@/components/catalog/ActiveFilterChips";
import { useComparison } from "@/contexts/ComparisonContext";
import { useDistros } from "@/hooks/useDistros";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GitCompare, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Catalog = () => {
  const { selectedDistros, addDistro, removeDistro, isSelected } = useComparison();
  const [sortBy, setSortBy] = useState<string>("score");
  const [filterFamily, setFilterFamily] = useState<string>("all");
  const [filterDE, setFilterDE] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSpecs, setShowSpecs] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Usar hook customizado para buscar distros
  const { distros, loading, error } = useDistros();

  const families = Array.from(new Set(distros.map((d) => d.family)));
  const allDEs = Array.from(
    new Set(distros.flatMap((d) => d.desktopEnvironments))
  ).sort();

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

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.score - a.score;
        case "name":
          return a.name.localeCompare(b.name);
        case "release":
          if (!a.release_year && !b.release_year) return 0;
          if (!a.release_year) return 1;
          if (!b.release_year) return -1;
          return b.release_year - a.release_year;
        default:
          return 0;
      }
    });

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

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Catálogo de Distribuições
        </h1>
        <p className="text-lg text-muted-foreground">
          {loading
            ? "Carregando..."
            : `Explore ${distros.length} distribuições Linux`}
        </p>
      </motion.div>

      {loading && (
        <div
          className={`grid gap-6 mb-12 ${
            viewMode === "grid"
              ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
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
          <AlertTitle>Erro</AlertTitle>
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
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {filteredAndSortedDistros.map((distro) => (
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
            ))}
          </motion.div>

          {selectedDistros.length >= 2 && (
            <motion.div className="fixed bottom-8 right-8 z-50">
              <Link to={`/comparacao/${selectedDistros.map(d => d.id).join('+')}`}>
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
