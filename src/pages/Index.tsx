import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { AssessmentFlow } from "@/components/AssessmentFlow";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { HistoryPanel } from "@/components/HistoryPanel";
import { assessmentQuestions } from "@/data/questions";
import { calculateResults } from "@/lib/scoring";
import { saveToHistory, getHistory, HistoryEntry } from "@/lib/history";
import { UserAnswers, AssessmentResult } from "@/types/assessment";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

type AppState = "hero" | "assessment" | "results";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("hero");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleStartAssessment = () => {
    setAppState("assessment");
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const calculatedResult = calculateResults(answers);
    setResult(calculatedResult);
    
    // Save to history
    saveToHistory(calculatedResult);
    setHistory(getHistory());
    
    setAppState("results");
  };

  const handleRestart = () => {
    setAppState("hero");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
  };

  const handleSelectHistoryEntry = (entry: HistoryEntry) => {
    setResult(entry.result);
    setAppState("results");
    setIsHistoryOpen(false);
  };

  const handleHistoryCleared = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* History Button - Always visible */}
      {history.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsHistoryOpen(true)}
          className="fixed top-4 right-4 z-30 gap-2 shadow-soft"
        >
          <History className="w-4 h-4" />
          <span className="hidden sm:inline">History</span>
          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
            {history.length}
          </span>
        </Button>
      )}

      {/* History Panel */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectEntry={handleSelectHistoryEntry}
        onHistoryCleared={handleHistoryCleared}
      />

      {appState === "hero" && <HeroSection onStart={handleStartAssessment} />}

      {appState === "assessment" && (
        <AssessmentFlow
          questions={assessmentQuestions}
          currentIndex={currentQuestionIndex}
          answers={answers}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
        />
      )}

      {appState === "results" && result && (
        <ResultsDashboard result={result} onRestart={handleRestart} />
      )}
    </div>
  );
};

export default Index;
