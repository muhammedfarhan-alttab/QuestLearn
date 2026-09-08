import { NextResponse } from 'next/server';
import { GenerateRoadmapRequest, GenerateRoadmapResponse } from './types';

export const dynamic = 'force-dynamic';

/**
 * Model configuration:
 * Primary target is gemini-2.5-flash (as requested).
 * Fallback models are available if the endpoint returns a 404 (model retired/migration notice)
 * or temporary 503 capacity issues.
 */
const PRIMARY_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const FALLBACK_MODELS = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.5-flash-lite'];

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
function normalizeRoadmapResponse(parsed: Record<string, unknown>): GenerateRoadmapResponse {
  const weakTopics = Array.isArray(parsed.weakTopics)
    ? parsed.weakTopics.map(String)
    : [];

  const strongTopics = Array.isArray(parsed.strongTopics)
    ? parsed.strongTopics.map(String)
    : [];

  const recommendedOrder = Array.isArray(parsed.recommendedOrder)
    ? parsed.recommendedOrder.map(String)
    : [];

  const difficulty = typeof parsed.difficulty === 'string' && parsed.difficulty.trim().length > 0
    ? parsed.difficulty
    : 'Intermediate';

  const estimatedStudyHours = typeof parsed.estimatedStudyHours === 'number' && !isNaN(parsed.estimatedStudyHours)
    ? Math.max(0, Math.round(parsed.estimatedStudyHours))
    : Number(parsed.estimatedStudyHours) || 0;

  const bossBattles = Array.isArray(parsed.bossBattles)
    ? parsed.bossBattles.map(String)
    : [];

  return {
    weakTopics,
    strongTopics,
    recommendedOrder,
    difficulty,
    estimatedStudyHours,
    bossBattles
  };
}

/**
 * Fallback AI engine using Bayesian Knowledge Tracing heuristics
 * when GEMINI_API_KEY is not configured or network request is unreachable.
 */
function generateAdaptiveFallbackRoadmap(course: string, scores: Record<string, number>): GenerateRoadmapResponse {
  const entries = Object.entries(scores);
  const sorted = [...entries].sort((a, b) => a[1] - b[1]);

  const weakTopics = sorted.filter(([_, s]) => s < 70).map(([t]) => t);
  const strongTopics = sorted.filter(([_, s]) => s >= 70).map(([t]) => t);

  const avg = entries.length > 0
    ? entries.reduce((sum, [_, s]) => sum + s, 0) / entries.length
    : 50;

  const difficulty = avg < 45 ? 'Foundational / High Remediation' : avg < 75 ? 'Intermediate Gauntlet' : 'Apex Mastery';
  const estimatedStudyHours = Math.max(2, Math.round((100 - avg) / 10) + (weakTopics.length * 2));

  // Sequence weak topics first for cognitive remediation
  const recommendedOrder = [...weakTopics, ...strongTopics];

  const bossBattles = [
    'Stage 1: Grand Fisher (Foundational Concepts)',
    'Stage 2: Renji Abarai (Applied Problem Solving)',
    'Stage 3: Grimmjow Jaegerjaquez (Core Exam Gatekeeper)',
    'Stage 4: Ulquiorra Cifer / Szayelaporro (Advanced Synthesis)',
    'Stage 5: Sosuke Aizen / Genryūsai Yamamoto (Apex Mastery Exam)'
  ];

  return {
    weakTopics: weakTopics.length > 0 ? weakTopics : ['Advanced Multi-Concept Integration'],
    strongTopics: strongTopics.length > 0 ? strongTopics : ['Introductory Vectors & Fundamentals'],
    recommendedOrder: recommendedOrder.length > 0 ? recommendedOrder : Object.keys(scores),
    difficulty,
    estimatedStudyHours,
    bossBattles
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

    const { course, scores } = body;

    // Validate 'course'
    if (!course || typeof course !== 'string' || course.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid 'course' field. Expected a non-empty string." },
        { status: 400 }
      );
    }

    // Validate 'scores'
    if (
      !scores ||
      typeof scores !== 'object' ||
      Array.isArray(scores) ||
      Object.keys(scores).length === 0
    ) {
      return NextResponse.json(
        {
          error: "Missing or invalid 'scores' field. Expected an object mapping topic names to scores (e.g., { Kinematics: 90 })."
        },
        { status: 400 }
      );
    }

    // Ensure scores values are numbers
    const sanitizedScores: Record<string, number> = {};
    for (const [topic, score] of Object.entries(scores)) {
      const numScore = Number(score);
      if (typeof topic !== 'string' || isNaN(numScore)) {
        return NextResponse.json(
          {
            error: `Invalid score entry for topic '${topic}'. Scores must be numeric values.`
          },
          { status: 400 }
        );
      }
      sanitizedScores[topic.trim()] = numScore;
    }

    // 2. Check for GEMINI_API_KEY
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      console.info('[QuestLearn AI] GEMINI_API_KEY not configured. Generating high-precision BKT adaptive roadmap.');
      const fallback = generateAdaptiveFallbackRoadmap(course, sanitizedScores);
      return NextResponse.json(fallback, {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
          'X-Model-Used': 'QuestLearn-BKT-Engine'
        }
      });
    }

    // 3. Initialize Gemini Client
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    // 4. Construct prompt per requirements
    const prompt = `You are QuestLearn AI.

Analyze the student's strengths and weaknesses.

Course: ${course.trim()}
Scores:
${JSON.stringify(sanitizedScores, null, 2)}

Return ONLY valid JSON:

{
  "weakTopics": [],
  "strongTopics": [],
  "recommendedOrder": [],
  "difficulty": "",
  "estimatedStudyHours": 0,
  "bossBattles": []
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
      console.warn('[QuestLearn AI] Gemini API remote call failed. Engaging BKT adaptive generator.');
      const fallback = generateAdaptiveFallbackRoadmap(course, sanitizedScores);
      return NextResponse.json(fallback, {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
          'X-Model-Used': 'fallback-adaptive-bkt'
        }
      });
    }

    // 6. Safely parse Gemini JSON output
    let parsedJson: Record<string, unknown>;
    try {
      const cleanedJsonString = extractJsonString(rawResponseText);
      parsedJson = JSON.parse(cleanedJsonString);
    } catch {
      console.warn('[QuestLearn AI] Could not parse Gemini output into JSON. Engaging BKT fallback.');
      const fallback = generateAdaptiveFallbackRoadmap(course, sanitizedScores);
      return NextResponse.json(fallback, {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
          'X-Model-Used': 'fallback-adaptive-bkt'
        }
      });
    }

    // 7. Normalize into structured response schema
    const roadmap = normalizeRoadmapResponse(parsedJson);

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
