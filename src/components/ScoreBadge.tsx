interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

const ScoreBadge = ({ score, size = "md" }: ScoreBadgeProps) => {
  const getScoreColor = (score: number) => {
    if (score === 0) return "bg-secondary text-secondary-foreground";
    if (score > 80) return "bg-success text-success-foreground";
    if (score > 60) return "bg-warning text-warning-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-lg px-4 py-2",
  };

  return (
    <div
      className={`inline-flex items-center justify-center font-bold ${getScoreColor(
        score
      )} ${sizeClasses[size]} smooth-transition border border-white/10`}
    >
      {score.toFixed(1)}
    </div>
  );
};

export default ScoreBadge;
