/**
 * QuestLearn - Course-Specific Star-to-Heart Forging Engine
 * 
 * Rules:
 * 1. Stars earned from completing stage tests WITHIN A COURSE can be forged
 *    into Extra Hearts (Soul Wards) strictly for tests WITHIN THAT SAME COURSE.
 * 2. Conversion rate: 3 Course Stars = 1 Extra Heart (Soul Ward).
 * 3. Maximum 3 Extra Hearts per course.
 * 4. During tests in that course, an Extra Heart absorbs wrong answer damage first,
 *    protecting the player's 100 base HP.
 * 5. Hearts can be reforged/refunded back into course stars at any time.
 */

export const COURSE_HEARTS_STORAGE_KEY = 'questlearn_course_hearts_v1';
export const STARS_PER_EXTRA_HEART = 3;
export const MAX_EXTRA_HEARTS_PER_COURSE = 3;

export interface CourseHeartData {
  extraHearts: number;
  starsSpent: number;
}

export type CourseHeartsRecord = Record<string, CourseHeartData>;

export interface CourseStarHeartsSummary {
  courseId: string;
  totalStarsEarned: number;
  starsSpent: number;
  starsAvailable: number;
  extraHearts: number;
  maxHearts: number;
  costPerHeart: number;
  canForge: boolean;
  canReforge: boolean;
}

/**
 * Load all course hearts data from localStorage
 */
export function loadCourseHeartsState(): CourseHeartsRecord {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(COURSE_HEARTS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Save course hearts data to localStorage
 */
export function saveCourseHeartsState(state: CourseHeartsRecord): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COURSE_HEARTS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Graceful fallback
  }
}

/**
 * Get active extra hearts count for a specific course
 */
export function getCourseHearts(courseId: string): number {
  const state = loadCourseHeartsState();
  return state[courseId]?.extraHearts || 0;
}

/**
 * Calculate stars summary and forging capability for a course
 */
export function getCourseStarHeartsSummary(
  courseId: string,
  totalStarsEarned: number,
  stateOverride?: CourseHeartsRecord
): CourseStarHeartsSummary {
  const state = stateOverride || loadCourseHeartsState();
  const data = state[courseId] || { extraHearts: 0, starsSpent: 0 };
  const starsSpent = data.starsSpent || 0;
  const extraHearts = data.extraHearts || 0;
  const starsAvailable = Math.max(0, totalStarsEarned - starsSpent);
  const canForge = starsAvailable >= STARS_PER_EXTRA_HEART && extraHearts < MAX_EXTRA_HEARTS_PER_COURSE;
  const canReforge = extraHearts > 0;

  return {
    courseId,
    totalStarsEarned,
    starsSpent,
    starsAvailable,
    extraHearts,
    maxHearts: MAX_EXTRA_HEARTS_PER_COURSE,
    costPerHeart: STARS_PER_EXTRA_HEART,
    canForge,
    canReforge
  };
}

/**
 * Forge 1 Extra Heart using 3 stars from the specified course
 */
export function forgeCourseHeart(
  courseId: string,
  totalStarsEarned: number,
  stateOverride?: CourseHeartsRecord
): {
  success: boolean;
  extraHearts: number;
  starsSpent: number;
  message: string;
  nextState: CourseHeartsRecord;
} {
  const state = stateOverride ? { ...stateOverride } : { ...loadCourseHeartsState() };
  const current = state[courseId] || { extraHearts: 0, starsSpent: 0 };
  const starsAvailable = totalStarsEarned - (current.starsSpent || 0);

  if (current.extraHearts >= MAX_EXTRA_HEARTS_PER_COURSE) {
    return {
      success: false,
      extraHearts: current.extraHearts,
      starsSpent: current.starsSpent,
      message: `Maximum limit reached: You can forge up to ${MAX_EXTRA_HEARTS_PER_COURSE} Extra Hearts for this course.`,
      nextState: state
    };
  }

  if (starsAvailable < STARS_PER_EXTRA_HEART) {
    return {
      success: false,
      extraHearts: current.extraHearts,
      starsSpent: current.starsSpent,
      message: `Insufficient course stars! You need ${STARS_PER_EXTRA_HEART - starsAvailable} more star(s) from this course.`,
      nextState: state
    };
  }

  const updatedData: CourseHeartData = {
    extraHearts: current.extraHearts + 1,
    starsSpent: current.starsSpent + STARS_PER_EXTRA_HEART
  };

  state[courseId] = updatedData;
  if (!stateOverride) {
    saveCourseHeartsState(state);
  }

  return {
    success: true,
    extraHearts: updatedData.extraHearts,
    starsSpent: updatedData.starsSpent,
    message: `★ Soul Ward Forged! +1 Extra Heart added for ${courseId} tests.`,
    nextState: state
  };
}

/**
 * Refund / Reforge 1 Extra Heart back into 3 course stars
 */
export function refundCourseHeart(
  courseId: string,
  stateOverride?: CourseHeartsRecord
): {
  success: boolean;
  extraHearts: number;
  starsSpent: number;
  message: string;
  nextState: CourseHeartsRecord;
} {
  const state = stateOverride ? { ...stateOverride } : { ...loadCourseHeartsState() };
  const current = state[courseId] || { extraHearts: 0, starsSpent: 0 };

  if (current.extraHearts <= 0) {
    return {
      success: false,
      extraHearts: 0,
      starsSpent: current.starsSpent,
      message: 'No Extra Hearts to refund for this course.',
      nextState: state
    };
  }

  const updatedData: CourseHeartData = {
    extraHearts: Math.max(0, current.extraHearts - 1),
    starsSpent: Math.max(0, current.starsSpent - STARS_PER_EXTRA_HEART)
  };

  state[courseId] = updatedData;
  if (!stateOverride) {
    saveCourseHeartsState(state);
  }

  return {
    success: true,
    extraHearts: updatedData.extraHearts,
    starsSpent: updatedData.starsSpent,
    message: `★ 1 Extra Heart refunded. ${STARS_PER_EXTRA_HEART} stars returned to ${courseId}.`,
    nextState: state
  };
}

/**
 * Consume 1 Extra Heart when an error occurs during a course test
 * Returns whether a heart was consumed and how many remain
 */
export function consumeCourseHeart(
  courseId: string,
  stateOverride?: CourseHeartsRecord
): {
  heartAbsorbed: boolean;
  remainingHearts: number;
  message: string;
  nextState: CourseHeartsRecord;
} {
  const state = stateOverride ? { ...stateOverride } : { ...loadCourseHeartsState() };
  const current = state[courseId] || { extraHearts: 0, starsSpent: 0 };

  if (current.extraHearts <= 0) {
    return {
      heartAbsorbed: false,
      remainingHearts: 0,
      message: 'No Extra Hearts available for this course. Damage applied to base HP.',
      nextState: state
    };
  }

  const updatedData: CourseHeartData = {
    extraHearts: current.extraHearts - 1,
    starsSpent: current.starsSpent // keep stars spent
  };

  state[courseId] = updatedData;
  if (!stateOverride) {
    saveCourseHeartsState(state);
  }

  return {
    heartAbsorbed: true,
    remainingHearts: updatedData.extraHearts,
    message: `🛡️ SOUL WARD ENGAGED: Extra Heart absorbed the penalty! (Hearts remaining: ${updatedData.extraHearts}) Base 10 Hearts Protected!`,
    nextState: state
  };
}
