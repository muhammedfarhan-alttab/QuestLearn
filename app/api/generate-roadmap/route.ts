import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { GenerateRoadmapRequest, GenerateRoadmapResponse } from './types';

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

export async function POST(req: Request) {
  try {
    // 1. Read and validate GEMINI_API_KEY
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server configuration error: GEMINI_API_KEY environment variable is missing or empty.' },
        { status: 500 }
      );
    }

    // 2. Safely parse and validate request body
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

    // 3. Initialize Gemini Client
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
    let lastError: unknown;
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
        lastError = err;
        // Check if error is due to model unavailability (e.g., 404 deprecation notice) or 503 capacity
        const errMsg = String((err as { message?: string })?.message || '');
        const isModelUnavailable = errMsg.includes('404') || errMsg.includes('503') || errMsg.includes('NOT_FOUND');
        if (isModelUnavailable) {
          console.warn(`[QuestLearn AI] Model '${modelName}' unavailable, attempting next candidate...`);
          continue;
        }
        // If it's another critical error (e.g. invalid auth), break and throw
        break;
      }
    }

    if (!rawResponseText) {
      console.error('[QuestLearn AI] Failed to generate roadmap with all candidate models:', lastError);
      const errorMessage = (lastError as { message?: string })?.message || 'Failed to generate response from Gemini API.';
      return NextResponse.json(
        {
          error: 'Gemini API generation failed.',
          details: errorMessage
        },
        { status: 502 }
      );
    }

    // 6. Safely parse Gemini JSON output
    let parsedJson: Record<string, unknown>;
    try {
      const cleanedJsonString = extractJsonString(rawResponseText);
      parsedJson = JSON.parse(cleanedJsonString);
    } catch (parseErr) {
      console.error('[QuestLearn AI] JSON parse failure from raw Gemini output:', rawResponseText, parseErr);
      return NextResponse.json(
        {
          error: 'Failed to parse Gemini response as valid JSON.',
          raw: rawResponseText
        },
        { status: 502 }
      );
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
    const errorMessage = (error as { message?: string })?.message || 'An unexpected internal error occurred.';
    return NextResponse.json(
      { error: 'Internal Server Error', details: errorMessage },
      { status: 500 }
    );
  }
}
