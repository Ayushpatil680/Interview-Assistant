import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { AssessmentQuestion, UserAnswers } from "@/types/assessment";
import { categoryLabels } from "@/data/questions";
import { cn } from "@/lib/utils";

interface AssessmentFlowProps {
  questions: AssessmentQuestion[];
  currentIndex: number;
  answers: UserAnswers;
  onAnswer: (questionId: string, value: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
}

export const AssessmentFlow = ({
  questions,
  currentIndex,
  answers,
  onAnswer,
  onNext,
  onPrevious,
  onSubmit,
}: AssessmentFlowProps) => {
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;
  const hasCurrentAnswer = answers[currentQuestion.id] !== undefined;

  return (
    <section className="min-h-screen flex items-center justify-center py-20">
      <div className="container max-w-2xl px-4">
        {/* Progress Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-primary">
              {categoryLabels[currentQuestion.category]}
            </span>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl shadow-soft p-8 md:p-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentQuestion.id] === option.value;
                return (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => onAnswer(currentQuestion.id, option.value)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-glow"
                        : "border-border hover:border-primary/50 bg-background"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        )}
                      >
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{option.label}</p>
                        {option.description && (
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mt-8"
        >
          <Button
            variant="ghost"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          {isLastQuestion ? (
            <Button
              variant="hero"
              size="lg"
              onClick={onSubmit}
              disabled={!hasCurrentAnswer}
              className="gap-2"
            >
              Get My Results
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={onNext}
              disabled={!hasCurrentAnswer}
              className="gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
};
