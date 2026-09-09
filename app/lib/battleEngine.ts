/**
 * Battle Engine for QuestLearn Vitality System
 * 
 * Provides pure, deterministic functions to guarantee:
 * 1. Player Hearts can never drop below 0 or exceed MAX_PLAYER_HEARTS (10).
 * 2. Display strings are always valid ("Hearts: 8/10").
 * 3. Defeat is strictly triggered when Hearts reach 0.
 * 4. Revive mechanics (Ulquiorra Death Defiance & Phoenix Rebirth) operate reliably.
 */

export const MAX_PLAYER_HEARTS = 10;
export const MAX_PLAYER_HP = 10;
export const DEFAULT_REVIVE_HEARTS = 5;
export const DEFAULT_REVIVE_HP = 5;
export const PHOENIX_REVIVE_GEO_COST = 50;

/**
 * Clamps Hearts strictly between 0 and maxHp.
 * Guarantees a non-negative integer. Handles NaN/undefined gracefully.
 */
export function clampHp(hp: number, maxHp: number = MAX_PLAYER_HEARTS): number {
  if (typeof hp !== 'number' || isNaN(hp)) {
    return 0;
  }
  return Math.max(0, Math.min(maxHp, Math.round(hp)));
}

export const clampHearts = clampHp;

/**
 * Formats Hearts display string cleanly.
 * Guarantees no negative numbers, NaN, or corrupted values.
 * Example: formatHeartsDisplay(8) -> "Hearts: 8/10"
 */
export function formatHeartsDisplay(hearts: number, maxHearts: number = MAX_PLAYER_HEARTS): string {
  const safeHearts = clampHp(hearts, maxHearts);
  return `Hearts: ${safeHearts}/${maxHearts}`;
}

export function formatHpDisplay(hp: number, maxHp: number = MAX_PLAYER_HEARTS): string {
  return formatHeartsDisplay(hp, maxHp);
}

/**
 * Checks if the player is in a defeated state (Hearts <= 0).
 */
export function isDefeated(hp: number): boolean {
  return clampHp(hp) === 0;
}

/**
 * Calculates healed Hearts, guaranteeing the total cannot exceed maxHp.
 */
export function calculateHeal(currentHp: number, healAmount: number, maxHp: number = MAX_PLAYER_HEARTS): {
  nextHp: number;
  actualHealed: number;
} {
  const safeCurrent = clampHp(currentHp, maxHp);
  const safeHeal = Math.max(0, Math.round(healAmount));
  const nextHp = Math.min(maxHp, safeCurrent + safeHeal);
  return {
    nextHp,
    actualHealed: nextHp - safeCurrent
  };
}

export const STAGE_5_PHASE2_BURST_DAMAGE = 2; // Unavoidable Sovereign Reiatsu Shockwave at Stage 5 Phase 2

export interface DamageCalculationParams {
  bossDifficultyLabel?: string;
  bossPhase?: number;
  baseDamage?: number;
  stageNumber?: number; // 1 (Introductory) to 5 (Final Apex Boss)
  bossDamagePerStrike?: number; // Configured base damage from boss data
  heroId?: string;
  guardianMitigationPct?: number; // 25 to 70
  immortalShieldsRemaining?: number;
  randomRoll?: number; // Optional injection for deterministic testing
}

export interface DamageCalculationResult {
  damageDealt: number;
  isCompletelyNullified: boolean;
  nullifiedReason?: string;
  mitigationText?: string;
}

/**
 * Pure calculation of incoming boss strike damage factoring in class passives, stage scaling, and hero traits.
 */
export function calculateIncomingDamage(params: DamageCalculationParams): DamageCalculationResult {
  const {
    bossDifficultyLabel = 'Intermediate',
    bossPhase = 1,
    baseDamage,
    stageNumber,
    bossDamagePerStrike,
    heroId,
    guardianMitigationPct = 0,
    immortalShieldsRemaining = 0,
    randomRoll = Math.random()
  } = params;

  // 1. Progressive damage determination in Hearts
  let damage = baseDamage ?? 1;
  if (baseDamage === undefined) {
    if (stageNumber === 5 || bossDifficultyLabel === 'Supreme Boss') {
      // Stage 5 Apex Final Boss: 3 Hearts in Phase 1, 4 Hearts in Phase 2!
      damage = bossPhase === 2 ? 4 : 3;
    } else if (stageNumber === 4 || bossDifficultyLabel === 'Advanced') {
      // Stage 4: 2 Hearts in Phase 1, 3 Hearts in Phase 2
      damage = bossPhase === 2 ? 3 : 2;
    } else if (stageNumber === 3) {
      // Stage 3: 2 Hearts in both phases
      damage = 2;
    } else if (stageNumber === 2) {
      // Stage 2: 1 Heart in Phase 1, 2 Hearts in Phase 2
      damage = bossPhase === 2 ? 2 : 1;
    } else if (stageNumber === 1) {
      // Stage 1: 1 Heart in both phases
      damage = 1;
    } else if (bossPhase === 2 && (bossDifficultyLabel === 'Advanced' || bossDifficultyLabel === 'Supreme Boss')) {
      damage = 2;
    } else {
      damage = 1;
    }

    if (typeof bossDamagePerStrike === 'number' && bossDamagePerStrike > damage) {
      damage = bossDamagePerStrike;
    }
  }

  // 2. Immortal Class Nullification (First 1-2 errors in battle cause 0 Hearts lost)
  if (immortalShieldsRemaining > 0) {
    return {
      damageDealt: 0,
      isCompletelyNullified: true,
      nullifiedReason: 'Immortal Aegis absorbed the strike (0 Hearts lost)'
    };
  }

  // 3. Guardian Class Mitigation (-25% to -70%)
  if (guardianMitigationPct > 0) {
    const fullAbsorbChance = guardianMitigationPct / 100;
    if (randomRoll < fullAbsorbChance) {
      return {
        damageDealt: 0,
        isCompletelyNullified: true,
        nullifiedReason: `Guardian Aegis fully absorbed damage (-${guardianMitigationPct}%)`
      };
    } else if (damage > 1) {
      damage = Math.max(1, Math.round(damage * (1 - guardianMitigationPct / 100)));
    }
  }

  // 4. Hero Specific Mitigations
  if (heroId === 'yoruichi' && randomRoll < 0.40) {
    return {
      damageDealt: 0,
      isCompletelyNullified: true,
      nullifiedReason: 'Flash Mirage completely evaded damage'
    };
  }

  if (heroId === 'yamamoto') {
    if (randomRoll < 0.65) {
      return {
        damageDealt: 0,
        isCompletelyNullified: true,
        nullifiedReason: 'Solar Cloak vaporized incoming strike'
      };
    } else {
      damage = 1;
    }
  }

  if (heroId === 'shunsui' && randomRoll < 0.35) {
    return {
      damageDealt: 0,
      isCompletelyNullified: true,
      nullifiedReason: 'Shadow Slip avoided the strike'
    };
  }

  if (heroId === 'renji') {
    damage = 1;
  }

  if (heroId === 'kenpachi') {
    damage = 1;
  }

  if (heroId === 'rukia') {
    damage = Math.max(1, Math.round(damage * 0.5));
  }

  if (heroId === 'urahara' && randomRoll < 0.35) {
    return {
      damageDealt: 0,
      isCompletelyNullified: true,
      nullifiedReason: 'Blood Mist Shield deflected attack'
    };
  }

  if (heroId === 'aizen' && randomRoll < 0.25) {
    return {
      damageDealt: 0,
      isCompletelyNullified: true,
      nullifiedReason: 'Kyoka Suigetsu illusion decoy'
    };
  }

  return {
    damageDealt: Math.max(0, damage),
    isCompletelyNullified: false
  };
}

export interface ApplyDamageParams {
  currentHp: number;
  damageDealt: number;
  heroId?: string;
  deathDefianceUsed?: boolean;
}

export interface ApplyDamageResult {
  nextHp: number;
  actualDamage: number;
  defiedDeath: boolean;
  isDefeated: boolean;
}

/**
 * Applies incoming damage to current Hearts with strict clamping and Death Defiance logic.
 * Guarantees nextHp is NEVER negative.
 */
export function applyDamageWithRevive(params: ApplyDamageParams): ApplyDamageResult {
  const { currentHp, damageDealt, heroId, deathDefianceUsed = false } = params;
  const safeCurrent = clampHp(currentHp);

  // If damage is zero or negative
  if (damageDealt <= 0) {
    return {
      nextHp: safeCurrent,
      actualDamage: 0,
      defiedDeath: false,
      isDefeated: safeCurrent === 0
    };
  }

  const rawRemaining = safeCurrent - damageDealt;

  // Ulquiorra Hero: Death Defiance (once per battle, fatal damage leaves player at 1 Heart)
  if (heroId === 'ulquiorra_hero' && !deathDefianceUsed && rawRemaining <= 0 && safeCurrent > 0) {
    const survivalHp = 1;
    return {
      nextHp: survivalHp,
      actualDamage: safeCurrent - survivalHp,
      defiedDeath: true,
      isDefeated: false
    };
  }

  const nextHp = clampHp(rawRemaining);
  return {
    nextHp,
    actualDamage: safeCurrent - nextHp,
    defiedDeath: false,
    isDefeated: nextHp === 0
  };
}

export interface PhoenixReviveParams {
  currentGeo: number;
  isImmortalClass?: boolean;
  freeReviveAvailable?: boolean;
  reviveCost?: number;
  reviveHp?: number;
}

export interface PhoenixReviveResult {
  success: boolean;
  nextHp: number;
  nextGeo: number;
  usedFreeRevive: boolean;
  error?: string;
}

/**
 * Handles Phoenix Revive from the defeat screen.
 * Restores 5 Hearts either using 1 Free Immortal Rebirth or spending 50 Geo.
 */
export function executeRevive(params: PhoenixReviveParams): PhoenixReviveResult {
  const {
    currentGeo,
    isImmortalClass = false,
    freeReviveAvailable = false,
    reviveCost = PHOENIX_REVIVE_GEO_COST,
    reviveHp = DEFAULT_REVIVE_HEARTS
  } = params;

  // 1. Free Immortal Class Revive
  if (isImmortalClass && freeReviveAvailable) {
    return {
      success: true,
      nextHp: clampHp(reviveHp),
      nextGeo: Math.max(0, currentGeo),
      usedFreeRevive: true
    };
  }

  // 2. Paid Geo Revive
  if (currentGeo >= reviveCost) {
    return {
      success: true,
      nextHp: clampHp(reviveHp),
      nextGeo: currentGeo - reviveCost,
      usedFreeRevive: false
    };
  }

  return {
    success: false,
    nextHp: 0,
    nextGeo: currentGeo,
    usedFreeRevive: false,
    error: `Need ${reviveCost - currentGeo} more Geo to revive`
  };
}
