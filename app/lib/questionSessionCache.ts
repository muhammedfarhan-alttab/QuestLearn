import { GeneratedQuestion } from '../api/generate-questions/types';

// In-memory fallback if sessionStorage is not accessible (e.g. during SSR or private mode restrictions)
const memoryCache: Record<string, GeneratedQuestion[]> = {};

function buildCacheKey(courseId: string, stageNumber: number, attempt: number = 1): string {
  return `questlearn_q_cache_${courseId}_stage_${stageNumber}_att_${attempt}`;
}

/**
 * Retrieves cached questions for the current session.
 */
export function getCachedStageQuestions(
  courseId: string,
  stageNumber: number,
  attempt: number = 1
): GeneratedQuestion[] | null {
  const key = buildCacheKey(courseId, stageNumber, attempt);

  // 1. Check in-memory cache
  if (memoryCache[key] && Array.isArray(memoryCache[key]) && memoryCache[key].length > 0) {
    return memoryCache[key];
  }

  // 2. Check browser sessionStorage
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const stored = window.sessionStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryCache[key] = parsed;
          return parsed;
        }
      }
    } catch {
      // Fallback silently if sessionStorage is blocked
    }
  }

  return null;
}

/**
 * Caches generated questions for the current session.
 */
export function setCachedStageQuestions(
  courseId: string,
  stageNumber: number,
  questions: GeneratedQuestion[],
  attempt: number = 1
): void {
  if (!Array.isArray(questions) || questions.length === 0) return;

  const key = buildCacheKey(courseId, stageNumber, attempt);

  // 1. Store in memory
  memoryCache[key] = questions;

  // 2. Store in browser sessionStorage
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(questions));
    } catch {
      // Ignore quota errors in storage
    }
  }
}

/**
 * Clears cached questions for a course or all sessions.
 */
export function clearStageQuestionsCache(courseId?: string): void {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      if (courseId) {
        const prefix = `questlearn_q_cache_${courseId}`;
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.sessionStorage.length; i++) {
          const k = window.sessionStorage.key(i);
          if (k && k.startsWith(prefix)) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => window.sessionStorage.removeItem(k));
      } else {
        window.sessionStorage.clear();
      }
    } catch {}
  }

  if (courseId) {
    for (const k of Object.keys(memoryCache)) {
      if (k.includes(courseId)) {
        delete memoryCache[k];
      }
    }
  } else {
    for (const k of Object.keys(memoryCache)) {
      delete memoryCache[k];
    }
  }
}
