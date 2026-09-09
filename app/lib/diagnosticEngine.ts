/**
 * QuestLearn - Diagnostics Engine
 * 
 * Strict Curriculum Requirements:
 * - Each diagnostic test contains exactly 10 questions:
 *   - 2 Easy Questions
 *   - 4 Medium Questions
 *   - 4 Hard Questions
 * 
 * Skill Level Determination:
 * - 0-3 correct: Beginner
 * - 4-7 correct: Intermediate
 * - 8-10 correct: Advanced
 * 
 * Storage & Integration:
 * - Persists diagnostic summaries for future AI question generation.
 * - Formulates strengths, weaknesses, and sequential learning paths.
 */

export type DiagnosticDifficulty = 'easy' | 'medium' | 'hard';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface DiagnosticQuestion {
  id: string;
  courseId: string;
  difficulty: DiagnosticDifficulty;
  concept: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  misconceptionIfChosen?: Record<number, string>;
}

export interface DiagnosticAnswer {
  questionId: string;
  concept: string;
  difficulty: DiagnosticDifficulty;
  prompt: string;
  selectedOption: string;
  selectedIndex: number;
  correctOption: string;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
  misconception?: string;
}

export interface LearningPathStep {
  stepNumber: number;
  topic: string;
  description: string;
  estimatedHours: number;
  difficulty: string;
  focusArea: 'Foundations' | 'Core Application' | 'Remediation' | 'Advanced Mastery';
}

export interface DiagnosticSummary {
  courseId: string;
  courseTitle: string;
  totalQuestions: number; // Strictly 10
  correctCount: number;   // 0-10
  scorePercentage: number; // 0-100%
  skillLevel: SkillLevel;  // Beginner | Intermediate | Advanced
  difficultyStats: {
    easy: { total: number; correct: number; percentage: number };
    medium: { total: number; correct: number; percentage: number };
    hard: { total: number; correct: number; percentage: number };
  };
  strengths: string[];
  weaknesses: string[];
  learningPath: LearningPathStep[];
  answers: DiagnosticAnswer[];
  completedAt: string;
}

/**
 * Calculates student skill level based on correct answers count:
 * - 0-3 correct: Beginner
 * - 4-7 correct: Intermediate
 * - 8-10 correct: Advanced
 */
export function calculateSkillLevel(correctCount: number): SkillLevel {
  const safeCount = Math.max(0, Math.min(10, Math.round(correctCount)));
  if (safeCount <= 3) return 'Beginner';
  if (safeCount <= 7) return 'Intermediate';
  return 'Advanced';
}

/**
 * Returns color, badge, and description for each skill level
 */
export function getSkillLevelMeta(skillLevel: SkillLevel) {
  switch (skillLevel) {
    case 'Beginner':
      return {
        level: 'Beginner',
        tagline: 'Foundational Learner',
        description: 'Prioritize fundamental principles, foundational mechanics, and core definitions before tackling advanced problem sets.',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        gradient: 'from-amber-500 to-orange-600',
        textColor: 'text-amber-400',
        icon: '🌱'
      };
    case 'Intermediate':
      return {
        level: 'Intermediate',
        tagline: 'Proficient Practitioner',
        description: 'Solid conceptual foundation demonstrated. Focus on bridging edge cases, multi-step synthesis, and timed problem solving.',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        gradient: 'from-cyan-500 to-indigo-600',
        textColor: 'text-cyan-400',
        icon: '⚡'
      };
    case 'Advanced':
    default:
      return {
        level: 'Advanced',
        tagline: 'Apex Scholar',
        description: 'Exceptional mastery across foundational, intermediate, and complex analytical questions. Ready for high-rigor boss gauntlets.',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        gradient: 'from-emerald-500 to-teal-600',
        textColor: 'text-emerald-400',
        icon: '👑'
      };
  }
}

/**
 * Generates sequential learning path based on skill level and diagnosed weaknesses
 */
export function determineLearningPath(
  skillLevel: SkillLevel,
  weaknesses: string[],
  strengths: string[],
  courseId: string
): LearningPathStep[] {
  const needsRemediation = weaknesses.length > 0;

  if (skillLevel === 'Beginner') {
    return [
      {
        stepNumber: 1,
        topic: 'Foundational Remediation & Core Laws',
        description: `Review fundamental axioms and basic formulas (${needsRemediation ? weaknesses.slice(0, 2).join(', ') : 'Core Concepts'}).`,
        estimatedHours: 5,
        difficulty: 'Easy',
        focusArea: 'Foundations'
      },
      {
        stepNumber: 2,
        topic: 'Guided Conceptual Practice',
        description: 'Solve guided two-step numerical and conceptual problems with step-by-step feedback.',
        estimatedHours: 6,
        difficulty: 'Easy to Medium',
        focusArea: 'Remediation'
      },
      {
        stepNumber: 3,
        topic: 'Core Application & Synthesis',
        description: 'Tackle standard exam problems and build formula fluency without hints.',
        estimatedHours: 5,
        difficulty: 'Medium',
        focusArea: 'Core Application'
      },
      {
        stepNumber: 4,
        topic: 'Milestone Boss Battle Assessment',
        description: 'Face the guardian demigod to prove mastery and unlock intermediate stage nodes.',
        estimatedHours: 4,
        difficulty: 'Medium',
        focusArea: 'Advanced Mastery'
      }
    ];
  }

  if (skillLevel === 'Intermediate') {
    return [
      {
        stepNumber: 1,
        topic: 'Targeted Remediation on Weak Areas',
        description: `Zero in on flagged misconceptions in ${weaknesses.length > 0 ? weaknesses.join(', ') : 'advanced transfer'}.`,
        estimatedHours: 4,
        difficulty: 'Medium',
        focusArea: 'Remediation'
      },
      {
        stepNumber: 2,
        topic: 'Multi-Step Problem Synthesis',
        description: `Expand strengths in ${strengths.slice(0, 2).join(', ') || 'applied domains'} into composite multi-variable scenarios.`,
        estimatedHours: 5,
        difficulty: 'Medium to Hard',
        focusArea: 'Core Application'
      },
      {
        stepNumber: 3,
        topic: 'High-Speed Timed Trials',
        description: 'Complete timed combat rounds against aggressive Espada strike timers.',
        estimatedHours: 4,
        difficulty: 'Hard',
        focusArea: 'Advanced Mastery'
      },
      {
        stepNumber: 4,
        topic: 'Stage Boss Conqueror Battle',
        description: 'Engage Phase 2 boss encounters with flawless combo streaks.',
        estimatedHours: 3,
        difficulty: 'Hard',
        focusArea: 'Advanced Mastery'
      }
    ];
  }

  // Advanced
  return [
    {
      stepNumber: 1,
      topic: 'Rapid Precision Review',
      description: `Solidify comprehensive mastery with edge-case exploration${needsRemediation ? ` in ${weaknesses[0]}` : ''}.`,
      estimatedHours: 3,
      difficulty: 'Medium to Hard',
      focusArea: 'Core Application'
    },
    {
      stepNumber: 2,
      topic: 'Complex Analytical Derivations',
      description: 'Derive theorems from first principles and evaluate non-ideal system constraints.',
      estimatedHours: 4,
      difficulty: 'Hard',
      focusArea: 'Advanced Mastery'
    },
    {
      stepNumber: 3,
      topic: 'Apex Speed Gauntlet',
      description: 'Defeat boss phases with 100% accuracy and zero damage taken.',
      estimatedHours: 3,
      difficulty: 'Hard',
      focusArea: 'Advanced Mastery'
    },
    {
      stepNumber: 4,
      topic: 'Grandmaster Demigod Battle',
      description: 'Unleash Bankai finishers in the ultimate realm test to earn flawless Geo rewards.',
      estimatedHours: 3,
      difficulty: 'Apex',
      focusArea: 'Advanced Mastery'
    }
  ];
}

/**
 * Builds a complete DiagnosticSummary from recorded 10 questions answers
 */
export function buildDiagnosticSummary(
  courseId: string,
  courseTitle: string,
  answers: DiagnosticAnswer[]
): DiagnosticSummary {
  const totalQuestions = answers.length || 10;
  const correctCount = answers.filter(a => a.isCorrect).length;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const skillLevel = calculateSkillLevel(correctCount);

  // Difficulty stats
  const easyAnswers = answers.filter(a => a.difficulty === 'easy');
  const mediumAnswers = answers.filter(a => a.difficulty === 'medium');
  const hardAnswers = answers.filter(a => a.difficulty === 'hard');

  const easyCorrect = easyAnswers.filter(a => a.isCorrect).length;
  const mediumCorrect = mediumAnswers.filter(a => a.isCorrect).length;
  const hardCorrect = hardAnswers.filter(a => a.isCorrect).length;

  const difficultyStats = {
    easy: {
      total: easyAnswers.length || 2,
      correct: easyCorrect,
      percentage: easyAnswers.length ? Math.round((easyCorrect / easyAnswers.length) * 100) : 0
    },
    medium: {
      total: mediumAnswers.length || 4,
      correct: mediumCorrect,
      percentage: mediumAnswers.length ? Math.round((mediumCorrect / mediumAnswers.length) * 100) : 0
    },
    hard: {
      total: hardAnswers.length || 4,
      correct: hardCorrect,
      percentage: hardAnswers.length ? Math.round((hardCorrect / hardAnswers.length) * 100) : 0
    }
  };

  // Strengths: unique concepts answered correctly
  const strengths: string[] = [];
  answers.forEach(a => {
    if (a.isCorrect && !strengths.includes(a.concept)) {
      strengths.push(a.concept);
    }
  });

  // Weaknesses: unique concepts answered incorrectly (with misconception if chosen)
  const weaknesses: string[] = [];
  answers.forEach(a => {
    if (!a.isCorrect && !weaknesses.includes(a.concept)) {
      weaknesses.push(a.concept);
    }
  });

  const learningPath = determineLearningPath(skillLevel, weaknesses, strengths, courseId);

  return {
    courseId,
    courseTitle,
    totalQuestions,
    correctCount,
    scorePercentage,
    skillLevel,
    difficultyStats,
    strengths,
    weaknesses,
    learningPath,
    answers,
    completedAt: new Date().toISOString()
  };
}

// -------------------------------------------------------------
// PERSISTENT STORAGE HELPERS (FOR FUTURE AI QUESTION GENERATION)
// -------------------------------------------------------------
const STORAGE_PREFIX = 'questlearn_diagnostic_summary_';
const LATEST_STORAGE_KEY = 'questlearn_latest_diagnostic_summary';

export function saveDiagnosticSummary(summary: DiagnosticSummary): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(summary);
    localStorage.setItem(`${STORAGE_PREFIX}${summary.courseId}`, serialized);
    localStorage.setItem(LATEST_STORAGE_KEY, serialized);
  } catch (err) {
    console.warn('[QuestLearn Diagnostic] Could not persist summary to localStorage:', err);
  }
}

export function getStoredDiagnosticSummary(courseId: string): DiagnosticSummary | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}${courseId}`);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    return null;
  }
}

export function getLatestDiagnosticSummary(): DiagnosticSummary | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(LATEST_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    return null;
  }
}

// -------------------------------------------------------------
// 10-QUESTION DIAGNOSTIC BANK (2 EASY, 4 MEDIUM, 4 HARD)
// -------------------------------------------------------------
export const COMPLETE_DIAGNOSTIC_BANK: Record<string, DiagnosticQuestion[]> = {
  // ===========================================================
  // COURSE 1: PHYSICS I — CLASSICAL MECHANICS
  // ===========================================================
  'course-mechanics': [
    // 2 EASY QUESTIONS
    {
      id: 'mech-1',
      courseId: 'course-mechanics',
      difficulty: 'easy',
      concept: 'Vector vs Scalar Displacement',
      prompt: 'A particle moves 4.0 meters North, then turns and moves 3.0 meters East. What is the magnitude of its total displacement?',
      options: ['5.0 m', '7.0 m', '1.0 m', '12.0 m'],
      correctIndex: 0,
      explanation: 'Displacement is the vector difference from origin: |Δr| = √(4² + 3²) = √(16 + 9) = √25 = 5.0 m.',
      misconceptionIfChosen: {
        1: 'Treated displacement as scalar path distance (4 + 3 = 7m) instead of vector hypotenuse.'
      }
    },
    {
      id: 'mech-2',
      courseId: 'course-mechanics',
      difficulty: 'easy',
      concept: 'Newton’s First Law & Inertia',
      prompt: 'A puck slides across a completely frictionless ice rink in deep space. What net horizontal force is required to keep it moving at constant velocity?',
      options: ['0 N (Zero net force)', 'Equal to its mass times velocity', 'A constant positive force', 'Equal to puck weight mg'],
      correctIndex: 0,
      explanation: 'By Newton’s First Law (Law of Inertia), an object in uniform motion remains in that state unless acted upon by a non-zero net external force. Therefore, F_net = 0 N.',
      misconceptionIfChosen: {
        2: 'Aristotelian misconception: Believed a continuous applied force is necessary to sustain velocity.'
      }
    },
    // 4 MEDIUM QUESTIONS
    {
      id: 'mech-3',
      courseId: 'course-mechanics',
      difficulty: 'medium',
      concept: 'Newton’s Second Law & Acceleration',
      prompt: 'A constant net force F accelerates an object of mass m at acceleration a. If the mass is doubled (2m) and the applied force is halved (F/2), what is the new acceleration?',
      options: ['a / 4', 'a / 2', 'a', '2a'],
      correctIndex: 0,
      explanation: 'From a = F / m: new acceleration = (F/2) / (2m) = F / (4m) = a / 4.',
      misconceptionIfChosen: {
        1: 'Only adjusted for force halving without dividing by doubled mass.'
      }
    },
    {
      id: 'mech-4',
      courseId: 'course-mechanics',
      difficulty: 'medium',
      concept: 'Work-Energy Theorem & Conservation',
      prompt: 'A 2.0 kg block slides from rest down a frictionless curved ramp with vertical height h = 5.0 m (g = 9.8 m/s²). What is its kinetic energy at the bottom?',
      options: ['98 J', '49 J', '196 J', '10 J'],
      correctIndex: 0,
      explanation: 'By Conservation of Mechanical Energy: ΔK = -ΔU = mgh = (2.0 kg)(9.8 m/s²)(5.0 m) = 98 Joules.',
      misconceptionIfChosen: {
        1: 'Forgot to multiply by mass or mistakenly assumed m = 1 kg.'
      }
    },
    {
      id: 'mech-5',
      courseId: 'course-mechanics',
      difficulty: 'medium',
      concept: 'Inelastic Collisions & Linear Momentum',
      prompt: 'A 3.0 kg object moving at 4.0 m/s collides and sticks to a stationary 1.0 kg object. What is the final velocity of the coupled system?',
      options: ['3.0 m/s', '4.0 m/s', '1.0 m/s', '2.0 m/s'],
      correctIndex: 0,
      explanation: 'Conservation of linear momentum: p_initial = (3.0 kg)(4.0 m/s) = 12 kg·m/s. Total mass = 3.0 + 1.0 = 4.0 kg. v_final = 12 / 4.0 = 3.0 m/s.',
      misconceptionIfChosen: {
        1: 'Assumed velocity remains unaltered after coupling with additional mass.'
      }
    },
    {
      id: 'mech-6',
      courseId: 'course-mechanics',
      difficulty: 'medium',
      concept: 'Friction & Normal Forces on Flat Surfaces',
      prompt: 'A 10 kg box is pushed horizontally on a floor with coefficient of kinetic friction μ_k = 0.30 (g = 9.8 m/s²). What is the magnitude of the kinetic frictional force opposing motion?',
      options: ['29.4 N', '98.0 N', '3.0 N', '294 N'],
      correctIndex: 0,
      explanation: 'Normal force N = mg = (10)(9.8) = 98 N. Kinetic friction f_k = μ_k · N = 0.30 · 98 = 29.4 N.',
      misconceptionIfChosen: {
        1: 'Calculated normal force without multiplying by friction coefficient μ_k.'
      }
    },
    // 4 HARD QUESTIONS
    {
      id: 'mech-7',
      courseId: 'course-mechanics',
      difficulty: 'hard',
      concept: 'Rotational Dynamics & Moment of Inertia',
      prompt: 'A solid uniform cylinder (I = 1/2 M R²) and a thin hollow hoop (I = M R²) of identical mass and radius roll without slipping down the same incline from rest. Which reaches the bottom first?',
      options: [
        'The solid cylinder reaches the bottom first',
        'The thin hoop reaches the bottom first',
        'Both reach the bottom at the exact same instant',
        'Depends on the incline angle θ'
      ],
      correctIndex: 0,
      explanation: 'The solid cylinder has smaller rotational inertia fraction (1/2 vs 1), dedicating a larger fraction of potential energy to linear translational kinetic energy, producing higher linear acceleration a = g sinθ / (1 + I/(MR²)).',
      misconceptionIfChosen: {
        2: 'Confused rolling motion with frictionless sliding where mass distribution is negligible.'
      }
    },
    {
      id: 'mech-8',
      courseId: 'course-mechanics',
      difficulty: 'hard',
      concept: 'Conservation of Angular Momentum',
      prompt: 'A figure skater spinning with angular velocity ω_0 pulls her arms inward, decreasing her moment of inertia to I_0 / 3. What is her new rotational kinetic energy K_final relative to K_initial?',
      options: ['3 · K_initial', 'K_initial', 'K_initial / 3', '9 · K_initial'],
      correctIndex: 0,
      explanation: 'Angular momentum L = Iω is conserved: ω_final = 3ω_0. Kinetic energy K = L² / (2I). Because I decreases by factor of 3, K increases by factor of 3 (supplied by internal muscular work).',
      misconceptionIfChosen: {
        1: 'Assumed kinetic energy is conserved in systems where internal work is performed.'
      }
    },
    {
      id: 'mech-9',
      courseId: 'course-mechanics',
      difficulty: 'hard',
      concept: 'Simple Harmonic Oscillations & Restoring Springs',
      prompt: 'A block-spring oscillator on a frictionless surface has frequency f. If the block mass is quadrupled (4m) and the spring constant is doubled (2k), what is the new oscillation frequency?',
      options: ['f / √2', 'f / 2', 'f · √2', '2f'],
      correctIndex: 0,
      explanation: 'Natural frequency f = (1/2π) √(k / m). With k’ = 2k and m’ = 4m: √(2k / 4m) = √(1/2) · √(k/m) = f / √2 ≈ 0.707 f.',
      misconceptionIfChosen: {
        1: 'Forgot the square root in the frequency formula f = (1/2π)√(k/m).'
      }
    },
    {
      id: 'mech-10',
      courseId: 'course-mechanics',
      difficulty: 'hard',
      concept: 'Non-Conservative Drag & Terminal Velocity',
      prompt: 'A skydiver falls under gravity with quadratic air drag force F_drag = -b v². What is the terminal velocity v_term when net vertical acceleration drops to zero?',
      options: ['√(mg / b)', 'mg / b', '√(b / mg)', '(mg / b)²'],
      correctIndex: 0,
      explanation: 'At terminal velocity, net force is zero: mg - b v_term² = 0 ⟹ v_term² = mg / b ⟹ v_term = √(mg / b).',
      misconceptionIfChosen: {
        1: 'Used linear drag formula (Stokes drag) instead of quadratic high-Reynolds drag.'
      }
    }
  ],

  // ===========================================================
  // COURSE 2: PHYSICS II — ELECTRICITY & MAGNETISM
  // ===========================================================
  'course-electromagnetism': [
    // 2 EASY QUESTIONS
    {
      id: 'em-1',
      courseId: 'course-electromagnetism',
      difficulty: 'easy',
      concept: 'Coulomb’s Electrostatic Law',
      prompt: 'If the distance r between two identical point charges is tripled (3r), how does the electrostatic force between them change?',
      options: ['Decreases to 1/9 of original value', 'Decreases to 1/3 of original value', 'Increases by 9x', 'Remains unchanged'],
      correctIndex: 0,
      explanation: 'Coulomb’s law follows an inverse-square law: F ∝ 1/r². If r → 3r, F → F / 3² = F / 9.',
      misconceptionIfChosen: {
        1: 'Assumed an inverse linear relationship (1/r) instead of inverse-square (1/r²).'
      }
    },
    {
      id: 'em-2',
      courseId: 'course-electromagnetism',
      difficulty: 'easy',
      concept: 'Quantization & Conservation of Charge',
      prompt: 'Which of the following net static charges is physically impossible on an isolated macro object?',
      options: ['2.4 × 10⁻¹⁹ C', '1.6 × 10⁻¹⁹ C', '3.2 × 10⁻¹⁹ C', '-4.8 × 10⁻¹⁹ C'],
      correctIndex: 0,
      explanation: 'Electric charge is quantized in integer multiples of elementary charge e = 1.6 × 10⁻¹⁹ C. 2.4 × 10⁻¹⁹ C corresponds to 1.5e, which cannot exist as an isolated free charge.',
      misconceptionIfChosen: {
        1: 'Did not recognize 1.6 × 10⁻¹⁹ C as the fundamental quantum unit e.'
      }
    },
    // 4 MEDIUM QUESTIONS
    {
      id: 'em-3',
      courseId: 'course-electromagnetism',
      difficulty: 'medium',
      concept: 'Parallel Plate Capacitance & Dielectrics',
      prompt: 'A parallel plate capacitor with vacuum capacitance C_0 is filled completely with a dielectric material of dielectric constant κ = 4.0. How does its capacitance change?',
      options: ['Increases to 4.0 · C_0', 'Decreases to C_0 / 4.0', 'Remains C_0', 'Increases to 16 · C_0'],
      correctIndex: 0,
      explanation: 'Dielectric polarization shields internal field, increasing capacitance linearly: C = κ C_0 = 4.0 C_0.',
      misconceptionIfChosen: {
        1: 'Thought dielectric weakens capacitance rather than enhancing charge storage capacity.'
      }
    },
    {
      id: 'em-4',
      courseId: 'course-electromagnetism',
      difficulty: 'medium',
      concept: 'Ohm’s Law & Equivalent Resistance',
      prompt: 'Two identical 10 Ω resistors are connected in parallel, and this pair is connected in series with a 5 Ω resistor. What is the total equivalent resistance?',
      options: ['10 Ω', '25 Ω', '7.5 Ω', '15 Ω'],
      correctIndex: 0,
      explanation: 'Parallel pair: R_p = (10 · 10) / (10 + 10) = 5 Ω. Series addition: R_total = 5 Ω + 5 Ω = 10 Ω.',
      misconceptionIfChosen: {
        1: 'Added all resistors in series without accounting for the parallel branch.'
      }
    },
    {
      id: 'em-5',
      courseId: 'course-electromagnetism',
      difficulty: 'medium',
      concept: 'Electric Field of a Point Charge',
      prompt: 'At a distance d from charge Q, the electric field strength is E. At what distance from Q is the electric field strength E / 4?',
      options: ['2d', '4d', 'd / 2', '16d'],
      correctIndex: 0,
      explanation: 'Electric field of a point charge is E = kQ / r². For field to become E / 4, r² must equal 4d², meaning r = 2d.',
      misconceptionIfChosen: {
        1: 'Substituted 4 directly into distance without taking the square root.'
      }
    },
    {
      id: 'em-6',
      courseId: 'course-electromagnetism',
      difficulty: 'medium',
      concept: 'Lorentz Magnetic Force on Moving Charges',
      prompt: 'A proton moves perpendicular to a uniform magnetic field B with speed v. If its speed is doubled (2v) and field B is halved (B/2), how does the magnetic force F_B change?',
      options: ['Remains unchanged (F_B)', 'Doubles (2 F_B)', 'Halves (F_B / 2)', 'Quadruples (4 F_B)'],
      correctIndex: 0,
      explanation: 'Lorentz force magnitude is F = q v B sin(90°) = q v B. With v’ = 2v and B’ = B/2: F’ = q(2v)(B/2) = q v B = F_B.',
      misconceptionIfChosen: {
        1: 'Accounted only for speed doubling without factoring in field reduction.'
      }
    },
    // 4 HARD QUESTIONS
    {
      id: 'em-7',
      courseId: 'course-electromagnetism',
      difficulty: 'hard',
      concept: 'Gauss’s Law & Closed Surface Flux',
      prompt: 'A point charge +Q is positioned off-center inside an arbitrary closed non-conducting spherical surface. What is the total electric flux ∮ E · dA through the surface?',
      options: ['Q / ε_0', 'Zero because charge is off-center', 'kQ / r²', 'Depends on exact position coordinates'],
      correctIndex: 0,
      explanation: 'Gauss’s Law states that total electric flux depends solely on enclosed charge: Φ_E = Q_enclosed / ε_0, completely invariant to internal position or geometry.',
      misconceptionIfChosen: {
        1: 'Confused electric field symmetry at surface points with total integrated flux.'
      }
    },
    {
      id: 'em-8',
      courseId: 'course-electromagnetism',
      difficulty: 'hard',
      concept: 'Faraday’s Law & Lenz’s Induced EMF',
      prompt: 'The magnetic flux through a stationary 50-turn coil increases uniformly from 0.10 Wb to 0.50 Wb in 0.20 seconds. What is the magnitude of the induced electromotive force (EMF)?',
      options: ['100 V', '2.0 V', '20 V', '500 V'],
      correctIndex: 0,
      explanation: 'Faraday’s Law: |EMF| = N · (ΔΦ / Δt) = 50 · ((0.50 - 0.10) / 0.20) = 50 · (0.40 / 0.20) = 50 · 2 = 100 Volts.',
      misconceptionIfChosen: {
        1: 'Forgot to multiply by the N = 50 coil turns.'
      }
    },
    {
      id: 'em-9',
      courseId: 'course-electromagnetism',
      difficulty: 'hard',
      concept: 'LC Resonant Circuit Oscillations',
      prompt: 'An ideal LC tank circuit consists of inductor L = 10 mH and capacitor C = 10 μF. What is the natural resonance frequency ω_0 in radians per second?',
      options: ['3162 rad/s', '1000 rad/s', '100 rad/s', '10,000 rad/s'],
      correctIndex: 0,
      explanation: 'Natural resonant frequency ω_0 = 1 / √(LC) = 1 / √(10 × 10⁻³ · 10 × 10⁻⁶) = 1 / √(10⁻⁷) = 1 / (3.162 × 10⁻⁴) ≈ 3162 rad/s.',
      misconceptionIfChosen: {
        1: 'Miscalculated unit conversions for millihenries and microfarads.'
      }
    },
    {
      id: 'em-10',
      courseId: 'course-electromagnetism',
      difficulty: 'hard',
      concept: 'Maxwell’s Displacement Current',
      prompt: 'During charging of a parallel-plate capacitor, which physical mechanism generates the magnetic field inside the gap between plates where no conduction electrons flow?',
      options: [
        'A time-varying electric flux (Maxwell Displacement Current I_d = ε_0 dΦ_E/dt)',
        'Direct static charge accumulation on the boundary rims',
        'Thermal electron tunneling across the dielectric barrier',
        'A constant scalar gravitational potential gradient'
      ],
      correctIndex: 0,
      explanation: 'Maxwell resolved Ampère’s law inconsistency by establishing that a changing electric field produces a displacement current I_d = ε_0 (dΦ_E/dt), inducing a circulating magnetic field.',
      misconceptionIfChosen: {
        2: 'Believed physical charge must cross the dielectric gap to create a magnetic field.'
      }
    }
  ],

  // ===========================================================
  // COURSE 3: DIFFERENTIAL & INTEGRAL CALCULUS
  // ===========================================================
  'course-calculus': [
    // 2 EASY QUESTIONS
    {
      id: 'calc-1',
      courseId: 'course-calculus',
      difficulty: 'easy',
      concept: 'Power Rule of Differentiation',
      prompt: 'What is the first derivative of f(x) = 4x³ - 5x² + 7x - 9 with respect to x?',
      options: ['12x² - 10x + 7', '12x³ - 10x² + 7', '4x² - 5x + 7', '12x² - 5x'],
      correctIndex: 0,
      explanation: 'By the Power Rule d/dx[xⁿ] = n·xⁿ⁻¹: f’(x) = 4(3x²) - 5(2x) + 7(1) - 0 = 12x² - 10x + 7.',
      misconceptionIfChosen: {
        1: 'Decremented coefficients without decrementing powers.'
      }
    },
    {
      id: 'calc-2',
      courseId: 'course-calculus',
      difficulty: 'easy',
      concept: 'Direct Limit Evaluation',
      prompt: 'What is the limit: lim (x → 3) [ (2x² - 4) / (x + 1) ]?',
      options: ['3.5 (or 7/2)', '4', '0', 'Does not exist'],
      correctIndex: 0,
      explanation: 'Because denominator 3 + 1 = 4 ≠ 0, evaluate by direct substitution: (2(3²) - 4) / (3 + 1) = (18 - 4) / 4 = 14 / 4 = 7/2 = 3.5.',
      misconceptionIfChosen: {
        1: 'Arithmetic slip in numerator (computed 2(3) instead of 2(3²)).'
      }
    },
    // 4 MEDIUM QUESTIONS
    {
      id: 'calc-3',
      courseId: 'course-calculus',
      difficulty: 'medium',
      concept: 'Chain Rule for Composite Functions',
      prompt: 'What is the derivative of g(x) = sin(3x² + 1)?',
      options: ['6x · cos(3x² + 1)', 'cos(3x² + 1)', '3x · cos(3x² + 1)', '-6x · cos(3x² + 1)'],
      correctIndex: 0,
      explanation: 'Chain Rule: d/dx[f(u)] = f’(u) · u’. Here u = 3x² + 1, u’ = 6x. Thus g’(x) = cos(3x² + 1) · 6x = 6x cos(3x² + 1).',
      misconceptionIfChosen: {
        1: 'Forgot to multiply by the derivative of the inner function (inner chain derivative 6x).'
      }
    },
    {
      id: 'calc-4',
      courseId: 'course-calculus',
      difficulty: 'medium',
      concept: 'Critical Points & First Derivative Test',
      prompt: 'Find the x-coordinate of the local minimum for f(x) = x³ - 3x² - 9x + 5.',
      options: ['x = 3', 'x = -1', 'x = 0', 'x = 1'],
      correctIndex: 0,
      explanation: 'f’(x) = 3x² - 6x - 9 = 3(x - 3)(x + 1) = 0. Critical points at x = 3 and x = -1. Second derivative f’’(x) = 6x - 6. f’’(3) = 12 > 0 (local minimum); f’’(-1) = -12 < 0 (local maximum).',
      misconceptionIfChosen: {
        1: 'Identified the local maximum at x = -1 instead of the local minimum.'
      }
    },
    {
      id: 'calc-5',
      courseId: 'course-calculus',
      difficulty: 'medium',
      concept: 'Fundamental Theorem of Calculus (Part 1)',
      prompt: 'Evaluate the derivative: d/dx [ ∫₁ˣ √(t³ + 8) dt ].',
      options: ['√(x³ + 8)', '√(x³ + 8) - 3', '(3x²) / (2√(x³ + 8))', 'x³ + 8'],
      correctIndex: 0,
      explanation: 'By FTC Part 1: d/dx [ ∫ₐˣ f(t) dt ] = f(x). Therefore, the derivative is simply √(x³ + 8).',
      misconceptionIfChosen: {
        2: 'Unnecessarily differentiated the integrand using the chain rule.'
      }
    },
    {
      id: 'calc-6',
      courseId: 'course-calculus',
      difficulty: 'medium',
      concept: 'Definite Integration via U-Substitution',
      prompt: 'Evaluate the definite integral: ∫₀¹ 2x · e^(x²) dx.',
      options: ['e - 1', 'e', 'e² - 1', '2e'],
      correctIndex: 0,
      explanation: 'Let u = x², du = 2x dx. When x = 0, u = 0; when x = 1, u = 1. ∫₀¹ e^u du = [e^u]₀¹ = e¹ - e⁰ = e - 1.',
      misconceptionIfChosen: {
        1: 'Forgot that e⁰ = 1, omitting the lower limit subtraction.'
      }
    },
    // 4 HARD QUESTIONS
    {
      id: 'calc-7',
      courseId: 'course-calculus',
      difficulty: 'hard',
      concept: 'L’Hôpital’s Rule on Indeterminate Powers',
      prompt: 'What is the limit: lim (x → 0⁺) (1 + 2x)^(1/x)?',
      options: ['e²', 'e', '1', '∞'],
      correctIndex: 0,
      explanation: 'Indeterminate form 1^∞. Let y = (1+2x)^(1/x) ⟹ ln y = (ln(1+2x))/x. By L’Hôpital: lim (x→0) [2/(1+2x)] / 1 = 2. Therefore lim y = e².',
      misconceptionIfChosen: {
        1: 'Forgot the coefficient factor 2 in the exponent.'
      }
    },
    {
      id: 'calc-8',
      courseId: 'course-calculus',
      difficulty: 'hard',
      concept: 'Integration by Parts',
      prompt: 'Evaluate the indefinite integral: ∫ x · cos(x) dx.',
      options: ['x · sin(x) + cos(x) + C', 'x · sin(x) - cos(x) + C', '-x · sin(x) + cos(x) + C', 'x² · sin(x) + C'],
      correctIndex: 0,
      explanation: 'Integration by parts ∫ u dv = uv - ∫ v du. Let u = x (du = dx), dv = cos(x)dx (v = sin(x)). ∫ x cos(x)dx = x sin(x) - ∫ sin(x)dx = x sin(x) - (-cos(x)) = x sin(x) + cos(x) + C.',
      misconceptionIfChosen: {
        1: 'Sign error when integrating -sin(x) (forgot that ∫ sin(x)dx = -cos(x)).'
      }
    },
    {
      id: 'calc-9',
      courseId: 'course-calculus',
      difficulty: 'hard',
      concept: 'Applied Optimization with Geometric Constraints',
      prompt: 'A rectangular garden is fenced along three sides using 40 meters of fencing (the fourth side is bounded by a stone wall). What maximum area can be enclosed?',
      options: ['200 m²', '100 m²', '400 m²', '150 m²'],
      correctIndex: 0,
      explanation: 'Let width be x and length along wall be L. Perimeter constraint: 2x + L = 40 ⟹ L = 40 - 2x. Area A(x) = x(40 - 2x) = 40x - 2x². A’(x) = 40 - 4x = 0 ⟹ x = 10 m, L = 20 m. Max area = 10 · 20 = 200 m².',
      misconceptionIfChosen: {
        1: 'Assumed a square geometry (4 sides of 10m each) ignoring the existing stone wall.'
      }
    },
    {
      id: 'calc-10',
      courseId: 'course-calculus',
      difficulty: 'hard',
      concept: 'First-Order Separable Differential Equations',
      prompt: 'Solve the initial value problem: dy/dx = 3x² y, with initial condition y(0) = 5.',
      options: ['y = 5 · e^(x³)', 'y = e^(x³) + 4', 'y = 5 · e^(3x²)', 'y = 15x³'],
      correctIndex: 0,
      explanation: 'Separate variables: (1/y) dy = 3x² dx. Integrate both sides: ln|y| = x³ + C ⟹ y = A e^(x³). Using y(0) = 5 ⟹ A = 5. Solution: y = 5 e^(x³).',
      misconceptionIfChosen: {
        1: 'Treated constant of integration additively outside exponentiation.'
      }
    }
  ],

  // ===========================================================
  // COURSE 4: COMPUTER SCIENCE & ALGORITHMICS
  // ===========================================================
  'course-cs': [
    // 2 EASY QUESTIONS
    {
      id: 'cs-1',
      courseId: 'course-cs',
      difficulty: 'easy',
      concept: 'Big-O Asymptotic Notation Basics',
      prompt: 'What is the asymptotic time complexity of accessing an element at a given index in a standard contiguous memory array?',
      options: ['O(1) Constant Time', 'O(n) Linear Time', 'O(log n) Logarithmic Time', 'O(n²) Quadratic Time'],
      correctIndex: 0,
      explanation: 'Because array elements reside in contiguous memory, the memory address is computed in O(1) via base_address + index * element_size.',
      misconceptionIfChosen: {
        1: 'Confused direct index memory lookup with linear searching for an arbitrary value.'
      }
    },
    {
      id: 'cs-2',
      courseId: 'course-cs',
      difficulty: 'easy',
      concept: 'Array vs Singly Linked List Insertion',
      prompt: 'Which operation is O(1) in a Singly Linked List when a pointer to the head node is already known, but O(n) in an Array without spare capacity?',
      options: ['Inserting a new node at the head', 'Accessing the element at index k', 'Binary Search', 'In-place sorting'],
      correctIndex: 0,
      explanation: 'Prepending a node to a linked list simply points new_node.next = head in O(1), whereas an array without capacity requires allocating a new memory block and copying n elements (O(n)).',
      misconceptionIfChosen: {
        1: 'Confused head pointer manipulation with arbitrary index access.'
      }
    },
    // 4 MEDIUM QUESTIONS
    {
      id: 'cs-3',
      courseId: 'course-cs',
      difficulty: 'medium',
      concept: 'Lexical Closures & Scope Retention',
      prompt: 'Which JavaScript runtime mechanism enables an inner function to retain access to outer variables even after the outer function execution context has returned and exited the call stack?',
      options: ['A Lexical Closure', 'Prototypal Delegation', 'Variable Hoisting', 'Tail Call Optimization'],
      correctIndex: 0,
      explanation: 'A closure is the combination of a function bundled together with references to its surrounding lexical environment in heap memory.',
      misconceptionIfChosen: {
        1: 'Confused object prototype chains with lexical environment retention.'
      }
    },
    {
      id: 'cs-4',
      courseId: 'course-cs',
      difficulty: 'medium',
      concept: 'Binary Search Tree Lookup Bounds',
      prompt: 'What is the tightest worst-case lookup time in a strictly balanced AVL or Red-Black Binary Search Tree containing n nodes?',
      options: ['O(log n)', 'O(n)', 'O(1)', 'O(n log n)'],
      correctIndex: 0,
      explanation: 'Because self-balancing trees guarantee tree height h ≤ c · log₂(n), lookup, insertion, and deletion are strictly bounded by O(log n).',
      misconceptionIfChosen: {
        1: 'Confused balanced search trees with degenerate un-balanced linked-list trees (O(n)).'
      }
    },
    {
      id: 'cs-5',
      courseId: 'course-cs',
      difficulty: 'medium',
      concept: 'Recursion Call Stack & Base Cases',
      prompt: 'What error occurs if a recursive function is invoked without a valid base case or if recursion depth exceeds execution limits?',
      options: ['Maximum Call Stack Size Exceeded (Stack Overflow)', 'Out of Heap Memory Allocation', 'Concurrent Thread Deadlock', 'Type Coercion Exception'],
      correctIndex: 0,
      explanation: 'Every recursive frame pushes a new activation record onto the call stack. Without a terminating base case, stack frames accumulate until call stack memory is exhausted.',
      misconceptionIfChosen: {
        1: 'Confused call stack frame allocation with heap garbage collection allocation.'
      }
    },
    {
      id: 'cs-6',
      courseId: 'course-cs',
      difficulty: 'medium',
      concept: 'Hash Table Collision Resolution',
      prompt: 'In a Hash Table utilizing Separate Chaining, what is the worst-case lookup time if all n keys hash to the exact same bucket?',
      options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'],
      correctIndex: 0,
      explanation: 'If all keys collide into a single linked list bucket, searching requires traversing all n elements linearly, degrading lookup to O(n).',
      misconceptionIfChosen: {
        1: 'Assumed ideal average-case O(1) performance holds regardless of pathological collision clustering.'
      }
    },
    // 4 HARD QUESTIONS
    {
      id: 'cs-7',
      courseId: 'course-cs',
      difficulty: 'hard',
      concept: 'Dynamic Programming & Optimal Substructure',
      prompt: 'Which two fundamental properties are strictly required for a computational optimization problem to be solvable via Dynamic Programming?',
      options: [
        'Optimal Substructure and Overlapping Subproblems',
        'Greedy Choice and Constant Space Bounds',
        'Strictly First-In First-Out Queuing and Monotonicity',
        'Pure Immutability and Tail Recursion'
      ],
      correctIndex: 0,
      explanation: 'Dynamic Programming requires that an optimal global solution can be composed of optimal solutions to subproblems, and that identical subproblems are solved repeatedly.',
      misconceptionIfChosen: {
        1: 'Confused Dynamic Programming with Greedy heuristics.'
      }
    },
    {
      id: 'cs-8',
      courseId: 'course-cs',
      difficulty: 'hard',
      concept: 'Floyd-Warshall All-Pairs Shortest Path',
      prompt: 'What is the time complexity of the Floyd-Warshall dynamic programming algorithm to find shortest paths between all pairs of vertices in a weighted graph with V vertices?',
      options: ['O(V³)', 'O(V² log V)', 'O(V · E)', 'O(E log V)'],
      correctIndex: 0,
      explanation: 'Floyd-Warshall uses three nested loops over V vertices: evaluating for each intermediate vertex k if path i→k→j improves path i→j, resulting in O(V³) time.',
      misconceptionIfChosen: {
        1: 'Confused all-pairs DP with running Dijkstra from each vertex with a Fibonacci heap.'
      }
    },
    {
      id: 'cs-9',
      courseId: 'course-cs',
      difficulty: 'hard',
      concept: 'Dijkstra’s Algorithm with Min-Heap Priority Queue',
      prompt: 'What is the time complexity of Dijkstra’s single-source shortest path algorithm on a graph with V vertices and E edges using a binary min-heap?',
      options: ['O((V + E) log V)', 'O(V²)', 'O(E²)', 'O(V · E)'],
      correctIndex: 0,
      explanation: 'Each vertex is extracted once (V log V), and each edge relaxation can update priority in the binary min-heap (E log V), yielding O((V + E) log V).',
      misconceptionIfChosen: {
        1: 'Cited the complexity for an array-based implementation without an indexed priority queue.'
      }
    },
    {
      id: 'cs-10',
      courseId: 'course-cs',
      difficulty: 'hard',
      concept: 'Event Loop Microtask vs Macrotask Execution Order',
      prompt: 'In the JavaScript runtime event loop, which queue is completely drained to completion before the engine processes the next task from the Macrotask (Callback) queue?',
      options: [
        'Microtask Queue (Promises, queueMicrotask, MutationObserver)',
        'Macrotask Queue (setTimeout, setInterval)',
        'I/O Polling Buffer Queue',
        'Garbage Collection Sweep Queue'
      ],
      correctIndex: 0,
      explanation: 'After every macrotask completes, the JavaScript engine drains the ENTIRE Microtask queue (including any microtasks queued during that drain) before advancing to the next macrotask.',
      misconceptionIfChosen: {
        1: 'Reversed priority, assuming setTimeout tasks execute before Promise resolutions.'
      }
    }
  ]
};

// =============================================================
// DYNAMIC WORLD STAGE GENERATION (AI-CALIBRATED)
// =============================================================

export interface WorldStageNode {
  id: number;
  stageNumber: number;
  name: string;
  conceptFocus: string;
  realmLocation: string;
  kanji: string;
  lore: string;
  themeColor: string;
  status: 'completed' | 'unlocked' | 'locked' | 'remediation_priority';
  masteryPct: number;
  stars: number;
  isBoss: boolean;
  bossName?: string;
  bossId?: string;
  tier: 'easy' | 'intermediate' | 'hard';
  aiGenerated?: boolean;
  aiRationale?: string;
  targetConcept?: string;
}

export interface WorldStageGenerationInput {
  courseId: string;
  courseTitle?: string;
  skillLevel: SkillLevel;
  scorePercentage: number;
  weaknesses?: string[];
  strengths?: string[];
  diagnosedGaps?: string[];
  answers?: DiagnosticAnswer[] | { concept: string; isCorrect: boolean }[];
  aiCustomStages?: Array<{
    stageNumber: number;
    name: string;
    conceptFocus: string;
    realmLocation?: string;
    kanji?: string;
    lore?: string;
    tier?: 'easy' | 'intermediate' | 'hard';
    isRemediation?: boolean;
    targetedMisconception?: string;
    aiRationale?: string;
  }>;
}

interface CourseThemeStageMeta {
  realmLocation: string;
  kanji: string;
  themeColor: string;
  defaultBossId: string;
  defaultBossName: string;
  defaultTopic: string;
  defaultLore: string;
}

const COURSE_STAGE_THEMES: Record<string, CourseThemeStageMeta[]> = {
  'course-mechanics': [
    {
      realmLocation: 'Urahara Underground Training Grounds',
      kanji: '地下修練場',
      themeColor: '#f97316',
      defaultBossId: 'grand_fisher',
      defaultBossName: 'Grand Fisher (Cursed Hollow)',
      defaultTopic: 'Vector Kinematics & 1D Motion',
      defaultLore: 'Deep beneath the Urahara candy shop, fractured bedrock serves as the proving ground for directional displacement and kinetic rates.'
    },
    {
      realmLocation: 'Rukongai Outskirts // Jidanbo Iron Gate',
      kanji: '流魂街・白道門',
      themeColor: '#38bdf8',
      defaultBossId: 'renji_boss',
      defaultBossName: 'Renji Abarai (Roar Zabimaru)',
      defaultTopic: 'Newtonian Force & Reaction Pairs',
      defaultLore: 'Beyond the colossal iron gates, Newton’s laws of opposing action dictate whether your Reiatsu shatters the gate or is repelled.'
    },
    {
      realmLocation: 'Seireitei Senkaimon Gateways',
      kanji: '瀞霊廷・穿界門',
      themeColor: '#f472b6',
      defaultBossId: 'grimmjow',
      defaultBossName: 'Grimmjow Jaegerjaquez (Pantera)',
      defaultTopic: 'Work-Energy Theorem & Potential Wells',
      defaultLore: 'The boundary portal where potential and kinetic Reiatsu continuously transform according to thermodynamic conservation.'
    },
    {
      realmLocation: 'Hueco Mundo // Desert of Las Noches',
      kanji: '虚圏・白砂の領域',
      themeColor: '#0284c7',
      defaultBossId: 'ulquiorra',
      defaultBossName: 'Ulquiorra Cifer (Segunda Etapa)',
      defaultTopic: 'Momentum, Inelastic Impact & Center of Mass',
      defaultLore: 'The desolate quartz expanse where supersonic speed and momentum transfer collide beneath a perpetual crescent moon.'
    },
    {
      realmLocation: 'Sokyoku Execution Hill // 1st Division',
      kanji: '残火の太刀',
      themeColor: '#eab308',
      defaultBossId: 'yamamoto_boss',
      defaultBossName: 'Genryūsai Yamamoto (Zanka no Tachi)',
      defaultTopic: 'Rotational Dynamics & Universal Conservation',
      defaultLore: 'The summit of Soul Society where torque, angular momentum, and razor execution blades face the supreme Head Captain: Genryūsai Yamamoto!'
    }
  ],
  'course-calculus': [
    {
      realmLocation: 'Seireitei Library // Central 46 Archive',
      kanji: '極限の領域',
      themeColor: '#818cf8',
      defaultBossId: 'grand_fisher',
      defaultBossName: 'Grand Fisher (Foundational Hollow)',
      defaultTopic: 'Limits & Asymptotic Continuity',
      defaultLore: 'The boundary where infinitesimals converge towards precise analytical limits under Soul Society logic.'
    },
    {
      realmLocation: 'Senkaimon Dimensional Corridor',
      kanji: '微分回廊',
      themeColor: '#38bdf8',
      defaultBossId: 'renji_boss',
      defaultBossName: 'Renji Abarai (Differential Zabimaru)',
      defaultTopic: 'Power Rule & Chain Derivatives',
      defaultLore: 'Deconstruct accelerating velocities into instantaneous tangent rates through high-order derivative mastery.'
    },
    {
      realmLocation: 'Sokyoku Hill Ridge',
      kanji: '極値の丘',
      themeColor: '#f472b6',
      defaultBossId: 'grimmjow',
      defaultBossName: 'Grimmjow Jaegerjaquez (Extremum Panther)',
      defaultTopic: 'Concavity, Extrema & Mean Value Optimization',
      defaultLore: 'Analyze curvature, critical extrema, and maximum output boundaries across the execution plateau.'
    },
    {
      realmLocation: 'Wandenreich Frozen Monolith',
      kanji: '積分氷壁',
      themeColor: '#0284c7',
      defaultBossId: 'szayelaporro',
      defaultBossName: 'Szayelaporro Granz (Calculus Architect)',
      defaultTopic: 'Riemann Accumulation & Definite Integrals',
      defaultLore: 'Sum infinite infinitesimal slices of Reiatsu to calculate total accumulated energy beneath the function curve.'
    },
    {
      realmLocation: 'Silbern Imperial Palace // Throne Room',
      kanji: '全知全能の玉座',
      themeColor: '#eab308',
      defaultBossId: 'aizen_boss',
      defaultBossName: 'Sosuke Aizen (Transcendent Hōgyoku)',
      defaultTopic: 'Differential Equations & Transcendental Limits',
      defaultLore: 'Face Sosuke Aizen in the realm of infinite limits and transcendental calculus series!'
    }
  ],
  'course-electromagnetism': [
    {
      realmLocation: 'Karakura High-Voltage Substation',
      kanji: '電荷の領域',
      themeColor: '#f59e0b',
      defaultBossId: 'grand_fisher',
      defaultBossName: 'Grand Fisher (Static Charge Hollow)',
      defaultTopic: 'Coulombic Point Charges & Quantization',
      defaultLore: 'Trace electrostatic field vectors radiated by charged spiritual particles across the physical barrier.'
    },
    {
      realmLocation: 'Seireitei East Gate // Lightning Barrier',
      kanji: '電流の防壁',
      themeColor: '#06b6d4',
      defaultBossId: 'renji_boss',
      defaultBossName: 'Renji Abarai (Current Coil Whip)',
      defaultTopic: 'Capacitance & Resistor Circuit Networks',
      defaultLore: 'Harness dielectric displacement and current resistance across high-voltage Seireitei wards.'
    },
    {
      realmLocation: 'Sokyoku Hill // Magnetic Confinement',
      kanji: '磁場の牢獄',
      themeColor: '#a855f7',
      defaultBossId: 'grimmjow',
      defaultBossName: 'Grimmjow Jaegerjaquez (Lorentz Beast)',
      defaultTopic: 'Lorentz Magnetic Force Vector Rules',
      defaultLore: 'Manipulate helical trajectories and Lorentz cross products within a high-density magnetic vacuum.'
    },
    {
      realmLocation: 'Las Noches Grand Canopy // Induction Spires',
      kanji: '誘導の尖塔',
      themeColor: '#3b82f6',
      defaultBossId: 'ulquiorra',
      defaultBossName: 'Ulquiorra Cifer (Resonant Waveform)',
      defaultTopic: 'Faraday-Lenz Induction & Resonant Tanks',
      defaultLore: 'Command time-varying magnetic flux and inductive electromotive force to breach Hueco Mundo spires.'
    },
    {
      realmLocation: 'False Karakura Town // Electromagnetic Apex',
      kanji: '電磁の頂点',
      themeColor: '#eab308',
      defaultBossId: 'yhwach',
      defaultBossName: 'Yhwach (Quincy Emperor)',
      defaultTopic: 'Maxwell Displacement Current & Wave Propagation',
      defaultLore: 'Face the Quincy progenitor where Maxwell’s displacement currents weave reality-altering electromagnetic standing waves.'
    }
  ],
  'course-cs': [
    {
      realmLocation: 'Urahara Research Laboratory',
      kanji: '計算量の回廊',
      themeColor: '#06b6d4',
      defaultBossId: 'grand_fisher',
      defaultBossName: 'Grand Fisher (Brute Force Hollow)',
      defaultTopic: 'Asymptotic Complexity & Memory Bounds',
      defaultLore: 'Analyze algorithm efficiency and Big-O memory bounds across extreme orders of magnitude.'
    },
    {
      realmLocation: '12th Division Technical Institute',
      kanji: '記憶空間',
      themeColor: '#a855f7',
      defaultBossId: 'renji_boss',
      defaultBossName: 'Renji Abarai (Segment Tree Whip)',
      defaultTopic: 'Execution Context & Lexical Closures',
      defaultLore: 'Master persistent lexical scope environments and memory allocation across asynchronous execution boundaries.'
    },
    {
      realmLocation: 'Mukenh Underground Prison Gates',
      kanji: '二分探索樹の封印',
      themeColor: '#3b82f6',
      defaultBossId: 'ulquiorra',
      defaultBossName: 'Ulquiorra Cifer (Recursive Void)',
      defaultTopic: 'Self-Balancing Trees & Recursion Depth',
      defaultLore: 'Traverse hierarchical logarithmic trees to maintain AVL balancing invariants against rogue data corruption.'
    },
    {
      realmLocation: 'Las Noches Throne Room',
      kanji: '動的計画法',
      themeColor: '#ec4899',
      defaultBossId: 'szayelaporro',
      defaultBossName: 'Szayelaporro Granz (Dynamic Programmer)',
      defaultTopic: 'Dynamic Programming & Memoized Graphs',
      defaultLore: 'Break complex recursive problems into overlapping subproblems to achieve polynomial time solutions.'
    },
    {
      realmLocation: 'False Karakura Town // Kyoka Suigetsu',
      kanji: '鏡花水月の鏡',
      themeColor: '#eab308',
      defaultBossId: 'aizen_boss',
      defaultBossName: 'Sosuke Aizen (Complete Algorithmic Hypnosis)',
      defaultTopic: 'Advanced Graph Algorithms & Async Event Loop',
      defaultLore: 'Battle Sosuke Aizen in the absolute illusion realm, proving true algorithmic correctness against complete hypnosis!'
    }
  ]
};

/**
 * Dynamically generates 5 personalized World Stage nodes for a student's campaign map
 * based on their diagnosed skill level, score percentage, identified gaps, and strengths.
 */
export function generatePersonalizedWorldStages(input: WorldStageGenerationInput): WorldStageNode[] {
  const {
    courseId,
    skillLevel,
    scorePercentage,
    weaknesses = [],
    strengths = [],
    diagnosedGaps = [],
    aiCustomStages = []
  } = input;

  // Combine unique detected gaps with weaknesses
  const allWeaknesses: string[] = [];
  [...diagnosedGaps, ...weaknesses].forEach(w => {
    if (w && !allWeaknesses.includes(w)) allWeaknesses.push(w);
  });

  const allStrengths: string[] = [];
  strengths.forEach(s => {
    if (s && !allStrengths.includes(s)) allStrengths.push(s);
  });

  const themes = COURSE_STAGE_THEMES[courseId] || COURSE_STAGE_THEMES['course-mechanics'];

  // Check if AI custom stages from Gemini were provided
  const hasValidCustomStages = Array.isArray(aiCustomStages) && aiCustomStages.length === 5;

  const w1 = allWeaknesses[0] || themes[0].defaultTopic;
  const w2 = allWeaknesses[1] || allWeaknesses[0] || themes[1].defaultTopic;
  const w3 = allWeaknesses[2] || themes[2].defaultTopic;
  const s1 = allStrengths[0] || themes[0].defaultTopic;

  // Build based on Evaluated Skill Level
  if (skillLevel === 'Beginner') {
    // 0-3 Correct (<40%): Foundational scaffolding, interactive concept labs, accessible boss
    return themes.map((theme, idx) => {
      const stageNumber = idx + 1;
      const custom = hasValidCustomStages ? aiCustomStages[idx] : null;

      if (stageNumber === 1) {
        return {
          id: 1,
          stageNumber: 1,
          name: custom?.name || `AI Remediation: Foundational ${w1}`,
          conceptFocus: custom?.conceptFocus || `Foundational ${w1} & Core Definitions`,
          realmLocation: custom?.realmLocation || theme.realmLocation,
          kanji: custom?.kanji || theme.kanji,
          lore: custom?.lore || `AI-calibrated foundational entry point. Focuses strictly on essential principles of ${w1} to repair diagnosed misconceptions before advancing.`,
          themeColor: theme.themeColor,
          status: 'remediation_priority',
          masteryPct: Math.max(15, Math.min(45, scorePercentage)),
          stars: 0,
          isBoss: false,
          bossName: theme.defaultBossName,
          bossId: theme.defaultBossId,
          tier: 'easy',
          aiGenerated: true,
          aiRationale: custom?.aiRationale || `Calibrated for Beginner Tier (${scorePercentage}%): Diagnosed foundational friction in "${w1}". Stage 1 establishes intuitive definitions and step-by-step scaffolds before advancing.`,
          targetConcept: w1
        };
      }

      if (stageNumber === 2) {
        return {
          id: 2,
          stageNumber: 2,
          name: custom?.name || `Interactive Concept Lab: ${w2}`,
          conceptFocus: custom?.conceptFocus || `Intuitive Visual Modeling in ${w2}`,
          realmLocation: custom?.realmLocation || theme.realmLocation,
          kanji: custom?.kanji || theme.kanji,
          lore: custom?.lore || `A hands-on visual sandbox node. Experiment with parameter sliders to build physical intuition for ${w2}.`,
          themeColor: theme.themeColor,
          status: 'locked',
          masteryPct: Math.max(10, Math.round(scorePercentage * 0.7)),
          stars: 0,
          isBoss: false,
          bossName: theme.defaultBossName,
          bossId: theme.defaultBossId,
          tier: 'easy',
          aiGenerated: true,
          aiRationale: custom?.aiRationale || `Hands-on simulation and visual parameter experiments targeting "${w2}" to anchor physical and geometric intuition.`,
          targetConcept: w2
        };
      }

      if (stageNumber === 3) {
        return {
          id: 3,
          stageNumber: 3,
          name: custom?.name || `Scaffolded Application: ${w3}`,
          conceptFocus: custom?.conceptFocus || `Guided Multi-Step Application in ${w3}`,
          realmLocation: custom?.realmLocation || theme.realmLocation,
          kanji: custom?.kanji || theme.kanji,
          lore: custom?.lore || `Guided two-step numerical exercises bridging core definitions into standard exam problem formats.`,
          themeColor: theme.themeColor,
          status: 'locked',
          masteryPct: Math.max(10, Math.round(scorePercentage * 0.5)),
          stars: 0,
          isBoss: false,
          bossName: theme.defaultBossName,
          bossId: theme.defaultBossId,
          tier: 'easy',
          aiGenerated: true,
          aiRationale: custom?.aiRationale || `Guided multi-step numerical exercises bridging core definitions into standard problem formats.`,
          targetConcept: w3
        };
      }

      if (stageNumber === 4) {
        return {
          id: 4,
          stageNumber: 4,
          name: custom?.name || 'Consolidated Synthesis Challenge',
          conceptFocus: custom?.conceptFocus || 'Synthesis of Foundational Mechanics & Intermediate Readiness',
          realmLocation: custom?.realmLocation || theme.realmLocation,
          kanji: custom?.kanji || theme.kanji,
          lore: custom?.lore || `Synthesizes all recovered foundational principles into composite test problems to prepare for the milestone gatekeeper boss.`,
          themeColor: theme.themeColor,
          status: 'locked',
          masteryPct: Math.max(5, Math.round(scorePercentage * 0.3)),
          stars: 0,
          isBoss: false,
          bossName: theme.defaultBossName,
          bossId: theme.defaultBossId,
          tier: 'intermediate',
          aiGenerated: true,
          aiRationale: custom?.aiRationale || `Integrates prerequisite principles into composite scenarios to prepare for the milestone gatekeeper boss.`
        };
      }

      // Stage 5: Accessible Gatekeeper Boss
      return {
        id: 5,
        stageNumber: 5,
        name: custom?.name || `Guardian Boss Trial: ${theme.defaultBossName.split('(')[0].trim()}`,
        conceptFocus: custom?.conceptFocus || 'Foundational Mastery Assessment & Gatekeeper Exam',
        realmLocation: custom?.realmLocation || theme.realmLocation,
        kanji: custom?.kanji || theme.kanji,
        lore: custom?.lore || theme.defaultLore,
        themeColor: theme.themeColor,
        status: 'locked',
        masteryPct: Math.max(5, Math.round(scorePercentage * 0.2)),
        stars: 0,
        isBoss: true,
        bossName: theme.defaultBossName,
        bossId: theme.defaultBossId,
        tier: 'intermediate',
        aiGenerated: true,
        aiRationale: custom?.aiRationale || `Calibrated for Beginner Tier: Milestone gatekeeper evaluation validating core conceptual competence at accessible combat pacing.`
      };
    });
  }

  if (skillLevel === 'Intermediate') {
    // 4-7 Correct (40-75%): Targeted remediation of flagged gaps, analytical multi-variable dynamics, climax boss
    const hasGaps = allWeaknesses.length > 0;

    return themes.map((theme, idx) => {
      const stageNumber = idx + 1;
      const custom = hasValidCustomStages ? aiCustomStages[idx] : null;

      if (stageNumber === 1) {
        return {
          id: 1,
          stageNumber: 1,
          name: custom?.name || (hasGaps ? `Targeted Remediation: ${w1}` : `Core Principles: ${s1}`),
          conceptFocus: custom?.conceptFocus || (hasGaps ? `Targeted Resolution of Misconception in ${w1}` : `Precision Review of ${s1}`),
          realmLocation: custom?.realmLocation || theme.realmLocation,
          kanji: custom?.kanji || theme.kanji,
          lore: custom?.lore || (hasGaps 
            ? `Targeted remediation node zeroing in on the specific misconception flagged during your diagnostic assessment.` 
            : `Rapid refresher on core definitions to establish a clean trajectory toward advanced multi-step mechanics.`),
          themeColor: theme.themeColor,
          status: hasGaps ? 'remediation_priority' : 'unlocked',
          masteryPct: Math.max(35, scorePercentage - 10),
          stars: 0,
          isBoss: false,
          bossName: theme.defaultBossName,
          bossId: theme.defaultBossId,
          tier: 'easy',
          aiGenerated: true,
          aiRationale: custom?.aiRationale || (hasGaps 
            ? `Calibrated for Intermediate Tier (${scorePercentage}%): Diagnosed specific gap in "${w1}". Stage 1 resolves this misconception directly before moving to complex synthesis.`
            : `Calibrated for Intermediate Tier: Solidifies foundational principles to prepare for complex multi-variable problems.`),
          targetConcept: hasGaps ? w1 : s1
        };
      }

      if (stageNumber === 2) {
        return {
          id: 2,
          stageNumber: 2,
          name: custom?.name || `Core Mechanics & Problem Synthesis: ${s1}`,
          conceptFocus: custom?.conceptFocus || `Composite Analytical Problem Solving in ${s1}`,
          realmLocation: custom?.realmLocation || theme.realmLocation,
          kanji: custom?.kanji || theme.kanji,
          lore: custom?.lore || `Expand demonstrated diagnostic strengths into coupled systems and multi-variable problem solving.`,
          themeColor: theme.themeColor,
          status: 'locked',
          masteryPct: Math.max(25, scorePercentage - 15),
          stars: 0,
          isBoss: false,
          bossName: theme.defaultBossName,
          bossId: theme.defaultBossId,
          tier: 'intermediate',
          aiGenerated: true,
          aiRationale: custom?.aiRationale || `Capitalizes on demonstrated strength in "${s1}", expanding into multi-variable scenarios with mixed boundary constraints.`,
          targetConcept: s1
        };
      }

      if (stageNumber === 3) {
        return {
          id: 3,
          stageNumber: 3,
          name: custom?.name || `Multi-Variable Dynamics: ${w2}`,
          conceptFocus: custom?.conceptFocus || `Coupled Dynamic Systems & Interconnected Laws in ${w2}`,
          realmLocation: custom?.realmLocation || theme.realmLocation,
          kanji: custom?.kanji || theme.kanji,
          lore: custom?.lore || `Evaluate multi-variable scenarios with simultaneous equations and boundary limits.`,
          themeColor: theme.themeColor,
          status: 'locked',
          masteryPct: Math.max(20, scorePercentage - 25),
          stars: 0,
          isBoss: false,
          bossName: theme.defaultBossName,
          bossId: theme.defaultBossId,
          tier: 'intermediate',
          aiGenerated: true,
          aiRationale: custom?.aiRationale || `Applies multi-variable analytical synthesis across interconnected phenomena.`,
          targetConcept: w2
        };
      }

      if (stageNumber === 4) {
        return {
          id: 4,
          stageNumber: 4,
          name: custom?.name || 'High-Rigor Transfer & Edge Cases',
          conceptFocus: custom?.conceptFocus || 'Complex Edge Cases & Timed Problem Solving',
          realmLocation: custom?.realmLocation || theme.realmLocation,
          kanji: custom?.kanji || theme.kanji,
          lore: custom?.lore || `Test analytical agility against Espada attack timers and non-ideal physical constraints.`,
          themeColor: theme.themeColor,
          status: 'locked',
          masteryPct: Math.max(15, scorePercentage - 35),
          stars: 0,
          isBoss: false,
          bossName: theme.defaultBossName,
          bossId: theme.defaultBossId,
          tier: 'hard',
          aiGenerated: true,
          aiRationale: custom?.aiRationale || `Pushes problem-solving speed and edge-case boundary analysis against Espada combat strike timers.`
        };
      }

      // Stage 5: Climax Boss
      return {
        id: 5,
        stageNumber: 5,
        name: custom?.name || `Climax Realm Boss Battle: ${theme.defaultBossName.split('(')[0].trim()}`,
        conceptFocus: custom?.conceptFocus || 'Comprehensive Multi-Concept Exam Gauntlet',
        realmLocation: custom?.realmLocation || theme.realmLocation,
        kanji: custom?.kanji || theme.kanji,
        lore: custom?.lore || theme.defaultLore,
        themeColor: theme.themeColor,
        status: 'locked',
        masteryPct: Math.max(10, scorePercentage - 45),
        stars: 0,
        isBoss: true,
        bossName: theme.defaultBossName,
        bossId: theme.defaultBossId,
        tier: 'hard',
        aiGenerated: true,
        aiRationale: custom?.aiRationale || `Full-spectrum climax boss exam testing both conceptual depth and rapid tactical execution.`
      };
    });
  }

  // Advanced Tier (8-10 Correct, >75%)
  // Accelerated fast-track: foundations unlocked with high mastery (~85%), non-ideal constraints, supreme boss
  const hasResidualGap = allWeaknesses.length > 0;

  return themes.map((theme, idx) => {
    const stageNumber = idx + 1;
    const custom = hasValidCustomStages ? aiCustomStages[idx] : null;

    if (stageNumber === 1) {
      return {
        id: 1,
        stageNumber: 1,
        name: custom?.name || `Accelerated Proving Ground: ${s1}`,
        conceptFocus: custom?.conceptFocus || `Rapid Verification of ${s1}`,
        realmLocation: custom?.realmLocation || theme.realmLocation,
        kanji: custom?.kanji || theme.kanji,
        lore: custom?.lore || `Accelerated fast-track entry. Elementary definitions skipped; immediate proving grounds testing swift tactical execution.`,
        themeColor: theme.themeColor,
        status: 'unlocked',
        masteryPct: 85,
        stars: 0,
        isBoss: false,
        bossName: theme.defaultBossName,
        bossId: theme.defaultBossId,
        tier: 'intermediate',
        aiGenerated: true,
        aiRationale: custom?.aiRationale || `Accelerated Track (${scorePercentage}%): Exceptional diagnostic accuracy verified. Foundational stages fast-tracked with 85% initial mastery; immediate advancement to high-order challenges.`,
        targetConcept: s1
      };
    }

    if (stageNumber === 2) {
      return {
        id: 2,
        stageNumber: 2,
        name: custom?.name || 'Complex Systems & Non-Ideal Edge Cases',
        conceptFocus: custom?.conceptFocus || 'Non-Conservative Perturbations & Real-World Constraints',
        realmLocation: custom?.realmLocation || theme.realmLocation,
        kanji: custom?.kanji || theme.kanji,
        lore: custom?.lore || `Explore non-linear and second-order perturbational phenomena where idealized models break down.`,
        themeColor: theme.themeColor,
        status: 'locked',
        masteryPct: 70,
        stars: 0,
        isBoss: false,
        bossName: theme.defaultBossName,
        bossId: theme.defaultBossId,
        tier: 'hard',
        aiGenerated: true,
        aiRationale: custom?.aiRationale || `Bypasses elementary definitions, directly immersing the student into non-ideal constraints and second-order perturbation dynamics.`
      };
    }

    if (stageNumber === 3) {
      return {
        id: 3,
        stageNumber: 3,
        name: custom?.name || (hasResidualGap ? `Precision Proofs: ${w1}` : 'High-Rigor Analytical Proofs'),
        conceptFocus: custom?.conceptFocus || (hasResidualGap ? `Elimination of Residual Gap in ${w1}` : 'First-Principles Mathematical & Algorithmic Derivations'),
        realmLocation: custom?.realmLocation || theme.realmLocation,
        kanji: custom?.kanji || theme.kanji,
        lore: custom?.lore || (hasResidualGap 
          ? `High-rigor proof node designed to eradicate the single residual gap detected in your diagnostic test.` 
          : `Derive foundational equations and theorems from first principles under strict combat timing.`),
        themeColor: theme.themeColor,
        status: hasResidualGap ? 'remediation_priority' : 'locked',
        masteryPct: 55,
        stars: 0,
        isBoss: false,
        bossName: theme.defaultBossName,
        bossId: theme.defaultBossId,
        tier: 'hard',
        aiGenerated: true,
        aiRationale: custom?.aiRationale || (hasResidualGap
          ? `Precision challenge: Single diagnosed residual gap in "${w1}" subjected to rigorous proof-level evaluation.`
          : `First-principles mathematical and algorithmic proofs designed for top-percentile mastery.`),
        targetConcept: hasResidualGap ? w1 : undefined
      };
    }

    if (stageNumber === 4) {
      return {
        id: 4,
        stageNumber: 4,
        name: custom?.name || 'Transcendental Frontier Challenge',
        conceptFocus: custom?.conceptFocus || 'Extreme Edge Scenarios & Multi-Disciplinary Synthesis',
        realmLocation: custom?.realmLocation || theme.realmLocation,
        kanji: custom?.kanji || theme.kanji,
        lore: custom?.lore || `Transcendental problems demanding seamless synthesis across multiple domains under lethal combat penalties.`,
        themeColor: theme.themeColor,
        status: 'locked',
        masteryPct: 40,
        stars: 0,
        isBoss: false,
        bossName: theme.defaultBossName,
        bossId: theme.defaultBossId,
        tier: 'hard',
        aiGenerated: true,
        aiRationale: custom?.aiRationale || `Highest-tier analytical problem sets with strict combat arena damage parameters.`
      };
    }

    // Stage 5: Supreme Demigod Exam
    return {
      id: 5,
      stageNumber: 5,
      name: custom?.name || `Supreme Demigod Confrontation: ${theme.defaultBossName.split('(')[0].trim()}`,
      conceptFocus: custom?.conceptFocus || 'Apex Master Gauntlet & Bankai Finale',
      realmLocation: custom?.realmLocation || theme.realmLocation,
      kanji: custom?.kanji || theme.kanji,
      lore: custom?.lore || theme.defaultLore,
      themeColor: theme.themeColor,
      status: 'locked',
      masteryPct: 25,
      stars: 0,
      isBoss: true,
      bossName: theme.defaultBossName,
      bossId: theme.defaultBossId,
      tier: 'hard',
      aiGenerated: true,
      aiRationale: custom?.aiRationale || `The ultimate demigod confrontation against ${theme.defaultBossName.split('(')[0].trim()}. Requires flawless combo streaks to clear.`
    };
  });
}

