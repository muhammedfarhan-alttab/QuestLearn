'use client';
import React, { useState } from 'react';
import { 
  Sparkles, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  Award, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Target, 
  Flame, 
  BarChart3, 
  Layers, 
  Swords,
  ChevronRight
} from 'lucide-react';

interface TopicMastery {
  name: string;
  category: string;
  mastery: number; // 0.0 to 1.0
  prerequisite?: string;
  status: 'MASTERED' | 'PROFICIENT' | 'DEVELOPING' | 'AT RISK' | 'FOUNDATIONAL GAP';
}

const SAMPLE_TOPICS: TopicMastery[] = [
  { name: 'Equivalent Fractions', category: 'Math Foundations', mastery: 0.94, status: 'MASTERED' },
  { name: 'Common Denominators', category: 'Math Foundations', mastery: 0.88, prerequisite: 'Equivalent Fractions', status: 'PROFICIENT' },
  { name: 'Fraction Addition & Subtraction', category: 'Math Foundations', mastery: 0.62, prerequisite: 'Common Denominators', status: 'DEVELOPING' },
  { name: 'Algebraic Simplification', category: 'Algebra', mastery: 0.76, status: 'PROFICIENT' },
  { name: 'Linear Equations & Systems', category: 'Algebra', mastery: 0.44, prerequisite: 'Algebraic Simplification', status: 'AT RISK' },
  { name: 'Limits & Continuity', category: 'Calculus', mastery: 0.72, status: 'PROFICIENT' },
  { name: 'Differentiation & Chain Rule', category: 'Calculus', mastery: 0.38, prerequisite: 'Limits & Continuity', status: 'AT RISK' },
  { name: 'Integration by Parts', category: 'Calculus', mastery: 0.22, prerequisite: 'Differentiation & Chain Rule', status: 'FOUNDATIONAL GAP' },
  { name: 'JavaScript Execution & Closures', category: 'Computer Science', mastery: 0.91, status: 'MASTERED' },
  { name: 'Call Stack & Event Loop', category: 'Computer Science', mastery: 0.68, prerequisite: 'JavaScript Execution & Closures', status: 'DEVELOPING' }
];

export default function DashboardView({
  onLaunchBattle,
  onLaunchDiagnostic,
  onNavigateProfile,
  playerStats = {
    level: 4,
    totalXp: 1450,
    nextLevelXp: 2000,
    streakDays: 6,
    geoBalance: 240,
    questionsAnswered: 84,
    accuracyRate: 78
  }
}: {
  onLaunchBattle: () => void;
  onLaunchDiagnostic: () => void;
  onNavigateProfile: () => void;
  playerStats?: {
    level: number;
    totalXp: number;
    nextLevelXp: number;
    streakDays: number;
    geoBalance: number;
    questionsAnswered: number;
    accuracyRate: number;
  };
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Math Foundations', 'Algebra', 'Calculus', 'Computer Science'];

  const filteredTopics = selectedCategory === 'all' 
    ? SAMPLE_TOPICS 
    : SAMPLE_TOPICS.filter(t => t.category === selectedCategory);

  const weakTopics = SAMPLE_TOPICS.filter(t => t.mastery < 0.5);
  const overallMastery = Math.round(
    (SAMPLE_TOPICS.reduce((acc, t) => acc + t.mastery, 0) / SAMPLE_TOPICS.length) * 100
  );

  const getStatusBadge = (status: TopicMastery['status']) => {
    switch (status) {
      case 'MASTERED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'PROFICIENT':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'DEVELOPING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'AT RISK':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'FOUNDATIONAL GAP':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Bayesian Knowledge Tracing (BKT) Engine Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Adaptive Cognitive Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Your real-time Bayesian knowledge model tracks concept mastery, predicts forgetting curves, and automatically diagnoses prerequisite gaps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onLaunchDiagnostic}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2 uppercase tracking-wide cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Run Diagnostic Assessment</span>
            </button>
            <button
              onClick={onLaunchBattle}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-orange-500/30 transition flex items-center space-x-2 uppercase tracking-wide cursor-pointer"
            >
              <Swords className="w-4 h-4" />
              <span>Enter Battle Arena</span>
            </button>
          </div>
        </div>

        {/* Level XP Progress */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white uppercase">Level {playerStats.level} Shinigami Scholar</span>
              <span className="text-slate-400">({playerStats.totalXp} XP Total)</span>
            </div>
            <span className="text-indigo-400 font-bold">
              {playerStats.nextLevelXp - playerStats.totalXp} XP to Level {playerStats.level + 1}
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (playerStats.totalXp / playerStats.nextLevelXp) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. STATS CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Target className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="text-xl font-black text-white">{overallMastery}%</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Overall Mastery</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
          </div>
          <div>
            <div className="text-xl font-black text-white">{playerStats.streakDays} Days</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Daily Streak</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xl font-black text-white">{playerStats.accuracyRate}%</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">First-Try Accuracy</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Award className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-xl font-black text-white">{playerStats.geoBalance} Geo</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Spiritual Currency</div>
          </div>
        </div>
      </div>

      {/* 3. WEAK PREREQUISITE ALERT BANNER (Cognitive Remediation) */}
      {weakTopics.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2">
                  <span>Foundational Knowledge Gaps Detected ({weakTopics.length})</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-mono">PRIORITY REMEDIATION</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  The Bayesian network detected low confidence or repeated misconceptions in foundational concepts. Remediating these unlocks downstream topics.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {weakTopics.map(topic => (
                    <div 
                      key={topic.name}
                      className="px-2.5 py-1 bg-slate-950 border border-rose-500/30 rounded-lg text-xs font-mono flex items-center space-x-2"
                    >
                      <span className="text-rose-300 font-bold">{topic.name}</span>
                      <span className="text-slate-400 text-[10px]">({Math.round(topic.mastery * 100)}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={onNavigateProfile}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1 shrink-0 cursor-pointer"
            >
              <span>View Course Roadmaps</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 4. TOPIC MASTERY BREAKDOWN */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Concept Mastery Matrix</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Probabilistic estimates updated after every learning interaction
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center flex-wrap gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-bold transition capitalize cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-indigo-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Domains' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {filteredTopics.map(topic => {
            const pct = Math.round(topic.mastery * 100);
            return (
              <div 
                key={topic.name}
                className="bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/40 rounded-xl p-3.5 space-y-2 transition shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black text-slate-200">{topic.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">{topic.category}</span>
                    {topic.prerequisite && (
                      <div className="text-[9px] text-amber-400/80 font-mono mt-0.5">
                        Prerequisite: {topic.prerequisite}
                      </div>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border uppercase ${getStatusBadge(topic.status)}`}>
                    {topic.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-400">P(Mastery)</span>
                    <span className="text-indigo-300 font-bold">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        pct >= 90 ? 'bg-emerald-400' :
                        pct >= 70 ? 'bg-cyan-400' :
                        pct >= 50 ? 'bg-amber-400' :
                        pct >= 30 ? 'bg-orange-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
