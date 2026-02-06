import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/ui/score-ring";
import { AssessmentResult } from "@/types/assessment";
import { categoryLabels } from "@/data/questions";
import { generatePDFReport } from "@/lib/pdf-export";
import {
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultsDashboardProps {
  result: AssessmentResult;
  onRestart: () => void;
}

export const ResultsDashboard = ({ result, onRestart }: ResultsDashboardProps) => {
  const getReadinessLabel = () => {
    switch (result.readinessLevel) {
      case "expert":
        return { label: "Interview Ready! 🎉", color: "text-success" };
      case "advanced":
        return { label: "Almost There! 💪", color: "text-primary" };
      case "intermediate":
        return { label: "Making Progress 📈", color: "text-warning" };
      default:
        return { label: "Just Getting Started 🌱", color: "text-accent" };
    }
  };

  const readiness = getReadinessLabel();

  return (
    <section className="min-h-screen py-20">
      <div className="container max-w-4xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Your Assessment Complete
          </motion.div>

          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Your Interview Readiness Score
          </h1>
          <p className={cn("text-xl font-semibold", readiness.color)}>
            {readiness.label}
          </p>
        </motion.div>

        {/* Main Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-card rounded-3xl shadow-soft p-8 md:p-12">
            <ScoreRing score={result.overallScore} size={220} strokeWidth={16} />
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {result.categoryScores.map((cs, index) => (
            <motion.div
              key={cs.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-card rounded-xl shadow-soft p-4 text-center"
            >
              <div className="text-2xl font-bold text-foreground mb-1">
                {cs.score}%
              </div>
              <div className="text-xs text-muted-foreground">
                {categoryLabels[cs.category]}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-card rounded-2xl shadow-soft p-6 md:p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Estimated Prep Time</h3>
              <p className="text-muted-foreground text-sm">
                Time to become interview-ready
              </p>
            </div>
          </div>
          <div className="text-3xl font-bold text-gradient">
            {result.estimatedPrepTime}
          </div>
        </motion.div>

        {/* Category Breakdowns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="space-y-4 mb-8"
        >
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Detailed Breakdown
          </h2>

          {result.categoryScores.map((cs, index) => (
            <motion.div
              key={cs.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="bg-card rounded-xl shadow-soft p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">
                  {categoryLabels[cs.category]}
                </h3>
                <span
                  className={cn(
                    "text-lg font-bold",
                    cs.score >= 70
                      ? "text-success"
                      : cs.score >= 40
                      ? "text-warning"
                      : "text-accent"
                  )}
                >
                  {cs.score}%
                </span>
              </div>

              <p className="text-muted-foreground mb-4">{cs.feedback}</p>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div>
                  <h4 className="text-sm font-medium text-success flex items-center gap-1 mb-2">
                    <CheckCircle className="w-4 h-4" />
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {cs.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-success mt-1">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas to Improve */}
                <div>
                  <h4 className="text-sm font-medium text-accent flex items-center gap-1 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    Areas to Improve
                  </h4>
                  <ul className="space-y-1">
                    {cs.improvements.map((imp, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 md:p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-primary" />
            Your Next Steps
          </h2>
          <ul className="space-y-3">
            {result.nextSteps.map((step, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-full hero-gradient text-primary-foreground text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-foreground">{step}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button variant="outline" onClick={onRestart} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Retake Assessment
          </Button>
          <Button 
            variant="hero" 
            onClick={() => generatePDFReport(result)} 
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF Report
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
