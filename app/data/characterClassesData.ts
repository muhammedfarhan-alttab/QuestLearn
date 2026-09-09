// Character Class System Data & Progression Formulas (Levels 1 - 10)

export type CharacterClassId = 'healer' | 'warrior' | 'guardian' | 'mage' | 'immortal';

export interface CharacterClassLevelStats {
  level: number;
  vitalityHp: number; // 10 Max Hearts
  attackRating: number;
  defenseRating: number;
  xpRating: number;
  // Specific passive metric for this level:
  primaryValue: number; // e.g. 20% -> 60% for Healer, 25% -> 75% for Warrior, etc.
  primaryLabel: string;
  effectDescription: string;
  shortTag: string;
}

export interface CharacterClassConfig {
  id: CharacterClassId;
  name: string;
  title: string;
  role: string;
  archetype: string;
  lore: string;
  quote: string;
  accentColor: string;
  themeGradient: string;
  badgeBg: string;
  iconSymbol: string;
  abilityName: string;
  abilityTagline: string;
  baseHp: number;
  // Formula helpers
  getStatsForLevel: (level: number) => CharacterClassLevelStats;
  getUpgradeCost: (currentLevel: number) => number | null; // null if MAX (10)
}

// Upgrade Coin (Geo) Costs for Level 1 through 10
export const CLASS_UPGRADE_COSTS: Record<number, number> = {
  1: 75,    // Level 1 -> 2
  2: 150,   // Level 2 -> 3
  3: 250,   // Level 3 -> 4
  4: 400,   // Level 4 -> 5
  5: 600,   // Level 5 -> 6
  6: 850,   // Level 6 -> 7
  7: 1150,  // Level 7 -> 8
  8: 1500,  // Level 8 -> 9
  9: 2000,  // Level 9 -> 10
};

export const MAX_CLASS_LEVEL = 10;

// Helper to calculate linear progression between Level 1 (min) and Level 10 (max)
export function calculateLinearStat(level: number, minVal: number, maxVal: number, decimals: number = 1): number {
  const clampedLevel = Math.max(1, Math.min(MAX_CLASS_LEVEL, level));
  const raw = minVal + ((clampedLevel - 1) * (maxVal - minVal)) / (MAX_CLASS_LEVEL - 1);
  const factor = Math.pow(10, decimals);
  return Math.round(raw * factor) / factor;
}

export const CHARACTER_CLASSES: Record<CharacterClassId, CharacterClassConfig> = {
  healer: {
    id: 'healer',
    name: 'Healer',
    title: 'Divine Medic',
    role: 'Sustain & Vitality Restoration',
    archetype: 'Sacred Blossom',
    lore: 'Trained in advanced Kaidō (healing arts) and Unohana’s compassionate discipline. Infuses spiritual vitality into every correct calculation, mending shattered resolve and preserving stamina.',
    quote: '“To heal is not merely to mend flesh, but to restore unwavering faith in victory.”',
    accentColor: '#10b981',
    themeGradient: 'from-emerald-500 via-teal-500 to-green-600',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    iconSymbol: '💚',
    abilityName: 'Divine Rejuvenation',
    abilityTagline: 'Hearts recovery after correct answers',
    baseHp: 10,
    getStatsForLevel: (level: number) => {
      const healPercent = calculateLinearStat(level, 20, 60, 1);
      const attackRating = Math.round(calculateLinearStat(level, 40, 70, 0));
      const defenseRating = Math.round(calculateLinearStat(level, 60, 95, 0));
      const xpRating = Math.round(calculateLinearStat(level, 50, 75, 0));

      return {
        level,
        vitalityHp: 10,
        attackRating,
        defenseRating,
        xpRating,
        primaryValue: healPercent,
        primaryLabel: `+${healPercent}% Heal Rate`,
        effectDescription: `+${healPercent}% chance to trigger Divine Rejuvenation, restoring bonus Hearts on correct answers (max 10 Hearts).`,
        shortTag: `+${healPercent}% Heal`
      };
    },
    getUpgradeCost: (currentLevel: number) => {
      if (currentLevel >= MAX_CLASS_LEVEL) return null;
      return CLASS_UPGRADE_COSTS[currentLevel] || 500;
    }
  },

  warrior: {
    id: 'warrior',
    name: 'Warrior',
    title: 'Vanguard Berserker',
    role: 'Heavy Strike & Boss Cleave',
    archetype: 'Cataclysmic Edge',
    lore: 'Forged in the fires of relentless battle. Every correct deduction becomes a devastating Zanpakuto cleave that tears through boss defenses and shatters high-HP barriers.',
    quote: '“Hesitation invites defeat. Step forward and cleave their doubt into dust!”',
    accentColor: '#ef4444',
    themeGradient: 'from-red-500 via-rose-600 to-orange-600',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
    iconSymbol: '⚔️',
    abilityName: 'Vanguard Cleave',
    abilityTagline: 'Bonus damage against bosses',
    baseHp: 10,
    getStatsForLevel: (level: number) => {
      const bonusDmgPercent = calculateLinearStat(level, 25, 75, 1);
      const attackRating = Math.round(calculateLinearStat(level, 70, 100, 0));
      const defenseRating = Math.round(calculateLinearStat(level, 50, 80, 0));
      const xpRating = Math.round(calculateLinearStat(level, 45, 70, 0));

      return {
        level,
        vitalityHp: 10,
        attackRating,
        defenseRating,
        xpRating,
        primaryValue: bonusDmgPercent,
        primaryLabel: `+${bonusDmgPercent}% Boss DMG`,
        effectDescription: `Deals +${bonusDmgPercent}% bonus damage against bosses on all correct strikes.`,
        shortTag: `+${bonusDmgPercent}% Boss DMG`
      };
    },
    getUpgradeCost: (currentLevel: number) => {
      if (currentLevel >= MAX_CLASS_LEVEL) return null;
      return CLASS_UPGRADE_COSTS[currentLevel] || 500;
    }
  },

  guardian: {
    id: 'guardian',
    name: 'Guardian',
    title: 'Aegis Bulwark',
    role: 'Damage Mitigation & Iron Defense',
    archetype: 'Indomitable Shield',
    lore: 'An unbreakable fortress of composure. When missteps occur, the Guardian’s crystalline barrier absorbs the shock, dramatically dampening boss counter-attacks so you remain standing.',
    quote: '“No storm can crack a fortress anchored in patience and resolve.”',
    accentColor: '#0ea5e9',
    themeGradient: 'from-sky-500 via-cyan-500 to-blue-600',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    iconSymbol: '🛡️',
    abilityName: 'Aegis Bastion',
    abilityTagline: 'Wrong answers reduce less Hearts',
    baseHp: 10,
    getStatsForLevel: (level: number) => {
      const mitigationPercent = calculateLinearStat(level, 25, 70, 1);
      const attackRating = Math.round(calculateLinearStat(level, 45, 65, 0));
      const defenseRating = Math.round(calculateLinearStat(level, 75, 100, 0));
      const xpRating = Math.round(calculateLinearStat(level, 50, 75, 0));

      return {
        level,
        vitalityHp: 10,
        attackRating,
        defenseRating,
        xpRating,
        primaryValue: mitigationPercent,
        primaryLabel: `-${mitigationPercent}% DMG Taken`,
        effectDescription: `Reduces damage taken on wrong answers and boss strikes by ${mitigationPercent}%.`,
        shortTag: `-${mitigationPercent}% Damage`
      };
    },
    getUpgradeCost: (currentLevel: number) => {
      if (currentLevel >= MAX_CLASS_LEVEL) return null;
      return CLASS_UPGRADE_COSTS[currentLevel] || 500;
    }
  },

  mage: {
    id: 'mage',
    name: 'Mage',
    title: 'Astral Scholar',
    role: 'XP Amplification & Wisdom',
    archetype: 'Arcane Transmutation',
    lore: 'Master of arcane equations and cosmic resonance. Transmutes test answers into vast cascades of Knowledge XP and bonus Geo, rapidly accelerating progression and mastery levels.',
    quote: '“Knowledge is the only currency that multiplies exponentially when expended.”',
    accentColor: '#8b5cf6',
    themeGradient: 'from-purple-500 via-violet-500 to-indigo-600',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    iconSymbol: '🔮',
    abilityName: 'Arcane Wisdom',
    abilityTagline: 'Earn extra XP & Geo',
    baseHp: 10,
    getStatsForLevel: (level: number) => {
      const extraXpPercent = calculateLinearStat(level, 30, 120, 0);
      const attackRating = Math.round(calculateLinearStat(level, 60, 85, 0));
      const defenseRating = Math.round(calculateLinearStat(level, 40, 65, 0));
      const xpRating = Math.round(calculateLinearStat(level, 80, 100, 0));

      return {
        level,
        vitalityHp: 10,
        attackRating,
        defenseRating,
        xpRating,
        primaryValue: extraXpPercent,
        primaryLabel: `+${extraXpPercent}% Extra XP`,
        effectDescription: `Earns +${extraXpPercent}% extra XP and bonus Geo from all correct answers and stage tests.`,
        shortTag: `+${extraXpPercent}% XP Gain`
      };
    },
    getUpgradeCost: (currentLevel: number) => {
      if (currentLevel >= MAX_CLASS_LEVEL) return null;
      return CLASS_UPGRADE_COSTS[currentLevel] || 500;
    }
  },

  immortal: {
    id: 'immortal',
    name: 'Immortal',
    title: 'Sovereign Phoenix',
    role: 'Death Defiance & Error Nullification',
    archetype: 'Celestial Ward',
    lore: 'A timeless entity touched by the Hōgyoku. Holds absolute dominion over fatal mistakes; battle errors bounce harmlessly off the Immortal’s celestial shroud as if they never happened.',
    quote: '“To err is mortal; to rise completely unscathed is divine.”',
    accentColor: '#f59e0b',
    themeGradient: 'from-amber-400 via-yellow-500 to-orange-500',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    iconSymbol: '👑',
    abilityName: 'Immortal Aegis',
    abilityTagline: 'First wrong answer causes no Heart loss',
    baseHp: 10,
    getStatsForLevel: (level: number) => {
      const negatedErrors = level >= 10 ? 2 : 1;
      const secondaryChance = level >= 10 ? 50 : level >= 5 ? 35 : 0;
      const attackRating = Math.round(calculateLinearStat(level, 65, 90, 0));
      const defenseRating = Math.round(calculateLinearStat(level, 70, 95, 0));
      const xpRating = Math.round(calculateLinearStat(level, 55, 80, 0));

      const desc = level >= 10
        ? 'First 2 wrong answers in battle cause 0 Heart loss! (+50% ward on subsequent errors).'
        : level >= 5
        ? `First wrong answer causes 0 Heart loss! (+${secondaryChance}% ward on 2nd error).`
        : 'First wrong answer in battle causes 0 Heart loss!';

      return {
        level,
        vitalityHp: 10,
        attackRating,
        defenseRating,
        xpRating,
        primaryValue: negatedErrors,
        primaryLabel: `${negatedErrors} Error${negatedErrors > 1 ? 's' : ''} Nullified`,
        effectDescription: desc,
        shortTag: level >= 10 ? '2 Errors Negated' : '1 Error Negated'
      };
    },
    getUpgradeCost: (currentLevel: number) => {
      if (currentLevel >= MAX_CLASS_LEVEL) return null;
      return CLASS_UPGRADE_COSTS[currentLevel] || 500;
    }
  }
};

export const CHARACTER_CLASS_LIST: CharacterClassConfig[] = Object.values(CHARACTER_CLASSES);
