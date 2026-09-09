export type CharacterClassId = 'healer' | 'warrior' | 'guardian' | 'mage' | 'immortal';

export type BleachHeroId =
  | 'ichigo'
  | 'rukia'
  | 'kenpachi'
  | 'byakuya'
  | 'urahara'
  | 'aizen'
  | 'toshiro'
  | 'ulquiorra_hero'
  | 'yoruichi'
  | 'renji'
  | 'shunsui'
  | 'yamamoto';

export interface ClanMetadata {
  id: CharacterClassId;
  name: string;
  badgeLabel: string;
  iconSymbol: string;
  accentColor: string;
  badgeBg: string;
  description: string;
}

export const CLAN_METADATA: Record<CharacterClassId, ClanMetadata> = {
  warrior: {
    id: 'warrior',
    name: 'Warrior Clan',
    badgeLabel: 'WARRIOR',
    iconSymbol: '⚔️',
    accentColor: '#ef4444',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
    description: 'Masters of aggressive offensive strikes, high critical damage, and relentless blade mastery.'
  },
  guardian: {
    id: 'guardian',
    name: 'Guardian Clan',
    badgeLabel: 'GUARDIAN',
    iconSymbol: '🛡️',
    accentColor: '#3b82f6',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    description: 'Immovable wardens with impenetrable defense barriers and lethal counter-strike parries.'
  },
  mage: {
    id: 'mage',
    name: 'Mage Clan',
    badgeLabel: 'MAGE',
    iconSymbol: '🔮',
    accentColor: '#a855f7',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    description: 'Prodigious scholars of Kido demon arts, elemental ice & spatial threads, generating immense XP and Geo.'
  },
  healer: {
    id: 'healer',
    name: 'Healer Clan',
    badgeLabel: 'HEALER',
    iconSymbol: '💚',
    accentColor: '#10b981',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Holders of high-speed cellular regeneration, converting academic accuracy directly into vital HP recovery.'
  },
  immortal: {
    id: 'immortal',
    name: 'Immortal Clan',
    badgeLabel: 'IMMORTAL',
    iconSymbol: '👑',
    accentColor: '#eab308',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description: 'Transcendent sovereigns immune to single-hit defeats, defying death with ancient divine authority.'
  }
};

/**
 * Authoritative Clan assignments for all 12 heroes based on Bleach lore and combat style.
 */
export const CHARACTER_CLAN_MAP: Record<BleachHeroId, CharacterClassId> = {
  // Warrior Clan: High physical impact, blade supremacy, and close-quarters rush
  ichigo: 'warrior',          // Tensa Zangetsu & Getsuga Tensho blade rush (Starter)
  kenpachi: 'warrior',        // Unstoppable berserker with Nozarashi raw physical cut
  yoruichi: 'warrior',        // Flash Goddess, master of Hakuda and Shunko physical devastation
  shunsui: 'warrior',         // Dual blade master wielding Katen Kyokotsu game-strikes

  // Guardian Clan: Defensive bulwarks, petal shields, and bone armor
  renji: 'guardian',          // Hihio Zabimaru bone snake armor & physical defense
  byakuya: 'guardian',        // Senbonzakura impenetrable razor petal barrier & Gokei shield

  // Mage Clan: Mastery of Kido demon arts, elemental incantations, and tactical brilliance
  rukia: 'mage',              // Sode no Shirayuki cryomancy, dance forms, Hakuren Kido
  toshiro: 'mage',            // Daiguren Hyorinmaru ice dragon, atmospheric moisture manipulation
  urahara: 'mage',            // SRDI founder, master of Bakudo/Hado 90+ and Benihime constructs

  // Healer Clan: High-speed cellular regeneration & vitality restoration
  ulquiorra_hero: 'healer',   // Instant High-Speed Cellular Regeneration (Chousoku Saisei, +10 HP)

  // Immortal Clan: Transcendent immortality, divine longevity, and unyielding will
  aizen: 'immortal',          // Hogyoku fused transcendent entity with indestructible physical immortality
  yamamoto: 'immortal'        // 1,000-year supreme commander, 15,000,000° Zanka no Tachi solar armor & resurrection
};

/**
 * Authoritative calculated power ratings for all 12 characters.
 * Calibrated against their canonical Bleach tiering from 500 (starter) to 990 (head captain).
 */
export const CHARACTER_POWER_RATINGS: Record<BleachHeroId, number> = {
  ichigo: 500,          // Starter - Balanced striker
  rukia: 540,           // Junior Captain / Lieutenant with Absolute Zero Hakuren
  renji: 580,           // Vanguard Lieutenant with Bankai bone armor
  toshiro: 680,         // Young Prodigy Captain with Bankai ice dragon
  kenpachi: 720,        // Berserker Captain with supreme raw physical cut
  byakuya: 740,         // Senior Noble Captain with Senbonzakura razor wall
  ulquiorra_hero: 760,  // 4th Espada Resurrección with instant cellular regeneration
  yoruichi: 780,        // Flash Goddess with Hakuda & Raijin Senkei Shunko
  urahara: 820,         // SRDI Founder & master tactical inventor
  shunsui: 850,         // Senior Captain-Commander of Gotei 13
  aizen: 950,           // Hogyoku Transcendent Sovereign
  yamamoto: 990         // 1,000-Year Head Captain with Zanka no Tachi
};

/**
 * Authoritative power -> price scaling formula:
 * - Power <= 500 (Starter Ichigo): 0 Geo (Free starter hero)
 * - Power > 500: Smooth monotonic scaling based on power rating
 *   - Lower power (540 - 580): 120 - 170 Geo
 *   - Medium power (680 - 780): 310 - 470 Geo
 *   - High power (820 - 850): 540 - 590 Geo
 *   - Extremely high power (950 - 990): 780 - 850 Geo
 */
export function calculateCharacterPrice(powerRating: number): number {
  if (powerRating <= 500) {
    return 0; // Starter remains free
  }

  // Normalized between 500 (baseline) and 990 (peak)
  const normalized = (powerRating - 500) / (990 - 500); // Range: 0.0 to 1.0
  const scaled = 80 + Math.pow(normalized, 1.2) * 770;
  // Round to clean multiples of 10
  return Math.round(scaled / 10) * 10;
}

export interface CharacterPricingConfig {
  id: BleachHeroId;
  clanId: CharacterClassId;
  clan: ClanMetadata;
  powerRating: number;
  geoCost: number;
}

/**
 * Returns the complete authoritative pricing and clan configuration for a character.
 */
export function getCharacterPricingConfig(heroId: BleachHeroId): CharacterPricingConfig {
  const clanId = CHARACTER_CLAN_MAP[heroId] || 'warrior';
  const clan = CLAN_METADATA[clanId];
  const powerRating = CHARACTER_POWER_RATINGS[heroId] || 500;
  const geoCost = calculateCharacterPrice(powerRating);

  return {
    id: heroId,
    clanId,
    clan,
    powerRating,
    geoCost
  };
}

/**
 * Returns all 12 characters with their authoritative clan, power rating, and price.
 */
export function getAllCharacterPricingConfigs(): Record<BleachHeroId, CharacterPricingConfig> {
  const result: Partial<Record<BleachHeroId, CharacterPricingConfig>> = {};
  const heroIds: BleachHeroId[] = [
    'ichigo',
    'rukia',
    'kenpachi',
    'byakuya',
    'urahara',
    'aizen',
    'toshiro',
    'ulquiorra_hero',
    'yoruichi',
    'renji',
    'shunsui',
    'yamamoto'
  ];

  for (const id of heroIds) {
    result[id] = getCharacterPricingConfig(id);
  }

  return result as Record<BleachHeroId, CharacterPricingConfig>;
}
