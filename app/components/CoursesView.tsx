'use client';
import React, { useState } from 'react';
import { 
  BookOpen, 
  Zap, 
  ArrowRight, 
  Activity, 
  Compass, 
  Sigma, 
  Grid, 
  CheckCircle2, 
  Map, 
  Sparkles,
  Lock,
  Unlock,
  Swords,
  FlaskConical
} from 'lucide-react';

export interface CourseData {
  id: string;
  title: string;
  subject: string;
  description: string;
  iconName: 'Activity' | 'Zap' | 'Compass' | 'Sigma' | 'Grid';
  topicsCount: number;
  overallMastery: number; // 0.00 to 1.00
  worldSlug: string;
  bossName: string;
  tags: string[];
}

export const ACADEMIC_COURSES: CourseData[] = [
  {
    id: 'course-mechanics',
    title: 'Physics I — Classical Mechanics',
    subject: 'Physics',
    description: 'Kinematics, Newton’s Laws, conservation of momentum, work-energy theorem, and rotational dynamics.',
    iconName: 'Activity',
    topicsCount: 8,
    overallMastery: 0.68,
    worldSlug: 'training-grounds',
    bossName: 'Grimmjow Jaegerjaquez (Pantera)',
    tags: ['Forces', 'Energy', 'Kinematics']
  },
  {
    id: 'course-electromagnetism',
    title: 'Physics II — Electricity & Magnetism',
    subject: 'Physics',
    description: 'Coulomb’s law, Gauss’s law, electric potential, capacitance, circuits, and Lorentz magnetic force.',
    iconName: 'Zap',
    topicsCount: 9,
    overallMastery: 0.44,
    worldSlug: 'force-field',
    bossName: 'Ulquiorra Cifer (Segunda Etapa)',
    tags: ['Charge', 'Gauss Law', 'Circuits']
  },
  {
    id: 'course-calculus',
    title: 'Differential & Integral Calculus',
    subject: 'Mathematics',
    description: 'Limits, derivative rules, optimization, Riemann sums, integration techniques, and differential equations.',
    iconName: 'Sigma',
    topicsCount: 10,
    overallMastery: 0.72,
    worldSlug: 'rotation-sanctum',
    bossName: 'Yhwach, The Quincy King',
    tags: ['Derivatives', 'Integrals', 'Limits']
  },
  {
    id: 'course-cs',
    title: 'Computer Science & Algorithmics',
    subject: 'Computer Science',
    description: 'Execution context, closures, recursion, asymptotic complexity, binary trees, and dynamic programming.',
    iconName: 'Grid',
    topicsCount: 7,
    overallMastery: 0.86,
    worldSlug: 'energy-realm',
    bossName: 'Sosuke Aizen (Complete Hypnosis)',
    tags: ['Closures', 'Big-O', 'Data Structures']
  }
];

export default function CoursesView({
  unlockedCourses = {},
  onStartDiagnostic,
  onOpenWorldMap,
  onLaunchStageTest,
  onOpenLectureNotes,
  onOpenLab
}: {
  unlockedCourses?: Record<string, { diagnosticCompleted: boolean; mastery: number }>;
  onStartDiagnostic: (courseId: string) => void;
  onOpenWorldMap: (course: CourseData) => void;
  onLaunchStageTest?: (course: CourseData) => void;
  onOpenLectureNotes?: (course: CourseData) => void;
  onOpenLab?: (course: CourseData) => void;
}) {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  const subjects = ['All', 'Physics', 'Mathematics', 'Computer Science'];

  const filteredCourses = selectedSubject === 'All'
    ? ACADEMIC_COURSES
    : ACADEMIC_COURSES.filter(c => c.subject.toLowerCase() === selectedSubject.toLowerCase());

  const renderIcon = (name: CourseData['iconName']) => {
    switch (name) {
      case 'Activity': return <Activity className="w-6 h-6 text-indigo-400" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-400" />;
      case 'Compass': return <Compass className="w-6 h-6 text-emerald-400" />;
      case 'Sigma': return <Sigma className="w-6 h-6 text-violet-400" />;
      case 'Grid': return <Grid className="w-6 h-6 text-cyan-400" />;
      default: return <BookOpen className="w-6 h-6 text-indigo-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-300 text-xs font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Diagnostic Prerequisite Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Academic Course Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Each course requires completing an AI diagnostic assessment to generate your personalized learning plan and unlock its World Map.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 p-1 bg-slate-950/80 border border-slate-800 rounded-xl text-xs">
          {subjects.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                selectedSubject === s ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCourses.map(course => {
          const courseStatus = unlockedCourses[course.id];
          const isUnlocked = Boolean(courseStatus?.diagnosticCompleted);
          const currentMastery = isUnlocked ? (courseStatus?.mastery ?? course.overallMastery) : 0;
          const masteryPct = Math.round(currentMastery * 100);

          return (
            <div
              key={course.id}
              className={`border rounded-xl p-5 shadow-lg transition-all flex flex-col justify-between space-y-4 group ${
                isUnlocked 
                  ? 'bg-slate-900/80 border-slate-800 hover:border-sky-500/40' 
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 group-hover:border-slate-700 transition">
                      {renderIcon(course.iconName)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                        {course.title}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        {course.subject} • {course.topicsCount} Concepts
                      </span>
                    </div>
                  </div>

                  {isUnlocked ? (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center space-x-1 shrink-0">
                      <Unlock className="w-3 h-3 text-emerald-400" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center space-x-1 shrink-0">
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {course.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {course.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-400 border border-slate-800/80">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Status Indicator */}
                {isUnlocked ? (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">AI Calibrated Baseline Mastery:</span>
                      <span className="text-emerald-300 font-bold font-mono">{masteryPct}%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-emerald-400"
                        style={{ width: `${masteryPct}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Take diagnostic test to unlock course and generate personalized World Map.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                {isUnlocked ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onOpenWorldMap(course)}
                        className="px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                      >
                        <Map className="w-3.5 h-3.5" />
                        <span>Enter Roadmap</span>
                      </button>

                      <button
                        onClick={() => onStartDiagnostic(course.id)}
                        className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Recalibrate</span>
                      </button>
                    </div>

                    {onOpenLectureNotes && (
                      <button
                        onClick={() => onOpenLectureNotes(course)}
                        className="w-full py-2 bg-sky-950/40 hover:bg-sky-900/50 border border-sky-500/30 text-sky-200 text-xs font-medium rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                        <span>Interactive Lecture Notes & AI</span>
                      </button>
                    )}

                    {onOpenLab && (
                      <button
                        onClick={() => onOpenLab(course)}
                        className="w-full py-2 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-200 text-xs font-medium rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Practical Simulation Labs</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => onStartDiagnostic(course.id)}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg transition flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Take Diagnostic Test to Unlock</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
