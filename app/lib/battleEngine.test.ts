import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_PLAYER_HEARTS,
  MAX_PLAYER_HP,
  DEFAULT_REVIVE_HEARTS,
  clampHp,
  clampHearts,
  formatHpDisplay,
  formatHeartsDisplay,
  isDefeated,
  calculateHeal,
  calculateIncomingDamage,
  applyDamageWithRevive,
  executeRevive
} from './battleEngine.ts';

test('Hearts Clamping guarantees Hearts can NEVER be negative or exceed MAX_PLAYER_HEARTS (10)', () => {
  assert.equal(clampHp(10), 10);
  assert.equal(clampHp(8), 8);
  assert.equal(clampHp(0), 0);
  assert.equal(clampHp(-1), 0, 'Hearts of -1 must clamp to 0');
  assert.equal(clampHp(-5), 0, 'Hearts of -5 must clamp to 0');
  assert.equal(clampHp(15), 10, 'Hearts cannot exceed 10');
  assert.equal(clampHearts(10), 10);
  assert.equal(clampHp(NaN), 0, 'NaN must be normalized to 0');
  assert.equal(clampHp(undefined as unknown as number), 0, 'undefined must be normalized to 0');
});

test('formatHeartsDisplay and formatHpDisplay generate valid string in hearts', () => {
  assert.equal(formatHeartsDisplay(8), 'Hearts: 8/10');
  assert.equal(formatHeartsDisplay(10), 'Hearts: 10/10');
  assert.equal(formatHeartsDisplay(0), 'Hearts: 0/10');
  assert.equal(formatHeartsDisplay(-1), 'Hearts: 0/10', 'Negative Hearts must format as 0/10');
  assert.equal(formatHeartsDisplay(15), 'Hearts: 10/10');

  // formatHpDisplay acts as backwards-compatible alias
  assert.equal(formatHpDisplay(8), 'Hearts: 8/10');
  assert.equal(formatHpDisplay(10), 'Hearts: 10/10');

  const sampleOutputs = [
    formatHeartsDisplay(-1),
    formatHeartsDisplay(0),
    formatHeartsDisplay(5),
    formatHeartsDisplay(10)
  ];
  for (const text of sampleOutputs) {
    assert.match(text, /^Hearts: \d+\/10$/);
    assert.doesNotMatch(text, /-\d+/);
  }
});

test('isDefeated triggers strictly when Hearts are 0 or lower', () => {
  assert.equal(isDefeated(0), true, '0 Hearts is defeated');
  assert.equal(isDefeated(-2), true, '-2 Hearts is defeated');
  assert.equal(isDefeated(1), false, '1 Heart is alive');
  assert.equal(isDefeated(10), false, '10 Hearts is alive');
});

test('calculateHeal caps recovery at 10 Hearts', () => {
  const result1 = calculateHeal(8, 1);
  assert.equal(result1.nextHp, 9);
  assert.equal(result1.actualHealed, 1);

  const result2 = calculateHeal(9, 2);
  assert.equal(result2.nextHp, 10);
  assert.equal(result2.actualHealed, 1);

  const result3 = calculateHeal(10, 1);
  assert.equal(result3.nextHp, 10);
  assert.equal(result3.actualHealed, 0);

  const result4 = calculateHeal(0, 3);
  assert.equal(result4.nextHp, 3);
  assert.equal(result4.actualHealed, 3);
});

test('applyDamageWithRevive prevents negative Hearts even on overkill damage', () => {
  // Normal damage (1 heart)
  const hit1 = applyDamageWithRevive({ currentHp: 10, damageDealt: 1 });
  assert.equal(hit1.nextHp, 9);
  assert.equal(hit1.isDefeated, false);

  // Exact kill
  const hit2 = applyDamageWithRevive({ currentHp: 2, damageDealt: 2 });
  assert.equal(hit2.nextHp, 0);
  assert.equal(hit2.isDefeated, true);

  // Overkill
  const hit3 = applyDamageWithRevive({ currentHp: 1, damageDealt: 3 });
  assert.equal(hit3.nextHp, 0, 'Hearts must never drop below 0');
  assert.equal(hit3.isDefeated, true);

  // Massive overkill
  const hit4 = applyDamageWithRevive({ currentHp: 2, damageDealt: 10 });
  assert.equal(hit4.nextHp, 0, 'Hearts must never drop below 0 on 10 damage');
  assert.equal(hit4.isDefeated, true);
});

test('Ulquiorra Death Defiance revives player at 1 Heart upon lethal damage', () => {
  // Fatal blow while defiance is available
  const result = applyDamageWithRevive({
    currentHp: 1,
    damageDealt: 2,
    heroId: 'ulquiorra_hero',
    deathDefianceUsed: false
  });

  assert.equal(result.nextHp, 1, 'Ulquiorra death defiance must survive at 1 Heart');
  assert.equal(result.defiedDeath, true);
  assert.equal(result.isDefeated, false);

  // Subsequent fatal blow after defiance was already used
  const subsequentResult = applyDamageWithRevive({
    currentHp: 1,
    damageDealt: 2,
    heroId: 'ulquiorra_hero',
    deathDefianceUsed: true
  });

  assert.equal(subsequentResult.nextHp, 0, 'Second fatal blow must defeat player');
  assert.equal(subsequentResult.defiedDeath, false);
  assert.equal(subsequentResult.isDefeated, true);
});

test('Immortal Class Nullification protects player completely from fatal errors', () => {
  const damageResult = calculateIncomingDamage({
    bossDifficultyLabel: 'Advanced',
    bossPhase: 2,
    immortalShieldsRemaining: 1
  });

  assert.equal(damageResult.damageDealt, 0);
  assert.equal(damageResult.isCompletelyNullified, true);

  const hitResult = applyDamageWithRevive({
    currentHp: 1,
    damageDealt: damageResult.damageDealt
  });

  assert.equal(hitResult.nextHp, 1);
  assert.equal(hitResult.isDefeated, false);
});

test('executeRevive handles Phoenix Rebirth correctly with Geo or Immortal class', () => {
  // Free Immortal class revive (restores 5 Hearts)
  const freeRevive = executeRevive({
    currentGeo: 10,
    isImmortalClass: true,
    freeReviveAvailable: true
  });
  assert.equal(freeRevive.success, true);
  assert.equal(freeRevive.nextHp, 5);
  assert.equal(freeRevive.nextGeo, 10, 'Free revive must not consume Geo');
  assert.equal(freeRevive.usedFreeRevive, true);

  // Paid Geo revive
  const paidRevive = executeRevive({
    currentGeo: 120,
    isImmortalClass: false,
    reviveCost: 50
  });
  assert.equal(paidRevive.success, true);
  assert.equal(paidRevive.nextHp, 5);
  assert.equal(paidRevive.nextGeo, 70, '120 Geo - 50 = 70 Geo');
  assert.equal(paidRevive.usedFreeRevive, false);

  // Insufficient Geo
  const failedRevive = executeRevive({
    currentGeo: 25,
    isImmortalClass: false,
    reviveCost: 50
  });
  assert.equal(failedRevive.success, false);
  assert.equal(failedRevive.nextHp, 0);
  assert.equal(failedRevive.nextGeo, 25);
  assert.match(failedRevive.error || '', /Need 25 more Geo/);
});

test('Progressive boss damage scaling across stages (Stage 1 = 1 Heart, Stage 5 = 3-4 Hearts)', () => {
  // Stage 1
  const s1Result = calculateIncomingDamage({ stageNumber: 1, bossPhase: 1 });
  assert.equal(s1Result.damageDealt, 1, 'Stage 1 deals 1 Heart');

  // Stage 2
  const s2P1 = calculateIncomingDamage({ stageNumber: 2, bossPhase: 1 });
  const s2P2 = calculateIncomingDamage({ stageNumber: 2, bossPhase: 2 });
  assert.equal(s2P1.damageDealt, 1, 'Stage 2 Phase 1 deals 1 Heart');
  assert.equal(s2P2.damageDealt, 2, 'Stage 2 Phase 2 deals 2 Hearts');

  // Stage 3
  const s3Result = calculateIncomingDamage({ stageNumber: 3, bossPhase: 1 });
  assert.equal(s3Result.damageDealt, 2, 'Stage 3 deals 2 Hearts');

  // Stage 4
  const s4P1 = calculateIncomingDamage({ stageNumber: 4, bossPhase: 1 });
  const s4P2 = calculateIncomingDamage({ stageNumber: 4, bossPhase: 2 });
  assert.equal(s4P1.damageDealt, 2, 'Stage 4 Phase 1 deals 2 Hearts');
  assert.equal(s4P2.damageDealt, 3, 'Stage 4 Phase 2 deals 3 Hearts');

  // Stage 5 Apex Final Boss
  const s5P1 = calculateIncomingDamage({ stageNumber: 5, bossPhase: 1 });
  const s5P2 = calculateIncomingDamage({ stageNumber: 5, bossPhase: 2 });
  assert.equal(s5P1.damageDealt, 3, 'Stage 5 Phase 1 deals 3 Hearts');
  assert.equal(s5P2.damageDealt, 4, 'Stage 5 Phase 2 deals 4 Hearts');
});

