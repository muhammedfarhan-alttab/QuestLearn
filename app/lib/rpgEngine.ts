/**
 * QuestLearn - RPG Progression Engine
 * 
 * Core Interconnected RPG Systems:
 * - XP & Player Leveling: Exponential XP progression curve, level milestones, Skill Point distribution.
 * - Streak Bonuses: In-battle combo multipliers (1.0x to 2.0x) + Daily login streaks with streak shield protection.
 * - Skill Trees: 4 distinct branching specialization paths (Might, Arcana, Resilience, Fortune).
 * - Daily Quests: 24-hour cycle missions with live tracking and XP/Geo rewards.
 * - Achievements: 12 tiered badges with claimable rewards.
 * - LocalStorage persistence for complete offline/online gameplay.
 */

// =============================================================
// 1. XP & PLAYER LEVEL PROGRESSION
// =============================================================

export interface PlayerLevelInfo {
  level: number;
  currentLevelXp: number;
  nextLevelXpRequired: number;
  totalXp: number;
  progressPercentage: number;
  skillPointsAvailable: number;
  totalSkillPointsEarned: number;
}

/**
 * Calculates cumulative XP required to reach a specific level.
 * Level 1: 0 XP
 * Level 2: 100 XP
 * Level 3: 250 XP
 * Level 4: 450 XP
 * Level 5: 700 XP
 * Level 6: 1000 XP
 * Level 10: 2700 XP
 */
export function getXpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  const n = level - 1;
  return 50 * n + 25 * n * (n + 1);
}

/**
 * Calculates player level, current level progress, and skill points from total XP.
 */
export function calculatePlayerLevel(totalXp: number, spentSkillPoints: number = 0): PlayerLevelInfo {
  const safeXp = Math.max(0, Math.floor(totalXp));
  let level = 1;

  while (getXpRequiredForLevel(level + 1) <= safeXp) {
    level++;
  }

  const currentLevelBaseXp = getXpRequiredForLevel(level);
  const nextLevelBaseXp = getXpRequiredForLevel(level + 1);
  const nextLevelXpRequired = nextLevelBaseXp - currentLevelBaseXp;
  const currentLevelXp = safeXp - currentLevelBaseXp;
  const progressPercentage = nextLevelXpRequired > 0 
    ? Math.min(100, Math.max(0, Math.round((currentLevelXp / nextLevelXpRequired) * 100))) 
    : 100;

  const totalSkillPointsEarned = Math.max(0, level - 1);
  const skillPointsAvailable = Math.max(0, totalSkillPointsEarned - spentSkillPoints);

  return {
    level,
    currentLevelXp,
    nextLevelXpRequired,
    totalXp: safeXp,
    progressPercentage,
    skillPointsAvailable,
    totalSkillPointsEarned
  };
}

// =============================================================
// 2. STREAK BONUSES & MULTIPLIERS
// =============================================================

export interface ComboMultiplierInfo {
  multiplier: number;
  tierName: string;
  bonusDescription: string;
  badgeColor: string;
  isMaxTier: boolean;
}

/**
 * Evaluates combat combo streak multipliers for XP & Coins:
 * - 1-2 streak: 1.0x (Standard)
 * - 3-4 streak: 1.25x (+25% bonus)
 * - 5-7 streak: 1.5x (+50% bonus)
 * - 8+ streak: 2.0x ("ULTRA COMBO! 2x XP & Coins")
 */
export function getComboMultiplier(streak: number, arcanaStreakBonus: number = 0): ComboMultiplierInfo {
  const safeStreak = Math.max(0, streak);

  if (safeStreak >= 8) {
    return {
      multiplier: Number((2.0 + arcanaStreakBonus).toFixed(2)),
      tierName: 'ULTRA COMBO',
      bonusDescription: `+${Math.round((1.0 + arcanaStreakBonus) * 100)}% Bonus XP & Coins`,
      badgeColor: 'text-amber-300 bg-amber-500/20 border-amber-500/40',
      isMaxTier: true
    };
  }

  if (safeStreak >= 5) {
    return {
      multiplier: Number((1.5 + arcanaStreakBonus).toFixed(2)),
      tierName: 'HYPER STREAK',
      bonusDescription: `+${Math.round((0.5 + arcanaStreakBonus) * 100)}% Bonus XP & Coins`,
      badgeColor: 'text-rose-300 bg-rose-500/20 border-rose-500/40',
      isMaxTier: false
    };
  }

  if (safeStreak >= 3) {
    return {
      multiplier: Number((1.25 + arcanaStreakBonus).toFixed(2)),
      tierName: 'COMBO BURST',
      bonusDescription: `+${Math.round((0.25 + arcanaStreakBonus) * 100)}% Bonus XP & Coins`,
      badgeColor: 'text-cyan-300 bg-cyan-500/20 border-cyan-500/40',
      isMaxTier: false
    };
  }

  return {
    multiplier: Number((1.0 + arcanaStreakBonus).toFixed(2)),
    tierName: 'BASE',
    bonusDescription: arcanaStreakBonus > 0 ? `+${Math.round(arcanaStreakBonus * 100)}% Arcana Buff` : 'Standard 1.0x rewards',
    badgeColor: 'text-slate-400 bg-slate-800 border-slate-700',
    isMaxTier: false
  };
}

export interface DailyStreakState {
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  streakShieldCount: number;
  longestStreak: number;
  claimedMilestones: number[]; // e.g. [3, 7, 14, 30]
}

export const DEFAULT_DAILY_STREAK: DailyStreakState = {
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  streakShieldCount: 1,
  longestStreak: 1,
  claimedMilestones: []
};

/**
 * Evaluates and advances the daily login/learning streak based on calendar day difference.
 */
export function updateDailyStreak(current: DailyStreakState, todayStr?: string): {
  state: DailyStreakState;
  streakMaintained: boolean;
  shieldUsed: boolean;
  isNewDay: boolean;
} {
  const today = todayStr || new Date().toISOString().split('T')[0];
  if (current.lastActiveDate === today) {
    return { state: current, streakMaintained: true, shieldUsed: false, isNewDay: false };
  }

  const lastDate = new Date(current.lastActiveDate);
  const currentDate = new Date(today);
  const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Consecutive day
    const newCount = current.streakDays + 1;
    const nextState: DailyStreakState = {
      ...current,
      streakDays: newCount,
      lastActiveDate: today,
      longestStreak: Math.max(current.longestStreak, newCount)
    };
    return { state: nextState, streakMaintained: true, shieldUsed: false, isNewDay: true };
  } else if (diffDays > 1) {
    // Missed one or more days
    if (current.streakShieldCount > 0) {
      // Streak shield saved the streak!
      const nextState: DailyStreakState = {
        ...current,
        streakShieldCount: current.streakShieldCount - 1,
        lastActiveDate: today
      };
      return { state: nextState, streakMaintained: true, shieldUsed: true, isNewDay: true };
    } else {
      // Streak resets to 1
      const nextState: DailyStreakState = {
        ...current,
        streakDays: 1,
        lastActiveDate: today
      };
      return { state: nextState, streakMaintained: false, shieldUsed: false, isNewDay: true };
    }
  }

  return { state: current, streakMaintained: true, shieldUsed: false, isNewDay: false };
}

// =============================================================
// 3. BRANCHING RPG SKILL TREES
// =============================================================

export type SkillTreePath = 'might' | 'arcana' | 'resilience' | 'fortune';

export interface SkillNode {
  id: string;
  path: SkillTreePath;
  tier: 1 | 2 | 3 | 4;
  name: string;
  tagline: string;
  description: string;
  cost: number; // Skill Points required
  prerequisiteId?: string;
  icon: string;
}

export const SKILL_TREE_NODES: SkillNode[] = [
  // ================= PATH OF MIGHT (Attack & Boss Combat) =================
  {
    id: 'might_1',
    path: 'might',
    tier: 1,
    name: 'Sharp Focus',
    tagline: '+15% Boss Damage',
    description: 'Directs spiritual pressure to exploit enemy weak points, dealing +15% more damage on all correct answers against bosses.',
    cost: 1,
    icon: '⚔️'
  },
  {
    id: 'might_2',
    path: 'might',
    tier: 2,
    name: 'Critical Clarity',
    tagline: '20% Critical Strike Chance',
    description: 'Rapid responses have a 20% chance to trigger a Critical Strike, dealing 2.0x normal attack damage to the boss.',
    cost: 1,
    prerequisiteId: 'might_1',
    icon: '⚡'
  },
  {
    id: 'might_3',
    path: 'might',
    tier: 3,
    name: 'Executioner',
    tagline: '+40% Low-HP Boss Damage',
    description: 'Deal an extra +40% bonus damage when the boss is below 35% HP, accelerating finisher phases.',
    cost: 2,
    prerequisiteId: 'might_2',
    icon: '🩸'
  },
  {
    id: 'might_4',
    path: 'might',
    tier: 4,
    name: 'Ash Overdrive',
    tagline: '+50% Ash of War Charge Rate',
    description: 'Supercharges your soul weapon, charging the Ash of War special strike meter 50% faster on every correct answer.',
    cost: 2,
    prerequisiteId: 'might_3',
    icon: '💥'
  },

  // ================= PATH OF ARCANA (XP & Learning Acceleration) =================
  {
    id: 'arcana_1',
    path: 'arcana',
    tier: 1,
    name: 'Quick Study',
    tagline: '+20% XP from All Answers',
    description: 'Accelerates cognitive absorption, granting +20% more XP for every correct answer in battles, stage tests, and quizzes.',
    cost: 1,
    icon: '📖'
  },
  {
    id: 'arcana_2',
    path: 'arcana',
    tier: 2,
    name: 'Mind Palace',
    tagline: '+0.25x Combo Multiplier',
    description: 'Increases all in-combat combo streak multipliers by +0.25x (e.g. 1.25x becomes 1.5x; 2.0x becomes 2.25x).',
    cost: 1,
    prerequisiteId: 'arcana_1',
    icon: '🧠'
  },
  {
    id: 'arcana_3',
    path: 'arcana',
    tier: 3,
    name: 'Cognitive Resonance',
    tagline: '+35% Boss & Stage XP',
    description: 'Conquering a stage boss or completing a diagnostic awards +35% bonus XP.',
    cost: 2,
    prerequisiteId: 'arcana_2',
    icon: '🔮'
  },
  {
    id: 'arcana_4',
    path: 'arcana',
    tier: 4,
    name: 'Oracle Insight',
    tagline: '1 Free 50/50 Hint per Battle',
    description: 'Grants 1 free 50/50 hint per stage battle trial, eliminating two incorrect options.',
    cost: 2,
    prerequisiteId: 'arcana_3',
    icon: '👁️'
  },

  // ================= PATH OF RESILIENCE (HP & Defense) =================
  {
    id: 'resilience_1',
    path: 'resilience',
    tier: 1,
    name: 'Iron Will',
    tagline: '+20 Max HP (120 HP Total)',
    description: 'Strengthens your vital barrier, expanding player health pool from 100 to 120 Max HP.',
    cost: 1,
    icon: '🛡️'
  },
  {
    id: 'resilience_2',
    path: 'resilience',
    tier: 2,
    name: 'Aegis Ward',
    tagline: '-3 Damage from Wrong Answers',
    description: 'Reduces HP lost on incorrect answers by 3 (from -15 HP down to -12 HP).',
    cost: 1,
    prerequisiteId: 'resilience_1',
    icon: '🔰'
  },
  {
    id: 'resilience_3',
    path: 'resilience',
    tier: 3,
    name: 'Adrenaline Surge',
    tagline: '+15 HP on Boss Phase 2',
    description: 'When the boss reaches 50% HP and transitions to Phase 2, instantly heal +15 HP.',
    cost: 2,
    prerequisiteId: 'resilience_2',
    icon: '❤️‍🔥'
  },
  {
    id: 'resilience_4',
    path: 'resilience',
    tier: 4,
    name: 'Phoenix Bastion',
    tagline: 'Reduced Phoenix Revive Cost',
    description: 'Reduces Geo revive cost from 100 Geo to 50 Geo, and grants a +20 HP bonus shield upon rebirth.',
    cost: 2,
    prerequisiteId: 'resilience_3',
    icon: '🕊️'
  },

  // ================= PATH OF FORTUNE (Coins & Economy) =================
  {
    id: 'fortune_1',
    path: 'fortune',
    tier: 1,
    name: 'Bounty Hunter',
    tagline: '+25% Geo from All Questions',
    description: 'Earn +25% more Geo (Coins) for every correct question answered throughout QuestLearn.',
    cost: 1,
    icon: '🪙'
  },
  {
    id: 'fortune_2',
    path: 'fortune',
    tier: 2,
    name: 'Alchemist',
    tagline: '+15 Geo on Combo Streaks',
    description: 'Hitting 3-streak, 5-streak, or 8-streak instantly drops a pouch of +15 bonus Geo.',
    cost: 1,
    prerequisiteId: 'fortune_1',
    icon: '🧪'
  },
  {
    id: 'fortune_3',
    path: 'fortune',
    tier: 3,
    name: 'Dragon’s Hoard',
    tagline: '+150 Geo on Boss Defeat',
    description: 'Felling a stage boss yields a bonus hoard of +150 Geo.',
    cost: 2,
    prerequisiteId: 'fortune_2',
    icon: '👑'
  },
  {
    id: 'fortune_4',
    path: 'fortune',
    tier: 4,
    name: 'Midas Touch',
    tagline: '20% Character Upgrade Discount',
    description: 'Grants a permanent 20% discount on all Character Class coin upgrades across levels 1-10.',
    cost: 2,
    prerequisiteId: 'fortune_3',
    icon: '✨'
  }
];

export interface ActiveSkillBuffs {
  bossDamageBonusPct: number;
  criticalStrikeChance: number;
  executionerBonusPct: number;
  ashChargeRateMultiplier: number;
  xpBonusPct: number;
  comboMultiplierAdd: number;
  bossXpBonusPct: number;
  freeHintAvailable: boolean;
  maxHpBonus: number;
  damageReduction: number;
  phase2Heal: number;
  reviveDiscountPct: number;
  geoBonusPct: number;
  streakGeoBonus: number;
  bossGeoBonus: number;
  classUpgradeDiscountPct: number;
}

export function getActiveSkillBuffs(unlockedNodeIds: string[]): ActiveSkillBuffs {
  const buffs: ActiveSkillBuffs = {
    bossDamageBonusPct: 0,
    criticalStrikeChance: 0,
    executionerBonusPct: 0,
    ashChargeRateMultiplier: 1.0,
    xpBonusPct: 0,
    comboMultiplierAdd: 0,
    bossXpBonusPct: 0,
    freeHintAvailable: false,
    maxHpBonus: 0,
    damageReduction: 0,
    phase2Heal: 0,
    reviveDiscountPct: 0,
    geoBonusPct: 0,
    streakGeoBonus: 0,
    bossGeoBonus: 0,
    classUpgradeDiscountPct: 0
  };

  for (const id of unlockedNodeIds) {
    switch (id) {
      case 'might_1': buffs.bossDamageBonusPct += 0.15; break;
      case 'might_2': buffs.criticalStrikeChance += 0.20; break;
      case 'might_3': buffs.executionerBonusPct += 0.40; break;
      case 'might_4': buffs.ashChargeRateMultiplier += 0.50; break;
      case 'arcana_1': buffs.xpBonusPct += 0.20; break;
      case 'arcana_2': buffs.comboMultiplierAdd += 0.25; break;
      case 'arcana_3': buffs.bossXpBonusPct += 0.35; break;
      case 'arcana_4': buffs.freeHintAvailable = true; break;
      case 'resilience_1': buffs.maxHpBonus += 20; break;
      case 'resilience_2': buffs.damageReduction += 3; break;
      case 'resilience_3': buffs.phase2Heal += 15; break;
      case 'resilience_4': buffs.reviveDiscountPct += 0.50; break;
      case 'fortune_1': buffs.geoBonusPct += 0.25; break;
      case 'fortune_2': buffs.streakGeoBonus += 15; break;
      case 'fortune_3': buffs.bossGeoBonus += 150; break;
      case 'fortune_4': buffs.classUpgradeDiscountPct += 0.20; break;
    }
  }

  return buffs;
}

export function canUnlockSkillNode(
  nodeId: string,
  unlockedNodeIds: string[],
  availableSkillPoints: number
): { canUnlock: boolean; reason?: string } {
  if (unlockedNodeIds.includes(nodeId)) {
    return { canUnlock: false, reason: 'Already unlocked' };
  }

  const node = SKILL_TREE_NODES.find(n => n.id === nodeId);
  if (!node) {
    return { canUnlock: false, reason: 'Skill node does not exist' };
  }

  if (availableSkillPoints < node.cost) {
    return { canUnlock: false, reason: `Requires ${node.cost} Skill Point${node.cost > 1 ? 's' : ''}` };
  }

  if (node.prerequisiteId && !unlockedNodeIds.includes(node.prerequisiteId)) {
    const prereq = SKILL_TREE_NODES.find(n => n.id === node.prerequisiteId);
    return { canUnlock: false, reason: `Requires prerequisite: ${prereq?.name || 'Previous Tier'}` };
  }

  return { canUnlock: true };
}

// =============================================================
// 4. DAILY QUESTS SYSTEM
// =============================================================

export interface DailyQuest {
  id: string;
  type: 'answer_questions' | 'reach_streak' | 'defeat_boss' | 'earn_xp';
  title: string;
  description: string;
  target: number;
  current: number;
  rewardXp: number;
  rewardGeo: number;
  claimed: boolean;
  icon: string;
}

export interface DailyQuestsState {
  dateStr: string; // YYYY-MM-DD
  quests: DailyQuest[];
}

export function generateDailyQuests(dateStr?: string): DailyQuestsState {
  const date = dateStr || new Date().toISOString().split('T')[0];
  return {
    dateStr: date,
    quests: [
      {
        id: 'quest_answer_5',
        type: 'answer_questions',
        title: 'Battle Practice',
        description: 'Answer 5 battle questions correctly',
        target: 5,
        current: 0,
        rewardXp: 60,
        rewardGeo: 30,
        claimed: false,
        icon: '⚔️'
      },
      {
        id: 'quest_streak_3',
        type: 'reach_streak',
        title: 'Combo Mastery',
        description: 'Achieve a 3-question combo streak in battle',
        target: 3,
        current: 0,
        rewardXp: 75,
        rewardGeo: 40,
        claimed: false,
        icon: '🔥'
      },
      {
        id: 'quest_defeat_boss',
        type: 'defeat_boss',
        title: 'Colossus Hunter',
        description: 'Defeat 1 stage boss in the arena',
        target: 1,
        current: 0,
        rewardXp: 120,
        rewardGeo: 80,
        claimed: false,
        icon: '👑'
      },
      {
        id: 'quest_earn_100_xp',
        type: 'earn_xp',
        title: 'Scholar’s Ambition',
        description: 'Earn 100 total XP today across all modes',
        target: 100,
        current: 0,
        rewardXp: 80,
        rewardGeo: 50,
        claimed: false,
        icon: '📜'
      }
    ]
  };
}

export function updateDailyQuestProgress(
  current: DailyQuestsState,
  type: 'answer_questions' | 'reach_streak' | 'defeat_boss' | 'earn_xp',
  amount: number = 1
): DailyQuestsState {
  const updatedQuests = current.quests.map(quest => {
    if (quest.type !== type || quest.claimed) return quest;

    let nextCurrent = quest.current;
    if (type === 'reach_streak') {
      nextCurrent = Math.max(nextCurrent, amount);
    } else {
      nextCurrent = Math.min(quest.target, nextCurrent + amount);
    }

    return { ...quest, current: nextCurrent };
  });

  return { ...current, quests: updatedQuests };
}

// =============================================================
// 5. ACHIEVEMENTS SYSTEM
// =============================================================

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'combat' | 'learning' | 'progression' | 'streak';
  target: number;
  current: number;
  isUnlocked: boolean;
  isClaimed: boolean;
  rewardXp: number;
  rewardGeo: number;
  icon: string;
}

export const ACHIEVEMENTS_CATALOG: Achievement[] = [
  {
    id: 'ach_first_blood',
    title: 'First Blood',
    description: 'Answer your first battle question correctly in the arena',
    category: 'combat',
    target: 1,
    current: 0,
    isUnlocked: false,
    isClaimed: false,
    rewardXp: 50,
    rewardGeo: 25,
    icon: '🩸'
  },
  {
    id: 'ach_combo_novice',
    title: 'Combo Novice',
    description: 'Reach a 3-question combo streak in battle',
    category: 'combat',
    target: 3,
    current: 0,
    isUnlocked: false,
    isClaimed: false,
    rewardXp: 75,
    rewardGeo: 40,
    icon: '⚡'
  },
  {
    id: 'ach_combo_master',
    title: 'Ultra Combo Master',
    description: 'Reach an 8-question combo streak in battle',
    category: 'combat',
    target: 8,
    current: 0,
    isUnlocked: false,
    isClaimed: false,
    rewardXp: 200,
    rewardGeo: 100,
    icon: '🔥'
  },
  {
    id: 'ach_boss_slayer',
    title: 'Boss Slayer',
    description: 'Defeat your first stage boss in the arena',
    category: 'combat',
    target: 1,
    current: 0,
    isUnlocked: false,
    isClaimed: false,
    rewardXp: 150,
    rewardGeo: 100,
    icon: '⚔️'
  },
  {
    id: 'ach_boss_legend',
    title: 'Demigod Vanquisher',
    description: 'Defeat 5 stage bosses across your campaign',
    category: 'combat',
    target: 5,
    current: 0,
    isUnlocked: false,
    isClaimed: false,
    rewardXp: 500,
    rewardGeo: 300,
    icon: '👑'
  },
  {
    id: 'ach_flawless_victory',
    title: 'Flawless Victor',
    description: 'Clear a stage trial without taking any damage',
    category: 'combat',
    target: 1,
    current: 0,
    isUnlocked: false,
    isClaimed: false,
    rewardXp: 250,
    rewardGeo: 150,
    icon: '🛡️'
  },
  {
    id: 'ach_diagnostic_ace',
    title: 'Diagnostic Ace',
    description: 'Complete a full 10-question course diagnostic assessment',
    category: 'learning',
    target: 1,
    current: 0,
    isUnlocked: false,
    isClaimed: false,
    rewardXp: 100,
    rewardGeo: 50,
    icon: '📖'
  },
  {
    id: 'ach_apex_scholar',
    title: 'Apex Scholar',
    description: 'Calibrate at Advanced Skill Tier (8-10 correct in diagnostic)',
    category: 'learning',
    target: 1,
    current: 0,
    isUnlocked: false,
    isClaimed: false,
    rewardXp: 300,
    rewardGeo: 200,
    icon: '🎓'
  },
  {
    id: 'ach_class_adept',
    title: 'Class Adept',
    description: 'Upgrade any Character Class to Level 3 or higher',
    category: 'progression',
    target: 3,
    current: 1,
    isUnlocked: false,
    isClaimed: false,
    rewardXp: 150,
    rewardGeo: 100,
    icon: '🧙'
  },
  {
    id: 'ach_class_master',
    title: 'Master of Abilities',
    description: 'Upgrade any Character Class to max Level 10',
    category: 'progression',
    target: 10,
    current: 1,
    isUnlocked: false,
    isClaimed: false,
    rewardXp: 500,
    rewardGeo: 350,
    icon: '🌟'
  },
  {
    id: 'ach_streak_3',
    title: 'Flame Ignited',
    description: 'Maintain a 3-day continuous learning streak',
    category: 'streak',
    target: 3,
    current: 1,
    isUnlocked: false,
    isClaimed: false,
    rewardXp: 150,
    rewardGeo: 100,
    icon: '🕯️'
  },
  {
    id: 'ach_skill_pioneer',
    title: 'Skill Tree Pioneer',
    description: 'Unlock at least 3 perks in the RPG Skill Tree',
    category: 'progression',
    target: 3,
    current: 0,
    isUnlocked: false,
    isClaimed: false,
    rewardXp: 200,
    rewardGeo: 100,
    icon: '🌳'
  }
];

export function updateAchievementProgress(
  achievements: Achievement[],
  achievementId: string,
  progress: number,
  isAbsolute: boolean = false
): { updated: Achievement[]; newlyUnlocked?: Achievement } {
  let newlyUnlocked: Achievement | undefined;

  const updated = achievements.map(ach => {
    if (ach.id !== achievementId || ach.isUnlocked) return ach;

    const nextCurrent = isAbsolute ? progress : ach.current + progress;
    const isUnlocked = nextCurrent >= ach.target;

    if (isUnlocked && !ach.isUnlocked) {
      newlyUnlocked = { ...ach, current: nextCurrent, isUnlocked: true };
      return newlyUnlocked;
    }

    return { ...ach, current: nextCurrent };
  });

  return { updated, newlyUnlocked };
}

// =============================================================
// 6. PERSISTENT STORAGE HELPERS
// =============================================================

const STORAGE_KEYS = {
  TOTAL_XP: 'questlearn_rpg_total_xp',
  SKILL_TREE: 'questlearn_rpg_unlocked_skills',
  DAILY_QUESTS: 'questlearn_rpg_daily_quests',
  DAILY_STREAK: 'questlearn_rpg_daily_streak',
  ACHIEVEMENTS: 'questlearn_rpg_achievements'
};

export function loadTotalXp(defaultXp: number = 0): number {
  if (typeof window === 'undefined') return defaultXp;
  try {
    const val = localStorage.getItem(STORAGE_KEYS.TOTAL_XP);
    return val !== null ? parseInt(val, 10) : defaultXp;
  } catch (e) {
    return defaultXp;
  }
}

export function saveTotalXp(xp: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.TOTAL_XP, xp.toString());
  } catch (e) {}
}

export function loadUnlockedSkillNodes(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const val = localStorage.getItem(STORAGE_KEYS.SKILL_TREE);
    return val ? JSON.parse(val) : [];
  } catch (e) {
    return [];
  }
}

export function saveUnlockedSkillNodes(nodes: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SKILL_TREE, JSON.stringify(nodes));
  } catch (e) {}
}

export function loadDailyStreakState(): DailyStreakState {
  if (typeof window === 'undefined') return DEFAULT_DAILY_STREAK;
  try {
    const val = localStorage.getItem(STORAGE_KEYS.DAILY_STREAK);
    if (!val) return DEFAULT_DAILY_STREAK;
    const parsed = JSON.parse(val);
    const { state } = updateDailyStreak(parsed);
    return state;
  } catch (e) {
    return DEFAULT_DAILY_STREAK;
  }
}

export function saveDailyStreakState(state: DailyStreakState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_STREAK, JSON.stringify(state));
  } catch (e) {}
}

export function loadDailyQuestsState(): DailyQuestsState {
  const today = new Date().toISOString().split('T')[0];
  if (typeof window === 'undefined') return generateDailyQuests(today);
  try {
    const val = localStorage.getItem(STORAGE_KEYS.DAILY_QUESTS);
    if (!val) return generateDailyQuests(today);
    const parsed: DailyQuestsState = JSON.parse(val);
    if (parsed.dateStr !== today) {
      return generateDailyQuests(today);
    }
    return parsed;
  } catch (e) {
    return generateDailyQuests(today);
  }
}

export function saveDailyQuestsState(state: DailyQuestsState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_QUESTS, JSON.stringify(state));
  } catch (e) {}
}

export function loadAchievementsState(): Achievement[] {
  if (typeof window === 'undefined') return ACHIEVEMENTS_CATALOG;
  try {
    const val = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (!val) return ACHIEVEMENTS_CATALOG;
    const stored: Partial<Achievement>[] = JSON.parse(val);
    return ACHIEVEMENTS_CATALOG.map(cat => {
      const match = stored.find(s => s.id === cat.id);
      return match ? { ...cat, ...match } : cat;
    });
  } catch (e) {
    return ACHIEVEMENTS_CATALOG;
  }
}

export function saveAchievementsState(achievements: Achievement[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  } catch (e) {}
}
