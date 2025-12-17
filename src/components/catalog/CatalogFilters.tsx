import { SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CatalogViewControls from "./CatalogViewControls";

interface CatalogFiltersProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  filterFamily: string;
  setFilterFamily: (value: string) => void;
  filterDE: string;
  setFilterDE: (value: string) => void;
  families: string[];
  allDEs: string[];
  familyCounts: Record<string, number>;
  deCounts: Record<string, number>;
  showSpecs: boolean;
  setShowSpecs: (value: boolean) => void;
  viewMode: "list" | "grid" | "terminal";
  setViewMode: (value: "list" | "grid" | "terminal") => void;
}

const CatalogFilters = ({
  sortBy,
  setSortBy,
  filterFamily,
  setFilterFamily,
  filterDE,
  setFilterDE,
  families,
  allDEs,
  familyCounts,
  deCounts,
  showSpecs,
  setShowSpecs,
  viewMode,
  setViewMode,
}: CatalogFiltersProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 mb-8 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">{t("catalog.filters.title")}</h2>
        </div>

        <CatalogViewControls
          showSpecs={showSpecs}
          setShowSpecs={setShowSpecs}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      </div>

      {/* Selects Compactos */}
      <div className="flex flex-wrap gap-3">
        <div className="min-w-[140px] max-w-[200px] flex-1">
          <label className="text-xs font-medium mb-1.5 block text-muted-foreground">
            {t("catalog.filters.family")}
          </label>
          <Select value={filterFamily} onValueChange={setFilterFamily}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder={t("catalog.filters.familyAll")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("catalog.filters.familyAll")}</SelectItem>
              {families.map((family) => (
                <SelectItem key={family} value={family}>
                  <div className="flex items-center justify-between w-full gap-2">
                    <span>{family}</span>
                    <span className="text-xs text-muted-foreground">({familyCounts[family] || 0})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[140px] max-w-[200px] flex-1">
          <label className="text-xs font-medium mb-1.5 block text-muted-foreground">
            {t("catalog.filters.de")}
          </label>
          <Select value={filterDE} onValueChange={setFilterDE}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder={t("catalog.filters.deAll")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("catalog.filters.deAll")}</SelectItem>
              {allDEs.map((de) => (
                <SelectItem key={de} value={de}>
                  <div className="flex items-center justify-between w-full gap-2">
                    <span>{de}</span>
                    <span className="text-xs text-muted-foreground">({deCounts[de] || 0})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[140px] max-w-[200px] flex-1">
          <label className="text-xs font-medium mb-1.5 block text-muted-foreground">
            {t("catalog.filters.sortBy")}
          </label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">{t("catalog.filters.sortScore")}</SelectItem>
              <SelectItem value="name">{t("catalog.filters.sortName")}</SelectItem>
              <SelectItem value="release">{t("catalog.filters.sortRelease")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CatalogFilters;
