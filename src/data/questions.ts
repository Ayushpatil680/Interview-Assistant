import { AssessmentQuestion } from "@/types/assessment";

export const assessmentQuestions: AssessmentQuestion[] = [
  // Technical Skills (4 questions)
  {
    id: "tech-1",
    category: "technical",
    question: "How would you rate your proficiency in your primary programming language?",
    options: [
      { label: "Beginner", value: 1, description: "Learning basics" },
      { label: "Intermediate", value: 2, description: "Can build simple projects" },
      { label: "Advanced", value: 3, description: "Comfortable with complex problems" },
      { label: "Expert", value: 4, description: "Deep understanding, can optimize" },
    ],
  },
  {
    id: "tech-2",
    category: "technical",
    question: "How prepared are you for data structures & algorithms questions?",
    options: [
      { label: "Not at all", value: 1, description: "Haven't studied them" },
      { label: "Somewhat", value: 2, description: "Know the basics" },
      { label: "Well prepared", value: 3, description: "Practiced regularly" },
      { label: "Very confident", value: 4, description: "Solved 100+ problems" },
    ],
  },
  {
    id: "tech-3",
    category: "technical",
    question: "How many technical projects have you completed?",
    options: [
      { label: "None", value: 1, description: "No projects yet" },
      { label: "1-2 projects", value: 2, description: "Some experience" },
      { label: "3-5 projects", value: 3, description: "Good experience" },
      { label: "6+ projects", value: 4, description: "Extensive experience" },
    ],
  },

  // Resume (3 questions)
  {
    id: "resume-1",
    category: "resume",
    question: "How recently have you updated your resume?",
    options: [
      { label: "Never created one", value: 1, description: "Need to start" },
      { label: "Over 6 months ago", value: 2, description: "Needs updating" },
      { label: "1-6 months ago", value: 3, description: "Fairly recent" },
      { label: "Within last month", value: 4, description: "Up to date" },
    ],
  },
  {
    id: "resume-2",
    category: "resume",
    question: "Does your resume include quantifiable achievements?",
    options: [
      { label: "No metrics", value: 1, description: "Only job descriptions" },
      { label: "Few metrics", value: 2, description: "1-2 numbers" },
      { label: "Some metrics", value: 3, description: "Most bullet points" },
      { label: "Data-driven", value: 4, description: "All achievements quantified" },
    ],
  },
  {
    id: "resume-3",
    category: "resume",
    question: "Has your resume been reviewed by professionals?",
    options: [
      { label: "Never", value: 1, description: "No feedback received" },
      { label: "Friends/Family", value: 2, description: "Informal review" },
      { label: "Career center", value: 3, description: "Professional review" },
      { label: "Industry experts", value: 4, description: "Multiple reviews" },
    ],
  },

  // Communication (3 questions)
  {
    id: "comm-1",
    category: "communication",
    question: "How comfortable are you explaining technical concepts?",
    options: [
      { label: "Very uncomfortable", value: 1, description: "Struggle to explain" },
      { label: "Somewhat comfortable", value: 2, description: "Can explain basics" },
      { label: "Comfortable", value: 3, description: "Clear explanations" },
      { label: "Very confident", value: 4, description: "Excellent communicator" },
    ],
  },
  {
    id: "comm-2",
    category: "communication",
    question: "Have you practiced answering behavioral interview questions?",
    options: [
      { label: "Never", value: 1, description: "Haven't practiced" },
      { label: "Read about them", value: 2, description: "Theoretical knowledge" },
      { label: "Practiced alone", value: 3, description: "Self-practice" },
      { label: "Mock interviews", value: 4, description: "With real feedback" },
    ],
  },
  {
    id: "comm-3",
    category: "communication",
    question: "How well can you articulate your career goals?",
    options: [
      { label: "Unclear", value: 1, description: "Still figuring out" },
      { label: "General idea", value: 2, description: "Vague direction" },
      { label: "Clear goals", value: 3, description: "Defined objectives" },
      { label: "Strong vision", value: 4, description: "Compelling narrative" },
    ],
  },

  // Portfolio (2 questions)
  {
    id: "port-1",
    category: "portfolio",
    question: "Do you have an online portfolio or GitHub profile?",
    options: [
      { label: "No", value: 1, description: "Nothing online" },
      { label: "Basic profile", value: 2, description: "Few repositories" },
      { label: "Good portfolio", value: 3, description: "Showcases projects" },
      { label: "Professional", value: 4, description: "Impressive presence" },
    ],
  },
  {
    id: "port-2",
    category: "portfolio",
    question: "How well documented are your projects?",
    options: [
      { label: "No documentation", value: 1, description: "Just code" },
      { label: "Basic READMEs", value: 2, description: "Minimal docs" },
      { label: "Good documentation", value: 3, description: "Clear explanations" },
      { label: "Excellent", value: 4, description: "Demos, screenshots, details" },
    ],
  },
];

export const categoryWeights: Record<string, number> = {
  technical: 0.30,
  resume: 0.25,
  communication: 0.25,
  portfolio: 0.20,
};

export const categoryLabels: Record<string, string> = {
  technical: "Technical Skills",
  resume: "Resume Quality",
  communication: "Communication",
  portfolio: "Portfolio & Projects",
};
