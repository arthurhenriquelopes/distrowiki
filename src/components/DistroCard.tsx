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

  const formatFamily = (family: string): string => {
    if (family.toLowerCase().includes("independente") || family.toLowerCase().includes("independent")) {
      return "Base Independente";
    }
    
    const baseName = family.split(/[/(]/)[0].trim();
    
    return `Baseado em ${baseName.charAt(0).toUpperCase() + baseName.slice(1)}`;
  };

  const getDesktopEnvColor = (desktopEnv: string): string => {
    const colorMap: { [key: string]: string } = {
      "gnome": "bg-blue-500 text-white",
      "kde": "bg-purple-500 text-white",
      "xfce": "bg-blue-400 text-white",
      "lxqt": "bg-red-500 text-white",
      "mate": "bg-green-600 text-white",
      "budgie": "bg-pink-500 text-white",
      "cinnamon": "bg-orange-500 text-white",
      "i3": "bg-gray-700 text-white",
      "openbox": "bg-gray-600 text-white",
      "enlightenment": "bg-indigo-500 text-white",
      "pantheon": "bg-cyan-500 text-white",
      "unity": "bg-amber-600 text-white",
      "plasma": "bg-purple-600 text-white",
      "deepin": "bg-emerald-500 text-white",
    };
    
    return colorMap[desktopEnv.toLowerCase()] || "bg-gray-500 text-white";
  };

  return (
    <div className="relative bg-card border border-border rounded-xl p-4 card-hover group h-full min-h-[9rem]">
      {showCheckbox && onSelectToggle && (
        <div className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm p-2 rounded-lg border border-border shadow-lg">
          <Checkbox checked={isSelected} onCheckedChange={onSelectToggle} />
        </div>
      )}

      <Link to={`/distro/${distro.id}`} className="block h-full">
        <div className="flex flex-col h-full justify-between">
          {/* Logo and Name */}
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={`/logos/${distro.id}.svg`}
              alt={`${distro.name} logo`}
              className="w-16 h-16 object-contain flex-shrink-0"
              onError={(e) => {
                // Fallback para ícone padrão se a logo falhar
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(distro.name)}&background=random&size=64`;
              }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-foreground mb-1 truncate">{distro.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{formatFamily(distro.family)}</p>
            </div>
          </div>

          {/* Desktop Environments */}
          <div className="mb-4 min-h-8">
            <div className="flex flex-wrap gap-2">
              {distro.desktopEnvironments.slice(0, 3).map((de) => {
                const colors = getDesktopEnvColor(de).split(' ');
                const bgColor = colors[0];
                const textColor = colors[1];
                return (
                  <span
                    key={de}
                    className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
                  >
                    {de}
                  </span>
                );
              })}
              {distro.desktopEnvironments.length > 3 && (
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                  +{distro.desktopEnvironments.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Last Release */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center text-sm text-muted-foreground min-w-0">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Atualizado em {formatDate(distro.lastRelease)}</span>
            </div>
            
            {/* Score Badge - Canto inferior direito */}
            <div className="ml-4 flex-shrink-0">
              <ScoreBadge score={distro.score} size="md" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DistroCard;
