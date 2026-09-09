'use client';
import React, { useEffect } from 'react';
import { Sparkles, Trophy, ArrowRight, ShieldCheck, Coins, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LevelUpModalProps {
  isOpen: boolean;
  newLevel: number;
  onClose: () => void;
  onGoToSkillTree: () => void;
}

export default function LevelUpModal({
  isOpen,
  newLevel,
  onClose,
  onGoToSkillTree
}: LevelUpModalProps) {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (e) {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300 font-mono">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-950 to-[#030712] border-2 border-amber-500/80 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.25)] text-center space-y-6 overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Level Emblem */}
        <div className="relative mx-auto w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-300 p-1 shadow-2xl shadow-amber-500/40 animate-bounce">
          <div className="w-full h-full rounded-2xl bg-slate-950 flex flex-col items-center justify-center">
            <span className="text-[10px] font-black uppercase text-amber-400">Level</span>
            <span className="text-4xl font-black text-white">{newLevel}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>PLAYER LEVEL UP!</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ascension Achieved!
          </h2>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Your mastery across academic battle trials has elevated your hero rank.
          </p>
        </div>

        {/* Level Up Rewards */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-left text-xs">
          <span className="text-[10px] font-black text-slate-400 uppercase block border-b border-slate-800 pb-1.5">
            Level-Up Rewards Granted:
          </span>

          <div className="flex items-center space-x-2.5 text-indigo-300 font-bold">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>+1 Skill Point (Invest in Skill Tree)</span>
          </div>

          <div className="flex items-center space-x-2.5 text-emerald-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Full Player HP Restored to 100%</span>
          </div>

          <div className="flex items-center space-x-2.5 text-amber-300 font-bold">
            <Coins className="w-4 h-4 text-amber-400 shrink-0" />
            <span>+50 Bonus Geo Awarded</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onGoToSkillTree}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl uppercase tracking-wider shadow-lg shadow-amber-500/30 transition cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Open Skill Tree & Spend Point</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Continue Adventure
          </button>
        </div>

      </div>
    </div>
  );
}
