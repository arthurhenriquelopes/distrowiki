import { Distro } from "@/types";
import { Link } from "react-router-dom";
import ScoreBadge from "@/components/ScoreBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Cpu, HardDrive, Rocket, Info, Trophy, RefreshCw, Clock } from "lucide-react";
import { DesktopEnvBadge } from "@/components/DesktopEnvBadge";
import { calculatePerformanceScore } from "@/utils/scoreCalculation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MetricBar } from "@/components/comparison/MetricBar";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
    distro.idleRamUsage || distro.cpuScore || distro.ioScore;

  return (
    <div className="relative bg-card border border-border rounded-xl p-5 card-hover group h-full flex flex-col">
      {showCheckbox && onSelectToggle && (
        <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={isSelected} onCheckedChange={onSelectToggle} className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-primary/50" />
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
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-foreground line-clamp-2">
                {distro.name}
              </h3>
              {(distro.popularityRank || distro.ranking) && (distro.popularityRank || distro.ranking) <= 100 && (
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${(distro.popularityRank || distro.ranking) <= 10
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : (distro.popularityRank || distro.ranking) <= 30
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-primary/20 text-primary'
                    }`}
                  title="DistroWatch Ranking"
                >
                  <Trophy className="w-2.5 h-2.5" />
                  #{distro.popularityRank || distro.ranking}
                </span>
              )}
            </div>
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
          {distro.releaseModel && (
            <div className="flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>
                {distro.releaseModel.toLowerCase().includes('rolling')
                  ? t('catalog.card.rolling')
                  : distro.releaseModel.toLowerCase().includes('point') ||
                    distro.releaseModel.toLowerCase().includes('lts') ||
                    distro.releaseModel.toLowerCase().includes('fixed') ||
                    distro.releaseModel.toLowerCase().includes('standard')
                    ? t('catalog.card.fixed')
                    : distro.releaseModel}
              </span>
            </div>
          )}
        </div>

        {distro.desktopEnvironments && distro.desktopEnvironments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {distro.desktopEnvironments.slice(0, 3).map((de) => (
              <DesktopEnvBadge key={de} name={de} size="sm" />
            ))}
            {distro.desktopEnvironments.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-muted/50 text-muted-foreground border border-border/50">
                +{distro.desktopEnvironments.length - 3}
              </span>
            )}
          </div>
        )}

        {showSpecs && hasPerformanceData && (
          <div className="space-y-2 py-3 border-t border-border">
            {distro.idleRamUsage && (
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
                </div>
                <MetricBar
                  value={distro.idleRamUsage}
                  maxValue={2000}
                  isBest={false}
                  formatValue={(v) => `${v} MB`}
                />
              </div>
            )}

            {distro.cpuScore && (
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
                </div>
                <MetricBar
                  value={distro.cpuScore}
                  maxValue={10}
                  isBest={false}
                  formatValue={(v) => `${v}/10`}
                />
              </div>
            )}

            {distro.ioScore && (
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
                </div>
                <MetricBar
                  value={distro.ioScore}
                  maxValue={10}
                  isBest={false}
                  formatValue={(v) => `${v}/10`}
                />
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
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">
              {distro.lastRelease
                ? `${t('catalog.card.updatedAt')} ${new Date(distro.lastRelease).toLocaleDateString()}`
                : t('catalog.card.dateUnavailable')}
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
