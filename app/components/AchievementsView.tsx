'use client';
import React, { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Coins, 
  CheckCircle2, 
  Swords, 
  GraduationCap, 
  Flame, 
  Crown,
  Gift,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Achievement } from '../lib/rpgEngine';

interface AchievementsViewProps {
  achievements: Achievement[];
  onClaimAchievement: (achievementId: string, rewardXp: number, rewardGeo: number) => void;
}

export default function AchievementsView({
  achievements,
  onClaimAchievement
}: AchievementsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'combat' | 'learning' | 'progression' | 'streak'>('all');

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const handleClaim = (ach: Achievement) => {
    if (!ach.isUnlocked || ach.isClaimed) return;
    onClaimAchievement(ach.id, ach.rewardXp, ach.rewardGeo);
    try {
      confetti({ particleCount: 60, spread: 75, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const getCategoryMeta = (cat: Achievement['category']) => {
    switch (cat) {
      case 'combat':
        return { label: 'Combat Trial', icon: '⚔️', color: 'text-rose-400 bg-rose-500/20 border-rose-500/40' };
      case 'learning':
        return { label: 'Academic Mastery', icon: '📖', color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/40' };
      case 'progression':
        return { label: 'Hero Leveling', icon: '🌟', color: 'text-amber-400 bg-amber-500/20 border-amber-500/40' };
      case 'streak':
        return { label: 'Streak Dedication', icon: '🔥', color: 'text-orange-400 bg-orange-500/20 border-orange-500/40' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 font-mono animate-in fade-in duration-300">
      
      {/* 1. HERO COMPLETION BANNER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute -right-24 -top-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase flex items-center space-x-1.5 shadow-sm">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>HALL OF ACHIEVEMENTS</span>
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-bold">12 Milestones Catalog</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Trophies & Badges of Honor
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Earn badges by mastering diagnostics, defeating stage bosses, building combo streaks, and unlocking skills. Claim huge crates of XP and Geo for each conquest.
            </p>
          </div>

          {/* Progress Box */}
          <div className="flex flex-col items-center justify-center p-5 bg-slate-950/90 border-2 border-amber-500/40 rounded-2xl shrink-0 shadow-xl text-center min-w-[180px]">
            <span className="text-[10px] uppercase font-black text-amber-400 block">Total Completion</span>
            <span className="text-3xl sm:text-4xl font-black text-white mt-0.5">{completionPercentage}%</span>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800 my-2">
              <div 
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${completionPercentage}%` }} 
              />
            </div>
            <span className="text-xs text-slate-400 font-bold">{unlockedCount} of {totalCount} Badges Unlocked</span>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY TABS */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 cursor-pointer shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>🏆</span>
          <span>All ({totalCount})</span>
        </button>

        <button
          onClick={() => setSelectedCategory('combat')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 cursor-pointer shrink-0 ${
            selectedCategory === 'combat'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>⚔️</span>
          <span>Combat</span>
        </button>

        <button
          onClick={() => setSelectedCategory('learning')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 cursor-pointer shrink-0 ${
            selectedCategory === 'learning'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>📖</span>
          <span>Learning</span>
        </button>

        <button
          onClick={() => setSelectedCategory('progression')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 cursor-pointer shrink-0 ${
            selectedCategory === 'progression'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>🌟</span>
          <span>Progression</span>
        </button>

        <button
          onClick={() => setSelectedCategory('streak')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 cursor-pointer shrink-0 ${
            selectedCategory === 'streak'
              ? 'bg-orange-600 text-white shadow-md shadow-orange-600/25'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>🔥</span>
          <span>Streak</span>
        </button>
      </div>

      {/* 3. ACHIEVEMENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map(ach => {
          const categoryMeta = getCategoryMeta(ach.category);
          const pct = Math.min(100, Math.round((ach.current / ach.target) * 100));

          return (
            <div
              key={ach.id}
              className={`p-5 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between space-y-4 ${
                ach.isClaimed
                  ? 'bg-slate-950/70 border-slate-800/80 opacity-70'
                  : ach.isUnlocked
                    ? 'bg-slate-950 border-amber-500/70 shadow-xl shadow-amber-500/10'
                    : 'bg-slate-950/50 border-slate-900'
              }`}
            >
              {/* Header Info */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-md border ${
                    ach.isUnlocked ? 'bg-amber-500/20 border-amber-500/40' : 'bg-slate-900 border-slate-800'
                  }`}>
                    {ach.icon}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-black text-white">{ach.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase ${categoryMeta.color}`}>
                        {categoryMeta.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans leading-snug">
                      {ach.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0 text-xs">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    +{ach.rewardXp} XP
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    +{ach.rewardGeo} Geo
                  </span>
                </div>
              </div>

              {/* Progress Bar & Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Milestone Progress:</span>
                  <span className="font-bold text-white">
                    {Math.min(ach.current, ach.target)} / {ach.target}
                  </span>
                </div>

                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ach.isUnlocked ? 'bg-emerald-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="pt-2">
                  {ach.isClaimed ? (
                    <div className="text-center py-2 text-xs font-black text-emerald-400 flex items-center justify-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Conquest Claimed</span>
                    </div>
                  ) : ach.isUnlocked ? (
                    <button
                      onClick={() => handleClaim(ach)}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl uppercase tracking-wider shadow-lg shadow-amber-500/30 transition cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Claim Trophy (+{ach.rewardXp} XP, +{ach.rewardGeo} Geo)</span>
                    </button>
                  ) : (
                    <div className="text-center py-1 text-[11px] text-slate-500 font-sans">
                      In Progress ({pct}% complete)
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
