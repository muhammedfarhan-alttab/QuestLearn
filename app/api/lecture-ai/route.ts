import { NextResponse } from 'next/server';
import { 
  LectureAiRequest, 
  ExplainSimplerResponse, 
  AskDoubtResponse, 
  ChapterSummaryResponse, 
  KnowledgeCheckResponse 
} from './types';

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

// ---------------------------------------------------------------------------
// OFFLINE FALLBACK GENERATORS (for when GEMINI_API_KEY is not set or times out)
// ---------------------------------------------------------------------------

function generateFallbackSimpler(
  chapterTitle: string,
  sectionTitle: string,
  content: string,
  difficulty: string = 'intermediate'
): ExplainSimplerResponse {
  if (difficulty === 'beginner') {
    return {
      success: true,
      simplifiedExplanation: `Think of ${sectionTitle || chapterTitle} like everyday motion. At its core, the main idea is that different physical directions don't interfere with each other unless a direct force acts along that direction. When you toss a phone gently onto a bed, it continues moving forward at the exact same pace while gravity pulls it smoothly downward into the mattress.`,
      everydayAnalogy: 'Imagine throwing a ball while sitting on a steadily moving train: to you, the ball goes straight up and down, but to someone outside on the platform, it traces a perfect parabola.',
      keyRule: 'Forces only accelerate objects along their specific directional axis; horizontal and vertical behaviors are completely decoupled.',
      source: 'fallback'
    };
  }

  if (difficulty === 'advanced') {
    return {
      success: true,
      simplifiedExplanation: `From an advanced perspective in ${chapterTitle}, ${sectionTitle} represents a second-order vector differential system d²r/dt² = g. Because the curl of uniform gravitational force is zero (∇ × g = 0), the system is strictly conservative, admitting an exact scalar potential energy function U(r) = -m(g · r).`,
      everydayAnalogy: 'Like decomposing a complex 2D soundwave into independent Fourier orthogonal frequency channels that never cross-talk or interfere with each other.',
      keyRule: 'Orthogonality of Cartesian coordinates guarantees decoupling of momentum equations in uniform fields.',
      source: 'fallback'
    };
  }

  // Intermediate (Default Class 12 standard)
  return {
    success: true,
    simplifiedExplanation: `In Class 12 syllabus, ${sectionTitle || chapterTitle} boils down to this: we separate 2D motion into two simple 1D problems that run simultaneously. Along the horizontal axis, acceleration is 0, so speed is constant (v = v₀ cos θ). Along the vertical axis, gravity causes constant deceleration (a = -g), creating the classic symmetric trajectory.`,
    everydayAnalogy: 'Kicking a soccer ball across a field: the horizontal kick distance is just speed × time, while how long it stays in the air is decided entirely by how hard you kicked it upwards.',
    keyRule: 'At the apex, vertical velocity is momentarily zero (v_y = 0), but downward acceleration remains g = 9.8 m/s².',
    source: 'fallback'
  };
}

function generateFallbackDoubt(
  chapterTitle: string,
  studentDoubt: string,
  difficulty: string = 'intermediate'
): AskDoubtResponse {
  const lower = studentDoubt.toLowerCase();

  if (lower.includes('formula') || lower.includes('equation')) {
    return {
      success: true,
      answer: `Great question! In ${chapterTitle}, formulas are derived directly from the fundamental laws of motion. When you need time of flight, set vertical position y = 0 to get T = 2v₀ sin(θ)/g. When you need peak altitude, set instantaneous vertical velocity v_y = 0 using v_y² = v_{0y}² - 2gH to get H = v₀² sin²(θ) / (2g).`,
      example: 'Example: If launch speed v₀ = 20 m/s at 30° (g = 10 m/s²), initial vertical velocity is 20 × 0.5 = 10 m/s. Time to reach the peak is t = 10 / 10 = 1.0 s, so total flight time is 2.0 s.',
      examWarning: 'Watch out: These standard formula shortcuts only work when launch elevation and landing elevation are identical!',
      source: 'fallback'
    };
  }

  if (lower.includes('example') || lower.includes('real life')) {
    return {
      success: true,
      answer: `In the real world, ${chapterTitle} is the foundation of artillery, basketball shots, and water fountains. When a basketball player shoots a three-pointer, they must release the ball with enough vertical speed to stay aloft for 1.2 seconds, during which its constant horizontal speed carries it 7.2 meters into the hoop.`,
      example: 'Real life example: Water spraying from an angled garden hose forms a continuous visible parabola because every droplet follows the exact same projectile arc.',
      source: 'fallback'
    };
  }

  return {
    success: true,
    answer: `In ${chapterTitle}, this happens because nature obeys conservation laws. Any net force causes a change in momentum (F = dp/dt). If no force acts along an axis, the velocity along that axis must remain unchanged by Newton’s First Law.`,
    example: 'For instance, horizontal projectile velocity does not change because gravity pulls strictly perpendicular to the ground.',
    examWarning: 'Key exam reminder: Always draw a clear free-body diagram before writing equations of motion.',
    source: 'fallback'
  };
}

function generateFallbackSummary(
  chapterTitle: string,
  conceptFocus: string
): ChapterSummaryResponse {
  return {
    success: true,
    fiveKeyTakeaways: [
      `Orthogonal motion components in ${chapterTitle} operate independently without cross-axis interference.`,
      'Gravitational acceleration g = 9.8 m/s² acts downwards continuously throughout the entire flight.',
      'At the highest point of flight, instantaneous vertical velocity v_y = 0, but horizontal velocity v_x remains constant.',
      'Range on level ground is maximized at an elevation angle of 45° and is identical for complementary angles.',
      'Total mechanical energy is conserved when atmospheric drag and non-conservative dissipation are negligible.'
    ],
    importantFormulas: [
      { name: 'Time of Flight', math: 'T = \\frac{2v_0 \\sin(\\theta)}{g}', note: 'Symmetric flat-ground flight time.' },
      { name: 'Maximum Elevation', math: 'H = \\frac{v_0^2 \\sin^2(\\theta)}{2g}', note: 'Vertical apex above launch point.' },
      { name: 'Horizontal Range', math: 'R = \\frac{v_0^2 \\sin(2\\theta)}{g}', note: 'Maximized at θ = 45°.' },
      { name: 'Trajectory Relation', math: 'y(x) = x\\tan(\\theta) - \\frac{gx^2}{2v_0^2\\cos^2(\\theta)}', note: 'Eliminates time t to give parabolic curve.' }
    ],
    commonMistakes: [
      {
        mistake: 'Assuming acceleration drops to zero at the peak because velocity is zero.',
        correction: 'Acceleration is strictly g = 9.8 m/s² downwards at every point.',
        why: 'Gravity never turns off; only vertical velocity changes sign from positive to negative.'
      },
      {
        mistake: 'Using the level ground range formula for projectiles launched from a cliff.',
        correction: 'Solve the vertical quadratic y(t) = h + v_{0y}t - ½gt² = 0 for landing time first.',
        why: 'The standard formula assumes landing height equals launch height (y = 0).'
      }
    ],
    revisionChecklist: [
      { id: 'rev-c1', label: 'Vector Decomposition Mastery', details: 'Decompose initial velocity into horizontal (v₀ cos θ) and vertical (v₀ sin θ).' },
      { id: 'rev-c2', label: 'Apex Condition Understanding', details: 'Recognize that v_y = 0 at the peak, but a = -g and v_x is unchanged.' },
      { id: 'rev-c3', label: 'Formula Application Confidence', details: 'Know when to apply T, H, R vs full kinematic quadratics.' },
      { id: 'rev-c4', label: 'Energy Conservation Verification', details: 'Verify speed at any height using ½mv² + mgy = constant.' }
    ],
    source: 'fallback'
  };
}

// ---------------------------------------------------------------------------
// MAIN POST ROUTE
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LectureAiRequest;
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: 'Missing required action parameter.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    // 1. If API key is not present, use the instant, high-quality fallback generator
    if (!apiKey) {
      if (action === 'explain_simpler') {
        const fallback = generateFallbackSimpler(
          body.chapterTitle || 'Physics',
          body.sectionTitle || 'Core Concepts',
          body.content || '',
          body.difficulty || 'intermediate'
        );
        return NextResponse.json(fallback);
      }

      if (action === 'ask_doubt') {
        const fallback = generateFallbackDoubt(
          body.chapterTitle || 'Physics',
          body.studentDoubt || '',
          body.difficulty || 'intermediate'
        );
        return NextResponse.json(fallback);
      }

      if (action === 'summarize_chapter') {
        const fallback = generateFallbackSummary(
          body.chapterTitle || 'Physics',
          body.conceptFocus || 'Foundational Principles'
        );
        return NextResponse.json(fallback);
      }

      return NextResponse.json({ success: true, message: 'Default fallback response', source: 'fallback' });
    }

    // 2. Initialize Gemini AI Client
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    // -------------------------------------------------------------------------
    // ACTION: explain_simpler
    // -------------------------------------------------------------------------
    if (action === 'explain_simpler') {
      const difficulty = body.difficulty || 'intermediate';
      const prompt = `You are a world-class Class 12 physics & science tutor who explains complex academic concepts with extraordinary clarity, relatable analogies, and infectious enthusiasm.

COURSE: "${body.courseTitle || 'Physics'}"
CHAPTER: "${body.chapterTitle || 'Topic'}"
SECTION: "${body.sectionTitle || 'Section'}"
DIFFICULTY LEVEL: "${difficulty.toUpperCase()}"

ORIGINAL SECTION CONTENT:
"""${body.content}"""

TASK:
1. Explain this concept in simple, lucid language tailored for a Class 12 student at the ${difficulty} level.
   - For 'beginner': Use simple words, breaking everything down step-by-step with intuitive daily-life mechanics.
   - For 'intermediate': Standard CBSE/JEE Mains syllabus tone, linking intuition to governing equations.
   - For 'advanced': Rigorous depth, highlighting mathematical nuances, coordinate invariance, and edge cases.
2. Provide a vivid, real-world everyday analogy that makes the concept unforgettable.
3. Formulate one memorable, punchy "Key Golden Rule" the student should keep in mind for exams.

Return ONLY valid JSON with this exact schema:
{
  "simplifiedExplanation": "Clear, engaging breakdown in 2-3 short paragraphs...",
  "everydayAnalogy": "Vivid real-world analogy...",
  "keyRule": "Single-sentence golden rule for exams..."
}`;

      let rawText: string | undefined;
      const modelCandidates = Array.from(new Set([PRIMARY_MODEL, ...FALLBACK_MODELS]));

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
        } catch (e: unknown) {
          console.warn(`[Lecture AI] Model ${model} failed for explain_simpler:`, e);
        }
      }

      if (rawText) {
        try {
          const parsed = JSON.parse(extractJsonString(rawText));
          return NextResponse.json({
            success: true,
            simplifiedExplanation: parsed.simplifiedExplanation || 'Clear explanation provided.',
            everydayAnalogy: parsed.everydayAnalogy || 'Real-world analogy.',
            keyRule: parsed.keyRule || 'Remember core principles.',
            source: 'gemini'
          } satisfies ExplainSimplerResponse);
        } catch {
          // Fall through to fallback
        }
      }

      return NextResponse.json(generateFallbackSimpler(body.chapterTitle, body.sectionTitle, body.content, difficulty));
    }

    // -------------------------------------------------------------------------
    // ACTION: ask_doubt
    // -------------------------------------------------------------------------
    if (action === 'ask_doubt') {
      const difficulty = body.difficulty || 'intermediate';
      const prompt = `You are a friendly, deeply knowledgeable Class 12 academic tutor answering a student's live doubt during lecture notes study.

COURSE: "${body.courseTitle || 'Physics'}"
CHAPTER: "${body.chapterTitle || 'Chapter'}"
CONCEPT CONTEXT: "${body.conceptFocus || ''}"
DIFFICULTY: "${difficulty.toUpperCase()}"

STUDENT'S DOUBT:
"${body.studentDoubt}"

TASK:
1. Answer the doubt directly, clearly, and constructively, grounded strictly in the context of "${body.chapterTitle}".
2. Include a concrete, worked calculation or intuitive physical example demonstrating the answer.
3. If relevant, highlight a common exam trap or warning related to this doubt.

Return ONLY valid JSON with this exact schema:
{
  "answer": "Direct, empathetic, and academically clear answer in 2-3 short paragraphs...",
  "example": "Specific numerical or real-world example...",
  "examWarning": "High-frequency trap or key tip for exams..."
}`;

      let rawText: string | undefined;
      const modelCandidates = Array.from(new Set([PRIMARY_MODEL, ...FALLBACK_MODELS]));

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
        } catch (e: unknown) {
          console.warn(`[Lecture AI] Model ${model} failed for ask_doubt:`, e);
        }
      }

      if (rawText) {
        try {
          const parsed = JSON.parse(extractJsonString(rawText));
          return NextResponse.json({
            success: true,
            answer: parsed.answer,
            example: parsed.example,
            examWarning: parsed.examWarning,
            source: 'gemini'
          } satisfies AskDoubtResponse);
        } catch {
          // Fall through to fallback
        }
      }

      return NextResponse.json(generateFallbackDoubt(body.chapterTitle, body.studentDoubt, difficulty));
    }

    // -------------------------------------------------------------------------
    // ACTION: summarize_chapter
    // -------------------------------------------------------------------------
    if (action === 'summarize_chapter') {
      const prompt = `You are an expert curriculum designer creating a rapid revision sheet for Class 12 students.

COURSE: "${body.courseTitle || 'Physics'}"
CHAPTER: "${body.chapterTitle || 'Chapter'}"
CONCEPT FOCUS: "${body.conceptFocus || ''}"

TASK:
Generate a high-yield summary revision pack for this chapter:
1. Exactly 5 Key Takeaways (bullet points capturing the core conceptual pillars).
2. 3-4 Important Formulas with their physical name, LaTeX math, and a brief usage note.
3. 2-3 Common Mistakes / Traps students make on exams with the correction and why.
4. 4 Revision Checklist items that a student should mentally verify before an exam.

Return ONLY valid JSON with this exact schema:
{
  "fiveKeyTakeaways": [
    "Takeaway 1...",
    "Takeaway 2...",
    "Takeaway 3...",
    "Takeaway 4...",
    "Takeaway 5..."
  ],
  "importantFormulas": [
    { "name": "Formula Name", "math": "\\LaTeX string...", "note": "When to apply..." }
  ],
  "commonMistakes": [
    { "mistake": "Wrong assumption...", "correction": "Correct approach...", "why": "Physical reason..." }
  ],
  "revisionChecklist": [
    { "id": "rev-1", "label": "Short label", "details": "Specific verification task..." }
  ]
}`;

      let rawText: string | undefined;
      const modelCandidates = Array.from(new Set([PRIMARY_MODEL, ...FALLBACK_MODELS]));

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
        } catch (e: unknown) {
          console.warn(`[Lecture AI] Model ${model} failed for summarize_chapter:`, e);
        }
      }

      if (rawText) {
        try {
          const parsed = JSON.parse(extractJsonString(rawText));
          return NextResponse.json({
            success: true,
            fiveKeyTakeaways: Array.isArray(parsed.fiveKeyTakeaways) ? parsed.fiveKeyTakeaways : [],
            importantFormulas: Array.isArray(parsed.importantFormulas) ? parsed.importantFormulas : [],
            commonMistakes: Array.isArray(parsed.commonMistakes) ? parsed.commonMistakes : [],
            revisionChecklist: Array.isArray(parsed.revisionChecklist) ? parsed.revisionChecklist : [],
            source: 'gemini'
          } satisfies ChapterSummaryResponse);
        } catch {
          // Fall through to fallback
        }
      }

      return NextResponse.json(generateFallbackSummary(body.chapterTitle, body.conceptFocus));
    }

    return NextResponse.json({ error: `Unsupported action: ${action}` }, { status: 400 });
  } catch (err: unknown) {
    const errorMsg = String((err as { message?: string })?.message || 'Internal error');
    console.error('[Lecture AI] Uncaught route error:', errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
