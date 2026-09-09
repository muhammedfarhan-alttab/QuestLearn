'use client';
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Flame, 
  Swords, 
  Skull, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  Compass, 
  Trophy, 
  Layers, 
  Zap, 
  ShieldCheck, 
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { CourseData, ACADEMIC_COURSES } from './CoursesView';
import { GenerateRoadmapResponse } from '../api/generate-roadmap/types';
import { 
  getStoredDiagnosticSummary, 
  getSkillLevelMeta, 
  SkillLevel,
  DiagnosticSummary 
} from '../lib/diagnosticEngine';

interface AiAnalysisViewProps {
  course?: CourseData;
  analysis?: GenerateRoadmapResponse | null;
  isLoading?: boolean;
  overallScore?: number;
  onContinueToWorldMap: () => void;
  onRetakeDiagnostic: () => void;
  onSwitchCourse: () => void;
  aiModelUsed?: string;
}

export default function AiAnalysisView({
  course = ACADEMIC_COURSES[0],
  analysis,
  isLoading = false,
  overallScore = 75,
  onContinueToWorldMap,
  onRetakeDiagnostic,
  onSwitchCourse,
  aiModelUsed = 'Google Gemini 2.5 Flash'
}: AiAnalysisViewProps) {
  const [storedDiag, setStoredDiag] = useState<DiagnosticSummary | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const summary = getStoredDiagnosticSummary(course.id);
      setStoredDiag(summary);
    }
  }, [course.id]);

  // Loading status cycling message
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingSteps = [
    'Transmitting diagnostic answers and Bayesian mastery to Google Gemini...',
    'Synthesizing cognitive gaps & knowledge strengths with AI...',
    'Constructing optimal sequential study order...',
    'Calibrating course difficulty & generating custom Boss Gauntlet...'
  ];

  useEffect(() => {
    if (!isLoading) return;
    const timer = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % loadingSteps.length);
    }, 1800);
    return () => clearInterval(timer);
  }, [isLoading, loadingSteps.length]);

  const skillLevel: SkillLevel = storedDiag?.skillLevel || (overallScore <= 30 ? 'Beginner' : overallScore <= 70 ? 'Intermediate' : 'Advanced');
  const skillMeta = getSkillLevelMeta(skillLevel);

  // Robust fallback values if analysis is not yet populated
  const safeData: GenerateRoadmapResponse = analysis || {
    strengths: ['Algebra', 'Trigonometry'],
    weaknesses: ['Calculus', 'Coordinate Geometry'],
    strongTopics: ['Algebra', 'Trigonometry'],
    weakTopics: ['Calculus', 'Coordinate Geometry'],
    recommendedOrder: ['Functions', 'Limits', 'Differentiation', 'Applications'],
    estimatedStudyHours: 18,
    difficulty: 'Medium',
    bossBattles: ['Calculus Conqueror', 'Derivative Demon']
  };

  const strengthsList = (safeData.strengths && safeData.strengths.length > 0)
    ? safeData.strengths
    : (safeData.strongTopics || ['Foundational Vector Kinematics']);

  const weaknessesList = (safeData.weaknesses && safeData.weaknesses.length > 0)
    ? safeData.weaknesses
    : (safeData.weakTopics || ['Complex Concept Synthesis']);

  const recommendedOrderList = (safeData.recommendedOrder && safeData.recommendedOrder.length > 0)
    ? safeData.recommendedOrder
    : ['Foundations', 'Core Application', 'Remediation Synthesis', 'Apex Mastery'];

  const bossBattlesList = (safeData.bossBattles && safeData.bossBattles.length > 0)
    ? safeData.bossBattles
    : ['Calculus Conqueror', 'Derivative Demon'];

  const difficultyStr = safeData.difficulty || 'Medium';
  const estimatedHours = safeData.estimatedStudyHours || 18;

  // Determine difficulty meter fill (1-3)
  const diffLower = difficultyStr.toLowerCase();
  const difficultyLevel = diffLower.includes('easy') || diffLower.includes('foundational') || diffLower.includes('beginner')
    ? 1
    : diffLower.includes('hard') || diffLower.includes('advanced') || diffLower.includes('apex')
      ? 3
      : 2;

  // -------------------------------------------------------------
  // 1. ANIMATED AI LOADING SCREEN
  // -------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center animate-in fade-in duration-300">
        <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Background Ambient Glows */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Central AI Scanner */}
          <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-sky-500/40 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <BrainCircuit className="w-8 h-8 text-sky-400" />
            </div>
          </div>

          {/* Top Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-medium mb-3">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>QuestLearn AI & Google Gemini</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Synthesizing Your AI Roadmap
          </h2>

          <p className="text-sm text-slate-300 max-w-lg mx-auto mt-2">
            Evaluating performance for <span className="text-amber-400 font-semibold">{course.title}</span>.
          </p>

          {/* Dynamic Cycling Progress Status */}
          <div className="my-6 py-2.5 px-4 bg-slate-950/80 border border-slate-800 rounded-xl max-w-md mx-auto flex items-center justify-center space-x-2 text-xs text-sky-200">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="transition-all duration-300">{loadingSteps[loadingStep]}</span>
          </div>

          {/* Placeholder Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto opacity-30 pointer-events-none mt-6">
            <div className="h-20 rounded-xl bg-slate-800/60 border border-slate-700" />
            <div className="h-20 rounded-xl bg-slate-800/60 border border-slate-700" />
            <div className="h-20 rounded-xl bg-slate-800/60 border border-slate-700" />
            <div className="h-20 rounded-xl bg-slate-800/60 border border-slate-700" />
            <div className="h-20 rounded-xl bg-slate-800/60 border border-slate-700" />
            <div className="h-20 rounded-xl bg-slate-800/60 border border-slate-700" />
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. MAIN AI ANALYSIS VIEW (CARDS DISPLAY)
  // -------------------------------------------------------------
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER BANNER */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute -right-24 -top-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase flex items-center space-x-1.5 shadow-sm">
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI ANALYSIS REPORT</span>
              </span>

              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase flex items-center space-x-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Engine: {aiModelUsed}</span>
              </span>

              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-amber-400 font-bold">{course.title}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Personalized Learning Roadmap
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Based on your diagnostic answers, Google Gemini has analyzed your cognitive strengths and weaknesses to synthesize an optimal study order and tailored boss gauntlet.
            </p>
          </div>

          {/* Skill Level & Diagnostic Score Badge */}
          <div className="flex flex-col sm:flex-row md:flex-col items-center justify-between md:justify-center p-4 bg-slate-950/90 border border-slate-800 rounded-2xl shrink-0 shadow-lg text-center gap-3">
            <div className="w-full">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Calibrated Skill Tier</span>
              <div className="flex items-center justify-center space-x-1.5 mt-1">
                <span className="text-xl">{skillMeta.icon}</span>
                <span className={`text-xl font-black ${skillMeta.textColor}`}>{skillLevel}</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">{skillMeta.tagline}</span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 w-full flex items-center justify-between md:justify-center md:space-x-4">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Score</span>
                <span className="text-2xl font-black text-amber-400">{overallScore}%</span>
              </div>
              {storedDiag?.difficultyStats && (
                <div className="flex items-center space-x-2 text-[10px] bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                  <span className="text-emerald-400 font-bold" title="Easy questions correct">E:{storedDiag.difficultyStats.easy.correct}/2</span>
                  <span className="text-cyan-400 font-bold" title="Medium questions correct">M:{storedDiag.difficultyStats.medium.correct}/4</span>
                  <span className="text-rose-400 font-bold" title="Hard questions correct">H:{storedDiag.difficultyStats.hard.correct}/4</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center space-x-1 text-[10px] font-bold text-emerald-400 w-full">
              <CheckCircle2 className="w-3 h-3" />
              <span>Diagnostic Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 AI RESPONSE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* 1. STRENGTHS CARD */}
        <div className="bg-gradient-to-b from-emerald-950/40 via-slate-900/90 to-slate-900/90 border-2 border-emerald-500/40 rounded-2xl p-6 shadow-xl shadow-emerald-950/20 relative flex flex-col justify-between group hover:border-emerald-400 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <Trophy className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-wide">Strengths</h3>
                  <span className="text-[10px] text-emerald-400 font-bold">Mastered Concepts</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {strengthsList.length} Topics
              </span>
            </div>

            <div className="space-y-2.5">
              {strengthsList.map((strength, idx) => (
                <div 
                  key={idx}
                  className="flex items-start space-x-2.5 bg-slate-950/60 border border-emerald-500/30 p-3 rounded-xl hover:bg-emerald-950/30 transition text-xs text-emerald-100"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-bold leading-snug">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[11px] text-slate-400 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>High accuracy verified in diagnostic assessment.</span>
          </div>
        </div>

        {/* 2. WEAKNESSES CARD */}
        <div className="bg-gradient-to-b from-rose-950/40 via-slate-900/90 to-slate-900/90 border-2 border-rose-500/40 rounded-2xl p-6 shadow-xl shadow-rose-950/20 relative flex flex-col justify-between group hover:border-rose-400 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shadow-md shadow-rose-500/20">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-wide">Weaknesses</h3>
                  <span className="text-[10px] text-rose-400 font-bold">Remediation Focus</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {weaknessesList.length} Areas
              </span>
            </div>

            <div className="space-y-2.5">
              {weaknessesList.map((weakness, idx) => (
                <div 
                  key={idx}
                  className="flex items-start space-x-2.5 bg-slate-950/60 border border-rose-500/30 p-3 rounded-xl hover:bg-rose-950/30 transition text-xs text-rose-100"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="font-bold leading-snug">{weakness}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-500/20 text-[11px] text-slate-400 flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Targeted for priority remediation on the campaign map.</span>
          </div>
        </div>

        {/* 3. RECOMMENDED STUDY ORDER CARD */}
        <div className="bg-gradient-to-b from-indigo-950/40 via-slate-900/90 to-slate-900/90 border-2 border-indigo-500/40 rounded-2xl p-6 shadow-xl shadow-indigo-950/20 relative flex flex-col justify-between group hover:border-indigo-400 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shadow-md shadow-indigo-500/20">
                  <Compass className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-wide">Recommended Order</h3>
                  <span className="text-[10px] text-indigo-400 font-bold">Sequential Learning Path</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Step-by-Step
              </span>
            </div>

            <div className="space-y-2.5">
              {recommendedOrderList.map((step, idx) => (
                <div 
                  key={idx}
                  className="flex items-center space-x-3 bg-slate-950/60 border border-indigo-500/30 p-2.5 rounded-xl hover:bg-indigo-950/30 transition text-xs"
                >
                  <div className="w-6 h-6 rounded-lg bg-indigo-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                    {idx + 1}
                  </div>
                  <span className="font-bold text-slate-200 leading-snug flex-1">{step}</span>
                  {idx < recommendedOrderList.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-400/60 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-indigo-500/20 text-[11px] text-slate-400 flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Sequenced to build prerequisites before advanced topics.</span>
          </div>
        </div>

        {/* 4. ESTIMATED STUDY HOURS CARD */}
        <div className="bg-gradient-to-b from-cyan-950/40 via-slate-900/90 to-slate-900/90 border-2 border-cyan-500/40 rounded-2xl p-6 shadow-xl shadow-cyan-950/20 relative flex flex-col justify-between group hover:border-cyan-400 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shadow-md shadow-cyan-500/20">
                  <Clock className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-wide">Estimated Hours</h3>
                  <span className="text-[10px] text-cyan-400 font-bold">Pacing & Workload</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                AI Calculated
              </span>
            </div>

            <div className="bg-slate-950/60 border border-cyan-500/30 rounded-2xl p-6 text-center my-2">
              <div className="flex items-baseline justify-center space-x-2">
                <span className="text-5xl font-black text-cyan-300 tracking-tight">{estimatedHours}</span>
                <span className="text-base font-bold text-cyan-400 uppercase">Hours</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Estimated study investment required to clear all stage tests and master the course exam.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cyan-500/20 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Daily recommendation:</span>
            <span className="text-cyan-300 font-bold">~45 mins / day</span>
          </div>
        </div>

        {/* 5. DIFFICULTY LEVEL CARD */}
        <div className="bg-gradient-to-b from-amber-950/40 via-slate-900/90 to-slate-900/90 border-2 border-amber-500/40 rounded-2xl p-6 shadow-xl shadow-amber-950/20 relative flex flex-col justify-between group hover:border-amber-400 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-md shadow-amber-500/20">
                  <Flame className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-wide">Difficulty</h3>
                  <span className="text-[10px] text-amber-400 font-bold">Cognitive Tier</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Calibrated
              </span>
            </div>

            <div className="bg-slate-950/60 border border-amber-500/30 rounded-2xl p-6 text-center my-2 space-y-3">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-lg uppercase tracking-wider">
                <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>{difficultyStr}</span>
              </div>

              {/* Visual Difficulty Gauge */}
              <div className="flex items-center justify-center space-x-2 pt-2">
                <div className={`h-2.5 w-16 rounded-full transition-all ${difficultyLevel >= 1 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                <div className={`h-2.5 w-16 rounded-full transition-all ${difficultyLevel >= 2 ? 'bg-amber-500' : 'bg-slate-800'}`} />
                <div className={`h-2.5 w-16 rounded-full transition-all ${difficultyLevel >= 3 ? 'bg-rose-500' : 'bg-slate-800'}`} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 px-6 font-mono">
                <span>Beginner</span>
                <span>Medium</span>
                <span>Advanced</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-500/20 text-[11px] text-slate-400 flex items-center space-x-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Adaptive combat encounters dynamically adjust to this tier.</span>
          </div>
        </div>

        {/* 6. BOSS BATTLES CARD */}
        <div className="bg-gradient-to-b from-red-950/40 via-slate-900/90 to-slate-900/90 border-2 border-red-500/40 rounded-2xl p-6 shadow-xl shadow-red-950/20 relative flex flex-col justify-between group hover:border-red-400 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between border-b border-red-500/20 pb-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shadow-md shadow-red-500/20">
                  <Swords className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-wide">Boss Battles</h3>
                  <span className="text-[10px] text-red-400 font-bold">Recommended Gauntlet</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-500/20 text-red-300 border border-red-500/30">
                Combat Ready
              </span>
            </div>

            <div className="space-y-2.5">
              {bossBattlesList.map((boss, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between bg-slate-950/60 border border-red-500/30 p-3 rounded-xl hover:bg-red-950/30 transition text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <Skull className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="font-black text-red-100">{boss}</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 uppercase font-black">
                    Arena Boss
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-red-500/20 text-[11px] text-slate-400 flex items-center space-x-1.5">
            <Skull className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>Defeat these bosses in the arena to unlock mastery badges.</span>
          </div>
        </div>

      </div>

      {/* ACTION CONTROLS / NAVIGATION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="text-xs text-slate-400 text-center sm:text-left">
          Ready to begin? Enter your personalized campaign world map to tackle stage tests and boss encounters.
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <button
            onClick={onRetakeDiagnostic}
            className="px-4 py-3 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold rounded-xl transition flex items-center space-x-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Retake Diagnostic</span>
          </button>

          <button
            onClick={onSwitchCourse}
            className="px-4 py-3 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold rounded-xl transition flex items-center space-x-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Course Catalog</span>
          </button>

          <button
            onClick={onContinueToWorldMap}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black rounded-xl transition flex items-center space-x-2 shadow-lg shadow-amber-500/30 uppercase tracking-wider cursor-pointer"
          >
            <span>Continue to World Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
