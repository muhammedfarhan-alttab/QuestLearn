import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  COMPLETE_DIAGNOSTIC_BANK, 
  calculateSkillLevel, 
  buildDiagnosticSummary, 
  determineLearningPath,
  generatePersonalizedWorldStages
} from './diagnosticEngine.ts';
import type { DiagnosticAnswer, WorldStageGenerationInput } from './diagnosticEngine.ts';

test('Diagnostics Engine - Every Course Has Exactly 10 Questions (2 Easy, 4 Medium, 4 Hard)', () => {
  const courses = ['course-mechanics', 'course-electromagnetism', 'course-calculus', 'course-cs'];

  for (const courseId of courses) {
    const bank = COMPLETE_DIAGNOSTIC_BANK[courseId];
    assert.ok(bank, `Course ${courseId} must exist in diagnostic bank`);
    assert.equal(bank.length, 10, `Course ${courseId} must contain exactly 10 questions`);

    const easyCount = bank.filter(q => q.difficulty === 'easy').length;
    const mediumCount = bank.filter(q => q.difficulty === 'medium').length;
    const hardCount = bank.filter(q => q.difficulty === 'hard').length;

    assert.equal(easyCount, 2, `Course ${courseId} must have exactly 2 Easy questions`);
    assert.equal(mediumCount, 4, `Course ${courseId} must have exactly 4 Medium questions`);
    assert.equal(hardCount, 4, `Course ${courseId} must have exactly 4 Hard questions`);

    // Verify question validity
    for (const q of bank) {
      assert.ok(q.prompt && q.prompt.length > 5, 'Question prompt must be valid');
      assert.ok(Array.isArray(q.options) && q.options.length >= 4, 'Must have at least 4 options');
      assert.ok(q.correctIndex >= 0 && q.correctIndex < q.options.length, 'Correct index must be within range');
      assert.ok(q.explanation && q.explanation.length > 5, 'Explanation must exist');
    }
  }
});

test('Diagnostics Engine - Skill Level Calculation (0-3: Beginner, 4-7: Intermediate, 8-10: Advanced)', () => {
  // 0-3 Correct => Beginner
  assert.equal(calculateSkillLevel(0), 'Beginner');
  assert.equal(calculateSkillLevel(1), 'Beginner');
  assert.equal(calculateSkillLevel(2), 'Beginner');
  assert.equal(calculateSkillLevel(3), 'Beginner');

  // 4-7 Correct => Intermediate
  assert.equal(calculateSkillLevel(4), 'Intermediate');
  assert.equal(calculateSkillLevel(5), 'Intermediate');
  assert.equal(calculateSkillLevel(6), 'Intermediate');
  assert.equal(calculateSkillLevel(7), 'Intermediate');

  // 8-10 Correct => Advanced
  assert.equal(calculateSkillLevel(8), 'Advanced');
  assert.equal(calculateSkillLevel(9), 'Advanced');
  assert.equal(calculateSkillLevel(10), 'Advanced');
});

test('Diagnostics Engine - Build Diagnostic Summary with Strengths, Weaknesses, and Difficulty Breakdown', () => {
  const sampleAnswers: DiagnosticAnswer[] = [
    // 2 Easy: 2 correct
    {
      questionId: 'q-1',
      concept: 'Vector Kinematics',
      difficulty: 'easy',
      prompt: 'Q1',
      selectedOption: 'A',
      selectedIndex: 0,
      correctOption: 'A',
      correctIndex: 0,
      isCorrect: true,
      explanation: 'Good job'
    },
    {
      questionId: 'q-2',
      concept: 'Inertia & Newton 1',
      difficulty: 'easy',
      prompt: 'Q2',
      selectedOption: 'A',
      selectedIndex: 0,
      correctOption: 'A',
      correctIndex: 0,
      isCorrect: true,
      explanation: 'Good job'
    },
    // 4 Medium: 2 correct, 2 wrong
    {
      questionId: 'q-3',
      concept: 'Newton 2 F=ma',
      difficulty: 'medium',
      prompt: 'Q3',
      selectedOption: 'A',
      selectedIndex: 0,
      correctOption: 'A',
      correctIndex: 0,
      isCorrect: true,
      explanation: 'Good job'
    },
    {
      questionId: 'q-4',
      concept: 'Work Energy',
      difficulty: 'medium',
      prompt: 'Q4',
      selectedOption: 'A',
      selectedIndex: 0,
      correctOption: 'A',
      correctIndex: 0,
      isCorrect: true,
      explanation: 'Good job'
    },
    {
      questionId: 'q-5',
      concept: 'Inelastic Collisions',
      difficulty: 'medium',
      prompt: 'Q5',
      selectedOption: 'B',
      selectedIndex: 1,
      correctOption: 'A',
      correctIndex: 0,
      isCorrect: false,
      explanation: 'Explanation',
      misconception: 'Misconception'
    },
    {
      questionId: 'q-6',
      concept: 'Kinetic Friction',
      difficulty: 'medium',
      prompt: 'Q6',
      selectedOption: 'B',
      selectedIndex: 1,
      correctOption: 'A',
      correctIndex: 0,
      isCorrect: false,
      explanation: 'Explanation'
    },
    // 4 Hard: 2 correct, 2 wrong
    {
      questionId: 'q-7',
      concept: 'Rotational Inertia',
      difficulty: 'hard',
      prompt: 'Q7',
      selectedOption: 'A',
      selectedIndex: 0,
      correctOption: 'A',
      correctIndex: 0,
      isCorrect: true,
      explanation: 'Good job'
    },
    {
      questionId: 'q-8',
      concept: 'Angular Momentum',
      difficulty: 'hard',
      prompt: 'Q8',
      selectedOption: 'A',
      selectedIndex: 0,
      correctOption: 'A',
      correctIndex: 0,
      isCorrect: true,
      explanation: 'Good job'
    },
    {
      questionId: 'q-9',
      concept: 'Harmonic Motion',
      difficulty: 'hard',
      prompt: 'Q9',
      selectedOption: 'B',
      selectedIndex: 1,
      correctOption: 'A',
      correctIndex: 0,
      isCorrect: false,
      explanation: 'Explanation'
    },
    {
      questionId: 'q-10',
      concept: 'Terminal Drag',
      difficulty: 'hard',
      prompt: 'Q10',
      selectedOption: 'B',
      selectedIndex: 1,
      correctOption: 'A',
      correctIndex: 0,
      isCorrect: false,
      explanation: 'Explanation'
    }
  ];

  // Total: 6 correct out of 10 => Intermediate (60%)
  const summary = buildDiagnosticSummary('course-mechanics', 'Physics I', sampleAnswers);

  assert.equal(summary.totalQuestions, 10);
  assert.equal(summary.correctCount, 6);
  assert.equal(summary.scorePercentage, 60);
  assert.equal(summary.skillLevel, 'Intermediate');

  // Breakdown checks
  assert.equal(summary.difficultyStats.easy.total, 2);
  assert.equal(summary.difficultyStats.easy.correct, 2);
  assert.equal(summary.difficultyStats.easy.percentage, 100);

  assert.equal(summary.difficultyStats.medium.total, 4);
  assert.equal(summary.difficultyStats.medium.correct, 2);
  assert.equal(summary.difficultyStats.medium.percentage, 50);

  assert.equal(summary.difficultyStats.hard.total, 4);
  assert.equal(summary.difficultyStats.hard.correct, 2);
  assert.equal(summary.difficultyStats.hard.percentage, 50);

  // Strengths and weaknesses
  assert.ok(summary.strengths.includes('Vector Kinematics'));
  assert.ok(summary.strengths.includes('Rotational Inertia'));
  assert.ok(summary.weaknesses.includes('Inelastic Collisions'));
  assert.ok(summary.weaknesses.includes('Harmonic Motion'));

  // Learning path
  assert.ok(Array.isArray(summary.learningPath));
  assert.equal(summary.learningPath.length, 4);
});

test('Diagnostics Engine - Learning Path adapts by Skill Level', () => {
  const beginnerPath = determineLearningPath('Beginner', ['Momentum'], ['Vectors'], 'course-mechanics');
  assert.equal(beginnerPath[0].focusArea, 'Foundations');

  const intermediatePath = determineLearningPath('Intermediate', ['Drag'], ['Vectors', 'Energy'], 'course-mechanics');
  assert.equal(intermediatePath[0].focusArea, 'Remediation');

  const advancedPath = determineLearningPath('Advanced', [], ['Rotations', 'Oscillations'], 'course-mechanics');
  assert.equal(advancedPath[advancedPath.length - 1].difficulty, 'Apex');
});

test('Diagnostics Engine - Dynamic World Stage Generation for Beginner Tier (<40%)', () => {
  const stages = generatePersonalizedWorldStages({
    courseId: 'course-mechanics',
    skillLevel: 'Beginner',
    scorePercentage: 20,
    weaknesses: ['Newtonian Force & Reaction Pairs', 'Work-Energy Theorem'],
    strengths: ['Vector Kinematics'],
    diagnosedGaps: ['Aristotelian misconception on inertia']
  });

  assert.equal(stages.length, 5, 'Must generate exactly 5 stages');

  // Stage 1: Remediation priority targeting primary gap
  assert.equal(stages[0].stageNumber, 1);
  assert.equal(stages[0].status, 'remediation_priority');
  assert.equal(stages[0].tier, 'easy');
  assert.ok(stages[0].name.includes('AI Remediation'));
  assert.equal(stages[0].targetConcept, 'Aristotelian misconception on inertia');
  assert.ok(stages[0].aiGenerated);
  assert.ok(stages[0].aiRationale && stages[0].aiRationale.length > 10);

  // Stage 2: Interactive concept lab
  assert.equal(stages[1].stageNumber, 2);
  assert.equal(stages[1].status, 'locked');
  assert.equal(stages[1].tier, 'easy');
  assert.ok(stages[1].name.includes('Interactive Concept Lab'));

  // Stage 5: Accessible Gatekeeper Boss
  assert.equal(stages[4].stageNumber, 5);
  assert.ok(stages[4].isBoss);
  assert.equal(stages[4].tier, 'intermediate');
  assert.ok(stages[4].name.includes('Guardian Boss Trial'));
  assert.equal(stages[4].bossId, 'yamamoto_boss');
});

test('Diagnostics Engine - Dynamic World Stage Generation for Intermediate Tier (40-75%)', () => {
  const stages = generatePersonalizedWorldStages({
    courseId: 'course-calculus',
    skillLevel: 'Intermediate',
    scorePercentage: 60,
    weaknesses: ['Integration by Parts'],
    strengths: ['Power Rule', 'Chain Rule']
  });

  assert.equal(stages.length, 5);

  // Stage 1: Targeted remediation on specific weakness
  assert.equal(stages[0].stageNumber, 1);
  assert.equal(stages[0].status, 'remediation_priority');
  assert.ok(stages[0].name.includes('Targeted Remediation'));
  assert.ok(stages[0].name.includes('Integration by Parts'));
  assert.equal(stages[0].targetConcept, 'Integration by Parts');
  assert.equal(stages[0].tier, 'easy');

  // Stage 2: Expansion of strength
  assert.equal(stages[1].stageNumber, 2);
  assert.ok(stages[1].name.includes('Power Rule'));
  assert.equal(stages[1].tier, 'intermediate');

  // Stage 5: Climax Boss Exam
  assert.equal(stages[4].stageNumber, 5);
  assert.ok(stages[4].isBoss);
  assert.equal(stages[4].tier, 'hard');
  assert.ok(stages[4].name.includes('Climax Realm Boss Battle'));
  assert.equal(stages[4].bossId, 'aizen_boss');
});

test('Diagnostics Engine - Dynamic World Stage Generation for Advanced Tier (>75%)', () => {
  const stages = generatePersonalizedWorldStages({
    courseId: 'course-cs',
    skillLevel: 'Advanced',
    scorePercentage: 90,
    weaknesses: ['Floyd-Warshall All-Pairs Shortest Path'],
    strengths: ['Big-O Asymptotic Notation', 'Binary Search Trees', 'Lexical Closures']
  });

  assert.equal(stages.length, 5);

  // Stage 1: Accelerated Proving Ground (unlocked with high initial mastery)
  assert.equal(stages[0].stageNumber, 1);
  assert.equal(stages[0].status, 'unlocked');
  assert.equal(stages[0].masteryPct, 85);
  assert.ok(stages[0].name.includes('Accelerated Proving Ground'));
  assert.ok(stages[0].name.includes('Big-O Asymptotic Notation'));

  // Stage 2: Complex Systems
  assert.equal(stages[1].stageNumber, 2);
  assert.equal(stages[1].tier, 'hard');
  assert.ok(stages[1].name.includes('Complex Systems'));

  // Stage 3: Precision Proofs on residual gap
  assert.equal(stages[2].stageNumber, 3);
  assert.equal(stages[2].status, 'remediation_priority');
  assert.equal(stages[2].tier, 'hard');
  assert.ok(stages[2].name.includes('Precision Proofs'));
  assert.ok(stages[2].name.includes('Floyd-Warshall'));

  // Stage 5: Supreme Demigod Exam
  assert.equal(stages[4].stageNumber, 5);
  assert.ok(stages[4].isBoss);
  assert.equal(stages[4].tier, 'hard');
  assert.ok(stages[4].name.includes('Supreme Demigod Confrontation'));
  assert.equal(stages[4].bossId, 'aizen_boss');
});

test('Diagnostics Engine - All 4 Courses Produce Valid Customized Stages and Bosses', () => {
  const courseBossExpected: Record<string, string> = {
    'course-mechanics': 'yamamoto_boss',
    'course-calculus': 'aizen_boss',
    'course-electromagnetism': 'yhwach',
    'course-cs': 'aizen_boss'
  };

  for (const [courseId, expectedBoss] of Object.entries(courseBossExpected)) {
    const stages = generatePersonalizedWorldStages({
      courseId,
      skillLevel: 'Intermediate',
      scorePercentage: 50,
      weaknesses: ['Sample Weakness'],
      strengths: ['Sample Strength']
    });

    assert.equal(stages.length, 5, `${courseId} must produce 5 stages`);
    assert.equal(stages[4].bossId, expectedBoss, `${courseId} stage 5 must match expected boss`);
    assert.ok(stages.every(s => Boolean(s.name && s.conceptFocus && s.realmLocation && s.lore)), `${courseId} all stages have valid metadata`);
    assert.ok(stages.every(s => s.aiGenerated === true), 'All stages flagged as aiGenerated');
  }
});

