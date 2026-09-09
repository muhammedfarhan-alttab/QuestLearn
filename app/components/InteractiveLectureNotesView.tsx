'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Sparkles,
  Zap,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Layers,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  RotateCcw,
  Compass,
  Trophy,
  Coins,
  Send,
  X,
  Target,
  Bookmark,
  Share2,
  Check,
  Flame,
  Award,
  BookMarked,
  BrainCircuit,
  Maximize2,
  FlaskConical
} from 'lucide-react';
import InteractiveLabModal from './InteractiveLabModal';
import { 
  CHAPTER_LECTURE_CATALOG, 
  getChapterLectureData, 
  ChapterLectureData,
  DifficultyMode,
  KnowledgeCheckItem,
  FlashcardItem 
} from '../data/lectureNotesData';
import {
  loadChapterProgress,
  saveChapterProgress,
  markSectionRead,
  recordQuizAnswer,
  recordFlashcardMastered,
  toggleChecklistItem,
  calculateCompletionPercentage,
  loadPreferredDifficulty,
  savePreferredDifficulty,
  ChapterProgressState
} from '../lib/lectureStorage';
import { ExplainSimplerResponse, AskDoubtResponse, ChapterSummaryResponse } from '../api/lecture-ai/types';

interface InteractiveLectureNotesViewProps {
  initialCourseId?: string;
  initialStageNumber?: number;
  onRewardXp?: (amount: number, reason?: string) => void;
  onRewardGeo?: (amount: number, reason?: string) => void;
  onClose?: () => void;
  onStartStageTest?: (courseId: string, stageNumber: number) => void;
}

const COURSES_NAV = [
  { id: 'course-mechanics', title: 'Classical Mechanics', icon: '🪐', stages: [1, 2, 3, 4, 5] },
  { id: 'course-electromagnetism', title: 'Electricity & Magnetism', icon: '⚡', stages: [1, 2, 3, 4, 5] },
  { id: 'course-calculus', title: 'Calculus & Derivations', icon: '∫', stages: [1, 2, 3, 4, 5] },
  { id: 'course-cs', title: 'Computer Science', icon: '💻', stages: [1, 2, 3, 4, 5] }
];

export default function InteractiveLectureNotesView({
  initialCourseId = 'course-mechanics',
  initialStageNumber = 1,
  onRewardXp,
  onRewardGeo,
  onClose,
  onStartStageTest
}: InteractiveLectureNotesViewProps) {
  // Navigation & Chapter Selection
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId);
  const [selectedStageNumber, setSelectedStageNumber] = useState<number>(initialStageNumber);
  const [activeTab, setActiveTab] = useState<'notes' | 'flashcards' | 'summary'>('notes');
  const [difficulty, setDifficulty] = useState<DifficultyMode>('intermediate');
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);

  // Chapter Content
  const chapterData: ChapterLectureData = useMemo(() => {
    return getChapterLectureData(selectedCourseId, selectedStageNumber);
  }, [selectedCourseId, selectedStageNumber]);

  // Progress State
  const [progress, setProgress] = useState<ChapterProgressState>(() => {
    return loadChapterProgress(selectedCourseId, selectedStageNumber);
  });

  // Reload progress when chapter changes
  useEffect(() => {
    setProgress(loadChapterProgress(selectedCourseId, selectedStageNumber));
    setDifficulty(loadPreferredDifficulty());
  }, [selectedCourseId, selectedStageNumber]);

  // Calculate Metrics
  const totalQuizzes = useMemo(() => {
    return chapterData.sections.reduce((acc, s) => acc + s.knowledgeChecks.length, 0);
  }, [chapterData]);

  const completionMetrics = useMemo(() => {
    return calculateCompletionPercentage(
      progress,
      chapterData.sections.length,
      totalQuizzes,
      chapterData.flashcards.length
    );
  }, [progress, chapterData, totalQuizzes]);

  // AI "Explain Simpler" State
  const [explainingSection, setExplainingSection] = useState<{ title: string; content: string } | null>(null);
  const [isExplainingLoading, setIsExplainingLoading] = useState<boolean>(false);
  const [simplifiedResult, setSimplifiedResult] = useState<ExplainSimplerResponse | null>(null);

  // AI "Ask Doubt" State
  const [doubtText, setDoubtText] = useState<string>('');
  const [isDoubtLoading, setIsDoubtLoading] = useState<boolean>(false);
  const [doubtHistory, setDoubtHistory] = useState<Array<{ question: string; answer: string; example?: string }>>([]);

  // AI "Summary" State
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);
  const [liveSummary, setLiveSummary] = useState<ChapterSummaryResponse | null>(null);

  // Knowledge Checks Interaction State
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<string, number | string | boolean>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  // Flashcards State
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  // Gamification Feedback Toast
  const [rewardToast, setRewardToast] = useState<{ message: string; xp: number; geo: number } | null>(null);

  const triggerReward = (xp: number, geo: number, message: string) => {
    if (onRewardXp) onRewardXp(xp, message);
    if (onRewardGeo) onRewardGeo(geo, message);
    setRewardToast({ message, xp, geo });
    confetti({ particleCount: 35, spread: 55, origin: { y: 0.85 } });
    setTimeout(() => setRewardToast(null), 3500);
  };

  // Difficulty Toggle
  const handleDifficultyChange = (mode: DifficultyMode) => {
    setDifficulty(mode);
    savePreferredDifficulty(mode);
  };

  // Handle Mark Section as Read
  const handleReadSection = (sectionId: string) => {
    const updated = markSectionRead(selectedCourseId, selectedStageNumber, sectionId);
    setProgress({ ...updated });
    if (!progress.readSectionIds.includes(sectionId)) {
      triggerReward(10, 5, 'Studied Section Concept');
    }
  };

  // Handle Knowledge Check Answer Submission
  const handleQuizSubmit = (quiz: KnowledgeCheckItem) => {
    const userAnswer = userQuizAnswers[quiz.id];
    if (userAnswer === undefined || userAnswer === '') return;

    let isCorrect = false;
    if (quiz.type === 'mcq' || quiz.type === 'true_false') {
      isCorrect = Number(userAnswer) === Number(quiz.correctAnswer);
    } else if (quiz.type === 'fill_blank') {
      const cleanUser = String(userAnswer).trim().toLowerCase();
      const cleanAns = String(quiz.blankAnswer || quiz.correctAnswer).trim().toLowerCase();
      isCorrect = cleanUser === cleanAns;
    }

    setQuizSubmitted(prev => ({ ...prev, [quiz.id]: true }));
    const updated = recordQuizAnswer(selectedCourseId, selectedStageNumber, quiz.id, isCorrect);
    setProgress({ ...updated });

    if (isCorrect) {
      triggerReward(quiz.rewardXp, quiz.rewardGeo, 'Knowledge Check Solved!');
    }
  };

  // Trigger AI "Explain Simpler"
  const handleExplainSimpler = async (sectionTitle: string, content: string) => {
    setExplainingSection({ title: sectionTitle, content });
    setIsExplainingLoading(true);
    setSimplifiedResult(null);

    try {
      const res = await fetch('/api/lecture-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'explain_simpler',
          courseTitle: chapterData.chapterTitle,
          chapterTitle: chapterData.chapterTitle,
          sectionTitle,
          content,
          difficulty
        })
      });
      const data = await res.json();
      setSimplifiedResult(data);
    } catch {
      // Fallback
      setSimplifiedResult({
        success: true,
        simplifiedExplanation: `In ${chapterTitleForDisplay}, the core idea is that forces only affect motion along their direct line of action.`,
        everydayAnalogy: 'Think of throwing a paper plane forward while a fan blows straight down.',
        keyRule: 'Keep orthogonal motion components separate!',
        source: 'fallback'
      });
    } finally {
      setIsExplainingLoading(false);
    }
  };

  // Trigger AI "Ask Doubt"
  const handleSendDoubt = async (customText?: string) => {
    const query = customText || doubtText;
    if (!query.trim()) return;

    setIsDoubtLoading(true);
    try {
      const res = await fetch('/api/lecture-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ask_doubt',
          courseTitle: chapterData.chapterTitle,
          chapterTitle: chapterData.chapterTitle,
          conceptFocus: chapterData.conceptFocus,
          studentDoubt: query,
          difficulty
        })
      });
      const data: AskDoubtResponse = await res.json();
      setDoubtHistory(prev => [
        { question: query, answer: data.answer, example: data.example },
        ...prev
      ]);
      setDoubtText('');
      triggerReward(5, 2, 'Curiosity Sparked (AI Doubt)');
    } catch {
      setDoubtHistory(prev => [
        {
          question: query,
          answer: `In ${chapterData.chapterTitle}, this principle holds because total energy and momentum are conserved in isolated frames.`,
          example: 'E.g., gravity exerts a downward force, leaving horizontal velocity completely unaffected.'
        },
        ...prev
      ]);
      setDoubtText('');
    } finally {
      setIsDoubtLoading(false);
    }
  };

  // Trigger AI "Summarize Chapter"
  const handleSummarizeChapter = async () => {
    setIsSummaryLoading(true);
    try {
      const res = await fetch('/api/lecture-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'summarize_chapter',
          courseTitle: chapterData.chapterTitle,
          chapterTitle: chapterData.chapterTitle,
          conceptFocus: chapterData.conceptFocus,
          difficulty
        })
      });
      const data: ChapterSummaryResponse = await res.json();
      setLiveSummary(data);
      triggerReward(20, 10, 'Chapter Summary Generated');
    } catch {
      // Fallback
    } finally {
      setIsSummaryLoading(false);
    }
  };

  // Flashcard Flip & Next
  const activeFlashcard = chapterData.flashcards[currentCardIndex] || chapterData.flashcards[0];

  const handleNextCard = () => {
    setIsCardFlipped(false);
    setCurrentCardIndex(prev => (prev + 1) % chapterData.flashcards.length);
  };

  const handlePrevCard = () => {
    setIsCardFlipped(false);
    setCurrentCardIndex(prev => (prev - 1 + chapterData.flashcards.length) % chapterData.flashcards.length);
  };

  const handleMasterCard = (cardId: string) => {
    const updated = recordFlashcardMastered(selectedCourseId, selectedStageNumber, cardId);
    setProgress({ ...updated });
    triggerReward(15, 10, 'Flashcard Mastered!');
    handleNextCard();
  };

  const chapterTitleForDisplay = chapterData.chapterTitle || `Stage ${selectedStageNumber}`;

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30">
      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER & NAVIGATION BAR                                   */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                Interactive Lecture Notes
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                AI POWERED
              </span>
            </div>
            <h1 className="text-base lg:text-lg font-black text-white flex items-center gap-2">
              <span>{chapterTitleForDisplay}</span>
              <span className="text-xs text-slate-400 font-normal">
                (Stage {selectedStageNumber})
              </span>
            </h1>
          </div>
        </div>

        {/* Course & Chapter Selector */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Course Dropdown */}
          <select
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              setSelectedStageNumber(1);
            }}
            className="bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
          >
            {COURSES_NAV.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.title}
              </option>
            ))}
          </select>

          {/* Stage Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            {[1, 2, 3, 4, 5].map((stg) => (
              <button
                key={stg}
                onClick={() => setSelectedStageNumber(stg)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  selectedStageNumber === stg
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                S{stg}
              </button>
            ))}
          </div>

          {/* Difficulty Modes Pill (Requirement 8) */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => handleDifficultyChange('beginner')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer flex items-center space-x-1 ${
                difficulty === 'beginner'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <span>🟢 Beginner</span>
            </button>
            <button
              onClick={() => handleDifficultyChange('intermediate')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer flex items-center space-x-1 ${
                difficulty === 'intermediate'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              <span>🟡 Medium</span>
            </button>
            <button
              onClick={() => handleDifficultyChange('advanced')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer flex items-center space-x-1 ${
                difficulty === 'advanced'
                  ? 'bg-rose-500 text-white shadow'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              <span>🔴 Advanced</span>
            </button>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* PROGRESS TRACKER BAR (Requirement 1 & 9)                       */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-4 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-300 text-[11px]">
              {completionMetrics.overallPct}%
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Chapter Completion
              </span>
              <div className="w-32 lg:w-48 bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${completionMetrics.overallPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-4 text-[11px] text-slate-400 border-l border-slate-800 pl-4">
            <div>
              📖 Notes: <b className="text-slate-200">{progress.readSectionIds.length}</b>/{chapterData.sections.length}
            </div>
            <div>
              ❓ Quizzes: <b className="text-slate-200">{progress.correctQuizIds.length}</b>/{totalQuizzes}
            </div>
            <div>
              🗂️ Cards: <b className="text-slate-200">{progress.masteredFlashcardIds.length}</b>/{chapterData.flashcards.length}
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Lecture Notes</span>
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'flashcards'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Flashcards ({chapterData.flashcards.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'summary'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Summary & Checklist</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FLOATING REWARD TOAST                                         */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {rewardToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 p-3.5 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-2xl shadow-2xl border border-cyan-400/50 flex items-center space-x-3"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="text-xs font-black">{rewardToast.message}</div>
              <div className="text-[10px] text-cyan-200 flex items-center space-x-2">
                <span>+{rewardToast.xp} XP</span>
                <span>•</span>
                <span>+{rewardToast.geo} Geo</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT CONTAINER                                        */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT / MAIN COLUMN: Notes, Flashcards, or Summary */}
        <div className="lg:col-span-8 space-y-6">

          {/* ========================================================= */}
          {/* TAB 1: LECTURE NOTES & INTERACTIVE KNOWLEDGE CHECKS       */}
          {/* ========================================================= */}
          {activeTab === 'notes' && (
            <div className="space-y-6">

              {/* INTERACTIVE PRACTICAL SIMULATION BANNER */}
              <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/40 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <FlaskConical className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white flex items-center space-x-2">
                      <span>🧪 Interactive Practical Lab for this Chapter</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded">SIM</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Tune real-time physical variables (velocities, vectors, energy meters) before diving into equations.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsLabModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer shadow-md shadow-emerald-500/20 shrink-0 flex items-center space-x-1.5"
                >
                  <FlaskConical className="w-4 h-4" />
                  <span>Launch Lab (+30 XP)</span>
                </button>
              </div>

              {/* HIGHLIGHTED CONCEPTS CARDS (Requirement 4) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Definitions Card */}
                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                    <span>📖 Key Definitions</span>
                  </h3>
                  <div className="space-y-2">
                    {chapterData.highlights.definitions.map((def, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
                        <span className="font-bold text-white block mb-0.5">{def.term}</span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{def.definition}</p>
                        {def.keySymbol && (
                          <span className="inline-block mt-1 font-mono text-[10px] text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            {def.keySymbol}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Key Formulae Card */}
                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                    <span>📐 Governing Formulas</span>
                  </h3>
                  <div className="space-y-2">
                    {chapterData.highlights.formulas.map((form, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-indigo-300">{form.name}</span>
                          <span className="text-[10px] text-slate-500">{form.units}</span>
                        </div>
                        <div className="py-1 px-2 bg-slate-900 rounded font-mono text-cyan-300 text-xs font-bold border border-slate-800 my-1 overflow-x-auto">
                          {form.formula}
                        </div>
                        <p className="text-[10px] text-slate-400 italic">{form.breakdown}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Core Insights / Key Points */}
                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>💡 Core Key Points</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {chapterData.highlights.keyPoints.map((kp, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-amber-400 font-bold mt-0.5">•</span>
                        <span>{kp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. Exam Tips & Traps */}
                <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl">
                  <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>🎯 High-Yield Exam Tips</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {chapterData.highlights.examTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-rose-400 font-bold mt-0.5">⚠️</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* THEORY SECTIONS & "EXPLAIN SIMPLER" (Requirement 1 & 2) */}
              <div className="space-y-6">
                {chapterData.sections.map((sec, secIdx) => {
                  const isRead = progress.readSectionIds.includes(sec.id);

                  return (
                    <div
                      key={sec.id}
                      className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4 shadow-xl hover:border-slate-700 transition"
                    >
                      {/* Section Title & Explain Simpler Action */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div className="flex items-center space-x-2.5">
                          <span className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-xs">
                            {secIdx + 1}
                          </span>
                          <h2 className="text-base font-bold text-white">{sec.title}</h2>
                        </div>

                        <div className="flex items-center space-x-2">
                          {/* "Explain Simpler" Button (Requirement 2) */}
                          <button
                            onClick={() => handleExplainSimpler(sec.title, sec.paragraphs.join(' '))}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black transition flex items-center space-x-1.5 shadow-md shadow-amber-500/20 cursor-pointer uppercase tracking-wider"
                          >
                            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                            <span>Explain Simpler</span>
                          </button>

                          {/* Mark Read Toggle */}
                          <button
                            onClick={() => handleReadSection(sec.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer border ${
                              isRead
                                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            <CheckCircle2 className={`w-3.5 h-3.5 ${isRead ? 'text-emerald-400' : ''}`} />
                            <span>{isRead ? 'Read ✓' : 'Mark Read'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Paragraphs */}
                      <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                        {sec.paragraphs.map((p, pIdx) => (
                          <p key={pIdx}>{p}</p>
                        ))}
                      </div>

                      {/* Equation Box (if present) */}
                      {sec.equation && (
                        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                          <span className="text-[10px] text-indigo-400 font-bold uppercase block">
                            {sec.equation.name}
                          </span>
                          <div className="py-2 px-3 bg-slate-900 rounded font-mono text-cyan-300 text-xs font-bold border border-slate-800 overflow-x-auto">
                            {sec.equation.formula}
                          </div>
                          <p className="text-[11px] text-slate-400 italic">{sec.equation.explanation}</p>
                        </div>
                      )}

                      {/* INTERACTIVE KNOWLEDGE CHECKS (Requirement 5) */}
                      {sec.knowledgeChecks && sec.knowledgeChecks.length > 0 && (
                        <div className="pt-3 border-t border-slate-800/80 space-y-3">
                          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                            <Zap className="w-3.5 h-3.5" />
                            <span>Instant Knowledge Check:</span>
                          </span>

                          <div className="space-y-3">
                            {sec.knowledgeChecks.map((kc) => {
                              const isSubmitted = quizSubmitted[kc.id];
                              const userAnswer = userQuizAnswers[kc.id];
                              const isCorrect = progress.correctQuizIds.includes(kc.id);

                              return (
                                <div
                                  key={kc.id}
                                  className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5 text-xs"
                                >
                                  <div className="flex justify-between items-start">
                                    <p className="font-semibold text-white">{kc.prompt}</p>
                                    <span className="text-[9px] font-bold text-amber-400 uppercase bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30 shrink-0 ml-2">
                                      +{kc.rewardXp} XP
                                    </span>
                                  </div>

                                  {/* MCQ & True/False Options */}
                                  {(kc.type === 'mcq' || kc.type === 'true_false') && kc.options && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {kc.options.map((opt, optIdx) => {
                                        const isSelected = Number(userAnswer) === optIdx;
                                        return (
                                          <button
                                            key={optIdx}
                                            disabled={isSubmitted && isCorrect}
                                            onClick={() =>
                                              setUserQuizAnswers((prev) => ({ ...prev, [kc.id]: optIdx }))
                                            }
                                            className={`p-2 rounded-lg text-left transition border cursor-pointer ${
                                              isSelected
                                                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                                            }`}
                                          >
                                            <span className="font-bold text-slate-400 mr-1.5">
                                              {String.fromCharCode(65 + optIdx)}.
                                            </span>
                                            <span>{opt}</span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {/* Fill in Blank Input */}
                                  {kc.type === 'fill_blank' && (
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="text"
                                        placeholder="Type correct term or value..."
                                        disabled={isSubmitted && isCorrect}
                                        value={typeof userAnswer === 'string' ? userAnswer : ''}
                                        onChange={(e) =>
                                          setUserQuizAnswers((prev) => ({ ...prev, [kc.id]: e.target.value }))
                                        }
                                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                                      />
                                    </div>
                                  )}

                                  {/* Submit Button */}
                                  {!isSubmitted && (
                                    <button
                                      onClick={() => handleQuizSubmit(kc)}
                                      disabled={userAnswer === undefined || userAnswer === ''}
                                      className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black rounded-lg text-xs transition cursor-pointer"
                                    >
                                      Check Answer
                                    </button>
                                  )}

                                  {/* Instant Feedback Reveal */}
                                  {isSubmitted && (
                                    <div
                                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                                        isCorrect
                                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                                          : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                                      }`}
                                    >
                                      <div className="font-bold flex items-center space-x-1.5">
                                        {isCorrect ? (
                                          <>
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                            <span>Correct! Well done.</span>
                                          </>
                                        ) : (
                                          <>
                                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                                            <span>Incorrect — Check explanation below:</span>
                                          </>
                                        )}
                                      </div>
                                      <p className="text-[11px] text-slate-300 leading-relaxed">
                                        {kc.explanation}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: 3D INTERACTIVE FLASHCARDS (Requirement 7)          */}
          {/* ========================================================= */}
          {activeTab === 'flashcards' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white">Concept Flashcard Deck</h2>
                  <p className="text-xs text-slate-400">
                    Card {currentCardIndex + 1} of {chapterData.flashcards.length}
                  </p>
                </div>
                <span className="text-xs font-bold text-cyan-400 bg-cyan-950/50 border border-cyan-500/30 px-3 py-1 rounded-xl">
                  {progress.masteredFlashcardIds.length} Mastered
                </span>
              </div>

              {/* 3D Flip Card Container */}
              <div className="flex flex-col items-center justify-center py-6">
                <div
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                  className="w-full max-w-lg h-72 cursor-pointer perspective-1000 group"
                >
                  <motion.div
                    animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="relative w-full h-full rounded-3xl preserve-3d shadow-2xl"
                  >
                    {/* FRONT SIDE */}
                    <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border-2 border-indigo-500/40 rounded-3xl p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider bg-indigo-900/50 px-2 py-0.5 rounded border border-indigo-500/30">
                          {activeFlashcard.category}
                        </span>
                        <span className="text-xs text-slate-400">Click to Flip 🔄</span>
                      </div>

                      <div className="text-center my-auto">
                        <span className="text-xs text-cyan-400 font-bold uppercase block mb-1">
                          {activeFlashcard.concept}
                        </span>
                        <h3 className="text-lg font-bold text-white px-4 leading-snug">
                          {activeFlashcard.front}
                        </h3>
                      </div>

                      <p className="text-center text-[10px] text-slate-500">
                        Tap anywhere on card to reveal explanation
                      </p>
                    </div>

                    {/* BACK SIDE (Rotated 180deg) */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-2 border-cyan-500/40 rounded-3xl p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider bg-cyan-900/50 px-2 py-0.5 rounded border border-cyan-500/30">
                          Explanation & Solution
                        </span>
                        <span className="text-xs text-slate-400">Click to Flip 🔄</span>
                      </div>

                      <div className="text-center my-auto px-4">
                        <p className="text-sm font-medium text-slate-200 leading-relaxed">
                          {activeFlashcard.back}
                        </p>
                      </div>

                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMasterCard(activeFlashcard.id);
                          }}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition flex items-center space-x-1.5 shadow"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Got It! (+15 XP)</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Deck Navigation Controls */}
                <div className="flex items-center space-x-4 mt-6">
                  <button
                    onClick={handlePrevCard}
                    className="p-3 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white rounded-xl transition cursor-pointer"
                  >
                    {isCardFlipped ? 'Show Question' : 'Reveal Answer'}
                  </button>
                  <button
                    onClick={handleNextCard}
                    className="p-3 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: AI CHAPTER SUMMARY & CHECKLIST (Requirement 6)     */}
          {/* ========================================================= */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Trigger AI Summarize Button */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-white">AI Chapter Executive Summary</h2>
                  <p className="text-xs text-slate-400">
                    High-yield revision sheet with formulas, common traps, and checklist.
                  </p>
                </div>
                <button
                  onClick={handleSummarizeChapter}
                  disabled={isSummaryLoading}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black rounded-xl transition flex items-center space-x-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>{isSummaryLoading ? 'Analyzing...' : 'Summarize Chapter'}</span>
                </button>
              </div>

              {/* Five Key Takeaways */}
              <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
                  <Bookmark className="w-4 h-4" />
                  <span>5 Key Takeaways:</span>
                </h3>
                <div className="space-y-2">
                  {(liveSummary?.fiveKeyTakeaways || chapterData.summary.fiveKeyTakeaways).map((takeaway, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start space-x-2.5 text-xs text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{takeaway}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Exam Mistakes */}
              <div className="p-5 bg-rose-950/20 border border-rose-500/30 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>High-Frequency Exam Traps to Avoid:</span>
                </h3>
                <div className="space-y-3">
                  {(liveSummary?.commonMistakes || chapterData.summary.commonMistakes).map((mistake, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                      <span className="text-rose-400 font-bold block">❌ Mistake: {mistake.mistake}</span>
                      <span className="text-emerald-300 font-medium block">✓ Correction: {mistake.correction}</span>
                      <p className="text-slate-400 text-[11px] italic mt-1">{mistake.why}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Revision Checklist */}
              <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Interactive Revision Checklist:</span>
                </h3>
                <div className="space-y-2">
                  {(liveSummary?.revisionChecklist || chapterData.summary.revisionChecklist).map((item) => {
                    const isChecked = progress.completedChecklistIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          const updated = toggleChecklistItem(selectedCourseId, selectedStageNumber, item.id);
                          setProgress({ ...updated });
                          if (!isChecked) triggerReward(10, 5, 'Checklist Item Verified');
                        }}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center space-x-3 ${
                          isChecked
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          isChecked ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className={`font-bold text-xs ${isChecked ? 'line-through text-emerald-300/80' : 'text-white'}`}>
                            {item.label}
                          </div>
                          <div className="text-[11px] text-slate-400">{item.details}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: AI Doubt & Simpler Explanation Panel        */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 space-y-6">

          {/* AI "EXPLAIN SIMPLER" SLIDE-OVER / POPUP (Requirement 2) */}
          {explainingSection && (
            <div className="p-5 bg-gradient-to-b from-indigo-950/80 to-slate-900 border border-indigo-500/50 rounded-2xl shadow-2xl space-y-3 relative">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                  AI Simpler Explanation ({difficulty})
                </span>
                <button
                  onClick={() => setExplainingSection(null)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-sm font-bold text-white">{explainingSection.title}</h3>

              {isExplainingLoading ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-2 text-xs text-indigo-300">
                  <Sparkles className="w-6 h-6 animate-spin" />
                  <span>Gemini is translating into intuitive analogies...</span>
                </div>
              ) : simplifiedResult ? (
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-slate-200">
                    {simplifiedResult.simplifiedExplanation}
                  </div>

                  {simplifiedResult.everydayAnalogy && (
                    <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-amber-200/90">
                      <span className="font-bold text-[10px] text-amber-400 uppercase block mb-1">
                        🎯 Everyday Analogy:
                      </span>
                      {simplifiedResult.everydayAnalogy}
                    </div>
                  )}

                  {simplifiedResult.keyRule && (
                    <div className="p-2.5 bg-indigo-950/50 border border-indigo-500/40 rounded-xl text-indigo-300 font-semibold text-[11px]">
                      ⭐ Golden Exam Rule: {simplifiedResult.keyRule}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* AI ASK DOUBT CONSOLE (Requirement 3 & 11) */}
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">AI Doubt Solver</h3>
                <span className="text-[10px] text-slate-400">Context: {chapterTitleForDisplay}</span>
              </div>
            </div>

            {/* Quick Prompt Chips (Requirement 3) */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Quick Questions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleSendDoubt('Why does this happen?')}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] text-cyan-300 transition cursor-pointer"
                >
                  "Why does this happen?"
                </button>
                <button
                  onClick={() => handleSendDoubt('Explain this formula step-by-step')}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] text-indigo-300 transition cursor-pointer"
                >
                  "Explain this formula"
                </button>
                <button
                  onClick={() => handleSendDoubt('Give a real life example of this')}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] text-amber-300 transition cursor-pointer"
                >
                  "Give a real life example"
                </button>
              </div>
            </div>

            {/* Custom Doubt Input Box */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={doubtText}
                onChange={(e) => setDoubtText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendDoubt()}
                placeholder="Ask any doubt about this chapter..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={() => handleSendDoubt()}
                disabled={isDoubtLoading || !doubtText.trim()}
                className="p-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 rounded-xl transition cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Live Doubt History Thread */}
            {doubtHistory.length > 0 && (
              <div className="space-y-3 pt-2 max-h-80 overflow-y-auto pr-1">
                {doubtHistory.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                    <div className="font-bold text-cyan-300 flex items-center space-x-1.5">
                      <span>Q:</span>
                      <span>{item.question}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{item.answer}</p>
                    {item.example && (
                      <div className="p-2 bg-slate-900 rounded-lg text-[10px] text-amber-200/90 border border-slate-800">
                        {item.example}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Launch Stage Test Action */}
          {onStartStageTest && (
            <div className="p-5 bg-gradient-to-r from-cyan-950 to-indigo-950 border border-cyan-500/30 rounded-2xl space-y-2 text-center">
              <h4 className="text-xs font-bold text-white">Ready for Combat Evaluation?</h4>
              <p className="text-[11px] text-slate-400">
                Put your mastery to the test in the Bleach combat arena!
              </p>
              <button
                onClick={() => onStartStageTest(selectedCourseId, selectedStageNumber)}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 via-indigo-600 to-amber-500 hover:from-cyan-400 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-lg shadow-indigo-600/30"
              >
                Attend Stage {selectedStageNumber} Combat Test
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Practical Simulation Lab Modal */}
      <InteractiveLabModal
        isOpen={isLabModalOpen}
        onClose={() => setIsLabModalOpen(false)}
        initialCourseId={selectedCourseId}
        initialStageNumber={selectedStageNumber}
        onRewardXp={onRewardXp}
        onRewardGeo={onRewardGeo}
      />
    </div>
  );
}
