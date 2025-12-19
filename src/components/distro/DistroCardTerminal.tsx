import { Distro } from "@/types";
import { Link } from "react-router-dom";
import { Terminal, Minimize2, Maximize2, X } from "lucide-react";
import { calculatePerformanceScore } from "@/utils/scoreCalculation";

interface DistroCardTerminalProps {
  distro: Distro;
  isSelected?: boolean;
  onSelectToggle?: () => void;
  showCheckbox?: boolean;
}

const DistroCardTerminal = ({
  distro,
  isSelected = false,
  onSelectToggle,
  showCheckbox = true,
}: DistroCardTerminalProps) => {
  const score = calculatePerformanceScore(distro);

  const getTerminalColor = () => {
    if (score === 0) return "border-gray-500";
    if (score > 80) return "border-green-500";
    if (score > 60) return "border-yellow-500";
    return "border-red-500";
  };

  const getTerminalTheme = (distroName: string): string => {
    const themes: { [key: string]: string } = {
      ubuntu: "bg-[#300a24]",
      debian: "bg-[#0d1117]",
      fedora: "bg-[#1a1d23]",
      arch: "bg-[#1a1b26]",
      mint: "bg-[#0f2419]",
      manjaro: "bg-[#1a1d1a]",
      pop: "bg-[#1d2021]",
      elementary: "bg-[#0f1419]",
      zorin: "bg-[#1e1e2e]",
      endeavour: "bg-[#1c1c2e]",
    };
    
    const key = distroName.toLowerCase().split(" ")[0];
    return themes[key] || "bg-[#0d1117]";
  };

  const formatCommand = (label: string, value: string | number | undefined) => {
    if (!value) return null;
    return (
      <div className="font-mono text-xs">
        <span className="text-green-400">$</span>{" "}
        <span className="text-blue-300">{label}</span>:{" "}
        <span className="text-gray-300">{value}</span>
      </div>
    );
  };

  return (
    <div
      className={`relative ${getTerminalTheme(distro.name)} border-2 ${getTerminalColor()} rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      {/* Terminal Header */}
      <div className="bg-gray-800/50 border-b border-gray-700/50 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer" />
          </div>
          <Terminal className="w-3.5 h-3.5 text-gray-400 ml-2" />
          <span className="text-xs text-gray-400 font-mono">{distro.id}@distrowiki</span>
        </div>
        <div className="flex items-center gap-2">
          {showCheckbox && onSelectToggle && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onSelectToggle();
              }}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                isSelected
                  ? "bg-primary border-primary"
                  : "border-gray-500 hover:border-gray-400"
              }`}
            >
              {isSelected && <span className="text-white text-xs">✓</span>}
            </button>
          )}
        </div>
      </div>

      {/* Terminal Content */}
      <Link to={`/distro/${distro.id}`} className="block">
        <div className="p-4 space-y-2 min-h-[200px]">
          {/* Header Info */}
          <div className="font-mono text-xs mb-3">
            <span className="text-green-400">┌──(</span>
            <span className="text-blue-400">{distro.name}</span>
            <span className="text-green-400">)-[</span>
            <span className="text-purple-400">~</span>
            <span className="text-green-400">]</span>
          </div>

          {/* System Info */}
          <div className="space-y-1">
            {formatCommand("neofetch --version", distro.lastRelease || "N/A")}
            {formatCommand("cat /etc/os-release | grep PRETTY_NAME", distro.family)}
            
            {distro.desktopEnvironments && distro.desktopEnvironments.length > 0 && (
              <div className="font-mono text-xs">
                <span className="text-green-400">$</span>{" "}
                <span className="text-blue-300">echo $XDG_CURRENT_DESKTOP</span>:{" "}
                <span className="text-gray-300">
                  {distro.desktopEnvironments.slice(0, 2).join(", ")}
                  {distro.desktopEnvironments.length > 2 && ` +${distro.desktopEnvironments.length - 2}`}
                </span>
              </div>
            )}

            {distro.packageManager && (
              formatCommand("which pkg-manager", distro.packageManager)
            )}

            {/* Performance Stats */}
            {(distro.idleRamUsage || distro.cpuScore || distro.ioScore) && (
              <>
                <div className="font-mono text-xs pt-2 border-t border-gray-700/30 mt-2">
                  <span className="text-yellow-400">## Performance Metrics</span>
                </div>
                {distro.idleRamUsage && formatCommand("free -m | grep Mem", `${distro.idleRamUsage}MB idle`)}
                {distro.cpuScore && formatCommand("sysbench cpu --score", distro.cpuScore.toFixed(1))}
                {distro.ioScore && formatCommand("sysbench io --score", distro.ioScore.toFixed(1))}
              </>
            )}

            {/* Score Badge */}
            <div className="font-mono text-xs pt-2 border-t border-gray-700/30 mt-2">
              <span className="text-green-400">$</span>{" "}
              <span className="text-blue-300">./calculate_score.sh</span>
              <div className="ml-2 mt-1">
                <span className={`font-bold ${
                  score === 0 ? "text-gray-400" :
                  score > 80 ? "text-green-400" :
                  score > 60 ? "text-yellow-400" : "text-red-400"
                }`}>
                  Score: {score.toFixed(1)}/100
                </span>
                {score > 0 && (
                  <span className="text-gray-500 ml-2">
                    [{"█".repeat(Math.floor(score / 10))}{"░".repeat(10 - Math.floor(score / 10))}]
                  </span>
                )}
              </div>
            </div>

            {/* Blinking Cursor */}
            <div className="font-mono text-xs pt-1">
              <span className="text-green-400">└─$</span>
              <span className="inline-block w-2 h-3 bg-green-400 ml-1 animate-pulse" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DistroCardTerminal;
