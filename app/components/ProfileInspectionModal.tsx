'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Scroll, 
  Heart, 
  Skull, 
  Zap, 
  ShieldAlert, 
  Target, 
  Award, 
  Flame, 
  Swords, 
  Sparkles, 
  HelpCircle,
  ShieldCheck,
  Coins
} from 'lucide-react';
import { BleachHeroConfig } from './CharactersView';

export interface BleachVillainConfig {
  id: string;
  name: string;
  title: string;
  rank: string;
  realm: string;
  stageName: string;
  maxHp: number;
  color: string;
  damagePerStrike: number; // in hearts (1, 2, or 3)
  difficultyLabel: 'Introductory' | 'Elementary' | 'Intermediate' | 'Advanced' | 'Supreme Boss';
  attackNameP1: string;
  attackNameP2: string;
  phase2Quote: string;
  phase2TransformationName: string;
  lore: string;
  conceptVulnerability: string;
  recommendedHeroCounter: string;
  aspectOfDeath: string;
  demigodFelledTitle: string;
  bgType: 'seireitei' | 'huecomundo' | 'wandenreich';
}

export type InspectedTarget = BleachHeroConfig | BleachVillainConfig;

export default function ProfileInspectionModal({
  isOpen,
  onClose,
  target
}: {
  isOpen: boolean;
  onClose: () => void;
  target: InspectedTarget | null;
}) {
  if (!isOpen || !target) return null;

  const isHero = 'zanpakuto' in target;
  const hero = isHero ? (target as BleachHeroConfig) : null;
  const villain = !isHero ? (target as BleachVillainConfig) : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-mono select-none"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-xl bg-slate-900 border-2 border-amber-500/80 rounded-2xl p-6 relative shadow-[0_0_60px_rgba(245,158,11,0.25)] text-left max-h-[90vh] overflow-y-auto space-y-4"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top Classification Header */}
          <div className="flex items-center space-x-2">
            <Scroll className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] uppercase tracking-widest text-amber-400 font-black">
              {isHero
                ? 'SEIREITEI ARCHIVE // ZANPAKUTO & SHINIGAMI DOSSIER'
                : 'HUECO MUNDO & WANDENREICH // ENEMY COMBAT INTEL'}
            </span>
          </div>

          {/* Title & Rank */}
          <div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                {target.name}
              </h2>
              {villain && (
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase border ${
                  villain.difficultyLabel === 'Introductory'
                    ? 'bg-slate-800 text-slate-300 border-slate-600'
                    : villain.difficultyLabel === 'Elementary'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : villain.difficultyLabel === 'Intermediate'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : villain.difficultyLabel === 'Advanced'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                }`}>
                  {villain.difficultyLabel} Tier
                </span>
              )}
              {hero && (
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {hero.enduranceTier}
                </span>
              )}
            </div>

            <p className="text-xs text-amber-400/90 font-bold mt-0.5">
              {hero ? hero.title : villain?.rank}
            </p>
            {villain && (
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-0.5">
                Realm: {villain.realm} // {villain.stageName}
              </span>
            )}
          </div>

          {/* Iconic Quote */}
          {'quote' in target && target.quote && (
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-amber-200 italic">
              {target.quote}
            </div>
          )}
          {villain?.phase2Quote && (
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-amber-200 italic">
              {villain.phase2Quote}
            </div>
          )}

          {/* Lore Narrative */}
          <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
            {target.lore}
          </div>

          {/* VILLAIN SPECIFIC STATS & TACTICAL VULNERABILITY */}
          {villain && (
            <div className="space-y-3">
              {/* Combat Specs Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 uppercase font-bold block">Boss Health</span>
                  <span className="text-base font-black text-rose-400 mt-0.5 block">
                    {villain.maxHp} HP
                  </span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 uppercase font-bold block">Damage Per Miss</span>
                  <span className="text-base font-black text-amber-400 mt-0.5 block">
                    {villain.damagePerStrike} {villain.damagePerStrike === 1 ? 'Heart' : 'Hearts'}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 uppercase font-bold block">Aspect of Death</span>
                  <span className="text-xs font-bold text-cyan-300 mt-1 block truncate">
                    {villain.aspectOfDeath}
                  </span>
                </div>
              </div>

              {/* Academic Concept Vulnerability */}
              <div className="p-3 bg-rose-950/30 border border-rose-500/40 rounded-xl space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-300 uppercase">
                  <Target className="w-3.5 h-3.5 text-rose-400" />
                  <span>Academic Concept Vulnerability:</span>
                </div>
                <p className="text-xs text-slate-200 font-medium">
                  {villain.conceptVulnerability}
                </p>
                <span className="text-[10px] text-slate-400 block pt-0.5">
                  Answering questions in this subtopic accurately triggers critical damage and bypasses boss barriers.
                </span>
              </div>

              {/* Recommended Hero Counter */}
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-300 uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Recommended Hero Counter:</span>
                </div>
                <p className="text-xs text-emerald-200 font-bold">
                  {villain.recommendedHeroCounter}
                </p>
              </div>

              {/* Boss Attack Arsenal */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider block">
                  Boss Arsenal & Phase Transformation:
                </span>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Phase 1 Strike:</span>
                  <span className="text-white font-bold">{villain.attackNameP1}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] border-t border-slate-800/80 pt-1">
                  <span className="text-slate-400">Phase 2 Ultimate:</span>
                  <span className="text-rose-400 font-bold">{villain.attackNameP2}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] border-t border-slate-800/80 pt-1">
                  <span className="text-slate-400">Resurrección / Bankai:</span>
                  <span className="text-amber-300 font-bold">{villain.phase2TransformationName}</span>
                </div>
              </div>
            </div>
          )}

          {/* HERO SPECIFIC STATS & ZANPAKUTO */}
          {hero && (
            <div className="space-y-3">
              {/* Zanpakuto Profile */}
              <div className="p-3.5 bg-amber-950/20 border border-amber-500/40 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-amber-300 uppercase">
                    Zanpakuto: {hero.zanpakuto}
                  </span>
                  <span className="text-[10px] text-cyan-300 italic">{hero.releaseCommand}</span>
                </div>
                <p className="text-xs text-slate-200">
                  <strong className="text-amber-400">Bankai:</strong> {hero.bankaiName}
                </p>
                <p className="text-xs text-slate-400">
                  <strong className="text-amber-400">Technique:</strong> {hero.techniqueDesc}
                </p>
              </div>

              {/* Endurance Passive */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Passive: {hero.passiveName}
                </span>
                <p className="text-xs text-slate-300">
                  {hero.passiveDesc}
                </p>
              </div>

              {/* Combat Ratings */}
              <div>
                <span className="text-[10px] uppercase font-black text-slate-400 block mb-1.5">
                  Soul Society Combat Ratings:
                </span>
                <div className="grid grid-cols-5 gap-1.5 text-[10px] text-center">
                  <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block">REIATSU</span>
                    <span className="text-purple-400 font-bold">{hero.attributes.reiatsu}</span>
                  </div>
                  <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block">ZANJUTSU</span>
                    <span className="text-rose-400 font-bold">{hero.attributes.zanjutsu}</span>
                  </div>
                  <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block">HAKUDA</span>
                    <span className="text-amber-400 font-bold">{hero.attributes.hakuda}</span>
                  </div>
                  <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block">HOHO</span>
                    <span className="text-cyan-400 font-bold">{hero.attributes.hoho}</span>
                  </div>
                  <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block">KIDO</span>
                    <span className="text-emerald-400 font-bold">{hero.attributes.kido}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Close Action */}
          <button
            onClick={onClose}
            className="w-full mt-4 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl uppercase transition cursor-pointer"
          >
            Close Intel Dossier
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
