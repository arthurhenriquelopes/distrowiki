interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

const ScoreBadge = ({ score, size = "md" }: ScoreBadgeProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 9) return "bg-success text-success-foreground";
    if (score >= 8) return "bg-primary text-primary-foreground";
    if (score >= 7) return "bg-warning text-warning-foreground";
    return "bg-secondary text-secondary-foreground";
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-lg px-4 py-2",
  };

  return (
    <div
      className={`inline-flex items-center justify-center font-bold rounded-lg ${getScoreColor(
        score
      )} ${sizeClasses[size]} smooth-transition`}
    >
      {score.toFixed(1)}
    </div>
  );
};

export default ScoreBadge;
