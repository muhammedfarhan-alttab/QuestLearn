// Lecture Notes Progress Tracking & LocalStorage Persistence
export type DifficultyMode = 'beginner' | 'intermediate' | 'advanced';

export interface ChapterProgressState {
  readSectionIds: string[];
  answeredQuizIds: string[];
  correctQuizIds: string[];
  masteredFlashcardIds: string[];
  completedChecklistIds: string[];
  notesReadClaimed: boolean;
  flashcardDeckClaimed: boolean;
  summaryReviewedClaimed: boolean;
  lastUpdated: string;
}

const STORAGE_PREFIX = 'questlearn_lecture_progress_';
const DIFFICULTY_KEY = 'questlearn_lecture_difficulty';

export function getStorageKey(courseId: string, stageNumber: number): string {
  return `${STORAGE_PREFIX}${courseId}_s${stageNumber}`;
}

export function loadChapterProgress(courseId: string, stageNumber: number): ChapterProgressState {
  if (typeof window === 'undefined') {
    return createEmptyProgressState();
  }

  try {
    const raw = localStorage.getItem(getStorageKey(courseId, stageNumber));
    if (!raw) return createEmptyProgressState();
    const parsed = JSON.parse(raw);
    return {
      readSectionIds: Array.isArray(parsed.readSectionIds) ? parsed.readSectionIds : [],
      answeredQuizIds: Array.isArray(parsed.answeredQuizIds) ? parsed.answeredQuizIds : [],
      correctQuizIds: Array.isArray(parsed.correctQuizIds) ? parsed.correctQuizIds : [],
      masteredFlashcardIds: Array.isArray(parsed.masteredFlashcardIds) ? parsed.masteredFlashcardIds : [],
      completedChecklistIds: Array.isArray(parsed.completedChecklistIds) ? parsed.completedChecklistIds : [],
      notesReadClaimed: Boolean(parsed.notesReadClaimed),
      flashcardDeckClaimed: Boolean(parsed.flashcardDeckClaimed),
      summaryReviewedClaimed: Boolean(parsed.summaryReviewedClaimed),
      lastUpdated: parsed.lastUpdated || new Date().toISOString()
    };
  } catch {
    return createEmptyProgressState();
  }
}

export function saveChapterProgress(courseId: string, stageNumber: number, state: ChapterProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    const updated = { ...state, lastUpdated: new Date().toISOString() };
    localStorage.setItem(getStorageKey(courseId, stageNumber), JSON.stringify(updated));
  } catch (e) {
    console.warn('[LectureStorage] Failed to save progress to localStorage', e);
  }
}

export function createEmptyProgressState(): ChapterProgressState {
  return {
    readSectionIds: [],
    answeredQuizIds: [],
    correctQuizIds: [],
    masteredFlashcardIds: [],
    completedChecklistIds: [],
    notesReadClaimed: false,
    flashcardDeckClaimed: false,
    summaryReviewedClaimed: false,
    lastUpdated: new Date().toISOString()
  };
}

export function markSectionRead(
  courseId: string,
  stageNumber: number,
  sectionId: string
): ChapterProgressState {
  const current = loadChapterProgress(courseId, stageNumber);
  if (!current.readSectionIds.includes(sectionId)) {
    current.readSectionIds.push(sectionId);
    saveChapterProgress(courseId, stageNumber, current);
  }
  return current;
}

export function recordQuizAnswer(
  courseId: string,
  stageNumber: number,
  quizId: string,
  isCorrect: boolean
): ChapterProgressState {
  const current = loadChapterProgress(courseId, stageNumber);
  if (!current.answeredQuizIds.includes(quizId)) {
    current.answeredQuizIds.push(quizId);
  }
  if (isCorrect && !current.correctQuizIds.includes(quizId)) {
    current.correctQuizIds.push(quizId);
  }
  saveChapterProgress(courseId, stageNumber, current);
  return current;
}

export function recordFlashcardMastered(
  courseId: string,
  stageNumber: number,
  flashcardId: string
): ChapterProgressState {
  const current = loadChapterProgress(courseId, stageNumber);
  if (!current.masteredFlashcardIds.includes(flashcardId)) {
    current.masteredFlashcardIds.push(flashcardId);
    saveChapterProgress(courseId, stageNumber, current);
  }
  return current;
}

export function toggleChecklistItem(
  courseId: string,
  stageNumber: number,
  checkId: string
): ChapterProgressState {
  const current = loadChapterProgress(courseId, stageNumber);
  const idx = current.completedChecklistIds.indexOf(checkId);
  if (idx >= 0) {
    current.completedChecklistIds.splice(idx, 1);
  } else {
    current.completedChecklistIds.push(checkId);
  }
  saveChapterProgress(courseId, stageNumber, current);
  return current;
}

export function calculateCompletionPercentage(
  progress: ChapterProgressState,
  totalSections: number,
  totalQuizzes: number,
  totalFlashcards: number
): {
  readingPct: number;
  quizPct: number;
  flashcardPct: number;
  overallPct: number;
} {
  const safeSections = totalSections > 0 ? totalSections : 1;
  const safeQuizzes = totalQuizzes > 0 ? totalQuizzes : 1;
  const safeFlashcards = totalFlashcards > 0 ? totalFlashcards : 1;

  const readingPct = Math.min(100, Math.round((progress.readSectionIds.length / safeSections) * 100));
  const quizPct = Math.min(100, Math.round((progress.correctQuizIds.length / safeQuizzes) * 100));
  const flashcardPct = Math.min(100, Math.round((progress.masteredFlashcardIds.length / safeFlashcards) * 100));

  // Weighted overall: 40% Reading, 35% Quizzes, 25% Flashcards
  const overallPct = Math.min(
    100,
    Math.round(readingPct * 0.4 + quizPct * 0.35 + flashcardPct * 0.25)
  );

  return { readingPct, quizPct, flashcardPct, overallPct };
}

export function loadPreferredDifficulty(): DifficultyMode {
  if (typeof window === 'undefined') return 'intermediate';
  try {
    const raw = localStorage.getItem(DIFFICULTY_KEY);
    if (raw === 'beginner' || raw === 'intermediate' || raw === 'advanced') {
      return raw;
    }
    return 'intermediate';
  } catch {
    return 'intermediate';
  }
}

export function savePreferredDifficulty(mode: DifficultyMode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DIFFICULTY_KEY, mode);
  } catch (e) {
    console.warn('[LectureStorage] Failed to save preferred difficulty', e);
  }
}
