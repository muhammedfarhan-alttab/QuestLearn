export interface StudentAnswerItem {
  question: string;
  concept: string;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
}

export interface GenerateRoadmapRequest {
  course: string;
  scores: Record<string, number>;
  overallScore?: number;
  weakTopics?: string[];
  strongTopics?: string[];
  answers?: StudentAnswerItem[];
}

export interface GenerateRoadmapResponse {
  strengths: string[];
  weaknesses: string[];
  strongTopics: string[];
  weakTopics: string[];
  recommendedOrder: string[];
  difficulty: string;
  estimatedStudyHours: number;
  bossBattles: string[];
  aiAnalysisSummary?: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: unknown;
}
