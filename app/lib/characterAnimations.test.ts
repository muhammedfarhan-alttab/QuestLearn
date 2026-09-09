import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  CHARACTER_ANIMATIONS, 
  resolveAnimationState, 
  getHeroMotionAnimate, 
  getHeroMotionTransition,
  getHeroUniqueMotion,
  getHeroUniqueTransition
} from './characterAnimations.ts';

test('Character Animation Engine - All 6 Core States Are Defined', () => {
  const coreStates = ['idle', 'celebration', 'hurt', 'attack', 'dance', 'knockout'];
  
  for (const state of coreStates) {
    assert.ok(CHARACTER_ANIMATIONS[state], `State ${state} should be defined in CHARACTER_ANIMATIONS`);
    assert.ok(CHARACTER_ANIMATIONS[state].label, `State ${state} should have a label`);
    assert.ok(CHARACTER_ANIMATIONS[state].description, `State ${state} should have a description`);
    assert.ok(CHARACTER_ANIMATIONS[state].cssClass, `State ${state} should have a CSS class`);
  }
});

test('Character Animation Engine - Idle state has breathing loop', () => {
  const idleMeta = CHARACTER_ANIMATIONS['idle'];
  assert.equal(idleMeta.isLoop, true);
  assert.equal(idleMeta.category, 'idle');
  
  const animate = getHeroMotionAnimate('idle', false);
  assert.ok(Array.isArray(animate.scaleY), 'Idle should scaleY array for chest breathing');
  assert.ok(Array.isArray(animate.y), 'Idle should y array for vertical breathing float');

  const transition = getHeroMotionTransition('idle', false);
  assert.equal(transition.repeat, Infinity, 'Idle transition must repeat infinitely');
});

test('Character Animation Engine - Correct Answer triggers Celebration animation', () => {
  const resolved = resolveAnimationState('celebration', false);
  assert.equal(resolved, 'celebration');

  const animate = getHeroMotionAnimate('celebration', false);
  assert.ok(Array.isArray(animate.y), 'Celebration must animate vertical jump');
  assert.ok(Array.isArray(animate.scale), 'Celebration must scale joyfully');
  assert.ok(Array.isArray(animate.rotate), 'Celebration must rotate playfully');
});

test('Character Animation Engine - Wrong Answer or isHurt triggers Hurt stagger', () => {
  // When isHurt is true, it overrides even other states
  const resolvedHurtFlag = resolveAnimationState('idle', true);
  assert.equal(resolvedHurtFlag, 'hurt');

  const resolvedHurtState = resolveAnimationState('hurt', false);
  assert.equal(resolvedHurtState, 'hurt');

  const animate = getHeroMotionAnimate('hurt', false);
  assert.ok(Array.isArray(animate.x), 'Hurt must shake along x axis');
  assert.ok(Array.isArray(animate.filter), 'Hurt must have filter flash (red pain flash)');
  assert.ok(Array.isArray(animate.opacity), 'Hurt must flicker opacity');
});

test('Character Animation Engine - Boss Battle triggers Attack lunge', () => {
  const resolved = resolveAnimationState('attack', false);
  assert.equal(resolved, 'attack');

  const animate = getHeroMotionAnimate('attack', false);
  assert.ok(Array.isArray(animate.x), 'Attack must lunge forward along x axis');
  assert.ok(Array.isArray(animate.rotate), 'Attack must rotate sword slash');
  assert.ok(Array.isArray(animate.scale), 'Attack must scale forward');
});

test('Character Animation Engine - Victory triggers Dance animation loop', () => {
  const resolved = resolveAnimationState('dance', false);
  assert.equal(resolved, 'dance');

  const danceMeta = CHARACTER_ANIMATIONS['dance'];
  assert.equal(danceMeta.isLoop, true);
  assert.equal(danceMeta.category, 'victory');

  const animate = getHeroMotionAnimate('dance', false);
  assert.ok(Array.isArray(animate.y), 'Dance must bounce vertically');
  assert.ok(Array.isArray(animate.x), 'Dance must sway horizontally');
  assert.ok(Array.isArray(animate.rotate), 'Dance must rotate rhythmically');

  const transition = getHeroMotionTransition('dance', false);
  assert.equal(transition.repeat, Infinity, 'Dance transition must repeat infinitely');
});

test('Character Animation Engine - Defeat triggers Knockout collapse', () => {
  const resolved = resolveAnimationState('knockout', false);
  assert.equal(resolved, 'knockout');

  const animate = getHeroMotionAnimate('knockout', false);
  assert.ok(Array.isArray(animate.rotate), 'Knockout must rotate backwards to ground');
  assert.ok(Array.isArray(animate.y), 'Knockout must fall down along y axis');
  // Check that final rotation is knocked out (-90 degrees)
  const lastRotation = animate.rotate[animate.rotate.length - 1];
  assert.equal(lastRotation, -90, 'Knockout final rotation must be -90 degrees');
});

test('Character Animation Engine - Unique Character Motion Profiles', () => {
  // Ichigo attack should have supersonic dash
  const ichigoAttack = getHeroUniqueMotion('ichigo', 'attack', false);
  assert.ok(Array.isArray(ichigoAttack.x));
  assert.ok((ichigoAttack.x as number[])[2] >= 200, 'Ichigo should dash forward 200+ px');

  // Kenpachi attack should have downward cleave
  const kenpachiAttack = getHeroUniqueMotion('kenpachi', 'attack', false);
  assert.ok(Array.isArray(kenpachiAttack.y));
  assert.ok((kenpachiAttack.y as number[])[2] > 40, 'Kenpachi should cleave downward with 40+ px');

  // Rukia attack should have 360 degree pirouette spin
  const rukiaAttack = getHeroUniqueMotion('rukia', 'attack', false);
  assert.ok(Array.isArray(rukiaAttack.rotate));
  assert.ok((rukiaAttack.rotate as number[]).includes(360), 'Rukia must pirouette 360 degrees');

  // Aizen attack should have dimensional scale warp
  const aizenAttack = getHeroUniqueMotion('aizen', 'attack', false);
  assert.ok(Array.isArray(aizenAttack.scale));

  // Yamamoto attack should have 15,000,000 degree solar filter
  const yamaAttack = getHeroUniqueMotion('yamamoto', 'attack', false);
  assert.ok(Array.isArray(yamaAttack.filter));

  // Ulquiorra attack should have javelin strike
  const ulqAttack = getHeroUniqueMotion('ulquiorra_hero', 'attack', false);
  assert.ok(Array.isArray(ulqAttack.x));
});

test('Character Animation Engine - Unique Transition Durations', () => {
  const ichigoTransition = getHeroUniqueTransition('ichigo', 'attack', false);
  assert.equal(ichigoTransition.duration, 0.42, 'Ichigo supersonic attack duration should be fast (0.42s)');

  const kenpachiTransition = getHeroUniqueTransition('kenpachi', 'attack', false);
  assert.equal(kenpachiTransition.duration, 0.62, 'Kenpachi heavy cleave duration should be deliberate (0.62s)');
});

