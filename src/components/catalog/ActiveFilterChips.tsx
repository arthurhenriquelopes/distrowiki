import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FilterChip {
  id: string;
  label: string;
  value: string;
}

interface ActiveFilterChipsProps {
  filters: FilterChip[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

const ActiveFilterChips = ({
  filters,
  onRemove,
  onClearAll,
}: ActiveFilterChipsProps) => {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border">
      <span className="text-sm text-muted-foreground">Filtros ativos:</span>

      {filters.map((filter) => (
        <Badge
          key={filter.id}
          variant="secondary"
          className="gap-1.5 pl-3 pr-2 py-1.5 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
        >
          <span className="text-sm">{filter.label}</span>
          <button
            onClick={() => onRemove(filter.id)}
            className="ml-0.5 rounded-none hover:bg-primary/30 p-0.5 transition-colors"
            aria-label={`Remover filtro ${filter.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-7 text-xs text-muted-foreground hover:text-foreground underline decoration-dashed"
      >
        Limpar todos
      </Button>
    </div>
  );
};

export default ActiveFilterChips;
