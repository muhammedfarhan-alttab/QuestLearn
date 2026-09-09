'use client';
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Lock, 
  Unlock, 
  Star, 
  Skull, 
  Crown, 
  Swords, 
  ArrowRight, 
  Shield, 
  Zap, 
  Flame, 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  Play,
  RotateCcw,
  BookOpen,
  ChevronLeft,
  BrainCircuit,
  FlaskConical,
  Heart,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getCourseStarHeartsSummary,
  forgeCourseHeart,
  refundCourseHeart,
  CourseStarHeartsSummary
} from '../lib/courseHeartsEngine';
import { CourseData, ACADEMIC_COURSES } from './CoursesView';
import LectureNotesModal from './LectureNotesModal';
import InteractiveLabModal from './InteractiveLabModal';
import { BleachVillainConfig } from './ProfileInspectionModal';
import { getStageBoss } from '../data/bossesData';
import { WorldStageNode, calculateSkillLevel, getSkillLevelMeta, SkillLevel } from '../lib/diagnosticEngine';

export type { WorldStageNode };

export const DEFAULT_MAP_STAGES: WorldStageNode[] = [
  {
    id: 1,
    stageNumber: 1,
    name: 'Displacement & Vector Trajectories',
    conceptFocus: 'Foundational Vectors & Displacement',
    realmLocation: 'Urahara Underground Training Grounds',
    kanji: '地下修練場',
    lore: 'Deep beneath the Urahara candy shop, fractured bedrock serves as the proving ground for raw kinetic motion and directional displacement.',
    themeColor: '#f97316',
    status: 'unlocked',
    masteryPct: 80,
    stars: 0,
    isBoss: false,
    bossName: 'Grand Fisher (Cursed Hollow)',
    bossId: 'grand_fisher',
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
    masteryPct: 55,
    stars: 0,
    isBoss: false,
    bossName: 'Renji Abarai (Roar Zabimaru)',
    bossId: 'renji_boss',
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
    masteryPct: 40,
    stars: 0,
    isBoss: false,
    bossName: 'Grimmjow Jaegerjaquez (Pantera)',
    bossId: 'grimmjow',
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
    masteryPct: 25,
    stars: 0,
    isBoss: false,
    bossName: 'Ulquiorra Cifer (Segunda Etapa)',
    bossId: 'ulquiorra',
    tier: 'intermediate'
  },
  {
    id: 5,
    stageNumber: 5,
    name: 'Grand Apex Demigod Battle',
    conceptFocus: 'Comprehensive Multi-Concept Synthesis',
    realmLocation: 'Sokyoku Execution Hill // Throne of the Phoenix',
    kanji: '双殛の丘',
    lore: 'The summit of Soul Society where torque, angular momentum, and razor execution blades face the supreme test boss!',
    themeColor: '#eab308',
    status: 'locked',
    masteryPct: 15,
    stars: 0,
    isBoss: true,
    bossName: 'Genryūsai Yamamoto (Zanka no Tachi)',
    bossId: 'yamamoto_boss',
    tier: 'hard'
  }
];

export default function WorldMapView({
  course = ACADEMIC_COURSES[0],
  isUnlocked = false,
  stages = DEFAULT_MAP_STAGES,
  diagnosedGaps = [],
  onLaunchStageTest,
  onRetakeDiagnostic,
  onSwitchCourse,
  onClaimGeo,
  onInspectBoss,
  aiModelUsed,
  aiRoadmapMeta,
  skillLevel,
  scorePercentage,
  onViewAiAnalysis,
  onOpenInteractiveNotes,
  onOpenLab,
  onRewardXp,
  onRewardGeo
}: {
  course?: CourseData;
  isUnlocked?: boolean;
  stages?: WorldStageNode[];
  diagnosedGaps?: string[];
  onLaunchStageTest: (stage: WorldStageNode) => void;
  onRetakeDiagnostic: (courseId: string) => void;
  onSwitchCourse: () => void;
  onClaimGeo?: (amount: number) => void;
  onInspectBoss?: (boss: BleachVillainConfig) => void;
  aiModelUsed?: string;
  aiRoadmapMeta?: {
    difficulty?: string;
    estimatedStudyHours?: number;
    weakTopics?: string[];
    strongTopics?: string[];
  } | null;
  skillLevel?: string;
  scorePercentage?: number;
  onViewAiAnalysis?: () => void;
  onOpenInteractiveNotes?: (courseId: string, stageNumber: number) => void;
  onOpenLab?: (courseId: string, stageNumber: number) => void;
  onRewardXp?: (amount: number) => void;
  onRewardGeo?: (amount: number) => void;
}) {
  const [selectedStage, setSelectedStage] = useState<WorldStageNode>(stages[0]);
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);

  useEffect(() => {
    if (stages.length > 0) {
      // Pick first unlocked or remediation stage by default
      const firstPlayable = stages.find(s => s.status === 'remediation_priority' || s.status === 'unlocked') || stages[0];
      setSelectedStage(firstPlayable);
    }
  }, [stages]);

  const completedStages = stages.filter(s => s.status === 'completed').length;
  const totalStars = stages.reduce((acc, s) => acc + s.stars, 0);

  const effectiveScore = typeof scorePercentage === 'number'
    ? scorePercentage
    : (stages.length > 0 ? stages[0].masteryPct : 50);
  const effectiveSkillLevel: SkillLevel = (skillLevel as SkillLevel) || calculateSkillLevel(Math.round((effectiveScore / 100) * 10));
  const skillMeta = getSkillLevelMeta(effectiveSkillLevel);
  const remediationStages = stages.filter(s => s.status === 'remediation_priority');

  const [heartsSummary, setHeartsSummary] = useState<CourseStarHeartsSummary>(() =>
    getCourseStarHeartsSummary(course.id, totalStars)
  );

  useEffect(() => {
    setHeartsSummary(getCourseStarHeartsSummary(course.id, totalStars));
  }, [course.id, totalStars]);

  const handleForgeHeart = () => {
    const res = forgeCourseHeart(course.id, totalStars);
    if (res.success) {
      setHeartsSummary(getCourseStarHeartsSummary(course.id, totalStars));
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch {}
    }
  };

  const handleRefundHeart = () => {
    const res = refundCourseHeart(course.id);
    if (res.success) {
      setHeartsSummary(getCourseStarHeartsSummary(course.id, totalStars));
    }
  };

  const getStatusBadge = (status: WorldStageNode['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'remediation_priority':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
      case 'unlocked':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'locked':
        return 'bg-slate-800 text-slate-500 border-slate-700';
    }
  };

  // IF LOCKED: Display Prerequisite Diagnostic Guard
  if (!isUnlocked) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-6 animate-in fade-in duration-300 font-mono text-center">
        <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-8 md:p-12 shadow-[0_0_80px_rgba(245,158,11,0.15)] relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-500/60 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20">
            <Lock className="w-10 h-10 text-amber-400" />
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Diagnostic Gate Required</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Personalized World Map Locked
          </h1>

          <p className="text-sm text-slate-300 max-w-xl mx-auto mt-3 leading-relaxed">
            The adaptive AI learning engine cannot construct your personalized campaign map for <span className="text-amber-400 font-bold">{course.title}</span> until you complete the initial baseline diagnostic assessment.
          </p>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 max-w-lg mx-auto my-6 text-left text-xs space-y-2 text-slate-300">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold">
              <Zap className="w-4 h-4" />
              <span>What the AI Diagnostic does:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Estimates your initial Bayesian concept mastery levels.</li>
              <li>Identifies hidden misconceptions and knowledge gaps.</li>
              <li>Generates a custom 5-stage progression tailored to your strengths and weaknesses.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onRetakeDiagnostic(course.id)}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl transition flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/30 text-xs uppercase tracking-wider cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Launch AI Diagnostic Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onSwitchCourse}
              className="w-full sm:w-auto px-6 py-4 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded-xl transition text-xs uppercase cursor-pointer"
            >
              Back to Course Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-300 font-mono">
      
      {/* 1. TOP CAMPAIGN BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase flex items-center space-x-1 shadow-sm">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>AI-Calibrated World Map</span>
              </span>
              <span className={`px-2.5 py-0.5 rounded text-[10px] ${skillMeta.badgeColor} border font-black uppercase flex items-center space-x-1 shadow-sm`}>
                <span>{skillMeta.icon} Calibrated to {effectiveSkillLevel} Level ({effectiveScore}%)</span>
              </span>
              {remediationStages.length > 0 && (
                <span className="px-2.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 font-black uppercase flex items-center space-x-1 shadow-sm animate-pulse">
                  <Target className="w-3 h-3 text-rose-400" />
                  <span>{remediationStages.length} AI Remediation Node{remediationStages.length > 1 ? 's' : ''}</span>
                </span>
              )}
              {aiModelUsed && (
                <span className="px-2.5 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-black uppercase flex items-center space-x-1 shadow-sm">
                  <BrainCircuit className="w-3 h-3 text-indigo-400" />
                  <span>Engine: {aiModelUsed}</span>
                </span>
              )}
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-amber-400 text-xs font-bold">{course.title}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Personalized Campaign World Map
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              This sequential realm roadmap was dynamically generated by AI targeting your diagnosed concept gaps, evaluated skill level, and strengths.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onViewAiAnalysis && (
              <button
                onClick={onViewAiAnalysis}
                className="px-3.5 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-200 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                <span>View AI Analysis</span>
              </button>
            )}
            <button
              onClick={() => onRetakeDiagnostic(course.id)}
              className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Recalibrate Diagnostic</span>
            </button>
            <button
              onClick={onSwitchCourse}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-md shadow-indigo-600/25"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to All Courses</span>
            </button>
          </div>
        </div>

        {/* Campaign Metrics */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-6 text-xs font-mono">
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">Progress</span>
            <span className="text-white font-bold">{completedStages} / {stages.length} Stage Tests Cleared</span>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">Stars Harvested</span>
            <span className="text-amber-400 font-bold">⭐ {totalStars} / {stages.length * 3}</span>
          </div>
          <div>
            <span className="text-slate-500 uppercase text-[10px] block">Course Boss Exam</span>
            <span className="text-rose-400 font-bold">{course.bossName}</span>
          </div>
          {aiRoadmapMeta?.estimatedStudyHours && (
            <div>
              <span className="text-slate-500 uppercase text-[10px] block">Est. Study Hours</span>
              <span className="text-cyan-300 font-bold">⏱️ {aiRoadmapMeta.estimatedStudyHours} Hours</span>
            </div>
          )}
          {aiRoadmapMeta?.difficulty && (
            <div>
              <span className="text-slate-500 uppercase text-[10px] block">AI Assessed Tier</span>
              <span className="text-amber-400 font-bold">⚡ {aiRoadmapMeta.difficulty}</span>
            </div>
          )}
        </div>

        {/* Course Star-to-Heart Soul Ward Forge (Course-Isolated) */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-950/80 p-4 rounded-2xl border border-rose-500/30 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-500" />
              <span>{course.title} Soul Ward Forge</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase font-black">
                Course Isolated
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Forge <b className="text-amber-400">3 {course.title} Stars</b> into <b className="text-rose-400">1 Extra Heart</b> to absorb wrong answer penalties during difficult tests in this course!
            </p>
            <div className="flex items-center space-x-4 text-xs pt-1">
              <span className="text-slate-300 font-bold">
                ⭐ Available: <b className="text-amber-400">{heartsSummary.starsAvailable} Stars</b> ({heartsSummary.starsSpent} spent)
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-bold flex items-center space-x-1.5">
                <span>Extra Hearts:</span>
                <span className="flex items-center space-x-1 text-sm text-rose-400">
                  {Array.from({ length: heartsSummary.maxHearts }).map((_, i) => (
                    <span key={i}>
                      {i < heartsSummary.extraHearts ? '💖' : '🤍'}
                    </span>
                  ))}
                </span>
                <span className="text-slate-400">({heartsSummary.extraHearts}/{heartsSummary.maxHearts})</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0 flex-wrap">
            <button
              onClick={handleForgeHeart}
              disabled={!heartsSummary.canForge}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 transition cursor-pointer ${
                heartsSummary.canForge
                  ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 shadow-lg shadow-rose-500/25 active:scale-95'
                  : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Forge Extra Heart (3 ⭐)</span>
            </button>
            {heartsSummary.canReforge && (
              <button
                onClick={handleRefundHeart}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
                title="Refund 1 Extra Heart back to 3 course stars"
              >
                <span>Reforge (Refund)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAP NODES ROADMAP & STAGE INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Stages Timeline Column */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Your Algorithmic Course Roadmap:
          </h3>

          <div className="space-y-3">
            {stages.map((stage, idx) => {
              const isSelected = selectedStage.id === stage.id;
              const isLocked = stage.status === 'locked';

              return (
                <div key={stage.id} className="relative">
                  {idx > 0 && (
                    <div className={`absolute -top-3 left-6 w-0.5 h-3 ${
                      stage.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-800'
                    }`} />
                  )}

                  <div
                    onClick={() => setSelectedStage(stage)}
                    className={`p-4 rounded-xl border-2 transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-cyan-400 bg-slate-900 shadow-xl shadow-cyan-500/10'
                        : isLocked
                        ? 'border-slate-800/80 bg-slate-950/60 opacity-60'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border ${
                        stage.isBoss 
                          ? 'border-amber-500 bg-amber-950/60 text-amber-300' 
                          : stage.status === 'completed'
                          ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                          : stage.status === 'remediation_priority'
                          ? 'border-rose-500 bg-rose-950/60 text-rose-300'
                          : 'border-slate-700 bg-slate-900 text-slate-300'
                      }`}>
                        {stage.isBoss ? <Crown className="w-5 h-5 text-amber-400" /> : stage.stageNumber}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-white">
                            Stage {stage.stageNumber}: {stage.name}
                          </h4>
                          <span className="text-[10px] text-slate-500">({stage.kanji})</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {stage.conceptFocus}
                        </p>
                        {stage.status === 'remediation_priority' && (
                          <div className="mt-1 flex items-center space-x-1 text-[9px] font-bold text-rose-400">
                            <Target className="w-3 h-3 shrink-0 text-rose-400 animate-pulse" />
                            <span>AI Remediation Focus: {stage.targetConcept || stage.conceptFocus}</span>
                          </div>
                        )}
                        {effectiveSkillLevel === 'Advanced' && stage.stageNumber === 1 && (
                          <div className="mt-1 flex items-center space-x-1 text-[9px] font-bold text-emerald-400">
                            <Sparkles className="w-3 h-3 shrink-0 text-emerald-400" />
                            <span>Accelerated Proving Ground (Foundations Fast-Tracked)</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {stage.stars > 0 && (
                        <div className="flex items-center text-amber-400 text-xs">
                          {'⭐'.repeat(stage.stars)}
                        </div>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getStatusBadge(stage.status)}`}>
                        {stage.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Stage Detail & Launch Combat Panel */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-cyan-400 uppercase">
                  {selectedStage.realmLocation}
                </span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getStatusBadge(selectedStage.status)}`}>
                  {selectedStage.status.replace('_', ' ')}
                </span>
              </div>
              <h2 className="text-lg font-black text-white mt-1">
                Stage {selectedStage.stageNumber}: {selectedStage.name}
              </h2>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Target Concept: <b className="text-slate-200">{selectedStage.conceptFocus}</b>
              </div>
            </div>

            {/* AI Pedagogical Calibration Rationale */}
            {selectedStage.aiRationale && (
              <div className="p-3.5 bg-indigo-950/50 rounded-xl border border-indigo-500/40 text-xs text-indigo-200 space-y-1 shadow-md">
                <div className="flex items-center space-x-1.5 text-[10px] font-black text-indigo-300 uppercase tracking-wider">
                  <BrainCircuit className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>AI Pedagogical Diagnostic Rationale</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {selectedStage.aiRationale}
                </p>
              </div>
            )}

            {/* Flavor Lore */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/90 text-xs text-slate-300 leading-relaxed italic">
              "{selectedStage.lore}"
            </div>

            {/* Stage Metrics */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Concept Mastery</span>
                <p className="text-base font-bold text-indigo-400 mt-0.5">
                  {selectedStage.masteryPct}%
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Stage Test Stars</span>
                <p className="text-base font-bold text-amber-400 mt-0.5">
                  {selectedStage.stars} / 3 Stars
                </p>
              </div>
            </div>

            {/* Study Subtopic Lecture Notes Action */}
            <button
              onClick={() => setIsLectureModalOpen(true)}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-200 flex items-center justify-center space-x-2 transition cursor-pointer shadow-md"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Study Lecture Notes & Concepts (+25 Geo)</span>
            </button>

            {/* Launch Interactive Practical Simulation Lab */}
            <button
              onClick={() => {
                if (onOpenLab) {
                  onOpenLab(course.id, selectedStage.stageNumber);
                } else {
                  setIsLabModalOpen(true);
                }
              }}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 flex items-center justify-center space-x-2 transition cursor-pointer shadow-md"
            >
              <FlaskConical className="w-4 h-4 text-emerald-400" />
              <span>🧪 Interactive Practical Lab (+30 XP, +15 Geo)</span>
            </button>

            {/* Inspect Stage Boss Profile Action */}
            <button
              onClick={() => onInspectBoss && onInspectBoss(getStageBoss(course.id, selectedStage.stageNumber))}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-950 hover:bg-slate-800 border border-amber-500/40 text-amber-300 flex items-center justify-center space-x-2 transition cursor-pointer shadow-md"
            >
              <Skull className="w-4 h-4 text-amber-400" />
              <span>Inspect Stage Boss & Weaknesses</span>
            </button>

            {/* Course Soul Ward Protection Status for this Test */}
            <div className="p-3 bg-slate-950 rounded-xl border border-rose-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-500" />
                <span className="font-bold">Test Soul Wards:</span>
              </div>
              <div className="flex items-center space-x-1 font-black text-rose-300">
                {heartsSummary.extraHearts > 0 ? (
                  <>
                    <span>{'💖'.repeat(heartsSummary.extraHearts)}</span>
                    <span className="text-[11px] text-emerald-400">({heartsSummary.extraHearts} Protected Strike{heartsSummary.extraHearts > 1 ? 's' : ''})</span>
                  </>
                ) : (
                  <span className="text-[11px] text-slate-500">0 Active (Forge above with 3 course stars!)</span>
                )}
              </div>
            </div>

            {/* In-Course Test Launch Action (Launches into Combat Arena) */}
            <button
              onClick={() => onLaunchStageTest(selectedStage)}
              disabled={selectedStage.status === 'locked'}
              className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition cursor-pointer shadow-lg ${
                selectedStage.status === 'locked'
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : selectedStage.isBoss
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-amber-500/30'
                  : 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-amber-500 hover:from-cyan-400 hover:to-amber-400 text-slate-950 shadow-cyan-500/30'
              }`}
            >
              {selectedStage.status === 'locked' ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Stage Locked (Clear Prior Stage Test)</span>
                </>
              ) : selectedStage.isBoss ? (
                <>
                  <Crown className="w-4 h-4" />
                  <span>Begin Grand Boss Exam (Enter Combat)</span>
                </>
              ) : (
                <>
                  <Swords className="w-4 h-4" />
                  <span>Begin Stage Test (Enter Combat)</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-slate-500 text-center">
              All in-course evaluations run within the animated Bleach combat arena. Answer correctly to unleash Zanpakuto strikes!
            </p>
          </div>
        </div>

      </div>

      {/* Personalized Subtopic Lecture Notes Modal */}
      <LectureNotesModal
        isOpen={isLectureModalOpen}
        onClose={() => setIsLectureModalOpen(false)}
        course={course}
        stage={selectedStage}
        diagnosedGaps={diagnosedGaps}
        onClaimGeo={(amt) => onClaimGeo && onClaimGeo(amt)}
        onOpenInteractiveNotes={() => onOpenInteractiveNotes && onOpenInteractiveNotes(course.id, selectedStage.stageNumber)}
        onStartTest={() => {
          setIsLectureModalOpen(false);
          onLaunchStageTest(selectedStage);
        }}
      />

      {/* Practical Simulation Lab Modal */}
      <InteractiveLabModal
        isOpen={isLabModalOpen}
        onClose={() => setIsLabModalOpen(false)}
        initialCourseId={course.id}
        initialStageNumber={selectedStage.stageNumber}
        onRewardXp={onRewardXp}
        onRewardGeo={onRewardGeo}
        onOpenLectureNotes={(cId, sNum) => {
          setIsLabModalOpen(false);
          if (onOpenInteractiveNotes) onOpenInteractiveNotes(cId, sNum);
        }}
      />

    </div>
  );
}
