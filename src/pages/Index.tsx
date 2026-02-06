import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { AssessmentFlow } from "@/components/AssessmentFlow";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { assessmentQuestions } from "@/data/questions";
import { calculateResults } from "@/lib/scoring";
import { UserAnswers, AssessmentResult } from "@/types/assessment";

type AppState = "hero" | "assessment" | "results";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("hero");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);

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
    setAppState("results");
  };

  const handleRestart = () => {
    setAppState("hero");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
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
