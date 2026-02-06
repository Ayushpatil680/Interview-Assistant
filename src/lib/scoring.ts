import {
  AssessmentResult,
  CategoryScore,
  UserAnswers,
  AssessmentCategory,
} from "@/types/assessment";
import { assessmentQuestions, categoryWeights, categoryLabels } from "@/data/questions";

export const calculateResults = (answers: UserAnswers): AssessmentResult => {
  // Group questions by category
  const categoryQuestions: Record<AssessmentCategory, typeof assessmentQuestions> = {
    technical: [],
    resume: [],
    communication: [],
    portfolio: [],
  };

  assessmentQuestions.forEach((q) => {
    categoryQuestions[q.category].push(q);
  });

  // Calculate category scores
  const categoryScores: CategoryScore[] = Object.entries(categoryQuestions).map(
    ([category, questions]) => {
      const maxScore = questions.length * 4;
      const actualScore = questions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
      const percentage = Math.round((actualScore / maxScore) * 100);

      const { feedback, strengths, improvements } = getCategoryFeedback(
        category as AssessmentCategory,
        percentage
      );

      return {
        category: category as AssessmentCategory,
        score: percentage,
        maxScore: 100,
        feedback,
        strengths,
        improvements,
      };
    }
  );

  // Calculate weighted overall score
  const overallScore = Math.round(
    categoryScores.reduce((sum, cs) => {
      return sum + cs.score * categoryWeights[cs.category];
    }, 0)
  );

  // Determine readiness level
  const readinessLevel =
    overallScore >= 80
      ? "expert"
      : overallScore >= 60
      ? "advanced"
      : overallScore >= 40
      ? "intermediate"
      : "beginner";

  // Estimate prep time
  const estimatedPrepTime = getEstimatedPrepTime(overallScore);

  // Generate next steps
  const nextSteps = generateNextSteps(categoryScores);

  return {
    overallScore,
    categoryScores,
    readinessLevel,
    estimatedPrepTime,
    nextSteps,
  };
};

const getCategoryFeedback = (
  category: AssessmentCategory,
  score: number
): { feedback: string; strengths: string[]; improvements: string[] } => {
  const feedbackData: Record<
    AssessmentCategory,
    Record<string, { feedback: string; strengths: string[]; improvements: string[] }>
  > = {
    technical: {
      high: {
        feedback: "Your technical foundation is solid!",
        strengths: [
          "Strong programming fundamentals",
          "Good problem-solving skills",
          "Project experience to showcase",
        ],
        improvements: [
          "Continue practicing advanced algorithms",
          "Explore system design concepts",
        ],
      },
      medium: {
        feedback: "You have a decent technical base with room to grow.",
        strengths: ["Basic programming knowledge", "Some project experience"],
        improvements: [
          "Practice more coding challenges daily",
          "Build 2-3 more substantial projects",
          "Learn data structures in depth",
        ],
      },
      low: {
        feedback: "Focus on building your technical foundation.",
        strengths: ["Willingness to learn", "Starting your journey"],
        improvements: [
          "Master one programming language thoroughly",
          "Complete a structured DSA course",
          "Build beginner-friendly projects",
          "Practice on LeetCode/HackerRank daily",
        ],
      },
    },
    resume: {
      high: {
        feedback: "Your resume is well-polished and professional!",
        strengths: [
          "Strong quantified achievements",
          "Professional formatting",
          "Recent updates",
        ],
        improvements: [
          "Tailor it for specific roles",
          "Add industry-specific keywords",
        ],
      },
      medium: {
        feedback: "Your resume has potential but needs refinement.",
        strengths: ["Basic structure in place", "Some relevant experience"],
        improvements: [
          "Add metrics to all achievements",
          "Get professional review",
          "Update with recent projects",
        ],
      },
      low: {
        feedback: "Your resume needs significant attention.",
        strengths: ["Starting point identified", "Room for improvement"],
        improvements: [
          "Create or completely revamp your resume",
          "Use action verbs and metrics",
          "Seek professional feedback",
          "Research industry-standard formats",
        ],
      },
    },
    communication: {
      high: {
        feedback: "Excellent communication skills for interviews!",
        strengths: [
          "Clear technical explanations",
          "Strong behavioral responses",
          "Compelling career narrative",
        ],
        improvements: [
          "Practice with different interviewers",
          "Prepare for edge-case questions",
        ],
      },
      medium: {
        feedback: "Good communication foundation to build upon.",
        strengths: ["Can explain concepts", "Some interview practice"],
        improvements: [
          "Practice STAR method for behavioral questions",
          "Record yourself explaining concepts",
          "Do mock interviews with feedback",
        ],
      },
      low: {
        feedback: "Communication skills need development.",
        strengths: ["Self-awareness of gaps", "Opportunity to improve"],
        improvements: [
          "Practice explaining projects out loud",
          "Study STAR interview method",
          "Join mock interview groups",
          "Work on articulating your goals",
        ],
      },
    },
    portfolio: {
      high: {
        feedback: "Outstanding online presence and portfolio!",
        strengths: [
          "Professional GitHub/portfolio",
          "Well-documented projects",
          "Strong project variety",
        ],
        improvements: [
          "Add case studies with impact metrics",
          "Contribute to open source",
        ],
      },
      medium: {
        feedback: "You have online presence but can enhance it.",
        strengths: ["Some projects visible", "Basic documentation"],
        improvements: [
          "Add detailed READMEs with screenshots",
          "Create a portfolio website",
          "Showcase your best 3-5 projects prominently",
        ],
      },
      low: {
        feedback: "Building an online presence is crucial.",
        strengths: ["Clean slate to work with", "Can curate intentionally"],
        improvements: [
          "Create GitHub profile with pinned repos",
          "Document all projects thoroughly",
          "Build a simple portfolio site",
          "Add live demos where possible",
        ],
      },
    },
  };

  const level = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
  return feedbackData[category][level];
};

const getEstimatedPrepTime = (score: number): string => {
  if (score >= 80) return "1-2 weeks";
  if (score >= 60) return "3-4 weeks";
  if (score >= 40) return "6-8 weeks";
  return "2-3 months";
};

const generateNextSteps = (categoryScores: CategoryScore[]): string[] => {
  const sortedCategories = [...categoryScores].sort((a, b) => a.score - b.score);
  const steps: string[] = [];

  // Focus on weakest areas first
  sortedCategories.slice(0, 2).forEach((cs) => {
    if (cs.improvements.length > 0) {
      steps.push(cs.improvements[0]);
    }
  });

  // Add general advice
  steps.push("Schedule mock interviews to practice");
  steps.push("Set a target application date and work backwards");

  return steps.slice(0, 4);
};
