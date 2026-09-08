'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Coins, 
  Heart, 
  Shield, 
  Zap, 
  Swords, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Check, 
  BookOpen, 
  ArrowRight,
  Flame,
  ShieldCheck,
  Award,
  Info,
  X,
  ChevronRight,
  UserCheck
} from 'lucide-react';

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

export interface BleachAttributes {
  reiatsu: number;   // Spiritual Pressure
  zanjutsu: number;  // Swordsmanship
  hakuda: number;    // Hand-to-Hand
  hoho: number;      // Flash Step / Speed
  kido: number;      // Demon Arts
}

export interface BleachHeroConfig {
  id: BleachHeroId;
  name: string;
  title: string;
  division: string;
  zanpakuto: string;
  releaseCommand: string;
  bankaiName: string;
  lore: string;
  quote: string;
  technique: string;
  techniqueDesc: string;
  attributes: BleachAttributes;
  geoCost: number;
  accentColor: string;
  themeGradient: string;
  passiveName: string;
  passiveDesc: string;
  baseHearts: number;
  bonusGeoMultiplier: number;
  damageBonus: number;
  tag: string;
  enduranceTier: 
    | 'Balanced' 
    | 'High Defense' 
    | 'Colossal Vitality' 
    | 'Health Regeneration' 
    | 'Tactical Deflection' 
    | 'Supreme Barrier'
    | 'Glacial Freeze'
    | 'Flash Evasion'
    | 'Shadow Absorption'
    | 'Flame Sovereign';
  enduranceHighlights: string[];
}

export const BLEACH_ROSTER: Record<BleachHeroId, BleachHeroConfig> = {
  ichigo: {
    id: 'ichigo',
    name: 'Ichigo Kurosaki',
    title: 'The Substitute Shinigami',
    division: 'Karakura Town Guardian // Vizard',
    zanpakuto: 'Tensa Zangetsu',
    releaseCommand: '“Bankai! Tensa Zangetsu!”',
    bankaiName: 'Tensa Zangetsu (Heaven Chain Slaying Moon)',
    lore: 'A human teenager with Shinigami, Hollow, and Quincy bloodlines. Wields the black Bankai daito Tensa Zangetsu and dons the Hollow Horn of Salvation, compressing colossal spiritual energy into blinding supersonic speed.',
    quote: '“If fate is a millstone, we are the grist. There is nothing we can do, so crave strength and shatter fate!”',
    technique: 'Getsuga Tensho (Moon Fang Heaven-Piercer)',
    techniqueDesc: 'Unleashes a devastating crescent wave of compressed black-and-crimson spiritual pressure that cleaves the arena.',
    attributes: { reiatsu: 95, zanjutsu: 88, hakuda: 75, hoho: 96, kido: 30 },
    geoCost: 0,
    accentColor: '#f97316',
    themeGradient: 'from-orange-500 to-red-600',
    passiveName: 'Hollowfied Speed',
    passiveDesc: 'Builds stance momentum rapidly on hit streaks, unleashing Getsuga Tensho blade waves.',
    baseHearts: 5,
    bonusGeoMultiplier: 1.0,
    damageBonus: 0,
    tag: 'STARTER // BALANCED STRIKER',
    enduranceTier: 'Balanced',
    enduranceHighlights: [
      '5 Base Hearts for standard exam survivability',
      'Rapid recovery between combo attacks',
      'Solid all-rounder for early stage tests'
    ]
  },
  rukia: {
    id: 'rukia',
    name: 'Rukia Kuchiki',
    title: '13th Division Lieutenant // Maiden of Absolute Zero',
    division: 'Gotei 13 - 13th Division Lieutenant',
    zanpakuto: 'Sode no Shirayuki',
    releaseCommand: '“Dance, Sode no Shirayuki!”',
    bankaiName: 'Hakka no Togame (White Haze Punishment)',
    lore: 'Sister of Byakuya Kuchiki and master of the most beautiful Zanpakuto in Soul Society. Drops her body temperature to absolute zero (-273.15°C), generating impenetrable crystalline permafrost shields that freeze opponent attacks.',
    quote: '“People have hope because they cannot see Death standing behind them. I will freeze all despair into pure ice!”',
    technique: 'Tsukishiro & Hakuren (White Ripple)',
    techniqueDesc: 'Fires a titanic wave of pure white glacial energy from four puncture points, freezing all enemy spiritual pressure solid.',
    attributes: { reiatsu: 88, zanjutsu: 85, hakuda: 72, hoho: 89, kido: 95 },
    geoCost: 120,
    accentColor: '#38bdf8',
    themeGradient: 'from-cyan-400 to-blue-600',
    passiveName: 'Hakuren Frost Shield',
    passiveDesc: 'Absolute zero ice armor reduces all incoming heavy boss strikes by 50%.',
    baseHearts: 5,
    bonusGeoMultiplier: 1.1,
    damageBonus: 15,
    tag: 'FROST SHIELD // 50% DAMAGE CUT',
    enduranceTier: 'High Defense',
    enduranceHighlights: [
      '50% Damage Reduction against Phase-2 Boss Ultimate Attacks',
      'High Kidō mastery for precision critical hits',
      'Ideal for surviving hard elemental tests (Electromagnetism & Calculus)'
    ]
  },
  kenpachi: {
    id: 'kenpachi',
    name: 'Kenpachi Zaraki',
    title: '11th Division Captain // The Unstoppable Demon',
    division: 'Gotei 13 - 11th Division Captain',
    zanpakuto: 'Nozarashi',
    releaseCommand: '“Drink, Nozarashi!”',
    bankaiName: 'Nameless Berserker Demon',
    lore: 'The monster of the 11th Division who fights without restraint or kidō. Wears an eye-patch with spiritual bells to suppress his boundless ocean of Reiatsu. His chipped blade expands into a colossal cleaver capable of slicing meteorites.',
    quote: '“Sanity? What good is that? You want to live? Then fight until your blade breaks!”',
    technique: 'Ryodan (Two-Handed Cleave)',
    techniqueDesc: 'Grips Nozarashi with both hands and delivers a skull-shattering vertical cleave that splits anything in its path.',
    attributes: { reiatsu: 100, zanjutsu: 98, hakuda: 92, hoho: 60, kido: 0 },
    geoCost: 150,
    accentColor: '#84cc16',
    themeGradient: 'from-lime-500 to-yellow-600',
    passiveName: 'Unstoppable Reiatsu',
    passiveDesc: 'Starts with 7 Maximum Hearts and deals massive +40 Base Damage on every attack.',
    baseHearts: 7,
    bonusGeoMultiplier: 1.15,
    damageBonus: 40,
    tag: 'COLOSSAL STR // 7 HEARTS',
    enduranceTier: 'Colossal Vitality',
    enduranceHighlights: [
      '7 Base Hearts — Highest starting health pool in the game',
      '+40 Base Damage shatters enemy HP bars quickly',
      'Survives repeated errors on difficult tests without failing'
    ]
  },
  byakuya: {
    id: 'byakuya',
    name: 'Byakuya Kuchiki',
    title: '6th Division Captain // Noble Blade of Sakura',
    division: 'Gotei 13 - 6th Division Captain & 28th Kuchiki Head',
    zanpakuto: 'Senbonzakura',
    releaseCommand: '“Scatter, Senbonzakura.”',
    bankaiName: 'Senbonzakura Kageyoshi (Vibrant Display of a Thousand Cherry Blossoms)',
    lore: 'The 28th head of the noble Kuchiki clan. He wields Senbonzakura, which scatters into a hundred million microscopic razor blades that catch the light like falling cherry blossoms, forming an impenetrable defensive barrier.',
    quote: '“The curtain falls. When you face my blade, there is neither anger nor malice—only the law.”',
    technique: 'Senbonzakura Kageyoshi (Goukei & Senkei)',
    techniqueDesc: 'Surrounds the target in a sphere of millions of floating glowing razor petals, striking from every angle simultaneously.',
    attributes: { reiatsu: 90, zanjutsu: 96, hakuda: 70, hoho: 94, kido: 90 },
    geoCost: 300,
    accentColor: '#f472b6',
    themeGradient: 'from-pink-400 to-rose-600',
    passiveName: 'Petal Aegis Barrier',
    passiveDesc: 'Recovers +1 Heart on every 2-answer streak and slashes enemies with cherry blossom petal tempests.',
    baseHearts: 5,
    bonusGeoMultiplier: 1.3,
    damageBonus: 22,
    tag: 'HEALING REGEN // PETAL STORM',
    enduranceTier: 'Health Regeneration',
    enduranceHighlights: [
      'Regenerates +1 Heart every 2 consecutive correct answers',
      'Enables infinite sustain across long 4-5 question subtopic tests',
      'Petal Aegis parries incidental damage'
    ]
  },
  urahara: {
    id: 'urahara',
    name: 'Kisuke Urahara',
    title: 'Former 12th Division Captain // SRDI Founder',
    division: 'Shopkeeper of Karakura // Former 12th Captain',
    zanpakuto: 'Benihime (Crimson Princess)',
    releaseCommand: '“Awaken, Benihime!”',
    bankaiName: 'Kannonbiraki Benihime Aratame',
    lore: 'The eccentric genius inventor who founded the Shinigami Research and Development Institute. Disguised as a modest candy merchant with his green bucket hat and clogs, his cane conceals the Crimson Princess.',
    quote: '“There is nothing in this world that cannot be dissected, reconstructed, and outsmarted.”',
    technique: 'Chikasumi no Tate & Kamisori (Crimson Mist)',
    techniqueDesc: 'Deploys an impenetrable blood-mist hexagonal shield while firing razor arcs of crimson spiritual energy.',
    attributes: { reiatsu: 92, zanjutsu: 90, hakuda: 85, hoho: 92, kido: 100 },
    geoCost: 450,
    accentColor: '#10b981',
    themeGradient: 'from-emerald-400 to-teal-600',
    passiveName: 'SRDI Inventions & Wealth',
    passiveDesc: 'Earns +75% Bonus Geo on every question and has a 35% tactical chance to parry away boss damage.',
    baseHearts: 5,
    bonusGeoMultiplier: 1.75,
    damageBonus: 25,
    tag: 'GENIUS TACTICIAN // GEO HOARDER',
    enduranceTier: 'Tactical Deflection',
    enduranceHighlights: [
      '35% Chance to completely parry boss counter-attacks via Blood Mist Shield',
      '+75% Bonus Geo reward on every single correct answer',
      'Best character for rapidly farming wealth to unlock the full roster'
    ]
  },
  aizen: {
    id: 'aizen',
    name: 'Sosuke Aizen',
    title: 'Lord of Las Noches // Master of Kyoka Suigetsu',
    division: 'Former 5th Division Captain // Ruler of Hueco Mundo',
    zanpakuto: 'Kyoka Suigetsu',
    releaseCommand: '“Shatter, Kyoka Suigetsu.”',
    bankaiName: 'Kanzen Saimin (Complete Hypnosis)',
    lore: 'The former 5th Division Captain who stood at the summit of the heavens. Possesses the Hōgyoku fused within his chest and commands Kyoka Suigetsu, completely controlling all five senses of anyone who sees its release.',
    quote: '“No one stands on the top of the world. Not you, not me, not even gods. But that unbearable vacancy ends today.”',
    technique: 'Kanzen Saimin & Hado #90: Kurohitsugi',
    techniqueDesc: 'Shatters reality into glass shards, encasing the enemy within a towering black sarcophagus of gravitational torment.',
    attributes: { reiatsu: 100, zanjutsu: 95, hakuda: 90, hoho: 95, kido: 100 },
    geoCost: 600,
    accentColor: '#a855f7',
    themeGradient: 'from-purple-500 to-indigo-700',
    passiveName: 'Complete Hypnosis',
    passiveDesc: 'Deals +45 Base Damage and requires only 2 hits to trigger maximum Overdrive stance.',
    baseHearts: 6,
    bonusGeoMultiplier: 1.4,
    damageBonus: 45,
    tag: 'GODLIKE REIATSU // HYPNOSIS',
    enduranceTier: 'Supreme Barrier',
    enduranceHighlights: [
      '6 Base Hearts with Hōgyoku immortality regeneration',
      'Distorts reality so deadly Phase-2 boss moves miss completely',
      'Maximum stance reached in only 2 hits (+45 Base DMG)'
    ]
  },
  toshiro: {
    id: 'toshiro',
    name: 'Tōshirō Hitsugaya',
    title: '10th Division Captain // Dragon of Ice',
    division: 'Gotei 13 - 10th Division Captain',
    zanpakuto: 'Hyōrinmaru',
    releaseCommand: '“Sit Upon the Frosted Heavens, Hyōrinmaru!”',
    bankaiName: 'Daiguren Hyōrinmaru (Grand Crimson Lotus Ice Ring)',
    lore: 'The youngest Shinigami captain in Soul Society history, a prodigy commanding the strongest ice-element Zanpakuto. Unleashes an azure ice dragon capable of freezing moisture in the atmosphere into crystalline barriers and absolute flash-freezes.',
    quote: '“I did not come here to listen to your excuses. Prepare to be frozen to your very soul.”',
    technique: 'Ryūsenka & Sennen Hyōrō (Thousand-Year Ice Prison)',
    techniqueDesc: 'Pillars of ice encircle and crush the opponent, followed by an explosion of razor ice petals.',
    attributes: { reiatsu: 92, zanjutsu: 89, hakuda: 70, hoho: 91, kido: 88 },
    geoCost: 220,
    accentColor: '#06b6d4',
    themeGradient: 'from-cyan-500 to-teal-600',
    passiveName: 'Hyōrinmaru Glacial Stun',
    passiveDesc: 'Every 3 answer streak flash-freezes the boss for 1 turn and deals +25 Ice Shatter damage.',
    baseHearts: 6,
    bonusGeoMultiplier: 1.2,
    damageBonus: 25,
    tag: 'FROST STUN // FREEZE TURNS',
    enduranceTier: 'Glacial Freeze',
    enduranceHighlights: [
      '6 Base Hearts for formidable endurance against long tests',
      'Flash-freezes high-damage bosses, canceling their counter-attacks on 3-streaks',
      'Ideal for intricate Multi-step Calculus & Algorithms tests'
    ]
  },
  ulquiorra_hero: {
    id: 'ulquiorra_hero',
    name: 'Ulquiorra Cifer (Resurrección)',
    title: 'Cuarta Espada (#4) // Demon of Emptiness',
    division: 'Espada #4 (Awakened Ally)',
    zanpakuto: 'Murciélago',
    releaseCommand: '“Enclose, Murciélago!”',
    bankaiName: 'Resurrección: Segunda Etapa (Second Release)',
    lore: 'The only Espada to reach Segunda Etapa, shedding human form to become an angel of nothingness. Unlike other Arrancar who traded regeneration for raw power, Ulquiorra possesses supreme high-speed cellular regeneration capable of reconstructing fatal wounds.',
    quote: '“If this heart of mine exists, then I shall restore my flesh through sheer emptiness.”',
    technique: 'Lanza del Relámpago (Spear of Lightning)',
    techniqueDesc: 'Forges a spear of crackling emerald lightning that creates a nuclear-scale explosion upon impact.',
    attributes: { reiatsu: 96, zanjutsu: 91, hakuda: 85, hoho: 94, kido: 90 },
    geoCost: 360,
    accentColor: '#10b981',
    themeGradient: 'from-emerald-500 to-green-700',
    passiveName: 'High-Speed Regeneration',
    passiveDesc: 'Restores +1 Heart on every 2 correct answers, and fatal boss attacks are capped to leave 1 heart standing.',
    baseHearts: 6,
    bonusGeoMultiplier: 1.25,
    damageBonus: 30,
    tag: 'RAPID REGEN // DEATH DEFIANCE',
    enduranceTier: 'Health Regeneration',
    enduranceHighlights: [
      'Restores +1 Heart continuously every 2 correct answers',
      'Fatal strike protection: boss ultimate cannot drop you below 1 heart once per stage',
      'Supreme pick for enduring Tier 4 & 5 hardest academic tests'
    ]
  },
  yoruichi: {
    id: 'yoruichi',
    name: 'Yoruichi Shihōin',
    title: 'Flash Goddess // Former Onmitsukidō Commander',
    division: 'Former 2nd Division Captain & Shihōin Clan Head',
    zanpakuto: 'Shunkō (Hand-to-Hand Raijin)',
    releaseCommand: '“Shunkō: Raijin Senkei!”',
    bankaiName: 'Shunkō: Bakuryū Kōken',
    lore: 'The undisputed Goddess of Flash (Shunshin Yoruichi) and master of Shunkō, an advanced secret art fusing Hakuda hand-to-hand combat with concentrated Kidō lightning wrapped around her back and shoulders.',
    quote: '“You think you can hit me? Even the lightning in the sky cannot catch up with my steps!”',
    technique: 'Shunkō: Raiju Senkei (Lightning Beast)',
    techniqueDesc: 'Channels 48 pulses of volatile lightning per second, shredding the opponent with supersonic thunder strikes.',
    attributes: { reiatsu: 94, zanjutsu: 78, hakuda: 100, hoho: 100, kido: 92 },
    geoCost: 340,
    accentColor: '#f59e0b',
    themeGradient: 'from-amber-400 to-yellow-600',
    passiveName: 'Flash Mirage & Super Geo',
    passiveDesc: '40% chance to completely dodge boss damage on mistakes, plus +100% Geo rewards (2.0x multiplier)!',
    baseHearts: 5,
    bonusGeoMultiplier: 2.0,
    damageBonus: 20,
    tag: '40% DODGE // 2.0X GEO FARM',
    enduranceTier: 'Flash Evasion',
    enduranceHighlights: [
      '40% chance that an incorrect answer deals 0 damage due to Flash Mirage',
      'Massive 2.0x Geo multiplier — fastest character to farm Geo for other unlocks',
      'Agile evasion makes high-stakes tests forgiving'
    ]
  },
  renji: {
    id: 'renji',
    name: 'Renji Abarai',
    title: '6th Division Lieutenant // Howl of Zabimaru',
    division: 'Gotei 13 - 6th Division Lieutenant',
    zanpakuto: 'Zabimaru',
    releaseCommand: '“Howl, Zabimaru!”',
    bankaiName: 'Sōō Zabimaru (Twin Kings Snake Tail)',
    lore: 'Fierce lieutenant under Byakuya Kuchiki who forged true harmony with his spirit Zabimaru. His perfected Bankai manifests the Orochi-ō skull whip and Hihi-ō gorilla arm, crushing defenses with brute iron force.',
    quote: '“A stray dog will bark and bite even if it has to drag its broken limbs through fire!”',
    technique: 'Zaga Teppō (Snake Fang Iron Cannon)',
    techniqueDesc: 'Unleashes an incinerating blast of spiritual flames from the gaping jaws of the giant skeletal snake head.',
    attributes: { reiatsu: 89, zanjutsu: 88, hakuda: 84, hoho: 82, kido: 50 },
    geoCost: 180,
    accentColor: '#ef4444',
    themeGradient: 'from-red-500 to-rose-700',
    passiveName: 'Zabimaru Iron Fang',
    passiveDesc: 'Heavy armor reduces all incoming attacks by 25%, and streak answers gain +30 bonus damage.',
    baseHearts: 6,
    bonusGeoMultiplier: 1.15,
    damageBonus: 30,
    tag: 'HEAVY ARMOR // STAGGER CLEAVE',
    enduranceTier: 'High Defense',
    enduranceHighlights: [
      '6 Sturdy Hearts with permanent 25% damage mitigation',
      'High bonus damage (+30 DMG) to finish tests in fewer questions',
      'Great affordable brawler for middle tier stages'
    ]
  },
  shunsui: {
    id: 'shunsui',
    name: 'Shunsui Kyōraku',
    title: 'Captain-Commander // Master of Shadow Games',
    division: 'Gotei 13 - Captain-Commander (Head of Gotei 13)',
    zanpakuto: 'Katen Kyōkotsu',
    releaseCommand: '“Flower Wind Rages and Flower God Weeps, Heavenly Wind Rages and Underworld Demon Sneers!”',
    bankaiName: 'Katen Kyōkotsu: Karamatsu Shinjū (Withered Pine Lovers’ Suicide)',
    lore: 'Successor to Head Captain Yamamoto as leader of Soul Society. His twin swords make children’s games deadly reality. Those caught in his Bankai share shared wounds, drown in an abyss of regret, and face decapitation by thread.',
    quote: '“War is fundamentally an evil affair. The moment you step onto the battlefield, both sides are already wrong.”',
    technique: 'Kageoni & Bushōgoma (Shadow Demon Whirlwind)',
    techniqueDesc: 'Stabs into shadows to emerge directly behind the opponent’s blind spot with lethal dual-blade cuts.',
    attributes: { reiatsu: 97, zanjutsu: 96, hakuda: 86, hoho: 94, kido: 90 },
    geoCost: 460,
    accentColor: '#ec4899',
    themeGradient: 'from-pink-500 to-rose-700',
    passiveName: 'Kageoni Shadow Dance',
    passiveDesc: 'Slips into the shadows after taking damage, reducing the next 2 hits by 60% and granting +40 critical damage.',
    baseHearts: 6,
    bonusGeoMultiplier: 1.35,
    damageBonus: 40,
    tag: 'SHADOW SLIP // 60% ABSORB',
    enduranceTier: 'Shadow Absorption',
    enduranceHighlights: [
      '6 Base Hearts with tactical game mechanics',
      'Takes 60% reduced damage after taking a hit (slip into shadows)',
      'Massive +40 Base Damage for punishing boss counter-offensives'
    ]
  },
  yamamoto: {
    id: 'yamamoto',
    name: 'Genryūsai Shigekuni Yamamoto',
    title: 'Founder of the Gotei 13 // The Living Sun',
    division: 'Former Captain-Commander of Gotei 13',
    zanpakuto: 'Ryūjin Jakka',
    releaseCommand: '“All Things in the Universe, Turn to Ashes! Ryūjin Jakka!”',
    bankaiName: 'Zanka no Tachi (Blade of Ember)',
    lore: 'The supreme shinigami who founded Gotei 13 over a millennium ago. Commands the ultimate flame Zanpakuto. In Bankai, all flames are compressed into the edge of his charred blade reaching 15,000,000°C — turning anything touched into absolute ash.',
    quote: '“Why do you think I have remained Captain-Commander of the Gotei 13 for a thousand years? Because no Shinigami born in a millennium was stronger than me!”',
    technique: 'Zanka no Tachi, Minami: Jūka Jinshī (Ten Trillion Flame Dead)',
    techniqueDesc: 'Calls forth the skeletal ashes of tens of trillions slain by his flames, marching as an invincible infernal legion.',
    attributes: { reiatsu: 100, zanjutsu: 100, hakuda: 98, hoho: 90, kido: 98 },
    geoCost: 750,
    accentColor: '#ea580c',
    themeGradient: 'from-orange-600 via-red-600 to-amber-500',
    passiveName: 'Zanka no Tachi Sun Cloak',
    passiveDesc: 'Starts with colossal 8 Hearts, immune to 1-heart scratch attacks, and burns the boss for 20 passive damage each turn!',
    baseHearts: 8,
    bonusGeoMultiplier: 1.5,
    damageBonus: 55,
    tag: '8 HEARTS // SUPREME TITAN',
    enduranceTier: 'Flame Sovereign',
    enduranceHighlights: [
      'Colossal 8 Maximum Hearts — the absolute highest vitality in the game',
      'Scratch immunity: 1-heart strikes are completely nullified by the 15,000,000°C solar cloak',
      'Deals 20 passive burn damage to bosses on every single turn automatically',
      'The ultimate choice for clearing Stage 5 Boss Exams with 3 Stars'
    ]
  }
};

// -------------------------------------------------------------
// Pixel-Art Bleach Hero Sprite Component (All 6 Characters)
// -------------------------------------------------------------
export function BleachPixelSprite({
  heroId,
  animState = 'idle',
  isHurt = false
}: {
  heroId: BleachHeroId;
  animState?: string;
  isHurt?: boolean;
}) {
  // ICHIGO KUROSAKI
  if (heroId === 'ichigo') {
    return (
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 0.85, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="absolute -inset-6 rounded-full bg-gradient-to-tr from-black via-red-600/30 to-orange-500/20 blur-xl pointer-events-none"
        />

        <motion.svg
          width={92}
          height={110}
          viewBox="0 0 24 28"
          className="pixel-art drop-shadow-2xl relative z-10"
          animate={
            isHurt
              ? { x: [-16, 16, -10, 10, 0], opacity: [1, 0.25, 1], filter: ['brightness(1)', 'brightness(3)', 'brightness(1)'] }
              : animState === 'idle'
              ? { scaleY: [1, 1.03, 1], y: [0, -2, 0] }
              : animState === 'slash_strike' || animState === 'test_attack'
              ? { x: [0, 130, 190, 0], y: [0, -15, 5, 0], rotate: [0, -25, 35, 0] }
              : animState === 'ash_of_war'
              ? { x: [0, 160, 220, 0], y: [0, -25, 0, 0], scale: [1, 1.3, 1], filter: ['brightness(1)', 'brightness(2.5)', 'brightness(1)'] }
              : {}
          }
          transition={{ duration: animState === 'idle' ? 1.8 : 0.5, repeat: animState === 'idle' ? Infinity : 0 }}
        >
          {/* Spiky Orange Hair */}
          <polygon points="12,1 8,6 16,6" fill="#f97316" />
          <polygon points="6,2 4,8 10,7" fill="#ea580c" />
          <polygon points="18,2 20,8 14,7" fill="#f97316" />
          <polygon points="3,6 1,11 6,10" fill="#ea580c" />
          <polygon points="21,6 23,11 18,10" fill="#ea580c" />

          {/* Hollow Horn */}
          <polygon points="4,2 2,7 6,6" fill="#ffffff" />
          <line x1="3" y1="4" x2="5" y2="5" stroke="#ef4444" strokeWidth="0.8" />

          {/* Face */}
          <rect x="7" y="7" width="10" height="6" fill="#fed7aa" rx="1" />
          <rect x="8" y="9" width="2" height="1.5" fill="#7c2d12" />
          <rect x="14" y="9" width="2" height="1.5" fill="#7c2d12" />
          <rect x="8" y="9" width="1" height="1" fill="#fbbf24" />

          {/* Black Shihakusho */}
          <rect x="6" y="13" width="12" height="8" fill="#090d16" rx="1" />
          <polygon points="11,13 13,13 12,16" fill="#f8fafc" />
          <rect x="7" y="18" width="10" height="2" fill="#ef4444" />
          <polygon points="4,16 0,25 6,21" fill="#020617" />
          <polygon points="20,16 24,25 18,21" fill="#020617" />

          {/* Tensa Zangetsu */}
          <rect x="20" y="3" width="2" height="23" fill="#020617" />
          <rect x="19.5" y="3" width="1" height="23" fill="#ef4444" opacity="0.8" />
          <rect x="19" y="16" width="4" height="2" fill="#020617" />
          <circle cx="20.5" cy="22" r="1.5" fill="none" stroke="#94a3b8" strokeWidth="0.8" />

          {/* Boots */}
          <rect x="8" y="21" width="3" height="6" fill="#f8fafc" />
          <rect x="13" y="21" width="3" height="6" fill="#f8fafc" />
          <rect x="8" y="26" width="3.5" height="1.5" fill="#020617" />
          <rect x="13" y="26" width="3.5" height="1.5" fill="#020617" />
        </motion.svg>
      </div>
    );
  }

  // RUKIA KUCHIKI
  if (heroId === 'rukia') {
    return (
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 0.85, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="absolute -inset-6 rounded-full bg-cyan-400/25 blur-xl pointer-events-none"
        />

        <motion.svg
          width={88}
          height={106}
          viewBox="0 0 24 28"
          className="pixel-art drop-shadow-2xl relative z-10"
          animate={
            isHurt
              ? { x: [-16, 16, -10, 10, 0], opacity: [1, 0.25, 1] }
              : animState === 'idle'
              ? { scaleY: [1, 1.03, 1], y: [0, -2, 0] }
              : animState === 'slash_strike' || animState === 'test_attack'
              ? { x: [0, 125, 185, 0], y: [0, -15, 0, 0], rotate: [0, -15, 25, 0] }
              : {}
          }
          transition={{ duration: animState === 'idle' ? 1.9 : 0.5, repeat: animState === 'idle' ? Infinity : 0 }}
        >
          {/* Black Bob Hair with Central Strand */}
          <polygon points="12,2 7,7 17,7" fill="#090d16" />
          <rect x="6" y="5" width="12" height="6" fill="#090d16" rx="2" />
          <polygon points="12,6 11,11 13,11" fill="#090d16" />

          {/* Delicate Face */}
          <rect x="7" y="7" width="10" height="6" fill="#fed7aa" rx="1" />
          <rect x="8.5" y="9" width="1.5" height="1.5" fill="#38bdf8" />
          <rect x="14" y="9" width="1.5" height="1.5" fill="#38bdf8" />

          {/* White Collar & Black Shihakusho */}
          <rect x="6" y="13" width="12" height="8" fill="#0f172a" rx="1" />
          <polygon points="11,13 13,13 12,16" fill="#ffffff" />
          <rect x="7" y="18" width="10" height="2" fill="#38bdf8" />

          {/* Sode no Shirayuki (Pure White Zanpakuto with Ribbon) */}
          <rect x="19" y="4" width="1.5" height="20" fill="#f8fafc" />
          <circle cx="19.75" cy="14" r="1.5" fill="#e0f2fe" />
          {/* Flowing White Ribbon */}
          <path d="M 19 23 Q 22 25 21 28" stroke="#f8fafc" strokeWidth="1" fill="none" />

          {/* Ice Aura Particle Spangles */}
          <circle cx="4" cy="15" r="0.8" fill="#7dd3fc" />
          <circle cx="20" cy="8" r="0.8" fill="#38bdf8" />

          {/* Boots */}
          <rect x="8" y="21" width="3" height="6" fill="#f8fafc" />
          <rect x="13" y="21" width="3" height="6" fill="#f8fafc" />
        </motion.svg>
      </div>
    );
  }

  // KENPACHI ZARAKI
  if (heroId === 'kenpachi') {
    return (
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 0.85, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -inset-6 rounded-full bg-lime-500/25 blur-xl pointer-events-none"
        />

        <motion.svg
          width={96}
          height={114}
          viewBox="0 0 24 28"
          className="pixel-art drop-shadow-2xl relative z-10"
          animate={
            isHurt
              ? { x: [-16, 16, -10, 10, 0], opacity: [1, 0.25, 1] }
              : animState === 'idle'
              ? { scaleY: [1, 1.03, 1], y: [0, -3, 0] }
              : animState === 'slash_strike' || animState === 'test_attack'
              ? { x: [0, 135, 195, 0], y: [0, -20, 5, 0], rotate: [0, -20, 30, 0] }
              : {}
          }
          transition={{ duration: animState === 'idle' ? 1.8 : 0.5, repeat: animState === 'idle' ? Infinity : 0 }}
        >
          {/* Spiky Bell Hair */}
          <polygon points="12,0 10,6 14,6" fill="#090d16" />
          <circle cx="12" cy="0" r="1" fill="#facc15" />
          <polygon points="6,2 5,8 9,7" fill="#090d16" />
          <circle cx="6" cy="2" r="1" fill="#facc15" />
          <polygon points="18,2 19,8 15,7" fill="#090d16" />
          <circle cx="18" cy="2" r="1" fill="#facc15" />

          {/* Face & Eye-Patch */}
          <rect x="7" y="7" width="10" height="7" fill="#fed7aa" rx="1" />
          <rect x="13" y="8" width="3.5" height="3.5" fill="#020617" />
          <line x1="12" y1="8" x2="18" y2="10" stroke="#020617" strokeWidth="0.8" />
          <rect x="8.5" y="9" width="1.5" height="1.5" fill="#451a03" />
          <line x1="7.5" y1="7" x2="9.5" y2="13" stroke="#b91c1c" strokeWidth="0.8" />

          {/* White Captain's Haori */}
          <rect x="6" y="14" width="12" height="8" fill="#f8fafc" rx="1" />
          <rect x="8" y="14" width="8" height="8" fill="#020617" />
          <rect x="4" y="14" width="2" height="6" fill="#fed7aa" />
          <rect x="18" y="14" width="2" height="6" fill="#fed7aa" />

          {/* Nozarashi Cleaver */}
          <polygon points="20,1 23,26 19,26" fill="#94a3b8" />
          <polygon points="20,1 22,26 21,26" fill="#e2e8f0" />
          <rect x="19" y="15" width="2" height="10" fill="#fef08a" />

          {/* Boots */}
          <rect x="8" y="21" width="3" height="6" fill="#020617" />
          <rect x="13" y="21" width="3" height="6" fill="#020617" />
        </motion.svg>
      </div>
    );
  }

  // BYAKUYA KUCHIKI
  if (heroId === 'byakuya') {
    return (
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 0.85, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="absolute -inset-6 rounded-full bg-pink-500/25 blur-xl pointer-events-none"
        />

        <motion.svg
          width={90}
          height={108}
          viewBox="0 0 24 28"
          className="pixel-art drop-shadow-2xl relative z-10"
          animate={
            isHurt
              ? { x: [-16, 16, -10, 10, 0], opacity: [1, 0.25, 1] }
              : animState === 'idle'
              ? { scaleY: [1, 1.03, 1], y: [0, -2, 0] }
              : animState === 'slash_strike' || animState === 'test_attack'
              ? { x: [0, 130, 190, 0], y: [0, -15, 0, 0], rotate: [0, -15, 25, 0] }
              : {}
          }
          transition={{ duration: animState === 'idle' ? 2 : 0.5, repeat: animState === 'idle' ? Infinity : 0 }}
        >
          {/* Black Hair & Kenseikan */}
          <rect x="7" y="3" width="10" height="7" fill="#090d16" rx="1" />
          <rect x="6" y="2" width="2" height="4" fill="#f8fafc" />
          <rect x="16" y="2" width="2" height="4" fill="#f8fafc" />

          {/* Face */}
          <rect x="8" y="6" width="8" height="6" fill="#fde68a" rx="1" />
          <rect x="9" y="8" width="1.5" height="1" fill="#475569" />
          <rect x="13.5" y="8" width="1.5" height="1" fill="#475569" />

          {/* Turquoise Scarf */}
          <rect x="6" y="11" width="12" height="3" fill="#06b6d4" />
          <polygon points="5,12 1,18 7,16" fill="#22d3ee" />

          {/* White Haori */}
          <rect x="5" y="14" width="14" height="8" fill="#f8fafc" rx="1" />
          <rect x="8" y="14" width="8" height="8" fill="#090d16" />

          {/* Senbonzakura */}
          <rect x="19" y="8" width="1.5" height="12" fill="#e2e8f0" />
          <circle cx="20" cy="5" r="1.5" fill="#f472b6" />
          <circle cx="22" cy="7" r="1.2" fill="#ec4899" />
          <circle cx="18" cy="4" r="1.5" fill="#fbcfe8" />

          {/* Boots */}
          <rect x="8" y="21" width="3" height="6" fill="#020617" />
          <rect x="13" y="21" width="3" height="6" fill="#020617" />
        </motion.svg>
      </div>
    );
  }

  // KISUKE URAHARA
  if (heroId === 'urahara') {
    return (
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="absolute -inset-6 rounded-full bg-emerald-500/25 blur-xl pointer-events-none"
        />

        <motion.svg
          width={90}
          height={108}
          viewBox="0 0 24 28"
          className="pixel-art drop-shadow-2xl relative z-10"
          animate={
            isHurt
              ? { x: [-16, 16, -10, 10, 0], opacity: [1, 0.25, 1] }
              : animState === 'idle'
              ? { scaleY: [1, 1.03, 1], y: [0, -2, 0] }
              : animState === 'slash_strike' || animState === 'test_attack'
              ? { x: [0, 120, 180, 0], y: [0, -20, 0, 0], rotate: [0, -20, 30, 0] }
              : {}
          }
          transition={{ duration: animState === 'idle' ? 1.8 : 0.5, repeat: animState === 'idle' ? Infinity : 0 }}
        >
          {/* Bucket Hat */}
          <polygon points="12,1 3,6 21,6" fill="#15803d" />
          <rect x="6" y="5" width="12" height="3" fill="#15803d" />
          <rect x="8" y="5" width="2" height="3" fill="#f8fafc" />
          <rect x="14" y="5" width="2" height="3" fill="#f8fafc" />

          {/* Blonde Hair & Face */}
          <rect x="7" y="8" width="10" height="5" fill="#fde047" />
          <rect x="8" y="9" width="8" height="4" fill="#fed7aa" rx="1" />
          <rect x="9" y="10" width="1.5" height="1" fill="#475569" />
          <rect x="13.5" y="10" width="1.5" height="1" fill="#475569" />

          {/* Green Haori */}
          <rect x="5" y="13" width="14" height="9" fill="#14532d" rx="1" />
          <rect x="8" y="13" width="8" height="9" fill="#020617" />
          <polygon points="12,14 10,16 14,16" fill="#f8fafc" />

          {/* Benihime Cane */}
          <rect x="19" y="5" width="2" height="21" fill="#b45309" />
          <path d="M 19 5 Q 17 2 15 4" stroke="#78350f" strokeWidth="1.5" fill="none" />
          <circle cx="20" cy="12" r="2.5" fill="#f43f5e" opacity="0.8" />

          {/* Clogs */}
          <rect x="7" y="22" width="4" height="4" fill="#92400e" />
          <rect x="13" y="22" width="4" height="4" fill="#92400e" />
        </motion.svg>
      </div>
    );
  }

  // SOSUKE AIZEN
  // SOSUKE AIZEN
  if (heroId === 'aizen') {
    return (
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 0.85, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="absolute -inset-6 rounded-full bg-purple-600/25 blur-xl pointer-events-none"
        />

        <motion.svg
          width={92}
          height={110}
          viewBox="0 0 24 28"
          className="pixel-art drop-shadow-2xl relative z-10"
          animate={
            isHurt
              ? { x: [-16, 16, -10, 10, 0], opacity: [1, 0.25, 1] }
              : animState === 'idle'
              ? { scaleY: [1, 1.04, 1], y: [0, -3, 0] }
              : animState === 'slash_strike' || animState === 'test_attack'
              ? { x: [0, 140, 205, 0], y: [0, -25, 5, 0], rotate: [0, -30, 40, 0] }
              : {}
          }
          transition={{ duration: animState === 'idle' ? 1.8 : 0.5, repeat: animState === 'idle' ? Infinity : 0 }}
        >
          {/* Slicked Back Hair & Strand */}
          <polygon points="12,1 6,6 18,6" fill="#78350f" />
          <rect x="7" y="3" width="10" height="5" fill="#78350f" rx="1" />
          <line x1="11" y1="5" x2="10" y2="10" stroke="#78350f" strokeWidth="1.2" />

          {/* Face */}
          <rect x="8" y="6" width="8" height="6" fill="#fed7aa" rx="1" />
          <rect x="9" y="8" width="1.5" height="1.5" fill="#3b0764" />
          <rect x="13.5" y="8" width="1.5" height="1.5" fill="#3b0764" />

          {/* Espada Robes */}
          <polygon points="5,9 3,14 7,12" fill="#f8fafc" />
          <polygon points="19,9 21,14 17,12" fill="#f8fafc" />
          <rect x="6" y="12" width="12" height="10" fill="#f8fafc" rx="1" />
          <rect x="8" y="12" width="8" height="10" fill="#0f172a" />

          {/* Hōgyoku */}
          <circle cx="12" cy="16" r="2" fill="#c084fc" className="animate-pulse" />
          <circle cx="12" cy="16" r="1" fill="#ffffff" />

          {/* Kyoka Suigetsu */}
          <rect x="19" y="6" width="2" height="18" fill="#e2e8f0" />
          <circle cx="20" cy="15" r="2" fill="#f59e0b" />
          <rect x="19" y="17" width="2" height="6" fill="#15803d" />

          {/* Boots */}
          <rect x="8" y="21" width="3" height="6" fill="#020617" />
          <rect x="13" y="21" width="3" height="6" fill="#020617" />
        </motion.svg>
      </div>
    );
  }

  // TOSHIRO HITSUGAYA
  if (heroId === 'toshiro') {
    return (
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{ scale: [0.95, 1.06, 0.95], opacity: [0.5, 0.85, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="absolute -inset-6 rounded-full bg-cyan-400/30 blur-xl pointer-events-none"
        />

        <motion.svg
          width={88}
          height={104}
          viewBox="0 0 24 28"
          className="pixel-art drop-shadow-2xl relative z-10"
          animate={
            isHurt
              ? { x: [-16, 16, -10, 10, 0], opacity: [1, 0.25, 1] }
              : animState === 'idle'
              ? { scaleY: [1, 1.03, 1], y: [0, -2, 0] }
              : animState === 'slash_strike' || animState === 'test_attack'
              ? { x: [0, 130, 190, 0], y: [0, -18, 5, 0], rotate: [0, -20, 30, 0] }
              : {}
          }
          transition={{ duration: animState === 'idle' ? 1.7 : 0.5, repeat: animState === 'idle' ? Infinity : 0 }}
        >
          {/* Spiky White Prodigy Hair */}
          <polygon points="12,1 8,6 16,6" fill="#f8fafc" />
          <polygon points="5,3 3,9 9,8" fill="#e2e8f0" />
          <polygon points="19,3 21,9 15,8" fill="#f8fafc" />
          <polygon points="2,7 0,11 5,10" fill="#e2e8f0" />

          {/* Young Face & Turquoise Eyes */}
          <rect x="7" y="7" width="10" height="6" fill="#fed7aa" rx="1" />
          <rect x="8.5" y="9" width="1.5" height="1.5" fill="#06b6d4" />
          <rect x="14" y="9" width="1.5" height="1.5" fill="#06b6d4" />

          {/* Captain Haori & Green Sash */}
          <rect x="6" y="13" width="12" height="8" fill="#f8fafc" rx="1" />
          <rect x="8" y="13" width="8" height="8" fill="#020617" />
          <line x1="6" y1="13" x2="18" y2="21" stroke="#16a34a" strokeWidth="1.5" />

          {/* Hyorinmaru Star Guard Katana & Ice Wings */}
          <rect x="20" y="4" width="1.5" height="20" fill="#38bdf8" />
          <polygon points="20,13 22,15 20,17 18,15" fill="#06b6d4" />
          <polygon points="2,14 -2,8 4,18" fill="#7dd3fc" opacity="0.8" />

          {/* Boots */}
          <rect x="8" y="21" width="3" height="6" fill="#020617" />
          <rect x="13" y="21" width="3" height="6" fill="#020617" />
        </motion.svg>
      </div>
    );
  }

  // ULQUIORRA CIFER (HERO ALLY)
  if (heroId === 'ulquiorra_hero') {
    return (
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 0.9, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.9 }}
          className="absolute -inset-8 rounded-full bg-emerald-500/25 blur-2xl pointer-events-none"
        />

        <motion.svg
          width={96}
          height={112}
          viewBox="0 0 24 28"
          className="pixel-art drop-shadow-2xl relative z-10"
          animate={
            isHurt
              ? { x: [-16, 16, -10, 10, 0], opacity: [1, 0.25, 1] }
              : animState === 'idle'
              ? { scaleY: [1, 1.03, 1], y: [0, -3, 0] }
              : animState === 'slash_strike' || animState === 'test_attack'
              ? { x: [0, 140, 200, 0], y: [0, -20, 0, 0], rotate: [0, -25, 35, 0] }
              : {}
          }
          transition={{ duration: animState === 'idle' ? 2 : 0.5, repeat: animState === 'idle' ? Infinity : 0 }}
        >
          {/* Bat Horns & Dark Wings */}
          <polygon points="7,4 3,0 8,2" fill="#020617" />
          <polygon points="17,4 21,0 16,2" fill="#020617" />
          <polygon points="3,10 -2,4 1,18" fill="#020617" />
          <polygon points="21,10 26,4 23,18" fill="#020617" />

          {/* Pale Mask Face with Green Tears */}
          <rect x="7" y="5" width="10" height="7" fill="#f8fafc" rx="1" />
          <rect x="8.5" y="7" width="1.5" height="1.5" fill="#10b981" />
          <rect x="14" y="7" width="1.5" height="1.5" fill="#10b981" />
          <line x1="9.2" y1="8.5" x2="9.2" y2="12" stroke="#10b981" strokeWidth="0.8" />
          <line x1="14.7" y1="8.5" x2="14.7" y2="12" stroke="#10b981" strokeWidth="0.8" />

          {/* Obsidian Body & Hollow Core */}
          <rect x="7" y="12" width="10" height="9" fill="#090d16" rx="1" />
          <circle cx="12" cy="15" r="2" fill="#020617" stroke="#10b981" strokeWidth="0.7" />

          {/* Lanza del Relampago */}
          <line x1="19" y1="2" x2="19" y2="26" stroke="#4ade80" strokeWidth="2" />
          <polygon points="19,0 21,5 17,5" fill="#22c55e" />

          {/* Feet */}
          <rect x="8" y="21" width="3" height="6" fill="#020617" />
          <rect x="13" y="21" width="3" height="6" fill="#020617" />
        </motion.svg>
      </div>
    );
  }

  // YORUICHI SHIHOIN
  if (heroId === 'yoruichi') {
    return (
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.5, 0.9, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          className="absolute -inset-6 rounded-full bg-amber-400/30 blur-xl pointer-events-none"
        />

        <motion.svg
          width={88}
          height={106}
          viewBox="0 0 24 28"
          className="pixel-art drop-shadow-2xl relative z-10"
          animate={
            isHurt
              ? { x: [-16, 16, -10, 10, 0], opacity: [1, 0.25, 1] }
              : animState === 'idle'
              ? { scaleY: [1, 1.03, 1], y: [0, -2, 0] }
              : animState === 'slash_strike' || animState === 'test_attack'
              ? { x: [0, 150, 210, 0], y: [0, -10, 0, 0], rotate: [0, 20, -15, 0] }
              : {}
          }
          transition={{ duration: animState === 'idle' ? 1.6 : 0.4, repeat: animState === 'idle' ? Infinity : 0 }}
        >
          {/* Deep Purple High Ponytail */}
          <polygon points="12,1 8,6 16,6" fill="#7e22ce" />
          <polygon points="12,0 15,-4 18,3" fill="#6b21a8" />
          <polygon points="5,3 4,9 9,8" fill="#581c87" />

          {/* Golden Cat-Eyes Face */}
          <rect x="7" y="6" width="10" height="6" fill="#fed7aa" rx="1" />
          <rect x="8.5" y="8" width="1.5" height="1.5" fill="#facc15" />
          <rect x="14" y="8" width="1.5" height="1.5" fill="#facc15" />

          {/* Backless Shinobi Suit (Orange & Black) */}
          <rect x="7" y="12" width="10" height="9" fill="#ea580c" rx="1" />
          <rect x="8" y="12" width="8" height="9" fill="#0f172a" />

          {/* Shunko Lightning Wings */}
          <polygon points="4,14 0,10 3,20" fill="#38bdf8" />
          <polygon points="20,14 24,10 21,20" fill="#38bdf8" />
          <circle cx="2" cy="11" r="1" fill="#ffffff" />
          <circle cx="22" cy="11" r="1" fill="#ffffff" />

          {/* Boots */}
          <rect x="8" y="21" width="3" height="6" fill="#020617" />
          <rect x="13" y="21" width="3" height="6" fill="#020617" />
        </motion.svg>
      </div>
    );
  }

  // RENJI ABARAI
  if (heroId === 'renji') {
    return (
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 0.85, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.7 }}
          className="absolute -inset-6 rounded-full bg-red-600/25 blur-xl pointer-events-none"
        />

        <motion.svg
          width={92}
          height={110}
          viewBox="0 0 24 28"
          className="pixel-art drop-shadow-2xl relative z-10"
          animate={
            isHurt
              ? { x: [-16, 16, -10, 10, 0], opacity: [1, 0.25, 1] }
              : animState === 'idle'
              ? { scaleY: [1, 1.03, 1], y: [0, -2, 0] }
              : animState === 'slash_strike' || animState === 'test_attack'
              ? { x: [0, 135, 195, 0], y: [0, -15, 5, 0], rotate: [0, -20, 30, 0] }
              : {}
          }
          transition={{ duration: animState === 'idle' ? 1.7 : 0.5, repeat: animState === 'idle' ? Infinity : 0 }}
        >
          {/* Crimson Spiky Ponytail */}
          <polygon points="12,1 8,6 16,6" fill="#dc2626" />
          <polygon points="12,-1 16,-5 17,2" fill="#b91c1c" />
          <polygon points="6,3 4,9 10,8" fill="#dc2626" />

          {/* Face with Tribal Forehead Marks */}
          <rect x="7" y="6" width="10" height="7" fill="#fed7aa" rx="1" />
          <line x1="8" y1="7" x2="16" y2="7" stroke="#020617" strokeWidth="1" />
          <polygon points="10,8 12,9 14,8" fill="#020617" />
          <rect x="8.5" y="9" width="1.5" height="1.5" fill="#7f1d1d" />
          <rect x="14" y="9" width="1.5" height="1.5" fill="#7f1d1d" />

          {/* Black Shihakusho */}
          <rect x="6" y="13" width="12" height="8" fill="#090d16" rx="1" />
          <polygon points="11,13 13,13 12,16" fill="#f8fafc" />

          {/* Zabimaru Segmented Whip Blade */}
          <rect x="19" y="4" width="2.5" height="22" fill="#94a3b8" />
          <polygon points="18,7 16,9 19,9" fill="#e2e8f0" />
          <polygon points="18,12 16,14 19,14" fill="#e2e8f0" />
          <polygon points="18,17 16,19 19,19" fill="#e2e8f0" />

          {/* Boots */}
          <rect x="8" y="21" width="3" height="6" fill="#f8fafc" />
          <rect x="13" y="21" width="3" height="6" fill="#f8fafc" />
        </motion.svg>
      </div>
    );
  }

  // SHUNSUI KYORAKU
  if (heroId === 'shunsui') {
    return (
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 0.85, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -inset-6 rounded-full bg-pink-500/25 blur-xl pointer-events-none"
        />

        <motion.svg
          width={94}
          height={112}
          viewBox="0 0 24 28"
          className="pixel-art drop-shadow-2xl relative z-10"
          animate={
            isHurt
              ? { x: [-16, 16, -10, 10, 0], opacity: [1, 0.25, 1] }
              : animState === 'idle'
              ? { scaleY: [1, 1.03, 1], y: [0, -2, 0] }
              : animState === 'slash_strike' || animState === 'test_attack'
              ? { x: [0, 130, 190, 0], y: [0, -15, 0, 0], rotate: [0, -15, 25, 0] }
              : {}
          }
          transition={{ duration: animState === 'idle' ? 2 : 0.5, repeat: animState === 'idle' ? Infinity : 0 }}
        >
          {/* Straw Hat (Kusa-Boshi) */}
          <polygon points="12,1 2,6 22,6" fill="#d97706" />
          <rect x="6" y="5" width="12" height="2" fill="#b45309" />

          {/* Face with Eyepatch & Stubble */}
          <rect x="7" y="7" width="10" height="6" fill="#fed7aa" rx="1" />
          <rect x="13.5" y="8" width="3" height="3" fill="#020617" />
          <rect x="8.5" y="9" width="1.5" height="1.5" fill="#451a03" />

          {/* Pink Floral Haori over Robes */}
          <rect x="5" y="13" width="14" height="9" fill="#f472b6" rx="1" />
          <circle cx="8" cy="15" r="1" fill="#ec4899" />
          <circle cx="16" cy="17" r="1" fill="#ec4899" />
          <rect x="9" y="13" width="6" height="9" fill="#020617" />

          {/* Twin Katen Kyokotsu Blades */}
          <rect x="19" y="7" width="1.5" height="18" fill="#e2e8f0" />
          <rect x="4" y="7" width="1.5" height="18" fill="#e2e8f0" />

          {/* Boots */}
          <rect x="8" y="22" width="3" height="5" fill="#78350f" />
          <rect x="13" y="22" width="3" height="5" fill="#78350f" />
        </motion.svg>
      </div>
    );
  }

  // GENRYUSAI SHIGEKUNI YAMAMOTO (DEFAULT / TITAN)
  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.6, 0.95, 0.6] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute -inset-8 rounded-full bg-orange-600/35 blur-2xl pointer-events-none"
      />

      <motion.svg
        width={98}
        height={116}
        viewBox="0 0 24 28"
        className="pixel-art drop-shadow-2xl relative z-10"
        animate={
          isHurt
            ? { x: [-16, 16, -10, 10, 0], opacity: [1, 0.25, 1] }
            : animState === 'idle'
            ? { scaleY: [1, 1.03, 1], y: [0, -3, 0] }
            : animState === 'slash_strike' || animState === 'test_attack'
            ? { x: [0, 140, 210, 0], y: [0, -25, 5, 0], rotate: [0, -30, 40, 0] }
            : {}
        }
        transition={{ duration: animState === 'idle' ? 1.8 : 0.5, repeat: animState === 'idle' ? Infinity : 0 }}
      >
        {/* Bald Head with Crossed Battle Scars */}
        <polygon points="12,2 6,8 18,8" fill="#fed7aa" />
        <rect x="6" y="5" width="12" height="4" fill="#fed7aa" rx="2" />
        <line x1="9" y1="4" x2="13" y2="8" stroke="#991c1c" strokeWidth="0.8" />
        <line x1="13" y1="4" x2="9" y2="8" stroke="#991c1c" strokeWidth="0.8" />

        {/* Severe Fiery Eyes */}
        <rect x="8" y="8" width="2" height="1.5" fill="#ea580c" />
        <rect x="14" y="8" width="2" height="1.5" fill="#ea580c" />

        {/* Majestic Long White Beard down to belt */}
        <polygon points="8,10 16,10 12,20" fill="#f8fafc" />
        <polygon points="9,10 15,10 12,22" fill="#e2e8f0" />

        {/* Captain-Commander Haori */}
        <rect x="5" y="12" width="14" height="10" fill="#f8fafc" rx="1" />
        <rect x="8" y="12" width="8" height="10" fill="#020617" />
        <line x1="5" y1="20" x2="19" y2="20" stroke="#f59e0b" strokeWidth="1" />

        {/* Zanka no Tachi Scorched Blade with Solar Embers */}
        <rect x="20" y="2" width="2" height="24" fill="#020617" />
        <line x1="20" y1="2" x2="20" y2="26" stroke="#f97316" strokeWidth="1" />
        <circle cx="21" cy="8" r="1.5" fill="#ea580c" className="animate-ping" />

        {/* Boots */}
        <rect x="8" y="22" width="3" height="5" fill="#020617" />
        <rect x="13" y="22" width="3" height="5" fill="#020617" />
      </motion.svg>
    </div>
  );
}

// -------------------------------------------------------------
// MAIN CHARACTERS VIEW COMPONENT
// -------------------------------------------------------------
export default function CharactersView({
  geo,
  unlockedHeroIds,
  selectedHeroId,
  onHeroAction,
  onOpenArena
}: {
  geo: number;
  unlockedHeroIds: BleachHeroId[];
  selectedHeroId: BleachHeroId;
  onHeroAction: (hero: BleachHeroConfig) => void;
  onOpenArena: () => void;
}) {
  const [inspectedHeroId, setInspectedHeroId] = useState<BleachHeroId>(selectedHeroId);
  const [animState, setAnimState] = useState<string>('idle');
  const [showLoreModal, setShowLoreModal] = useState(false);

  const inspectedHero = BLEACH_ROSTER[inspectedHeroId] || BLEACH_ROSTER.ichigo;
  const isUnlocked = unlockedHeroIds.includes(inspectedHero.id);
  const isEquipped = selectedHeroId === inspectedHero.id;
  const canAfford = geo >= inspectedHero.geoCost;

  const triggerTestAttack = () => {
    if (animState !== 'idle') return;
    setAnimState('test_attack');
    setTimeout(() => {
      setAnimState('idle');
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono text-slate-100 space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-slate-900/90 border-2 border-amber-500/80 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black tracking-widest bg-amber-500 text-slate-950 uppercase">
                SEIREITEI SHINIGAMI ARMORY
              </span>
              <span className="text-xs text-amber-400/80 font-bold">
                ENDURANCE & COMBAT SPECIALISTS
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Awaken Bleach Heroes for Difficult Tests
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Higher-tier academic tests feature aggressive Espada attacks and powerful Cero strikes. 
              Unlock and equip resilient champions with higher heart counts, damage mitigation shields, and healing passives to survive tough evaluations.
            </p>
          </div>

          {/* Geo Purse Status */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="p-3 bg-slate-950 border-2 border-amber-500/60 rounded-xl flex items-center space-x-3 shadow-lg shadow-amber-500/15">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Coins className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Available Geo Purse</span>
                <span className="text-lg font-black text-amber-300 tracking-wider">{geo} GEO</span>
              </div>
            </div>

            <button
              onClick={onOpenArena}
              className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs uppercase rounded-xl transition flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Swords className="w-4 h-4" />
              <span>Enter Arena</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Roster & Inspection Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Pixel Hero Stage & Combat Specs */}
        <div className="lg:col-span-5 bg-slate-900 border-2 border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between z-10">
            <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-300 border border-amber-500/40">
              {inspectedHero.tag}
            </span>
            {isEquipped ? (
              <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Currently Active</span>
              </span>
            ) : isUnlocked ? (
              <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                Unlocked & Ready
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider bg-rose-950/60 text-rose-300 border border-rose-500/40 flex items-center space-x-1">
                <Lock className="w-3 h-3 text-rose-400" />
                <span>{inspectedHero.geoCost} Geo to Unlock</span>
              </span>
            )}
          </div>

          {/* Centered Hero Stage with Pixel Sprite */}
          <div className="my-4 py-8 bg-slate-950/80 rounded-xl border border-slate-800/80 relative flex flex-col items-center justify-center min-h-[200px]">
            <BleachPixelSprite
              heroId={inspectedHero.id}
              animState={animState}
              isHurt={false}
            />

            <div className="mt-4 text-center z-10">
              <h2 className="text-lg font-black text-white">{inspectedHero.name}</h2>
              <p className="text-[11px] text-slate-400">{inspectedHero.division}</p>
              <p className="text-[10px] text-cyan-400 font-semibold mt-0.5">
                Zanpakuto: <span className="italic">{inspectedHero.zanpakuto}</span>
              </p>
            </div>
          </div>

          {/* Interactive Hero Actions */}
          <div className="grid grid-cols-2 gap-2 z-10">
            <button
              onClick={triggerTestAttack}
              disabled={animState !== 'idle'}
              className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              <Swords className="w-3.5 h-3.5 text-cyan-400" />
              <span>Test Slash Attack</span>
            </button>

            <button
              onClick={() => setShowLoreModal(true)}
              className="py-2.5 bg-slate-950 hover:bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Read Lore & Bankai</span>
            </button>
          </div>

          {/* Primary Equip / Buy Action Button */}
          <button
            onClick={() => onHeroAction(inspectedHero)}
            disabled={isEquipped || (!isUnlocked && !canAfford)}
            className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition cursor-pointer shadow-lg ${
              isEquipped
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-default'
                : isUnlocked
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-cyan-500/30'
                : canAfford
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-amber-500/40'
                : 'bg-slate-800 text-slate-600 border border-slate-800 cursor-not-allowed'
            }`}
          >
            {isEquipped ? (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Equipped as Active Fighter</span>
              </>
            ) : isUnlocked ? (
              <>
                <Check className="w-4 h-4" />
                <span>Equip {inspectedHero.name}</span>
              </>
            ) : canAfford ? (
              <>
                <Coins className="w-4 h-4" />
                <span>Awaken & Equip ({inspectedHero.geoCost} Geo)</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Need {inspectedHero.geoCost - geo} More Geo to Unlock</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Hero Endurance Specs, Passives & Complete Roster Cards */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Endurance & Survivability Breakdown Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider">
                  Combat Endurance Profile
                </span>
                <h3 className="text-base font-black text-white">
                  {inspectedHero.name}’s Survivability Metrics
                </h3>
              </div>
              <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-lg text-xs font-bold">
                {inspectedHero.enduranceTier}
              </span>
            </div>

            {/* Endurance Stat Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Starting Hearts</span>
                <div className="flex items-center space-x-1.5 mt-1">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span className="text-base font-black text-rose-400">
                    {inspectedHero.baseHearts} Hearts
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Damage Bonus</span>
                <div className="flex items-center space-x-1.5 mt-1">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-base font-black text-cyan-300">
                    +{inspectedHero.damageBonus} DMG
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Geo Reward Boost</span>
                <div className="flex items-center space-x-1.5 mt-1">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span className="text-base font-black text-amber-300">
                    {inspectedHero.bonusGeoMultiplier}x Geo
                  </span>
                </div>
              </div>
            </div>

            {/* Signature Defensive / Tactical Passive */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-black text-emerald-300 uppercase">
                  Signature Passive: {inspectedHero.passiveName}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">
                {inspectedHero.passiveDesc}
              </p>
            </div>

            {/* Test Survivability Bullet Points */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Why Choose for Difficult Tests & Boss Battles:
              </span>
              <div className="space-y-1">
                {inspectedHero.enduranceHighlights.map((hl, i) => (
                  <div key={i} className="flex items-center space-x-2 text-xs text-slate-300">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Roster Grid (All 6 Bleach Champions) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
                Select a Shinigami to Inspect / Purchase:
              </h3>
              <span className="text-[10px] text-slate-500">
                {unlockedHeroIds.length} / {Object.keys(BLEACH_ROSTER).length} Owned
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Object.keys(BLEACH_ROSTER) as BleachHeroId[]).map((heroKey) => {
                const hero = BLEACH_ROSTER[heroKey];
                const isSelected = inspectedHero.id === hero.id;
                const isHeroUnlocked = unlockedHeroIds.includes(hero.id);
                const isHeroEquipped = selectedHeroId === hero.id;

                return (
                  <div
                    key={hero.id}
                    onClick={() => setInspectedHeroId(hero.id)}
                    className={`p-3 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between space-y-2 relative ${
                      isSelected
                        ? 'border-amber-400 bg-amber-950/20 shadow-lg shadow-amber-500/10'
                        : isHeroUnlocked
                        ? 'border-slate-800 bg-slate-950 hover:border-slate-700'
                        : 'border-slate-800/70 bg-slate-950/50 opacity-75 hover:opacity-100 hover:border-slate-700'
                    }`}
                  >
                    {isHeroEquipped && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    )}

                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-black text-white truncate">{hero.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                        {hero.zanpakuto}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
                      <span className="text-rose-400 font-bold flex items-center space-x-0.5">
                        <Heart className="w-2.5 h-2.5 fill-rose-500" />
                        <span>{hero.baseHearts}H</span>
                      </span>

                      {isHeroUnlocked ? (
                        <span className="text-emerald-400 font-bold flex items-center space-x-0.5">
                          <Check className="w-3 h-3" />
                          <span>Owned</span>
                        </span>
                      ) : (
                        <span className="text-amber-400 font-black">
                          {hero.geoCost} G
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Lore & Bankai Modal */}
      {showLoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-500/80 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  Seireitei Archives // Classified
                </span>
                <h3 className="text-base font-black text-white">
                  {inspectedHero.name}
                </h3>
              </div>
              <button
                onClick={() => setShowLoreModal(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {inspectedHero.lore}
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-indigo-400 font-bold uppercase block">
                Zanpakuto Release Command:
              </span>
              <p className="text-xs font-black text-indigo-300 italic">
                {inspectedHero.releaseCommand}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Bankai: <b className="text-white">{inspectedHero.bankaiName}</b>
              </p>
            </div>

            <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl">
              <span className="text-[10px] text-amber-300 font-bold uppercase block mb-1">
                Iconic Anime Quote:
              </span>
              <p className="text-xs text-amber-200/90 italic">
                {inspectedHero.quote}
              </p>
            </div>

            <button
              onClick={() => setShowLoreModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Close Archives
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
