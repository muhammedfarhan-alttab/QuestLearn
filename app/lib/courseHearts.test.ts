import test from 'node:test';
import assert from 'node:assert';
import {
  STARS_PER_EXTRA_HEART,
  MAX_EXTRA_HEARTS_PER_COURSE,
  getCourseStarHeartsSummary,
  forgeCourseHeart,
  refundCourseHeart,
  consumeCourseHeart
} from './courseHeartsEngine.ts';
import type { CourseHeartsRecord } from './courseHeartsEngine.ts';

test('Course Hearts - 3 stars per extra heart forging ratio', () => {
  assert.strictEqual(STARS_PER_EXTRA_HEART, 3);
  assert.strictEqual(MAX_EXTRA_HEARTS_PER_COURSE, 3);

  // 0 stars cannot forge
  const summary0 = getCourseStarHeartsSummary('mechanics', 0, {});
  assert.strictEqual(summary0.canForge, false);
  assert.strictEqual(summary0.extraHearts, 0);

  // 2 stars cannot forge
  const summary2 = getCourseStarHeartsSummary('mechanics', 2, {});
  assert.strictEqual(summary2.canForge, false);

  // 3 stars can forge 1 heart
  const summary3 = getCourseStarHeartsSummary('mechanics', 3, {});
  assert.strictEqual(summary3.canForge, true);
  assert.strictEqual(summary3.starsAvailable, 3);
});

test('Course Hearts - Forging and Max 3 hearts cap', () => {
  let state: CourseHeartsRecord = {};

  // Forge 1st heart with 9 stars
  const forge1 = forgeCourseHeart('mechanics', 9, state);
  assert.strictEqual(forge1.success, true);
  assert.strictEqual(forge1.extraHearts, 1);
  assert.strictEqual(forge1.starsSpent, 3);
  state = forge1.nextState;

  // Forge 2nd heart
  const forge2 = forgeCourseHeart('mechanics', 9, state);
  assert.strictEqual(forge2.success, true);
  assert.strictEqual(forge2.extraHearts, 2);
  assert.strictEqual(forge2.starsSpent, 6);
  state = forge2.nextState;

  // Forge 3rd heart
  const forge3 = forgeCourseHeart('mechanics', 9, state);
  assert.strictEqual(forge3.success, true);
  assert.strictEqual(forge3.extraHearts, 3);
  assert.strictEqual(forge3.starsSpent, 9);
  state = forge3.nextState;

  // Attempt 4th heart - capped at 3
  const forge4 = forgeCourseHeart('mechanics', 15, state);
  assert.strictEqual(forge4.success, false);
  assert.strictEqual(forge4.extraHearts, 3);
  assert.match(forge4.message, /Maximum limit reached/);
});

test('Course Hearts - Course Isolation', () => {
  let state: CourseHeartsRecord = {};

  // Forge 2 hearts in mechanics (from 6 mechanics stars)
  const mechanicsForge = forgeCourseHeart('mechanics', 6, state);
  state = mechanicsForge.nextState;
  const mechanicsForge2 = forgeCourseHeart('mechanics', 6, state);
  state = mechanicsForge2.nextState;

  // Check Calculus summary - should have 0 hearts and 0 stars spent
  const calculusSummary = getCourseStarHeartsSummary('calculus', 5, state);
  assert.strictEqual(calculusSummary.extraHearts, 0);
  assert.strictEqual(calculusSummary.starsSpent, 0);
  assert.strictEqual(calculusSummary.starsAvailable, 5);

  // Check Mechanics summary - has 2 hearts and 6 stars spent
  const mechanicsSummary = getCourseStarHeartsSummary('mechanics', 6, state);
  assert.strictEqual(mechanicsSummary.extraHearts, 2);
  assert.strictEqual(mechanicsSummary.starsSpent, 6);
  assert.strictEqual(mechanicsSummary.starsAvailable, 0);

  // Consuming in Mechanics does NOT touch Calculus
  const consumeMechanics = consumeCourseHeart('mechanics', state);
  assert.strictEqual(consumeMechanics.heartAbsorbed, true);
  assert.strictEqual(consumeMechanics.remainingHearts, 1);
  state = consumeMechanics.nextState;

  // Consuming in Calculus fails because Calculus has 0 hearts
  const consumeCalculus = consumeCourseHeart('calculus', state);
  assert.strictEqual(consumeCalculus.heartAbsorbed, false);
  assert.strictEqual(consumeCalculus.remainingHearts, 0);
});

test('Course Hearts - Refunding / Reforging', () => {
  let state: CourseHeartsRecord = {
    electromagnetism: { extraHearts: 2, starsSpent: 6 }
  };

  const refund = refundCourseHeart('electromagnetism', state);
  assert.strictEqual(refund.success, true);
  assert.strictEqual(refund.extraHearts, 1);
  assert.strictEqual(refund.starsSpent, 3);
  state = refund.nextState;

  const refund2 = refundCourseHeart('electromagnetism', state);
  assert.strictEqual(refund2.success, true);
  assert.strictEqual(refund2.extraHearts, 0);
  assert.strictEqual(refund2.starsSpent, 0);
  state = refund2.nextState;

  // Further refund fails gracefully
  const refund3 = refundCourseHeart('electromagnetism', state);
  assert.strictEqual(refund3.success, false);
});
