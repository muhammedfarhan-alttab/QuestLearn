export interface ReferenceQuestionItem {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface GenerateQuestionsRequest {
  topic: string;
  difficulty: 'easy' | 'intermediate' | 'hard' | string;
  previousPerformance?: {
    accuracy?: number;
    score?: number;
    streak?: number;
    attempts?: number;
  };
  strengths?: string[];
  weaknesses?: string[];
  diagnosticSkillLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  diagnosticScore?: number;
  courseId?: string;
  courseTitle?: string;
  stageNumber?: number;
  attempt?: number;
  referenceQuestions?: ReferenceQuestionItem[];
}

export interface GeneratedQuestion {
  id: string;
  courseId?: string;
  stageNumber?: number;
  subtopicName?: string;
  question: string;
  options: string[];
  answer: number; // 0 to 3
  explanation: string;
  difficulty: 'easy' | 'intermediate' | 'hard';
  rewardXp: number;
  rewardGeo: number;
}

export interface GenerateQuestionsResponse {
  questions: GeneratedQuestion[];
  topic: string;
  difficulty: string;
  source: 'gemini' | 'cache' | 'fallback';
  attempt?: number;
}
