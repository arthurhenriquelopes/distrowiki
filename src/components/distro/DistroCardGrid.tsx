import { Distro } from "@/types";
import { Link } from "react-router-dom";
import ScoreBadge from "@/components/ScoreBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { calculatePerformanceScore } from "@/utils/scoreCalculation";

interface DistroCardGridProps {
  distro: Distro;
  isSelected?: boolean;
  onSelectToggle?: () => void;
  showCheckbox?: boolean;
}

const DistroCardGrid = ({
  distro,
  isSelected = false,
  onSelectToggle,
  showCheckbox = true,
}: DistroCardGridProps) => {
  return (
    <div className="relative bg-card border border-border rounded-xl p-4 card-hover group flex flex-col h-[200px]">
      {showCheckbox && onSelectToggle && (
        <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={isSelected} onCheckedChange={onSelectToggle} className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-primary/50" />
        </div>
      )}

      <Link to={`/distro/${distro.id}`} className="flex flex-col h-full items-center justify-between text-center">
        <div className="flex-shrink-0">
          <img
            src={`/logos/${distro.id}.svg`}
            alt={`${distro.name} logo`}
            className="w-16 h-16 object-contain"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(distro.name)}&background=random&size=64`;
            }}
          />
        </div>
        
        <div className="flex-1 flex flex-col justify-center min-h-0 w-full px-2">
          <h3 className="text-sm font-bold mb-1 line-clamp-2 leading-tight">{distro.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {distro.family}
          </p>
        </div>
        
        <div className="flex-shrink-0 mt-2">
          <ScoreBadge score={calculatePerformanceScore(distro)} size="sm" />
        </div>
      </Link>
    </div>
  );
};

export default DistroCardGrid;
