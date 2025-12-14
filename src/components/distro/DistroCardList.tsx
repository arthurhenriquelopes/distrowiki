import { Distro } from "@/types";
import { Link } from "react-router-dom";
import ScoreBadge from "@/components/ScoreBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Cpu, HardDrive, Rocket, Info } from "lucide-react";
import { getDesktopEnvColor } from "@/utils/desktopEnvColors";
import { calculatePerformanceScore } from "@/utils/scoreCalculation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DistroCardListProps {
  distro: Distro;
  isSelected?: boolean;
  onSelectToggle?: () => void;
  showCheckbox?: boolean;
  showSpecs?: boolean;
}

const DistroCardList = ({
  distro,
  isSelected = false,
  onSelectToggle,
  showCheckbox = true,
  showSpecs = true,
}: DistroCardListProps) => {
  const formatFamily = (family: string): string => {
    if (
      family.toLowerCase().includes("independente") ||
      family.toLowerCase().includes("independent")
    ) {
      return "Base Independente";
    }
    const baseName = family.split(/[/(]/)[0].trim();
    return `Baseado em ${baseName.charAt(0).toUpperCase() + baseName.slice(1)}`;
  };

  const hasPerformanceData =
    distro.idle_ram_usage || distro.cpu_score || distro.io_score;

  return (
    <div className="relative bg-card border border-border rounded-xl p-5 card-hover group h-full flex flex-col">
      {showCheckbox && onSelectToggle && (
        <div className="absolute top-4 right-4 z-10">
          <Checkbox checked={isSelected} onCheckedChange={onSelectToggle} />
        </div>
      )}

      <Link to={`/distro/${distro.id}`} className="flex flex-col h-full">
        <div className="flex items-start gap-4 mb-4">
          <img
            src={`/logos/${distro.id}.svg`}
            alt={`${distro.name} logo`}
            className="w-16 h-16 object-contain flex-shrink-0"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                distro.name
              )}&background=random&size=64`;
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-2">
              {distro.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {formatFamily(distro.family)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
          {distro.category && (
            <div className="flex items-center gap-1">
              <Rocket className="w-3.5 h-3.5" />
              <span className="truncate">{distro.category}</span>
            </div>
          )}
          {distro.release_year && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{distro.release_year}</span>
            </div>
          )}
        </div>

        {distro.desktopEnvironments && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {distro.desktopEnvironments.slice(0, 3).map((de) => {
              const colors = getDesktopEnvColor(de).split(" ");
              return (
                <span
                  key={de}
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${colors.join(
                    " "
                  )}`}
                >
                  {de}
                </span>
              );
            })}
            {distro.desktopEnvironments.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
                +{distro.desktopEnvironments.length - 3}
              </span>
            )}
          </div>
        )}

        {showSpecs && hasPerformanceData && (
          <div className="space-y-2 py-3 border-t border-border">
            {distro.idle_ram_usage && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 cursor-help">
                        <HardDrive className="w-3 h-3" />
                        RAM Idle
                        <Info className="w-3 h-3" />
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Quantidade de memória RAM usada após a inicialização. Menos é melhor para liberar recursos para seus aplicativos.</p>
                    </TooltipContent>
                  </Tooltip>
                  <p className="text-xs font-semibold">
                    {distro.idle_ram_usage} MB
                  </p>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-blue-500 rounded-full h-1.5 transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        (distro.idle_ram_usage / 2000) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {distro.cpu_score && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 cursor-help">
                        <Cpu className="w-3 h-3" />
                        CPU Score
                        <Info className="w-3 h-3 opacity-50" />
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">Desempenho do processador medido por benchmark. Quanto maior, melhor para tarefas intensivas.</p>
                    </TooltipContent>
                  </Tooltip>
                  <p className="text-xs font-semibold">{distro.cpu_score}/10</p>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-green-500 rounded-full h-1.5 transition-all duration-300"
                    style={{ width: `${(distro.cpu_score / 10) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {distro.io_score && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 cursor-help">
                        <HardDrive className="w-3 h-3" />
                        I/O Score
                        <Info className="w-3 h-3 opacity-50" />
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">Velocidade de leitura/escrita em disco. Importante para boot, instalação de programas e transferência de arquivos.</p>
                    </TooltipContent>
                  </Tooltip>
                  <p className="text-xs font-semibold">{distro.io_score}/10</p>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-purple-500 rounded-full h-1.5 transition-all duration-300"
                    style={{ width: `${(distro.io_score / 10) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {distro.requirements && (
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs text-muted-foreground">
                  Requisitos
                </span>
                <span className="text-xs font-medium">
                  {distro.requirements}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t border-border">
          <div className="flex items-center text-xs text-muted-foreground gap-1.5 min-w-0">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">
              {distro.latest_release_date || "Data indisponível"}
            </span>
          </div>

          <div className="flex-shrink-0">
            <ScoreBadge score={calculatePerformanceScore(distro)} size="sm" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DistroCardList;
