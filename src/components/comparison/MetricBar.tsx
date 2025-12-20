import { useRef, useState, useEffect, memo } from "react";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricBarProps {
  value: number | undefined | null;
  maxValue: number;
  isBest: boolean;
  formatValue: (v: number) => string;
  delay?: number;
  /** Skip animation entirely for performance */
  skipAnimation?: boolean;
}

/**
 * Barra de progresso com animação.
 * Anima uma vez quando se torna visível pela primeira vez.
 */
export const MetricBar = memo(({ 
  value, 
  maxValue, 
  isBest, 
  formatValue, 
  delay = 0,
  skipAnimation = false
}: MetricBarProps) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(skipAnimation);
  
  const percentage = value ? Math.min((value / maxValue) * 100, 100) : 0;

  useEffect(() => {
    if (skipAnimation || hasAnimated || !barRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Trigger animation
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(barRef.current);
    return () => observer.disconnect();
  }, [skipAnimation, hasAnimated]);

  return (
    <div className="space-y-1.5" ref={barRef}>
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
          <div
            className={cn(
              "h-2 rounded-full",
              isBest ? "bg-green-500" : "bg-primary/70"
            )}
            style={{
              width: hasAnimated ? `${percentage}%` : "0%",
              transitionProperty: "width",
              transitionDuration: skipAnimation ? "0ms" : "800ms",
              transitionDelay: skipAnimation ? "0ms" : `${delay * 1000}ms`,
              transitionTimingFunction: "ease-out"
            }}
          />
        </div>
      )}
    </div>
  );
});

MetricBar.displayName = "MetricBar";

export default MetricBar;
