import { DifficultyMode } from '../../data/lectureNotesData';

export type LectureAiAction = 'explain_simpler' | 'ask_doubt' | 'summarize_chapter' | 'knowledge_check';

export interface ExplainSimplerRequest {
  action: 'explain_simpler';
  courseTitle: string;
  chapterTitle: string;
  sectionTitle: string;
  content: string;
  difficulty?: DifficultyMode;
}

export interface ExplainSimplerResponse {
  success: boolean;
  simplifiedExplanation: string;
  everydayAnalogy: string;
  keyRule: string;
  source: 'gemini' | 'fallback';
}

export interface AskDoubtRequest {
  action: 'ask_doubt';
  courseTitle: string;
  chapterTitle: string;
  conceptFocus: string;
  studentDoubt: string;
  chapterContext?: string;
  difficulty?: DifficultyMode;
}

export interface AskDoubtResponse {
  success: boolean;
  answer: string;
  example: string;
  examWarning?: string;
  source: 'gemini' | 'fallback';
}

export interface ChapterSummaryRequest {
  action: 'summarize_chapter';
  courseTitle: string;
  chapterTitle: string;
  conceptFocus: string;
  theoryOverview?: string[];
  difficulty?: DifficultyMode;
}

export interface ChapterSummaryResponse {
  success: boolean;
  fiveKeyTakeaways: string[];
  importantFormulas: { name: string; math: string; note: string }[];
  commonMistakes: { mistake: string; correction: string; why: string }[];
  revisionChecklist: { id: string; label: string; details: string }[];
  source: 'gemini' | 'fallback';
}

export interface DynamicKnowledgeCheckItem {
  id: string;
  type: 'mcq' | 'true_false' | 'fill_blank';
  prompt: string;
  options?: string[];
  correctAnswer: number | string | boolean;
  explanation: string;
  blankAnswer?: string;
}

export interface KnowledgeCheckRequest {
  action: 'knowledge_check';
  courseTitle: string;
  chapterTitle: string;
  sectionTitle: string;
  content: string;
  difficulty?: DifficultyMode;
}

export interface KnowledgeCheckResponse {
  success: boolean;
  questions: DynamicKnowledgeCheckItem[];
  source: 'gemini' | 'fallback';
}

export type LectureAiRequest =
  | ExplainSimplerRequest
  | AskDoubtRequest
  | ChapterSummaryRequest
  | KnowledgeCheckRequest;
