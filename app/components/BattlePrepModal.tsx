'use client';
import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  Swords, 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  Target,
  Heart
} from 'lucide-react';
import { WorldStageNode } from './WorldMapView';

interface BattlePrepModalProps {
  isOpen: boolean;
  stage: WorldStageNode | null;
  courseTitle?: string;
  attempt?: number;
  strengths?: string[];
  weaknesses?: string[];
  extraHearts?: number;
}

export default function BattlePrepModal({
  isOpen,
  stage,
  courseTitle = 'Course',
  attempt = 1,
  strengths = [],
  weaknesses = [],
  extraHearts = 0
}: BattlePrepModalProps) {
  const [stepIdx, setStepIdx] = useState(0);

  const prepSteps = [
    'Transmitting topic parameters & mastery profile to Google Gemini...',
    `Synthesizing 10 dynamic MCQs for Attempt #${attempt} with varied real-world scenarios...`,
    'Calibrating question difficulty to your diagnostic strengths & weaknesses...',
    'Synchronizing Zanpakuto damage scaling & arena encounter...'
  ];

  useEffect(() => {
    if (!isOpen) {
      setStepIdx(0);
      return;
    }
    const timer = setInterval(() => {
      setStepIdx(prev => (prev + 1) % prepSteps.length);
    }, 1400);
    return () => clearInterval(timer);
  }, [isOpen, prepSteps.length]);

  if (!isOpen || !stage) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_80px_rgba(99,102,241,0.25)] relative overflow-hidden text-center">
        {/* Ambient Glows */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Central Pulsing Animated AI Core */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping opacity-70" />
          <div className="absolute inset-1 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 opacity-30 animate-spin" style={{ animationDuration: '5s' }} />
          <div className="relative w-16 h-16 rounded-2xl bg-slate-950 border-2 border-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/40">
            <BrainCircuit className="w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
          <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1 animate-bounce" />
        </div>

        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>GEMINI DYNAMIC GENERATOR</span>
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
            Attempt #{attempt}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Preparing Stage {stage.stageNumber} Test
        </h3>
        <p className="text-xs text-amber-400 font-bold mt-1">
          {stage.name}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {stage.conceptFocus} • {courseTitle}
        </p>

        {/* Profile Context Tags */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 my-5 text-left text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-2">
            <span className="flex items-center space-x-1 text-slate-300">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Battery:</span>
            </span>
            <span className="text-white font-bold">10 Unique MCQs</span>
          </div>

          {strengths.length > 0 && (
            <div className="flex items-start space-x-1.5 text-[10px] text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Reinforcing Strengths: {strengths.slice(0, 2).join(', ')}</span>
            </div>
          )}

          {weaknesses.length > 0 && (
            <div className="flex items-start space-x-1.5 text-[10px] text-rose-300">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <span>Targeting Weaknesses: {weaknesses.slice(0, 2).join(', ')}</span>
            </div>
          )}

          {extraHearts > 0 && (
            <div className="flex items-center justify-between text-[11px] text-rose-300 border-t border-slate-800/80 pt-2 font-bold">
              <span className="flex items-center space-x-1">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500" />
                <span>Course Soul Wards:</span>
              </span>
              <span className="text-rose-400">{'💖'.repeat(extraHearts)} ({extraHearts} Penalty Absorptions)</span>
            </div>
          )}
        </div>

        {/* Cycling Status Step */}
        <div className="py-2.5 px-4 bg-indigo-950/30 border border-indigo-500/30 rounded-xl flex items-center justify-center space-x-2 text-xs text-indigo-200">
          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
          <span className="transition-all duration-200">{prepSteps[stepIdx]}</span>
        </div>

        {/* Animated Loading Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-4">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 h-full rounded-full animate-pulse" style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  );
}
