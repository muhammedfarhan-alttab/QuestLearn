// Dynamic Physics & Mathematical Calculation Engine for Practical Models
// Provides deterministic 60fps evaluation of physical states, live formula substitutions,
// and cause-and-effect learning explanations.

import type { SimulationModelType, GuidedExperimentTask } from '../data/practicalModelsData.ts';

export interface DerivedLabMetrics {
  [key: string]: number;
}

/**
 * Computes deterministic derived metrics for 2D Kinematics and Projectiles.
 */
export function computeKinematicsMetrics(params: Record<string, number>): DerivedLabMetrics {
  const v0 = params.initialSpeed ?? 25;
  const angleDeg = params.launchAngle ?? 45;
  const g = Math.max(0.1, params.gravity ?? 9.8);
  const y0 = params.launchHeight ?? 0;

  const thetaRad = (angleDeg * Math.PI) / 180;
  const vx0 = v0 * Math.cos(thetaRad);
  const vy0 = v0 * Math.sin(thetaRad);

  // Peak apex altitude: y_max = y0 + vy0^2 / (2g)
  const maxHeight = y0 + (vy0 * vy0) / (2 * g);

  // Total flight time: solve y(t) = y0 + vy0*t - 0.5*g*t^2 = 0
  const discriminant = vy0 * vy0 + 2 * g * y0;
  const flightTime = (vy0 + Math.sqrt(Math.max(0, discriminant))) / g;

  // Horizontal range: R = vx0 * flightTime
  const horizontalRange = vx0 * flightTime;

  // Impact speed
  const vyFinal = vy0 - g * flightTime;
  const impactSpeed = Math.sqrt(vx0 * vx0 + vyFinal * vyFinal);

  return {
    vx0,
    vy0,
    maxHeight,
    flightTime,
    horizontalRange,
    impactSpeed
  };
}

/**
 * Computes deterministic derived metrics for Newton's 2nd Law & Friction.
 */
export function computeForceMetrics(params: Record<string, number>): DerivedLabMetrics {
  const F_app = params.appliedForce ?? 30;
  const m = Math.max(0.1, params.mass ?? 5);
  const mu = Math.max(0, params.frictionCoeff ?? 0.2);
  const inclineDeg = params.inclineAngle ?? 0;
  const g = 9.8;

  const thetaRad = (inclineDeg * Math.PI) / 180;
  const normalForce = m * g * Math.cos(thetaRad);
  const frictionForce = mu * normalForce;
  const gravityIncline = m * g * Math.sin(thetaRad);

  const netForce = F_app - frictionForce - gravityIncline;
  const acceleration = netForce / m;

  return {
    normalForce,
    frictionForce,
    gravityIncline,
    netForce,
    acceleration
  };
}

/**
 * Computes deterministic derived metrics for Work-Energy & Conservation.
 */
export function computeEnergyMetrics(params: Record<string, number>): DerivedLabMetrics {
  const m = Math.max(0.1, params.mass ?? 4);
  const h0 = Math.max(0, params.initialHeight ?? 10);
  const v0 = params.initialVelocity ?? 0;
  const g = 9.8;

  const initialPe = m * g * h0;
  const initialKe = 0.5 * m * v0 * v0;
  const totalEnergy = initialPe + initialKe;

  // At ground level (h = 0)
  const maxVelocity = Math.sqrt(Math.max(0, (2 * totalEnergy) / m));

  // Current midpoint evaluation (at h = h0 / 2)
  const currentHeight = h0 / 2;
  const potentialEnergy = m * g * currentHeight;
  const kineticEnergy = Math.max(0, totalEnergy - potentialEnergy);
  const currentVelocity = Math.sqrt(Math.max(0, (2 * kineticEnergy) / m));

  return {
    totalEnergy,
    initialPe,
    initialKe,
    currentHeight,
    potentialEnergy,
    kineticEnergy,
    currentVelocity,
    maxVelocity
  };
}

/**
 * Computes deterministic derived metrics for Momentum & Collisions.
 */
export function computeCollisionMetrics(params: Record<string, number>): DerivedLabMetrics {
  const m1 = Math.max(0.1, params.m1 ?? 2);
  const v1 = params.v1 ?? 6;
  const m2 = Math.max(0.1, params.m2 ?? 2);
  const v2 = params.v2 ?? 0;
  const e = Math.min(1.0, Math.max(0.0, params.elasticity ?? 1.0));

  const totalInitialMomentum = m1 * v1 + m2 * v2;
  const mTotal = m1 + m2;

  // Standard 1D restitution equations:
  // v1' = [(m1 - e*m2)*v1 + (1+e)*m2*v2] / (m1 + m2)
  // v2' = [(1+e)*m1*v1 + (m2 - e*m1)*v2] / (m1 + m2)
  const v1Final = ((m1 - e * m2) * v1 + (1 + e) * m2 * v2) / mTotal;
  const v2Final = ((1 + e) * m1 * v1 + (m2 - e * m1) * v2) / mTotal;
  const totalFinalMomentum = m1 * v1Final + m2 * v2Final;

  const keInitial = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
  const keFinal = 0.5 * m1 * v1Final * v1Final + 0.5 * m2 * v2Final * v2Final;
  const keLost = Math.max(0, keInitial - keFinal);

  return {
    totalInitialMomentum,
    totalFinalMomentum,
    v1Final,
    v2Final,
    keInitial,
    keFinal,
    keLost
  };
}

/**
 * Computes deterministic derived metrics for Rotational Dynamics & Torque.
 */
export function computeRotationalMetrics(params: Record<string, number>): DerivedLabMetrics {
  const F = Math.max(0, params.appliedForce ?? 20);
  const r = Math.max(0.05, params.radius ?? 0.8);
  const m = Math.max(0.1, params.discMass ?? 5);
  const tau_f = Math.max(0, params.bearingFriction ?? 1.0);

  // Solid cylinder moment of inertia: I = 0.5 * m * r^2
  const momentOfInertia = 0.5 * m * r * r;
  const appliedTorque = r * F;
  const netTorque = appliedTorque - tau_f;
  const angularAccel = netTorque / momentOfInertia;

  // Assuming a continuous steady spin equivalent to 3 seconds of acceleration from rest:
  const angularSpeed = Math.max(0, angularAccel * 3.0);
  const rpm = (angularSpeed * 60) / (2 * Math.PI);
  const angularMomentum = momentOfInertia * angularSpeed;

  return {
    momentOfInertia,
    appliedTorque,
    netTorque,
    angularAccel,
    angularSpeed,
    rpm,
    angularMomentum
  };
}

/**
 * Computes deterministic derived metrics for Magnetic Lorentz Deflection.
 */
export function computeLorentzMetrics(params: Record<string, number>): DerivedLabMetrics {
  const q = params.charge ?? 4; // in μC
  const v = params.velocity ?? 50; // in m/s
  const B = params.magneticField ?? 0.8; // in T
  const thetaDeg = params.angleDeg ?? 90;
  const thetaRad = (thetaDeg * Math.PI) / 180;
  const lorentzForce = q * v * B * Math.sin(thetaRad); // in μN
  const gyroradius = v / Math.max(0.01, q * B * 0.1);
  return { lorentzForce, magneticField: B, velocity: v, gyroradius, charge: q, angleDeg: thetaDeg };
}

/**
 * Computes derived metrics for Concept Lab & generic STEM simulations.
 */
export function computeConceptLabMetrics(params: Record<string, number>): DerivedLabMetrics {
  // 1. Parallel Plate Capacitor (em-s2-lab)
  if (params.plateArea !== undefined || params.separation !== undefined) {
    const A = Math.max(0.01, params.plateArea ?? 0.1);
    const d = Math.max(0.0001, params.separation ?? 0.005);
    const V = params.voltage ?? 50;
    const eps0 = 8.854e-12;
    const capacitanceF = (eps0 * A) / d;
    const capacitance = capacitanceF * 1e12; // in pF
    const electricField = V / d; // in V/m
    const storedEnergy = 0.5 * capacitanceF * V * V * 1e9; // in nJ
    return { capacitance, electricField, storedEnergy, capacitanceF };
  }

  // 2. Magnetic Lorentz Force (em-s4-lab)
  if (params.magneticField !== undefined || (params.charge !== undefined && params.velocity !== undefined)) {
    const q = params.charge ?? 4; // in μC
    const v = params.velocity ?? 50; // in m/s
    const B = params.magneticField ?? 0.8; // in T
    const thetaDeg = params.angleDeg ?? 90;
    const thetaRad = (thetaDeg * Math.PI) / 180;
    const lorentzForce = q * v * B * Math.sin(thetaRad); // in μN
    return { lorentzForce, magneticField: B, velocity: v };
  }

  // 3. Maxwell EM Waves (em-s5-lab)
  if (params.frequency !== undefined && params.amplitude !== undefined) {
    const f = Math.max(1, params.frequency ?? 500); // in MHz
    const E0 = params.amplitude ?? 50; // in V/m
    const c = 3.0e8;
    const wavelength = c / (f * 1e6); // in meters
    const magneticAmplitude = (E0 / c) * 1e9; // in nT
    return { wavelength, magneticAmplitude, frequency: f, amplitude: E0 };
  }

  // 4. Coulomb's Law (em-s1-lab)
  if (params.charge1 !== undefined || params.charge2 !== undefined || (params.distance !== undefined && params.xCoord === undefined)) {
    const k = 8.99e9;
    const q1 = (params.charge1 ?? 4) * 1e-6;
    const q2 = (params.charge2 ?? -4) * 1e-6;
    const r = Math.max(0.01, params.distance ?? 0.5);
    const coulombForce = (k * Math.abs(q1 * q2)) / (r * r);
    return { 
      coulombForce,
      isAttractive: (q1 * q2) < 0 ? 1 : 0,
      electricFieldStrength: coulombForce / (Math.abs(q2) || 1e-6)
    };
  }

  // 5. Ohm's Law Circuit (em-s3-lab)
  if (params.resistance !== undefined && params.voltage !== undefined) {
    const V = params.voltage ?? 12;
    const R = Math.max(0.1, params.resistance ?? 10);
    const current = V / R;
    const power = V * current;
    return { current, power };
  }

  // 6. Calculus Riemann Definite Integral (calc-s4-lab)
  if (params.upperLimit !== undefined && params.partitionCount !== undefined) {
    const b = Math.max(0.1, params.upperLimit ?? 3.0);
    const N = Math.max(1, Math.round(params.partitionCount ?? 6));
    const deltaX = b / N;
    let riemannSum = 0;
    for (let i = 1; i <= N; i++) {
      const xi = i * deltaX; // Right-endpoint Riemann sum
      riemannSum += (xi * xi) * deltaX;
    }
    const exactIntegral = (b * b * b) / 3;
    return { deltaX, riemannSum, exactIntegral, upperLimit: b, partitionCount: N };
  }

  // 7. Calculus Power Rule (calc-s2-lab)
  if (params.coefficient !== undefined || params.exponent !== undefined) {
    const a = params.coefficient ?? 2;
    const n = params.exponent ?? 3;
    const x = params.xCoord ?? 1.5;
    const yVal = a * Math.pow(x, n);
    const slope = a * n * Math.pow(x, Math.max(0, n - 1));
    return { yVal, slope, xVal: x, powerN: n, coefficient: a };
  }

  // 8. Calculus Concavity & Extrema (calc-s3-lab)
  if (params.scaleParam !== undefined && params.xCoord !== undefined) {
    const k = params.scaleParam ?? 1.0;
    const x = params.xCoord ?? 1.0;
    const yVal = k * ((1 / 3) * Math.pow(x, 3) - x);
    const slope = k * (x * x - 1);
    const secondDerivative = 2 * k * x;
    return { yVal, slope, secondDerivative, xVal: x, scaleParam: k };
  }

  // 9. Calculus Differential Equations & Exponential Growth (calc-s5-lab)
  if (params.growthRate !== undefined || params.initialAmount !== undefined) {
    const k = params.growthRate ?? 0.4;
    const y0 = params.initialAmount ?? 10;
    const t = Math.max(0, params.timeElapsed ?? 4);
    const currentValue = y0 * Math.exp(k * t);
    const growthRateVal = k * currentValue;
    return { currentValue, growthRateVal, timeElapsed: t };
  }

  // 10. Calculus Derivative & Tangent Slope (calc-s1-lab)
  if (params.xCoord !== undefined) {
    const x = params.xCoord ?? 1.5;
    const dx = params.deltaX ?? 0.5;
    const slope = 2 * x;
    const yVal = x * x;
    const secantSlope = dx > 0 ? ((x + dx) * (x + dx) - yVal) / dx : slope;
    return { slope, yVal, secantSlope, xVal: x };
  }

  // 11. CS Big-O Complexity Scaling (cs-s1-lab)
  if (params.inputSize !== undefined) {
    const N = Math.max(1, params.inputSize ?? 100);
    const opsLogN = Math.ceil(Math.log2(N));
    const opsN = N;
    const opsNSquared = N * N;
    return { opsLogN, opsN, opsNSquared, inputSize: N };
  }

  // 12. CS BST Search & Depth (cs-s3-lab)
  if (params.treeNodes !== undefined) {
    const N = Math.max(1, params.treeNodes ?? 64);
    const treeHeight = Math.ceil(Math.log2(N + 1));
    return { treeHeight, maxSearchSteps: treeHeight, treeNodes: N };
  }

  // 13. CS Dynamic Programming Memoization (cs-s4-lab)
  if (params.problemSize !== undefined) {
    const N = Math.max(1, params.problemSize ?? 12);
    const naiveCalls = Math.pow(2, N);
    const memoCalls = Math.max(1, 2 * N - 1);
    const speedupFactor = naiveCalls / memoCalls;
    return { naiveCalls, memoCalls, speedupFactor, problemSize: N };
  }

  // 14. CS Space-Time Complexity Tradeoffs (cs-s5-lab)
  if (params.bufferSize !== undefined || params.batchSize !== undefined) {
    const B = Math.max(1, params.bufferSize ?? 64);
    const K = params.batchSize ?? 200;
    const ioLatency = 1000 / B;
    const throughput = K * (B / 10);
    return { ioLatency, throughput, bufferSize: B, batchSize: K };
  }

  // 15. CS Call Stack (cs-s2-lab)
  if (params.recursionDepth !== undefined || params.frameMemory !== undefined) {
    const depth = params.recursionDepth ?? 5;
    const size = params.frameMemory ?? 32;
    const totalStackMemory = depth * size;
    return { totalStackMemory, recursionDepth: depth, frameMemory: size };
  }

  // Generic fallback:
  const paramA = params.paramA ?? 20;
  const paramB = params.paramB ?? 5;
  const result = paramA * paramB;
  return { 
    result,
    coulombForce: 0,
    slope: 0,
    current: 0,
    power: 0,
    totalStackMemory: 0
  };
}

/**
 * Dispatcher function resolving derived metrics based on model type.
 */
export function computeDerivedMetrics(
  modelType: SimulationModelType,
  params: Record<string, number>
): DerivedLabMetrics {
  switch (modelType) {
    case 'kinematics_motion':
      return computeKinematicsMetrics(params);
    case 'force_simulation':
      return computeForceMetrics(params);
    case 'energy_simulation':
      return computeEnergyMetrics(params);
    case 'collision_simulation':
      return computeCollisionMetrics(params);
    case 'rotational_simulation':
      return computeRotationalMetrics(params);
    case 'lorentz_simulation':
      return computeLorentzMetrics(params);
    case 'concept_lab':
    default:
      return computeConceptLabMetrics(params);
  }
}

/**
 * Generates natural language cause-and-effect learning explanations
 * as the student adjusts simulation parameters.
 */
export function generateDynamicExplanation(
  modelType: SimulationModelType,
  currentParams: Record<string, number>,
  prevParams: Record<string, number> | null,
  derived: DerivedLabMetrics
): string {
  // If first load or no change:
  if (!prevParams) {
    switch (modelType) {
      case 'kinematics_motion':
        return `Simulation ready. Initial launch speed is ${currentParams.initialSpeed} m/s at ${currentParams.launchAngle}°. Peak altitude is ${derived.maxHeight?.toFixed(1)} m and range is ${derived.horizontalRange?.toFixed(1)} m.`;
      case 'force_simulation':
        return `Block ready on surface. Applied force of ${currentParams.appliedForce} N against ${derived.frictionForce?.toFixed(1)} N of friction produces net acceleration of ${derived.acceleration?.toFixed(2)} m/s².`;
      case 'energy_simulation':
        return `Ramp configured. Total mechanical energy is ${derived.totalEnergy?.toFixed(0)} J, conserved continuously between potential and kinetic energy.`;
      case 'collision_simulation':
        return `Collision air track ready. Cart 1 (${currentParams.m1} kg at ${currentParams.v1} m/s) will strike Cart 2 (${currentParams.m2} kg at ${currentParams.v2} m/s). System momentum is conserved at ${derived.totalInitialMomentum?.toFixed(1)} kg·m/s.`;
      case 'rotational_simulation':
        return `Rotational disc primed. Applying ${currentParams.appliedForce} N at radius ${currentParams.radius} m yields ${derived.appliedTorque?.toFixed(1)} N·m torque, accelerating the disc at ${derived.angularAccel?.toFixed(2)} rad/s².`;
      case 'lorentz_simulation':
        return `Magnetic chamber energized. Charge injected at ${currentParams.velocity ?? 50} m/s into B = ${currentParams.magneticField ?? 0.8} T. Perpendicular Lorentz deflecting force: ${derived.lorentzForce?.toFixed(1)} μN.`;
      default:
        return 'System calibrated. Adjust parameters below to observe real-time cause-and-effect dynamics.';
    }
  }

  // Detect which parameter changed the most:
  let changedKey = '';
  let delta = 0;
  for (const key of Object.keys(currentParams)) {
    const diff = currentParams[key] - (prevParams[key] ?? currentParams[key]);
    if (Math.abs(diff) > 0.001) {
      changedKey = key;
      delta = diff;
      break;
    }
  }

  if (!changedKey) {
    return 'Parameters stable. Modify any slider to observe physical cause-and-effect.';
  }

  const isIncrease = delta > 0;

  switch (modelType) {
    case 'kinematics_motion':
      if (changedKey === 'launchAngle') {
        if (currentParams.launchAngle === 45) {
          return `You set launch angle to exactly 45°! This maximizes horizontal range on level ground (${(derived.horizontalRange ?? 0).toFixed(1)} m) by balancing horizontal speed with flight duration.`;
        }
        if (currentParams.launchAngle > 45) {
          return `Increased launch angle to ${currentParams.launchAngle}°. More energy is channeled into vertical velocity, raising peak apex to ${(derived.maxHeight ?? 0).toFixed(1)} m while reducing horizontal travel speed.`;
        }
        return `Decreased launch angle to ${currentParams.launchAngle}°. The trajectory is flatter: horizontal velocity is higher, but shorter flight time (${(derived.flightTime ?? 0).toFixed(1)} s) reduces total range.`;
      }
      if (changedKey === 'initialSpeed') {
        return `${isIncrease ? 'Increased' : 'Decreased'} launch speed to ${currentParams.initialSpeed} m/s. Range scaled quadratically (R ∝ v₀²) to ${(derived.horizontalRange ?? 0).toFixed(1)} m, with flight time of ${(derived.flightTime ?? 0).toFixed(1)} s.`;
      }
      if (changedKey === 'gravity') {
        return `Gravitational acceleration adjusted to ${currentParams.gravity} m/s². ${currentParams.gravity < 9.8 ? 'Weaker gravity allows projectiles to float much longer and reach much greater distances!' : 'Stronger gravity pulls the mass down rapidly, sharply curtailing flight time.'}`;
      }
      return `Kinematic variables updated. Peak height: ${(derived.maxHeight ?? 0).toFixed(1)} m, Total range: ${(derived.horizontalRange ?? 0).toFixed(1)} m.`;

    case 'force_simulation':
      if (changedKey === 'appliedForce') {
        return `${isIncrease ? 'Increased' : 'Decreased'} applied force to ${currentParams.appliedForce} N. According to Newton's 2nd Law (F_net = ma), acceleration ${isIncrease ? 'jumped' : 'dropped'} to ${(derived.acceleration ?? 0).toFixed(2)} m/s².`;
      }
      if (changedKey === 'mass') {
        return `${isIncrease ? 'Increased' : 'Decreased'} block mass to ${currentParams.mass} kg. Higher inertia requires greater force to accelerate: acceleration changed to ${(derived.acceleration ?? 0).toFixed(2)} m/s² (a ∝ 1/m).`;
      }
      if (changedKey === 'frictionCoeff') {
        return `Surface friction coefficient adjusted to ${currentParams.frictionCoeff}. Frictional resistance opposes motion with ${(derived.frictionForce ?? 0).toFixed(1)} N of force (f = μ·N).`;
      }
      if (changedKey === 'inclineAngle') {
        return `Ramp inclined to ${currentParams.inclineAngle}°. Gravity component down the slope is now ${(derived.gravityIncline ?? 0).toFixed(1)} N, while normal force reduced to ${(derived.normalForce ?? 0).toFixed(1)} N.`;
      }
      return `Net force is ${(derived.netForce ?? 0).toFixed(1)} N, producing ${(derived.acceleration ?? 0).toFixed(2)} m/s² acceleration.`;

    case 'energy_simulation':
      if (changedKey === 'initialHeight') {
        return `Release height shifted to ${currentParams.initialHeight} m. Gravitational potential energy (PE = mgh) is now ${(derived.totalEnergy ?? 0).toFixed(0)} J, which will fully convert to a maximum velocity of ${(derived.maxVelocity ?? 0).toFixed(1)} m/s at ground level.`;
      }
      if (changedKey === 'mass') {
        return `Rider mass adjusted to ${currentParams.mass} kg. Notice that total energy scaled proportionally to ${(derived.totalEnergy ?? 0).toFixed(0)} J, but maximum bottom speed remains exactly identical (${(derived.maxVelocity ?? 0).toFixed(1)} m/s) because mass cancels out in v = √(2gh)!`;
      }
      if (changedKey === 'damping') {
        return `Friction drag set to ${currentParams.damping}. Non-conservative forces will dissipate mechanical energy into heat over consecutive oscillations.`;
      }
      return `Mechanical energy conserved at ${(derived.totalEnergy ?? 0).toFixed(0)} Joules.`;

    case 'collision_simulation':
      if (changedKey === 'elasticity') {
        if (currentParams.elasticity === 1.0) {
          return 'Elasticity set to 1.0 (Perfect Elasticity). Kinetic energy is 100% conserved with zero energy lost to heat or sound.';
        }
        if (currentParams.elasticity === 0.0) {
          return `Elasticity set to 0.0 (Completely Inelastic). The carts stick together and move at a single common velocity, dissipating ${(derived.keLost ?? 0).toFixed(1)} J of kinetic energy.`;
        }
        return `Elasticity set to ${currentParams.elasticity}. Real-world partial bounce: ${(derived.keLost ?? 0).toFixed(1)} J of mechanical energy lost.`;
      }
      if (changedKey === 'm1' || changedKey === 'm2') {
        return `Mass ratio altered. System momentum remains strictly invariant at ${(derived.totalInitialMomentum ?? 0).toFixed(1)} kg·m/s.`;
      }
      return `Momentum conserved: Total P = ${(derived.totalInitialMomentum ?? 0).toFixed(1)} kg·m/s.`;

    case 'rotational_simulation':
      if (changedKey === 'radius') {
        return `Disc radius changed to ${currentParams.radius} m. Moment of inertia scaled with the square of the radius (I = ½mr²) to ${(derived.momentOfInertia ?? 0).toFixed(3)} kg·m²!`;
      }
      if (changedKey === 'appliedForce') {
        return `Tangential force adjusted to ${currentParams.appliedForce} N. Applied torque τ = r·F rose to ${(derived.appliedTorque ?? 0).toFixed(1)} N·m, driving angular acceleration of ${(derived.angularAccel ?? 0).toFixed(2)} rad/s².`;
      }
      return `Net torque is ${(derived.netTorque ?? 0).toFixed(1)} N·m, yielding angular acceleration α = ${(derived.angularAccel ?? 0).toFixed(2)} rad/s².`;

    case 'concept_lab':
    default:
      if (changedKey === 'xCoord') {
        return `Moved evaluation point x to ${currentParams.xCoord}. The tangent slope f'(x) is now ${(derived.slope ?? 0).toFixed(2)}, indicating the exact instantaneous rate of change at this point.`;
      }
      if (changedKey === 'deltaX') {
        return `Adjusted secant step Δx to ${currentParams.deltaX}. As Δx approaches 0, the average rate of change converges toward the true instantaneous tangent slope ${(derived.slope ?? 0).toFixed(2)}!`;
      }
      if (changedKey === 'partitionCount') {
        return `Set partition count N to ${currentParams.partitionCount} rectangles. More slices reduce approximation error, converging the Riemann sum (${(derived.riemannSum ?? 0).toFixed(2)}) towards the exact integral (${(derived.exactIntegral ?? 0).toFixed(2)}).`;
      }
      if (changedKey === 'upperLimit') {
        return `Upper bound shifted to b = ${currentParams.upperLimit}. The exact continuous accumulated area ∫₀ᵇ x² dx is now ${(derived.exactIntegral ?? 0).toFixed(2)} units².`;
      }
      if (changedKey === 'growthRate') {
        return `Growth constant k adjusted to ${currentParams.growthRate} /s. Magnitude accumulates to ${(derived.currentValue ?? 0).toFixed(1)} with instantaneous rate of change ${(derived.growthRateVal ?? 0).toFixed(1)} /s.`;
      }
      if (changedKey === 'separation') {
        return `Plate gap changed to ${currentParams.separation} m. Narrower separation intensifies electric field (${(derived.electricField ?? 0).toFixed(0)} V/m) and raises capacitance to ${(derived.capacitance ?? 0).toFixed(1)} pF.`;
      }
      if (changedKey === 'inputSize') {
        return `Input size scaled to N = ${currentParams.inputSize}. Notice logarithmic search needs only ${(derived.opsLogN ?? 0).toFixed(0)} steps, while quadratic brute force explodes to ${(derived.opsNSquared ?? 0).toLocaleString()} operations!`;
      }
      if (changedKey === 'problemSize') {
        return `Problem size set to N = ${currentParams.problemSize}. Dynamic programming memoization executes in just ${(derived.memoCalls ?? 0).toFixed(0)} steps, running ${(derived.speedupFactor ?? 0).toFixed(0)}x faster than naive recursion!`;
      }
      if (changedKey === 'recursionDepth') {
        return `Recursion depth adjusted to ${currentParams.recursionDepth} frames. Stack footprint is now ${(derived.totalStackMemory ?? 0).toFixed(0)} KB.`;
      }
      return `Parameter ${changedKey} updated to ${currentParams[changedKey]}. Derived system metrics re-evaluated.`;
  }
}

/**
 * Validates whether a guided experiment task condition has been satisfied.
 */
export function checkTaskCompletion(
  task: GuidedExperimentTask,
  params: Record<string, number>,
  derived: DerivedLabMetrics
): boolean {
  try {
    return task.checkSatisfied(params, derived);
  } catch (err) {
    console.error('Error evaluating task condition:', err);
    return false;
  }
}
