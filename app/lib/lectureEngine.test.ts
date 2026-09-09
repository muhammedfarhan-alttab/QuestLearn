import test from 'node:test';
import assert from 'node:assert';
import { 
  CHAPTER_LECTURE_CATALOG, 
  getChapterLectureData 
} from '../data/lectureNotesData.ts';
import { 
  calculateCompletionPercentage,
  createEmptyProgressState
} from './lectureStorage.ts';
import type { ChapterProgressState } from './lectureStorage.ts';

test('Lecture Notes Engine - Catalog Completeness Across All 4 Courses', () => {
  const courseIds = [
    'course-mechanics',
    'course-electromagnetism',
    'course-calculus',
    'course-cs'
  ];

  for (const courseId of courseIds) {
    const courseChapters = CHAPTER_LECTURE_CATALOG[courseId];
    assert.ok(courseChapters, `Course ${courseId} must exist in CHAPTER_LECTURE_CATALOG`);
    assert.ok(courseChapters[1], `Course ${courseId} stage 1 must exist`);

    const stage1 = courseChapters[1];
    assert.ok(stage1.chapterTitle.length > 0, `Stage 1 of ${courseId} must have chapterTitle`);
    assert.ok(stage1.theoryOverview.length > 0, `Stage 1 of ${courseId} must have theoryOverview`);
    assert.ok(stage1.highlights, `Stage 1 of ${courseId} must have highlights`);
    assert.ok(stage1.summary, `Stage 1 of ${courseId} must have summary`);
  }
});

test('Lecture Notes Engine - Concept Highlights Validation', () => {
  const mechanicsCh1 = getChapterLectureData('course-mechanics', 1);

  // Definitions
  assert.ok(mechanicsCh1.highlights.definitions.length >= 2, 'Must have at least 2 key definitions');
  const projDef = mechanicsCh1.highlights.definitions.find(d => d.term.toLowerCase().includes('projectile'));
  assert.ok(projDef, 'Must define Projectile Motion');
  assert.ok(projDef.definition.length > 20, 'Definition must be detailed');

  // Formulas
  assert.ok(mechanicsCh1.highlights.formulas.length >= 2, 'Must have at least 2 governing formulas');
  const tofFormula = mechanicsCh1.highlights.formulas.find(f => f.name.toLowerCase().includes('time of flight'));
  assert.ok(tofFormula, 'Must have Time of Flight formula');
  assert.ok(tofFormula.formula.includes('sin'), 'Formula math must include sin(theta)');

  // Key Points & Exam Tips
  assert.ok(mechanicsCh1.highlights.keyPoints.length >= 3, 'Must have at least 3 key points');
  assert.ok(mechanicsCh1.highlights.examTips.length >= 2, 'Must have at least 2 high-yield exam tips');
});

test('Lecture Notes Engine - Interactive Knowledge Checks Variety (MCQ, True/False, Fill in Blanks)', () => {
  const mechanicsCh1 = getChapterLectureData('course-mechanics', 1);
  const allChecks = mechanicsCh1.sections.flatMap(s => s.knowledgeChecks);

  assert.ok(allChecks.length >= 3, 'Stage 1 must have at least 3 knowledge checks');

  const hasMcq = allChecks.some(c => c.type === 'mcq');
  const hasTrueFalse = allChecks.some(c => c.type === 'true_false');
  const hasFillBlank = allChecks.some(c => c.type === 'fill_blank');

  assert.ok(hasMcq, 'Must contain MCQ questions');
  assert.ok(hasTrueFalse, 'Must contain True/False questions');
  assert.ok(hasFillBlank, 'Must contain Fill in the Blank questions');

  for (const check of allChecks) {
    assert.ok(check.prompt.length > 5, 'Question prompt must not be empty');
    assert.ok(check.explanation.length > 10, 'Question must have explanatory feedback');
    assert.ok(check.rewardXp > 0, 'Question must award XP');
    assert.ok(check.rewardGeo > 0, 'Question must award Geo');
  }
});

test('Lecture Notes Engine - Flashcard Deck Integrity', () => {
  const mechanicsCh1 = getChapterLectureData('course-mechanics', 1);
  assert.ok(mechanicsCh1.flashcards.length >= 6, 'Must contain at least 6 flashcards');

  for (const card of mechanicsCh1.flashcards) {
    assert.ok(card.id, 'Card must have an ID');
    assert.ok(card.front.length > 10, 'Card front question must be descriptive');
    assert.ok(card.back.length > 15, 'Card back explanation must be detailed');
    assert.ok(['formula', 'definition', 'derivation', 'exam_trick', 'concept'].includes(card.category), `Valid category: ${card.category}`);
  }
});

test('Lecture Notes Engine - Chapter Summary & Revision Checklist', () => {
  const mechanicsCh1 = getChapterLectureData('course-mechanics', 1);
  const summary = mechanicsCh1.summary;

  assert.strictEqual(summary.fiveKeyTakeaways.length, 5, 'Must have exactly 5 key takeaways');
  assert.ok(summary.importantFormulas.length >= 3, 'Must have at least 3 important formulas');
  assert.ok(summary.commonMistakes.length >= 2, 'Must highlight at least 2 common exam mistakes');
  assert.ok(summary.revisionChecklist.length >= 4, 'Must have at least 4 checklist items');

  for (const item of summary.revisionChecklist) {
    assert.ok(item.id, 'Checklist item must have ID');
    assert.ok(item.label.length > 3, 'Checklist item must have label');
  }
});

test('Lecture Notes Engine - Completion Percentage Calculation', () => {
  const emptyProgress: ChapterProgressState = createEmptyProgressState();
  const emptyMetrics = calculateCompletionPercentage(emptyProgress, 4, 6, 6);

  assert.strictEqual(emptyMetrics.readingPct, 0);
  assert.strictEqual(emptyMetrics.quizPct, 0);
  assert.strictEqual(emptyMetrics.flashcardPct, 0);
  assert.strictEqual(emptyMetrics.overallPct, 0);

  // Partially completed progress
  const halfProgress: ChapterProgressState = {
    ...emptyProgress,
    readSectionIds: ['s1', 's2'], // 2/4 = 50%
    correctQuizIds: ['q1', 'q2', 'q3'], // 3/6 = 50%
    masteredFlashcardIds: ['f1', 'f2', 'f3'] // 3/6 = 50%
  };

  const halfMetrics = calculateCompletionPercentage(halfProgress, 4, 6, 6);
  assert.strictEqual(halfMetrics.readingPct, 50);
  assert.strictEqual(halfMetrics.quizPct, 50);
  assert.strictEqual(halfMetrics.flashcardPct, 50);
  assert.strictEqual(halfMetrics.overallPct, 50);

  // Fully completed progress
  const fullProgress: ChapterProgressState = {
    ...emptyProgress,
    readSectionIds: ['s1', 's2', 's3', 's4'],
    correctQuizIds: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'],
    masteredFlashcardIds: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6']
  };

  const fullMetrics = calculateCompletionPercentage(fullProgress, 4, 6, 6);
  assert.strictEqual(fullMetrics.readingPct, 100);
  assert.strictEqual(fullMetrics.quizPct, 100);
  assert.strictEqual(fullMetrics.flashcardPct, 100);
  assert.strictEqual(fullMetrics.overallPct, 100);
});
