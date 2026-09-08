export interface GenerateRoadmapRequest {
  course: string;
  scores: Record<string, number>;
}

export interface GenerateRoadmapResponse {
  weakTopics: string[];
  strongTopics: string[];
  recommendedOrder: string[];
  difficulty: string;
  estimatedStudyHours: number;
  bossBattles: string[];
}

export interface ApiErrorResponse {
  error: string;
  details?: unknown;
}
