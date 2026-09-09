/**
 * Unseen Questions Tracker & Prioritization Engine
 *
 * Guarantees that students encounter fresh, unencountered questions
 * before any previously seen questions are repeated.
 */

const STORAGE_KEY = 'questlearn_seen_question_ids';

// In-memory set for SSR, testing environments, or private browsing modes
const inMemorySeen = new Set<string>();

/**
 * Retrieves the set of question IDs the user has already answered or encountered.
 */
export function getSeenQuestionIds(): Set<string> {
  const result = new Set<string>(inMemorySeen);

  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: string[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          parsed.forEach((id) => result.add(id));
        }
      }
    } catch {
      // Graceful fallback to in-memory
    }
  }

  return result;
}

/**
 * Marks one or more questions as seen.
 */
export function markQuestionSeen(questionId: string): void {
  if (!questionId) return;
  inMemorySeen.add(questionId);

  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const current = getSeenQuestionIds();
      current.add(questionId);
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(current)));
    } catch {
      // Ignore quota errors
    }
  }
}

/**
 * Marks a batch of question IDs as seen.
 */
export function markQuestionsSeen(questionIds: string[]): void {
  if (!Array.isArray(questionIds) || questionIds.length === 0) return;
  questionIds.forEach((id) => inMemorySeen.add(id));

  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const current = getSeenQuestionIds();
      questionIds.forEach((id) => current.add(id));
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(current)));
    } catch {
      // Ignore quota errors
    }
  }
}

/**
 * Prioritizes unseen questions before already-encountered questions.
 * If all questions in the provided pool have already been seen, it resets the
 * seen status for this specific pool so that the learner cycles gracefully.
 */
export function prioritizeUnseenQuestions<T extends { id: string }>(questions: T[]): T[] {
  if (!Array.isArray(questions) || questions.length <= 1) {
    return questions;
  }

  const seenIds = getSeenQuestionIds();
  const unseen: T[] = [];
  const seen: T[] = [];

  for (const q of questions) {
    if (seenIds.has(q.id)) {
      seen.push(q);
    } else {
      unseen.push(q);
    }
  }

  // If there are unseen questions, present them first, followed by previously seen ones
  if (unseen.length > 0) {
    return [...unseen, ...seen];
  }

  // If all questions have already been seen, reset tracking for this pool and return
  for (const q of questions) {
    inMemorySeen.delete(q.id);
  }
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const current = getSeenQuestionIds();
      for (const q of questions) {
        current.delete(q.id);
      }
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(current)));
    } catch {}
  }

  return [...questions];
}

/**
 * Clears all seen question history.
 */
export function clearSeenQuestions(): void {
  inMemorySeen.clear();
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
}
