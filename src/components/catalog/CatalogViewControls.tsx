import { Button } from "@/components/ui/button";
import { Eye, EyeOff, LayoutGrid, LayoutList } from "lucide-react";

interface CatalogViewControlsProps {
  showSpecs: boolean;
  setShowSpecs: (value: boolean) => void;
  viewMode: "list" | "grid";
  setViewMode: (value: "list" | "grid") => void;
}

const CatalogViewControls = ({
  showSpecs,
  setShowSpecs,
  viewMode,
  setViewMode,
}: CatalogViewControlsProps) => {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowSpecs(!showSpecs)}
        className="gap-2 border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
      >
        {showSpecs ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        <span className="hidden sm:inline">
          {showSpecs ? "Ocultar" : "Mostrar"} Specs
        </span>
      </Button>

      {/* Divider */}
      <div className="w-px h-6 bg-border" />

      {/* Toggle View Mode - Agora toggle group conectado */}
      <div className="flex border border-border rounded-md overflow-hidden">
        <Button
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setViewMode("list")}
          className={`rounded-none border-0 px-3 ${
            viewMode === "list"
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
          aria-label="Visualização em lista"
        >
          <LayoutList className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setViewMode("grid")}
          className={`rounded-none border-0 px-3 ${
            viewMode === "grid"
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
          aria-label="Visualização em grade"
        >
          <LayoutGrid className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CatalogViewControls;
