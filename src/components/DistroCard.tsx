import { Distro } from "@/data/distros";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import ScoreBadge from "./ScoreBadge";
import { Checkbox } from "./ui/checkbox";
import { Calendar } from "lucide-react";

interface DistroCardProps {
  distro: Distro;
  isSelected?: boolean;
  onSelectToggle?: () => void;
  showCheckbox?: boolean;
}

const DistroCard = ({
  distro,
  isSelected = false,
  onSelectToggle,
  showCheckbox = true,
}: DistroCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", { year: "numeric", month: "short" });
  };

  return (
    <div className="relative bg-card border border-border rounded-xl p-6 card-hover group">
      {showCheckbox && onSelectToggle && (
        <div className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm p-2 rounded-lg border border-border shadow-lg">
          <Checkbox checked={isSelected} onCheckedChange={onSelectToggle} />
        </div>
      )}

      <Link to={`/distro/${distro.id}`} className="block">
        {/* Logo and Name */}
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={`/logos/${distro.id}.svg`}
            alt={`${distro.name} logo`}
            className="w-16 h-16 object-contain"
            onError={(e) => {
              // Fallback para ícone padrão se a logo falhar
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(distro.name)}&background=random&size=64`;
            }}
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-1">{distro.name}</h3>
            <p className="text-sm text-muted-foreground">{distro.family}</p>
          </div>
        </div>

        {/* Score */}
        <div className="mb-4">
          <ScoreBadge score={distro.score} size="md" />
        </div>

        {/* Desktop Environments */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {distro.desktopEnvironments.slice(0, 3).map((de) => (
              <Badge key={de} variant="secondary" className="text-xs">
                {de}
              </Badge>
            ))}
            {distro.desktopEnvironments.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{distro.desktopEnvironments.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Last Release */}
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Atualizado em {formatDate(distro.lastRelease)}</span>
        </div>
      </Link>
    </div>
  );
};

export default DistroCard;
