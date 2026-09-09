'use client';
import React, { useState } from 'react';
import { 
  Swords, 
  Brain, 
  Shield, 
  Coins, 
  Sparkles, 
  Check, 
  Lock, 
  ArrowRight, 
  Zap, 
  Flame, 
  Crown,
  Info,
  ChevronRight,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  SKILL_TREE_NODES, 
  SkillNode, 
  SkillTreePath, 
  canUnlockSkillNode, 
  getActiveSkillBuffs,
  ActiveSkillBuffs
} from '../lib/rpgEngine';

interface SkillTreeViewProps {
  unlockedNodeIds: string[];
  skillPointsAvailable: number;
  onUnlockNode: (nodeId: string, cost: number) => void;
  playerLevel: number;
}

export default function SkillTreeView({
  unlockedNodeIds,
  skillPointsAvailable,
  onUnlockNode,
  playerLevel
}: SkillTreeViewProps) {
  const [activePathFilter, setActivePathFilter] = useState<SkillTreePath | 'all'>('all');
  const [inspectedNode, setInspectedNode] = useState<SkillNode | null>(null);

  const activeBuffs: ActiveSkillBuffs = getActiveSkillBuffs(unlockedNodeIds);

  const paths: Array<{
    id: SkillTreePath;
    name: string;
    tagline: string;
    icon: string;
    badgeBg: string;
    borderAccent: string;
    glowAccent: string;
    gradient: string;
  }> = [
    {
      id: 'might',
      name: 'Path of Might',
      tagline: 'Boss Destruction & Critical Strikes',
      icon: '⚔️',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      borderAccent: 'border-rose-500/40 hover:border-rose-400',
      glowAccent: 'shadow-rose-950/20',
      gradient: 'from-rose-500/20 via-slate-900 to-slate-950'
    },
    {
      id: 'arcana',
      name: 'Path of Arcana',
      tagline: 'XP Acceleration & Mind Mastery',
      icon: '🔮',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      borderAccent: 'border-indigo-500/40 hover:border-indigo-400',
      glowAccent: 'shadow-indigo-950/20',
      gradient: 'from-indigo-500/20 via-slate-900 to-slate-950'
    },
    {
      id: 'resilience',
      name: 'Path of Resilience',
      tagline: 'HP Expansion & Damage Shielding',
      icon: '🛡️',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      borderAccent: 'border-emerald-500/40 hover:border-emerald-400',
      glowAccent: 'shadow-emerald-950/20',
      gradient: 'from-emerald-500/20 via-slate-900 to-slate-950'
    },
    {
      id: 'fortune',
      name: 'Path of Fortune',
      tagline: 'Geo Multipliers & Discount Economy',
      icon: '🪙',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      borderAccent: 'border-amber-500/40 hover:border-amber-400',
      glowAccent: 'shadow-amber-950/20',
      gradient: 'from-amber-500/20 via-slate-900 to-slate-950'
    }
  ];

  const handleUnlock = (node: SkillNode) => {
    const { canUnlock } = canUnlockSkillNode(node.id, unlockedNodeIds, skillPointsAvailable);
    if (!canUnlock) return;

    onUnlockNode(node.id, node.cost);
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const filteredPaths = activePathFilter === 'all' 
    ? paths 
    : paths.filter(p => p.id === activePathFilter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 font-mono animate-in fade-in duration-300">
      
      {/* 1. HERO HEADER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute -right-24 -top-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase flex items-center space-x-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>RPG SKILL TREE SYSTEM</span>
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-amber-400 font-bold">Player Level {playerLevel}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Specialization Skill Trees
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Earn Skill Points every time you level up from XP. Invest in 4 specialization paths to permanently boost boss damage, XP gains, defense, and coin drops.
            </p>
          </div>

          {/* Skill Points Wallet Box */}
          <div className="flex items-center justify-between md:justify-center p-4 sm:p-5 bg-slate-950/90 border-2 border-indigo-500/40 rounded-2xl shrink-0 shadow-xl text-center gap-4">
            <div className="text-left md:text-center">
              <span className="text-[10px] uppercase font-black text-indigo-300 block">Available Skill Points</span>
              <div className="flex items-center space-x-2 mt-0.5 justify-start md:justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                <span className="text-3xl sm:text-4xl font-black text-white">{skillPointsAvailable}</span>
                <span className="text-xs text-slate-400 font-bold">SP</span>
              </div>
            </div>
            <div className="hidden sm:block border-l border-slate-800 pl-4 text-right md:text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Unlocked</span>
              <span className="text-xl font-black text-emerald-400">{unlockedNodeIds.length} / 16</span>
            </div>
          </div>
        </div>

        {/* Active Buffs Telemetry Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2">
            <Swords className="w-4 h-4 text-rose-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-500 block font-bold">Boss Damage:</span>
              <span className="text-rose-300 font-black">+{Math.round(activeBuffs.bossDamageBonusPct * 100)}%</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2">
            <Brain className="w-4 h-4 text-indigo-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-500 block font-bold">Bonus XP:</span>
              <span className="text-indigo-300 font-black">+{Math.round(activeBuffs.xpBonusPct * 100)}%</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-500 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-500 block font-bold">Max Hearts Bonus:</span>
              <span className="text-rose-300 font-black">+{activeBuffs.maxHpBonus > 0 ? Math.round(activeBuffs.maxHpBonus / 10) : 0} Hearts</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2">
            <Coins className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-500 block font-bold">Geo Drop:</span>
              <span className="text-amber-300 font-black">+{Math.round(activeBuffs.geoBonusPct * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PATH FILTER TABS */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActivePathFilter('all')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-2 cursor-pointer shrink-0 ${
            activePathFilter === 'all'
              ? 'bg-slate-100 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>🌟</span>
          <span>All 4 Paths</span>
        </button>

        {paths.map(p => (
          <button
            key={p.id}
            onClick={() => setActivePathFilter(p.id)}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-2 cursor-pointer shrink-0 ${
              activePathFilter === p.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>{p.icon}</span>
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      {/* 3. SKILL TREES DISPLAY */}
      <div className="space-y-8">
        {filteredPaths.map(pathConfig => {
          const pathNodes = SKILL_TREE_NODES.filter(n => n.path === pathConfig.id).sort((a, b) => a.tier - b.tier);

          return (
            <div 
              key={pathConfig.id}
              className={`bg-slate-900/80 border-2 ${pathConfig.borderAccent} rounded-3xl p-6 shadow-xl space-y-6 relative overflow-hidden`}
            >
              {/* Path Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xl shadow-md">
                    {pathConfig.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">{pathConfig.name}</h2>
                    <span className="text-xs text-slate-400">{pathConfig.tagline}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border uppercase self-start sm:self-auto ${pathConfig.badgeBg}`}>
                  {pathNodes.filter(n => unlockedNodeIds.includes(n.id)).length} / 4 Unlocked
                </span>
              </div>

              {/* 4 Tier Nodes in Sequential Tree Flow */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {pathNodes.map((node, index) => {
                  const isUnlocked = unlockedNodeIds.includes(node.id);
                  const { canUnlock, reason } = canUnlockSkillNode(node.id, unlockedNodeIds, skillPointsAvailable);

                  let cardStyle = 'bg-slate-950/80 border-slate-800/80 text-slate-400 opacity-60';
                  if (isUnlocked) {
                    cardStyle = 'bg-slate-950 border-emerald-500/50 text-slate-200 shadow-lg shadow-emerald-500/10 opacity-100';
                  } else if (canUnlock) {
                    cardStyle = 'bg-slate-950 border-indigo-500/60 text-slate-200 hover:border-indigo-400 shadow-lg shadow-indigo-500/10 opacity-100';
                  }

                  return (
                    <div
                      key={node.id}
                      className={`p-4 rounded-2xl border-2 flex flex-col justify-between space-y-3 transition-all duration-300 relative group ${cardStyle}`}
                    >
                      {/* Top status bar */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{node.icon}</span>
                          <span className="text-[10px] font-black uppercase text-slate-500">
                            Tier {node.tier}
                          </span>
                        </div>

                        {isUnlocked ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Active</span>
                          </span>
                        ) : canUnlock ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 animate-pulse">
                            Ready ({node.cost} SP)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-slate-900 text-slate-500 border border-slate-800 flex items-center space-x-1">
                            <Lock className="w-2.5 h-2.5" />
                            <span>{node.cost} SP</span>
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-black text-white">{node.name}</h3>
                        <span className="text-[11px] font-bold text-amber-400 block">{node.tagline}</span>
                        <p className="text-[10px] text-slate-400 font-sans leading-relaxed pt-1">
                          {node.description}
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="pt-2 border-t border-slate-800/80">
                        {isUnlocked ? (
                          <div className="text-center py-1 text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                            Perk Unlocked
                          </div>
                        ) : canUnlock ? (
                          <button
                            onClick={() => handleUnlock(node)}
                            className="w-full py-2 bg-gradient-to-r from-indigo-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-md transition cursor-pointer flex items-center justify-center space-x-1"
                          >
                            <span>Unlock</span>
                            <span className="text-[10px] text-amber-200">({node.cost} SP)</span>
                          </button>
                        ) : (
                          <div className="text-center py-1 text-[10px] text-slate-500 truncate" title={reason}>
                            {reason || 'Locked'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
