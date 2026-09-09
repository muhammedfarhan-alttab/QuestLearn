import { BleachVillainConfig } from '../components/ProfileInspectionModal';

export const BLEACH_BOSS_CATALOG: Record<string, BleachVillainConfig> = {
  grand_fisher: {
    id: 'grand_fisher',
    name: 'Grand Fisher (Cursed Hollow)',
    title: 'Menacing Clawed Hollow // Karakura Terror',
    rank: 'Advanced Gillian Hollow (Aspect: Deception)',
    realm: 'KARAKURA TOWN // MEMORIAL CEMETERY',
    stageName: 'The Hollow Boundary Proving Ground',
    maxHp: 90,
    color: '#94a3b8',
    damagePerStrike: 1,
    difficultyLabel: 'Introductory',
    attackNameP1: 'Lure Decoy & Needle Claw Whip',
    attackNameP2: 'Cursed Claws of Memory',
    phase2Quote: '“You think you can see through my illusions? Die under my claws!”',
    phase2TransformationName: 'AWAKENED GILLIAN CLAWS',
    lore: 'A notorious Hollow that evaded Soul Reaper hunting for over fifty years using a shapeshifting lure. Attacks with piercing bone needles and deceptive maneuvers, punishing hesitations on fundamental definitions.',
    conceptVulnerability: 'Foundational Definitions, First Principles & Coordinate Vectors',
    recommendedHeroCounter: 'Ichigo Kurosaki or Rukia Kuchiki (Balanced Striker)',
    aspectOfDeath: 'Deception & Regret',
    demigodFelledTitle: 'HOLLOW EXORCISED',
    bgType: 'seireitei'
  },
  renji_boss: {
    id: 'renji_boss',
    name: 'Renji Abarai (Roar Zabimaru)',
    title: '6th Division Lieutenant // The Red Baboon',
    rank: 'Gotei 13 Lieutenant (Aspect: Tenacity)',
    realm: 'RUKONGAI // SOULS BARRIER GATE',
    stageName: 'Trial of the Segmented Iron Whip',
    maxHp: 120,
    color: '#ef4444',
    damagePerStrike: 1,
    difficultyLabel: 'Elementary',
    attackNameP1: 'Zabimaru Whip Slash',
    attackNameP2: 'Higa Zekkō (Baboon Bone Scatter)',
    phase2Quote: '“ROAR, ZABIMARU! I’ll show you the distance between our spiritual resolve!”',
    phase2TransformationName: 'HIGA ZEKKŌ AWAKENED',
    lore: 'Lieutenant of the 6th Division whose Zanpakuto extends into a jagged three-jointed whip blade capable of unpredictable long-range strikes and ground smashes.',
    conceptVulnerability: 'Vector Projections, Velocity Components & Chain Rule Slopes',
    recommendedHeroCounter: 'Byakuya Kuchiki (+10 HP Heal on streaks) or Renji Abarai',
    aspectOfDeath: 'Tenacity & Ambition',
    demigodFelledTitle: 'LIEUTENANT SURPASSED',
    bgType: 'seireitei'
  },
  grimmjow: {
    id: 'grimmjow',
    name: 'Grimmjow Jaegerjaquez',
    title: 'Sexta Espada (#6) // The Blue Panther',
    rank: 'Espada #6 (Aspect: Destruction)',
    realm: 'THE SEIREITEI // SOKYOKU EXECUTION HILL',
    stageName: 'Execution Cliff of the Phoenix',
    maxHp: 160,
    color: '#06b6d4',
    damagePerStrike: 2,
    difficultyLabel: 'Intermediate',
    attackNameP1: 'Garra de la Pantera & Cero',
    attackNameP2: 'Desgarrón (Emerald King Claws)',
    phase2Quote: '“You think you can look down on me, trash? GRIND, PANTERA!”',
    phase2TransformationName: 'RESURRECCIÓN: PANTERA',
    lore: 'The 6th Espada in Aizen’s army, representing Destruction. A lethal feline predator whose Desgarrón claws create giant blades of compressed spiritual energy that cleave reality.',
    conceptVulnerability: 'Multi-Variable Optimization, Friction Forces & Mean Value Theorem',
    recommendedHeroCounter: 'Tōshirō Hitsugaya (Frost Stun) or Rukia Kuchiki (50% Damage Cut)',
    aspectOfDeath: 'Destruction (Hakai)',
    demigodFelledTitle: 'ESPADA DEFEATED',
    bgType: 'seireitei'
  },
  szayelaporro: {
    id: 'szayelaporro',
    name: 'Szayelaporro Granz',
    title: 'Octava Espada (#8) // The Mad Scholar',
    rank: 'Espada #8 (Aspect: Madness)',
    realm: 'HUECO MUNDO // UNDERGROUND RESEARCH LAB',
    stageName: 'The Biological Recursive Matrix',
    maxHp: 200,
    color: '#ec4899',
    damagePerStrike: 2,
    difficultyLabel: 'Advanced',
    attackNameP1: 'Carbon Copy Spores & Purple Tentacles',
    attackNameP2: 'Teatro de Títere (Voodoo Doll Torment)',
    phase2Quote: '“Perfection is a delusion! True brilliance lies in boundless evolution: SIP, FORNICARÁS!”',
    phase2TransformationName: 'RESURRECCIÓN: FORNICARÁS',
    lore: 'The premier scientist of Hueco Mundo. Uses biological voodoo dolls, algorithmic parasite loops, and organ destruction to punish intellectual hesitation.',
    conceptVulnerability: 'Call Stacks, Binary Trees, Dijkstra Paths & Recursive Complexity',
    recommendedHeroCounter: 'Kisuke Urahara (35% Parry Deflect) or Ulquiorra (Cellular Regen)',
    aspectOfDeath: 'Madness & Obsession (Kyōki)',
    demigodFelledTitle: 'SCIENTIST PURGED',
    bgType: 'huecomundo'
  },
  ulquiorra: {
    id: 'ulquiorra',
    name: 'Ulquiorra Cifer',
    title: 'Cuarta Espada (#4) // The Bat of Despair',
    rank: 'Espada #4 (Aspect: Emptiness)',
    realm: 'HUECO MUNDO // DESERT OF LAS NOCHES',
    stageName: 'Tower of the Endless Crescent Moon',
    maxHp: 200,
    color: '#10b981',
    damagePerStrike: 2,
    difficultyLabel: 'Advanced',
    attackNameP1: 'Cero Oscuras (Pitch-Black Cero)',
    attackNameP2: 'Lanza del Relámpago (Lightning of Ruin)',
    phase2Quote: '“What is a heart? Let me tear open your chest and gaze upon true despair: Segunda Etapa!”',
    phase2TransformationName: 'RESURRECCIÓN: SEGUNDA ETAPA',
    lore: 'The 4th Espada representing Emptiness. Uniquely possesses a secret second stage of release known as Segunda Etapa, wielding cataclysmic green lightning spears capable of destroying entire realms.',
    conceptVulnerability: 'Riemann Accumulation, Conservative Energy Wells & LC Circuit Oscillation',
    recommendedHeroCounter: 'Kenpachi Zaraki (+40 DMG) or Yoruichi (40% Flash Evasion)',
    aspectOfDeath: 'Emptiness / Nothingness (Kyomu)',
    demigodFelledTitle: 'ESPADA DEFEATED',
    bgType: 'huecomundo'
  },
  aizen_boss: {
    id: 'aizen_boss',
    name: 'Sosuke Aizen (Transcendent Hōgyoku)',
    title: 'Lord of the Heavens // Master of Kyoka Suigetsu',
    rank: 'Apex Demigod // Fusion of Hōgyoku',
    realm: 'FAKED KARAKURA TOWN // THE HEAVENLY SUMMIT',
    stageName: 'The Threshold of Divine Infinity',
    maxHp: 280,
    color: '#a855f7',
    damagePerStrike: 3,
    difficultyLabel: 'Supreme Boss',
    attackNameP1: 'Hado #90: Kurohitsugi & Illusion Mirrors',
    attackNameP2: 'Fragor & Ultrafragor Teleportation Cleave',
    phase2Quote: '“Reason only exists for those who cannot live without clinging to it. Let me show you what lies beyond reason!”',
    phase2TransformationName: 'HŌGYOKU TRANSCENDENT APEX',
    lore: 'The architect of the war who evolved beyond the boundaries of Hollows and Shinigami. Bends space-time, infinite series, and sensory reality at will. Strikes for 3-4 Hearts; Extra Hearts from the Soul Ward Forge are required to survive his reality-bending onslaught.',
    conceptVulnerability: 'Taylor Series Convergence, Differential Chain Extremas & Improper Integrals',
    recommendedHeroCounter: 'Sosuke Aizen (Hypnosis Overdrive) or Genryūsai Yamamoto (Solar Titan)',
    aspectOfDeath: 'Ascension & Transcendent Will',
    demigodFelledTitle: 'GOD OF THE HEAVENS OVERTHROWN',
    bgType: 'seireitei'
  },
  yamamoto_boss: {
    id: 'yamamoto_boss',
    name: 'Genryūsai Shigekuni Yamamoto (Zanka no Tachi)',
    title: 'Founder of the Gotei 13 // The Living Sun',
    rank: 'Supreme Captain-Commander // The Incinerating Titan',
    realm: 'SOUL SOCIETY // RUINS OF THE FIRST DIVISION',
    stageName: 'The Ten Trillion Sun Ashes',
    maxHp: 280,
    color: '#f97316',
    damagePerStrike: 3,
    difficultyLabel: 'Supreme Boss',
    attackNameP1: 'Taimatsu & Jokaku Enjo (Blazing Fortress)',
    attackNameP2: 'Zanka no Tachi, Kita: Tenchi Kaijin (Heaven and Earth Ashes)',
    phase2Quote: '“Do not mistake my patience for weakness. 15,000,000 degrees shall incinerate all doubt!”',
    phase2TransformationName: 'ZANKA NO TACHI: FULL RELEASE',
    lore: 'The strongest Shinigami in a millennium. Wields the heat of the solar core. Strikes incinerate for 3-4 Hearts; Extra Hearts forged at the Soul Ward are essential to withstand his solar ash.',
    conceptVulnerability: 'Rotational Angular Momentum, Work-Energy Conservation & Universal Gravitation',
    recommendedHeroCounter: 'Kenpachi Zaraki (Colossal Strength) or Yamamoto (Flame Sovereign)',
    aspectOfDeath: 'Absolute Oblivion & Judgement',
    demigodFelledTitle: 'SUPREME HEAD CAPTAIN BESTED',
    bgType: 'seireitei'
  },
  yhwach: {
    id: 'yhwach',
    name: 'Yhwach, The Quincy King',
    title: 'Father of All Quincies // Lord of the Wandenreich',
    rank: 'Grandmaster of the Wandenreich // The Almighty “A”',
    realm: 'THE WANDENREICH // SILBERN WAHRWELT',
    stageName: 'Throne Room of the Soul King',
    maxHp: 300,
    color: '#38bdf8',
    damagePerStrike: 3,
    difficultyLabel: 'Supreme Boss',
    attackNameP1: 'Sankt Zwinger & Reishi Broadsword',
    attackNameP2: 'Auswählen & The Almighty’s All-Seeing Eyes',
    phase2Quote: '“Everything you see, everything you attempt, I have already witnessed and altered in the future!”',
    phase2TransformationName: 'THE ALMIGHTY AWAKENED',
    lore: 'The progenitor of the Quincy. Sees and rewrites all possible futures. Strikes deliver 3-4 Hearts of crushing damage, demanding Extra Hearts from the Soul Ward Forge to survive.',
    conceptVulnerability: 'Faraday-Lenz Induction, Gauss Electric Flux & Kirchhoff Loop Theorems',
    recommendedHeroCounter: 'Genryūsai Yamamoto (Solar Titan) or Kisuke Urahara (35% Deflect)',
    aspectOfDeath: 'The Beginning and the End',
    demigodFelledTitle: 'QUINCY KING VANQUISHED',
    bgType: 'wandenreich'
  }
};

export function getStageBoss(courseId?: string, stageNumber: number = 1, bossId?: string): BleachVillainConfig {
  if (bossId && BLEACH_BOSS_CATALOG[bossId]) {
    return BLEACH_BOSS_CATALOG[bossId];
  }
  if (stageNumber === 1) return BLEACH_BOSS_CATALOG.grand_fisher;
  if (stageNumber === 2) return BLEACH_BOSS_CATALOG.renji_boss;
  if (stageNumber === 3) return BLEACH_BOSS_CATALOG.grimmjow;
  if (stageNumber === 4) {
    if (courseId === 'course-cs') return BLEACH_BOSS_CATALOG.szayelaporro;
    return BLEACH_BOSS_CATALOG.ulquiorra;
  }
  
  // Stage 5 Apex Final Boss Exam tailored to Course
  if (courseId === 'course-mechanics' || courseId === 'course-physics') return BLEACH_BOSS_CATALOG.yamamoto_boss;
  if (courseId === 'course-calculus') return BLEACH_BOSS_CATALOG.aizen_boss;
  if (courseId === 'course-cs') return BLEACH_BOSS_CATALOG.aizen_boss;
  if (courseId === 'course-electromagnetism' || courseId === 'course-circuits') return BLEACH_BOSS_CATALOG.yhwach;
  
  return BLEACH_BOSS_CATALOG.yhwach;
}
