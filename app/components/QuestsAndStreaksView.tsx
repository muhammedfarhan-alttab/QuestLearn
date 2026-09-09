'use client';
import React from 'react';
import { 
  Flame, 
  ShieldCheck, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Zap, 
  Trophy, 
  Calendar,
  Gift,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  DailyQuest, 
  DailyQuestsState, 
  DailyStreakState 
} from '../lib/rpgEngine';

interface QuestsAndStreaksViewProps {
  streakState: DailyStreakState;
  questsState: DailyQuestsState;
  geo: number;
  onClaimQuestReward: (questId: string, rewardXp: number, rewardGeo: number) => void;
  onBuyStreakShield: () => void;
  onClaimStreakMilestone: (milestoneDay: number, rewardXp: number, rewardGeo: number) => void;
}

export default function QuestsAndStreaksView({
  streakState,
  questsState,
  geo,
  onClaimQuestReward,
  onBuyStreakShield,
  onClaimStreakMilestone
}: QuestsAndStreaksViewProps) {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0

  const streakMilestones = [
    { days: 3, xp: 150, geo: 100, title: 'Flame Spark', icon: '🔥' },
    { days: 7, xp: 400, geo: 250, title: 'Inferno Week', icon: '⚡' },
    { days: 14, xp: 900, geo: 600, title: 'Blazing Fortnight', icon: '👑' },
    { days: 30, xp: 2500, geo: 1500, title: 'Demigod of Habit', icon: '🌟' }
  ];

  const handleClaim = (quest: DailyQuest) => {
    if (quest.claimed || quest.current < quest.target) return;
    onClaimQuestReward(quest.id, quest.rewardXp, quest.rewardGeo);
    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleClaimMilestone = (ms: typeof streakMilestones[0]) => {
    if (streakState.claimedMilestones.includes(ms.days) || streakState.streakDays < ms.days) return;
    onClaimStreakMilestone(ms.days, ms.xp, ms.geo);
    try {
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. HERO STREAK & FLAME BANNER */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-3xl">
                🔥
              </div>
              {streakState.streakShieldCount > 0 && (
                <div className="absolute -bottom-2 -right-2 bg-sky-600 text-white p-1 rounded-full border-2 border-slate-900" title="Streak Freeze Active">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-3xl sm:text-4xl font-black text-white">{streakState.streakDays}</span>
                <span className="text-lg font-black text-amber-400 uppercase tracking-wider">Day Streak</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md font-sans leading-relaxed">
                You've completed daily trials today! Keep the flame burning tomorrow to unlock high multiplier bonuses.
              </p>
            </div>
          </div>

          {/* Streak Shield Status & Buy Button */}
          <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            <div className="text-left">
              <div className="flex items-center space-x-1.5 text-xs text-indigo-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Streak Shield Protection:</span>
              </div>
              <span className="text-sm font-black text-white block mt-0.5">
                {streakState.streakShieldCount > 0 ? `${streakState.streakShieldCount} Active Shield` : 'No Shield Active'}
              </span>
            </div>

            <button
              onClick={onBuyStreakShield}
              disabled={geo < 100 || streakState.streakShieldCount >= 3}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer ${
                geo >= 100 && streakState.streakShieldCount < 3
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
              }`}
            >
              <span>Buy Freeze</span>
              <span className="text-amber-300">(100 Geo)</span>
            </button>
          </div>
        </div>

        {/* 7-Day Visual Calendar Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-2.5 flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Weekly Study Routine</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map((day, idx) => {
              const isPastOrToday = idx <= todayIndex;
              const isToday = idx === todayIndex;

              return (
                <div
                  key={day}
                  className={`p-3 rounded-2xl border text-center transition ${
                    isToday
                      ? 'bg-amber-500/20 border-amber-500/60 shadow-lg shadow-amber-500/10'
                      : isPastOrToday
                        ? 'bg-slate-950/80 border-slate-800 text-slate-300'
                        : 'bg-slate-950/40 border-slate-900 text-slate-600'
                  }`}
                >
                  <span className="text-[10px] font-bold block mb-1">{day}</span>
                  <div className="flex items-center justify-center">
                    {isPastOrToday ? (
                      <span className="text-lg">🔥</span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 block" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. STREAK MULTIPLIER GUIDE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              In-Combat Combo Streak Multipliers
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Scale XP & Coin Drops in Arena</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">1–2 Streak:</span>
              <span className="font-black text-slate-300">1.0x</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Base rewards</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-cyan-500/30">
            <div className="flex items-center justify-between">
              <span className="text-cyan-400 font-bold">3–4 Streak:</span>
              <span className="font-black text-cyan-300">1.25x</span>
            </div>
            <span className="text-[10px] text-cyan-500 mt-1 block">+25% Bonus XP & Geo</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-rose-500/30">
            <div className="flex items-center justify-between">
              <span className="text-rose-400 font-bold">5–7 Streak:</span>
              <span className="font-black text-rose-300">1.50x</span>
            </div>
            <span className="text-[10px] text-rose-500 mt-1 block">+50% Hyper Streak</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/40">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold">8+ Streak:</span>
              <span className="font-black text-amber-300">2.00x</span>
            </div>
            <span className="text-[10px] text-amber-500 mt-1 block">Ultra Combo! 2x All</span>
          </div>
        </div>
      </div>

      {/* 3. DAILY QUESTS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Daily Quests</span>
            </h2>
            <span className="text-xs text-slate-400 font-sans">
              Reset every 24 hours. Complete to earn fast XP & Coins.
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-indigo-300 bg-indigo-950/40 px-3 py-1.5 rounded-xl border border-indigo-500/30">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Cycle: {questsState.dateStr}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questsState.quests.map(quest => {
            const isCompleted = quest.current >= quest.target;
            const pct = Math.min(100, Math.round((quest.current / quest.target) * 100));

            return (
              <div
                key={quest.id}
                className={`p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between space-y-4 ${
                  quest.claimed
                    ? 'bg-slate-950/60 border-slate-900 opacity-60'
                    : isCompleted
                      ? 'bg-slate-950 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl p-2 bg-slate-900 rounded-xl border border-slate-800">
                      {quest.icon}
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-white">{quest.title}</h3>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">{quest.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      +{quest.rewardXp} XP
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      +{quest.rewardGeo} Geo
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Claim Button */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Progress:</span>
                    <span className="font-bold text-white">{quest.current} / {quest.target}</span>
                  </div>

                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="pt-2">
                    {quest.claimed ? (
                      <div className="text-center py-2 text-xs font-black text-emerald-400 flex items-center justify-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Reward Claimed</span>
                      </div>
                    ) : isCompleted ? (
                      <button
                        onClick={() => handleClaim(quest)}
                        className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition cursor-pointer flex items-center justify-center space-x-2"
                      >
                        <Gift className="w-4 h-4" />
                        <span>Claim Rewards (+{quest.rewardXp} XP, +{quest.rewardGeo} Geo)</span>
                      </button>
                    ) : (
                      <div className="text-center py-1.5 text-[11px] text-slate-500 font-sans">
                        Complete during battle trials
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. STREAK MILESTONE CRATES */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-white flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Streak Milestone Crates</span>
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Maintain your daily streak to open treasure crates loaded with XP and Coins.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {streakMilestones.map(ms => {
            const isReached = streakState.streakDays >= ms.days;
            const isClaimed = streakState.claimedMilestones.includes(ms.days);

            return (
              <div
                key={ms.days}
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between space-y-3 transition ${
                  isClaimed
                    ? 'bg-slate-950/60 border-slate-800 opacity-60'
                    : isReached
                      ? 'bg-slate-950 border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-950/40 border-slate-900 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{ms.icon}</span>
                    <span className="text-xs font-black text-amber-400">{ms.days} Days</span>
                  </div>
                  <h4 className="text-sm font-black text-white">{ms.title}</h4>
                  <div className="text-xs text-slate-400 mt-1 space-x-1">
                    <span className="text-indigo-300 font-bold">+{ms.xp} XP</span>
                    <span>•</span>
                    <span className="text-amber-300 font-bold">+{ms.geo} Geo</span>
                  </div>
                </div>

                <div>
                  {isClaimed ? (
                    <div className="text-center py-1.5 text-[10px] font-black text-emerald-400 uppercase">
                      Claimed
                    </div>
                  ) : isReached ? (
                    <button
                      onClick={() => handleClaimMilestone(ms)}
                      className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-xl uppercase tracking-wider shadow-md transition cursor-pointer"
                    >
                      Open Crate
                    </button>
                  ) : (
                    <div className="text-center py-1.5 text-[10px] text-slate-500">
                      {ms.days - streakState.streakDays} days away
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
