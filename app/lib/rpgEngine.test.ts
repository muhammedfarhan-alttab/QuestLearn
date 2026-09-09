import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getXpRequiredForLevel,
  calculatePlayerLevel,
  getComboMultiplier,
  updateDailyStreak,
  SKILL_TREE_NODES,
  getActiveSkillBuffs,
  canUnlockSkillNode,
  generateDailyQuests,
  updateDailyQuestProgress,
  ACHIEVEMENTS_CATALOG,
  updateAchievementProgress
} from './rpgEngine.ts';

test('RPG Engine - XP & Level Progression', () => {
  // Level threshold calculation
  assert.equal(getXpRequiredForLevel(1), 0);
  assert.equal(getXpRequiredForLevel(2), 100);
  assert.equal(getXpRequiredForLevel(3), 250);
  assert.equal(getXpRequiredForLevel(4), 450);
  assert.equal(getXpRequiredForLevel(5), 700);

  // Level 1 at 0 XP
  const lvl1 = calculatePlayerLevel(0);
  assert.equal(lvl1.level, 1);
  assert.equal(lvl1.currentLevelXp, 0);
  assert.equal(lvl1.nextLevelXpRequired, 100);
  assert.equal(lvl1.progressPercentage, 0);
  assert.equal(lvl1.skillPointsAvailable, 0);

  // Level 1 near threshold
  const lvl1High = calculatePlayerLevel(99);
  assert.equal(lvl1High.level, 1);
  assert.equal(lvl1High.currentLevelXp, 99);
  assert.equal(lvl1High.progressPercentage, 99);

  // Level 2 boundary
  const lvl2 = calculatePlayerLevel(100);
  assert.equal(lvl2.level, 2);
  assert.equal(lvl2.currentLevelXp, 0);
  assert.equal(lvl2.nextLevelXpRequired, 150); // 250 - 100 = 150
  assert.equal(lvl2.progressPercentage, 0);
  assert.equal(lvl2.skillPointsAvailable, 1);

  // Level 3 mid-progress with spent skill points
  const lvl3 = calculatePlayerLevel(350, 1);
  assert.equal(lvl3.level, 3);
  assert.equal(lvl3.currentLevelXp, 100); // 350 - 250 = 100
  assert.equal(lvl3.nextLevelXpRequired, 200); // 450 - 250 = 200
  assert.equal(lvl3.progressPercentage, 50);
  assert.equal(lvl3.totalSkillPointsEarned, 2);
  assert.equal(lvl3.skillPointsAvailable, 1); // 2 earned - 1 spent = 1 available
});

test('RPG Engine - In-Battle Combo Streak Multipliers', () => {
  // 0-2 streak: 1.0x
  assert.equal(getComboMultiplier(0).multiplier, 1.0);
  assert.equal(getComboMultiplier(1).multiplier, 1.0);
  assert.equal(getComboMultiplier(2).multiplier, 1.0);

  // 3-4 streak: 1.25x
  assert.equal(getComboMultiplier(3).multiplier, 1.25);
  assert.equal(getComboMultiplier(4).multiplier, 1.25);
  assert.equal(getComboMultiplier(3).tierName, 'COMBO BURST');

  // 5-7 streak: 1.5x
  assert.equal(getComboMultiplier(5).multiplier, 1.5);
  assert.equal(getComboMultiplier(7).multiplier, 1.5);
  assert.equal(getComboMultiplier(5).tierName, 'HYPER STREAK');

  // 8+ streak: 2.0x
  assert.equal(getComboMultiplier(8).multiplier, 2.0);
  assert.equal(getComboMultiplier(15).multiplier, 2.0);
  assert.equal(getComboMultiplier(8).tierName, 'ULTRA COMBO');
  assert.equal(getComboMultiplier(8).isMaxTier, true);

  // Arcana skill bonus (+0.25x)
  const arcanaBoosted = getComboMultiplier(5, 0.25);
  assert.equal(arcanaBoosted.multiplier, 1.75);
});

test('RPG Engine - Daily Login Streak & Shield Protection', () => {
  const initial = {
    streakDays: 3,
    lastActiveDate: '2026-09-08',
    streakShieldCount: 1,
    longestStreak: 3,
    claimedMilestones: []
  };

  // Same day action does not increment
  const sameDay = updateDailyStreak(initial, '2026-09-08');
  assert.equal(sameDay.state.streakDays, 3);
  assert.equal(sameDay.isNewDay, false);

  // Consecutive day (diff = 1) increments streak
  const nextDay = updateDailyStreak(initial, '2026-09-09');
  assert.equal(nextDay.state.streakDays, 4);
  assert.equal(nextDay.state.longestStreak, 4);
  assert.equal(nextDay.streakMaintained, true);
  assert.equal(nextDay.shieldUsed, false);

  // Missed day with shield protects streak
  const missedWithShield = updateDailyStreak(initial, '2026-09-11');
  assert.equal(missedWithShield.state.streakDays, 3);
  assert.equal(missedWithShield.state.streakShieldCount, 0);
  assert.equal(missedWithShield.streakMaintained, true);
  assert.equal(missedWithShield.shieldUsed, true);

  // Missed day without shield resets streak to 1
  const noShield = { ...initial, streakShieldCount: 0 };
  const missedNoShield = updateDailyStreak(noShield, '2026-09-11');
  assert.equal(missedNoShield.state.streakDays, 1);
  assert.equal(missedNoShield.streakMaintained, false);
});

test('RPG Engine - Skill Tree Prerequisites & Buff Aggregation', () => {
  assert.equal(SKILL_TREE_NODES.length, 16, 'Skill tree must contain exactly 16 nodes across 4 paths');

  // Tier 1 node can be unlocked with 1 point
  const checkMight1 = canUnlockSkillNode('might_1', [], 1);
  assert.equal(checkMight1.canUnlock, true);

  // Cannot unlock Tier 2 without Tier 1 prerequisite
  const checkMight2NoPrereq = canUnlockSkillNode('might_2', [], 1);
  assert.equal(checkMight2NoPrereq.canUnlock, false);

  // Cannot unlock without sufficient points
  const checkMight1NoPoints = canUnlockSkillNode('might_1', [], 0);
  assert.equal(checkMight1NoPoints.canUnlock, false);

  // Can unlock Tier 2 once Tier 1 is unlocked and points are available
  const checkMight2Valid = canUnlockSkillNode('might_2', ['might_1'], 1);
  assert.equal(checkMight2Valid.canUnlock, true);

  // Aggregated buffs
  const buffs = getActiveSkillBuffs(['might_1', 'might_2', 'arcana_1', 'resilience_1', 'fortune_1']);
  assert.equal(buffs.bossDamageBonusPct, 0.15);
  assert.equal(buffs.criticalStrikeChance, 0.20);
  assert.equal(buffs.xpBonusPct, 0.20);
  assert.equal(buffs.maxHpBonus, 20);
  assert.equal(buffs.geoBonusPct, 0.25);
});

test('RPG Engine - Daily Quests Progress & Reset', () => {
  const daily = generateDailyQuests('2026-09-09');
  assert.equal(daily.quests.length, 4);

  // Update answer question quest
  const updated1 = updateDailyQuestProgress(daily, 'answer_questions', 3);
  const qAnswer = updated1.quests.find(q => q.type === 'answer_questions')!;
  assert.equal(qAnswer.current, 3);

  // Update streak quest
  const updated2 = updateDailyQuestProgress(updated1, 'reach_streak', 4);
  const qStreak = updated2.quests.find(q => q.type === 'reach_streak')!;
  assert.equal(qStreak.current, 4);
});

test('RPG Engine - Achievements Catalog & Unlock Triggers', () => {
  assert.ok(ACHIEVEMENTS_CATALOG.length >= 12, 'Must have at least 12 achievements');

  const { updated, newlyUnlocked } = updateAchievementProgress(
    ACHIEVEMENTS_CATALOG,
    'ach_first_blood',
    1
  );

  assert.ok(newlyUnlocked, 'First blood should unlock');
  assert.equal(newlyUnlocked.id, 'ach_first_blood');
  assert.equal(newlyUnlocked.isUnlocked, true);

  const foundInList = updated.find(a => a.id === 'ach_first_blood')!;
  assert.equal(foundInList.isUnlocked, true);
});
