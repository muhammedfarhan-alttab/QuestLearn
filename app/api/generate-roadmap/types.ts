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

export interface GeneratedWorldStageData {
  stageNumber: number;
  name: string;
  conceptFocus: string;
  realmLocation?: string;
  kanji?: string;
  lore?: string;
  tier: 'easy' | 'intermediate' | 'hard';
  isRemediation?: boolean;
  targetedMisconception?: string;
  aiRationale?: string;
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
  worldStages?: GeneratedWorldStageData[];
  aiAnalysisSummary?: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: unknown;
}
