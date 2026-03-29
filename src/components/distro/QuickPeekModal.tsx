import { Distro } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, HardDrive, Cpu, Zap, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScoreBadge from "@/components/ScoreBadge";
import { DesktopEnvBadge } from "@/components/DesktopEnvBadge";
import { calculatePerformanceScore } from "@/utils/scoreCalculation";
import { MetricBar } from "@/components/comparison/MetricBar";
import { useTranslation } from "react-i18next";

interface QuickPeekModalProps {
  distro: Distro | null;
  isOpen: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

const QuickPeekModal = ({ distro, isOpen, onClose }: QuickPeekModalProps) => {
  const { t } = useTranslation();

  if (!distro) return null;

  const score = calculatePerformanceScore(distro);
  const rank = distro.popularityRank || distro.ranking;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md max-h-[80vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="glass-card rounded-2xl p-6 shadow-2xl">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-muted/80 hover:bg-destructive/20 hover:text-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={`/logos/${distro.id}.svg`}
                  alt={distro.name}
                  className="w-16 h-16 object-contain rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(distro.name)}&background=random&size=64`;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold truncate">{distro.name}</h3>
                    {rank && rank <= 30 && (
                      <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        rank <= 10 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        <Trophy className="w-2.5 h-2.5" />
                        #{rank}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{distro.family}</p>
                </div>
                <ScoreBadge score={score} size="md" />
              </div>

              {/* Description */}
              {distro.description && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                  {distro.description}
                </p>
              )}

              {/* Desktop Environments */}
              {distro.desktopEnvironments && distro.desktopEnvironments.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {distro.desktopEnvironments.slice(0, 4).map((de) => (
                    <DesktopEnvBadge key={de} name={de} size="sm" />
                  ))}
                </div>
              )}

              {/* Performance metrics */}
              {(distro.idleRamUsage || distro.cpuScore || distro.ioScore) && (
                <div className="space-y-2 py-3 border-t border-border/50 mb-4">
                  {distro.idleRamUsage && (
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <HardDrive className="w-3 h-3" /> RAM Idle
                      </p>
                      <MetricBar value={distro.idleRamUsage} maxValue={2000} isBest={false} formatValue={(v) => `${v} MB`} />
                    </div>
                  )}
                  {distro.cpuScore && (
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <Cpu className="w-3 h-3" /> CPU Score
                      </p>
                      <MetricBar value={distro.cpuScore} maxValue={10} isBest={false} formatValue={(v) => `${v}/10`} />
                    </div>
                  )}
                  {distro.ioScore && (
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <Zap className="w-3 h-3" /> I/O Score
                      </p>
                      <MetricBar value={distro.ioScore} maxValue={10} isBest={false} formatValue={(v) => `${v}/10`} />
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Link to={`/distro/${distro.id}`} className="flex-1" onClick={onClose}>
                  <Button className="w-full btn-press" variant="default">
                    {t("comparison.sections.viewDetails") || "Ver detalhes"}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                {distro.website && (
                  <a href={distro.website} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="btn-press">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickPeekModal;
