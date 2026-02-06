import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HistoryEntry, formatDate, getScoreTrend, clearHistory } from "@/lib/history";
import { categoryLabels } from "@/data/questions";
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Trash2, 
  History,
  ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onSelectEntry: (entry: HistoryEntry) => void;
  onHistoryCleared: () => void;
}

export const HistoryPanel = ({
  isOpen,
  onClose,
  history,
  onSelectEntry,
  onHistoryCleared,
}: HistoryPanelProps) => {
  const trend = getScoreTrend(history);

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      clearHistory();
      onHistoryCleared();
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-success" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-accent" />;
      case "stable":
        return <Minus className="w-4 h-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getTrendMessage = () => {
    switch (trend) {
      case "up":
        return "You're improving! Great progress.";
      case "down":
        return "Score dropped. Keep practicing!";
      case "stable":
        return "Consistent performance.";
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center">
                  <History className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground">Your Progress</h2>
                  <p className="text-sm text-muted-foreground">
                    {history.length} assessment{history.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Trend indicator */}
            {trend && (
              <div className="px-6 py-4 bg-muted/50 flex items-center gap-2">
                {getTrendIcon()}
                <span className="text-sm text-muted-foreground">{getTrendMessage()}</span>
              </div>
            )}

            {/* History list */}
            <div className="flex-1 overflow-y-auto p-6">
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No assessments yet</p>
                  <p className="text-sm text-muted-foreground/70">
                    Complete an assessment to see your history
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((entry, index) => {
                    const prevScore = history[index + 1]?.result.overallScore;
                    const scoreDiff = prevScore
                      ? entry.result.overallScore - prevScore
                      : null;

                    return (
                      <motion.button
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onSelectEntry(entry)}
                        className="w-full text-left p-4 rounded-xl border border-border bg-background hover:border-primary/50 transition-all group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-muted-foreground">
                            {formatDate(entry.date)}
                          </span>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-2xl font-bold",
                                entry.result.overallScore >= 70
                                  ? "text-success"
                                  : entry.result.overallScore >= 40
                                  ? "text-warning"
                                  : "text-accent"
                              )}
                            >
                              {entry.result.overallScore}
                            </span>
                            {scoreDiff !== null && scoreDiff !== 0 && (
                              <span
                                className={cn(
                                  "text-xs font-medium px-2 py-0.5 rounded-full",
                                  scoreDiff > 0
                                    ? "bg-success/10 text-success"
                                    : "bg-accent/10 text-accent"
                                )}
                              >
                                {scoreDiff > 0 ? "+" : ""}
                                {scoreDiff}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 mb-3">
                          {entry.result.categoryScores.map((cs) => (
                            <div key={cs.category} className="text-center">
                              <div className="text-xs text-muted-foreground mb-1">
                                {categoryLabels[cs.category].split(" ")[0]}
                              </div>
                              <div className="text-sm font-medium text-foreground">
                                {cs.score}%
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-sm text-primary group-hover:text-primary/80">
                          <span>View details</span>
                          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {history.length > 0 && (
              <div className="p-6 border-t border-border">
                <Button
                  variant="ghost"
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleClearHistory}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear History
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
