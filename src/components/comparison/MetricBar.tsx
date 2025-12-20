import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricBarProps {
  value: number | undefined | null;
  maxValue: number;
  isBest: boolean;
  formatValue: (v: number) => string;
  delay?: number;
}

/**
 * Barra de progresso animada para métricas de comparação.
 * Elimina duplicação de código entre RAM, CPU e I/O.
 */
export const MetricBar = ({ 
  value, 
  maxValue, 
  isBest, 
  formatValue, 
  delay = 0 
}: MetricBarProps) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className={cn(
          "text-sm font-medium",
          isBest && "text-green-500"
        )}>
          {value ? formatValue(value) : "N/A"}
        </span>
        {isBest && <Trophy className="w-3.5 h-3.5 text-green-500" />}
      </div>
      {value && (
        <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
          <motion.div
            className={cn(
              "h-2 rounded-full",
              isBest ? "bg-green-500" : "bg-primary/70"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((value / maxValue) * 100, 100)}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay }}
          />
        </div>
      )}
    </div>
  );
};

export default MetricBar;
