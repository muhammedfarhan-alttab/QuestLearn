import test from 'node:test';
import assert from 'node:assert';
import { COURSE_STAGE_QUESTIONS, getStageQuestions } from '../../data/courseQuestions.ts';
import { 
  prioritizeUnseenQuestions, 
  markQuestionSeen, 
  clearSeenQuestions, 
  getSeenQuestionIds 
} from './seenQuestions.ts';

test('Question Variety - Every Course and Stage Has A Minimum of 5 Questions', () => {
  const courses = ['course-mechanics', 'course-calculus', 'course-cs', 'course-electromagnetism'];

  for (const courseId of courses) {
    const courseBattery = COURSE_STAGE_QUESTIONS[courseId];
    assert.ok(courseBattery, `Course ${courseId} must exist in COURSE_STAGE_QUESTIONS`);

    for (let stageNum = 1; stageNum <= 5; stageNum++) {
      const questions = courseBattery[stageNum];
      assert.ok(
        Array.isArray(questions) && questions.length >= 5,
        `Course ${courseId} Stage ${stageNum} has ${questions?.length || 0} questions, but MUST have at least 5.`
      );

      // Verify each question has 4 options, valid answer index, and explanation
      const seenIds = new Set<string>();
      for (const q of questions) {
        assert.ok(q.id, 'Question must have a unique ID');
        assert.ok(!seenIds.has(q.id), `Duplicate question ID ${q.id} detected in stage ${stageNum}`);
        seenIds.add(q.id);

        assert.ok(Array.isArray(q.options) && q.options.length === 4, `Question ${q.id} must have 4 options`);
        assert.ok(typeof q.answer === 'number' && q.answer >= 0 && q.answer <= 3, `Question ${q.id} answer must be between 0 and 3`);
        assert.ok(q.question && q.question.trim().length > 10, `Question ${q.id} question text is invalid`);
        assert.ok(q.explanation && q.explanation.trim().length > 10, `Question ${q.id} explanation is invalid`);
      }
    }
  }
});

test('Question Variety - Kinematics -> Velocity -> Numerical has at least 5 distinct questions', () => {
  const mechanicsStage1 = getStageQuestions('course-mechanics', 1);

  // Filter for velocity / acceleration numerical questions in Kinematics
  const velocityNumericalQuestions = mechanicsStage1.filter(q => 
    q.questionType === 'numerical' && 
    (q.question.toLowerCase().includes('accelerat') || q.question.toLowerCase().includes('velocity') || q.question.toLowerCase().includes('speed'))
  );

  assert.ok(
    velocityNumericalQuestions.length >= 5,
    `Kinematics -> Velocity -> Numerical must have at least 5 questions. Found: ${velocityNumericalQuestions.length}`
  );

  // Verify questions are genuinely different in wording and scenarios
  const scenarios = velocityNumericalQuestions.map(q => q.question);
  const uniqueScenarios = new Set(scenarios);
  assert.strictEqual(
    uniqueScenarios.size, 
    velocityNumericalQuestions.length, 
    'All numerical questions must have unique problem formulations.'
  );

  // Check specific distinct contexts (car, bullet train, maglev, sports car, drone)
  const allTexts = scenarios.join(' ').toLowerCase();
  assert.ok(allTexts.includes('car'), 'Should include car acceleration context');
  assert.ok(allTexts.includes('bullet train') || allTexts.includes('train'), 'Should include train deceleration context');
  assert.ok(allTexts.includes('maglev'), 'Should include maglev acceleration context');
  assert.ok(allTexts.includes('drone'), 'Should include drone acceleration context');
});

test('Question Variety - prioritizeUnseenQuestions prefers unseen before reusing seen questions', () => {
  clearSeenQuestions();

  const mockQuestions = [
    { id: 'mock-q1', question: 'Question 1' },
    { id: 'mock-q2', question: 'Question 2' },
    { id: 'mock-q3', question: 'Question 3' },
    { id: 'mock-q4', question: 'Question 4' },
    { id: 'mock-q5', question: 'Question 5' }
  ];

  // Initially all are unseen
  const initialOrder = prioritizeUnseenQuestions(mockQuestions);
  assert.deepStrictEqual(initialOrder.map(q => q.id), ['mock-q1', 'mock-q2', 'mock-q3', 'mock-q4', 'mock-q5']);

  // User answers q1 and q2
  markQuestionSeen('mock-q1');
  markQuestionSeen('mock-q2');

  const seenIds = getSeenQuestionIds();
  assert.ok(seenIds.has('mock-q1'));
  assert.ok(seenIds.has('mock-q2'));
  assert.ok(!seenIds.has('mock-q3'));

  // Next round: unseen (q3, q4, q5) MUST appear before seen (q1, q2)
  const nextOrder = prioritizeUnseenQuestions(mockQuestions);
  assert.strictEqual(nextOrder[0].id, 'mock-q3');
  assert.strictEqual(nextOrder[1].id, 'mock-q4');
  assert.strictEqual(nextOrder[2].id, 'mock-q5');
  assert.strictEqual(nextOrder[3].id, 'mock-q1');
  assert.strictEqual(nextOrder[4].id, 'mock-q2');

  // Mark all remaining questions as seen
  markQuestionSeen('mock-q3');
  markQuestionSeen('mock-q4');
  markQuestionSeen('mock-q5');

  // Once all questions in the pool are seen, prioritizeUnseenQuestions gracefully resets the pool
  const resetOrder = prioritizeUnseenQuestions(mockQuestions);
  assert.strictEqual(resetOrder.length, 5);

  clearSeenQuestions();
});
