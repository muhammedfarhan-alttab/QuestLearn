'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import questionsData from '../data/questions.json';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Zap, 
  ShieldAlert, 
  Trophy, 
  Star, 
  RotateCcw, 
  ArrowRight,
  Swords,
  Skull,
  Eye,
  CircleDot,
  Heart,
  LogOut,
  Flame,
  ShieldCheck,
  Compass,
  ShoppingBag,
  Lock,
  Check,
  CheckCircle2,
  Coins,
  Shield,
  Crosshair,
  Hourglass,
  BookOpen,
  Scroll,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  BarChart3,
  Layers,
  User,
  Map
} from 'lucide-react';
import DashboardView from './components/DashboardView';
import DiagnosticQuizView from './components/DiagnosticQuizView';
import LoginModal, { UserProfile } from './components/LoginModal';
import CoursesView, { CourseData, ACADEMIC_COURSES } from './components/CoursesView';
import WorldMapView, { WorldStageNode, DEFAULT_MAP_STAGES } from './components/WorldMapView';
import CharactersView, { 
  BleachHeroId, 
  BleachAttributes, 
  BleachHeroConfig, 
  BLEACH_ROSTER, 
  BleachPixelSprite 
} from './components/CharactersView';
import { getStageQuestions } from '../data/courseQuestions';
import LectureNotesModal from './components/LectureNotesModal';
import ProfileInspectionModal, { BleachVillainConfig, InspectedTarget } from './components/ProfileInspectionModal';
import { BLEACH_BOSS_CATALOG, getStageBoss } from './data/bossesData';

// -------------------------------------------------------------
// Algorithm: AI Diagnostic to Personalized World Map Plan
// -------------------------------------------------------------
export function buildPersonalizedStages(
  courseId: string, 
  overallMastery: number, 
  diagnosedGaps: string[]
): WorldStageNode[] {
  const masteryPct = Math.round(overallMastery * 100);
  const hasGaps = diagnosedGaps.length > 0;

  if (courseId === 'course-calculus') {
    return [
      {
        id: 1,
        stageNumber: 1,
        name: 'Limits & Asymptotic Boundaries',
        conceptFocus: 'Foundational Limits & Continuity',
        realmLocation: 'Seireitei Library // Central 46 Archive',
        kanji: '極限の領域',
        lore: 'The boundary where infinitesimals converge towards precise analytical limits under Soul Society logic.',
        themeColor: '#818cf8',
        status: hasGaps ? 'remediation_priority' : 'unlocked',
        masteryPct: Math.max(30, masteryPct - 15),
        stars: 0,
        isBoss: false,
        bossId: 'grand_fisher',
        bossName: 'Grand Fisher (Foundational Hollow)',
        tier: 'easy'
      },
      {
        id: 2,
        stageNumber: 2,
        name: 'Differential Operator & Power Chains',
        conceptFocus: 'Chain Rule, Product Rule & Implicit Slopes',
        realmLocation: 'Senkaimon Dimensional Corridor',
        kanji: '微分回廊',
        lore: 'Deconstruct accelerating velocities into instantaneous tangent rates through high-order derivative mastery.',
        themeColor: '#38bdf8',
        status: 'locked',
        masteryPct: Math.max(20, masteryPct - 25),
        stars: 0,
        isBoss: false,
        bossId: 'renji_boss',
        bossName: 'Renji Abarai (Roar Zabimaru)',
        tier: 'easy'
      },
      {
        id: 3,
        stageNumber: 3,
        name: 'Concavity & Stationary Extremum',
        conceptFocus: 'Optimization, Inflection Points & Mean Value',
        realmLocation: 'Sokyoku Hill Ridge',
        kanji: '極値の丘',
        lore: 'Analyze curvature, critical extrema, and maximum output boundaries across the execution plateau.',
        themeColor: '#f472b6',
        status: 'locked',
        masteryPct: 20,
        stars: 0,
        isBoss: false,
        bossId: 'grimmjow',
        bossName: 'Grimmjow Jaegerjaquez (Pantera)',
        tier: 'intermediate'
      },
      {
        id: 4,
        stageNumber: 4,
        name: 'Riemann Accumulation & Integrals',
        conceptFocus: 'Definite Integrals & Fundamental Theorem',
        realmLocation: 'Wandenreich Frozen Monolith',
        kanji: '積分氷壁',
        lore: 'Sum infinite infinitesimal slices of Reiatsu to calculate total accumulated energy beneath the function curve.',
        themeColor: '#0284c7',
        status: 'locked',
        masteryPct: 15,
        stars: 0,
        isBoss: false,
        bossId: 'szayelaporro',
        bossName: 'Szayelaporro Granz (Calculus Architect)',
        tier: 'intermediate'
      },
      {
        id: 5,
        stageNumber: 5,
        name: 'Grand Apex Demigod Calculus Exam',
        conceptFocus: 'Comprehensive Differential & Integral Mastery',
        realmLocation: 'Throne of the Quincy Emperor // Silbern',
        kanji: '全知全能の玉座',
        lore: 'Face Sosuke Aizen in the realm of infinite limits and transcendental calculus series!',
        themeColor: '#eab308',
        status: 'locked',
        masteryPct: 10,
        stars: 0,
        isBoss: true,
        bossId: 'aizen_boss',
        bossName: 'Sosuke Aizen (Transcendent Hōgyoku)',
        tier: 'hard'
      }
    ];
  }

  if (courseId === 'course-electromagnetism') {
    return [
      {
        id: 1,
        stageNumber: 1,
        name: 'Coulombic Point Charges & Fields',
        conceptFocus: 'Inverse-Square Force & Electric Dipoles',
        realmLocation: 'Karakura High-Voltage Substation',
        kanji: '電荷の領域',
        lore: 'Trace electric flux vectors radiated by charged spiritual particles across the physical barrier.',
        themeColor: '#f59e0b',
        status: hasGaps ? 'remediation_priority' : 'unlocked',
        masteryPct: Math.max(30, masteryPct - 15),
        stars: 0,
        isBoss: false,
        bossId: 'grand_fisher',
        bossName: 'Grand Fisher (Coulombic Spark)',
        tier: 'easy'
      },
      {
        id: 2,
        stageNumber: 2,
        name: 'Gaussian Enclosure & Symmetrical Flux',
        conceptFocus: 'Gauss Law & Cylindrical/Planar Symmetry',
        realmLocation: 'Garganta Void Gate',
        kanji: 'ガウスの境界',
        lore: 'Construct closed Gaussian surfaces through dimensional fissures to integrate total enclosed spiritual charge.',
        themeColor: '#38bdf8',
        status: 'locked',
        masteryPct: Math.max(20, masteryPct - 20),
        stars: 0,
        isBoss: false,
        bossId: 'renji_boss',
        bossName: 'Renji Abarai (Electric Roar Zabimaru)',
        tier: 'easy'
      },
      {
        id: 3,
        stageNumber: 3,
        name: 'Kirchhoff Loops & Circuit Dynamics',
        conceptFocus: 'Resistors, Capacitance & Potential Drops',
        realmLocation: 'Hueco Mundo Lower Catacombs',
        kanji: '電気回路の迷宮',
        lore: 'Balance conservation of charge and energy across branching parallel circuits in the hollow caverns.',
        themeColor: '#10b981',
        status: 'locked',
        masteryPct: 25,
        stars: 0,
        isBoss: false,
        bossId: 'grimmjow',
        bossName: 'Grimmjow Jaegerjaquez (Current Claws)',
        tier: 'intermediate'
      },
      {
        id: 4,
        stageNumber: 4,
        name: 'Lorentz Deflection & Magnetic Induction',
        conceptFocus: 'Cross-Product Magnetic Deflection & Faraday Law',
        realmLocation: 'Las Noches Perimeter Shield',
        kanji: 'ローレンツ力場',
        lore: 'Counter Ulquiorra’s emerald Cero blasts using the right-hand rule to deflect high-energy electron beams.',
        themeColor: '#06b6d4',
        status: 'locked',
        masteryPct: 15,
        stars: 0,
        isBoss: false,
        bossId: 'ulquiorra',
        bossName: 'Ulquiorra Cifer (Electromagnetic Cero)',
        tier: 'intermediate'
      },
      {
        id: 5,
        stageNumber: 5,
        name: 'Grand Apex Demigod Electromagnetism Exam',
        conceptFocus: 'Comprehensive Maxwellian Synthesis',
        realmLocation: 'Throne Room of the Soul King // Wahrwelt',
        kanji: '全知全能の雷',
        lore: 'Confront Yhwach The Almighty, commanding full electromagnetic synthesis to survive the cataclysmic Reishi lightning!',
        themeColor: '#eab308',
        status: 'locked',
        masteryPct: 10,
        stars: 0,
        isBoss: true,
        bossId: 'yhwach',
        bossName: 'Yhwach, The Quincy King',
        tier: 'hard'
      }
    ];
  }

  if (courseId === 'course-cs') {
    return [
      {
        id: 1,
        stageNumber: 1,
        name: 'Asymptotic Complexity & Memory Bounds',
        conceptFocus: 'Big-O Growth Rates & Space-Time Tradeoffs',
        realmLocation: 'Urahara Research Laboratory',
        kanji: '計算量の回廊',
        lore: 'Analyze algorithm efficiency across extreme orders of magnitude before diving into dynamic structures.',
        themeColor: '#06b6d4',
        status: hasGaps ? 'remediation_priority' : 'unlocked',
        masteryPct: Math.max(30, masteryPct - 10),
        stars: 0,
        isBoss: false,
        bossId: 'grand_fisher',
        bossName: 'Grand Fisher (Brute Force Hollow)',
        tier: 'easy'
      },
      {
        id: 2,
        stageNumber: 2,
        name: 'Execution Context & Lexical Closures',
        conceptFocus: 'Call Stack, Scope Chains & Memory Heap',
        realmLocation: 'Research & Development 12th Division',
        kanji: '記憶空間',
        lore: 'Master persistent lexical scope environments and memory allocation across asynchronous execution boundaries.',
        themeColor: '#a855f7',
        status: 'locked',
        masteryPct: Math.max(20, masteryPct - 20),
        stars: 0,
        isBoss: false,
        bossId: 'renji_boss',
        bossName: 'Renji Abarai (Segment Tree Whip)',
        tier: 'easy'
      },
      {
        id: 3,
        stageNumber: 3,
        name: 'Self-Balancing Trees & Recursion Depth',
        conceptFocus: 'AVL Trees, Binary Search Invariants & Depth',
        realmLocation: 'Mukenh Underground Prison Gates',
        kanji: '二分探索樹の封印',
        lore: 'Traverse hierarchical logarithmic trees to maintain AVL balancing invariants against rogue data corruption.',
        themeColor: '#3b82f6',
        status: 'locked',
        masteryPct: 25,
        stars: 0,
        isBoss: false,
        bossId: 'grimmjow',
        bossName: 'Grimmjow Jaegerjaquez (Greedy Panther)',
        tier: 'intermediate'
      },
      {
        id: 4,
        stageNumber: 4,
        name: 'Dynamic Programming & Memoized Graphs',
        conceptFocus: 'Optimal Substructure & Memoization DAGs',
        realmLocation: 'Las Noches Throne Room',
        kanji: '動的計画法',
        lore: 'Break complex recursive problems into overlapping subproblems to achieve polynomial time solutions.',
        themeColor: '#ec4899',
        status: 'locked',
        masteryPct: 20,
        stars: 0,
        isBoss: false,
        bossId: 'szayelaporro',
        bossName: 'Szayelaporro Granz (Recursive Parasite)',
        tier: 'intermediate'
      },
      {
        id: 5,
        stageNumber: 5,
        name: 'Grand Apex Demigod Computer Science Exam',
        conceptFocus: 'Advanced Algorithmic Mastery & Complete Hypnosis',
        realmLocation: 'False Karakura Town // Kyoka Suigetsu',
        kanji: '鏡花水月の鏡',
        lore: 'Battle Sosuke Aizen in the absolute illusion realm, proving true algorithmic correctness against complete hypnosis!',
        themeColor: '#eab308',
        status: 'locked',
        masteryPct: 10,
        stars: 0,
        isBoss: true,
        bossId: 'aizen_boss',
        bossName: 'Sosuke Aizen (Complete Hypnosis)',
        tier: 'hard'
      }
    ];
  }

  // Default: Classical Mechanics (course-mechanics)
  return [
    {
      id: 1,
      stageNumber: 1,
      name: 'Displacement & Kinetic Velocity',
      conceptFocus: 'Foundational Vectors & Displacement',
      realmLocation: 'Urahara Underground Training Grounds',
      kanji: '地下修練場',
      lore: 'Deep beneath the Urahara candy shop, fractured bedrock serves as the proving ground for raw kinetic motion and directional displacement.',
      themeColor: '#f97316',
      status: hasGaps ? 'remediation_priority' : 'unlocked',
      masteryPct: Math.max(30, masteryPct - 15),
      stars: 0,
      isBoss: false,
      bossId: 'grand_fisher',
      bossName: 'Grand Fisher (Kinetic Hollow)',
      tier: 'easy'
    },
    {
      id: 2,
      stageNumber: 2,
      name: 'Newtonian Force & Reaction Pairs',
      conceptFocus: 'Net Force & Inertial Reference',
      realmLocation: 'Rukongai Outskirts // Jidanbo Iron Gate',
      kanji: '流魂街・白道門',
      lore: 'Beyond the colossal iron gates, Newton’s laws of opposing action dictate whether your Reiatsu shatters the gate or is repelled.',
      themeColor: '#38bdf8',
      status: 'locked',
      masteryPct: Math.max(20, masteryPct - 20),
      stars: 0,
      isBoss: false,
      bossId: 'renji_boss',
      bossName: 'Renji Abarai (Newtonian Whip)',
      tier: 'easy'
    },
    {
      id: 3,
      stageNumber: 3,
      name: 'Work-Energy & Potential Wells',
      conceptFocus: 'Conservation of Mechanical Energy',
      realmLocation: 'Seireitei Senkaimon Gateways',
      kanji: '瀞霊廷・穿界門',
      lore: 'The boundary portal where potential and kinetic Reiatsu continuously transform according to the laws of thermodynamic conservation.',
      themeColor: '#f472b6',
      status: 'locked',
      masteryPct: 20,
      stars: 0,
      isBoss: false,
      bossId: 'grimmjow',
      bossName: 'Grimmjow Jaegerjaquez (Kinetic Beast)',
      tier: 'intermediate'
    },
    {
      id: 4,
      stageNumber: 4,
      name: 'Elastic Momentum & High-Speed Sonido',
      conceptFocus: 'Impulse, Inelastic Impact & Center of Mass',
      realmLocation: 'Hueco Mundo // Desert of Las Noches',
      kanji: '虚圏・白砂の領域',
      lore: 'The desolate quartz expanse where supersonic speed and momentum transfer collide beneath a perpetual crescent moon.',
      themeColor: '#0284c7',
      status: 'locked',
      masteryPct: 15,
      stars: 0,
      isBoss: false,
      bossId: 'ulquiorra',
      bossName: 'Ulquiorra Cifer (Resonant Waveform)',
      tier: 'intermediate'
    },
    {
      id: 5,
      stageNumber: 5,
      name: 'Grand Apex Demigod Battle',
      conceptFocus: 'Comprehensive Multi-Concept Synthesis',
      realmLocation: 'Sokyoku Execution Hill // Ruins of 1st Division',
      kanji: '残火の太刀',
      lore: 'The summit of Soul Society where torque, angular momentum, and razor execution blades face the supreme Head Captain: Genryūsai Yamamoto!',
      themeColor: '#eab308',
      status: 'locked',
      masteryPct: 10,
      stars: 0,
      isBoss: true,
      bossId: 'yamamoto_boss',
      bossName: 'Genryūsai Yamamoto (Zanka no Tachi)',
      tier: 'hard'
    }
  ];
}

// -------------------------------------------------------------
// Bleach Character Class Definitions & Seireitei Lore
// -------------------------------------------------------------
export type { BleachHeroId, BleachAttributes, BleachHeroConfig };
export { BLEACH_ROSTER, BleachPixelSprite };

// -------------------------------------------------------------
// Bleach Antagonist Boss Configurations (2-Phase Resurrección)
// -------------------------------------------------------------
export const BLEACH_VILLAINS: Record<'easy' | 'intermediate' | 'hard', BleachVillainConfig> = {
  easy: BLEACH_BOSS_CATALOG.grimmjow,
  intermediate: BLEACH_BOSS_CATALOG.ulquiorra,
  hard: BLEACH_BOSS_CATALOG.yhwach
};

interface StanceConfig {
  name: string;
  title: string;
  stanceName: string;
  badge: string;
  accentColor: string;
  baseDamage: number;
}

const BLEACH_STANCES: Record<'apprentice' | 'arcane' | 'phantom' | 'sovereign', StanceConfig> = {
  apprentice: {
    name: 'Zanjutsu Slash',
    title: 'Basic Blade Strike',
    stanceName: 'Shikai Stance',
    badge: '⚔️ ZANJUTSU STRIKE',
    accentColor: '#38bdf8',
    baseDamage: 25
  },
  arcane: {
    name: 'Shikai Awakening',
    title: 'Zanpakuto Release',
    stanceName: 'Awakened Blade',
    badge: '🔮 SHIKAI RELEASE',
    accentColor: '#06b6d4',
    baseDamage: 45
  },
  phantom: {
    name: 'Flash Step (Hohō)',
    title: 'Supersonic Shift',
    stanceName: 'Hohō Mirage Stance',
    badge: '🩸 SHUNPO BURST',
    accentColor: '#f43f5e',
    baseDamage: 75
  },
  sovereign: {
    name: 'Bankai Overdrive',
    title: 'Full Spiritual Release',
    stanceName: 'Bankai Transcendent',
    badge: '🌌 BANKAI AWAKENED',
    accentColor: '#a855f7',
    baseDamage: 115
  }
};

// -------------------------------------------------------------
// AUTHENTIC BLEACH BACKGROUNDS
// -------------------------------------------------------------
function BleachArenaBackground({ bgType }: { bgType: 'seireitei' | 'huecomundo' | 'wandenreich' }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {/* 1. SEIREITEI // SOKYOKU HILL */}
      {bgType === 'seireitei' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0284c7]/30 via-[#0369a1]/40 to-[#020617]">
          {/* Swirling Cherry Blossom Sakura Petals */}
          <div className="absolute inset-0">
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, opacity: 0, x: Math.random() * 400 }}
                animate={{
                  y: [0, 260],
                  x: [0, (i % 2 === 0 ? 35 : -35)],
                  opacity: [0, 0.85, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4 + (i % 3),
                  delay: i * 0.35,
                  ease: 'linear'
                }}
                className="absolute w-2 h-1.5 rounded-full bg-pink-300 shadow-[0_0_8px_#f472b6] blur-[0.5px]"
                style={{ left: `${(i * 6.5) % 100}%` }}
              />
            ))}
          </div>

          {/* Sokyoku Hill Wooden Execution Cross Cliff in Background */}
          <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 60" preserveAspectRatio="none">
            {/* Sokyoku Cliff Silhouette */}
            <path d="M 0,60 L 30,35 L 50,45 L 75,25 L 100,60 Z" fill="#0f172a" />
            {/* Massive Wooden Sokyoku Execution Scaffold */}
            <line x1="75" y1="8" x2="75" y2="40" stroke="#78350f" strokeWidth="2.5" />
            <line x1="68" y1="16" x2="82" y2="16" stroke="#78350f" strokeWidth="2" />
            <polygon points="75,6 72,10 78,10" fill="#f59e0b" opacity="0.8" />
            {/* Seireitei Traditional Curved Pagoda Rooflines */}
            <polygon points="10,48 18,38 26,48" fill="#1e293b" />
            <polygon points="35,50 42,42 49,50" fill="#1e293b" />
          </svg>
        </div>
      )}

      {/* 2. HUECO MUNDO // DESERT OF LAS NOCHES */}
      {bgType === 'huecomundo' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#090d16] to-[#020617]">
          {/* White Reishi Sand Dust motes */}
          <div className="absolute inset-0">
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -10, opacity: 0, x: Math.random() * 400 }}
                animate={{
                  y: [0, 240],
                  x: [0, 25],
                  opacity: [0, 0.75, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3.5 + (i % 3),
                  delay: i * 0.4,
                  ease: 'linear'
                }}
                className="absolute w-1.5 h-1.5 rounded-full bg-slate-100 shadow-[0_0_8px_#ffffff] blur-[0.5px]"
                style={{ left: `${(i * 7.5) % 100}%` }}
              />
            ))}
          </div>

          {/* Bleach Iconic Horizontal Crescent Moon */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-24 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-transparent border-l-transparent -rotate-45 shadow-[0_0_40px_rgba(255,255,255,0.7)]" />
          </div>

          {/* White Quartz Desert Dunes & Colossal Las Noches Dome */}
          <svg className="absolute inset-0 w-full h-full opacity-45" viewBox="0 0 100 60" preserveAspectRatio="none">
            {/* Las Noches Dome */}
            <path d="M 30,50 Q 50,22 70,50 Z" fill="#334155" />
            <circle cx="50" cy="38" r="3" fill="#38bdf8" className="animate-pulse" />
            {/* Quartz Trees */}
            <line x1="20" y1="36" x2="20" y2="55" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="17" y1="42" x2="23" y2="39" stroke="#94a3b8" strokeWidth="1" />
            <line x1="85" y1="34" x2="85" y2="55" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="82" y1="40" x2="88" y2="38" stroke="#94a3b8" strokeWidth="1" />
            {/* White Sand Dunes */}
            <path d="M 0,55 Q 30,42 60,54 Q 80,48 100,58 L 100,60 L 0,60 Z" fill="#e2e8f0" opacity="0.6" />
          </svg>
        </div>
      )}

      {/* 3. WANDENREICH // SILBERN WAHRWELT */}
      {bgType === 'wandenreich' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#082f49]/80 via-[#0c4a6e]/90 to-[#020617]">
          {/* Blue Reiishi Crystal Snow Motes */}
          <div className="absolute inset-0">
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, opacity: 0, x: Math.random() * 400 }}
                animate={{
                  y: [0, 260],
                  x: [0, (i % 2 === 0 ? 20 : -20)],
                  opacity: [0, 0.9, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3 + (i % 4),
                  delay: i * 0.3,
                  ease: 'linear'
                }}
                className="absolute w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#38bdf8] blur-[0.5px]"
                style={{ left: `${(i * 6.5) % 100}%` }}
              />
            ))}
          </div>

          {/* Giant Glowing Five-Pointed Quincy Cross (Reishi Stern) */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-28 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full border border-cyan-400/40 shadow-[0_0_50px_rgba(56,189,248,0.5)] flex items-center justify-center animate-pulse">
              <svg width="40" height="40" viewBox="0 0 24 24" className="text-cyan-300 drop-shadow-[0_0_15px_#38bdf8]">
                <polygon points="12,1 15,9 23,12 15,15 12,23 9,15 1,12 9,9" fill="#38bdf8" />
              </svg>
            </div>
          </div>

          {/* Silbern Ice-Crystalline Towers & Diamond Spires */}
          <svg className="absolute inset-0 w-full h-full opacity-45" viewBox="0 0 100 60" preserveAspectRatio="none">
            <polygon points="15,60 18,20 22,60" fill="#0284c7" />
            <polygon points="26,60 28,30 31,60" fill="#0369a1" />
            <polygon points="68,60 72,15 75,60" fill="#0284c7" />
            <polygon points="80,60 84,28 87,60" fill="#0369a1" />
            <polygon points="45,60 50,22 55,60" fill="#075985" />
          </svg>
        </div>
      )}
    </div>
  );
}



// -------------------------------------------------------------
// AUTHENTIC BLEACH VILLAIN SPRITES (TAILORED TEST BOSSES)
// -------------------------------------------------------------
function BleachVillainSprite({
  tier = 'easy',
  bossId,
  bossRecoil,
  isAttacking,
  phase
}: {
  tier?: 'easy' | 'intermediate' | 'hard';
  bossId?: string;
  bossRecoil: boolean;
  isAttacking: boolean;
  phase: 1 | 2;
}) {
  const isPhase2 = phase === 2;

  // GRAND FISHER (HOLLOW STAGE 1)
  if (bossId === 'grand_fisher') {
    return (
      <div className="relative flex flex-col items-center">
        {isPhase2 && (
          <div className="absolute -inset-8 rounded-full bg-slate-500/30 blur-2xl animate-pulse pointer-events-none" />
        )}
        <motion.div
          animate={
            bossRecoil
              ? { x: [0, 25, -15, 10, 0], filter: ['brightness(1)', 'brightness(2.5)', 'brightness(1)'] }
              : isAttacking
              ? { x: [-45, 20, 0], scale: [1, 1.2, 1] }
              : { y: [0, -5, 0] }
          }
          transition={{ repeat: isAttacking || bossRecoil ? 0 : Infinity, duration: 2, ease: 'easeInOut' }}
          className="relative"
        >
          <svg width={isPhase2 ? 146 : 132} height={isPhase2 ? 146 : 132} viewBox="0 0 34 34" className="pixel-art drop-shadow-2xl">
            {/* Spiky Needle Hair on Back */}
            <polygon points="17,2 12,8 22,8" fill="#475569" />
            <polygon points="7,4 3,11 11,10" fill="#334155" />
            <polygon points="27,4 31,11 23,10" fill="#334155" />
            {isPhase2 && (
              <g className="animate-pulse">
                <line x1="17" y1="2" x2="17" y2="-4" stroke="#94a3b8" strokeWidth="1.5" />
                <circle cx="17" cy="-5" r="2" fill="#ef4444" />
              </g>
            )}

            {/* Bone Skull Mask with Hollow Hollows */}
            <polygon points="17,6 9,14 25,14" fill="#f8fafc" />
            <rect x="10" y="12" width="14" height="8" fill="#f8fafc" rx="2" />
            <rect x="12" y="14" width="3" height="2.5" fill="#ef4444" />
            <rect x="19" y="14" width="3" height="2.5" fill="#ef4444" />
            <polygon points="14,19 17,21 20,19" fill="#020617" />

            {/* Furry Hollow Body */}
            <rect x="9" y="20" width="16" height="10" fill="#1e293b" rx="2" />
            <rect x="12" y="22" width="10" height="7" fill="#334155" />

            {/* Piercing Needle Bone Claws */}
            <line x1="7" y1="18" x2="1" y2="28" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="27" y1="18" x2="33" y2="28" stroke="#cbd5e1" strokeWidth="2" />
            {isPhase2 && (
              <g>
                <line x1="5" y1="22" x2="-1" y2="30" stroke="#ef4444" strokeWidth="1.5" />
                <line x1="29" y1="22" x2="35" y2="30" stroke="#ef4444" strokeWidth="1.5" />
              </g>
            )}

            {/* Feet */}
            <rect x="10" y="29" width="5" height="4" fill="#0f172a" />
            <rect x="19" y="29" width="5" height="4" fill="#0f172a" />
          </svg>
        </motion.div>
      </div>
    );
  }

  // RENJI ABARAI (BOSS STAGE 2)
  if (bossId === 'renji_boss') {
    return (
      <div className="relative flex flex-col items-center">
        {isPhase2 && (
          <div className="absolute -inset-8 rounded-full bg-red-600/30 blur-2xl animate-pulse pointer-events-none" />
        )}
        <motion.div
          animate={
            bossRecoil
              ? { x: [0, 25, -15, 10, 0], filter: ['brightness(1)', 'brightness(2.5)', 'brightness(1)'] }
              : isAttacking
              ? { x: [-50, 20, 0], scale: [1, 1.25, 1] }
              : { y: [0, -6, 0] }
          }
          transition={{ repeat: isAttacking || bossRecoil ? 0 : Infinity, duration: 2, ease: 'easeInOut' }}
          className="relative"
        >
          <svg width={isPhase2 ? 148 : 134} height={isPhase2 ? 148 : 134} viewBox="0 0 34 34" className="pixel-art drop-shadow-2xl">
            {/* Crimson Spiky Hair Ponytail */}
            <polygon points="17,1 11,8 23,8" fill="#dc2626" />
            <polygon points="7,3 4,10 12,9" fill="#b91c1c" />
            <polygon points="27,3 30,10 22,9" fill="#b91c1c" />

            {/* Face & Forehead Tribal Markings */}
            <rect x="11" y="8" width="12" height="7" fill="#fed7aa" rx="1" />
            <line x1="12" y1="9" x2="22" y2="9" stroke="#020617" strokeWidth="1" />
            <rect x="13" y="11" width="2" height="1.5" fill="#7f1d1d" />
            <rect x="19" y="11" width="2" height="1.5" fill="#7f1d1d" />

            {/* Black Shihakusho with White Sash */}
            <rect x="10" y="15" width="14" height="10" fill="#090d16" rx="1" />
            <rect x="12" y="15" width="10" height="9" fill="#020617" />
            <rect x="10" y="21" width="14" height="2" fill="#f8fafc" />

            {/* Segmented Zabimaru Whip / Skull Cannon */}
            {!isPhase2 ? (
              <g>
                <rect x="25" y="8" width="3" height="20" fill="#94a3b8" />
                <polygon points="24,12 21,15 25,15" fill="#e2e8f0" />
                <polygon points="24,18 21,21 25,21" fill="#e2e8f0" />
              </g>
            ) : (
              /* Hihi-o Baboon Skull Cannon */
              <g className="animate-pulse">
                <rect x="24" y="6" width="6" height="10" fill="#f8fafc" rx="2" />
                <circle cx="26" cy="10" r="1.5" fill="#dc2626" />
                <circle cx="28" cy="10" r="1.5" fill="#dc2626" />
                <line x1="24" y1="16" x2="32" y2="30" stroke="#f87171" strokeWidth="3" />
              </g>
            )}

            {/* Legs */}
            <rect x="11" y="25" width="4.5" height="7" fill="#f8fafc" />
            <rect x="18.5" y="25" width="4.5" height="7" fill="#f8fafc" />
          </svg>
        </motion.div>
      </div>
    );
  }

  // SZAYELAPORRO GRANZ (SCIENTIST BOSS)
  if (bossId === 'szayelaporro') {
    return (
      <div className="relative flex flex-col items-center">
        {isPhase2 && (
          <div className="absolute -inset-8 rounded-full bg-pink-500/30 blur-2xl animate-pulse pointer-events-none" />
        )}
        <motion.div
          animate={
            bossRecoil
              ? { x: [0, 25, -15, 10, 0], filter: ['brightness(1)', 'brightness(2.5)', 'brightness(1)'] }
              : isAttacking
              ? { x: [-45, 20, 0], scale: [1, 1.2, 1] }
              : { y: [0, -6, 0] }
          }
          transition={{ repeat: isAttacking || bossRecoil ? 0 : Infinity, duration: 2, ease: 'easeInOut' }}
          className="relative"
        >
          <svg width={isPhase2 ? 150 : 136} height={isPhase2 ? 150 : 136} viewBox="0 0 34 34" className="pixel-art drop-shadow-2xl">
            {/* Mid-length Bright Pink Hair */}
            <polygon points="17,2 10,9 24,9" fill="#ec4899" />
            <polygon points="6,4 3,12 11,10" fill="#db2777" />
            <polygon points="28,4 31,12 23,10" fill="#db2777" />

            {/* Glasses Hollow Mask over right eye */}
            <rect x="11" y="8" width="12" height="7" fill="#fed7aa" rx="1" />
            <rect x="13" y="10" width="2" height="1.5" fill="#831843" />
            <rect x="19" y="10" width="2" height="1.5" fill="#831843" />
            <rect x="18" y="9" width="4" height="3" fill="none" stroke="#f8fafc" strokeWidth="1" />

            {/* White Arrancar Robe */}
            <rect x="10" y="15" width="14" height="11" fill="#f8fafc" rx="1" />
            <line x1="17" y1="15" x2="17" y2="26" stroke="#020617" strokeWidth="1" />

            {/* Phase 2: Fornicaras Teardrop Wings & Voodoo Doll */}
            {isPhase2 ? (
              <g className="animate-pulse">
                <polygon points="8,16 0,8 4,28" fill="#ec4899" opacity="0.8" />
                <polygon points="26,16 34,8 30,28" fill="#ec4899" opacity="0.8" />
                <circle cx="28" cy="18" r="3" fill="#831843" />
                <circle cx="28" cy="18" r="1.5" fill="#f472b6" />
              </g>
            ) : (
              <rect x="25" y="11" width="2" height="18" fill="#db2777" />
            )}

            {/* Boots */}
            <rect x="11" y="26" width="4" height="6" fill="#0f172a" />
            <rect x="19" y="26" width="4" height="6" fill="#0f172a" />
          </svg>
        </motion.div>
      </div>
    );
  }

  // SOSUKE AIZEN (CALCULUS TRANSCENDENT FINAL BOSS)
  if (bossId === 'aizen_boss') {
    return (
      <div className="relative flex flex-col items-center">
        <div className="absolute -inset-10 rounded-full bg-purple-600/35 blur-3xl animate-pulse pointer-events-none" />
        <motion.div
          animate={
            bossRecoil
              ? { x: [0, 25, -15, 10, 0], filter: ['brightness(1)', 'brightness(2.5)', 'brightness(1)'] }
              : isAttacking
              ? { x: [-55, 20, 0], scale: [1, 1.3, 1] }
              : { y: [0, -8, 0] }
          }
          transition={{ repeat: isAttacking || bossRecoil ? 0 : Infinity, duration: 2.3, ease: 'easeInOut' }}
          className="relative"
        >
          <svg width={isPhase2 ? 160 : 144} height={isPhase2 ? 160 : 144} viewBox="0 0 36 36" className="pixel-art drop-shadow-2xl">
            {/* Transcendent Butterfly Wings in Phase 2 */}
            {isPhase2 && (
              <g className="animate-pulse">
                <polygon points="10,14 0,0 2,24" fill="#a855f7" opacity="0.7" />
                <polygon points="26,14 36,0 34,24" fill="#a855f7" opacity="0.7" />
                <circle cx="1" cy="4" r="2" fill="#c084fc" />
                <circle cx="35" cy="4" r="2" fill="#c084fc" />
              </g>
            )}

            {/* Slicked Brown / Purple Hair */}
            <polygon points="18,1 11,7 25,7" fill="#581c87" />
            <rect x="12" y="4" width="12" height="5" fill="#6b21a8" />

            {/* Divine Face & Violet Eyes */}
            <rect x="13" y="7" width="10" height="7" fill="#fed7aa" rx="1" />
            <rect x="14.5" y="9" width="2" height="1.5" fill="#a855f7" />
            <rect x="19.5" y="9" width="2" height="1.5" fill="#a855f7" />

            {/* Chrysalis Transcendent White Robe & Hōgyoku */}
            <rect x="11" y="14" width="14" height="12" fill="#f8fafc" rx="2" />
            <circle cx="18" cy="18" r="2.5" fill="#a855f7" className="animate-pulse" />
            <circle cx="18" cy="18" r="1" fill="#ffffff" />

            {/* Kurohitsugi Dark Gravity Cube */}
            <rect x="27" y="10" width="3" height="20" fill="#020617" stroke="#a855f7" strokeWidth="0.8" />

            <rect x="13" y="26" width="4" height="8" fill="#090d16" />
            <rect x="19" y="26" width="4" height="8" fill="#090d16" />
          </svg>
        </motion.div>
      </div>
    );
  }

  // GENRYUSAI YAMAMOTO (PHYSICS SUN TITAN BOSS)
  if (bossId === 'yamamoto_boss') {
    return (
      <div className="relative flex flex-col items-center">
        <div className="absolute -inset-10 rounded-full bg-orange-600/40 blur-3xl animate-pulse pointer-events-none" />
        <motion.div
          animate={
            bossRecoil
              ? { x: [0, 25, -15, 10, 0], filter: ['brightness(1)', 'brightness(2.5)', 'brightness(1)'] }
              : isAttacking
              ? { x: [-55, 20, 0], scale: [1, 1.3, 1] }
              : { y: [0, -8, 0] }
          }
          transition={{ repeat: isAttacking || bossRecoil ? 0 : Infinity, duration: 2, ease: 'easeInOut' }}
          className="relative"
        >
          <svg width={isPhase2 ? 160 : 144} height={isPhase2 ? 160 : 144} viewBox="0 0 36 36" className="pixel-art drop-shadow-2xl">
            {/* 15,000,000 Degree Solar Corona Flares */}
            <polygon points="18,-1 14,5 22,5" fill="#f97316" className="animate-pulse" />
            <polygon points="7,2 4,9 11,7" fill="#ea580c" />
            <polygon points="29,2 32,9 25,7" fill="#ea580c" />

            {/* Bald Scarred Head & Fiery Eyes */}
            <rect x="12" y="5" width="12" height="6" fill="#fed7aa" rx="2" />
            <line x1="14" y1="4" x2="18" y2="8" stroke="#991c1c" strokeWidth="0.8" />
            <line x1="18" y1="4" x2="14" y2="8" stroke="#991c1c" strokeWidth="0.8" />
            <rect x="14" y="8" width="2" height="1.5" fill="#ea580c" />
            <rect x="20" y="8" width="2" height="1.5" fill="#ea580c" />

            {/* Long White Beard */}
            <polygon points="13,11 23,11 18,22" fill="#f8fafc" />

            {/* Scorched Captain Haori */}
            <rect x="11" y="14" width="14" height="12" fill="#020617" rx="2" />
            <line x1="11" y1="21" x2="25" y2="21" stroke="#f59e0b" strokeWidth="1" />

            {/* Zanka no Tachi Charred Blade with Solar Embers */}
            <rect x="27" y="2" width="2.5" height="28" fill="#020617" />
            <line x1="27" y1="2" x2="27" y2="30" stroke="#f97316" strokeWidth="1.2" />
            <circle cx="28" cy="8" r="2" fill="#f59e0b" className="animate-ping" />

            <rect x="13" y="26" width="4" height="8" fill="#020617" />
            <rect x="19" y="26" width="4" height="8" fill="#020617" />
          </svg>
        </motion.div>
      </div>
    );
  }

  // WORLD 1: GRIMMJOW JAEGERJAQUEZ (PANTERA)
  if (bossId === 'grimmjow' || tier === 'easy') {
    return (
      <div className="relative flex flex-col items-center">
        {isPhase2 && (
          <div className="absolute -inset-8 rounded-full bg-cyan-500/30 blur-2xl animate-pulse pointer-events-none" />
        )}
        <motion.div
          animate={
            bossRecoil
              ? { x: [0, 25, -15, 10, 0], filter: ['brightness(1)', 'brightness(2.5)', 'brightness(1)'] }
              : isAttacking
              ? { x: [-45, 20, 0], scale: [1, 1.2, 1] }
              : { y: [0, -6, 0] }
          }
          transition={{ repeat: isAttacking || bossRecoil ? 0 : Infinity, duration: 2, ease: 'easeInOut' }}
          className="relative"
        >
          <svg width={isPhase2 ? 146 : 132} height={isPhase2 ? 146 : 132} viewBox="0 0 34 34" className="pixel-art drop-shadow-2xl">
            {/* Spiky Blue Hair (Longer mane in Phase 2) */}
            <polygon points="17,1 11,8 23,8" fill="#06b6d4" />
            <polygon points="7,3 4,10 12,9" fill="#0891b2" />
            <polygon points="27,3 30,10 22,9" fill="#0891b2" />
            {isPhase2 && (
              /* Flowing Panther Mane */
              <g>
                <polygon points="5,7 2,16 9,12" fill="#0891b2" />
                <polygon points="29,7 32,16 25,12" fill="#0891b2" />
                {/* Feline Panther Ears */}
                <polygon points="10,2 7,6 12,5" fill="#f8fafc" />
                <polygon points="24,2 27,6 22,5" fill="#f8fafc" />
              </g>
            )}

            {/* Face & Jawbone Mask */}
            <rect x="11" y="8" width="12" height="7" fill="#fed7aa" rx="1" />
            <rect x="13" y="10" width="2" height="1.5" fill="#059669" />
            <rect x="19" y="10" width="2" height="1.5" fill="#059669" />
            {/* Jawbone Mask on Right Cheek */}
            <polygon points="20,11 23,11 22,15 19,14" fill="#f8fafc" />

            {/* Muscular Chest with Hollow Hole */}
            <rect x="10" y="15" width="14" height="10" fill="#f8fafc" rx="1" />
            <rect x="12" y="15" width="10" height="9" fill="#fed7aa" />
            {/* Hollow Hole in Abdomen */}
            <circle cx="17" cy="20" r="2.5" fill="#020617" />

            {/* Phase 1 Katana vs Phase 2 Desgarrón Emerald Claws */}
            {!isPhase2 ? (
              <g>
                <rect x="25" y="10" width="2" height="18" fill="#e2e8f0" />
                <circle cx="26" cy="18" r="2" fill="#0284c7" />
              </g>
            ) : (
              /* Giant Desgarrón Emerald Claws */
              <g className="animate-pulse">
                <line x1="27" y1="8" x2="33" y2="28" stroke="#10b981" strokeWidth="2.5" />
                <line x1="24" y1="12" x2="30" y2="30" stroke="#34d399" strokeWidth="2" />
                <line x1="7" y1="8" x2="1" y2="28" stroke="#10b981" strokeWidth="2.5" />
                <line x1="10" y1="12" x2="4" y2="30" stroke="#34d399" strokeWidth="2" />
              </g>
            )}

            {/* Legs & Hakama */}
            <rect x="11" y="24" width="4.5" height="8" fill="#f8fafc" />
            <rect x="18.5" y="24" width="4.5" height="8" fill="#f8fafc" />
          </svg>
        </motion.div>
      </div>
    );
  }

  // WORLD 2: ULQUIORRA CIFER (SEGUNDA ETAPA)
  if (tier === 'intermediate') {
    return (
      <div className="relative flex flex-col items-center">
        {isPhase2 && (
          <div className="absolute -inset-10 rounded-full bg-emerald-600/30 blur-2xl animate-pulse pointer-events-none" />
        )}
        <motion.div
          animate={
            bossRecoil
              ? { x: [0, 25, -15, 10, 0], filter: ['brightness(1)', 'brightness(2.5)', 'brightness(1)'] }
              : isAttacking
              ? { x: [-50, 20, 0], scale: [1, 1.25, 1] }
              : { y: [0, -8, 0], rotate: [-1, 1, -1] }
          }
          transition={{ repeat: isAttacking || bossRecoil ? 0 : Infinity, duration: 2.3, ease: 'easeInOut' }}
          className="relative"
        >
          <svg width={isPhase2 ? 156 : 138} height={isPhase2 ? 156 : 138} viewBox="0 0 36 36" className="pixel-art drop-shadow-2xl">
            {/* Phase 2: Massive Black Bat Wings */}
            {isPhase2 && (
              <g className="animate-pulse">
                <polygon points="10,14 0,2 4,26" fill="#020617" />
                <polygon points="26,14 36,2 32,26" fill="#020617" />
                <polygon points="8,16 2,8 6,22" fill="#1e293b" opacity="0.6" />
                <polygon points="28,16 34,8 30,22" fill="#1e293b" opacity="0.6" />
                {/* Long curved bat horns */}
                <polygon points="11,6 7,0 13,3" fill="#020617" />
                <polygon points="25,6 29,0 23,3" fill="#020617" />
              </g>
            )}

            {/* Black Hair & Helmet Mask (in P1) */}
            <rect x="12" y="5" width="12" height="6" fill="#090d16" rx="1" />
            {!isPhase2 && (
              <polygon points="11,4 8,0 13,2" fill="#f8fafc" />
            )}

            {/* Pale Face & Green Teardrops */}
            <rect x="13" y="8" width="10" height="7" fill="#f8fafc" rx="1" />
            <rect x="14.5" y="10" width="2" height="1.5" fill="#059669" />
            <rect x="19.5" y="10" width="2" height="1.5" fill="#059669" />
            {/* Green Teardrop lines running down cheeks */}
            <line x1="15.5" y1="11" x2="15.5" y2="15" stroke="#10b981" strokeWidth="1" />
            <line x1="20.5" y1="11" x2="20.5" y2="15" stroke="#10b981" strokeWidth="1" />

            {/* Robe / Body with Hollow Hole dripping despair */}
            <rect x="11" y="15" width="14" height="11" fill={isPhase2 ? '#020617' : '#f8fafc'} rx="2" />
            <circle cx="18" cy="18" r="2.5" fill="#020617" stroke="#10b981" strokeWidth="0.8" />

            {/* Weapon: P1 Katana vs P2 Lanza del Relámpago */}
            {!isPhase2 ? (
              <rect x="27" y="10" width="2" height="20" fill="#059669" />
            ) : (
              /* Crackling Lanza del Relámpago (Green Lightning Spear) */
              <g className="animate-pulse">
                <line x1="28" y1="0" x2="28" y2="34" stroke="#4ade80" strokeWidth="2.5" />
                <line x1="28" y1="0" x2="28" y2="34" stroke="#ffffff" strokeWidth="1" />
                <polygon points="28,-3 32,4 24,4" fill="#22c55e" />
                <circle cx="28" cy="15" r="4" fill="#86efac" opacity="0.6" className="animate-ping" />
              </g>
            )}

            <rect x="13" y="26" width="4" height="8" fill={isPhase2 ? '#020617' : '#0f172a'} />
            <rect x="19" y="26" width="4" height="8" fill={isPhase2 ? '#020617' : '#0f172a'} />
          </svg>
        </motion.div>
      </div>
    );
  }

  // WORLD 3: YHWACH (THE ALMIGHTY)
  return (
    <div className="relative flex flex-col items-center">
      <div className="absolute -inset-12 rounded-full bg-cyan-500/25 blur-3xl animate-pulse pointer-events-none" />
      <motion.div
        animate={
          bossRecoil
            ? { x: [0, 25, -15, 10, 0], filter: ['brightness(1)', 'brightness(2.5)', 'brightness(1)'] }
            : isAttacking
            ? { x: [-55, 20, 0], scale: [1, 1.3, 1] }
            : { y: [0, -10, 0] }
        }
        transition={{ repeat: isAttacking || bossRecoil ? 0 : Infinity, duration: 2.6, ease: 'easeInOut' }}
        className="relative"
      >
        <svg width={isPhase2 ? 164 : 148} height={isPhase2 ? 164 : 148} viewBox="0 0 36 36" className="pixel-art drop-shadow-2xl">
          {/* Wild Black Hair */}
          <polygon points="18,1 12,8 24,8" fill="#090d16" />
          <polygon points="8,4 5,12 12,10" fill="#020617" />
          <polygon points="28,4 31,12 24,10" fill="#020617" />

          {/* Face with Thick Mustache */}
          <rect x="12" y="8" width="12" height="8" fill="#fed7aa" rx="1" />
          <rect x="14" y="10" width="2" height="1.5" fill="#ef4444" />
          <rect x="20" y="10" width="2" height="1.5" fill="#ef4444" />
          {/* Thick Black Mustache */}
          <rect x="13" y="13" width="10" height="2.5" fill="#020617" />

          {/* Black Trenchcoat & Reishi Broadsword */}
          <rect x="10" y="16" width="16" height="12" fill="#020617" rx="2" />
          <rect x="12" y="16" width="12" height="12" fill="#090d16" />

          {/* PHASE 2: THE ALMIGHTY'S OPEN WEEPING EYES */}
          {isPhase2 ? (
            <g className="animate-pulse">
              <circle cx="14" cy="18" r="1.5" fill="#ef4444" />
              <circle cx="14" cy="18" r="0.6" fill="#ffffff" />
              <circle cx="22" cy="18" r="1.5" fill="#ef4444" />
              <circle cx="22" cy="18" r="0.6" fill="#ffffff" />
              <circle cx="18" cy="22" r="1.5" fill="#ef4444" />
              <circle cx="18" cy="22" r="0.6" fill="#ffffff" />
              <circle cx="13" cy="25" r="1.5" fill="#ef4444" />
              <circle cx="23" cy="25" r="1.5" fill="#ef4444" />
            </g>
          ) : (
            /* Silver Quincy Cross Pin */
            <circle cx="18" cy="19" r="2" fill="#38bdf8" />
          )}

          {/* Heavy Reishi Broadsword */}
          <polygon points="28,2 32,28 27,28" fill="#38bdf8" />
          <rect x="28" y="2" width="2" height="26" fill="#ffffff" opacity="0.8" />

          {/* Boots */}
          <rect x="12" y="28" width="4.5" height="7" fill="#020617" />
          <rect x="19.5" y="28" width="4.5" height="7" fill="#020617" />
        </svg>
      </motion.div>
    </div>
  );
}

// -------------------------------------------------------------
// TOP UNIFIED NAVIGATION HEADER
// -------------------------------------------------------------
function UnifiedHeader({
  mainTab,
  setMainTab,
  geo,
  currentUser = null,
  onOpenLogin = () => {},
  onLogout = () => {},
  activeTestStage = null,
  onExitTest = () => {}
}: {
  mainTab: 'courses' | 'worldmap' | 'dashboard' | 'characters' | 'diagnostic';
  setMainTab: (tab: 'courses' | 'worldmap' | 'dashboard' | 'characters' | 'diagnostic') => void;
  geo: number;
  currentUser?: UserProfile | null;
  onOpenLogin?: () => void;
  onLogout?: () => void;
  activeTestStage?: WorldStageNode | null;
  onExitTest?: () => void;
}) {
  const isCoursesActive = mainTab === 'courses' || mainTab === 'worldmap' || mainTab === 'diagnostic';

  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-4 py-2.5 flex items-center justify-between font-mono select-none">
      <div className="flex items-center space-x-2.5">
        <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-black text-slate-950 text-xs shadow-md">
          QL
        </span>
        <div className="flex items-center space-x-2">
          <span className="font-black text-white text-xs sm:text-sm tracking-wider uppercase">
            QuestLearn × AdaptiveAI
          </span>
          <span className="hidden lg:inline-block px-2 py-0.5 rounded text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            BKT ACTIVE
          </span>
        </div>
      </div>

      <nav className="flex items-center space-x-1.5 sm:space-x-2 text-xs overflow-x-auto py-1">
        <button
          onClick={() => setMainTab('courses')}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 cursor-pointer text-xs shrink-0 ${
            isCoursesActive
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Courses</span>
          {mainTab === 'worldmap' && (
            <span className="hidden sm:inline-block text-[10px] bg-emerald-950 text-emerald-200 px-1.5 py-0.2 rounded border border-emerald-400/40">
              Roadmap
            </span>
          )}
        </button>

        <button
          onClick={() => setMainTab('characters')}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 cursor-pointer text-xs shrink-0 ${
            mainTab === 'characters'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Characters</span>
        </button>

        <button
          onClick={() => setMainTab('dashboard')}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 cursor-pointer text-xs shrink-0 ${
            mainTab === 'dashboard'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>

        {activeTestStage && (
          <div className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-black flex items-center space-x-1.5 animate-pulse shrink-0">
            <Swords className="w-3.5 h-3.5 text-rose-400" />
            <span>STAGE {activeTestStage.stageNumber} TEST ACTIVE</span>
            <button
              onClick={onExitTest}
              className="ml-1 hover:text-white text-rose-400 font-black cursor-pointer"
              title="Exit Test"
            >
              ✕
            </button>
          </div>
        )}
      </nav>

      <div className="flex items-center space-x-2 shrink-0">
        <div className="hidden sm:flex items-center space-x-1.5 text-xs font-bold text-amber-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-amber-500/30">
          <Coins className="w-3.5 h-3.5" />
          <span>{geo} Geo</span>
        </div>

        {currentUser ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenLogin}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-indigo-500/40 rounded-lg text-xs font-bold text-indigo-300 flex items-center space-x-1 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span className="truncate max-w-[90px]">{currentUser.username}</span>
            </button>
            <button
              onClick={onLogout}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg text-xs font-bold cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black rounded-lg transition flex items-center space-x-1.5 shadow cursor-pointer uppercase"
          >
            <User className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
        )}
      </div>
    </header>
  );
}

// -------------------------------------------------------------
// MAIN GAME ARENA
// -------------------------------------------------------------
export default function GameArena() {
  const [mounted, setMounted] = useState(false);
  const [mainTab, setMainTab] = useState<'courses' | 'worldmap' | 'dashboard' | 'characters' | 'diagnostic'>('courses');
  const [gameState, setGameState] = useState<'title' | 'arena' | 'gameover' | 'finisher' | 'shop'>('title');

  // Auth Modal & User State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCombatLectureOpen, setIsCombatLectureOpen] = useState(false);

  // Selected Course for Diagnostic & World Map
  const [selectedCourse, setSelectedCourse] = useState<CourseData>(ACADEMIC_COURSES[0]);

  // Unlocked Courses and Active Stage Test
  const [unlockedCourses, setUnlockedCourses] = useState<Record<string, {
    diagnosticCompleted: boolean;
    mastery: number;
    stages: WorldStageNode[];
    diagnosedGaps?: string[];
    aiModelUsed?: string;
    aiRoadmapMeta?: {
      difficulty?: string;
      estimatedStudyHours?: number;
      weakTopics?: string[];
      strongTopics?: string[];
    } | null;
  }>>({});
  const [activeTestStage, setActiveTestStage] = useState<WorldStageNode | null>(null);

  const [tier, setTier] = useState<'easy' | 'intermediate' | 'hard'>('easy');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [playerHearts, setPlayerHearts] = useState(5);
  const [bossHp, setBossHp] = useState(100);
  const [streak, setStreak] = useState(0);
  const [scoreEssence, setScoreEssence] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Geo Economy & Bleach Roster
  const [geo, setGeo] = useState<number>(150);
  const [unlockedHeroIds, setUnlockedHeroIds] = useState<BleachHeroId[]>(['ichigo']);
  const [selectedHeroId, setSelectedHeroId] = useState<BleachHeroId>('ichigo');
  const [previewHeroId, setPreviewHeroId] = useState<BleachHeroId>('ichigo');
  const [armoryAnimState, setArmoryAnimState] = useState<string>('idle');

  // Boss Phase 2 & Lore Modal
  const [bossPhase, setBossPhase] = useState<1 | 2>(1);
  const [phaseTransitionActive, setPhaseTransitionActive] = useState<boolean>(false);
  const [showRemembranceModal, setShowRemembranceModal] = useState<boolean>(false);
  const [inspectedRemembrance, setInspectedRemembrance] = useState<BleachHeroConfig | BleachVillainConfig | null>(null);

  // Flawless Tracker
  const [hadErrorsInTrial, setHadErrorsInTrial] = useState(false);
  const [isFlawlessVictory, setIsFlawlessVictory] = useState(false);

  // Combat Animation States
  const [heroAnimState, setHeroAnimState] = useState<string>('idle');
  const [bossRecoil, setBossRecoil] = useState(false);
  const [bossAttacking, setBossAttacking] = useState(false);
  const [playerHurt, setPlayerHurt] = useState(false);
  const [screenShake, setScreenShake] = useState<'none' | 'light' | 'heavy'>('none');
  const [damagePopup, setDamagePopup] = useState<{ amount: number; text: string; isCrit?: boolean; isPlayerDamage?: boolean } | null>(null);
  const [stanceMessage, setStanceMessage] = useState<string | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([
    '▶ Welcome to the Seireitei Gauntlet. Draw your Zanpakuto!',
    '▶ Visit the Armory to unlock Bleach champions with your Geo.'
  ]);

  // Prevent hydration mismatch (especially with Dark Reader extension)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load from LocalStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedGeo = localStorage.getItem('questlearn_bleach_geo');
      if (savedGeo !== null) {
        setGeo(parseInt(savedGeo, 10) || 0);
      } else {
        localStorage.setItem('questlearn_bleach_geo', '150');
      }

      const savedHeroes = localStorage.getItem('questlearn_bleach_unlocked');
      if (savedHeroes) {
        const parsed = JSON.parse(savedHeroes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUnlockedHeroIds(parsed);
        }
      }

      const savedSelected = localStorage.getItem('questlearn_bleach_selected') as BleachHeroId;
      if (savedSelected && BLEACH_ROSTER[savedSelected]) {
        setSelectedHeroId(savedSelected);
        setPreviewHeroId(savedSelected);
      }
    } catch {
      // Fallback
    }
  }, []);

  const activeHero = BLEACH_ROSTER[selectedHeroId] || BLEACH_ROSTER.ichigo;
  const inspectedHero = BLEACH_ROSTER[previewHeroId] || activeHero;
  const [currentBoss, setCurrentBoss] = useState<BleachVillainConfig>(BLEACH_BOSS_CATALOG.grimmjow);
  const boss = currentBoss;
  const stageQuestions = (activeTestStage && selectedCourse)
    ? getStageQuestions(selectedCourse.id, activeTestStage.stageNumber)
    : null;
  const currentQuestions = (stageQuestions && stageQuestions.length > 0)
    ? stageQuestions
    : questionsData[tier];
  const currentQuestion = currentQuestions[questionIndex % currentQuestions.length];

  // Audio Synth Engine
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playSound = useCallback((type: 'slash' | 'arcane' | 'crimson' | 'cosmic' | 'hit' | 'hurt' | 'geo' | 'supernova' | 'gameover' | 'equip' | 'unlock' | 'phase2') => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'slash') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.09);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'phase2') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.linearRampToValueAtTime(320, now + 0.4);
        osc.frequency.exponentialRampToValueAtTime(60, now + 1.2);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.2);
      } else if (type === 'geo' || type === 'equip') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.setValueAtTime(1850, now + 0.06);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'unlock') {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.2, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.25);
        });
      } else if (type === 'arcane') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'crimson') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'cosmic' || type === 'supernova') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.5);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
      } else if (type === 'hit') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'hurt' || type === 'gameover') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.4);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch {
      // Audio fallback
    }
  }, [soundEnabled, getAudioContext]);

  // Stance calculation
  const effectiveStreak = selectedHeroId === 'aizen' ? streak * 2 : streak;
  const currentStance: 'apprentice' | 'arcane' | 'phantom' | 'sovereign' =
    effectiveStreak >= 4 ? 'sovereign' : effectiveStreak >= 3 ? 'phantom' : effectiveStreak >= 2 ? 'arcane' : 'apprentice';

  const stanceInfo = BLEACH_STANCES[currentStance];

  const addLog = (msg: string) => {
    setBattleLog((prev) => [msg, ...prev.slice(0, 3)]);
  };

  const addGeo = (amount: number) => {
    setGeo((prev) => {
      const next = prev + amount;
      try {
        localStorage.setItem('questlearn_bleach_geo', String(next));
      } catch {}
      return next;
    });
  };

  const handleHeroAction = (hero: BleachHeroConfig) => {
    const isUnlocked = unlockedHeroIds.includes(hero.id);
    if (isUnlocked) {
      setSelectedHeroId(hero.id);
      playSound('equip');
      try {
        localStorage.setItem('questlearn_bleach_selected', hero.id);
      } catch {}
      addLog(`▶ Equipped ${hero.name}!`);
    } else {
      if (geo >= hero.geoCost) {
        const newGeo = geo - hero.geoCost;
        setGeo(newGeo);
        const newUnlocked = [...unlockedHeroIds, hero.id];
        setUnlockedHeroIds(newUnlocked);
        setSelectedHeroId(hero.id);
        playSound('unlock');
        confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
        try {
          localStorage.setItem('questlearn_bleach_geo', String(newGeo));
          localStorage.setItem('questlearn_bleach_unlocked', JSON.stringify(newUnlocked));
          localStorage.setItem('questlearn_bleach_selected', hero.id);
        } catch {}
        addLog(`▶ Unlocked and equipped ${hero.name}!`);
      } else {
        playSound('hurt');
      }
    }
  };

  // Diagnostic completion: unlock course, request AI generated roadmap, build personalized stages, navigate to worldmap
  const handleFinishDiagnostic = async (results: { 
    courseId: string; 
    overallMastery: number; 
    diagnosedGaps: string[];
    scores?: Record<string, number>;
  }) => {
    const foundCourse = ACADEMIC_COURSES.find(c => c.id === results.courseId) || selectedCourse;
    if (foundCourse) setSelectedCourse(foundCourse);

    let personalizedStages = buildPersonalizedStages(results.courseId, results.overallMastery, results.diagnosedGaps);
    let aiModelUsed = 'QuestLearn AI';
    let aiRoadmapMeta: {
      difficulty?: string;
      estimatedStudyHours?: number;
      weakTopics?: string[];
      strongTopics?: string[];
    } | null = null;

    try {
      const scoresPayload = results.scores && Object.keys(results.scores).length > 0
        ? results.scores
        : {
            'Foundational Vectors & Displacement': Math.round(results.overallMastery * 100),
            'Newtonian Dynamics & Inertia': Math.max(20, Math.round(results.overallMastery * 90)),
            'Work-Energy Theorem & Conservation': Math.max(15, Math.round(results.overallMastery * 80)),
            'Momentum & High-Speed Impacts': Math.max(10, Math.round(results.overallMastery * 70))
          };

      const res = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course: foundCourse.title,
          scores: scoresPayload
        })
      });

      if (res.ok) {
        const data = await res.json();
        aiModelUsed = res.headers.get('X-Model-Used') || 'Google Gemini AI';
        aiRoadmapMeta = {
          difficulty: data.difficulty,
          estimatedStudyHours: data.estimatedStudyHours,
          weakTopics: data.weakTopics,
          strongTopics: data.strongTopics
        };

        if (Array.isArray(data.weakTopics) && data.weakTopics.length > 0) {
          personalizedStages = personalizedStages.map((stage, idx) => {
            const matchesWeakness = data.weakTopics.some((weak: string) =>
              stage.conceptFocus.toLowerCase().includes(weak.toLowerCase()) ||
              stage.name.toLowerCase().includes(weak.toLowerCase())
            );
            return {
              ...stage,
              status: (matchesWeakness || idx === 0) ? 'remediation_priority' : stage.status
            };
          });
        }
      }
    } catch (err) {
      console.warn('[QuestLearn AI] Roadmap fetch fallback engaged:', err);
    }

    setUnlockedCourses(prev => ({
      ...prev,
      [results.courseId]: {
        diagnosticCompleted: true,
        mastery: results.overallMastery,
        stages: personalizedStages,
        diagnosedGaps: results.diagnosedGaps,
        aiModelUsed,
        aiRoadmapMeta
      }
    }));

    setActiveTestStage(null);
    setGameState('title');
    setMainTab('worldmap');
    playSound('cosmic');
  };

  // Launch Stage Test (Starts Combat Arena for this specific stage)
  const handleLaunchStageTest = (stage: WorldStageNode) => {
    const stageBoss = getStageBoss(selectedCourse?.id, stage.stageNumber, stage.bossId);
    setActiveTestStage(stage);
    setTier(stage.tier);
    setCurrentBoss(stageBoss);
    setBossHp(stageBoss.maxHp);
    setBossPhase(1);
    setPlayerHearts(activeHero.baseHearts);
    setStreak(0);
    setHadErrorsInTrial(false);
    setQuestionIndex(0);
    setGameState('arena');
    addLog(`▶ Began Stage ${stage.stageNumber} Test: ${stage.name}! Boss: ${stageBoss.name} (${stageBoss.difficultyLabel} Tier)!`);
  };

  // Clear Active Stage Test on Boss Defeat
  const handleClearActiveStageTest = () => {
    if (!activeTestStage || !selectedCourse) return;
    const courseId = selectedCourse.id;
    const currentStages = unlockedCourses[courseId]?.stages || DEFAULT_MAP_STAGES;
    const starsEarned = playerHearts >= 4 ? 3 : playerHearts >= 2 ? 2 : 1;

    const updatedStages = currentStages.map((st) => {
      if (st.id === activeTestStage.id) {
        return { 
          ...st, 
          status: 'completed' as const, 
          stars: Math.max(st.stars, starsEarned), 
          masteryPct: Math.min(100, Math.max(st.masteryPct, 85)) 
        };
      }
      if (st.stageNumber === activeTestStage.stageNumber + 1 && st.status === 'locked') {
        return { ...st, status: 'unlocked' as const };
      }
      return st;
    });

    setUnlockedCourses(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        stages: updatedStages
      }
    }));
  };

  // Exit Test to World Map
  const handleExitTest = () => {
    setActiveTestStage(null);
    setGameState('title');
    setMainTab('worldmap');
  };

  const startTrial = (selectedTier: 'easy' | 'intermediate' | 'hard') => {
    const trialBoss = BLEACH_VILLAINS[selectedTier];
    setTier(selectedTier);
    setCurrentBoss(trialBoss);
    setBossHp(trialBoss.maxHp);
    setBossPhase(1);
    setPlayerHearts(activeHero.baseHearts);
    setStreak(0);
    setHadErrorsInTrial(false);
    setQuestionIndex(0);
    setGameState('arena');
    addLog(`▶ ${activeHero.name} entered ${trialBoss.realm}! Challenge ${trialBoss.name}!`);
  };

  // Handle Answers
  const handleAnswer = (selectedIndex: number) => {
    if (bossHp <= 0 || gameState !== 'arena' || heroAnimState !== 'idle' || bossAttacking || phaseTransitionActive) return;

    const isCorrect = selectedIndex === currentQuestion.answer;

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);

      const earnedGeo = Math.round((currentQuestion.rewardGeo || 25) * activeHero.bonusGeoMultiplier);
      addGeo(earnedGeo);
      setScoreEssence((prev) => prev + (currentQuestion.rewardXp || 50));
      playSound('geo');

      if (activeHero.id === 'byakuya' && newStreak % 2 === 0) {
        setPlayerHearts((prev) => Math.min(activeHero.baseHearts, prev + 1));
        triggerStanceNotification('🌸 PETAL BARRIER: +1 Heart restored by Senbonzakura!');
      }

      if (activeHero.id === 'ulquiorra_hero' && newStreak % 2 === 0) {
        setPlayerHearts((prev) => Math.min(activeHero.baseHearts, prev + 1));
        triggerStanceNotification('💚 CELLULAR REGEN: +1 Heart restored by Murciélago!');
      }

      if (activeHero.id === 'toshiro' && newStreak % 3 === 0) {
        triggerStanceNotification('❄️ HYŌRINMARU FREEZE: Stunned boss in permafrost!');
        addLog(`▶ Hitsugaya froze ${boss.name} with ice petals!`);
      }

      if (activeHero.id === 'yamamoto') {
        setTimeout(() => {
          applyBossDamage(20, '☀️ ZANKA NO TACHI: 20 Solar Burn!', false);
        }, 350);
      }

      if (newStreak === 2) {
        triggerStanceNotification(`🔮 SHIKAI: ${activeHero.releaseCommand}`);
        playSound('arcane');
      } else if (newStreak === 3) {
        triggerStanceNotification('⚡ FLASH STEP: Hohō Supersonic strike!');
        playSound('crimson');
      } else if (newStreak === 4) {
        triggerStanceNotification(`🌌 BANKAI: ${activeHero.bankaiName.toUpperCase()}`);
        playSound('cosmic');
      }

      // Calibrate base damage so answering all stage questions vanquishes the boss
      const stageBaseDmg = activeTestStage ? Math.ceil(boss.maxHp / Math.max(1, currentQuestions.length)) : 0;
      const totalDmg = Math.max(stageBaseDmg, stanceInfo.baseDamage + activeHero.damageBonus);

      if (newStreak >= 4 || (activeHero.id === 'aizen' && newStreak >= 2)) {
        setHeroAnimState('ash_of_war');
        playSound('cosmic');
        setTimeout(() => {
          applyBossDamage(totalDmg + 35, `${activeHero.technique.toUpperCase()}!`, true);
        }, 500);
      } else if (newStreak >= 3) {
        setHeroAnimState('slash_strike');
        playSound('crimson');
        setTimeout(() => {
          applyBossDamage(totalDmg + 20, `${activeHero.passiveName.toUpperCase()}!`, false);
        }, 450);
      } else if (newStreak >= 2) {
        setHeroAnimState('slash_strike');
        playSound('arcane');
        setTimeout(() => {
          applyBossDamage(totalDmg, `⚔️ ${activeHero.zanpakuto.toUpperCase()} SHIKAI!`, false);
        }, 400);
      } else {
        setHeroAnimState('slash_strike');
        playSound('slash');
        setTimeout(() => {
          applyBossDamage(totalDmg, `⚔️ ${activeHero.zanpakuto.toUpperCase()} STRIKE`, false);
        }, 300);
      }
    } else {
      // Wrong Answer — Character Endurance & Damage Mitigation Mechanics
      let heartDamage = boss.damagePerStrike || 1;
      if (bossPhase === 2 && (boss.difficultyLabel === 'Advanced' || boss.difficultyLabel === 'Supreme Boss')) {
        heartDamage = Math.min(3, heartDamage + 1);
      }

      // 1. Yoruichi Shihoin: 40% complete evasion on mistakes!
      if (activeHero.id === 'yoruichi' && Math.random() < 0.40) {
        playSound('crimson');
        triggerStanceNotification('⚡ FLASH MIRAGE: Yoruichi dodged with Hohō!');
        addLog(`▶ Yoruichi completely evaded ${boss.name}'s attack!`);
        return;
      }

      // 2. Yamamoto: 8 Hearts titan & scratch immunity on 1-heart strikes!
      if (activeHero.id === 'yamamoto') {
        if (heartDamage === 1 && Math.random() < 0.75) {
          playSound('cosmic');
          triggerStanceNotification('☀️ ZANKA NO TACHI: 15,000,000°C Cloak vaporized the scratch strike!');
          addLog(`▶ Yamamoto's solar cloak disintegrated ${boss.name}'s strike!`);
          return;
        } else if (heartDamage > 1) {
          heartDamage = 1;
          triggerStanceNotification('☀️ SOLAR ENDURANCE: Yamamoto absorbed the cataclysmic blow!');
        }
      }

      // 3. Shunsui Kyoraku: 35% shadow slip dodge
      if (activeHero.id === 'shunsui' && Math.random() < 0.35) {
        playSound('arcane');
        triggerStanceNotification('🌑 KAGEONI: Shunsui slipped into the shadow floor!');
        addLog(`▶ Shunsui vanished into shadows, avoiding ${boss.name}'s blow!`);
        return;
      }

      // 4. Renji Abarai: Hihi-o heavy armor mitigates multi-heart strikes to 1
      if (activeHero.id === 'renji' && heartDamage > 1) {
        heartDamage = 1;
        triggerStanceNotification('🛡️ HIHI-Ō ARMOR: Zabimaru iron bone absorbed the heavy blow!');
        addLog(`▶ Renji's heavy armor reduced ${boss.name}'s damage to 1 Heart!`);
      }

      // 5. Ulquiorra: Death defiance (cannot be killed from above 1 heart in a single strike)
      if (activeHero.id === 'ulquiorra_hero' && playerHearts > 1 && playerHearts - heartDamage <= 0) {
        heartDamage = playerHearts - 1;
        triggerStanceNotification('🦇 NIHILISTIC BARRIER: Emptiness defied fatal death!');
      }

      // 6. Kisuke Urahara: 35% chance to completely deflect attack
      if (activeHero.id === 'urahara' && Math.random() < 0.35) {
        playSound('arcane');
        triggerStanceNotification('🩸 BENIHIME: Chikasumi no Tate deflected the blow!');
        addLog(`▶ Urahara deflected ${boss.name}'s attack with Blood Mist Shield!`);
        return;
      }

      // 7. Sosuke Aizen: 25% chance Kyoka Suigetsu illusion makes boss attack miss
      if (activeHero.id === 'aizen' && Math.random() < 0.25) {
        playSound('cosmic');
        triggerStanceNotification('🌌 KYOKA SUIGETSU: The strike hit an illusion mirror!');
        addLog(`▶ Aizen shattered reality; ${boss.name}'s strike hit a mirror clone!`);
        return;
      }

      // 8. Rukia Kuchiki: Hakuren Frost Armor cuts boss attack damage by 50% (reduces 2 hearts to 1)
      if (activeHero.id === 'rukia' && heartDamage > 1) {
        heartDamage = 1;
        triggerStanceNotification('❄️ HAKUREN FROST SHIELD: Permafrost absorbed the lethal impact!');
        addLog(`▶ Rukia's absolute zero armor reduced ${boss.name}'s damage to 1 Heart!`);
      }

      // 9. Kenpachi Zaraki: Unstoppable Colossal Resilience (7 base hearts & absorbs multi-heart blow)
      if (activeHero.id === 'kenpachi' && heartDamage > 1) {
        heartDamage = 1;
        triggerStanceNotification('👹 DEMON REIATSU: Kenpachi absorbed the heavy blow with ease!');
        addLog(`▶ Kenpachi shrugged off ${boss.name}'s devastating strike!`);
      }

      setStreak(0);
      setHadErrorsInTrial(true);
      setBossAttacking(true);
      playSound('hurt');

      const currentBossAttack = bossPhase === 2 ? boss.attackNameP2 : boss.attackNameP1;
      addLog(`▶ Wrong! ${boss.name} strikes with ${currentBossAttack}!`);

      setTimeout(() => {
        setPlayerHurt(true);
        setScreenShake('heavy');
        const nextHearts = Math.max(0, playerHearts - heartDamage);
        setPlayerHearts(nextHearts);
        setDamagePopup({
          amount: heartDamage,
          text: heartDamage > 1 ? `⚡ LETHAL ${currentBossAttack.toUpperCase()}` : `⚡ ${currentBossAttack.toUpperCase()}`,
          isPlayerDamage: true
        });

        setTimeout(() => {
          setPlayerHurt(false);
          setBossAttacking(false);
          setScreenShake('none');
          setDamagePopup(null);

          if (nextHearts <= 0) {
            playSound('gameover');
            setGameState('gameover');
            addLog(`▶ Defeat! All hearts shattered by ${boss.name}.`);
          } else {
            // Advance to next question
            setQuestionIndex((prev) => prev + 1);
          }
        }, 600);
      }, 350);
    }
  };

  const triggerStanceNotification = (msg: string) => {
    setStanceMessage(msg);
    setTimeout(() => setStanceMessage(null), 2500);
  };

  // Instantaneous Boss Defeat (No slow timer lag)
  const applyBossDamage = (dmg: number, attackTitle: string, isCrit: boolean) => {
    playSound('hit');
    setBossRecoil(true);
    setScreenShake(isCrit ? 'heavy' : 'light');
    setDamagePopup({
      amount: dmg,
      text: attackTitle,
      isCrit
    });

    const newBossHp = Math.max(0, bossHp - dmg);
    setBossHp(newBossHp);
    addLog(`▶ ${activeHero.name} dealt ${dmg} DMG to ${boss.name}!`);

    // Check Phase 2 Transition (at <= 50% HP)
    if (newBossHp > 0 && newBossHp <= boss.maxHp / 2 && bossPhase === 1) {
      setTimeout(() => {
        setHeroAnimState('idle');
        setBossRecoil(false);
        setDamagePopup(null);
        setScreenShake('none');
        triggerPhase2Cinematic();
      }, 450);
      return;
    }

    // Boss Defeat
    if (newBossHp === 0) {
      setTimeout(() => {
        playSound('cosmic');
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
        
        addGeo(150);
        if (!hadErrorsInTrial) {
          addGeo(200);
          setIsFlawlessVictory(true);
        } else {
          setIsFlawlessVictory(false);
        }

        setHeroAnimState('idle');
        setBossRecoil(false);
        setDamagePopup(null);
        setScreenShake('none');
        handleClearActiveStageTest();
        setGameState('finisher');
      }, 450);
    } else {
      setQuestionIndex((prev) => prev + 1);
      setTimeout(() => {
        setHeroAnimState('idle');
        setBossRecoil(false);
        setDamagePopup(null);
        setScreenShake('none');
      }, 500);
    }
  };

  const triggerPhase2Cinematic = () => {
    setPhaseTransitionActive(true);
    playSound('phase2');
    setScreenShake('heavy');

    setTimeout(() => {
      setBossPhase(2);
      setScreenShake('none');
      setPhaseTransitionActive(false);
      setQuestionIndex((prev) => prev + 1);
      addLog(`▶ ${boss.name} unlocked PHASE 2: ${boss.phase2TransformationName}!`);
    }, 2800);
  };

  const advanceToNextRealm = () => {
    if (tier === 'easy') {
      startTrial('intermediate');
    } else if (tier === 'intermediate') {
      startTrial('hard');
    } else {
      startTrial('easy');
    }
  };

  const triggerArmoryTestAttack = () => {
    setArmoryAnimState('test_attack');
    playSound('slash');
    setTimeout(() => {
      setArmoryAnimState('idle');
    }, 600);
  };

  // -------------------------------------------------------------
  // HYDRATION GUARD
  // -------------------------------------------------------------
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center font-mono select-none">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">
            Calibrating QuestLearn Cognitive Model...
          </span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // COGNITIVE VIEWS: (Rendered when not in an active combat stage test)
  // -------------------------------------------------------------
  if (!activeTestStage && gameState !== 'shop') {
    if (mainTab === 'dashboard') {
      return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-mono">
          <UnifiedHeader 
            mainTab={mainTab} 
            setMainTab={setMainTab} 
            geo={geo} 
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onLogout={() => setCurrentUser(null)}
            activeTestStage={activeTestStage}
            onExitTest={handleExitTest}
          />
          <main className="flex-1 pb-12">
            <DashboardView
              onLaunchBattle={() => setMainTab('courses')}
              onLaunchDiagnostic={() => setMainTab('diagnostic')}
              onNavigateProfile={() => setMainTab('courses')}
              playerStats={{
                level: currentUser?.level || 4,
                totalXp: 1450 + scoreEssence,
                nextLevelXp: 2000,
                streakDays: Math.max(1, streak),
                geoBalance: geo,
                questionsAnswered: 84 + questionIndex,
                accuracyRate: 78
              }}
            />
          </main>
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={(u) => setCurrentUser(u)}
            currentUser={currentUser}
          />
        </div>
      );
    }

    if (mainTab === 'courses') {
      return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-mono">
          <UnifiedHeader 
            mainTab={mainTab} 
            setMainTab={setMainTab} 
            geo={geo} 
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onLogout={() => setCurrentUser(null)}
            activeTestStage={activeTestStage}
            onExitTest={handleExitTest}
          />
          <main className="flex-1 pb-12">
            <CoursesView
              unlockedCourses={unlockedCourses}
              onStartDiagnostic={(cId) => {
                const found = ACADEMIC_COURSES.find(c => c.id === cId);
                if (found) setSelectedCourse(found);
                setMainTab('diagnostic');
              }}
              onOpenWorldMap={(c) => {
                setSelectedCourse(c);
                setMainTab('worldmap');
              }}
            />
          </main>
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={(u) => setCurrentUser(u)}
            currentUser={currentUser}
          />
        </div>
      );
    }

    if (mainTab === 'worldmap') {
      const isCourseUnlocked = Boolean(unlockedCourses[selectedCourse.id]?.diagnosticCompleted);
      const currentCourseStages = unlockedCourses[selectedCourse.id]?.stages || DEFAULT_MAP_STAGES;

      return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-mono">
          <UnifiedHeader 
            mainTab={mainTab} 
            setMainTab={setMainTab} 
            geo={geo} 
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onLogout={() => setCurrentUser(null)}
            activeTestStage={activeTestStage}
            onExitTest={handleExitTest}
          />
          <main className="flex-1 pb-12">
            <WorldMapView
              course={selectedCourse}
              isUnlocked={isCourseUnlocked}
              stages={currentCourseStages}
              diagnosedGaps={unlockedCourses[selectedCourse.id]?.diagnosedGaps || []}
              onLaunchStageTest={(stage) => handleLaunchStageTest(stage)}
              onRetakeDiagnostic={(cId) => {
                const found = ACADEMIC_COURSES.find(c => c.id === cId);
                if (found) setSelectedCourse(found);
                setMainTab('diagnostic');
              }}
              onSwitchCourse={() => setMainTab('courses')}
              onClaimGeo={(amt) => addGeo(amt)}
              onInspectBoss={(bossToInspect) => {
                setInspectedRemembrance(bossToInspect);
                setShowRemembranceModal(true);
              }}
              aiModelUsed={unlockedCourses[selectedCourse.id]?.aiModelUsed}
              aiRoadmapMeta={unlockedCourses[selectedCourse.id]?.aiRoadmapMeta}
            />
          </main>
          <ProfileInspectionModal
            isOpen={showRemembranceModal}
            onClose={() => setShowRemembranceModal(false)}
            target={inspectedRemembrance}
          />
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={(u) => setCurrentUser(u)}
            currentUser={currentUser}
          />
        </div>
      );
    }

    if (mainTab === 'characters') {
      return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-mono">
          <UnifiedHeader 
            mainTab={mainTab} 
            setMainTab={setMainTab} 
            geo={geo} 
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onLogout={() => setCurrentUser(null)}
            activeTestStage={activeTestStage}
            onExitTest={handleExitTest}
          />
          <main className="flex-1 pb-12">
            <CharactersView
              geo={geo}
              unlockedHeroIds={unlockedHeroIds}
              selectedHeroId={selectedHeroId}
              onHeroAction={handleHeroAction}
              onOpenArena={() => {
                startTrial('easy');
              }}
            />
          </main>
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={(u) => setCurrentUser(u)}
            currentUser={currentUser}
          />
        </div>
      );
    }

    if (mainTab === 'diagnostic') {
      return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-mono">
          <UnifiedHeader 
            mainTab={mainTab} 
            setMainTab={setMainTab} 
            geo={geo} 
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onLogout={() => setCurrentUser(null)}
            activeTestStage={activeTestStage}
            onExitTest={handleExitTest}
          />
          <main className="flex-1 pb-12">
            <DiagnosticQuizView
              course={selectedCourse}
              onFinishDiagnostic={handleFinishDiagnostic}
            />
          </main>
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={(u) => setCurrentUser(u)}
            currentUser={currentUser}
          />
        </div>
      );
    }
  }

  // -------------------------------------------------------------
  // VIEW 1: CHARACTER ARMORY VAULT & BLEACH ROSTER
  // -------------------------------------------------------------
  if (gameState === 'shop') {
    const isUnlocked = unlockedHeroIds.includes(inspectedHero.id);
    const isEquipped = selectedHeroId === inspectedHero.id;
    const canAfford = geo >= inspectedHero.geoCost;

    return (
      <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-mono">
        <UnifiedHeader 
          mainTab={mainTab} 
          setMainTab={setMainTab} 
          geo={geo} 
          currentUser={currentUser}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onLogout={() => setCurrentUser(null)}
        />
        <main className="flex-1 flex flex-col items-center justify-center p-3 md:p-6 select-none overflow-hidden relative">
        <div className="absolute inset-0 crt-overlay z-30 pointer-events-none" />
        <BleachArenaBackground bgType="seireitei" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl bg-[#090d16]/95 border-4 border-amber-500/80 rounded-2xl p-4 md:p-6 shadow-[0_0_80px_rgba(245,158,11,0.25)] z-10 relative pixel-art flex flex-col max-h-[92vh] overflow-y-auto"
        >
          {/* Shop Header */}
          <div className="flex flex-wrap justify-between items-center pb-4 mb-4 border-b-2 border-slate-800 gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGameState('title')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <ChevronLeft className="w-4 h-4 text-cyan-400" /> Sanctuary
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-amber-300 tracking-wider uppercase drop-shadow-[0_0_20px_#f59e0b] flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-400" /> SEIREITEI ZANPAKUTO VAULT
                </h1>
                <p className="text-[10px] md:text-xs text-slate-400">Offer your earned Geo to awaken iconic Bleach Captains and Substitute Shinigami.</p>
              </div>
            </div>

            {/* Geo Purse */}
            <div className="bg-slate-950 border-2 border-amber-500/60 rounded-xl px-4 py-2 flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Coins className="w-5 h-5 text-amber-400 animate-bounce" />
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Your Geo Purse</span>
                <span className="text-base font-black text-amber-300 tracking-wider">{geo} GEO</span>
              </div>
            </div>
          </div>

          {/* Main Showcase & Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-4">
            {/* Left: Interactive Live Hero Showcase */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-950 to-[#04060c] border-2 border-slate-800 rounded-xl p-5 flex flex-col items-center justify-between relative overflow-hidden">
              <div className="w-full flex justify-between items-center z-10">
                <span className="text-[10px] bg-slate-900 text-amber-300 px-2.5 py-1 rounded font-black border border-amber-500/40 uppercase">
                  {inspectedHero.tag}
                </span>
                {isEquipped && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500 px-2 py-0.5 rounded font-black flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> ACTIVE
                  </span>
                )}
              </div>

              {/* Centered Large Hero Sprite */}
              <div className="my-6 relative flex flex-col items-center justify-center min-h-[160px]">
                <BleachPixelSprite
                  heroId={inspectedHero.id}
                  animState={armoryAnimState}
                  isHurt={false}
                />
              </div>

              {/* Action Buttons */}
              <div className="w-full flex flex-col gap-2 z-10">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={triggerArmoryTestAttack}
                    disabled={armoryAnimState !== 'idle'}
                    className="py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded-lg text-[10px] flex items-center justify-center gap-1.5 transition active:scale-95"
                  >
                    <Swords className="w-3.5 h-3.5 text-cyan-400" /> Test Attack
                  </button>

                  <button
                    onClick={() => {
                      setInspectedRemembrance(inspectedHero);
                      setShowRemembranceModal(true);
                    }}
                    className="py-2 bg-slate-900 hover:bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold rounded-lg text-[10px] flex items-center justify-center gap-1.5 transition active:scale-95"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Read Lore
                  </button>
                </div>

                <button
                  onClick={() => handleHeroAction(inspectedHero)}
                  disabled={isEquipped || (!isUnlocked && !canAfford)}
                  className={`w-full py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition shadow-lg ${
                    isEquipped
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-default'
                      : isUnlocked
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-cyan-500/30 active:scale-98'
                      : canAfford
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-amber-500/40 active:scale-98'
                      : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  {isEquipped ? (
                    <>
                      <Check className="w-4 h-4" /> CURRENTLY EQUIPPED
                    </>
                  ) : isUnlocked ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> EQUIP {inspectedHero.name.toUpperCase()}
                    </>
                  ) : canAfford ? (
                    <>
                      <Coins className="w-4 h-4" /> UNLOCK FOR {inspectedHero.geoCost} GEO
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> LOCKED (NEED {inspectedHero.geoCost - geo} MORE GEO)
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right: Detailed Lore, Stats & Selection Carousel */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-lg font-black text-slate-100 uppercase tracking-wide">
                      {inspectedHero.name}
                    </h2>
                    <span className="text-[10px] text-amber-400 font-bold">{inspectedHero.division}</span>
                  </div>
                  <span className="text-xs font-black text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2.5 py-1 rounded">
                    {inspectedHero.geoCost === 0 ? 'FREE STARTER' : `${inspectedHero.geoCost} GEO`}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  {inspectedHero.lore}
                </p>

                {/* Shikai / Bankai Banner */}
                <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/40 mb-3 flex items-start gap-2.5">
                  <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wide">
                      ZANPAKUTO: {inspectedHero.zanpakuto} ({inspectedHero.releaseCommand})
                    </span>
                    <p className="text-[10px] text-slate-300 mt-0.5">{inspectedHero.technique}: {inspectedHero.techniqueDesc}</p>
                  </div>
                </div>

                {/* Combat Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block">Starting Hearts</span>
                    <span className="text-rose-400 font-black flex items-center gap-1 mt-0.5">
                      <Heart className="w-3 h-3 fill-rose-500" /> {inspectedHero.baseHearts} Hearts
                    </span>
                  </div>

                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block">Geo Multiplier</span>
                    <span className="text-amber-300 font-black flex items-center gap-1 mt-0.5">
                      <Coins className="w-3 h-3" /> {inspectedHero.bonusGeoMultiplier}x Earned
                    </span>
                  </div>

                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block">Damage Bonus</span>
                    <span className="text-cyan-300 font-black flex items-center gap-1 mt-0.5">
                      <Zap className="w-3 h-3" /> +{inspectedHero.damageBonus} Base DMG
                    </span>
                  </div>
                </div>
              </div>

              {/* Roster Selection Cards */}
              <div>
                <span className="text-[10px] text-cyan-400 uppercase font-black tracking-wider block mb-2">
                  Select Shinigami to Inspect / Unlock:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(BLEACH_ROSTER) as BleachHeroId[]).map((heroKey) => {
                    const hero = BLEACH_ROSTER[heroKey];
                    const unlocked = unlockedHeroIds.includes(hero.id);
                    const equipped = selectedHeroId === hero.id;
                    const isSelectedCard = previewHeroId === hero.id;

                    return (
                      <button
                        key={hero.id}
                        onClick={() => setPreviewHeroId(hero.id)}
                        className={`p-2.5 rounded-xl border-2 text-left transition flex flex-col justify-between relative ${
                          isSelectedCard
                            ? 'border-amber-400 bg-amber-950/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                        }`}
                      >
                        {equipped && (
                          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                        )}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-black text-slate-200 truncate">{hero.name}</span>
                          </div>
                          <span className="text-[9px] text-slate-400 block truncate">{hero.zanpakuto}</span>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
                          <span className="text-[10px] font-black text-amber-400">
                            {hero.geoCost === 0 ? 'FREE' : `${hero.geoCost} G`}
                          </span>
                          {unlocked ? (
                            <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" /> Owned
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-slate-500 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> Locked
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex flex-wrap justify-between items-center pt-3 border-t border-slate-800 gap-2">
            <button
              onClick={() => setGameState('title')}
              className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
            >
              <LogOut className="w-3.5 h-3.5" /> Return to Sanctuary Title
            </button>

            <button
              onClick={() => startTrial('easy')}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black rounded-xl hover:scale-105 transition shadow-lg shadow-cyan-500/30 text-xs uppercase flex items-center gap-2 soul-btn"
            >
              Enter Battle as {activeHero.name} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </main>
      <ProfileInspectionModal
        isOpen={showRemembranceModal}
        onClose={() => setShowRemembranceModal(false)}
        target={inspectedRemembrance}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(u) => setCurrentUser(u)}
        currentUser={currentUser}
      />
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: SANCTUARY (TITLE / DOMAIN MAP)
  // -------------------------------------------------------------
  if (gameState === 'title') {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-mono">
        <UnifiedHeader 
          mainTab={mainTab} 
          setMainTab={setMainTab} 
          geo={geo} 
          currentUser={currentUser}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onLogout={() => setCurrentUser(null)}
        />
        <main className="flex-1 flex flex-col items-center justify-center p-4 select-none overflow-hidden relative">
        <div className="absolute inset-0 crt-overlay z-30 pointer-events-none" />
        <BleachArenaBackground bgType="seireitei" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl bg-[#090d16]/95 border-4 border-amber-500/90 rounded-2xl p-6 shadow-[0_0_80px_rgba(245,158,11,0.3)] z-10 text-center relative pixel-art"
        >
          {/* Title Header */}
          <div className="mb-6 border-b-2 border-slate-800 pb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] bg-amber-500 text-slate-950 px-3 py-1 rounded font-black tracking-widest uppercase">
                BLEACH ANIME PROGRAMMING RPG
              </span>
              <button
                onClick={() => setGameState('shop')}
                className="bg-amber-950/80 hover:bg-amber-900/90 border border-amber-500/60 text-amber-300 px-3 py-1 rounded text-xs font-black flex items-center gap-1.5 transition shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" /> {geo} GEO • ARMORY
              </button>
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-amber-300 tracking-wider mt-3 drop-shadow-[0_0_25px_rgba(245,158,11,0.8)] uppercase">
              CHRONICLES OF SEIREITEI
            </h1>
            <p className="text-slate-400 text-xs mt-2 max-w-md mx-auto">
              Command legendary Bleach heroes against Grimmjow, Ulquiorra, and Yhwach across iconic anime battlegrounds.
            </p>
          </div>

          {/* Active Champion Preview Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-5 flex flex-col items-center relative">
            <BleachPixelSprite
              heroId={activeHero.id}
              animState="idle"
              isHurt={false}
            />
            <div className="mt-3">
              <span className="text-xs font-black text-amber-300">{activeHero.name}</span>
              <p className="text-[10px] text-slate-400">{activeHero.title}</p>
              <div className="mt-1 flex items-center justify-center gap-3 text-[9px] text-cyan-400 font-bold">
                <span>❤️ {activeHero.baseHearts} Hearts</span>
                <span>⚔️ {activeHero.zanpakuto}</span>
                <span>🪙 {activeHero.bonusGeoMultiplier}x Geo</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => {
                  setInspectedRemembrance(activeHero);
                  setShowRemembranceModal(true);
                }}
                className="px-3 py-1.5 bg-slate-900 hover:bg-amber-950/60 border border-slate-700 hover:border-amber-400 rounded-lg text-xs font-bold text-amber-300 flex items-center gap-1.5 transition"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Inspect Profile
              </button>

              <button
                onClick={() => {
                  setPreviewHeroId(activeHero.id);
                  setGameState('shop');
                }}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-slate-300 flex items-center gap-1.5 transition"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" /> Character Vault
              </button>
            </div>
          </div>

          {/* Bleach Battlegrounds Selection */}
          <div className="space-y-2.5 mb-6 text-left">
            <p className="text-[10px] text-amber-400 uppercase font-black tracking-wider">Select Bleach Battleground:</p>
            
            <button
              onClick={() => startTrial('easy')}
              className="w-full p-3 bg-slate-900/80 hover:bg-cyan-950/60 border-2 border-slate-700 hover:border-cyan-400 rounded-xl transition flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-black text-slate-200 group-hover:text-cyan-300">WORLD 1: THE SEIREITEI // SOKYOKU HILL</span>
                <p className="text-[10px] text-slate-400">Boss: Grimmjow Jaegerjaquez (Resurrección: Pantera)</p>
              </div>
              <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-500/40">EASY</span>
            </button>

            <button
              onClick={() => startTrial('intermediate')}
              className="w-full p-3 bg-slate-900/80 hover:bg-emerald-950/60 border-2 border-slate-700 hover:border-emerald-400 rounded-xl transition flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-black text-slate-200 group-hover:text-emerald-300">WORLD 2: HUECO MUNDO // DESERT OF LAS NOCHES</span>
                <p className="text-[10px] text-slate-400">Boss: Ulquiorra Cifer (Resurrección: Segunda Etapa)</p>
              </div>
              <span className="text-xs font-black text-amber-400 bg-amber-950/80 px-2 py-1 rounded border border-amber-500/40">MEDIUM</span>
            </button>

            <button
              onClick={() => startTrial('hard')}
              className="w-full p-3 bg-slate-900/80 hover:bg-sky-950/60 border-2 border-slate-700 hover:border-sky-400 rounded-xl transition flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-black text-slate-200 group-hover:text-sky-300">WORLD 3: THE WANDENREICH // SILBERN WAHRWELT</span>
                <p className="text-[10px] text-slate-400">King: Yhwach (The Almighty Awakened)</p>
              </div>
              <span className="text-xs font-black text-rose-400 bg-rose-950/80 px-2 py-1 rounded border border-rose-500/40">HARD</span>
            </button>
          </div>

          {/* Sound Toggle & Action */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1.5"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
              {soundEnabled ? 'Audio Active' : 'Audio Muted'}
            </button>

            <button
              onClick={() => startTrial('easy')}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black rounded-xl hover:scale-105 transition shadow-lg shadow-amber-500/30 text-xs uppercase flex items-center gap-2 soul-btn"
            >
              Draw Zanpakuto <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </main>
      <ProfileInspectionModal
        isOpen={showRemembranceModal}
        onClose={() => setShowRemembranceModal(false)}
        target={inspectedRemembrance}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(u) => setCurrentUser(u)}
        currentUser={currentUser}
      />
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: YOU DIED (GAME OVER)
  // -------------------------------------------------------------
  if (gameState === 'gameover') {
    return (
      <main className="min-h-screen bg-black text-slate-100 flex flex-col items-center justify-center p-4 font-mono select-none overflow-hidden relative">
        <div className="absolute inset-0 bg-red-950/40 pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-[#090d16] border-4 border-rose-700 rounded-2xl p-6 text-center z-10 shadow-[0_0_80px_rgba(225,29,72,0.5)]"
        >
          <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_#f43f5e]">
            <Skull className="w-8 h-8 text-rose-400" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-rose-600 tracking-widest uppercase drop-shadow-[0_0_25px_#ef4444]">
            YOU DIED
          </h1>
          <p className="text-slate-400 text-xs mt-2 mb-6">
            All hearts were shattered by <span className="text-rose-400 font-bold">{boss.name}</span> in {boss.realm}. Your spiritual pressure has evaporated.
          </p>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 mb-6 grid grid-cols-2 gap-2 text-left text-xs">
            <div>
              <span className="text-[9px] text-slate-500 uppercase font-bold">Essence Harvested</span>
              <p className="text-amber-400 font-bold">{scoreEssence}</p>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase font-bold">Retained Geo Balance</span>
              <p className="text-cyan-300 font-bold">{geo} Geo</p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => {
                if (activeTestStage) {
                  handleLaunchStageTest(activeTestStage);
                } else {
                  startTrial(tier);
                }
              }}
              className="w-full py-3 bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 text-white font-black rounded-xl text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition"
            >
              <RotateCcw className="w-4 h-4" /> Retry Stage Test
            </button>

            <button
              onClick={() => {
                setInspectedRemembrance(boss);
                setShowRemembranceModal(true);
              }}
              className="w-full py-2.5 bg-slate-900 hover:bg-rose-950/60 text-rose-300 border border-rose-500/40 font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-2 transition"
            >
              <BookOpen className="w-4 h-4 text-rose-400" /> Inspect Boss Profile & Weakness
            </button>

            <button
              onClick={() => setGameState('shop')}
              className="w-full py-2.5 bg-slate-900 hover:bg-amber-950 text-amber-300 border border-amber-500/40 font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-2 transition"
            >
              <ShoppingBag className="w-4 h-4" /> Spend Geo in Armory
            </button>

            <button
              onClick={() => {
                setActiveTestStage(null);
                setGameState('title');
                setMainTab('worldmap');
              }}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" /> Return to World Map
            </button>
          </div>
        </motion.div>
        <ProfileInspectionModal
          isOpen={showRemembranceModal}
          onClose={() => setShowRemembranceModal(false)}
          target={inspectedRemembrance}
        />
      </main>
    );
  }

  // -------------------------------------------------------------
  // VIEW 4: INSTANT DEMIGOD / ESPADA FELLED (NO DELAYED ANIMATION)
  // -------------------------------------------------------------
  if (gameState === 'finisher') {
    return (
      <main className="min-h-screen bg-black text-slate-100 flex flex-col items-center justify-center p-4 font-mono select-none overflow-hidden relative">
        <div className="fixed top-0 inset-x-0 h-16 bg-black z-50 border-b border-amber-500/20" />
        <div className="fixed bottom-0 inset-x-0 h-16 bg-black z-50 border-t border-amber-500/20" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#090d16] border-2 border-amber-400/90 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_70px_rgba(245,158,11,0.4)] text-center z-40 relative"
        >
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto mb-3 shadow-[0_0_30px_#f59e0b]">
            <Trophy className="w-8 h-8 text-amber-300" />
          </div>

          <span className="text-[10px] bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded font-black uppercase">
            {isFlawlessVictory ? 'PERFECT RUN // FLAWLESS VICTORY' : 'BATTLE WON'}
          </span>

          <h1 className="text-2xl md:text-3xl font-black text-amber-300 tracking-widest mt-2 uppercase drop-shadow-[0_0_20px_#fbbf24]">
            {boss.demigodFelledTitle}
          </h1>

          <p className="text-slate-300 text-xs mt-1 mb-4">
            You defeated <span className="text-amber-400 font-bold">{boss.name}</span> in {boss.realm}!
          </p>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 mb-5 grid grid-cols-2 gap-2 text-left text-xs">
            <div>
              <span className="text-[9px] text-slate-500 uppercase font-bold">Total Essence</span>
              <p className="text-amber-400 font-black">+{scoreEssence} XP</p>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase font-bold">Geo Purse</span>
              <p className="text-cyan-300 font-black">+{geo} Geo</p>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase font-bold">Bonus Geo</span>
              <p className="text-amber-400 font-black">+{isFlawlessVictory ? 350 : 150} Geo!</p>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase font-bold">Champion</span>
              <p className="text-purple-400 font-black">{activeHero.name}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setActiveTestStage(null);
                setGameState('title');
                setMainTab('worldmap');
              }}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black rounded-xl hover:scale-105 transition text-xs uppercase flex items-center justify-center gap-2 soul-btn"
            >
              Return to Personalized World Map <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setInspectedRemembrance(boss);
                setShowRemembranceModal(true);
              }}
              className="w-full py-2.5 bg-slate-900 hover:bg-amber-950/60 text-amber-300 border border-amber-500/40 font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> Inspect Boss Profile
            </button>

            <button
              onClick={() => setGameState('shop')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Spend Geo in Armory
            </button>
          </div>
        </motion.div>
        <ProfileInspectionModal
          isOpen={showRemembranceModal}
          onClose={() => setShowRemembranceModal(false)}
          target={inspectedRemembrance}
        />
      </main>
    );
  }

  // -------------------------------------------------------------
  // VIEW 5: ACTIVE BATTLE ARENA
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-mono">
      <UnifiedHeader 
        mainTab={mainTab} 
        setMainTab={setMainTab} 
        geo={geo} 
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={() => setCurrentUser(null)}
        activeTestStage={activeTestStage}
        onExitTest={handleExitTest}
      />
      <main className="flex-1 flex flex-col items-center justify-center p-3 md:p-6 font-mono select-none overflow-hidden relative">
      <div className="absolute inset-0 crt-overlay z-30 pointer-events-none" />
      <BleachArenaBackground bgType={boss.bgType} />

      {/* PHASE 2 CUTSCENE OVERLAY */}
      <AnimatePresence>
        {phaseTransitionActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center text-center p-6"
          >
            <div className="fixed top-0 inset-x-0 h-24 bg-black border-b border-amber-500/30" />
            <div className="fixed bottom-0 inset-x-0 h-24 bg-black border-t border-amber-500/30" />

            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 max-w-xl"
            >
              <span className="text-xs bg-red-600 text-white px-3 py-1 rounded font-black tracking-widest uppercase shadow-[0_0_15px_#dc2626]">
                ⚡ PHASE II // {boss.phase2TransformationName}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-amber-300 tracking-wider uppercase drop-shadow-[0_0_30px_#f59e0b]">
                {boss.name.toUpperCase()}
              </h2>
              <p className="text-sm md:text-base italic text-slate-200 border-l-2 border-amber-500 pl-4 py-1 text-left">
                {boss.phase2Quote}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={
          screenShake === 'heavy'
            ? { x: [-14, 14, -10, 10, -5, 5, 0], y: [-7, 7, -5, 5, 0] }
            : screenShake === 'light'
            ? { x: [-5, 5, -5, 5, 0], y: [-2, 2, 0] }
            : {}
        }
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl bg-[#090d16]/95 border-4 border-amber-500/80 rounded-2xl p-4 md:p-6 shadow-[0_0_60px_rgba(245,158,11,0.25)] z-10 relative pixel-art"
      >
        {/* Top Header */}
        <div className="flex flex-wrap justify-between items-center pb-3 mb-3 border-b-2 border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] md:text-xs bg-amber-500 text-slate-950 px-2.5 py-1 rounded font-black tracking-wider uppercase flex items-center gap-1.5 shadow">
              <Skull className="w-3.5 h-3.5" />
              {activeTestStage 
                ? `STAGE ${activeTestStage.stageNumber}: ${activeTestStage.name.toUpperCase()}`
                : `${boss.realm} • ${boss.stageName}`}
            </span>
            {bossPhase === 2 && (
              <span className="text-[9px] bg-red-600 text-white px-2 py-0.5 rounded font-black animate-pulse">
                PHASE II
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="text-cyan-400 font-black flex items-center gap-1 text-xs bg-cyan-950/80 border border-cyan-500/50 px-2 py-1 rounded">
              <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
              {streak}x
            </div>

            <button
              onClick={() => setGameState('shop')}
              className="text-amber-300 hover:text-amber-200 font-black flex items-center gap-1 text-xs bg-slate-900 hover:bg-slate-800 border border-amber-500/50 px-2 py-1 rounded animate-geo transition"
              title="Open Character Vault"
            >
              <Coins className="w-3 h-3 text-amber-400" />
              {geo} GEO
            </button>

            <button
              onClick={() => {
                setInspectedRemembrance(boss);
                setShowRemembranceModal(true);
              }}
              className="p-1 rounded bg-slate-800 hover:bg-amber-950/60 text-amber-300 border border-slate-700 transition"
              title="Inspect Boss Profile"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700 transition"
              title={soundEnabled ? 'Mute' : 'Enable Audio'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
            </button>

            <button
              onClick={handleExitTest}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-300 border border-slate-700 transition text-[10px] flex items-center gap-1 font-bold"
              title="Exit Test to World Map"
            >
              <LogOut className="w-3 h-3" /> Exit Test
            </button>
          </div>
        </div>

        {/* HERO STATUS & STANCE */}
        <div className="mb-3 bg-slate-950/90 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider">
              SHINIGAMI:
            </span>
            <span className="text-[10px] bg-slate-900 text-cyan-300 px-2 py-0.5 rounded font-black border border-slate-700">
              {activeHero.name} • {stanceInfo.stanceName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((slot) => {
              const isFilled = effectiveStreak >= slot;
              return (
                <div
                  key={slot}
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                    isFilled
                      ? slot === 4
                        ? 'bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 border-purple-300 shadow-[0_0_12px_#c084fc]'
                        : slot === 3
                        ? 'bg-rose-600 border-rose-300 shadow-[0_0_8px_#f43f5e]'
                        : slot === 2
                        ? 'bg-cyan-500 border-cyan-300 shadow-[0_0_8px_#38bdf8]'
                        : 'bg-slate-200 border-white shadow-[0_0_6px_#f8fafc]'
                      : 'bg-slate-900 border-slate-700'
                  }`}
                >
                  {isFilled && <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stance Notification */}
        <AnimatePresence>
          {stanceMessage && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15 }}
              className="mb-3 py-1.5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white text-center font-black rounded-lg text-xs shadow-lg border border-amber-300 tracking-wider"
            >
              ✨ {stanceMessage} ✨
            </motion.div>
          )}
        </AnimatePresence>

        {/* COMBAT ARENA */}
        <div className="relative bg-gradient-to-b from-[#060a14] via-[#090d16] to-[#04060c] rounded-xl p-4 border-2 border-slate-800 mb-4 flex justify-between items-end h-64 overflow-hidden shadow-inner">
          <div className="absolute inset-0 pointer-events-none opacity-20 flex justify-between items-start px-6 pt-1">
            <div className="w-8 h-16 bg-slate-800 border-b-2 border-slate-700 rounded-b-md" />
            <div className="w-10 h-10 bg-slate-900 rounded-b-lg" />
            <div className="w-12 h-20 bg-slate-800 border-b-2 border-slate-700 rounded-b-md" />
          </div>

          <div className="absolute bottom-0 inset-x-0 h-4 bg-slate-950 border-t-2 border-slate-700 flex">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="flex-1 border-r border-slate-900" />
            ))}
          </div>

          {/* ACTIVE BLEACH HERO SPRITE */}
          <div className="relative flex flex-col items-center z-20 mb-2">
            <BleachPixelSprite
              heroId={activeHero.id}
              animState={heroAnimState}
              isHurt={playerHurt}
            />

            {/* HEARTS */}
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: activeHero.baseHearts }).map((_, idx) => (
                <span 
                  key={idx} 
                  className={`text-xs transition-all duration-300 ${
                    idx < playerHearts ? 'text-rose-500 drop-shadow-[0_0_6px_#f43f5e]' : 'text-slate-700 opacity-40'
                  }`}
                >
                  {idx < playerHearts ? '❤️' : '🖤'}
                </span>
              ))}
            </div>
            <span className="text-[9px] text-amber-400 font-black mt-0.5">{activeHero.zanpakuto}</span>
          </div>

          {/* DAMAGE POPUP */}
          <AnimatePresence>
            {damagePopup && (
              <motion.div
                initial={{ opacity: 0, y: 0, scale: 0.6 }}
                animate={{ opacity: 1, y: -50, scale: 1.25 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className={`absolute ${damagePopup.isPlayerDamage ? 'left-10 bottom-24' : 'right-10 bottom-28'} text-center z-40 pointer-events-none`}
              >
                <div className="text-[10px] font-black uppercase bg-slate-950/90 px-2 py-0.5 rounded border border-amber-500 text-amber-300 shadow">
                  {damagePopup.text}
                </div>
                <div className={`text-2xl md:text-3xl font-black ${damagePopup.isPlayerDamage ? 'text-rose-500 drop-shadow-[0_0_12px_#f43f5e]' : 'text-amber-400 drop-shadow-[0_0_12px_#fbbf24]'}`}>
                  {damagePopup.isPlayerDamage ? '-1 HEART' : `-${damagePopup.amount} HP`}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BLEACH VILLAIN SPRITE */}
          <div className="relative flex flex-col items-center z-10 mb-2">
            <BleachVillainSprite
              tier={tier}
              bossRecoil={bossRecoil}
              isAttacking={bossAttacking}
              phase={bossPhase}
            />

            <div className="w-40 mt-2 bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-700 shadow-md">
              <div 
                className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 h-full transition-all duration-300" 
                style={{ width: `${(bossHp / boss.maxHp) * 100}%` }} 
              />
            </div>
            <div className="flex items-center justify-between w-40 mt-0.5 px-0.5">
              <span className="text-[9px] text-amber-400 font-black uppercase truncate">{boss.name}</span>
              <span className="text-[9px] text-amber-400 font-black">{bossHp}/{boss.maxHp}</span>
            </div>
          </div>
        </div>

        {/* QUESTION PANEL */}
        <div className="mb-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 shadow">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-amber-400 uppercase font-black tracking-wider flex items-center gap-1">
                <Eye className="w-3 h-3 text-amber-400" />
                {'subtopicName' in currentQuestion 
                  ? `${(currentQuestion as any).subtopicName} // STAGE TEST Q${(questionIndex % currentQuestions.length) + 1} of ${currentQuestions.length}`
                  : ((currentQuestion as any).quest || `TRIAL ${questionIndex + 1} // ${boss.stageName}`)}
              </span>
              {activeTestStage && (
                <button
                  onClick={() => setIsCombatLectureOpen(true)}
                  className="px-2 py-0.5 rounded bg-indigo-950/90 hover:bg-indigo-900 border border-indigo-500/40 text-[10px] font-bold text-indigo-300 flex items-center space-x-1 cursor-pointer transition"
                  title="Review Lecture Notes"
                >
                  <BookOpen className="w-3 h-3 text-indigo-400" />
                  <span>Notes</span>
                </button>
              )}
            </div>
            <span className="text-[9px] text-slate-400 font-bold">
              +{currentQuestion.rewardXp || 50} ESSENCE // +{Math.round((currentQuestion.rewardGeo || 25) * activeHero.bonusGeoMultiplier)} GEO
            </span>
          </div>
          <h2 className="text-xs md:text-sm font-bold text-slate-100 leading-snug">
            {currentQuestion.question}
          </h2>
        </div>

        {/* ANSWER BUTTONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={bossHp <= 0 || gameState !== 'arena' || heroAnimState !== 'idle' || bossAttacking || phaseTransitionActive}
              className="w-full text-left px-3.5 py-2.5 bg-slate-900 hover:bg-amber-600 hover:text-slate-950 hover:border-amber-300 border-2 border-slate-700 rounded-lg text-xs font-bold transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2.5 group void-btn hover:soul-btn"
            >
              <span className="w-5 h-5 rounded bg-slate-950 group-hover:bg-slate-900 group-hover:text-amber-300 border border-slate-700 flex items-center justify-center text-[10px] text-amber-400 font-black shrink-0">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="truncate">{option}</span>
            </button>
          ))}
        </div>

        {/* BATTLE LOG */}
        <div className="bg-slate-950/90 p-2 rounded-lg border border-slate-800 text-[10px] text-slate-400 space-y-1">
          {battleLog.slice(0, 2).map((log, idx) => (
            <div key={idx} className="truncate text-slate-300">
              {log}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ----------------------------------------------------------- */}
      {/* BLEACH PROFILE & LORE MODAL */}
      {/* ----------------------------------------------------------- */}
      <ProfileInspectionModal
        isOpen={showRemembranceModal}
        onClose={() => setShowRemembranceModal(false)}
        target={inspectedRemembrance}
      />
      </main>
      {/* Active Stage Test Combat Notes Review Modal */}
      {activeTestStage && (
        <LectureNotesModal
          isOpen={isCombatLectureOpen}
          onClose={() => setIsCombatLectureOpen(false)}
          course={selectedCourse}
          stage={activeTestStage}
          diagnosedGaps={unlockedCourses[selectedCourse.id]?.diagnosedGaps || []}
          onStartTest={() => setIsCombatLectureOpen(false)}
          onClaimGeo={(amt) => addGeo(amt)}
        />
      )}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(u) => setCurrentUser(u)}
        currentUser={currentUser}
      />
    </div>
  );
}