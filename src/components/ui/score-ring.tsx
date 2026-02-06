import { motion } from "framer-motion";

interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export const ScoreRing = ({
  score,
  maxScore = 100,
  size = 200,
  strokeWidth = 12,
  label,
}: ScoreRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (score / maxScore) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  const getScoreColor = () => {
    if (percentage >= 80) return "hsl(160 60% 45%)"; // green
    if (percentage >= 60) return "hsl(173 58% 39%)"; // teal
    if (percentage >= 40) return "hsl(45 93% 47%)"; // yellow
    return "hsl(17 89% 55%)"; // orange/accent
  };

  const getScoreLabel = () => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Developing";
    return "Needs Work";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="hsl(var(--muted))"
          fill="none"
        />
        {/* Animated progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={getScoreColor()}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold text-foreground"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <motion.span
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {label || getScoreLabel()}
        </motion.span>
      </div>
    </div>
  );
};
