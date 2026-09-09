import { NextResponse } from 'next/server';
import { GenerateQuestionsRequest, GeneratedQuestion, GenerateQuestionsResponse } from './types';
import { getStageQuestions, COURSE_STAGE_QUESTIONS } from '../../../data/courseQuestions';

export const dynamic = 'force-dynamic';

const PRIMARY_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const FALLBACK_MODELS = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.5-flash-lite'];

/**
 * Sanitizes and extracts raw JSON from an AI response string.
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
 * Generates a full 25-question battery from the existing static question bank
 * when Gemini is unreachable or GEMINI_API_KEY is not configured.
 */
function generateFallbackQuestions(
  courseId: string = 'course-mechanics',
  stageNumber: number = 1,
  topic: string = 'Foundational Concepts',
  difficulty: string = 'easy',
  referenceQuestions?: Array<{ question: string; options: string[]; answer: number; explanation: string }>,
  attempt: number = 1
): GeneratedQuestion[] {
  // Get base questions from static bank
  let baseQuestions = referenceQuestions && referenceQuestions.length > 0
    ? referenceQuestions
    : getStageQuestions(courseId, stageNumber);

  if (!baseQuestions || baseQuestions.length === 0) {
    baseQuestions = COURSE_STAGE_QUESTIONS['course-mechanics'][1] || [];
  }

  const diffTag = (difficulty === 'hard' ? 'hard' : difficulty === 'intermediate' ? 'intermediate' : 'easy') as 'easy' | 'intermediate' | 'hard';
  const multiplier = attempt > 1 ? attempt : 1;

  const results: GeneratedQuestion[] = [];

  // Scenario prefixes to dynamically change context on subsequent attempts
  const scenarioPool = [
    { vehicle: 'A high-speed train', factor: 1.0 },
    { vehicle: 'A sports car', factor: 1.5 },
    { vehicle: 'An electric rover', factor: 0.8 },
    { vehicle: 'A maglev transport', factor: 2.0 },
    { vehicle: 'A deep-space probe', factor: 3.0 },
    { vehicle: 'A commuter bus', factor: 1.2 },
    { vehicle: 'A supersonic jet', factor: 2.5 },
    { vehicle: 'A cargo drone', factor: 0.6 },
    { vehicle: 'A test projectile', factor: 1.8 },
    { vehicle: 'A subatomic particle beam', factor: 4.0 }
  ];

  for (let i = 0; i < 25; i++) {
    const base = baseQuestions[i % baseQuestions.length];
    const scenario = scenarioPool[(i + attempt) % scenarioPool.length];
    
    // Create an evolved variant for subsequent questions
    const isVariant = i >= baseQuestions.length || attempt > 1;
    let questionText = base.question;
    let explanationText = base.explanation;

    if (isVariant) {
      // Modify scenario wording
      if (questionText.toLowerCase().includes('train') || questionText.toLowerCase().includes('car') || questionText.toLowerCase().includes('object')) {
        questionText = questionText.replace(/A train|A car|An object|A particle/gi, scenario.vehicle);
      } else {
        questionText = `[Variation ${i + 1}] (${scenario.vehicle}) ${questionText}`;
      }
      explanationText = `${explanationText} (Calibrated for ${scenario.vehicle} context with factor ${multiplier}).`;
    }

    // Ensure 4 valid options
    const options = Array.isArray(base.options) && base.options.length >= 4
      ? [...base.options.slice(0, 4)]
      : ['Option A', 'Option B', 'Option C', 'Option D'];

    results.push({
      id: `q-gen-${stageNumber}-${i + 1}-att${attempt}`,
      courseId,
      stageNumber,
      subtopicName: topic,
      question: questionText,
      options,
      answer: typeof base.answer === 'number' && base.answer >= 0 && base.answer < options.length ? base.answer : 0,
      explanation: explanationText,
      difficulty: diffTag,
      rewardXp: 50 + (i * 5),
      rewardGeo: 25 + (i * 2)
    });
  }

  return results;
}

export async function POST(req: Request) {
  try {
    let body: Partial<GenerateQuestionsRequest>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload. Expected GenerateQuestionsRequest body.' },
        { status: 400 }
      );
    }

    const {
      topic,
      difficulty = 'easy',
      previousPerformance,
      strengths = [],
      weaknesses = [],
      diagnosticSkillLevel,
      diagnosticScore,
      courseId = 'course-mechanics',
      courseTitle,
      stageNumber = 1,
      attempt = 1,
      referenceQuestions = []
    } = body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing required 'topic' field." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      console.info('[QuestLearn AI] GEMINI_API_KEY not set. Engaging dynamic question fallback generator.');
      const fallbackQuestions = generateFallbackQuestions(
        courseId,
        stageNumber,
        topic,
        difficulty,
        referenceQuestions,
        attempt
      );
      return NextResponse.json({
        questions: fallbackQuestions,
        topic,
        difficulty,
        source: 'fallback',
        attempt
      } satisfies GenerateQuestionsResponse, {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
          'X-Question-Source': 'Static-Bank-Fallback'
        }
      });
    }

    // Initialize Gemini AI Client
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    // Format reference question samples for concept guidance
    const refSamples = Array.isArray(referenceQuestions) && referenceQuestions.length > 0
      ? referenceQuestions.slice(0, 5).map((q, idx) => `Sample ${idx + 1}: "${q.question}" [Correct: "${q.options[q.answer] || q.options[0]}"]`).join('\n')
      : 'Standard undergraduate syllabus curriculum for this topic.';

    const prompt = `You are QuestLearn AI, an expert STEM academic curriculum examiner.

Topic Name: "${topic.trim()}"
Difficulty Tier: "${difficulty}"
Course Context: "${courseTitle || courseId}"
Attempt Number: ${attempt}

Student Profile:
- Calibrated Diagnostic Skill Level: ${diagnosticSkillLevel || 'Intermediate'}${typeof diagnosticScore === 'number' ? ` (${diagnosticScore}% Diagnostic Accuracy)` : ''}
- Previous Performance: ${previousPerformance ? `Accuracy: ${previousPerformance.accuracy ?? 75}%, Score: ${previousPerformance.score ?? 70}%, Max Streak: ${previousPerformance.streak ?? 0}` : 'First Attempt'}
- Student Strengths: ${strengths.length > 0 ? strengths.join(', ') : 'Foundational concepts'}
- Student Weaknesses: ${weaknesses.length > 0 ? weaknesses.join(', ') : 'Complex multi-step synthesis'}

Reference Concept Guide:
${refSamples}

STRICT REQUIREMENTS:
1. Generate EXACTLY 25 Multiple-Choice Questions (MCQs).
2. Each question MUST have EXACTLY 4 distinct, plausible options.
3. The "answer" field MUST be the integer index (0, 1, 2, or 3) indicating which option in the "options" array is correct.
4. Distribute the correct answer across indices 0, 1, 2, and 3 (do NOT put all answers at index 0).
5. Provide a rigorous, step-by-step academic "explanation" showing the exact formula or logic.
6. CONCEPT FIDELITY: All 25 questions MUST test "${topic.trim()}" with high academic quality.
7. NEVER BE IDENTICAL TO PREVIOUS ATTEMPTS:
   - Change values, scenarios, wording, physical objects, and examples.
   - For example: if a problem was about a train moving at 60 km/h, rewrite it for a spacecraft accelerating at 15 m/s², a sports car braking, a drone climbing, etc.
   - The underlying mathematical/scientific concept remains the same, but the scenario and numbers must be completely fresh!

Return ONLY valid JSON:
{
  "questions": [
    {
      "id": "q1",
      "question": "Clear question text with specific numbers and scenarios...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 0,
      "explanation": "Step-by-step working..."
    }
  ]
}`;

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
        console.warn(`[QuestLearn AI] Question Generator model '${modelName}' warning: ${errMsg}`);
        continue;
      }
    }

    if (!rawResponseText) {
      console.warn('[QuestLearn AI] Gemini remote call returned empty. Using fallback.');
      const fallbackQuestions = generateFallbackQuestions(
        courseId,
        stageNumber,
        topic,
        difficulty,
        referenceQuestions,
        attempt
      );
      return NextResponse.json({
        questions: fallbackQuestions,
        topic,
        difficulty,
        source: 'fallback',
        attempt
      } satisfies GenerateQuestionsResponse, {
        status: 200,
        headers: { 'X-Question-Source': 'fallback' }
      });
    }

    // Safely parse JSON
    let parsed: Record<string, unknown>;
    try {
      const cleaned = extractJsonString(rawResponseText);
      parsed = JSON.parse(cleaned);
    } catch {
      console.warn('[QuestLearn AI] Could not parse Gemini questions JSON. Using fallback.');
      const fallbackQuestions = generateFallbackQuestions(
        courseId,
        stageNumber,
        topic,
        difficulty,
        referenceQuestions,
        attempt
      );
      return NextResponse.json({
        questions: fallbackQuestions,
        topic,
        difficulty,
        source: 'fallback',
        attempt
      } satisfies GenerateQuestionsResponse, {
        status: 200,
        headers: { 'X-Question-Source': 'fallback' }
      });
    }

    const rawList = Array.isArray(parsed.questions)
      ? (parsed.questions as Array<Record<string, unknown>>)
      : [];

    const diffTag = (difficulty === 'hard' ? 'hard' : difficulty === 'intermediate' ? 'intermediate' : 'easy') as 'easy' | 'intermediate' | 'hard';

    // Normalize and validate parsed questions
    const normalizedQuestions: GeneratedQuestion[] = rawList
      .filter(q => q && typeof q.question === 'string' && Array.isArray(q.options) && q.options.length >= 4)
      .map((q, idx) => {
        const options = (q.options as unknown[]).slice(0, 4).map(String);
        let ansIdx = Number(q.answer);
        if (isNaN(ansIdx) || ansIdx < 0 || ansIdx >= 4) {
          ansIdx = 0;
        }

        return {
          id: `gemini-q-${stageNumber}-${idx + 1}-att${attempt}`,
          courseId,
          stageNumber,
          subtopicName: topic,
          question: String(q.question).trim(),
          options,
          answer: ansIdx,
          explanation: typeof q.explanation === 'string' && q.explanation.trim().length > 0
            ? q.explanation.trim()
            : 'Derived from underlying theoretical and mathematical principles.',
          difficulty: diffTag,
          rewardXp: 50 + (idx * 5),
          rewardGeo: 25 + (idx * 2)
        };
      });

    // If Gemini returned fewer than 25 questions, pad with procedural fallback
    if (normalizedQuestions.length < 25) {
      const padFallback = generateFallbackQuestions(
        courseId,
        stageNumber,
        topic,
        difficulty,
        referenceQuestions,
        attempt
      );
      for (let i = normalizedQuestions.length; i < 25; i++) {
        normalizedQuestions.push(padFallback[i % padFallback.length]);
      }
    }

    return NextResponse.json({
      questions: normalizedQuestions.slice(0, 25),
      topic,
      difficulty,
      source: 'gemini',
      attempt
    } satisfies GenerateQuestionsResponse, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
        'X-Model-Used': successfulModel
      }
    });
  } catch (error: unknown) {
    console.error('[QuestLearn AI] Unexpected error in /api/generate-questions:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
