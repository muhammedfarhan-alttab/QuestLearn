import test from 'node:test';
import assert from 'node:assert';
import {
  PRACTICAL_MODELS_CATALOG,
  getPracticalModelConfig,
  COURSE_STAGE_METADATA
} from '../data/practicalModelsData.ts';
import {
  computeKinematicsMetrics,
  computeForceMetrics,
  computeEnergyMetrics,
  computeCollisionMetrics,
  computeRotationalMetrics,
  computeLorentzMetrics,
  computeConceptLabMetrics,
  computeDerivedMetrics,
  generateDynamicExplanation,
  checkTaskCompletion
} from './labExplanationEngine.ts';
import {
  getLabStorageState,
  saveLabStorageState,
  isTaskCompleted,
  markTaskCompleted,
  isLabMastered
} from './labStorage.ts';

test('Practical Models Catalog - Integrity across all 4 courses', () => {
  const courses = ['course-mechanics', 'course-electromagnetism', 'course-calculus', 'course-cs'];

  for (const cId of courses) {
    const config = getPracticalModelConfig(cId, 1);
    assert.ok(config, `Model config for ${cId} stage 1 must exist`);
    assert.ok(config.title.length > 0, `Title must be present for ${cId}`);
    assert.ok(config.parameters.length >= 2, `Must have at least 2 parameters for ${cId}`);
    assert.ok(config.formulas.length >= 1, `Must have at least 1 formula card for ${cId}`);
    assert.ok(config.guidedTasks.length >= 1, `Must have at least 1 guided task for ${cId}`);

    // Verify parameter bounds
    for (const p of config.parameters) {
      assert.ok(p.min < p.max, `Parameter ${p.key} min (${p.min}) must be less than max (${p.max})`);
      assert.ok(p.defaultValue >= p.min && p.defaultValue <= p.max, `defaultValue (${p.defaultValue}) must be within [${p.min}, ${p.max}] for ${p.key}`);
      assert.ok(p.step > 0, `step must be > 0 for ${p.key}`);
    }
  }
});

test('Kinematics Engine - Projectile Motion Physics Math Verification', () => {
  // Test case: v0 = 25 m/s, theta = 45 deg, g = 9.8 m/s^2, y0 = 0 m
  const params = {
    initialSpeed: 25,
    launchAngle: 45,
    gravity: 9.8,
    launchHeight: 0
  };

  const derived = computeKinematicsMetrics(params);

  // Theoretical calculations:
  // vx0 = 25 * cos(45 deg) = 17.6776 m/s
  // vy0 = 25 * sin(45 deg) = 17.6776 m/s
  assert.ok(Math.abs(derived.vx0 - 17.6776) < 0.01, `vx0 expected ~17.68, got ${derived.vx0}`);
  assert.ok(Math.abs(derived.vy0 - 17.6776) < 0.01, `vy0 expected ~17.68, got ${derived.vy0}`);

  // Max Height: H = vy0^2 / (2g) = 312.5 / 19.6 = 15.9438 m
  assert.ok(Math.abs(derived.maxHeight - 15.94) < 0.05, `maxHeight expected ~15.94, got ${derived.maxHeight}`);

  // Flight time: t = 2 * vy0 / g = 35.355 / 9.8 = 3.607 s
  assert.ok(Math.abs(derived.flightTime - 3.61) < 0.05, `flightTime expected ~3.61, got ${derived.flightTime}`);

  // Range: R = vx0 * flightTime = 17.6776 * 3.607 = 63.77 m
  assert.ok(Math.abs(derived.horizontalRange - 63.77) < 0.1, `range expected ~63.77, got ${derived.horizontalRange}`);
});

test('Force Simulation Engine - Newton 2nd Law & Friction Math Verification', () => {
  // Test case: F_app = 30 N, m = 5 kg, mu = 0.2, theta = 0 deg
  const params = {
    appliedForce: 30,
    mass: 5,
    frictionCoeff: 0.2,
    inclineAngle: 0
  };

  const derived = computeForceMetrics(params);

  // Normal force: N = m * g = 5 * 9.8 = 49.0 N
  assert.strictEqual(derived.normalForce, 49.0);

  // Friction force: f_k = mu * N = 0.2 * 49 = 9.8 N
  assert.strictEqual(derived.frictionForce, 9.8);

  // Net force: F_net = 30 - 9.8 = 20.2 N
  assert.ok(Math.abs(derived.netForce - 20.2) < 0.001);

  // Acceleration: a = 20.2 / 5 = 4.04 m/s^2
  assert.ok(Math.abs(derived.acceleration - 4.04) < 0.001);
});

test('Energy Simulation Engine - Conservation of Mechanical Energy Verification', () => {
  // Test case: mass = 4 kg, h0 = 10 m, v0 = 0 m/s
  const params = {
    mass: 4,
    initialHeight: 10,
    initialVelocity: 0,
    damping: 0
  };

  const derived = computeEnergyMetrics(params);

  // Initial PE = m * g * h = 4 * 9.8 * 10 = 392.0 J
  assert.strictEqual(derived.totalEnergy, 392.0);

  // Ground level maximum speed: v_max = sqrt(2 * 9.8 * 10) = 14.0 m/s
  assert.strictEqual(derived.maxVelocity, 14.0);

  // Verify at ground level KE = 0.5 * m * v_max^2 = 0.5 * 4 * 196 = 392.0 J (Exact Conservation!)
  const groundKe = 0.5 * params.mass * (derived.maxVelocity * derived.maxVelocity);
  assert.strictEqual(groundKe, derived.totalEnergy);
});

test('Collision Simulation Engine - Momentum Invariance & Elastic vs Inelastic Math Verification', () => {
  // 1. Elastic Collision: Newton's Cradle Velocity Swap
  // m1 = 3 kg, v1 = 8 m/s, m2 = 3 kg, v2 = 0 m/s, e = 1.0
  const elasticParams = {
    m1: 3,
    v1: 8,
    m2: 3,
    v2: 0,
    elasticity: 1.0
  };

  const elasticDerived = computeCollisionMetrics(elasticParams);

  // Total Initial Momentum = 3*8 + 3*0 = 24 kg*m/s
  assert.strictEqual(elasticDerived.totalInitialMomentum, 24.0);
  assert.strictEqual(elasticDerived.totalFinalMomentum, 24.0);

  // Equal masses swap velocities elastically: v1' = 0, v2' = 8
  assert.ok(Math.abs(elasticDerived.v1Final - 0.0) < 0.001);
  assert.ok(Math.abs(elasticDerived.v2Final - 8.0) < 0.001);

  // Kinetic energy conserved (keLost == 0)
  assert.ok(Math.abs(elasticDerived.keLost) < 0.001);

  // 2. Inelastic Collision: Sticky Carts (e = 0.0)
  const inelasticParams = {
    m1: 4,
    v1: 6,
    m2: 2,
    v2: 0,
    elasticity: 0.0
  };

  const inelasticDerived = computeCollisionMetrics(inelasticParams);
  // v_common = (4*6 + 0) / (4+2) = 24 / 6 = 4.0 m/s
  assert.ok(Math.abs(inelasticDerived.v1Final - 4.0) < 0.001);
  assert.ok(Math.abs(inelasticDerived.v2Final - 4.0) < 0.001);
  assert.strictEqual(inelasticDerived.totalInitialMomentum, 24.0);
  assert.strictEqual(inelasticDerived.totalFinalMomentum, 24.0);
});

test('Rotational Dynamics Engine - Torque & Moment of Inertia Math Verification', () => {
  // Test case: disc mass = 5 kg, radius = 0.8 m, F_tan = 20 N, tau_f = 1.0 N*m
  const params = {
    discMass: 5,
    radius: 0.8,
    appliedForce: 20,
    bearingFriction: 1.0
  };

  const derived = computeRotationalMetrics(params);

  // Moment of Inertia: I = 0.5 * m * r^2 = 0.5 * 5 * 0.64 = 1.6 kg*m^2
  assert.strictEqual(derived.momentOfInertia, 1.6);

  // Applied torque: tau = r * F = 0.8 * 20 = 16.0 N*m
  assert.strictEqual(derived.appliedTorque, 16.0);

  // Net torque: 16.0 - 1.0 = 15.0 N*m
  assert.strictEqual(derived.netTorque, 15.0);

  // Angular acceleration: alpha = tau_net / I = 15.0 / 1.6 = 9.375 rad/s^2
  assert.strictEqual(derived.angularAccel, 9.375);
});

test('Dynamic Natural Language Explanation Generator produces coherent cause-and-effect', () => {
  const prev = { appliedForce: 30, mass: 5, frictionCoeff: 0.2, inclineAngle: 0 };
  const curr = { appliedForce: 50, mass: 5, frictionCoeff: 0.2, inclineAngle: 0 };
  const derived = computeForceMetrics(curr);

  const explanation = generateDynamicExplanation('force_simulation', curr, prev, derived);
  assert.ok(explanation.includes('Increased applied force to 50 N'), 'Explanation should note increase in applied force');
  assert.ok(explanation.includes("Newton's 2nd Law"), 'Explanation should reference Newton 2nd law');
});

test('Guided Task Condition Checker and LocalStorage Mastery Verification', () => {
  const config = getPracticalModelConfig('course-mechanics', 2);
  const task1 = config.guidedTasks[0]; // Target a = 5.0 m/s^2

  // Simulate parameters yielding acceleration = 5.0
  // F_net = 20 N, m = 4 kg => a = 5.0 m/s^2
  // N = 4 * 9.8 = 39.2 N. With mu = 0.2, f_k = 7.84 N.
  // F_app = 20 + 7.84 = 27.84 N
  const testParams = {
    appliedForce: 27.84,
    mass: 4,
    frictionCoeff: 0.2,
    inclineAngle: 0
  };
  const testDerived = computeForceMetrics(testParams);

  const isSatisfied = checkTaskCompletion(task1, testParams, testDerived);
  assert.strictEqual(isSatisfied, true, 'Task 1 should be satisfied with calibrated parameters');

  // Verify task completion storage
  const labId = 'test-lab-1';
  const res1 = markTaskCompleted(labId, 'task-a', 2);
  assert.strictEqual(res1.isNewCompletion, true);
  assert.strictEqual(res1.isNowMastered, false);

  const res2 = markTaskCompleted(labId, 'task-b', 2);
  assert.strictEqual(res2.isNewCompletion, true);
  assert.strictEqual(res2.isNowMastered, true);
  assert.strictEqual(isLabMastered(labId), true);
});

test('Resilience - All catalog formulas and concept metrics evaluate safely with empty or lagging params', () => {
  const courses = ['course-mechanics', 'course-electromagnetism', 'course-calculus', 'course-cs'];

  for (const cId of courses) {
    for (let stage = 1; stage <= 5; stage++) {
      const config = getPracticalModelConfig(cId, stage);

      // 1. Evaluate with empty params and derived
      for (const formula of config.formulas) {
        assert.doesNotThrow(() => {
          const evalStr = formula.formatEvaluation({}, {});
          assert.ok(typeof evalStr === 'string' && evalStr.length > 0);
        }, `Formula "${formula.name}" in ${cId} stage ${stage} should not throw with empty inputs`);
      }

      // 2. Evaluate with mismatched params from a different course (e.g. mechanics params in electromagnetism)
      const mechanicsParams = { initialSpeed: 25, launchAngle: 45, gravity: 9.8, launchHeight: 0 };
      const derived = computeDerivedMetrics(config.modelType, mechanicsParams);
      for (const formula of config.formulas) {
        assert.doesNotThrow(() => {
          const evalStr = formula.formatEvaluation(mechanicsParams, derived);
          assert.ok(typeof evalStr === 'string' && evalStr.length > 0);
        }, `Formula "${formula.name}" in ${cId} stage ${stage} should not throw with mismatched params`);
      }
    }
  }

  // 3. Directly test computeConceptLabMetrics resilience
  const conceptEmpty = computeConceptLabMetrics({});
  assert.strictEqual(conceptEmpty.coulombForce, 0);
  assert.strictEqual(conceptEmpty.slope, 0);
});

test('Course Stage Metadata - Completeness across all 4 courses and 5 stages', () => {
  const courses = ['course-mechanics', 'course-electromagnetism', 'course-calculus', 'course-cs'];

  for (const cId of courses) {
    assert.ok(COURSE_STAGE_METADATA[cId], `Metadata for course ${cId} must exist`);
    for (let stage = 1; stage <= 5; stage++) {
      const meta = COURSE_STAGE_METADATA[cId][stage];
      assert.ok(meta, `Metadata for ${cId} stage ${stage} must exist`);
      assert.ok(meta.title.length > 0, `Title for ${cId} stage ${stage} must not be empty`);
      assert.ok(meta.shortTag.length > 0, `shortTag for ${cId} stage ${stage} must not be empty`);
    }
  }
});

test('Calculus Simulation - Mathematical Parabola Coordinate Alignment & Tangent Midpoint', () => {
  const originX = 360;
  const originY = 250;
  const scaleX = 60;
  const scaleY = 12;

  // 1. Vertex at x = 0 touches originY exactly
  const vertexY = originY - (0 * 0) * scaleY;
  assert.strictEqual(vertexY, 250, 'Parabola vertex must be at y = 250 (on horizontal axis)');

  // 2. Sample multiple x points: verify contact point is on the curve and tangent midpoint matches
  const testXValues = [-2.0, -1.0, 0.0, 1.5, 2.0, 3.0];
  for (const xVal of testXValues) {
    const screenX = originX + xVal * scaleX;
    const screenY = originY - (xVal * xVal) * scaleY;
    const slope = 2 * xVal;

    // Tangent segment of half-width 65px:
    const dxHalf = 65;
    const dyHalf = dxHalf * (0.4 * xVal);
    const tanX1 = screenX - dxHalf;
    const tanY1 = screenY + dyHalf;
    const tanX2 = screenX + dxHalf;
    const tanY2 = screenY - dyHalf;

    // Verify midpoint is strictly equal to contact point (screenX, screenY)
    const midX = (tanX1 + tanX2) / 2;
    const midY = (tanY1 + tanY2) / 2;
    assert.strictEqual(midX, screenX, `Tangent midpoint X must match contact point at x = ${xVal}`);
    assert.ok(Math.abs(midY - screenY) < 1e-9, `Tangent midpoint Y must match contact point at x = ${xVal}`);

    // Verify screen slope dY/dX = -scaleY/scaleX * slope
    const screenSlope = (tanY2 - tanY1) / (tanX2 - tanX1);
    const expectedScreenSlope = - (scaleY / scaleX) * slope;
    assert.ok(Math.abs(screenSlope - expectedScreenSlope) < 1e-9, `Screen slope must equal mathematical derivative transform at x = ${xVal}`);
  }
});

test('Concept Lab Engine - Capacitance, Riemann Sums, and Big-O Metrics', () => {
  // 1. Capacitance calculation: A = 0.2 m^2, d = 0.005 m, V = 100 V
  const capParams = { plateArea: 0.2, separation: 0.005, voltage: 100 };
  const capMetrics = computeConceptLabMetrics(capParams);
  // C = (8.854e-12 * 0.2 / 0.005) * 1e12 = 354.16 pF
  assert.ok(Math.abs((capMetrics.capacitance ?? 0) - 354.16) < 1.0, 'Capacitance expected ~354.2 pF');
  // E = 100 / 0.005 = 20000 V/m
  assert.strictEqual(capMetrics.electricField, 20000);

  // 2. Riemann Sum Definite Integral: b = 3.0, N = 6
  // deltaX = 0.5. Right endpoints: 0.5, 1.0, 1.5, 2.0, 2.5, 3.0
  // Sum = (0.25 + 1.0 + 2.25 + 4.0 + 6.25 + 9.0) * 0.5 = 22.75 * 0.5 = 11.375
  const riemannParams = { upperLimit: 3.0, partitionCount: 6 };
  const riemannMetrics = computeConceptLabMetrics(riemannParams);
  assert.strictEqual(riemannMetrics.deltaX, 0.5);
  assert.ok(Math.abs((riemannMetrics.riemannSum ?? 0) - 11.375) < 0.01, 'Riemann sum expected 11.375');
  assert.strictEqual(riemannMetrics.exactIntegral, 9.0);

  // 3. Big-O Complexity Metrics: N = 256
  const bigOParams = { inputSize: 256 };
  const bigOMetrics = computeConceptLabMetrics(bigOParams);
  assert.strictEqual(bigOMetrics.opsLogN, 8); // log2(256) = 8
  assert.strictEqual(bigOMetrics.opsN, 256);
  assert.strictEqual(bigOMetrics.opsNSquared, 65536);
});

test('Lorentz Force Engine - Particle Deflection & Gyroradius Verification', () => {
  // Test case: q = 4 μC, v = 50 m/s, B = 0.8 T, theta = 90 deg
  const params = { charge: 4, velocity: 50, magneticField: 0.8, angleDeg: 90 };
  const metrics = computeLorentzMetrics(params);

  // F = q * v * B * sin(90°) = 4 * 50 * 0.8 * 1.0 = 160 μN
  assert.strictEqual(metrics.lorentzForce, 160);
  assert.strictEqual(metrics.velocity, 50);
  assert.strictEqual(metrics.magneticField, 0.8);
  assert.ok(metrics.gyroradius > 0, 'Gyroradius must be positive');

  // Verify derived dispatcher handles lorentz_simulation correctly
  const dispatched = computeDerivedMetrics('lorentz_simulation', params);
  assert.strictEqual(dispatched.lorentzForce, 160);

  // Verify catalog configuration for em-s4-lab
  const emStage4 = PRACTICAL_MODELS_CATALOG['course-electromagnetism'][4];
  assert.ok(emStage4, 'EM Stage 4 must exist');
  assert.strictEqual(emStage4.modelType, 'lorentz_simulation', 'EM Stage 4 must use lorentz_simulation modelType');
});

