// Types for Practical Models & Simulation AI Integration

export type LabAiAction = 'configure_lab' | 'explain_interaction' | 'generate_challenge';

export interface LabAiRequest {
  action: LabAiAction;
  courseId: string;
  stageNumber: number;
  subtopicName: string;
  modelType: string;
  currentParams?: Record<string, number>;
  previousParams?: Record<string, number>;
  derivedMetrics?: Record<string, number>;
  studentPrompt?: string;
}

export interface LabAiConfigureResponse {
  success: boolean;
  modelType: string;
  title: string;
  learningGoals: string[];
  guidedTasks: Array<{
    id: string;
    title: string;
    instruction: string;
    hint: string;
    targetMetric: string;
    targetValue: number;
    tolerance: number;
    rewardXp: number;
    rewardGeo: number;
  }>;
  whatIfPrompts: string[];
  source: 'ai' | 'fallback';
}

export interface LabAiExplainResponse {
  success: boolean;
  explanation: string;
  physicalReason: string;
  realWorldAnalogy: string;
  source: 'ai' | 'fallback';
}

export interface LabAiChallengeResponse {
  success: boolean;
  challenge: {
    id: string;
    title: string;
    instruction: string;
    hint: string;
    targetMetric: string;
    targetValue: number;
    tolerance: number;
    rewardXp: number;
    rewardGeo: number;
  };
  source: 'ai' | 'fallback';
}

export type LabAiResponse =
  | LabAiConfigureResponse
  | LabAiExplainResponse
  | LabAiChallengeResponse
  | { success: false; error: string };
