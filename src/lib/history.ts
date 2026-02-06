import { AssessmentResult } from "@/types/assessment";

export interface HistoryEntry {
  id: string;
  date: string;
  result: AssessmentResult;
}

const STORAGE_KEY = "interview-readiness-history";

export const saveToHistory = (result: AssessmentResult): HistoryEntry => {
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    result,
  };

  const history = getHistory();
  history.unshift(entry); // Add to beginning
  
  // Keep only last 20 entries
  const trimmedHistory = history.slice(0, 20);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  
  return entry;
};

export const getHistory = (): HistoryEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getScoreTrend = (history: HistoryEntry[]): "up" | "down" | "stable" | null => {
  if (history.length < 2) return null;
  
  const latest = history[0].result.overallScore;
  const previous = history[1].result.overallScore;
  
  if (latest > previous + 5) return "up";
  if (latest < previous - 5) return "down";
  return "stable";
};

export const formatDate = (isoDate: string): string => {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

