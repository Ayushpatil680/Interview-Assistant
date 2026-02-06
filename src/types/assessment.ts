export interface AssessmentQuestion {
  id: string;
  category: AssessmentCategory;
  question: string;
  options: AssessmentOption[];
}

export interface AssessmentOption {
  label: string;
  value: number;
  description?: string;
}

export type AssessmentCategory =
  | "technical"
  | "resume"
  | "communication"
  | "portfolio";

export interface CategoryScore {
  category: AssessmentCategory;
  score: number;
  maxScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface AssessmentResult {
  overallScore: number;
  categoryScores: CategoryScore[];
  readinessLevel: "beginner" | "intermediate" | "advanced" | "expert";
  estimatedPrepTime: string;
  nextSteps: string[];
}

export interface UserAnswers {
  [questionId: string]: number;
}
