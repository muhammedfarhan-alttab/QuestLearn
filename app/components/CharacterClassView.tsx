'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Coins,
  Shield,
  Zap,
  Swords,
  CheckCircle2,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
  Crown,
  Wand2,
  Cross,
  Activity,
  AlertCircle,
  ArrowUpRight,
  ShieldCheck,
  Flame,
  Lock,
  Play,
  Heart,
  Info,
  Check
} from 'lucide-react';
import {
  CharacterClassId,
  CharacterClassConfig,
  CHARACTER_CLASSES,
  CHARACTER_CLASS_LIST,
  MAX_CLASS_LEVEL,
  CLASS_UPGRADE_COSTS
} from '../data/characterClassesData';
import { CharacterClassLevelsMap } from '../lib/characterClassStorage';
import { 
  BleachHeroId, 
  BLEACH_ROSTER, 
  BleachPixelSprite, 
  BleachHeroConfig 
} from './CharactersView';
import { 
  CharacterAnimationState, 
  CHARACTER_ANIMATIONS 
} from '../lib/characterAnimations';

interface CharacterClassViewProps {
  geo: number;
  classLevels: CharacterClassLevelsMap;
  selectedClassId: CharacterClassId;
  onSelectClass: (classId: CharacterClassId) => void;
  onUpgradeClass: (classId: CharacterClassId, cost: number) => void;
  onOpenArena: () => void;
  unlockedHeroIds?: BleachHeroId[];
  selectedHeroId?: BleachHeroId;
  onHeroAction?: (hero: BleachHeroConfig) => void;
}

export default function CharacterClassView({
  geo,
  classLevels,
  selectedClassId,
  onSelectClass,
  onUpgradeClass,
  onOpenArena,
  unlockedHeroIds = ['ichigo'],
  selectedHeroId = 'ichigo',
  onHeroAction = () => {}
}: CharacterClassViewProps) {
  const [inspectedClassId, setInspectedClassId] = useState<CharacterClassId>(selectedClassId);
  const [upgradeFeedback, setUpgradeFeedback] = useState<string | null>(null);
  const [characterAnimStates, setCharacterAnimStates] = useState<Record<string, CharacterAnimationState>>({});
  const [activeHeroFilter, setActiveHeroFilter] = useState<'current_class' | 'all'>('current_class');

  const activeClass = CHARACTER_CLASSES[selectedClassId] || CHARACTER_CLASSES.warrior;
  const inspectedClass = CHARACTER_CLASSES[inspectedClassId] || activeClass;
  const currentLevel = classLevels[inspectedClass.id] || 1;
  const currentStats = inspectedClass.getStatsForLevel(currentLevel);
  const nextLevel = currentLevel < MAX_CLASS_LEVEL ? currentLevel + 1 : null;
  const nextStats = nextLevel ? inspectedClass.getStatsForLevel(nextLevel) : null;
  const upgradeCost = inspectedClass.getUpgradeCost(currentLevel);
  const canAfford = upgradeCost !== null && geo >= upgradeCost;

  // Bleach anime heroes belonging to the inspected class
  const inspectedClassHeroes = (Object.values(BLEACH_ROSTER) as BleachHeroConfig[]).filter(
    (hero) => hero.clanId === inspectedClass.id
  );

  const allHeroes = Object.values(BLEACH_ROSTER) as BleachHeroConfig[];
  const displayedHeroes = activeHeroFilter === 'all' 
    ? allHeroes 
    : inspectedClassHeroes;

  const handleUpgradeClick = () => {
    if (!upgradeCost || currentLevel >= MAX_CLASS_LEVEL) return;

    if (geo < upgradeCost) {
      setUpgradeFeedback(`Insufficient Coins! You need ${upgradeCost - geo} more Geo to upgrade.`);
      setTimeout(() => setUpgradeFeedback(null), 3000);
      return;
    }

    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    onUpgradeClass(inspectedClass.id, upgradeCost);
    setUpgradeFeedback(`★ ${inspectedClass.name} upgraded to Level ${currentLevel + 1}!`);
    setTimeout(() => setUpgradeFeedback(null), 3000);
  };

  const triggerHeroAnim = (heroId: BleachHeroId, state: CharacterAnimationState) => {
    setCharacterAnimStates((prev) => ({ ...prev, [heroId]: state }));
    if (state !== 'idle') {
      const duration = state === 'knockout' ? 1400 : state === 'celebration' ? 850 : 650;
      setTimeout(() => {
        setCharacterAnimStates((prev) => ({ ...prev, [heroId]: 'idle' }));
      }, duration);
    }
  };

  const handleHeroEquip = (hero: BleachHeroConfig) => {
    onHeroAction(hero);
    if (selectedClassId !== hero.clanId) {
      onSelectClass(hero.clanId);
    }
    setUpgradeFeedback(`⚔️ Equipped ${hero.name} & synchronized ${CHARACTER_CLASSES[hero.clanId].name} Archetype!`);
    setTimeout(() => setUpgradeFeedback(null), 3000);
  };

  const handleHeroUnlock = (hero: BleachHeroConfig) => {
    if (geo < hero.geoCost) {
      setUpgradeFeedback(`Need ${hero.geoCost - geo} more Geo to unlock ${hero.name}! Complete course tests to earn money.`);
      setTimeout(() => setUpgradeFeedback(null), 3000);
      return;
    }

    onHeroAction(hero);
    if (selectedClassId !== hero.clanId) {
      onSelectClass(hero.clanId);
    }
    setUpgradeFeedback(`✨ Awakened ${hero.name}! You can now equip them in your tests.`);
    setTimeout(() => setUpgradeFeedback(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-8 font-mono">
      {/* Top Banner: Overview, Wallet & Rules Notice */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-2 border-indigo-500/30 p-5 sm:p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="uppercase tracking-widest">Bleach Classes & Anime Character Categories</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Character Classes & Anime Roster</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Bleach anime heroes are categorized under their respective combat archetypes.
              Use <b className="text-amber-400 font-bold">money earned from completing courses</b> to unlock characters!
            </p>
            {/* Strict Invariant Badge */}
            <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-[11px] text-indigo-300">
              <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>
                <b>Strict Health Rule:</b> Characters possess unique animations and category-based advantages with <b>strictly 100 Base HP</b> (no extra health).
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {/* Wallet display */}
            <div className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-amber-500/40 shadow-inner flex items-center space-x-2.5">
              <Coins className="w-5 h-5 text-amber-400 animate-pulse" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block leading-tight">Course Earnings</span>
                <span className="text-base font-black text-amber-300">{geo} Geo</span>
              </div>
            </div>

            {/* Currently Equipped Hero Badge */}
            <div className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 flex items-center space-x-2.5">
              <span className="text-xl">{activeClass.iconSymbol}</span>
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase block leading-tight">Active Hero & Class</span>
                <span className="text-xs sm:text-sm font-black text-white">
                  {BLEACH_ROSTER[selectedHeroId]?.name.split(' ')[0] || 'Ichigo'} • {activeClass.name} <span className="text-indigo-300">Lv.{classLevels[activeClass.id] || 1}</span>
                </span>
              </div>
            </div>

            <button
              onClick={onOpenArena}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-lg shadow-amber-500/20 cursor-pointer transition transform active:scale-95"
            >
              <Swords className="w-4 h-4" />
              <span>Enter Arena</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of 5 Character Class Categories */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-200">
              5 Character Class Categories
            </h2>
          </div>
          <span className="text-xs text-slate-500">Click any category to view its anime characters & abilities</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {CHARACTER_CLASS_LIST.map((cls) => {
            const lvl = classLevels[cls.id] || 1;
            const stats = cls.getStatsForLevel(lvl);
            const isEquipped = selectedClassId === cls.id;
            const isInspected = inspectedClassId === cls.id;
            const clanHeroes = allHeroes.filter((h) => h.clanId === cls.id);
            const unlockedClanHeroes = clanHeroes.filter((h) => unlockedHeroIds.includes(h.id));

            return (
              <motion.div
                key={cls.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.15 }}
                onClick={() => setInspectedClassId(cls.id)}
                className={`relative rounded-xl p-4 transition cursor-pointer flex flex-col justify-between border-2 select-none ${
                  isInspected
                    ? 'bg-slate-900/95 shadow-xl ring-2 ring-indigo-500/50'
                    : 'bg-slate-950/80 hover:bg-slate-900/60'
                } ${
                  isEquipped
                    ? 'border-amber-400/90 shadow-amber-500/15'
                    : isInspected
                    ? 'border-indigo-400/80'
                    : 'border-slate-800'
                }`}
              >
                {/* Active Equipped Ribbon */}
                {isEquipped && (
                  <div className="absolute -top-2.5 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>EQUIPPED</span>
                  </div>
                )}

                <div>
                  {/* Top bar with Emblem & Level */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-md border"
                      style={{
                        backgroundColor: `${cls.accentColor}18`,
                        borderColor: `${cls.accentColor}55`
                      }}
                    >
                      <span>{cls.iconSymbol}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold block">Level</span>
                      <div className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-xs font-black text-amber-300">
                        Lv.{lvl} {lvl === MAX_CLASS_LEVEL && '★ MAX'}
                      </div>
                    </div>
                  </div>

                  {/* Class Name & Title */}
                  <h3 className="text-base font-black text-white flex items-center gap-1.5">
                    <span>{cls.name}</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mb-2">
                    {cls.title}
                  </p>

                  {/* Hero count tag */}
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[10px] font-bold text-slate-300 mb-3">
                    <Swords className="w-3 h-3 text-amber-400" />
                    <span>{unlockedClanHeroes.length}/{clanHeroes.length} Anime Heroes</span>
                  </div>

                  {/* Level Pips (1 to 10) */}
                  <div className="flex items-center space-x-1 mb-3">
                    {Array.from({ length: MAX_CLASS_LEVEL }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full ${
                          i < lvl
                            ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                            : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Ability Tag Box */}
                  <div
                    className="p-2.5 rounded-lg border text-left mb-3"
                    style={{
                      backgroundColor: `${cls.accentColor}10`,
                      borderColor: `${cls.accentColor}40`
                    }}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-300 uppercase mb-0.5">
                      <span className="truncate">{cls.abilityName}</span>
                      <span className="font-black text-white shrink-0">{stats.shortTag}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-tight">
                      {cls.abilityTagline}
                    </p>
                  </div>
                </div>

                {/* Bottom Select / Inspect Button */}
                <div className="pt-2 border-t border-slate-800">
                  <div className={`w-full py-1.5 rounded-lg text-center text-xs font-bold flex items-center justify-center space-x-1 transition ${
                    isInspected 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}>
                    <span>{isInspected ? 'Inspecting Category' : 'View Characters'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Global Upgrade Feedback Notice */}
      <AnimatePresence>
        {upgradeFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3.5 bg-indigo-950/90 border-2 border-indigo-500/70 rounded-xl text-xs font-bold text-indigo-100 flex items-center justify-between shadow-2xl"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{upgradeFeedback}</span>
            </div>
            <button
              onClick={() => setUpgradeFeedback(null)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer ml-2"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION: Bleach Anime Characters Categorized under Inspected Class */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl">{inspectedClass.iconSymbol}</span>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>{inspectedClass.name} Anime Roster</span>
                <span className="text-xs font-bold text-slate-400">
                  ({displayedHeroes.length} {displayedHeroes.length === 1 ? 'Character' : 'Characters'})
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Anime characters categorized under the <b className="text-indigo-300">{inspectedClass.name}</b> category. Test unique animations & unlock with Geo!
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setActiveHeroFilter('current_class')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeHeroFilter === 'current_class'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {inspectedClass.name} Only
            </button>
            <button
              onClick={() => setActiveHeroFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeHeroFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              All Anime Characters
            </button>
          </div>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedHeroes.map((hero) => {
            const isUnlocked = unlockedHeroIds.includes(hero.id);
            const isEquippedHero = selectedHeroId === hero.id;
            const currentAnim = characterAnimStates[hero.id] || 'idle';
            const canAffordHero = geo >= hero.geoCost;
            const heroClan = CHARACTER_CLASSES[hero.clanId] || inspectedClass;

            return (
              <motion.div
                key={hero.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
                className={`relative rounded-2xl p-5 border-2 flex flex-col justify-between transition shadow-xl ${
                  isEquippedHero
                    ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-amber-400 shadow-amber-500/20'
                    : isUnlocked
                    ? 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/60 border-slate-900 opacity-90'
                }`}
              >
                {/* Equipped Badge */}
                {isEquippedHero && (
                  <div className="absolute -top-3 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-lg flex items-center space-x-1 z-20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ACTIVE HERO</span>
                  </div>
                )}

                <div>
                  {/* Card Top: Clan Tag & Price */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-[10px] font-bold text-slate-300">
                      <span>{heroClan.iconSymbol}</span>
                      <span className="uppercase">{heroClan.name} Category</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {isUnlocked ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-black text-emerald-400 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>UNLOCKED</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-black text-amber-300 flex items-center gap-1">
                          <Coins className="w-3 h-3 text-amber-400" />
                          <span>{hero.geoCost} Geo</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Character Visual Showcase Stage */}
                  <div className="relative h-44 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 flex items-center justify-center overflow-hidden mb-4 p-2 shadow-inner">
                    <div 
                      className="absolute inset-0 opacity-20 blur-xl pointer-events-none"
                      style={{ backgroundColor: hero.accentColor }}
                    />

                    {/* Pixel Sprite with Live Animation */}
                    <div className="relative z-10 scale-125 transform">
                      <BleachPixelSprite heroId={hero.id} animState={currentAnim} />
                    </div>

                    {/* Animation State Pill */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[9px] font-mono text-slate-400 uppercase">
                      State: <b className="text-amber-300">{currentAnim}</b>
                    </div>
                  </div>

                  {/* Hero Identity */}
                  <div className="mb-3">
                    <h3 className="text-lg font-black text-white tracking-tight leading-tight">
                      {hero.name}
                    </h3>
                    <p className="text-[11px] text-indigo-300 font-medium">
                      {hero.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {hero.division}
                    </p>
                  </div>

                  {/* Health Invariant & Category Advantage Badges */}
                  <div className="space-y-1.5 mb-4">
                    {/* STRICT 10 HEARTS INVARIANT BADGE */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-rose-500/30 text-[11px]">
                      <span className="flex items-center space-x-1 text-rose-300 font-bold">
                        <Heart className="w-3.5 h-3.5 text-rose-400" />
                        <span>Vitality Pool</span>
                      </span>
                      <span className="font-black text-white font-mono bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/40">
                        10 Hearts (Standard Cap)
                      </span>
                    </div>

                    {/* CATEGORY ADVANTAGE BADGE */}
                    <div 
                      className="p-2.5 rounded-lg border text-left"
                      style={{
                        backgroundColor: `${hero.accentColor}12`,
                        borderColor: `${hero.accentColor}44`
                      }}
                    >
                      <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase mb-0.5" style={{ color: hero.accentColor }}>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Category Advantage: {hero.passiveName}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        {hero.passiveDesc}
                      </p>
                    </div>
                  </div>

                  {/* Unique Animation Controls */}
                  <div className="space-y-1.5 mb-4 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                      <span>Unique Animation Preview:</span>
                      <span className="text-[9px] text-slate-500">Live Framer Motion</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        onClick={() => triggerHeroAnim(hero.id, 'attack')}
                        className="py-1 px-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-cyan-300 text-[10px] font-bold transition flex items-center justify-center space-x-1 cursor-pointer border border-slate-700"
                        title="Preview signature strike animation"
                      >
                        <Swords className="w-3 h-3 text-cyan-400" />
                        <span>Attack</span>
                      </button>
                      <button
                        onClick={() => triggerHeroAnim(hero.id, 'hurt')}
                        className="py-1 px-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-red-300 text-[10px] font-bold transition flex items-center justify-center space-x-1 cursor-pointer border border-slate-700"
                        title="Preview damage stagger animation"
                      >
                        <Shield className="w-3 h-3 text-red-400" />
                        <span>Hurt</span>
                      </button>
                      <button
                        onClick={() => triggerHeroAnim(hero.id, 'celebration')}
                        className="py-1 px-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-300 text-[10px] font-bold transition flex items-center justify-center space-x-1 cursor-pointer border border-slate-700"
                        title="Preview victory jump"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Victory</span>
                      </button>
                      <button
                        onClick={() => triggerHeroAnim(hero.id, 'idle')}
                        className="py-1 px-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold transition flex items-center justify-center space-x-1 cursor-pointer border border-slate-700"
                        title="Reset to idle breathing"
                      >
                        <span>Idle</span>
                      </button>
                    </div>
                  </div>

                  {/* Lore Quote snippet */}
                  <p className="text-[10px] italic text-slate-400 mb-4 line-clamp-2">
                    {hero.quote}
                  </p>
                </div>

                {/* Bottom Action: Unlock with Geo or Equip */}
                <div className="pt-3 border-t border-slate-800">
                  {isUnlocked ? (
                    isEquippedHero ? (
                      <div className="w-full py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-center text-xs font-black flex items-center justify-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Active Combatant</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleHeroEquip(hero)}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-indigo-600/20 active:scale-98"
                      >
                        <Swords className="w-4 h-4" />
                        <span>Equip {hero.name.split(' ')[0]}</span>
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => handleHeroUnlock(hero)}
                      disabled={!canAffordHero}
                      className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                        canAffordHero
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-98'
                          : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {canAffordHero ? (
                        <>
                          <Coins className="w-4 h-4" />
                          <span>Unlock with {hero.geoCost} Geo</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Need {hero.geoCost - geo} More Geo</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Archetype Progression Forge Panel */}
      <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center space-x-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xl border-2"
              style={{
                backgroundColor: `${inspectedClass.accentColor}20`,
                borderColor: inspectedClass.accentColor
              }}
            >
              <span>{inspectedClass.iconSymbol}</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  {inspectedClass.name} Class Upgrade Forge
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  LEVEL {currentLevel} / {MAX_CLASS_LEVEL}
                </span>
                {selectedClassId === inspectedClass.id && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    CURRENTLY EQUIPPED
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-white mt-0.5">
                {inspectedClass.name} — <span className="text-slate-400">{inspectedClass.title}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {selectedClassId !== inspectedClass.id && (
              <button
                onClick={() => onSelectClass(inspectedClass.id)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/50 text-emerald-400 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Equip {inspectedClass.name} Class</span>
              </button>
            )}
          </div>
        </div>

        {/* Two-Column Forge Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Lore & Level Breakdown */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Archetype Combat Stance & Lore
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {inspectedClass.lore}
              </p>
              <p className="text-xs italic text-amber-200/90 pt-1 border-t border-slate-800/80">
                {inspectedClass.quote}
              </p>
            </div>

            {/* Current Ability Card */}
            <div
              className="p-4 rounded-xl border space-y-2"
              style={{
                backgroundColor: `${inspectedClass.accentColor}12`,
                borderColor: `${inspectedClass.accentColor}44`
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    {inspectedClass.abilityName} (Level {currentLevel})
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-900 text-amber-300 border border-amber-500/30">
                  {currentStats.primaryLabel}
                </span>
              </div>
              <p className="text-xs text-slate-200">
                {currentStats.effectDescription}
              </p>
            </div>

            {/* Level 1 to 10 Progression Guide */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Progression Curve (Levels 1 → 10)</span>
                </span>
                <span className="text-amber-400 font-mono">
                  L1: {inspectedClass.getStatsForLevel(1).shortTag} ➜ L10: {inspectedClass.getStatsForLevel(10).shortTag}
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden flex border border-slate-800">
                <div
                  className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full transition-all duration-500"
                  style={{ width: `${(currentLevel / MAX_CLASS_LEVEL) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Level 1 (Base)</span>
                <span>Current: Level {currentLevel}</span>
                <span>Level 10 (Mastered)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Next Level Preview & Upgrade Action */}
          <div className="lg:col-span-6 space-y-4">
            {nextLevel && nextStats ? (
              <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 border-2 border-indigo-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">
                      Next Tier Upgrade
                    </span>
                    <h3 className="text-lg font-black text-white flex items-center space-x-1.5">
                      <span>Level {currentLevel}</span>
                      <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Level {nextLevel}</span>
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block">Upgrade Cost</span>
                    <div className="text-base font-black text-amber-400 flex items-center justify-end space-x-1">
                      <Coins className="w-4 h-4" />
                      <span>{upgradeCost} Coins</span>
                    </div>
                  </div>
                </div>

                {/* Stat Comparison */}
                <div className="space-y-2.5 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Ability Bonus:</span>
                    <div className="flex items-center space-x-2 font-black">
                      <span className="text-slate-400 line-through">{currentStats.primaryLabel}</span>
                      <span className="text-emerald-400">{nextStats.primaryLabel}</span>
                    </div>
                  </div>

                  {/* STRICT 10 HEARTS INVARIANT */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Vitality Pool:</span>
                    <div className="flex items-center space-x-2 font-black">
                      <span className="text-emerald-400">10 Hearts (Standard Cap)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Attack Power:</span>
                    <div className="flex items-center space-x-2 font-black">
                      <span className="text-slate-400">{currentStats.attackRating}</span>
                      <span className="text-slate-600">➜</span>
                      <span className="text-emerald-400">{nextStats.attackRating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Defense Armor:</span>
                    <div className="flex items-center space-x-2 font-black">
                      <span className="text-slate-400">{currentStats.defenseRating}</span>
                      <span className="text-slate-600">➜</span>
                      <span className="text-emerald-400">{nextStats.defenseRating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">XP Resonance:</span>
                    <div className="flex items-center space-x-2 font-black">
                      <span className="text-slate-400">{currentStats.xpRating}</span>
                      <span className="text-slate-600">➜</span>
                      <span className="text-emerald-400">{nextStats.xpRating}</span>
                    </div>
                  </div>
                </div>

                {/* Upgrade Button */}
                <button
                  onClick={handleUpgradeClick}
                  disabled={!canAfford}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-xl cursor-pointer ${
                    canAfford
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-amber-500/25 active:scale-98'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  <span>
                    {canAfford
                      ? `Upgrade to Level ${nextLevel} (${upgradeCost} Coins)`
                      : `Need ${upgradeCost ? upgradeCost - geo : 0} More Coins to Upgrade`}
                  </span>
                </button>

                {!canAfford && (
                  <p className="text-[11px] text-amber-400/80 text-center flex items-center justify-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Answer test questions or clear course stages to earn more Geo!</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-950/30 via-slate-900 to-slate-900 border-2 border-amber-500/60 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-3xl">
                  ★
                </div>
                <h3 className="text-lg font-black text-amber-300 uppercase tracking-wider">
                  Level 10 Mastered!
                </h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  {inspectedClass.name} has achieved maximum sovereign power. Its passive ability is operating at pinnacle capacity!
                </p>
                <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black">
                  {currentStats.primaryLabel} — PINNACLE RANK
                </div>
              </div>
            )}

            {/* Persistent Save Indicator */}
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                All class upgrades, unlocks, and equipped heroes persist in your local browser profile.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
