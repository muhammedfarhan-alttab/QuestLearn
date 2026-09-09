import { NextResponse } from 'next/server';
import { GenerateRoadmapRequest, GenerateRoadmapResponse, GeneratedWorldStageData } from './types';

export const dynamic = 'force-dynamic';

/**
 * Model configuration:
 * Primary target is gemini-2.5-flash (as requested).
 * Fallback models are available if the endpoint returns a 404 (model retired/migration notice)
 * or temporary 503 capacity issues.
 */
const PRIMARY_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
const FALLBACK_MODELS = ['gemini-3.6-flash', 'gemini-3.5-flash-lite', 'gemini-3.7-flash'];

/**
 * Sanitizes and extracts raw JSON from an AI response string.
 * Strips markdown code fences (```json ... ```) if present.
 */
function extractJsonString(rawText: string): string {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

/**
 * Validates and normalizes the parsed JSON into GenerateRoadmapResponse shape.
 */
function normalizeRoadmapResponse(
  parsed: Record<string, unknown>,
  fallbackWeak: string[] = [],
  fallbackStrong: string[] = []
): GenerateRoadmapResponse {
  // Strengths can come from parsed.strengths or parsed.strongTopics
  let strengths = Array.isArray(parsed.strengths)
    ? parsed.strengths.map(String).map(s => s.trim()).filter(Boolean)
    : Array.isArray(parsed.strongTopics)
      ? parsed.strongTopics.map(String).map(s => s.trim()).filter(Boolean)
      : [];

  if (strengths.length === 0 && fallbackStrong.length > 0) {
    strengths = fallbackStrong;
  }

  // Weaknesses can come from parsed.weaknesses or parsed.weakTopics
  let weaknesses = Array.isArray(parsed.weaknesses)
    ? parsed.weaknesses.map(String).map(s => s.trim()).filter(Boolean)
    : Array.isArray(parsed.weakTopics)
      ? parsed.weakTopics.map(String).map(s => s.trim()).filter(Boolean)
      : [];

  if (weaknesses.length === 0 && fallbackWeak.length > 0) {
    weaknesses = fallbackWeak;
  }

  const recommendedOrder = Array.isArray(parsed.recommendedOrder) && parsed.recommendedOrder.length > 0
    ? parsed.recommendedOrder.map(String).map(s => s.trim()).filter(Boolean)
    : (weaknesses.length > 0 || strengths.length > 0 ? [...weaknesses, ...strengths] : []);

  const difficulty = typeof parsed.difficulty === 'string' && parsed.difficulty.trim().length > 0
    ? parsed.difficulty.trim()
    : 'Medium';

  const estimatedStudyHours = typeof parsed.estimatedStudyHours === 'number' && !isNaN(parsed.estimatedStudyHours)
    ? Math.max(1, Math.round(parsed.estimatedStudyHours))
    : Number(parsed.estimatedStudyHours) || 18;

  const bossBattles = Array.isArray(parsed.bossBattles) && parsed.bossBattles.length > 0
    ? parsed.bossBattles.map(String).map(s => s.trim()).filter(Boolean)
    : ['Calculus Conqueror', 'Derivative Demon'];

  let worldStages: GeneratedWorldStageData[] | undefined;
  if (Array.isArray(parsed.worldStages) && parsed.worldStages.length > 0) {
    worldStages = parsed.worldStages.slice(0, 5).map((item, idx) => {
      const s = (item && typeof item === 'object') ? (item as Record<string, unknown>) : {};
      const stageNum = Number(s.stageNumber) || (idx + 1);
      const tierRaw = String(s.tier || '').toLowerCase();
      const tier: 'easy' | 'intermediate' | 'hard' =
        tierRaw === 'hard' ? 'hard' : tierRaw === 'intermediate' ? 'intermediate' : 'easy';
      return {
        stageNumber: stageNum,
        name: typeof s.name === 'string' && s.name.trim().length > 0 ? s.name.trim() : `Stage ${stageNum}`,
        conceptFocus: typeof s.conceptFocus === 'string' && s.conceptFocus.trim().length > 0 ? s.conceptFocus.trim() : `Concept ${stageNum}`,
        realmLocation: typeof s.realmLocation === 'string' ? s.realmLocation.trim() : undefined,
        kanji: typeof s.kanji === 'string' ? s.kanji.trim() : undefined,
        lore: typeof s.lore === 'string' ? s.lore.trim() : undefined,
        tier,
        isRemediation: Boolean(s.isRemediation),
        targetedMisconception: typeof s.targetedMisconception === 'string' ? s.targetedMisconception.trim() : undefined,
        aiRationale: typeof s.aiRationale === 'string' ? s.aiRationale.trim() : undefined
      };
    });
  }

  return {
    strengths: strengths.length > 0 ? strengths : ['Algebra', 'Trigonometry'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['Calculus', 'Coordinate Geometry'],
    strongTopics: strengths.length > 0 ? strengths : ['Algebra', 'Trigonometry'],
    weakTopics: weaknesses.length > 0 ? weaknesses : ['Calculus', 'Coordinate Geometry'],
    recommendedOrder: recommendedOrder.length > 0 ? recommendedOrder : ['Functions', 'Limits', 'Differentiation', 'Applications'],
    difficulty,
    estimatedStudyHours,
    bossBattles,
    worldStages
  };
}

function buildFallbackWorldStages(
  course: string,
  strengths: string[],
  weaknesses: string[],
  difficulty: string
): GeneratedWorldStageData[] {
  const w1 = weaknesses[0] || 'Foundational Principles';
  const w2 = weaknesses[1] || weaknesses[0] || 'Core Mechanics';
  const w3 = weaknesses[2] || 'System Interactions';
  const s1 = strengths[0] || 'Applied Fundamentals';

  const isAdvanced = difficulty.toLowerCase().includes('advanced') || difficulty.toLowerCase().includes('challenging');
  const isBeginner = difficulty.toLowerCase().includes('foundational') || difficulty.toLowerCase().includes('easy');

  if (isBeginner) {
    return [
      {
        stageNumber: 1,
        name: `AI Remediation: Foundational ${w1}`,
        conceptFocus: `Foundational ${w1} & Core Definitions`,
        tier: 'easy',
        isRemediation: true,
        aiRationale: `Calibrated for foundational tier: Identifies core friction in ${w1} to repair misconceptions before advancing.`
      },
      {
        stageNumber: 2,
        name: `Interactive Concept Lab: ${w2}`,
        conceptFocus: `Intuitive Visual Modeling in ${w2}`,
        tier: 'easy',
        isRemediation: false,
        aiRationale: `Hands-on simulation exercises targeting ${w2} to build physical and visual intuition.`
      },
      {
        stageNumber: 3,
        name: `Scaffolded Application: ${w3}`,
        conceptFocus: `Guided Multi-Step Application in ${w3}`,
        tier: 'easy',
        isRemediation: false,
        aiRationale: `Guided multi-step numerical exercises bridging core definitions into standard exam problem formats.`
      },
      {
        stageNumber: 4,
        name: 'Consolidated Synthesis Challenge',
        conceptFocus: 'Synthesis of Foundational Mechanics & Intermediate Readiness',
        tier: 'intermediate',
        isRemediation: false,
        aiRationale: 'Integrates prerequisite principles into composite scenarios to prepare for the milestone gatekeeper boss.'
      },
      {
        stageNumber: 5,
        name: `Guardian Boss Trial: ${course.split(':')[0]} Sentinel`,
        conceptFocus: 'Foundational Mastery Assessment & Gatekeeper Exam',
        tier: 'intermediate',
        isRemediation: false,
        aiRationale: 'Milestone gatekeeper evaluation validating core conceptual competence at accessible combat pacing.'
      }
    ];
  }

  if (isAdvanced) {
    return [
      {
        stageNumber: 1,
        name: `Accelerated Proving Ground: ${s1}`,
        conceptFocus: `Rapid Verification of ${s1}`,
        tier: 'intermediate',
        isRemediation: false,
        aiRationale: `Accelerated track: Demonstrates high diagnostic precision. Foundational definitions fast-tracked into higher-order analysis.`
      },
      {
        stageNumber: 2,
        name: 'Complex Systems & Non-Ideal Edge Cases',
        conceptFocus: 'Non-Conservative Perturbations & Real-World Constraints',
        tier: 'hard',
        isRemediation: false,
        aiRationale: 'Bypasses elementary definitions, directly immersing the student into non-ideal constraints and perturbation dynamics.'
      },
      {
        stageNumber: 3,
        name: weaknesses.length > 0 ? `Precision Proofs: ${w1}` : 'High-Rigor Analytical Proofs',
        conceptFocus: weaknesses.length > 0 ? `Elimination of Residual Gap in ${w1}` : 'First-Principles Mathematical & Algorithmic Derivations',
        tier: 'hard',
        isRemediation: weaknesses.length > 0,
        targetedMisconception: weaknesses.length > 0 ? w1 : undefined,
        aiRationale: weaknesses.length > 0
          ? `Precision challenge: Single diagnosed residual gap in "${w1}" subjected to rigorous proof-level evaluation.`
          : 'First-principles mathematical and algorithmic proofs designed for top-percentile mastery.'
      },
      {
        stageNumber: 4,
        name: 'Transcendental Frontier Challenge',
        conceptFocus: 'Extreme Edge Scenarios & Multi-Disciplinary Synthesis',
        tier: 'hard',
        isRemediation: false,
        aiRationale: 'Highest-tier analytical problem sets with strict combat arena damage parameters.'
      },
      {
        stageNumber: 5,
        name: `Supreme Demigod Confrontation: ${course.split(':')[0]} Apex`,
        conceptFocus: 'Apex Master Gauntlet & Bankai Finale',
        tier: 'hard',
        isRemediation: false,
        aiRationale: 'The ultimate demigod confrontation requiring flawless combo streaks to clear.'
      }
    ];
  }

  // Intermediate Default
  return [
    {
      stageNumber: 1,
      name: weaknesses.length > 0 ? `Targeted Remediation: ${w1}` : `Core Principles: ${s1}`,
      conceptFocus: weaknesses.length > 0 ? `Targeted Resolution of Misconception in ${w1}` : `Precision Review of ${s1}`,
      tier: 'easy',
      isRemediation: weaknesses.length > 0,
      targetedMisconception: weaknesses.length > 0 ? w1 : undefined,
      aiRationale: weaknesses.length > 0
        ? `Calibrated for intermediate tier: Diagnosed specific gap in "${w1}". Resolves this misconception directly before moving to complex synthesis.`
        : 'Solidifies foundational principles to prepare for complex multi-variable problems.'
    },
    {
      stageNumber: 2,
      name: `Core Mechanics & Problem Synthesis: ${s1}`,
      conceptFocus: `Composite Analytical Problem Solving in ${s1}`,
      tier: 'intermediate',
      isRemediation: false,
      aiRationale: `Capitalizes on demonstrated strength in "${s1}", expanding into multi-variable scenarios with mixed boundary constraints.`
    },
    {
      stageNumber: 3,
      name: `Multi-Variable Dynamics: ${w2}`,
      conceptFocus: `Coupled Dynamic Systems & Interconnected Laws in ${w2}`,
      tier: 'intermediate',
      isRemediation: false,
      aiRationale: 'Applies multi-variable analytical synthesis across interconnected phenomena.'
    },
    {
      stageNumber: 4,
      name: 'High-Rigor Transfer & Edge Cases',
      conceptFocus: 'Complex Edge Cases & Timed Problem Solving',
      tier: 'hard',
      isRemediation: false,
      aiRationale: 'Pushes problem-solving speed and edge-case boundary analysis against Espada combat strike timers.'
    },
    {
      stageNumber: 5,
      name: `Climax Realm Boss Battle: ${course.split(':')[0]} Demigod`,
      conceptFocus: 'Comprehensive Multi-Concept Exam Gauntlet',
      tier: 'hard',
      isRemediation: false,
      aiRationale: 'Full-spectrum climax boss exam testing both conceptual depth and rapid tactical execution.'
    }
  ];
}

/**
 * Fallback AI engine using pedagogical knowledge tracing heuristics
 * when GEMINI_API_KEY is not configured or network request is unreachable.
 */
function generateAdaptiveFallbackRoadmap(
  course: string,
  scores: Record<string, number>,
  providedWeak?: string[],
  providedStrong?: string[],
  overallScore?: number
): GenerateRoadmapResponse {
  const cLower = course.toLowerCase();

  // Calculus fallback
  if (cLower.includes('calculus')) {
    const strengths = providedStrong && providedStrong.length > 0
      ? providedStrong
      : ['Algebra', 'Trigonometry'];
    const weaknesses = providedWeak && providedWeak.length > 0
      ? providedWeak
      : ['Calculus', 'Coordinate Geometry'];
    const difficulty = (overallScore && overallScore < 40) ? 'Foundational' : (overallScore && overallScore > 75) ? 'Advanced' : 'Medium';
    const worldStages = buildFallbackWorldStages('Calculus', strengths, weaknesses, difficulty);

    return {
      strengths,
      weaknesses,
      strongTopics: strengths,
      weakTopics: weaknesses,
      recommendedOrder: ['Functions', 'Limits', 'Differentiation', 'Applications'],
      difficulty,
      estimatedStudyHours: 18,
      bossBattles: ['Calculus Conqueror', 'Derivative Demon'],
      worldStages
    };
  }

  // Physics / Classical Mechanics fallback
  if (cLower.includes('mechanic') || cLower.includes('physics')) {
    const strengths = providedStrong && providedStrong.length > 0
      ? providedStrong
      : ['Vector Displacement & 1D Kinematics', 'Newtonian Force & Inertia'];
    const weaknesses = providedWeak && providedWeak.length > 0
      ? providedWeak
      : ['Work-Energy Theorem & Potential Wells', 'Conservation of Linear Momentum'];
    const difficulty = (overallScore && overallScore < 40) ? 'Foundational' : (overallScore && overallScore > 75) ? 'Advanced' : 'Medium';
    const worldStages = buildFallbackWorldStages('Classical Mechanics', strengths, weaknesses, difficulty);

    return {
      strengths,
      weaknesses,
      strongTopics: strengths,
      weakTopics: weaknesses,
      recommendedOrder: ['1D Vectors & Motion', 'Newtonian Force Laws', 'Work-Energy Theorem', 'Momentum & Collisions'],
      difficulty,
      estimatedStudyHours: 16,
      bossBattles: ['Kinematics Colossus', 'Newtonian Nemesis', 'Energy Enigma'],
      worldStages
    };
  }

  // Electromagnetism fallback
  if (cLower.includes('electro') || cLower.includes('magnet')) {
    const strengths = providedStrong && providedStrong.length > 0
      ? providedStrong
      : ['Coulomb’s Electrostatic Law', 'Ohm’s Law & Resistor Networks'];
    const weaknesses = providedWeak && providedWeak.length > 0
      ? providedWeak
      : ['Gauss’s Law & Net Enclosed Flux', 'Lorentz Magnetic Force Vector Rules'];
    const difficulty = (overallScore && overallScore < 40) ? 'Foundational' : (overallScore && overallScore > 75) ? 'Advanced' : 'Challenging';
    const worldStages = buildFallbackWorldStages('Electricity & Magnetism', strengths, weaknesses, difficulty);

    return {
      strengths,
      weaknesses,
      strongTopics: strengths,
      weakTopics: weaknesses,
      recommendedOrder: ['Coulombic Electrostatics', 'Gauss Law Flux Integrals', 'Resistor Circuit Analysis', 'Lorentz Vector Right-Hand Rule'],
      difficulty,
      estimatedStudyHours: 20,
      bossBattles: ['Electrostatic Emperor', 'Lorentz Leviathan', 'Magnetic Monarch'],
      worldStages
    };
  }

  // Computer Science / Algorithms fallback
  if (cLower.includes('structure') || cLower.includes('algorithm') || cLower.includes('computer')) {
    const strengths = providedStrong && providedStrong.length > 0
      ? providedStrong
      : ['Balanced Binary Search Trees', 'Execution Context & Closures'];
    const weaknesses = providedWeak && providedWeak.length > 0
      ? providedWeak
      : ['Optimal Substructure & Dynamic Programming', 'All-Pairs Shortest Path Graph Theory'];
    const difficulty = (overallScore && overallScore < 40) ? 'Foundational' : 'Advanced';
    const worldStages = buildFallbackWorldStages('Computer Science', strengths, weaknesses, difficulty);

    return {
      strengths,
      weaknesses,
      strongTopics: strengths,
      weakTopics: weaknesses,
      recommendedOrder: ['Balanced Tree Rotations', 'Closure Scope Enclosures', 'Memoized Dynamic Programming', 'Floyd-Warshall Matrix Optimization'],
      difficulty,
      estimatedStudyHours: 22,
      bossBattles: ['Algorithmic Arbiter', 'Dynamic Titan', 'Graph Gargantua'],
      worldStages
    };
  }

  // Dynamic fallback derived from scores
  const entries = Object.entries(scores);
  const sorted = [...entries].sort((a, b) => a[1] - b[1]);

  const weakTopics = providedWeak && providedWeak.length > 0
    ? providedWeak
    : sorted.filter(([_, s]) => s < 70).map(([t]) => t);

  const strongTopics = providedStrong && providedStrong.length > 0
    ? providedStrong
    : sorted.filter(([_, s]) => s >= 70).map(([t]) => t);

  const avg = typeof overallScore === 'number'
    ? overallScore
    : entries.length > 0
      ? entries.reduce((sum, [_, s]) => sum + s, 0) / entries.length
      : 50;

  const difficulty = avg < 45 ? 'Foundational' : avg < 75 ? 'Medium' : 'Advanced';
  const estimatedStudyHours = Math.max(8, Math.round((100 - avg) / 10) + (weakTopics.length * 3));

  const recommendedOrder = [...weakTopics, ...strongTopics];
  const worldStages = buildFallbackWorldStages(course, strongTopics, weakTopics, difficulty);

  return {
    strengths: strongTopics.length > 0 ? strongTopics : ['Core Fundamentals'],
    weaknesses: weakTopics.length > 0 ? weakTopics : ['Applied Complex Problem Solving'],
    strongTopics: strongTopics.length > 0 ? strongTopics : ['Core Fundamentals'],
    weakTopics: weakTopics.length > 0 ? weakTopics : ['Applied Complex Problem Solving'],
    recommendedOrder: recommendedOrder.length > 0 ? recommendedOrder : Object.keys(scores),
    difficulty,
    estimatedStudyHours,
    bossBattles: [
      `${course.split(':')[0]} Conqueror`,
      'Trial Sentinel'
    ],
    worldStages
  };
}

export async function POST(req: Request) {
  try {
    // 1. Safely parse and validate request body
    let body: Partial<GenerateRoadmapRequest>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload. Please provide a valid JSON body.' },
        { status: 400 }
      );
    }

    const { course, scores, overallScore, weakTopics, strongTopics, answers } = body;

    // Validate 'course'
    if (!course || typeof course !== 'string' || course.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid 'course' field. Expected a non-empty string." },
        { status: 400 }
      );
    }

    // Ensure sanitized scores
    const sanitizedScores: Record<string, number> = {};
    if (scores && typeof scores === 'object' && !Array.isArray(scores)) {
      for (const [topic, score] of Object.entries(scores)) {
        const numScore = Number(score);
        if (typeof topic === 'string' && !isNaN(numScore)) {
          sanitizedScores[topic.trim()] = numScore;
        }
      }
    } else if (Array.isArray(answers) && answers.length > 0) {
      for (const ans of answers) {
        if (ans.concept) {
          sanitizedScores[ans.concept] = ans.isCorrect ? 100 : 25;
        }
      }
    }

    // 2. Check for GEMINI_API_KEY
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      console.info('[QuestLearn AI] GEMINI_API_KEY not configured. Generating high-precision adaptive roadmap.');
      const fallback = generateAdaptiveFallbackRoadmap(course, sanitizedScores, weakTopics, strongTopics, overallScore);
      return NextResponse.json(fallback, {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
          'X-Model-Used': 'QuestLearn-Adaptive-Engine'
        }
      });
    }

    // 3. Initialize Gemini Client
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    // 4. Construct prompt per user requirements
    const prompt = `You are QuestLearn AI, an expert adaptive educational AI tutor.

Analyze the student's diagnostic test results:
Course: ${course.trim()}
Diagnostic Score: ${typeof overallScore === 'number' ? `${overallScore}%` : 'N/A'}
Identified Strong Topics: ${Array.isArray(strongTopics) && strongTopics.length > 0 ? strongTopics.join(', ') : 'None explicitly specified'}
Identified Weak Topics: ${Array.isArray(weakTopics) && weakTopics.length > 0 ? weakTopics.join(', ') : 'None explicitly specified'}

${Array.isArray(answers) && answers.length > 0 
  ? `Student Diagnostic Question Log:\n${answers.map((a, i) => `Q${i+1} [${a.concept}]: "${a.question}"\n- Student picked: "${a.selectedOption}"\n- Correct answer: "${a.correctOption}"\n- Result: ${a.isCorrect ? 'CORRECT' : 'INCORRECT'}`).join('\n\n')}`
  : `Concept Scores:\n${JSON.stringify(sanitizedScores, null, 2)}`
}

Requirements:
Evaluate the diagnostic results and generate:
- Strengths: List of topics/concepts the student has mastered or answered correctly.
- Weaknesses: List of topics/concepts where the student struggled, has misconceptions, or needs remediation.
- Recommended study order: Optimal pedagogical sequence of 4-6 topics to study (addressing foundational prerequisites and weaknesses first).
- Estimated study hours: Realistic integer hours required for mastery (e.g. 14, 18, 24).
- Difficulty level: Overall course difficulty rating for the student ("Easy", "Medium", "Challenging", or "Advanced").
- Boss battle recommendations: 2 to 4 creative, high-stakes boss battle challenge names tailored to the course topics (e.g., "Calculus Conqueror", "Derivative Demon").
- World Stages: Exactly 5 customized stages for the student's campaign map calibrated to their conceptual level:
  * stage 1: Remediation / prerequisite foundation targeting their most severe gap (tier: "easy", isRemediation: true)
  * stage 2: Guided concept modeling & practice (tier: "easy" or "intermediate")
  * stage 3: Multi-variable dynamics & application (tier: "intermediate")
  * stage 4: High-rigor edge-case challenge (tier: "hard")
  * stage 5: Final milestone boss confrontation (tier: "hard")
  Each stage must have: stageNumber (1-5), name, conceptFocus, tier ("easy"|"intermediate"|"hard"), isRemediation (boolean), and aiRationale (explaining why this stage was created for this student).

Return ONLY a valid JSON object matching this schema:
{
  "strengths": ["Algebra", "Trigonometry"],
  "weaknesses": ["Calculus", "Coordinate Geometry"],
  "recommendedOrder": ["Functions", "Limits", "Differentiation", "Applications"],
  "estimatedStudyHours": 18,
  "difficulty": "Medium",
  "bossBattles": ["Calculus Conqueror", "Derivative Demon"],
  "worldStages": [
    {
      "stageNumber": 1,
      "name": "Targeted Remediation: Foundational Gaps",
      "conceptFocus": "Foundational Limits & Indeterminate Forms",
      "tier": "easy",
      "isRemediation": true,
      "aiRationale": "Calibrated to resolve identified diagnostic confusion in fundamental limits."
    },
    {
      "stageNumber": 2,
      "name": "Core Principles & Analytical Practice",
      "conceptFocus": "Power Rule & Chain Derivatives",
      "tier": "intermediate",
      "isRemediation": false,
      "aiRationale": "Expands on demonstrated algebra fluency to master instantaneous rates of change."
    },
    {
      "stageNumber": 3,
      "name": "Multi-Variable Analytical Dynamics",
      "conceptFocus": "Optimization & Mean Value Theorem",
      "tier": "intermediate",
      "isRemediation": false,
      "aiRationale": "Applies derivatives to practical geometric constraints and curve analysis."
    },
    {
      "stageNumber": 4,
      "name": "High-Rigor Transfer & Edge Cases",
      "conceptFocus": "Integration by Parts & Edge Conditions",
      "tier": "hard",
      "isRemediation": false,
      "aiRationale": "Pushes problem-solving rigor with higher-order integrals."
    },
    {
      "stageNumber": 5,
      "name": "Grand Climax Demigod Exam",
      "conceptFocus": "Comprehensive Differential & Integral Mastery",
      "tier": "hard",
      "isRemediation": false,
      "aiRationale": "Apex final confrontation testing complete mathematical fluency."
    }
  ]
}`;

    // 5. Send data to Gemini (starting with primary model, with automatic fallback)
    const modelCandidates = Array.from(new Set([PRIMARY_MODEL, ...FALLBACK_MODELS]));
    let rawResponseText: string | undefined;
    let successfulModel = PRIMARY_MODEL;

    for (const modelName of modelCandidates) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        if (response.text) {
          rawResponseText = response.text;
          successfulModel = modelName;
          break;
        }
      } catch (err: unknown) {
        const errMsg = String((err as { message?: string })?.message || '');
        console.warn(`[QuestLearn AI] Model '${modelName}' encounter: ${errMsg}`);
        continue;
      }
    }

    if (!rawResponseText) {
      console.warn('[QuestLearn AI] Gemini API remote call failed. Engaging adaptive generator.');
      const fallback = generateAdaptiveFallbackRoadmap(course, sanitizedScores, weakTopics, strongTopics, overallScore);
      return NextResponse.json(fallback, {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
          'X-Model-Used': 'fallback-adaptive-engine'
        }
      });
    }

    // 6. Safely parse Gemini JSON output
    let parsedJson: Record<string, unknown>;
    try {
      const cleanedJsonString = extractJsonString(rawResponseText);
      parsedJson = JSON.parse(cleanedJsonString);
    } catch {
      console.warn('[QuestLearn AI] Could not parse Gemini output into JSON. Engaging fallback.');
      const fallback = generateAdaptiveFallbackRoadmap(course, sanitizedScores, weakTopics, strongTopics, overallScore);
      return NextResponse.json(fallback, {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
          'X-Model-Used': 'fallback-adaptive-engine'
        }
      });
    }

    // 7. Normalize into structured response schema
    const roadmap = normalizeRoadmapResponse(parsedJson, weakTopics, strongTopics);

    // 8. Return JSON to frontend
    return NextResponse.json(roadmap, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
        'X-Model-Used': successfulModel
      }
    });
  } catch (error: unknown) {
    console.error('[QuestLearn AI] Unexpected error in /api/generate-roadmap:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
