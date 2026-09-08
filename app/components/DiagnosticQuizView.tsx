'use client';
import React, { useState } from 'react';
import { 
  Zap, 
  BrainCircuit, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles,
  BookOpen,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CourseData, ACADEMIC_COURSES } from './CoursesView';

export interface DiagnosticQuestion {
  id: string;
  concept: string;
  difficulty: 'L1' | 'L2' | 'L3' | 'L4';
  difficultyName: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  misconceptionIfChosen?: Record<number, string>;
}

export const COURSE_DIAGNOSTIC_BANK: Record<string, DiagnosticQuestion[]> = {
  'course-mechanics': [
    {
      id: 'mech-1',
      concept: 'Vector Displacement & Kinematics',
      difficulty: 'L1',
      difficultyName: 'Recall & Recognition',
      prompt: 'A particle moves 4.0 meters North, then turns and moves 3.0 meters East. What is the magnitude of its total displacement?',
      options: ['5.0 m', '7.0 m', '1.0 m', '12.0 m'],
      correctIndex: 0,
      explanation: 'Displacement is the vector hypotenuse: √(4² + 3²) = √(16 + 9) = √25 = 5.0 meters.',
      misconceptionIfChosen: {
        1: 'Treated displacement as scalar scalar path distance (4 + 3 = 7m) instead of vector difference.'
      }
    },
    {
      id: 'mech-2',
      concept: 'Newton’s Second Law & Inertia',
      difficulty: 'L2',
      difficultyName: 'Conceptual Application',
      prompt: 'A constant net force F accelerates an object of mass m at acceleration a. If the mass is doubled and the applied force is halved, what is the new acceleration?',
      options: ['a / 4', 'a / 2', 'a', '2a'],
      correctIndex: 0,
      explanation: 'From a = F / m: new acceleration = (F/2) / (2m) = F / (4m) = a / 4.',
      misconceptionIfChosen: {
        1: 'Only adjusted for force reduction without dividing by doubled mass.'
      }
    },
    {
      id: 'mech-3',
      concept: 'Work-Energy Theorem & Potential Wells',
      difficulty: 'L3',
      difficultyName: 'Analytical Synthesis',
      prompt: 'A 2.0 kg block slides from rest down a frictionless curved ramp with a vertical height of 5.0 m (g = 9.8 m/s²). What is its kinetic energy at the bottom?',
      options: ['98 J', '49 J', '196 J', '10 J'],
      correctIndex: 0,
      explanation: 'By Conservation of Mechanical Energy: ΔK = -ΔU = mgh = (2.0)(9.8)(5.0) = 98 Joules.',
      misconceptionIfChosen: {
        1: 'Forgot to multiply by mass or used m = 1kg.'
      }
    },
    {
      id: 'mech-4',
      concept: 'Conservation of Linear Momentum',
      difficulty: 'L4',
      difficultyName: 'Complex Transfer',
      prompt: 'A 3.0 kg object moving at 4.0 m/s collides and sticks to a stationary 1.0 kg object. What is the final velocity of the combined mass?',
      options: ['3.0 m/s', '4.0 m/s', '1.0 m/s', '2.0 m/s'],
      correctIndex: 0,
      explanation: 'Inelastic collision: p_initial = (3.0 kg)(4.0 m/s) = 12 kg·m/s. Total mass = 4.0 kg. v_final = 12 / 4.0 = 3.0 m/s.',
      misconceptionIfChosen: {
        1: 'Assumed velocity remains conserved independently of mass distribution.'
      }
    }
  ],
  'course-electromagnetism': [
    {
      id: 'em-1',
      concept: 'Coulomb’s Electrostatic Law',
      difficulty: 'L1',
      difficultyName: 'Fundamental Law',
      prompt: 'If the distance r between two identical static charges is tripled, how does the electrostatic force between them change?',
      options: ['Decreases to 1/9 of its value', 'Decreases to 1/3 of its value', 'Increases by 9x', 'Remains unchanged'],
      correctIndex: 0,
      explanation: 'Coulomb’s law follows an inverse-square relationship: F ∝ 1/r². If r → 3r, F → F/9.',
      misconceptionIfChosen: {
        1: 'Assumed an inverse linear relationship (1/r) rather than inverse-square (1/r²).'
      }
    },
    {
      id: 'em-2',
      concept: 'Gauss’s Law & Net Enclosed Flux',
      difficulty: 'L2',
      difficultyName: 'Conceptual Application',
      prompt: 'A spherical Gaussian surface encloses charges +3q, -q, and -2q. What is the total net electric flux through the surface?',
      options: ['0', '+3q / ε₀', '-3q / ε₀', 'q / ε₀'],
      correctIndex: 0,
      explanation: 'Total enclosed charge Q_enc = (+3q) + (-q) + (-2q) = 0. By Gauss’s Law, Φ_E = Q_enc / ε₀ = 0.',
      misconceptionIfChosen: {
        1: 'Counted only positive charges, ignoring negative charge cancellation.'
      }
    },
    {
      id: 'em-3',
      concept: 'Ohm’s Law & Parallel Resistors',
      difficulty: 'L3',
      difficultyName: 'Circuit Analysis',
      prompt: 'Two identical 10 Ω resistors are connected in parallel across a 12 V battery. What is the total current drawn from the battery?',
      options: ['2.4 A', '0.6 A', '1.2 A', '5.0 A'],
      correctIndex: 0,
      explanation: 'Equivalent resistance R_eq = (10 × 10) / (10 + 10) = 5 Ω. Total current I = V / R_eq = 12 V / 5 Ω = 2.4 A.',
      misconceptionIfChosen: {
        1: 'Added resistances in series (20 Ω) instead of parallel (5 Ω).'
      }
    },
    {
      id: 'em-4',
      concept: 'Lorentz Magnetic Force',
      difficulty: 'L4',
      difficultyName: 'Vector Right-Hand Rule',
      prompt: 'A proton travels horizontally East through a uniform magnetic field directed vertically Upward. In which direction is the magnetic force on the proton?',
      options: ['South', 'North', 'West', 'Downward'],
      correctIndex: 0,
      explanation: 'Using the Right-Hand Rule (F = q(v × B)): index finger East, middle finger Upward, thumb points South.',
      misconceptionIfChosen: {
        1: 'Inverted the right-hand cross product vector orientation.'
      }
    }
  ],
  'course-calculus': [
    {
      id: 'calc-1',
      concept: 'Fundamental Limits & Continuity',
      difficulty: 'L1',
      difficultyName: 'Foundational Limits',
      prompt: 'Evaluate the classic limit: lim (x → 0) [ sin(3x) / x ].',
      options: ['3', '1', '0', 'Does not exist'],
      correctIndex: 0,
      explanation: 'lim (x → 0) [ sin(kx) / x ] = k. Here k = 3, so the limit is 3.',
      misconceptionIfChosen: {
        1: 'Recalled only the base standard limit lim [sin(x)/x] = 1 without scaling by internal factor 3.'
      }
    },
    {
      id: 'calc-2',
      concept: 'Differential Calculus & Chain Rule',
      difficulty: 'L2',
      difficultyName: 'Derivative Rules',
      prompt: 'Find the derivative: d/dx [ (2x² + 1)³ ].',
      options: ['12x (2x² + 1)²', '3 (2x² + 1)²', '6x (2x² + 1)²', '4x (2x² + 1)³'],
      correctIndex: 0,
      explanation: 'By Chain Rule: d/dx[u³] = 3u² · u\' = 3(2x² + 1)² · (4x) = 12x(2x² + 1)².',
      misconceptionIfChosen: {
        1: 'Differentiated outer power but omitted multiplying by inner derivative (4x).'
      }
    },
    {
      id: 'calc-3',
      concept: 'Critical Points & Second Derivative Test',
      difficulty: 'L3',
      difficultyName: 'Optimization Theory',
      prompt: 'For a twice-differentiable function f(x), f\'(c) = 0 and f\'\'(c) < 0. What occurs at x = c?',
      options: ['Local Maximum', 'Local Minimum', 'Point of Inflection', 'Vertical Asymptote'],
      correctIndex: 0,
      explanation: 'If f\'(c) = 0 and f\'\'(c) < 0, the curve is concave downward at the stationary point, yielding a local maximum.',
      misconceptionIfChosen: {
        1: 'Confused concavity: thought negative second derivative means minimum.'
      }
    },
    {
      id: 'calc-4',
      concept: 'Definite Integration & Riemann Accumulation',
      difficulty: 'L4',
      difficultyName: 'Area Under Curve',
      prompt: 'Evaluate the definite integral: ∫ from 0 to 2 of (3x² + 2) dx.',
      options: ['12', '8', '14', '10'],
      correctIndex: 0,
      explanation: 'Antiderivative F(x) = x³ + 2x. Evaluating F(2) - F(0) = (2³ + 2(2)) - 0 = 8 + 4 = 12.',
      misconceptionIfChosen: {
        1: 'Integrated 3x² to 3x³/3 = x³ (giving 8) but forgot the +2x term.'
      }
    }
  ],
  'course-cs': [
    {
      id: 'cs-1',
      concept: 'Asymptotic Analysis & Big-O',
      difficulty: 'L1',
      difficultyName: 'Complexity Theory',
      prompt: 'What is the average and worst-case time complexity of searching in a self-balancing binary search tree (AVL tree) of n nodes?',
      options: ['O(log n)', 'O(n)', 'O(1)', 'O(n log n)'],
      correctIndex: 0,
      explanation: 'Because an AVL tree guarantees height h ≤ 1.44 log₂(n), lookup is strictly bounded by O(log n).',
      misconceptionIfChosen: {
        1: 'Confused balanced tree with an un-balanced degenerate linked-list tree (O(n)).'
      }
    },
    {
      id: 'cs-2',
      concept: 'Execution Context & Lexical Closures',
      difficulty: 'L2',
      difficultyName: 'Language Semantics',
      prompt: 'Which mechanism enables an inner function to retain lexical access to outer variables even after the outer parent function has returned?',
      options: ['A Closure', 'Prototypal Inheritance', 'Variable Hoisting', 'Event Loop Microtask'],
      correctIndex: 0,
      explanation: 'A closure is the combination of a function bundled together with references to its surrounding lexical environment.',
      misconceptionIfChosen: {
        1: 'Confused object prototype delegation with lexical scope closure retention.'
      }
    },
    {
      id: 'cs-3',
      concept: 'Optimal Substructure & Dynamic Programming',
      difficulty: 'L3',
      difficultyName: 'Algorithmic Paradigms',
      prompt: 'Which two core properties are strictly required to solve an optimization problem via Dynamic Programming?',
      options: [
        'Optimal Substructure and Overlapping Subproblems',
        'Greedy Choice and Constant Space Allocation',
        'Strictly First-In-First-Out Queuing and Monotonicity',
        'Pure Immutability and Tail Recursion'
      ],
      correctIndex: 0,
      explanation: 'Dynamic programming requires that an optimal global solution can be composed of optimal solutions to subproblems, and that identical subproblems are solved repeatedly.',
      misconceptionIfChosen: {
        1: 'Confused dynamic programming with greedy algorithms.'
      }
    },
    {
      id: 'cs-4',
      concept: 'Graph Algorithms & All-Pairs Shortest Path',
      difficulty: 'L4',
      difficultyName: 'Graph Theory',
      prompt: 'Which algorithm finds shortest paths between all pairs of vertices in a weighted graph in O(V³) time?',
      options: ['Floyd-Warshall Algorithm', 'Dijkstra’s Algorithm', 'Kruskal’s Algorithm', 'Breadth-First Search'],
      correctIndex: 0,
      explanation: 'Floyd-Warshall evaluates all vertex pairs (i, j) via intermediate vertices k in O(V³) using dynamic programming.',
      misconceptionIfChosen: {
        1: 'Dijkstra solves single-source shortest path, not all-pairs directly without V iterations.'
      }
    }
  ]
};

export interface DiagnosticResult {
  courseId: string;
  overallMastery: number;
  diagnosedGaps: string[];
  scores?: Record<string, number>;
}

export default function DiagnosticQuizView({
  course = ACADEMIC_COURSES[0],
  onFinishDiagnostic
}: {
  course?: CourseData;
  onFinishDiagnostic: (results: DiagnosticResult) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Real-time BKT state tracking
  const [masteryProb, setMasteryProb] = useState(0.40);
  const [confidenceProb, setConfidenceProb] = useState(0.45);
  const [bayesianUpdateLog, setBayesianUpdateLog] = useState<string>('Prior uncalibrated. Initializing diagnostic belief state.');
  const [detectedMisconceptions, setDetectedMisconceptions] = useState<string[]>([]);
  const [conceptScores, setConceptScores] = useState<Record<string, number>>({});

  const questions = COURSE_DIAGNOSTIC_BANK[course.id] || COURSE_DIAGNOSTIC_BANK['course-mechanics'];
  const currentQ = questions[currentIndex] || questions[0];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    const scoreVal = isCorrect ? 100 : Math.max(20, Math.round(masteryProb * 100));
    setConceptScores(prev => ({ ...prev, [currentQ.concept]: scoreVal }));

    if (isCorrect) {
      // Bayesian positive update
      const newMastery = Math.min(0.96, masteryProb + 0.16);
      const newConf = Math.min(0.95, confidenceProb + 0.15);
      setMasteryProb(newMastery);
      setConfidenceProb(newConf);
      setBayesianUpdateLog(`P(Mastery | Correct) increased from ${(masteryProb * 100).toFixed(0)}% to ${(newMastery * 100).toFixed(0)}%. Likelihood of student mastery increased.`);
      
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
    } else {
      // Bayesian negative update & misconception detection
      const newMastery = Math.max(0.18, masteryProb - 0.16);
      const newConf = Math.min(0.95, confidenceProb + 0.12);
      setMasteryProb(newMastery);
      setConfidenceProb(newConf);

      const misconception = currentQ.misconceptionIfChosen?.[idx];
      if (misconception) {
        setDetectedMisconceptions(prev => Array.from(new Set([...prev, misconception])));
        setBayesianUpdateLog(`P(Mastery | Mistake) dropped to ${(newMastery * 100).toFixed(0)}%. Misconception flagged: "${misconception}"`);
      } else {
        setBayesianUpdateLog(`P(Mastery | Mistake) decreased to ${(newMastery * 100).toFixed(0)}%. High remediation priority registered.`);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      const finalScores = {
        ...conceptScores,
        [currentQ.concept]: (selectedOption === currentQ.correctIndex) ? 100 : 25
      };
      onFinishDiagnostic({
        courseId: course.id,
        overallMastery: masteryProb,
        diagnosedGaps: detectedMisconceptions,
        scores: finalScores
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-300 font-mono">
      
      {/* 1. COURSE BANNER & BKT MONITOR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                COURSE DIAGNOSTIC
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-white font-bold">{course.title}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Complete this 4-step diagnostic assessment to unlock your course and generate your AI Personalized World Map.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <BrainCircuit className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-slate-300 font-bold">
              Q{currentIndex + 1} of {questions.length}
            </span>
          </div>
        </div>

        {/* Real-time BKT Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* Misconception Alert if any */}
        {detectedMisconceptions.length > 0 && (
          <div className="flex items-start space-x-2 text-[11px] text-rose-300 bg-rose-950/40 p-3 rounded-lg border border-rose-500/30">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Detected Misconception to Remediate:</span>
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
          <span className="px-2.5 py-0.5 rounded text-[10px] bg-slate-950 text-slate-300 border border-slate-700">
            {currentQ.difficulty} • {currentQ.difficultyName}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-sans font-bold text-white leading-relaxed">
          {currentQ.prompt}
        </h3>

        {/* Options */}
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
                onClick={() => handleSelect(idx)}
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

        {/* Explanation & Next Step */}
        {isAnswered && (
          <div className="pt-4 border-t border-slate-800 space-y-4 animate-in fade-in duration-200">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-sans text-slate-300 leading-relaxed">
              <span className="font-bold text-white block mb-1">Explanation:</span>
              {currentQ.explanation}
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <span>
                {currentIndex < questions.length - 1 
                  ? 'Proceed to Next Diagnostic Question' 
                  : 'Complete Diagnostic & Unlock World Map'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
