'use client';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  FlaskConical,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Circle,
  Trophy,
  Coins,
  ChevronDown,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';
import { 
  getPracticalModelConfig, 
  PracticalModelConfig, 
  SimulationModelType, 
  PRACTICAL_MODELS_CATALOG,
  COURSE_STAGE_METADATA
} from '../data/practicalModelsData';
import {
  computeDerivedMetrics,
  generateDynamicExplanation,
  checkTaskCompletion,
  DerivedLabMetrics
} from '../lib/labExplanationEngine';
import {
  isTaskCompleted,
  markTaskCompleted,
  isLabMastered,
  getCompletedTasksCount
} from '../lib/labStorage';
import SimulationRegistry from './simulations/SimulationRegistry';
import { ACADEMIC_COURSES, CourseData } from './CoursesView';

interface InteractiveLabViewProps {
  initialCourseId?: string;
  initialStageNumber?: number;
  onRewardXp?: (amount: number) => void;
  onRewardGeo?: (amount: number) => void;
  onOpenLectureNotes?: (courseId: string, stageNumber: number) => void;
}

export default function InteractiveLabView({
  initialCourseId = 'course-mechanics',
  initialStageNumber = 1,
  onRewardXp,
  onRewardGeo,
  onOpenLectureNotes
}: InteractiveLabViewProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId);
  const [selectedStageNumber, setSelectedStageNumber] = useState<number>(initialStageNumber);

  // Synchronize state only when parent explicitly changes initial props
  const prevPropsRef = useRef({ initialCourseId, initialStageNumber });
  useEffect(() => {
    if (
      prevPropsRef.current.initialCourseId !== initialCourseId ||
      prevPropsRef.current.initialStageNumber !== initialStageNumber
    ) {
      prevPropsRef.current = { initialCourseId, initialStageNumber };
      setSelectedCourseId(initialCourseId);
      setSelectedStageNumber(initialStageNumber);
    }
  }, [initialCourseId, initialStageNumber]);

  // Active Model Configuration
  const modelConfig: PracticalModelConfig = useMemo(() => {
    return getPracticalModelConfig(selectedCourseId, selectedStageNumber);
  }, [selectedCourseId, selectedStageNumber]);

  // Parameter Overrides per Model ID (guarantees synchronous alignment without render lag)
  const [paramOverrides, setParamOverrides] = useState<Record<string, Record<string, number>>>({});
  const [prevParams, setPrevParams] = useState<Record<string, number> | null>(null);

  // Synchronously compute active params from defaults + current model overrides
  const params: Record<string, number> = useMemo(() => {
    const resolved: Record<string, number> = {};
    modelConfig.parameters.forEach((p) => {
      resolved[p.key] = p.defaultValue;
    });
    const currentModelOverrides = paramOverrides[modelConfig.id];
    if (currentModelOverrides) {
      Object.assign(resolved, currentModelOverrides);
    }
    return resolved;
  }, [modelConfig, paramOverrides]);

  // Derived Metrics (Calculated deterministic 60fps)
  const derived: DerivedLabMetrics = useMemo(() => {
    return computeDerivedMetrics(modelConfig.modelType, params);
  }, [modelConfig.modelType, params]);

  // Dynamic Explanation State
  const dynamicExplanation = useMemo(() => {
    return generateDynamicExplanation(modelConfig.modelType, params, prevParams, derived);
  }, [modelConfig.modelType, params, prevParams, derived]);

  // AI Deep Dive State
  const [aiDeepDive, setAiDeepDive] = useState<{
    explanation: string;
    physicalReason: string;
    realWorldAnalogy: string;
  } | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Task Completion Tracking from localStorage
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);

  const refreshTaskStatus = useCallback(() => {
    const completed = modelConfig.guidedTasks
      .filter((t) => isTaskCompleted(modelConfig.id, t.id))
      .map((t) => t.id);
    setCompletedTaskIds(completed);
  }, [modelConfig]);

  useEffect(() => {
    refreshTaskStatus();
    setAiDeepDive(null);
  }, [modelConfig, refreshTaskStatus]);

  // Parameter Adjustment Handler
  const handleParamChange = (key: string, value: number) => {
    setPrevParams({ ...params });
    setParamOverrides((prev) => ({
      ...prev,
      [modelConfig.id]: {
        ...(prev[modelConfig.id] || {}),
        [key]: value
      }
    }));
  };

  // Reset All to Default
  const handleResetDefaults = () => {
    setPrevParams(params);
    setParamOverrides((prev) => {
      const updated = { ...prev };
      delete updated[modelConfig.id];
      return updated;
    });
  };

  // Claim Task Reward Handler
  const handleClaimTaskReward = (taskId: string, xpReward: number, geoReward: number) => {
    const { isNewCompletion } = markTaskCompleted(modelConfig.id, taskId, modelConfig.guidedTasks.length);
    if (isNewCompletion) {
      if (onRewardXp) onRewardXp(xpReward);
      if (onRewardGeo) onRewardGeo(geoReward);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
      refreshTaskStatus();
    }
  };

  // AI Deep Dive Request Handler
  const handleRequestAiDeepDive = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/lab-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'explain_interaction',
          courseId: selectedCourseId,
          stageNumber: selectedStageNumber,
          subtopicName: modelConfig.subtopicName,
          modelType: modelConfig.modelType,
          currentParams: params,
          previousParams: prevParams,
          derivedMetrics: derived
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAiDeepDive({
            explanation: data.explanation,
            physicalReason: data.physicalReason,
            realWorldAnalogy: data.realWorldAnalogy
          });
        }
      }
    } catch (err) {
      console.warn('Failed to fetch AI deep dive:', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const isMastered = completedTaskIds.length === modelConfig.guidedTasks.length && modelConfig.guidedTasks.length > 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 text-slate-100">
      
      {/* 1. Header & Navigation Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          <div>
            <div className="flex items-center space-x-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
              <FlaskConical className="w-4 h-4 text-cyan-400" />
              <span>Interactive Practical Lab // Real-Time Simulation</span>
              <span className="bg-rose-950/80 text-rose-300 border border-rose-500/40 text-[10px] px-2 py-0.5 rounded-full font-black flex items-center space-x-1">
                <span>🎮</span>
                <span>Interactive Minigame Included</span>
              </span>
              {isMastered && (
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded-full font-black">
                  ★ Lab Mastered
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              {modelConfig.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {modelConfig.overview}
            </p>
          </div>

          {/* Subtopic / Course Dropdown Selectors */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Course Selector */}
            <select
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setSelectedStageNumber(1);
              }}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {ACADEMIC_COURSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            {/* Stage Selector */}
            <select
              value={selectedStageNumber}
              onChange={(e) => setSelectedStageNumber(parseInt(e.target.value))}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {[1, 2, 3, 4, 5].map((s) => {
                const meta = COURSE_STAGE_METADATA[selectedCourseId]?.[s];
                const stageTag = meta ? meta.shortTag : `Stage ${s}`;
                return (
                  <option key={s} value={s}>
                    Stage {s}: {stageTag}
                  </option>
                );
              })}
            </select>

            {/* Lecture Notes Quick-Link Button */}
            {onOpenLectureNotes && (
              <button
                onClick={() => onOpenLectureNotes(selectedCourseId, selectedStageNumber)}
                className="px-3 py-2 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                title="Study Chapter Lecture Notes"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Theory Notes</span>
              </button>
            )}

            {/* Reset All Parameters Button */}
            <button
              onClick={handleResetDefaults}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
              title="Reset all parameters to default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Learning Goals Chips */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Learning Goals:</span>
          {modelConfig.learningGoals.map((goal, idx) => (
            <span
              key={idx}
              className="bg-slate-950/80 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg"
            >
              {goal}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Interactive Simulation Stage */}
      <div className="mb-6">
        <SimulationRegistry
          modelType={modelConfig.modelType}
          params={params}
          derived={derived}
          modelConfig={modelConfig}
          onParamChange={handleParamChange}
        />
      </div>

      {/* 3. Real-Time Parameters Control Panel & Live Formulas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Left 2 Cols: Sliders & Controls */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Interactive Parameter Controls</span>
            </h2>
            <span className="text-[11px] text-slate-400">Values update visuals in real-time</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modelConfig.parameters.map((param) => {
              const currentVal = params[param.key] ?? param.defaultValue;
              return (
                <div
                  key={param.key}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                      <span>{param.label}</span>
                      <span className="text-[10px] text-cyan-400">({param.symbol})</span>
                    </label>
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={currentVal}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) handleParamChange(param.key, val);
                        }}
                        className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right text-xs font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
                      />
                      <span className="text-[10px] text-slate-400">{param.unit}</span>
                    </div>
                  </div>

                  {/* Range Slider */}
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={currentVal}
                    onChange={(e) => handleParamChange(param.key, parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                  />

                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>{param.min} {param.unit}</span>
                    <span className="text-slate-400 max-w-[140px] truncate text-center" title={param.description}>
                      {param.description}
                    </span>
                    <span>{param.max} {param.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Live Formula Cards */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-800">
              <Info className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Live Substituted Formulas
              </h2>
            </div>

            <div className="space-y-3">
              {modelConfig.formulas.map((f, i) => (
                <div
                  key={i}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono"
                >
                  <div className="text-[11px] font-bold text-emerald-400 mb-1">
                    {f.name}
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded border border-slate-800 text-cyan-300 font-bold mb-1 text-[11px] overflow-x-auto">
                    {(() => {
                      try {
                        return typeof f.formatEvaluation === 'function'
                          ? f.formatEvaluation(params, derived)
                          : f.formulaLatex;
                      } catch {
                        return f.formulaLatex;
                      }
                    })()}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center space-x-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Formulas recalculate automatically as sliders move.</span>
          </div>
        </div>

      </div>

      {/* 4. Dynamic AI Concept Explanation Box */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/40 rounded-2xl p-5 mb-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-indigo-500/20">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-indigo-200 uppercase tracking-wider">
              Dynamic Concept Explanation
            </h2>
          </div>
          <button
            onClick={handleRequestAiDeepDive}
            disabled={isLoadingAi}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-md"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
            <span>{isLoadingAi ? 'Consulting Gemini...' : 'Ask AI Deep Dive'}</span>
          </button>
        </div>

        {/* Real-time Natural Language Cause & Effect */}
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {dynamicExplanation}
        </p>

        {/* AI Deep Dive Result (if triggered) */}
        {aiDeepDive && (
          <div className="mt-4 pt-4 border-t border-indigo-500/30 bg-slate-950/70 p-4 rounded-xl space-y-3 font-sans text-xs">
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Physical Principle:</span>
              <p className="text-slate-200 mt-0.5">{aiDeepDive.physicalReason}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Everyday Analogy:</span>
              <p className="text-slate-300 mt-0.5 italic">"{aiDeepDive.realWorldAnalogy}"</p>
            </div>
          </div>
        )}
      </div>

      {/* 5. Gamified Guided Experiments Checklist */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Guided Experiment Challenges ({completedTaskIds.length}/{modelConfig.guidedTasks.length})
            </h2>
          </div>
          <span className="text-xs text-amber-300 font-bold flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Earn XP & Geo by tuning variables</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modelConfig.guidedTasks.map((task) => {
            const isDone = completedTaskIds.includes(task.id);
            const isCurrentlySatisfied = checkTaskCompletion(task, params, derived);

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isDone
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                    : isCurrentlySatisfied
                    ? 'bg-amber-950/40 border-amber-500 animate-pulse text-amber-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <span>{task.title}</span>
                    </span>
                    <div className="flex items-center space-x-1 text-[10px] font-bold text-amber-400">
                      <span>+{task.rewardXp}XP</span>
                      <span>+{task.rewardGeo}G</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                    {task.instruction}
                  </p>

                  <div className="bg-slate-900/90 p-2 rounded border border-slate-800 text-[11px] text-slate-400 mb-3">
                    <strong className="text-slate-300">Hint: </strong>{task.hint}
                  </div>
                </div>

                {/* Claim Button */}
                <div>
                  {isDone ? (
                    <div className="w-full py-1.5 text-center text-xs font-bold text-emerald-400 bg-emerald-950/60 rounded-lg border border-emerald-500/30">
                      ✓ Challenge Completed
                    </div>
                  ) : isCurrentlySatisfied ? (
                    <button
                      onClick={() => handleClaimTaskReward(task.id, task.rewardXp, task.rewardGeo)}
                      className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-lg font-black text-xs transition cursor-pointer shadow-lg shadow-amber-500/20 animate-bounce"
                    >
                      ★ Target Met! Claim Reward
                    </button>
                  ) : (
                    <div className="w-full py-1.5 text-center text-[11px] text-slate-500 bg-slate-900 rounded-lg border border-slate-800">
                      Adjust sliders to match target
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. "What If?" Exploration Prompts */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>"What If?" Conceptual Exploration</span>
        </h3>
        <ul className="space-y-2 text-xs text-slate-300">
          {modelConfig.whatIfPrompts.map((prompt, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span>{prompt}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
