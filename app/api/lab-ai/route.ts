import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { 
  LabAiRequest, 
  LabAiConfigureResponse, 
  LabAiExplainResponse, 
  LabAiChallengeResponse 
} from './types';
import { getPracticalModelConfig } from '../../data/practicalModelsData';
import { generateDynamicExplanation, computeDerivedMetrics } from '../../lib/labExplanationEngine';

export const dynamic = 'force-dynamic';

const PRIMARY_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const FALLBACK_MODELS = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.5-flash-lite'];

function extractJsonString(rawText: string): string {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

export async function POST(req: Request) {
  try {
    const body: LabAiRequest = await req.json();
    const { action, courseId, stageNumber, subtopicName, modelType, currentParams, previousParams, derivedMetrics, studentPrompt } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    const isAiAvailable = Boolean(apiKey && apiKey.trim().length > 0 && !apiKey.includes('placeholder'));

    // -------------------------------------------------------------------------
    // ACTION 1: CONFIGURE LAB
    // -------------------------------------------------------------------------
    if (action === 'configure_lab') {
      const baseConfig = getPracticalModelConfig(courseId || 'course-mechanics', stageNumber || 1);

      if (!isAiAvailable) {
        return NextResponse.json({
          success: true,
          modelType: baseConfig.modelType,
          title: baseConfig.title,
          learningGoals: baseConfig.learningGoals,
          guidedTasks: baseConfig.guidedTasks.map(t => ({
            id: t.id,
            title: t.title,
            instruction: t.instruction,
            hint: t.hint,
            targetMetric: t.targetMetric,
            targetValue: t.targetValue,
            tolerance: t.tolerance,
            rewardXp: t.rewardXp,
            rewardGeo: t.rewardGeo
          })),
          whatIfPrompts: baseConfig.whatIfPrompts,
          source: 'fallback'
        } satisfies LabAiConfigureResponse);
      }

      const prompt = `You are a world-class Class 12 Physics & STEM interactive simulation designer.
We are configuring an interactive practical model for students.

COURSE ID: "${courseId}"
STAGE NUMBER: ${stageNumber}
SUBTOPIC: "${subtopicName || baseConfig.subtopicName}"
BASE MODEL TYPE: "${baseConfig.modelType}"
BASE TITLE: "${baseConfig.title}"

TASK:
1. Provide a focused, exciting title for this interactive laboratory.
2. Provide 3 crisp learning goals tailored for Class 12 students.
3. Provide 3 gamified guided experiment tasks (mini-challenges) the student can complete by tuning simulation variables.
   Include targetMetric, targetValue, tolerance, rewardXp (25-45), rewardGeo (15-25), instruction, and an intuitive hint.
4. Provide 3 thought-provoking "What if?" conceptual exploration questions.

Return ONLY valid JSON with this exact schema:
{
  "title": "Exciting Lab Title",
  "learningGoals": ["Goal 1", "Goal 2", "Goal 3"],
  "guidedTasks": [
    {
      "id": "ai-t1",
      "title": "Task 1 Name",
      "instruction": "Specific parameter adjustment goal...",
      "hint": "Physical principle hint...",
      "targetMetric": "acceleration",
      "targetValue": 5.0,
      "tolerance": 0.2,
      "rewardXp": 30,
      "rewardGeo": 15
    }
  ],
  "whatIfPrompts": ["Prompt 1", "Prompt 2", "Prompt 3"]
}`;

      try {
        const ai = new GoogleGenAI({ apiKey });
        const modelCandidates = Array.from(new Set([PRIMARY_MODEL, ...FALLBACK_MODELS]));
        let rawText: string | undefined;

        for (const model of modelCandidates) {
          try {
            const res = await ai.models.generateContent({
              model,
              contents: prompt,
              config: { responseMimeType: 'application/json' }
            });
            if (res.text) {
              rawText = res.text;
              break;
            }
          } catch (err) {
            console.warn(`[Lab AI] Model ${model} failed for configure_lab:`, err);
          }
        }

        if (rawText) {
          const parsed = JSON.parse(extractJsonString(rawText));
          return NextResponse.json({
            success: true,
            modelType: baseConfig.modelType,
            title: parsed.title || baseConfig.title,
            learningGoals: Array.isArray(parsed.learningGoals) && parsed.learningGoals.length > 0 ? parsed.learningGoals : baseConfig.learningGoals,
            guidedTasks: Array.isArray(parsed.guidedTasks) && parsed.guidedTasks.length > 0 ? parsed.guidedTasks : baseConfig.guidedTasks.map(t => ({
              id: t.id,
              title: t.title,
              instruction: t.instruction,
              hint: t.hint,
              targetMetric: t.targetMetric,
              targetValue: t.targetValue,
              tolerance: t.tolerance,
              rewardXp: t.rewardXp,
              rewardGeo: t.rewardGeo
            })),
            whatIfPrompts: Array.isArray(parsed.whatIfPrompts) && parsed.whatIfPrompts.length > 0 ? parsed.whatIfPrompts : baseConfig.whatIfPrompts,
            source: 'ai'
          } satisfies LabAiConfigureResponse);
        }
      } catch (err) {
        console.warn('[Lab AI] Gemini configure_lab error, falling back:', err);
      }

      // Fallback
      return NextResponse.json({
        success: true,
        modelType: baseConfig.modelType,
        title: baseConfig.title,
        learningGoals: baseConfig.learningGoals,
        guidedTasks: baseConfig.guidedTasks.map(t => ({
          id: t.id,
          title: t.title,
          instruction: t.instruction,
          hint: t.hint,
          targetMetric: t.targetMetric,
          targetValue: t.targetValue,
          tolerance: t.tolerance,
          rewardXp: t.rewardXp,
          rewardGeo: t.rewardGeo
        })),
        whatIfPrompts: baseConfig.whatIfPrompts,
        source: 'fallback'
      } satisfies LabAiConfigureResponse);
    }

    // -------------------------------------------------------------------------
    // ACTION 2: EXPLAIN INTERACTION (Deep Dive on Parameter Adjustment)
    // -------------------------------------------------------------------------
    if (action === 'explain_interaction') {
      const derived = derivedMetrics || (currentParams ? computeDerivedMetrics(modelType as any, currentParams) : {});
      const deterministicText = generateDynamicExplanation(modelType as any, currentParams || {}, previousParams || null, derived);

      if (!isAiAvailable) {
        return NextResponse.json({
          success: true,
          explanation: deterministicText,
          physicalReason: 'Governed by direct physical proportionality and governing differential equations.',
          realWorldAnalogy: 'Like pushing an object on ice versus pushing it on rough asphalt: applied forces dictate the instantaneous rate of acceleration.',
          source: 'fallback'
        } satisfies LabAiExplainResponse);
      }

      const prompt = `You are an intuitive Class 12 Physics teacher.
A student is adjusting parameters in a "${modelType}" practical simulation.

SUBTOPIC: "${subtopicName}"
CURRENT PARAMETERS: ${JSON.stringify(currentParams)}
PREVIOUS PARAMETERS: ${JSON.stringify(previousParams)}
DERIVED PHYSICAL METRICS: ${JSON.stringify(derived)}
STUDENT QUESTION/FOCUS: "${studentPrompt || 'Explain why the values changed and the underlying physical mechanism.'}"

TASK:
1. Explain clearly in 2 concise paragraphs what physically occurred when these values changed.
2. Formulate the exact physical law or mathematical proportionality that dictates this behavior (e.g. Newton's 2nd Law, Conservation of Energy, Inverse-Square law).
3. Provide an intuitive, memorable real-world analogy from daily life or sports.

Return ONLY valid JSON with this exact schema:
{
  "explanation": "Clear explanation of what happened...",
  "physicalReason": "The governing physical rule or equation in plain words...",
  "realWorldAnalogy": "Vivid everyday analogy..."
}`;

      try {
        const ai = new GoogleGenAI({ apiKey });
        const modelCandidates = Array.from(new Set([PRIMARY_MODEL, ...FALLBACK_MODELS]));
        let rawText: string | undefined;

        for (const model of modelCandidates) {
          try {
            const res = await ai.models.generateContent({
              model,
              contents: prompt,
              config: { responseMimeType: 'application/json' }
            });
            if (res.text) {
              rawText = res.text;
              break;
            }
          } catch (err) {
            console.warn(`[Lab AI] Model ${model} failed for explain_interaction:`, err);
          }
        }

        if (rawText) {
          const parsed = JSON.parse(extractJsonString(rawText));
          return NextResponse.json({
            success: true,
            explanation: parsed.explanation || deterministicText,
            physicalReason: parsed.physicalReason || 'Governed by fundamental conservation and dynamic laws.',
            realWorldAnalogy: parsed.realWorldAnalogy || 'Real-world physical analogy.',
            source: 'ai'
          } satisfies LabAiExplainResponse);
        }
      } catch (err) {
        console.warn('[Lab AI] Gemini explain_interaction error, falling back:', err);
      }

      return NextResponse.json({
        success: true,
        explanation: deterministicText,
        physicalReason: 'Governed by direct physical proportionality and governing differential equations.',
        realWorldAnalogy: 'Like changing the gear or throttle on a vehicle: changing input forces shifts output velocity and kinetic energy.',
        source: 'fallback'
      } satisfies LabAiExplainResponse);
    }

    // -------------------------------------------------------------------------
    // ACTION 3: GENERATE CHALLENGE
    // -------------------------------------------------------------------------
    if (action === 'generate_challenge') {
      const fallbackChallenge = {
        id: `custom-t-${Date.now()}`,
        title: 'Precision Physical Tuning',
        instruction: 'Adjust the sliders to achieve target equilibrium and stable trajectory.',
        hint: 'Use the governing formulas shown above to compute the required parameter values.',
        targetMetric: 'acceleration',
        targetValue: 4.0,
        tolerance: 0.3,
        rewardXp: 35,
        rewardGeo: 20
      };

      if (!isAiAvailable) {
        return NextResponse.json({
          success: true,
          challenge: fallbackChallenge,
          source: 'fallback'
        } satisfies LabAiChallengeResponse);
      }

      const prompt = `You are a physics gamification engineer.
Create a single novel, balanced practical experiment mission for a Class 12 student in a "${modelType}" simulation.

SUBTOPIC: "${subtopicName}"
CURRENT PARAMETERS: ${JSON.stringify(currentParams)}

TASK:
Return ONLY valid JSON with this exact schema:
{
  "id": "ai-challenge-${Date.now()}",
  "title": "Short Catchy Challenge Title",
  "instruction": "Clear goal describing the target metric to achieve...",
  "hint": "Helpful physics hint referencing the relevant equation...",
  "targetMetric": "acceleration",
  "targetValue": 5.0,
  "tolerance": 0.25,
  "rewardXp": 35,
  "rewardGeo": 20
}`;

      try {
        const ai = new GoogleGenAI({ apiKey });
        const res = await ai.models.generateContent({
          model: PRIMARY_MODEL,
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });
        if (res.text) {
          const parsed = JSON.parse(extractJsonString(res.text));
          return NextResponse.json({
            success: true,
            challenge: {
              id: parsed.id || `ai-challenge-${Date.now()}`,
              title: parsed.title || 'Dynamic Experiment Target',
              instruction: parsed.instruction || 'Adjust parameters to hit the target value.',
              hint: parsed.hint || 'Check the formula display for clues.',
              targetMetric: parsed.targetMetric || 'acceleration',
              targetValue: Number(parsed.targetValue) || 5.0,
              tolerance: Number(parsed.tolerance) || 0.3,
              rewardXp: Number(parsed.rewardXp) || 35,
              rewardGeo: Number(parsed.rewardGeo) || 20
            },
            source: 'ai'
          } satisfies LabAiChallengeResponse);
        }
      } catch (err) {
        console.warn('[Lab AI] Gemini generate_challenge error, falling back:', err);
      }

      return NextResponse.json({
        success: true,
        challenge: fallbackChallenge,
        source: 'fallback'
      } satisfies LabAiChallengeResponse);
    }

    return NextResponse.json({ success: false, error: `Invalid action: ${action}` }, { status: 400 });
  } catch (err: unknown) {
    console.error('[Lab AI Route Error]:', err);
    return NextResponse.json({ success: false, error: 'Internal server error in Lab AI API' }, { status: 500 });
  }
}
