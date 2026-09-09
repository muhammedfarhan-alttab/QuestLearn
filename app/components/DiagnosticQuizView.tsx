'use client';
import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  BrainCircuit, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  Trophy,
  Clock,
  Target,
  Layers,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Compass,
  Award,
  ShieldCheck,
  Flame,
  BarChart3,
  Check,
  Map
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CourseData, ACADEMIC_COURSES } from './CoursesView';
import { StudentAnswerItem } from '../api/generate-roadmap/types';
import { 
  COMPLETE_DIAGNOSTIC_BANK,
  calculateSkillLevel,
  buildDiagnosticSummary,
  saveDiagnosticSummary,
  getSkillLevelMeta,
  SkillLevel,
  DiagnosticSummary,
  DiagnosticAnswer,
  DiagnosticQuestion,
  DiagnosticDifficulty
} from '../lib/diagnosticEngine';

export interface DiagnosticResult {
  courseId: string;
  courseName?: string;
  overallMastery: number;
  overallScore: number;
  diagnosedGaps: string[];
  scores?: Record<string, number>;
  weakTopics: string[];
  strongTopics: string[];
  answers: StudentAnswerItem[];
  targetTab?: 'worldmap' | 'ai-analysis';
}

interface DiagnosticQuizViewProps {
  course?: CourseData;
  onFinishDiagnostic: (results: DiagnosticResult) => void;
  onBackToCourses?: () => void;
}

export default function DiagnosticQuizView({
  course = ACADEMIC_COURSES[0],
  onFinishDiagnostic,
  onBackToCourses
}: DiagnosticQuizViewProps) {
  // Quiz active state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Real-time BKT state tracking
  const [masteryProb, setMasteryProb] = useState(0.40);
  const [confidenceProb, setConfidenceProb] = useState(0.45);
  const [bayesianUpdateLog, setBayesianUpdateLog] = useState<string>('Prior uncalibrated. Initializing diagnostic belief state.');
  const [detectedMisconceptions, setDetectedMisconceptions] = useState<string[]>([]);
  const [conceptScores, setConceptScores] = useState<Record<string, number>>({});
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswerItem[]>([]);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<DiagnosticAnswer[]>([]);

  // Post-completion dashboard state
  const [isFinished, setIsFinished] = useState(false);
  const [summary, setSummary] = useState<DiagnosticSummary | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'wrong'>('all');
  const [showQuestionReview, setShowQuestionReview] = useState(true);

  // Prepare questions with stably distributed option indices so correct answer isn't always index 0
  const preparedQuestions = useMemo(() => {
    const rawBank = COMPLETE_DIAGNOSTIC_BANK[course.id] || COMPLETE_DIAGNOSTIC_BANK['course-mechanics'] || [];
    return rawBank.map((q, qIdx) => {
      // Deterministically distribute correct answer across options [1, 2, 3, 0, 1, 2...]
      const targetCorrectIdx = (qIdx * 3 + 1) % q.options.length;
      const options = [...q.options];
      const correctText = options[q.correctIndex];
      const swappedText = options[targetCorrectIdx];
      options[targetCorrectIdx] = correctText;
      options[q.correctIndex] = swappedText;

      const mappedMisconceptions: Record<number, string> = {};
      if (q.misconceptionIfChosen) {
        Object.entries(q.misconceptionIfChosen).forEach(([oldIdxStr, misText]) => {
          const oldIdx = parseInt(oldIdxStr, 10);
          let newIdx = oldIdx;
          if (oldIdx === q.correctIndex) newIdx = targetCorrectIdx;
          else if (oldIdx === targetCorrectIdx) newIdx = q.correctIndex;
          mappedMisconceptions[newIdx] = misText;
        });
      }

      return {
        ...q,
        options,
        correctIndex: targetCorrectIdx,
        misconceptionIfChosen: mappedMisconceptions
      };
    });
  }, [course.id]);

  const currentQ = preparedQuestions[currentIndex] || preparedQuestions[0];

  // Difficulty badge styling
  const getDifficultyPill = (diff: DiagnosticDifficulty) => {
    switch (diff) {
      case 'easy':
        return {
          label: 'EASY',
          range: 'Q1-2',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          indicator: 'bg-emerald-500',
          icon: '🌱'
        };
      case 'medium':
        return {
          label: 'MEDIUM',
          range: 'Q3-6',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          indicator: 'bg-cyan-400',
          icon: '⚡'
        };
      case 'hard':
      default:
        return {
          label: 'HARD',
          range: 'Q7-10',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          indicator: 'bg-rose-500',
          icon: '🔥'
        };
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    const scoreVal = isCorrect ? 100 : Math.max(20, Math.round(masteryProb * 100));
    setConceptScores(prev => ({ ...prev, [currentQ.concept]: scoreVal }));

    // Record answer for AI Roadmap integration
    const studentAnswer: StudentAnswerItem = {
      question: currentQ.prompt,
      concept: currentQ.concept,
      selectedOption: currentQ.options[idx] || `Option ${idx + 1}`,
      correctOption: currentQ.options[currentQ.correctIndex] || `Option ${currentQ.correctIndex + 1}`,
      isCorrect
    };

    setStudentAnswers(prev => {
      const copy = [...prev];
      copy[currentIndex] = studentAnswer;
      return copy;
    });

    // Record answer for strict diagnostic summary
    const chosenMisconception = currentQ.misconceptionIfChosen?.[idx];
    const diagnosticRecord: DiagnosticAnswer = {
      questionId: currentQ.id,
      concept: currentQ.concept,
      difficulty: currentQ.difficulty,
      prompt: currentQ.prompt,
      selectedOption: currentQ.options[idx],
      selectedIndex: idx,
      correctOption: currentQ.options[currentQ.correctIndex],
      correctIndex: currentQ.correctIndex,
      isCorrect,
      explanation: currentQ.explanation,
      misconception: chosenMisconception
    };

    setDiagnosticAnswers(prev => {
      const copy = [...prev];
      copy[currentIndex] = diagnosticRecord;
      return copy;
    });

    if (isCorrect) {
      // Bayesian positive update
      const newMastery = Math.min(0.96, masteryProb + 0.12);
      const newConf = Math.min(0.95, confidenceProb + 0.10);
      setMasteryProb(newMastery);
      setConfidenceProb(newConf);
      setBayesianUpdateLog(`P(Mastery | Correct) +12% ➔ ${(newMastery * 100).toFixed(0)}%. Student concept confirmed.`);
      try {
        confetti({ particleCount: 35, spread: 55, origin: { y: 0.7 } });
      } catch (e) {}
    } else {
      // Bayesian negative update & misconception logging
      const newMastery = Math.max(0.18, masteryProb - 0.14);
      const newConf = Math.min(0.95, confidenceProb + 0.08);
      setMasteryProb(newMastery);
      setConfidenceProb(newConf);

      if (chosenMisconception) {
        setDetectedMisconceptions(prev => Array.from(new Set([...prev, chosenMisconception])));
        setBayesianUpdateLog(`P(Mastery | Mistake) ➔ ${(newMastery * 100).toFixed(0)}%. Flagged misconception: "${chosenMisconception}"`);
      } else {
        setBayesianUpdateLog(`P(Mastery | Mistake) ➔ ${(newMastery * 100).toFixed(0)}%. Targeted remediation priority registered.`);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < preparedQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Completed all 10 questions! Formulate diagnostic summary
      const finalDiagnosticAnswers = [...diagnosticAnswers];
      const builtSummary = buildDiagnosticSummary(
        course.id,
        course.title,
        finalDiagnosticAnswers
      );

      // Persist to localStorage for future AI question generation
      saveDiagnosticSummary(builtSummary);
      setSummary(builtSummary);
      setIsFinished(true);

      try {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.55 } });
      } catch (e) {}
    }
  };

  const handleProceedToDestination = (destination: 'worldmap' | 'ai-analysis') => {
    if (!summary) return;

    const strongTopics = summary.strengths;
    const weakTopics = summary.weaknesses;

    // Ensure detected misconceptions are included in weak topics
    detectedMisconceptions.forEach(m => {
      if (!weakTopics.includes(m)) weakTopics.push(m);
    });

    onFinishDiagnostic({
      courseId: course.id,
      courseName: course.title,
      overallMastery: masteryProb,
      overallScore: summary.scorePercentage,
      diagnosedGaps: detectedMisconceptions,
      scores: conceptScores,
      weakTopics,
      strongTopics,
      answers: studentAnswers,
      targetTab: destination
    });
  };

  const handleRetakeDiagnostic = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setMasteryProb(0.40);
    setConfidenceProb(0.45);
    setBayesianUpdateLog('Prior uncalibrated. Initializing diagnostic belief state.');
    setDetectedMisconceptions([]);
    setConceptScores({});
    setStudentAnswers([]);
    setDiagnosticAnswers([]);
    setIsFinished(false);
    setSummary(null);
  };

  // =============================================================
  // VIEW B: BEAUTIFUL ANALYTICS DASHBOARD
  // =============================================================
  if (isFinished && summary) {
    const skillMeta = getSkillLevelMeta(summary.skillLevel);
    const filteredAnswers = summary.answers.filter(a => {
      if (reviewFilter === 'correct') return a.isCorrect;
      if (reviewFilter === 'wrong') return !a.isCorrect;
      return true;
    });

    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
        
        {/* 1. HERO COMPLETION BANNER */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute -right-24 -top-24 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-500/10 text-sky-300 border border-sky-500/20 flex items-center space-x-1.5">
                  <BrainCircuit className="w-3.5 h-3.5 text-sky-400" />
                  <span>Diagnostic Analytics Dashboard</span>
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-amber-400 font-semibold">{course.title}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Cognitive Competency & Learning Trajectory
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Comprehensive evaluation across 10 academic benchmark questions (2 Easy, 4 Medium, 4 Hard). Results saved to optimize your AI-generated questions and campaign map.
              </p>
            </div>

            {/* Score & Completion Pill */}
            <div className="flex flex-row md:flex-col items-center justify-between md:justify-center p-4 bg-slate-950/80 border border-slate-800 rounded-2xl shrink-0 shadow-lg text-center gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Diagnostic Score</span>
                <span className="text-3xl font-black text-amber-400">{summary.scorePercentage}%</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{summary.correctCount} / 10 Correct</span>
              </div>
              <div className="flex items-center space-x-1 text-[11px] font-bold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>10 Questions Evaluated</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SKILL LEVEL HERO CARD */}
        <div className={`p-6 sm:p-8 rounded-3xl border-2 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-2xl relative overflow-hidden ${
          summary.skillLevel === 'Beginner'
            ? 'border-amber-500/50 shadow-amber-950/20'
            : summary.skillLevel === 'Intermediate'
              ? 'border-cyan-500/50 shadow-cyan-950/20'
              : 'border-emerald-500/50 shadow-emerald-950/20'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl bg-slate-900 border ${skillMeta.badgeColor}`}>
                {skillMeta.icon}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Calibrated Skill Level:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${skillMeta.badgeColor}`}>
                    {summary.skillLevel}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {skillMeta.tagline}
                </h2>
              </div>
            </div>

            {/* Threshold Rules Indicator */}
            <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-right shrink-0">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Standard Difficulty Scale:</div>
              <div className="text-xs font-bold text-slate-300 mt-0.5 space-x-2">
                <span className={summary.skillLevel === 'Beginner' ? 'text-amber-400 font-black' : 'text-slate-500'}>0-3: Beginner</span>
                <span className="text-slate-600">•</span>
                <span className={summary.skillLevel === 'Intermediate' ? 'text-cyan-400 font-black' : 'text-slate-500'}>4-7: Intermediate</span>
                <span className="text-slate-600">•</span>
                <span className={summary.skillLevel === 'Advanced' ? 'text-emerald-400 font-black' : 'text-slate-500'}>8-10: Advanced</span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed font-sans">
            {skillMeta.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-800/80">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center space-x-3">
              <Target className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Accuracy</span>
                <span className="text-sm font-black text-white">{summary.scorePercentage}% ({summary.correctCount}/10)</span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center space-x-3">
              <BrainCircuit className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Bayesian Mastery Model</span>
                <span className="text-sm font-black text-white">{(masteryProb * 100).toFixed(0)}% Likelihood</span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center space-x-3">
              <Zap className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase text-slate-400 block font-bold">AI Calibration Status</span>
                <span className="text-sm font-black text-emerald-400">Synced to AI Generator</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. DIFFICULTY ACCURACY BREAKDOWN (3 COLUMNS) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Diagnostic Accuracy by Question Difficulty</span>
            </h3>
            <span className="text-[11px] text-slate-500">2 Easy • 4 Medium • 4 Hard = 10 Questions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* EASY TIER */}
            <div className="bg-slate-900 border-2 border-emerald-500/30 hover:border-emerald-500/50 rounded-2xl p-5 shadow-xl transition space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🌱</span>
                  <div>
                    <h4 className="text-sm font-black text-white">Easy Tier</h4>
                    <span className="text-[10px] text-emerald-400 font-bold">Questions 1–2</span>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {summary.difficultyStats.easy.correct} / 2 ({summary.difficultyStats.easy.percentage}%)
                </span>
              </div>

              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${summary.difficultyStats.easy.percentage}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                Foundational recall, definition recognition, and direct scalar/vector kinematics formulas.
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-500">Assessment:</span>
                <span className={`font-bold ${summary.difficultyStats.easy.correct === 2 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {summary.difficultyStats.easy.correct === 2 ? 'Flawless Base' : 'Needs Foundational Review'}
                </span>
              </div>
            </div>

            {/* MEDIUM TIER */}
            <div className="bg-slate-900 border-2 border-cyan-500/30 hover:border-cyan-500/50 rounded-2xl p-5 shadow-xl transition space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">⚡</span>
                  <div>
                    <h4 className="text-sm font-black text-white">Medium Tier</h4>
                    <span className="text-[10px] text-cyan-400 font-bold">Questions 3–6</span>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {summary.difficultyStats.medium.correct} / 4 ({summary.difficultyStats.medium.percentage}%)
                </span>
              </div>

              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div 
                  className="bg-cyan-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${summary.difficultyStats.medium.percentage}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                Multi-step algebraic synthesis, conceptual applications, and boundary constraint evaluations.
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-500">Assessment:</span>
                <span className={`font-bold ${summary.difficultyStats.medium.correct >= 3 ? 'text-emerald-400' : summary.difficultyStats.medium.correct >= 2 ? 'text-cyan-400' : 'text-rose-400'}`}>
                  {summary.difficultyStats.medium.correct >= 3 ? 'Solid Application' : 'Core Remediation Target'}
                </span>
              </div>
            </div>

            {/* HARD TIER */}
            <div className="bg-slate-900 border-2 border-rose-500/30 hover:border-rose-500/50 rounded-2xl p-5 shadow-xl transition space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🔥</span>
                  <div>
                    <h4 className="text-sm font-black text-white">Hard Tier</h4>
                    <span className="text-[10px] text-rose-400 font-bold">Questions 7–10</span>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {summary.difficultyStats.hard.correct} / 4 ({summary.difficultyStats.hard.percentage}%)
                </span>
              </div>

              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div 
                  className="bg-rose-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${summary.difficultyStats.hard.percentage}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                High-rigor transfer problems, non-ideal edge conditions, and deep algorithmic proofs.
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-500">Assessment:</span>
                <span className={`font-bold ${summary.difficultyStats.hard.correct >= 3 ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {summary.difficultyStats.hard.correct >= 3 ? 'Apex Mastery Proven' : 'Advanced Frontier'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 4. COGNITIVE STRENGTHS VS WEAKNESSES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* STRENGTHS */}
          <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Demonstrated Strengths</h3>
                  <span className="text-[10px] text-emerald-400 font-bold">Concepts Verified Correct</span>
                </div>
              </div>
              <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                {summary.strengths.length} Mastered
              </span>
            </div>

            {summary.strengths.length > 0 ? (
              <div className="space-y-2">
                {summary.strengths.map((str, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 bg-slate-950 p-2.5 rounded-xl border border-emerald-500/20 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-emerald-100 font-bold">{str}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
                Focus on the foundational learning path to unlock initial concept masteries.
              </div>
            )}
          </div>

          {/* WEAKNESSES & MISCONCEPTIONS */}
          <div className="bg-slate-900 border-2 border-rose-500/40 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Remediation Targets</h3>
                  <span className="text-[10px] text-rose-400 font-bold">Concepts Missed / Flagged Misconceptions</span>
                </div>
              </div>
              <span className="text-xs font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                {summary.weaknesses.length} Areas
              </span>
            </div>

            {summary.weaknesses.length > 0 ? (
              <div className="space-y-2">
                {summary.weaknesses.map((weak, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 bg-slate-950 p-2.5 rounded-xl border border-rose-500/20 text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="text-rose-100 font-bold">{weak}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 text-center text-xs text-emerald-300 font-bold flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero cognitive gaps detected! You are fully prepared for apex challenges.</span>
              </div>
            )}

            {/* Flagged Misconception Callouts */}
            {detectedMisconceptions.length > 0 && (
              <div className="pt-2 border-t border-rose-500/20 space-y-2">
                <div className="text-[10px] font-black uppercase text-amber-400 flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Specific Misconceptions Flagged For Remediation:</span>
                </div>
                {detectedMisconceptions.map((mis, idx) => (
                  <div key={idx} className="bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/30 text-[11px] text-slate-300">
                    "{mis}"
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* 5. SEQUENTIAL 4-STEP LEARNING PATH */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                  AI RECOMMENDATION
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-300 font-bold">Sequential Learning Path</span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">
                Optimized Study Roadmap for {course.title}
              </h3>
            </div>
            <span className="text-xs text-indigo-400 font-mono">
              ~{summary.learningPath.reduce((acc, step) => acc + step.estimatedHours, 0)} Total Study Hours
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {summary.learningPath.map((step) => {
              const focusColor = step.focusArea === 'Foundations'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : step.focusArea === 'Remediation'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : step.focusArea === 'Core Application'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

              return (
                <div 
                  key={step.stepNumber}
                  className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3 hover:border-slate-700 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                        {step.stepNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${focusColor}`}>
                        {step.focusArea}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-white leading-snug">
                      {step.topic}
                    </h4>

                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Pacing:</span>
                    <span className="text-cyan-300 font-bold">{step.estimatedHours} Hours</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. COMPREHENSIVE 10-QUESTION AUDIT REVIEW */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>10-Question Diagnostic Audit Review</span>
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Inspect every question, your selected answer, correct answers, step-by-step solutions, and misconception alerts.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setReviewFilter('all')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${reviewFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                All (10)
              </button>
              <button
                onClick={() => setReviewFilter('correct')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${reviewFilter === 'correct' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Correct ({summary.correctCount})
              </button>
              <button
                onClick={() => setReviewFilter('wrong')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${reviewFilter === 'wrong' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Missed ({10 - summary.correctCount})
              </button>
            </div>
          </div>

          {/* Question Review Cards */}
          <div className="space-y-4">
            {filteredAnswers.map((ans, idx) => {
              const diffMeta = getDifficultyPill(ans.difficulty);

              return (
                <div 
                  key={ans.questionId || idx}
                  className={`bg-slate-950 rounded-2xl border-2 p-5 space-y-3 transition ${
                    ans.isCorrect ? 'border-emerald-500/30' : 'border-rose-500/30'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xs font-black text-slate-300">
                        Q{summary.answers.findIndex(a => a.questionId === ans.questionId) + 1}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${diffMeta.badge}`}>
                        {diffMeta.label}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-bold text-white">{ans.concept}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {ans.isCorrect ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Correct</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center space-x-1">
                          <XCircle className="w-3 h-3 text-rose-400" />
                          <span>Incorrect</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm font-sans font-bold text-slate-100">
                    {ans.prompt}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className={`p-2.5 rounded-xl border ${ans.isCorrect ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-rose-950/30 border-rose-500/40 text-rose-200'}`}>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Your Selected Answer:</span>
                      <span className="font-bold">{ans.selectedOption}</span>
                    </div>

                    {!ans.isCorrect && (
                      <div className="p-2.5 rounded-xl border bg-emerald-950/30 border-emerald-500/40 text-emerald-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Correct Academic Answer:</span>
                        <span className="font-bold">{ans.correctOption}</span>
                      </div>
                    )}
                  </div>

                  {/* Academic Explanation */}
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed">
                    <span className="font-bold text-white block mb-0.5">Solution & Formula:</span>
                    {ans.explanation}
                  </div>

                  {/* Misconception Warning */}
                  {ans.misconception && (
                    <div className="bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/30 text-[11px] text-rose-200 flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Misconception Identified:</span>
                        <span>{ans.misconception}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 7. ACTION CONTROLS BAR */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            Your diagnostic assessment is complete and saved. Continue to your campaign world map or inspect the full AI Roadmap.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={handleRetakeDiagnostic}
              className="px-4 py-3 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold rounded-xl transition flex items-center space-x-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Retake Diagnostic</span>
            </button>

            <button
              onClick={() => handleProceedToDestination('ai-analysis')}
              className="px-4 py-3 bg-indigo-950 hover:bg-indigo-900 border border-indigo-700 text-indigo-200 text-xs font-bold rounded-xl transition flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Inspect AI Roadmap</span>
            </button>

            <button
              onClick={() => handleProceedToDestination('worldmap')}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black rounded-xl transition flex items-center space-x-2 shadow-lg shadow-amber-500/30 uppercase tracking-wider cursor-pointer"
            >
              <Map className="w-4 h-4" />
              <span>Proceed to World Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    );
  }

  // =============================================================
  // VIEW A: 10-QUESTION DIAGNOSTIC QUIZ HUD
  // =============================================================
  const currentDiffMeta = getDifficultyPill(currentQ.difficulty);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* 1. COURSE BANNER & 10-QUESTION SEGMENTED HUD */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        
        {/* Course Info & Question Tracker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                COURSE DIAGNOSTIC ASSESSMENT
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-white font-bold">{course.title}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              10 academic questions: 2 Easy (Q1-2), 4 Medium (Q3-6), 4 Hard (Q7-10).
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className={`px-2.5 py-0.5 rounded text-xs font-black border flex items-center space-x-1 ${currentDiffMeta.badge}`}>
              <span>{currentDiffMeta.icon}</span>
              <span>{currentDiffMeta.label} ({currentDiffMeta.range})</span>
            </span>
            <span className="text-xs text-slate-200 font-black bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              Q{currentIndex + 1} of {preparedQuestions.length}
            </span>
          </div>
        </div>

        {/* Segmented 10-Question Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span className="text-emerald-400 font-bold">Easy (Q1-2)</span>
            <span className="text-cyan-400 font-bold">Medium (Q3-6)</span>
            <span className="text-rose-400 font-bold">Hard (Q7-10)</span>
          </div>

          <div className="grid grid-cols-10 gap-1.5">
            {preparedQuestions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const recordedAns = diagnosticAnswers[idx];

              let segmentBg = 'bg-slate-800/80';
              let segmentBorder = 'border-slate-700/60';

              if (recordedAns) {
                if (recordedAns.isCorrect) {
                  segmentBg = 'bg-emerald-500';
                  segmentBorder = 'border-emerald-400 shadow-sm shadow-emerald-500/50';
                } else {
                  segmentBg = 'bg-rose-500';
                  segmentBorder = 'border-rose-400 shadow-sm shadow-rose-500/50';
                }
              } else if (isCurrent) {
                segmentBg = 'bg-indigo-500 animate-pulse';
                segmentBorder = 'border-indigo-300 ring-2 ring-indigo-400/40';
              } else if (q.difficulty === 'easy') {
                segmentBg = 'bg-emerald-950/40';
                segmentBorder = 'border-emerald-500/20';
              } else if (q.difficulty === 'medium') {
                segmentBg = 'bg-cyan-950/40';
                segmentBorder = 'border-cyan-500/20';
              } else {
                segmentBg = 'bg-rose-950/40';
                segmentBorder = 'border-rose-500/20';
              }

              return (
                <div
                  key={q.id || idx}
                  className={`h-2.5 rounded-full border transition-all duration-300 ${segmentBg} ${segmentBorder}`}
                  title={`Question ${idx + 1}: ${q.difficulty.toUpperCase()} - ${q.concept}`}
                />
              );
            })}
          </div>
        </div>

        {/* Real-time BKT Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">P(Mastery) Model:</span>
              <span className="text-indigo-400 font-black">{(masteryProb * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${masteryProb * 100}%` }} 
              />
            </div>
          </div>

          <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Bayesian Confidence:</span>
              <span className="text-amber-400 font-black">{(confidenceProb * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${confidenceProb * 100}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Bayesian Live Telemetry Log */}
        <div className="flex items-center space-x-2 text-[11px] text-cyan-300/90 bg-cyan-950/40 px-3 py-2 rounded-lg border border-cyan-500/20">
          <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">{bayesianUpdateLog}</span>
        </div>

        {/* Detected Misconceptions Banner if any */}
        {detectedMisconceptions.length > 0 && (
          <div className="flex items-start space-x-2 text-[11px] text-rose-300 bg-rose-950/40 p-3 rounded-lg border border-rose-500/30">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Detected Misconception Flagged:</span>
              <p className="text-slate-300 mt-0.5">{detectedMisconceptions[detectedMisconceptions.length - 1]}</p>
            </div>
          </div>
        )}
      </div>

      {/* 2. QUESTION CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="text-xs text-indigo-300 font-bold">
            Target Concept: <span className="text-white">{currentQ.concept}</span>
          </div>
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-black border uppercase ${currentDiffMeta.badge}`}>
            {currentQ.difficulty} Tier
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-sans font-bold text-white leading-relaxed">
          {currentQ.prompt}
        </h3>

        {/* 4 Options */}
        <div className="space-y-2.5 pt-2">
          {currentQ.options.map((option, idx) => {
            const isChosen = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700';

            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10';
              } else if (isChosen) {
                btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-300 shadow-lg shadow-rose-500/10';
              } else {
                btnStyle = 'bg-slate-950/50 border-slate-900 text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-xl border-2 text-left font-sans text-sm font-semibold transition flex items-center justify-between cursor-pointer ${btnStyle}`}
              >
                <span>{option}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                {isAnswered && isChosen && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Explanation & Advance Control */}
        {isAnswered && (
          <div className="pt-4 border-t border-slate-800 space-y-4 animate-in fade-in duration-200">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-sans text-slate-300 leading-relaxed">
              <span className="font-bold text-white block mb-1">Step-by-Step Explanation:</span>
              {currentQ.explanation}
            </div>

            {selectedOption !== currentQ.correctIndex && currentQ.misconceptionIfChosen?.[selectedOption!] && (
              <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-500/30 text-xs font-sans text-rose-200 leading-relaxed">
                <span className="font-bold text-rose-300 block mb-0.5">Misconception Caught:</span>
                {currentQ.misconceptionIfChosen[selectedOption!]}
              </div>
            )}

            <button
              onClick={handleNextQuestion}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <span>
                {currentIndex < preparedQuestions.length - 1 
                  ? `Proceed to Question ${currentIndex + 2} of 10` 
                  : 'Complete Diagnostic & Generate Analytics Dashboard'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
