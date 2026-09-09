// Practical Models & Simulation Catalog Data
// Supports 6 simulation types across all 4 courses and 20 stages:
// 1. kinematics_motion (Kinematics & 2D Projectiles)
// 2. force_simulation (Newton's Laws & Friction)
// 3. energy_simulation (Work-Energy Conservation)
// 4. collision_simulation (Momentum & Collisions)
// 5. rotational_simulation (Torque & Rotational Dynamics)
// 6. concept_lab (Universal Fallback: Waves, Circuits, Calculus, CS)

export type SimulationModelType =
  | 'kinematics_motion'
  | 'force_simulation'
  | 'energy_simulation'
  | 'collision_simulation'
  | 'rotational_simulation'
  | 'lorentz_simulation'
  | 'concept_lab';

export interface ParameterConfig {
  key: string;
  label: string;
  symbol: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  description: string;
}

export interface FormulaCard {
  name: string;
  formulaLatex: string;
  description: string;
  formatEvaluation: (params: Record<string, number>, derived: Record<string, number>) => string;
}

export interface GuidedExperimentTask {
  id: string;
  title: string;
  instruction: string;
  hint: string;
  targetMetric: string;
  targetValue: number;
  tolerance: number;
  rewardXp: number;
  rewardGeo: number;
  checkSatisfied: (params: Record<string, number>, derived: Record<string, number>) => boolean;
}

export interface PracticalModelConfig {
  id: string;
  courseId: string;
  stageNumber: number;
  subtopicName: string;
  modelType: SimulationModelType;
  title: string;
  conceptFocus: string;
  overview: string;
  learningGoals: string[];
  parameters: ParameterConfig[];
  formulas: FormulaCard[];
  guidedTasks: GuidedExperimentTask[];
  whatIfPrompts: string[];
  conceptTags: string[];
}

export const COURSE_STAGE_METADATA: Record<string, Record<number, { title: string; shortTag: string }>> = {
  'course-mechanics': {
    1: { title: 'Vector Displacement & 2D Projectiles', shortTag: 'Kinematics & Trajectory' },
    2: { title: "Newton's Laws & Incline Friction", shortTag: "Newton's Laws & Friction" },
    3: { title: 'Work-Energy & Conservation', shortTag: 'Work-Energy Conservation' },
    4: { title: 'Elastic Momentum & Collisions', shortTag: 'Momentum & Collisions' },
    5: { title: 'Rotational Dynamics & Torque', shortTag: 'Torque & Rotational' }
  },
  'course-electromagnetism': {
    1: { title: 'Coulombic Point Charges & Fields', shortTag: "Coulomb's Law & Fields" },
    2: { title: 'Electric Potential & Capacitors', shortTag: 'Capacitance & Energy' },
    3: { title: 'Kirchhoff Loops & Circuit Dynamics', shortTag: "Ohm's Law & DC Circuits" },
    4: { title: 'Lorentz Deflection & Induction', shortTag: 'Magnetic Lorentz Force' },
    5: { title: 'Maxwell Waves & Light Optics', shortTag: 'EM Waves & Radiation' }
  },
  'course-calculus': {
    1: { title: 'Limits & Tangent Line Slopes', shortTag: 'Tangent Slopes & Limits' },
    2: { title: 'Power Rule & Derivative Chains', shortTag: 'Power Rule & Derivatives' },
    3: { title: 'Concavity & Critical Extrema', shortTag: 'Concavity & Extrema' },
    4: { title: 'Riemann Sums & Definite Integrals', shortTag: 'Riemann Integral Sums' },
    5: { title: 'Differential Equations & Growth', shortTag: 'Differential Equations' }
  },
  'course-cs': {
    1: { title: 'Asymptotic Complexity & Big-O', shortTag: 'Big-O Growth Rates' },
    2: { title: 'Call Stack & Recursion Depth', shortTag: 'Recursion & Call Stack' },
    3: { title: 'Binary Search Trees & Depth', shortTag: 'BST Search & Depth' },
    4: { title: 'Dynamic Programming & Cache', shortTag: 'DP Memoization Table' },
    5: { title: 'Space-Time Complexity Tradeoffs', shortTag: 'Space-Time Tradeoffs' }
  }
};

export const PRACTICAL_MODELS_CATALOG: Record<string, Record<number, PracticalModelConfig>> = {
  // =========================================================================
  // 1. PHYSICS I — CLASSICAL MECHANICS
  // =========================================================================
  'course-mechanics': {
    // Stage 1: Vector Displacement & 2D Projectiles
    1: {
      id: 'mech-s1-lab',
      courseId: 'course-mechanics',
      stageNumber: 1,
      subtopicName: 'Vector Displacement & Kinematics',
      modelType: 'kinematics_motion',
      title: '2D Trajectory & Kinematic Vector Lab',
      conceptFocus: 'Independent Orthogonal Velocity, Gravitational Free Fall & Trajectory Range',
      overview: 'Investigate how initial launch speed and angle govern horizontal range, peak altitude, and flight time under constant gravitational acceleration.',
      learningGoals: [
        'Observe how horizontal velocity vx remains constant throughout flight while vertical velocity vy decreases uniformly by g = 9.8 m/s².',
        'Discover that a 45° launch angle maximizes horizontal range on level ground.',
        'Analyze the parabolic trajectory equation y(x) = x·tan(θ) - (g·x²)/(2·v₀²·cos²(θ)).'
      ],
      parameters: [
        {
          key: 'initialSpeed',
          label: 'Launch Speed',
          symbol: 'v₀',
          min: 5,
          max: 50,
          step: 1,
          defaultValue: 25,
          unit: 'm/s',
          description: 'Initial magnitude of launch velocity vector.'
        },
        {
          key: 'launchAngle',
          label: 'Launch Angle',
          symbol: 'θ',
          min: 0,
          max: 90,
          step: 1,
          defaultValue: 45,
          unit: '°',
          description: 'Launch inclination angle above the horizontal.'
        },
        {
          key: 'gravity',
          label: 'Gravitational Accel',
          symbol: 'g',
          min: 1.6,
          max: 25.0,
          step: 0.1,
          defaultValue: 9.8,
          unit: 'm/s²',
          description: 'Downward gravitational acceleration (9.8 on Earth, 1.6 on Moon, 24.8 on Jupiter).'
        },
        {
          key: 'launchHeight',
          label: 'Platform Height',
          symbol: 'y₀',
          min: 0,
          max: 30,
          step: 1,
          defaultValue: 0,
          unit: 'm',
          description: 'Starting height above ground level.'
        }
      ],
      formulas: [
        {
          name: 'Peak Altitude (Apex)',
          formulaLatex: 'H = y_0 + \\frac{v_0^2 \\sin^2(\\theta)}{2g}',
          description: 'Maximum vertical altitude attained when vertical velocity momentarily drops to 0.',
          formatEvaluation: (p, d) => `H = ${p.launchHeight ?? 0} + (${p.initialSpeed ?? 25}² · sin²(${p.launchAngle ?? 45}°)) / (2 · ${p.gravity ?? 9.8}) = ${(d?.maxHeight ?? 0).toFixed(2)} m`
        },
        {
          name: 'Horizontal Range',
          formulaLatex: 'R = \\frac{v_0^2 \\sin(2\\theta)}{g}',
          description: 'Total horizontal displacement traveled before returning to launch altitude.',
          formatEvaluation: (p, d) => `R = (${p.initialSpeed ?? 25}² · sin(${2 * (p.launchAngle ?? 45)}°)) / ${p.gravity ?? 9.8} = ${(d?.horizontalRange ?? 0).toFixed(2)} m`
        },
        {
          name: 'Total Flight Time',
          formulaLatex: 't_{\\text{flight}} = \\frac{2 v_0 \\sin(\\theta)}{g}',
          description: 'Total time elapsed until the projectile reaches ground level.',
          formatEvaluation: (p, d) => `t = (2 · ${p.initialSpeed ?? 25} · sin(${p.launchAngle ?? 45}°)) / ${p.gravity ?? 9.8} = ${(d?.flightTime ?? 0).toFixed(2)} s`
        }
      ],
      guidedTasks: [
        {
          id: 'mech-1-t1',
          title: 'Maximum Range Calibration',
          instruction: 'Set launch angle to exactly 45° with launch speed 28 m/s on Earth (g = 9.8) to attain a horizontal range of 80.0 m (± 1.0 m).',
          hint: '45 degrees creates equal horizontal and vertical components (v_x = v_y), maximizing the product of v_x and flight time.',
          targetMetric: 'horizontalRange',
          targetValue: 80.0,
          tolerance: 1.5,
          rewardXp: 30,
          rewardGeo: 15,
          checkSatisfied: (p, d) => Math.abs(d.horizontalRange - 80.0) <= 1.5 && Math.abs(p.launchAngle - 45) <= 1
        },
        {
          id: 'mech-1-t2',
          title: 'Stratospheric Apex Target',
          instruction: 'Adjust launch parameters so that peak apex height reaches exactly 30.0 m (± 0.5 m).',
          hint: 'Increase launch angle to 60° or higher, or raise launch speed to increase vertical velocity component.',
          targetMetric: 'maxHeight',
          targetValue: 30.0,
          tolerance: 0.5,
          rewardXp: 35,
          rewardGeo: 20,
          checkSatisfied: (p, d) => Math.abs(d.maxHeight - 30.0) <= 0.5
        },
        {
          id: 'mech-1-t3',
          title: 'Lunar Flight Arc',
          instruction: 'Switch gravity to Moon level (g = 1.6 m/s²) with speed = 20 m/s and angle = 45°. Observe how flight time exceeds 17 seconds!',
          hint: 'Lower gravity reduces downward acceleration, vastly extending flight duration and trajectory range.',
          targetMetric: 'flightTime',
          targetValue: 17.68,
          tolerance: 1.0,
          rewardXp: 40,
          rewardGeo: 25,
          checkSatisfied: (p, d) => Math.abs(p.gravity - 1.6) <= 0.2 && d.flightTime >= 16.5
        }
      ],
      whatIfPrompts: [
        'What if you launch at 30° vs 60°? Notice both yield identical horizontal ranges because sin(2·30°) = sin(2·60°) = sin(60°) = 0.866!',
        'What happens to peak altitude if launch speed doubles? Peak height quadruples because H ∝ v₀².',
        'Why does a feather and bowling ball follow the exact same arc in a vacuum? Because acceleration g is independent of mass.'
      ],
      conceptTags: ['Kinematics', 'Trajectories', 'Vectors', 'Gravity']
    },

    // Stage 2: Newton's Laws & Friction
    2: {
      id: 'mech-s2-lab',
      courseId: 'course-mechanics',
      stageNumber: 2,
      subtopicName: 'Newtonian Force & Reaction Pairs',
      modelType: 'force_simulation',
      title: 'Newtonian Force & Friction Dynamics Lab',
      conceptFocus: 'Newton’s Second Law (F_net = ma), Static vs Kinetic Friction, and Normal Reaction Forces',
      overview: 'Apply horizontal forces to blocks with varying mass and surface friction. Observe the transition between static friction and kinetic motion.',
      learningGoals: [
        'Verify Newton’s 2nd Law: acceleration is directly proportional to net force and inversely proportional to mass (a = F_net / m).',
        'Distinguish static friction (which opposes applied force up to f_s,max = μ_s·N) from kinetic friction (f_k = μ_k·N).',
        'Analyze the free-body diagram showing applied force, friction, gravity, and normal reaction forces in balance.'
      ],
      parameters: [
        {
          key: 'appliedForce',
          label: 'Applied Force',
          symbol: 'F_app',
          min: 0,
          max: 100,
          step: 1,
          defaultValue: 30,
          unit: 'N',
          description: 'External horizontal force applied to the block.'
        },
        {
          key: 'mass',
          label: 'Block Mass',
          symbol: 'm',
          min: 1,
          max: 20,
          step: 0.5,
          defaultValue: 5,
          unit: 'kg',
          description: 'Mass of the object (inertia).'
        },
        {
          key: 'frictionCoeff',
          label: 'Friction Coefficient',
          symbol: 'μ',
          min: 0.0,
          max: 0.8,
          step: 0.05,
          defaultValue: 0.2,
          unit: '',
          description: 'Surface friction coefficient (0 is frictionless ice, 0.8 is rough rubber on concrete).'
        },
        {
          key: 'inclineAngle',
          label: 'Incline Angle',
          symbol: 'θ',
          min: 0,
          max: 45,
          step: 1,
          defaultValue: 0,
          unit: '°',
          description: 'Slope angle of the inclined plane.'
        }
      ],
      formulas: [
        {
          name: 'Normal Force',
          formulaLatex: 'N = m \\cdot g \\cdot \\cos(\\theta)',
          description: 'Perpendicular contact force exerted by surface on the block.',
          formatEvaluation: (p, d) => `N = ${p.mass ?? 5} · 9.8 · cos(${p.inclineAngle ?? 30}°) = ${(d?.normalForce ?? 0).toFixed(2)} N`
        },
        {
          name: 'Friction Force',
          formulaLatex: 'f_k = \\mu \\cdot N',
          description: 'Opposing resistive force between contacting surface and block.',
          formatEvaluation: (p, d) => `f_k = ${p.frictionCoeff ?? 0.25} · ${(d?.normalForce ?? 0).toFixed(1)} = ${(d?.frictionForce ?? 0).toFixed(2)} N`
        },
        {
          name: 'Net Acceleration',
          formulaLatex: 'a = \\frac{F_{\\text{net}}}{m} = \\frac{F_{\\text{app}} - f_k - mg\\sin(\\theta)}{m}',
          description: 'Resulting acceleration from unbalanced net force.',
          formatEvaluation: (p, d) => `a = (${p.appliedForce ?? 35} - ${(d?.frictionForce ?? 0).toFixed(1)}) / ${p.mass ?? 5} = ${(d?.acceleration ?? 0).toFixed(2)} m/s²`
        }
      ],
      guidedTasks: [
        {
          id: 'mech-2-t1',
          title: 'Target Acceleration Calibration',
          instruction: 'Tune applied force and mass on a flat surface (θ = 0°) so acceleration reaches exactly 5.0 m/s² (± 0.2 m/s²).',
          hint: 'With mass = 4 kg and friction = 0.2, normal force is 39.2 N and friction is 7.84 N. You need F_net = 20 N, so set F_app ≈ 28 N.',
          targetMetric: 'acceleration',
          targetValue: 5.0,
          tolerance: 0.2,
          rewardXp: 30,
          rewardGeo: 15,
          checkSatisfied: (p, d) => Math.abs(d.acceleration - 5.0) <= 0.2
        },
        {
          id: 'mech-2-t2',
          title: 'Zero Net Force / Dynamic Equilibrium',
          instruction: 'Adjust applied force until it exactly balances friction, achieving a = 0.0 m/s² while in motion (Terminal Constant Velocity).',
          hint: 'When F_app equals f_k, net force is zero, meaning velocity remains completely constant with zero acceleration.',
          targetMetric: 'acceleration',
          targetValue: 0.0,
          tolerance: 0.1,
          rewardXp: 35,
          rewardGeo: 20,
          checkSatisfied: (p, d) => Math.abs(d.acceleration) <= 0.1 && p.appliedForce > 0
        },
        {
          id: 'mech-2-t3',
          title: 'Overcoming Incline Gravity',
          instruction: 'Set incline angle to 30°, mass = 6 kg, and apply enough force to overcome both gravity component (mg·sin(30°)) and friction to achieve a ≥ 3.0 m/s².',
          hint: 'On a 30° slope, gravity pulls downward along the incline with F_gx = mg·sin(30°) = 29.4 N. You must push with force greater than 40 N.',
          targetMetric: 'acceleration',
          targetValue: 3.0,
          tolerance: 0.3,
          rewardXp: 40,
          rewardGeo: 25,
          checkSatisfied: (p, d) => p.inclineAngle >= 28 && d.acceleration >= 3.0
        }
      ],
      whatIfPrompts: [
        'What happens if you double the mass while keeping applied force constant? Acceleration cuts in half, confirming a ∝ 1/m.',
        'Why does a heavier car have more friction force on the road, yet does not stop faster? Because while friction force increases (f ∝ m), required stopping force also increases by the exact same mass factor!',
        'What occurs when applied force is less than static friction? The block remains completely stationary with acceleration 0.'
      ],
      conceptTags: ['Forces', 'Newton Laws', 'Friction', 'Equilibrium']
    },

    // Stage 3: Work-Energy & Conservation
    3: {
      id: 'mech-s3-lab',
      courseId: 'course-mechanics',
      stageNumber: 3,
      subtopicName: 'Work-Energy & Potential Wells',
      modelType: 'energy_simulation',
      title: 'Mechanical Energy Conservation Lab',
      conceptFocus: 'Kinetic vs Gravitational Potential Energy, Work-Energy Theorem, and Total Energy Conservation',
      overview: 'Release a mass on a frictionless curved track and watch energy oscillate back and forth between Potential Energy (mgh) and Kinetic Energy (½mv²).',
      learningGoals: [
        'Verify that Total Mechanical Energy E = PE + KE remains perfectly conserved in an isolated frictionless system.',
        'Observe maximum speed occurring at the lowest point (h = 0) where all potential energy is converted to kinetic energy: v_max = √(2gh).',
        'Analyze how thermal friction dissipation gradually drains mechanical energy into non-recoverable internal heat.'
      ],
      parameters: [
        {
          key: 'mass',
          label: 'Rider Mass',
          symbol: 'm',
          min: 1,
          max: 20,
          step: 0.5,
          defaultValue: 4,
          unit: 'kg',
          description: 'Mass of the rider cart.'
        },
        {
          key: 'initialHeight',
          label: 'Release Height',
          symbol: 'h_0',
          min: 1,
          max: 20,
          step: 0.5,
          defaultValue: 10,
          unit: 'm',
          description: 'Starting height above ground level.'
        },
        {
          key: 'initialVelocity',
          label: 'Initial Speed',
          symbol: 'v_0',
          min: 0,
          max: 20,
          step: 1,
          defaultValue: 0,
          unit: 'm/s',
          description: 'Push speed imparted at release.'
        },
        {
          key: 'damping',
          label: 'Friction Drag',
          symbol: 'b',
          min: 0.0,
          max: 0.3,
          step: 0.02,
          defaultValue: 0.0,
          unit: '',
          description: 'Thermal loss coefficient (0 is perfectly conservative frictionless track).'
        }
      ],
      formulas: [
        {
          name: 'Potential Energy',
          formulaLatex: 'PE = m \\cdot g \\cdot h',
          description: 'Gravitational energy stored due to vertical elevation.',
          formatEvaluation: (p, d) => `PE = ${p.mass ?? 4} · 9.8 · ${(d?.currentHeight ?? 0).toFixed(1)} = ${(d?.potentialEnergy ?? 0).toFixed(1)} J`
        },
        {
          name: 'Kinetic Energy',
          formulaLatex: 'KE = \\frac{1}{2} m \\cdot v^2',
          description: 'Energy possessed by the object due to its motion.',
          formatEvaluation: (p, d) => `KE = 0.5 · ${p.mass ?? 4} · (${(d?.currentVelocity ?? 0).toFixed(1)})² = ${(d?.kineticEnergy ?? 0).toFixed(1)} J`
        },
        {
          name: 'Total Mechanical Energy',
          formulaLatex: 'E_{\\text{total}} = PE + KE = \\text{Constant}',
          description: 'Sum of kinetic and potential energy remains conserved.',
          formatEvaluation: (p, d) => `E = ${(d?.potentialEnergy ?? 0).toFixed(1)} + ${(d?.kineticEnergy ?? 0).toFixed(1)} = ${(d?.totalEnergy ?? 0).toFixed(1)} J`
        }
      ],
      guidedTasks: [
        {
          id: 'mech-3-t1',
          title: 'Maximum Velocity Challenge',
          instruction: 'Release from height h = 12.5 m with mass = 4 kg on a frictionless track (b = 0). Reach a maximum ground speed of exactly 15.65 m/s (± 0.2 m/s).',
          hint: 'At ground level (h = 0), PE is 0 so KE = E_total. Using v = √(2gh) = √(2 · 9.8 · 12.5) = √245 ≈ 15.65 m/s.',
          targetMetric: 'maxVelocity',
          targetValue: 15.65,
          tolerance: 0.3,
          rewardXp: 30,
          rewardGeo: 15,
          checkSatisfied: (p, d) => Math.abs(d.maxVelocity - 15.65) <= 0.3 && p.damping === 0
        },
        {
          id: 'mech-3-t2',
          title: 'Mega-Joule Energy Accumulation',
          instruction: 'Configure mass and height such that Total Mechanical Energy exceeds 1000 Joules.',
          hint: 'With mass = 12 kg and height = 10 m, PE = 12 · 9.8 · 10 = 1176 J!',
          targetMetric: 'totalEnergy',
          targetValue: 1000,
          tolerance: 50,
          rewardXp: 35,
          rewardGeo: 20,
          checkSatisfied: (p, d) => d.totalEnergy >= 1000
        },
        {
          id: 'mech-3-t3',
          title: 'Equipartition Point',
          instruction: 'Inspect the energy meters when the cart is at half its release height (h = h_0 / 2). Notice PE and KE are exactly equal!',
          hint: 'Halfway down, exactly 50% of the initial potential energy has converted into kinetic energy.',
          targetMetric: 'peRatio',
          targetValue: 0.5,
          tolerance: 0.05,
          rewardXp: 40,
          rewardGeo: 25,
          checkSatisfied: (p, d) => p.initialVelocity === 0 && p.damping === 0
        }
      ],
      whatIfPrompts: [
        'Does the cart’s maximum bottom speed depend on its mass? No! Because mgh = ½mv² cancels mass m on both sides: v = √(2gh).',
        'What happens if we introduce friction damping? Total mechanical energy drops over time, converted to thermal heat.',
        'Why does a roller coaster loop require a minimum entry velocity? To ensure normal force at the top is ≥ 0 (v_top ≥ √(g·R)).'
      ],
      conceptTags: ['Work', 'Kinetic Energy', 'Potential Energy', 'Conservation']
    },

    // Stage 4: Linear Momentum & Collisions
    4: {
      id: 'mech-s4-lab',
      courseId: 'course-mechanics',
      stageNumber: 4,
      subtopicName: 'Momentum Invariance & Center of Mass',
      modelType: 'collision_simulation',
      title: 'Linear Momentum & Collision Dynamics Lab',
      conceptFocus: 'Conservation of Linear Momentum (Σp_i = Σp_f), Elastic vs Inelastic Collisions, and Restitution',
      overview: 'Collide two carts on a frictionless linear track. Adjust individual masses, velocities, and coefficient of restitution to witness momentum conservation.',
      learningGoals: [
        'Verify that total system momentum Σp = m₁v₁ + m₂v₂ is strictly conserved in all isolated collisions.',
        'Contrast elastic collisions (where kinetic energy is conserved, e = 1) with perfectly inelastic collisions (carts stick together, e = 0).',
        'Analyze velocity exchange between equal masses (Newton’s Cradle effect).'
      ],
      parameters: [
        {
          key: 'm1',
          label: 'Cart 1 Mass',
          symbol: 'm₁',
          min: 1,
          max: 10,
          step: 0.5,
          defaultValue: 2,
          unit: 'kg',
          description: 'Mass of the left (cyan) cart.'
        },
        {
          key: 'v1',
          label: 'Cart 1 Velocity',
          symbol: 'v₁',
          min: -15,
          max: 15,
          step: 1,
          defaultValue: 6,
          unit: 'm/s',
          description: 'Initial velocity of the left cart (+ is moving right).'
        },
        {
          key: 'm2',
          label: 'Cart 2 Mass',
          symbol: 'm₂',
          min: 1,
          max: 10,
          step: 0.5,
          defaultValue: 2,
          unit: 'kg',
          description: 'Mass of the right (amber) cart.'
        },
        {
          key: 'v2',
          label: 'Cart 2 Velocity',
          symbol: 'v₂',
          min: -15,
          max: 15,
          step: 1,
          defaultValue: 0,
          unit: 'm/s',
          description: 'Initial velocity of the right cart (+ is right, - is left).'
        },
        {
          key: 'elasticity',
          label: 'Elasticity (e)',
          symbol: 'e',
          min: 0.0,
          max: 1.0,
          step: 0.1,
          defaultValue: 1.0,
          unit: '',
          description: 'Coefficient of restitution (1 is perfectly elastic, 0 is completely inelastic sticking).'
        }
      ],
      formulas: [
        {
          name: 'Total Initial Momentum',
          formulaLatex: 'P_{\\text{initial}} = m_1 v_1 + m_2 v_2',
          description: 'Vector sum of momentum prior to collision.',
          formatEvaluation: (p, d) => `P_i = (${p.m1 ?? 3} · ${p.v1 ?? 8}) + (${p.m2 ?? 3} · ${p.v2 ?? 0}) = ${(d?.totalInitialMomentum ?? 0).toFixed(1)} kg·m/s`
        },
        {
          name: 'Post-Collision Velocity 1',
          formulaLatex: 'v_1\' = \\frac{m_1 - e m_2}{m_1 + m_2} v_1 + \\frac{(1+e)m_2}{m_1 + m_2} v_2',
          description: 'Final velocity of cart 1 calculated via restitution formula.',
          formatEvaluation: (p, d) => `v₁' = ${(d?.v1Final ?? 0).toFixed(2)} m/s`
        },
        {
          name: 'Post-Collision Velocity 2',
          formulaLatex: 'v_2\' = \\frac{(1+e)m_1}{m_1 + m_2} v_1 + \\frac{m_2 - e m_1}{m_1 + m_2} v_2',
          description: 'Final velocity of cart 2 calculated via restitution formula.',
          formatEvaluation: (p, d) => `v₂' = ${(d?.v2Final ?? 0).toFixed(2)} m/s`
        }
      ],
      guidedTasks: [
        {
          id: 'mech-4-t1',
          title: 'Newton’s Cradle Velocity Transfer',
          instruction: 'Set m₁ = 3 kg, v₁ = 8 m/s, m₂ = 3 kg, v₂ = 0 m/s, and elasticity e = 1.0. Observe cart 1 stopping completely (v₁\' = 0) and cart 2 launching at 8 m/s.',
          hint: 'When identical masses collide elastically, they exchange velocities completely!',
          targetMetric: 'v1Final',
          targetValue: 0.0,
          tolerance: 0.1,
          rewardXp: 30,
          rewardGeo: 15,
          checkSatisfied: (p, d) => Math.abs(p.m1 - p.m2) < 0.1 && Math.abs(p.elasticity - 1.0) < 0.05 && Math.abs(d.v1Final) <= 0.1
        },
        {
          id: 'mech-4-t2',
          title: 'Perfect Inelastic Stick',
          instruction: 'Set elasticity e = 0.0 with m₁ = 4 kg, v₁ = 6 m/s, and m₂ = 2 kg at rest. Verify both carts stick and move together at exactly 4.0 m/s.',
          hint: 'In a sticky collision, v_common = (m₁v₁ + m₂v₂) / (m₁ + m₂) = (24 + 0) / 6 = 4.0 m/s.',
          targetMetric: 'vCommon',
          targetValue: 4.0,
          tolerance: 0.2,
          rewardXp: 35,
          rewardGeo: 20,
          checkSatisfied: (p, d) => Math.abs(p.elasticity) <= 0.05 && Math.abs(d.v1Final - 4.0) <= 0.2 && Math.abs(d.v2Final - 4.0) <= 0.2
        },
        {
          id: 'mech-4-t3',
          title: 'Heavy Projectile Recoil',
          instruction: 'Set m₁ = 8 kg (heavy) colliding at 10 m/s into stationary m₂ = 2 kg (light) with e = 1.0. Watch the light cart shoot forward at 16.0 m/s!',
          hint: 'When a massive body hits a light stationary target elastically, the target can be propelled at up to nearly twice the initial speed!',
          targetMetric: 'v2Final',
          targetValue: 16.0,
          tolerance: 0.5,
          rewardXp: 40,
          rewardGeo: 25,
          checkSatisfied: (p, d) => Math.abs(d.v2Final - 16.0) <= 0.5
        }
      ],
      whatIfPrompts: [
        'Is kinetic energy conserved in every collision? No! Only in perfectly elastic collisions (e = 1). Inelastic collisions lose KE to sound, heat, and material deformation.',
        'Is total momentum always conserved? Yes! As long as external net force is zero, momentum is an invariant of nature.',
        'Why do car bumpers crumple in accidents? Crumpling increases collision duration Δt, reducing the destructive impact force F = Δp / Δt.'
      ],
      conceptTags: ['Momentum', 'Collisions', 'Elasticity', 'Impulse']
    },

    // Stage 5: Rotational Dynamics & Torque
    5: {
      id: 'mech-s5-lab',
      courseId: 'course-mechanics',
      stageNumber: 5,
      subtopicName: 'Rotational Torque, Angular Momentum & Inertia',
      modelType: 'rotational_simulation',
      title: 'Rotational Dynamics & Torque Lab',
      conceptFocus: 'Torque (τ = r·F·sinθ), Moment of Inertia (I = ½mr²), and Angular Acceleration (α = τ/I)',
      overview: 'Apply tangential forces to a rotating wheel or solid cylinder. Analyze how radius and mass distribution govern rotational resistance (moment of inertia).',
      learningGoals: [
        'Understand that torque is the rotational analog of force: τ = r × F.',
        'Observe how mass farther from the axis exponentially increases rotational inertia (I ∝ r²).',
        'Verify Newton’s 2nd Law for Rotation: τ_net = I · α and angular speed ω(t) = ω_0 + α·t.'
      ],
      parameters: [
        {
          key: 'appliedForce',
          label: 'Tangential Force',
          symbol: 'F_tan',
          min: 0,
          max: 60,
          step: 1,
          defaultValue: 20,
          unit: 'N',
          description: 'Force applied at the rim edge of the wheel.'
        },
        {
          key: 'radius',
          label: 'Disc Radius',
          symbol: 'r',
          min: 0.2,
          max: 2.0,
          step: 0.1,
          defaultValue: 0.8,
          unit: 'm',
          description: 'Radius of the rotating wheel from center to edge.'
        },
        {
          key: 'discMass',
          label: 'Disc Mass',
          symbol: 'M',
          min: 1,
          max: 20,
          step: 0.5,
          defaultValue: 5,
          unit: 'kg',
          description: 'Mass of the solid cylindrical disc.'
        },
        {
          key: 'bearingFriction',
          label: 'Friction Torque',
          symbol: 'τ_f',
          min: 0.0,
          max: 10.0,
          step: 0.5,
          defaultValue: 1.0,
          unit: 'N·m',
          description: 'Resistive frictional torque at the central axle.'
        }
      ],
      formulas: [
        {
          name: 'Moment of Inertia',
          formulaLatex: 'I = \\frac{1}{2} M r^2',
          description: 'Rotational inertia of a solid uniform cylindrical disc.',
          formatEvaluation: (p, d) => `I = 0.5 · ${p.discMass ?? 4} · (${p.radius ?? 0.6})² = ${(d?.momentOfInertia ?? 0.72).toFixed(3)} kg·m²`
        },
        {
          name: 'Applied Torque',
          formulaLatex: '\\tau = r \\cdot F_{\\text{tan}}',
          description: 'Rotational twisting effort applied at distance r.',
          formatEvaluation: (p, d) => `τ = ${p.radius ?? 0.6} · ${p.appliedForce ?? 20} = ${(d?.appliedTorque ?? 0).toFixed(2)} N·m`
        },
        {
          name: 'Angular Acceleration',
          formulaLatex: '\\alpha = \\frac{\\tau_{\\text{net}}}{I} = \\frac{r F_{\\text{tan}} - \\tau_f}{I}',
          description: 'Rate of change of angular speed over time.',
          formatEvaluation: (p, d) => `α = (${(d?.appliedTorque ?? 0).toFixed(1)} - ${p.bearingFriction ?? 1.5}) / ${(d?.momentOfInertia ?? 0.72).toFixed(3)} = ${(d?.angularAccel ?? 0).toFixed(2)} rad/s²`
        }
      ],
      guidedTasks: [
        {
          id: 'mech-5-t1',
          title: 'Angular Acceleration Target',
          instruction: 'Configure force and radius so that angular acceleration reaches exactly 10.0 rad/s² (± 0.5 rad/s²).',
          hint: 'Increase applied force or use a smaller disc radius to lower moment of inertia.',
          targetMetric: 'angularAccel',
          targetValue: 10.0,
          tolerance: 0.5,
          rewardXp: 30,
          rewardGeo: 15,
          checkSatisfied: (p, d) => Math.abs(d.angularAccel - 10.0) <= 0.5
        },
        {
          id: 'mech-5-t2',
          title: 'High Inertia Flywheel',
          instruction: 'Maximize radius to 2.0 m and mass to 15 kg to create a flywheel with Moment of Inertia I ≥ 30.0 kg·m².',
          hint: 'Flywheels store immense rotational energy because inertia scales with the square of the radius!',
          targetMetric: 'momentOfInertia',
          targetValue: 30.0,
          tolerance: 1.0,
          rewardXp: 35,
          rewardGeo: 20,
          checkSatisfied: (p, d) => d.momentOfInertia >= 29.5
        },
        {
          id: 'mech-5-t3',
          title: 'Supersonic Spin (300+ RPM)',
          instruction: 'Let the disc accelerate under net torque until angular speed exceeds 300 RPM (≈ 31.4 rad/s).',
          hint: 'Keep tangential force well above bearing friction and allow the disc to spin up.',
          targetMetric: 'rpm',
          targetValue: 300,
          tolerance: 10,
          rewardXp: 40,
          rewardGeo: 25,
          checkSatisfied: (p, d) => d.rpm >= 290
        }
      ],
      whatIfPrompts: [
        'Why does a figure skater spin much faster when pulling their arms inward? Because pulling mass closer to the axis reduces I, causing angular speed ω to increase to conserve angular momentum (L = Iω).',
        'Why does a hollow hoop roll down an incline slower than a solid cylinder? The hoop has all its mass at the outer rim, meaning higher inertia (I = mr² vs ½mr²).',
        'Why are door handles placed furthest from the hinges? Because torque τ = r·F, so larger radius r maximizes rotational leverage with minimal effort.'
      ],
      conceptTags: ['Torque', 'Rotational Inertia', 'Angular Momentum', 'RPM']
    }
  },

  // =========================================================================
  // 2. PHYSICS II — ELECTRICITY & MAGNETISM
  // =========================================================================
  'course-electromagnetism': {
    1: {
      id: 'em-s1-lab',
      courseId: 'course-electromagnetism',
      stageNumber: 1,
      subtopicName: 'Coulombic Point Charges & Fields',
      modelType: 'concept_lab',
      title: 'Coulombic Force & Electric Field Lab',
      conceptFocus: 'Coulomb’s Inverse-Square Law and Electric Field Vectors',
      overview: 'Adjust two point charges q₁ and q₂ and their separation distance r. Watch the electrostatic force vectors scale with 1/r².',
      learningGoals: [
        'Demonstrate Coulomb’s Law: F = k·|q₁·q₂| / r².',
        'Observe how like charges repel while opposite charges attract with equal and opposite action-reaction force vectors.',
        'Explore how electric field strength radiates outward from positive charges and terminates on negative charges.'
      ],
      parameters: [
        {
          key: 'charge1',
          label: 'Charge 1 (q₁)',
          symbol: 'q₁',
          min: -10,
          max: 10,
          step: 1,
          defaultValue: 4,
          unit: 'μC',
          description: 'Electrostatic charge of body 1.'
        },
        {
          key: 'charge2',
          label: 'Charge 2 (q₂)',
          symbol: 'q₂',
          min: -10,
          max: 10,
          step: 1,
          defaultValue: -4,
          unit: 'μC',
          description: 'Electrostatic charge of body 2.'
        },
        {
          key: 'distance',
          label: 'Separation Distance',
          symbol: 'r',
          min: 0.1,
          max: 2.0,
          step: 0.05,
          defaultValue: 0.5,
          unit: 'm',
          description: 'Center-to-center distance between charges.'
        }
      ],
      formulas: [
        {
          name: 'Coulomb Force',
          formulaLatex: 'F_e = \\frac{k \\cdot |q_1 q_2|}{r^2}',
          description: 'Electrostatic attractive or repulsive force magnitude.',
          formatEvaluation: (p, d) => `F = (8.99e9 · |${p.charge1 ?? 4}e-6 · ${p.charge2 ?? -4}e-6|) / (${p.distance ?? 0.5})² = ${(d?.coulombForce ?? 0).toFixed(2)} N`
        }
      ],
      guidedTasks: [
        {
          id: 'em-1-t1',
          title: 'Inverse Square Force Doubling',
          instruction: 'Halve the distance between charges from 1.0 m to 0.5 m. Observe that the electrostatic force quadruples (4x)!',
          hint: 'Because force is proportional to 1/r², cutting distance in half increases force by (1 / 0.5)² = 4.',
          targetMetric: 'distance',
          targetValue: 0.5,
          tolerance: 0.05,
          rewardXp: 30,
          rewardGeo: 15,
          checkSatisfied: (p) => Math.abs(p.distance - 0.5) <= 0.05
        }
      ],
      whatIfPrompts: [
        'What happens if both charges are positive? The force vector arrows point away from each other, representing repulsive force.',
        'Why does doubling the distance cut force to 25%? Because of the inverse-square geometric spreading of field lines.'
      ],
      conceptTags: ['Coulomb Law', 'Electric Field', 'Charges', 'Inverse Square']
    },
    2: {
      id: 'em-s2-lab',
      courseId: 'course-electromagnetism',
      stageNumber: 2,
      subtopicName: 'Gaussian Flux & Capacitor Potential',
      modelType: 'concept_lab',
      title: 'Parallel Plate Capacitor & Energy Lab',
      conceptFocus: 'Capacitance (C = ε₀A/d), Electric Field (E = V/d), and Stored Energy',
      overview: 'Adjust plate area, plate separation distance, and charging voltage. Watch electric field vectors and electrostatic energy density respond.',
      learningGoals: [
        'Demonstrate that capacitance scales directly with plate area A and inversely with separation distance d.',
        'Observe uniform electric field strength E = V / d established between the parallel conductors.',
        'Calculate stored electrostatic potential energy U = ½·C·V².'
      ],
      parameters: [
        {
          key: 'plateArea',
          label: 'Plate Area (A)',
          symbol: 'A',
          min: 0.05,
          max: 0.5,
          step: 0.05,
          defaultValue: 0.1,
          unit: 'm²',
          description: 'Surface area of each conductive plate.'
        },
        {
          key: 'separation',
          label: 'Plate Separation (d)',
          symbol: 'd',
          min: 0.001,
          max: 0.02,
          step: 0.001,
          defaultValue: 0.005,
          unit: 'm',
          description: 'Distance separating the positive and negative plates.'
        },
        {
          key: 'voltage',
          label: 'Applied Voltage',
          symbol: 'V',
          min: 10,
          max: 200,
          step: 10,
          defaultValue: 50,
          unit: 'V',
          description: 'Potential difference applied across the plates.'
        }
      ],
      formulas: [
        {
          name: 'Capacitance',
          formulaLatex: 'C = \\frac{\\varepsilon_0 A}{d}',
          description: 'Charge storage capacity per unit potential.',
          formatEvaluation: (p, d) => `C = (8.85e-12 · ${p.plateArea ?? 0.1}) / ${p.separation ?? 0.005} = ${(d?.capacitance ?? 177).toFixed(1)} pF`
        },
        {
          name: 'Electric Field Strength',
          formulaLatex: 'E = \\frac{V}{d}',
          description: 'Uniform electrostatic field between plates.',
          formatEvaluation: (p, d) => `E = ${p.voltage ?? 50} / ${p.separation ?? 0.005} = ${(d?.electricField ?? 10000).toFixed(0)} V/m`
        },
        {
          name: 'Stored Energy',
          formulaLatex: 'U = \\frac{1}{2} C V^2',
          description: 'Electrostatic energy stored in the dielectric gap.',
          formatEvaluation: (p, d) => `U = 0.5 · ${(d?.capacitance ?? 177).toFixed(1)}pF · (${p.voltage ?? 50}V)² = ${(d?.storedEnergy ?? 221).toFixed(1)} nJ`
        }
      ],
      guidedTasks: [
        {
          id: 'em-2-t1',
          title: 'High-Density Energy Storage',
          instruction: 'Narrow separation to 0.002 m with plate area 0.3 m² to boost capacitance above 1000 pF.',
          hint: 'Halving plate separation doubles capacitance!',
          targetMetric: 'capacitance',
          targetValue: 1000,
          tolerance: 100,
          rewardXp: 35,
          rewardGeo: 20,
          checkSatisfied: (p, d) => (d.capacitance ?? 0) >= 950
        }
      ],
      whatIfPrompts: [
        'Why does narrowing the gap increase capacitance? Because opposite charges attract more strongly across smaller distances, drawing more charge at the same voltage.',
        'What happens when dielectric material is inserted? Permittivity increases, multiplying capacitance by dielectric constant κ.'
      ],
      conceptTags: ['Capacitance', 'Electric Potential', 'Energy Storage', 'Dielectrics']
    },
    3: {
      id: 'em-s3-lab',
      courseId: 'course-electromagnetism',
      stageNumber: 3,
      subtopicName: 'Kirchhoff Loops & Circuit Dynamics',
      modelType: 'concept_lab',
      title: 'Ohm’s Law & DC Circuit Lab',
      conceptFocus: 'Current (I = V/R), Electrical Power (P = V·I), and Resistor Heating',
      overview: 'Adjust DC power supply voltage and circuit resistance. Watch electrical current flow and bulb filament brightness update dynamically.',
      learningGoals: [
        'Verify Ohm’s Law: current I is directly proportional to voltage V and inversely proportional to resistance R.',
        'Calculate dissipated electric power P = V·I = I²·R.',
        'Observe how high resistance limits circuit current, protecting sensitive components.'
      ],
      parameters: [
        {
          key: 'voltage',
          label: 'Supply Voltage',
          symbol: 'V',
          min: 1,
          max: 48,
          step: 1,
          defaultValue: 12,
          unit: 'V',
          description: 'DC electromotive force supplied by the battery.'
        },
        {
          key: 'resistance',
          label: 'Load Resistance',
          symbol: 'R',
          min: 2,
          max: 100,
          step: 2,
          defaultValue: 10,
          unit: 'Ω',
          description: 'Resistance of the circuit load.'
        }
      ],
      formulas: [
        {
          name: 'Ohm’s Law Current',
          formulaLatex: 'I = \\frac{V}{R}',
          description: 'Electric current flowing through the circuit loop.',
          formatEvaluation: (p, d) => `I = ${p.voltage ?? 12} / ${p.resistance ?? 10} = ${(d?.current ?? 0).toFixed(2)} A`
        },
        {
          name: 'Dissipated Power',
          formulaLatex: 'P = V \\cdot I = I^2 R',
          description: 'Rate of electrical energy converted into light and heat.',
          formatEvaluation: (p, d) => `P = ${p.voltage ?? 12} · ${(d?.current ?? 0).toFixed(2)} = ${(d?.power ?? 0).toFixed(1)} W`
        }
      ],
      guidedTasks: [
        {
          id: 'em-3-t1',
          title: 'Target Current Tuning',
          instruction: 'Tune voltage and resistance to achieve a current of exactly 2.0 Amps (± 0.1 A).',
          hint: 'If V = 24 V and R = 12 Ω, I = 24 / 12 = 2.0 A.',
          targetMetric: 'current',
          targetValue: 2.0,
          tolerance: 0.1,
          rewardXp: 30,
          rewardGeo: 15,
          checkSatisfied: (p, d) => Math.abs((d.current ?? 0) - 2.0) <= 0.1
        }
      ],
      whatIfPrompts: [
        'What happens when resistance approaches 0? Current spikes towards infinity, causing a dangerous short circuit!',
        'Why do high-voltage power transmission lines reduce power losses? Because higher voltage permits lower current for the same power, drastically reducing I²R heat losses along cables.'
      ],
      conceptTags: ['Circuits', 'Ohm Law', 'Current', 'Power']
    },
    4: {
      id: 'em-s4-lab',
      courseId: 'course-electromagnetism',
      stageNumber: 4,
      subtopicName: 'Lorentz Deflection & Magnetic Induction',
      modelType: 'lorentz_simulation',
      title: 'Magnetic Lorentz Force & Particle Deflection Lab',
      conceptFocus: 'Lorentz Force (F = qvB·sinθ), Circular Gyroradius, and Right-Hand Rule',
      overview: 'Shoot charged particles into a magnetic field B. Observe perpendicular force deflecting particles into circular orbital trajectories.',
      learningGoals: [
        'Understand magnetic force vector cross-product: F = q(v × B).',
        'Observe that magnetic fields do no work (F is perpendicular to velocity), altering trajectory direction without changing kinetic energy.',
        'Calculate orbital gyroradius r = mv / (qB).'
      ],
      parameters: [
        {
          key: 'charge',
          label: 'Particle Charge (q)',
          symbol: 'q',
          min: 1,
          max: 10,
          step: 1,
          defaultValue: 4,
          unit: 'μC',
          description: 'Charge magnitude of the traveling ion.'
        },
        {
          key: 'velocity',
          label: 'Particle Speed (v)',
          symbol: 'v',
          min: 10,
          max: 100,
          step: 5,
          defaultValue: 50,
          unit: 'm/s',
          description: 'Initial velocity entering the magnetic zone.'
        },
        {
          key: 'magneticField',
          label: 'Magnetic Field (B)',
          symbol: 'B',
          min: 0.1,
          max: 2.0,
          step: 0.1,
          defaultValue: 0.8,
          unit: 'T',
          description: 'Perpendicular magnetic flux density.'
        },
        {
          key: 'angleDeg',
          label: 'Injection Angle (θ)',
          symbol: 'θ',
          min: 0,
          max: 90,
          step: 5,
          defaultValue: 90,
          unit: '°',
          description: 'Angle between velocity vector and magnetic field.'
        }
      ],
      formulas: [
        {
          name: 'Lorentz Force',
          formulaLatex: 'F_B = q \\cdot v \\cdot B \\cdot \\sin(\\theta)',
          description: 'Deflecting magnetic force acting on moving charge.',
          formatEvaluation: (p, d) => `F = (${p.charge ?? 4}μC · ${p.velocity ?? 50}m/s · ${p.magneticField ?? 0.8}T · sin(${p.angleDeg ?? 90}°)) = ${(d?.lorentzForce ?? 160).toFixed(1)} μN`
        }
      ],
      guidedTasks: [
        {
          id: 'em-4-t1',
          title: 'Maximum Magnetic Deflection',
          instruction: 'Tune angle to 90° and increase magnetic field to 1.5 T with speed 60 m/s to achieve force > 350 μN.',
          hint: 'Perpendicular injection (sin 90° = 1.0) maximizes deflecting force!',
          targetMetric: 'lorentzForce',
          targetValue: 360,
          tolerance: 20,
          rewardXp: 35,
          rewardGeo: 20,
          checkSatisfied: (p, d) => (d.lorentzForce ?? 0) >= 340
        }
      ],
      whatIfPrompts: [
        'What happens when velocity is parallel to the magnetic field (θ = 0°)? Force drops to 0 because sin(0°) = 0; particle travels undeflected.',
        'Why does a magnetic field not change particle kinetic energy? Because force is strictly perpendicular to displacement (W = F · d = 0).'
      ],
      conceptTags: ['Lorentz Force', 'Magnetism', 'Gyroradius', 'Right Hand Rule']
    },
    5: {
      id: 'em-s5-lab',
      courseId: 'course-electromagnetism',
      stageNumber: 5,
      subtopicName: 'Maxwell Waves & Light Propagation',
      modelType: 'concept_lab',
      title: 'Electromagnetic Wave & Radiation Lab',
      conceptFocus: 'Speed of Light (c = f·λ), E and B Orthogonal Transverse Waves',
      overview: 'Adjust electromagnetic wave oscillation frequency. Observe inverse wavelength scaling keeping speed of light invariant at c = 3.0 × 10⁸ m/s.',
      learningGoals: [
        'Demonstrate the fundamental wave relationship: c = f · λ.',
        'Observe how high-frequency waves (gamma, X-ray) possess microscopic wavelengths while radio waves span meters.',
        'Visualize self-propagating mutual induction between oscillating electric and magnetic fields.'
      ],
      parameters: [
        {
          key: 'frequency',
          label: 'Frequency (f)',
          symbol: 'f',
          min: 100,
          max: 1000,
          step: 50,
          defaultValue: 500,
          unit: 'MHz',
          description: 'Oscillation frequency of the EM wavefront.'
        },
        {
          key: 'amplitude',
          label: 'Electric Amplitude (E₀)',
          symbol: 'E₀',
          min: 10,
          max: 100,
          step: 5,
          defaultValue: 50,
          unit: 'V/m',
          description: 'Peak electric field amplitude.'
        }
      ],
      formulas: [
        {
          name: 'Wavelength Relation',
          formulaLatex: '\\lambda = \\frac{c}{f}',
          description: 'Spatial distance spanned per wave cycle.',
          formatEvaluation: (p, d) => `λ = 3.00e8 / (${p.frequency ?? 500}e6 Hz) = ${(d?.wavelength ?? 0.60).toFixed(2)} m`
        },
        {
          name: 'Magnetic Wave Amplitude',
          formulaLatex: 'B_0 = \\frac{E_0}{c}',
          description: 'Peak magnetic field strength linked by speed of light.',
          formatEvaluation: (p, d) => `B₀ = (${p.amplitude ?? 50} V/m) / 3e8 = ${(d?.magneticAmplitude ?? 167).toFixed(0)} nT`
        }
      ],
      guidedTasks: [
        {
          id: 'em-5-t1',
          title: 'Gigahertz Resonance Calibration',
          instruction: 'Increase frequency to 750 MHz to compress spatial wavelength to exactly 0.40 m.',
          hint: 'λ = 300 / f_MHz: 300 / 750 = 0.40 m.',
          targetMetric: 'wavelength',
          targetValue: 0.40,
          tolerance: 0.05,
          rewardXp: 40,
          rewardGeo: 25,
          checkSatisfied: (p, d) => Math.abs((d.wavelength ?? 0) - 0.40) <= 0.05
        }
      ],
      whatIfPrompts: [
        'Why do EM waves require no physical medium to travel? Because the changing electric field induces a magnetic field and vice-versa in pure vacuum.',
        'Why does higher frequency carry higher photon energy? Because photon quantum energy E = hf scales directly with frequency.'
      ],
      conceptTags: ['Maxwell Waves', 'Wavelength', 'Frequency', 'Speed of Light']
    }
  },

  // =========================================================================
  // 3. DIFFERENTIAL & INTEGRAL CALCULUS
  // =========================================================================
  'course-calculus': {
    1: {
      id: 'calc-s1-lab',
      courseId: 'course-calculus',
      stageNumber: 1,
      subtopicName: 'Instantaneous Rates & Derivative Limits',
      modelType: 'concept_lab',
      title: 'Derivative Slope & Tangent Line Lab',
      conceptFocus: 'Instantaneous Rate of Change, Secant Lines, and the Tangent Slope Limit',
      overview: 'Slide a point along a function curve f(x). Watch the secant line snap to the tangent line as Δx approaches 0, revealing the derivative slope.',
      learningGoals: [
        'Understand that the derivative f\'(x) is the limit of average rate of change as Δx → 0.',
        'Visualize how local maxima and minima occur strictly where tangent slope is flat (f\'(x) = 0).',
        'Relate derivative slope directly to velocity in kinematics (v = dx/dt).'
      ],
      parameters: [
        {
          key: 'xCoord',
          label: 'Curve Position (x)',
          symbol: 'x',
          min: -4,
          max: 4,
          step: 0.1,
          defaultValue: 1.5,
          unit: '',
          description: 'Coordinate along function curve f(x) = x².'
        },
        {
          key: 'deltaX',
          label: 'Secant Step (Δx)',
          symbol: 'Δx',
          min: 0.01,
          max: 2.0,
          step: 0.05,
          defaultValue: 0.5,
          unit: '',
          description: 'Step size for secant slope calculation.'
        }
      ],
      formulas: [
        {
          name: 'Derivative Slope',
          formulaLatex: 'f\'(x) = \\lim_{\\Delta x \\to 0} \\frac{f(x+\\Delta x) - f(x)}{\\Delta x} = 2x',
          description: 'Instantaneous slope for parabola f(x) = x².',
          formatEvaluation: (p, d) => `f'(${(p.xCoord ?? 1.5).toFixed(1)}) = 2 · ${(p.xCoord ?? 1.5).toFixed(1)} = ${(d?.slope ?? 0).toFixed(2)}`
        }
      ],
      guidedTasks: [
        {
          id: 'calc-1-t1',
          title: 'Find the Stationary Critical Point',
          instruction: 'Move position x until tangent slope reaches exactly 0.0 (the minimum vertex of the curve).',
          hint: 'At x = 0, the derivative 2x = 0, meaning the tangent line is completely horizontal.',
          targetMetric: 'xCoord',
          targetValue: 0.0,
          tolerance: 0.05,
          rewardXp: 30,
          rewardGeo: 15,
          checkSatisfied: (p) => Math.abs(p.xCoord) <= 0.05
        }
      ],
      whatIfPrompts: [
        'What is the geometrical meaning of a negative derivative? The function is decreasing at that point.',
        'Why does a flat tangent line indicate an extremum? Because smooth functions cannot change from increasing to decreasing without passing through slope 0.'
      ],
      conceptTags: ['Calculus', 'Derivatives', 'Tangent Line', 'Rate of Change']
    },
    2: {
      id: 'calc-s2-lab',
      courseId: 'course-calculus',
      stageNumber: 2,
      subtopicName: 'Power Chains & Polynomial Derivatives',
      modelType: 'concept_lab',
      title: 'Power Rule & Derivative Chains Lab',
      conceptFocus: 'Power Rule (d/dx [axⁿ] = a·n·xⁿ⁻¹), Polynomial Slopes, and Rate Scaling',
      overview: 'Adjust coefficient a, exponent n, and curve point x. Watch the tangent line scale according to the power rule d/dx[axⁿ] = a·n·xⁿ⁻¹.',
      learningGoals: [
        'Master the fundamental Power Rule: d/dx[xⁿ] = n·xⁿ⁻¹.',
        'Observe how higher exponents produce steep accelerating curves with rapid rate increases.',
        'Contrast derivative slope of linear (n=1), quadratic (n=2), and cubic (n=3) polynomials.'
      ],
      parameters: [
        {
          key: 'coefficient',
          label: 'Coefficient (a)',
          symbol: 'a',
          min: 1,
          max: 5,
          step: 1,
          defaultValue: 2,
          unit: '',
          description: 'Amplitude multiplier of polynomial.'
        },
        {
          key: 'exponent',
          label: 'Power Exponent (n)',
          symbol: 'n',
          min: 1,
          max: 4,
          step: 1,
          defaultValue: 3,
          unit: '',
          description: 'Degree of the polynomial function.'
        },
        {
          key: 'xCoord',
          label: 'Curve Position (x)',
          symbol: 'x',
          min: -2.5,
          max: 2.5,
          step: 0.1,
          defaultValue: 1.5,
          unit: '',
          description: 'Evaluation point along the curve.'
        }
      ],
      formulas: [
        {
          name: 'Function Value',
          formulaLatex: 'f(x) = a \\cdot x^n',
          description: 'Polynomial height at x.',
          formatEvaluation: (p, d) => `f(${p.xCoord ?? 1.5}) = ${p.coefficient ?? 2} · (${p.xCoord ?? 1.5})^${p.exponent ?? 3} = ${(d?.yVal ?? 6.75).toFixed(2)}`
        },
        {
          name: 'Power Rule Derivative',
          formulaLatex: 'f\'(x) = a \\cdot n \\cdot x^{n-1}',
          description: 'Instantaneous rate of change.',
          formatEvaluation: (p, d) => `f'(${p.xCoord ?? 1.5}) = ${p.coefficient ?? 2} · ${p.exponent ?? 3} · (${p.xCoord ?? 1.5})^${(p.exponent ?? 3) - 1} = ${(d?.slope ?? 13.5).toFixed(2)}`
        }
      ],
      guidedTasks: [
        {
          id: 'calc-2-t1',
          title: 'Steep Tangent Challenge',
          instruction: 'Set coefficient a = 3 and exponent n = 3 at x = 2.0 to attain derivative slope f\'(x) = 36.0.',
          hint: 'f\'(x) = 3 · 3 · 2² = 9 · 4 = 36.',
          targetMetric: 'slope',
          targetValue: 36.0,
          tolerance: 0.5,
          rewardXp: 35,
          rewardGeo: 20,
          checkSatisfied: (p, d) => Math.abs((d.slope ?? 0) - 36.0) <= 0.5
        }
      ],
      whatIfPrompts: [
        'What happens when exponent n = 1? The derivative becomes constant f\'(x) = a, meaning the slope is uniform everywhere (a straight line).',
        'Why does a negative coordinate produce a positive slope for odd powers? Because x² is always positive, so f\'(x) = 3x² ≥ 0 everywhere.'
      ],
      conceptTags: ['Power Rule', 'Polynomials', 'Derivative Chains']
    },
    3: {
      id: 'calc-s3-lab',
      courseId: 'course-calculus',
      stageNumber: 3,
      subtopicName: 'Concavity & Critical Extrema',
      modelType: 'concept_lab',
      title: 'Concavity, Inflection & Critical Extrema Lab',
      conceptFocus: 'Critical Points (f\'=0), Second Derivative Concavity (f\'\' > 0 / f\'\' < 0), and Inflection',
      overview: 'Explore the cubic polynomial f(x) = ⅓kx³ - kx. Slide x to discover stationary points where slope is 0, and witness concavity flipping at inflection point x = 0.',
      learningGoals: [
        'Identify local extrema where the first derivative equals zero (f\'(x) = 0).',
        'Use the Second Derivative Test: f\'\'(x) > 0 indicates concave up (local minimum), f\'\'(x) < 0 indicates concave down (local maximum).',
        'Visualize inflection points where curvature changes sign.'
      ],
      parameters: [
        {
          key: 'xCoord',
          label: 'Position (x)',
          symbol: 'x',
          min: -2.5,
          max: 2.5,
          step: 0.1,
          defaultValue: 1.0,
          unit: '',
          description: 'Position along the cubic curve.'
        },
        {
          key: 'scaleParam',
          label: 'Curve Scale (k)',
          symbol: 'k',
          min: 0.5,
          max: 2.0,
          step: 0.5,
          defaultValue: 1.0,
          unit: '',
          description: 'Amplitude scaling factor.'
        }
      ],
      formulas: [
        {
          name: 'First Derivative (Slope)',
          formulaLatex: 'f\'(x) = k(x^2 - 1)',
          description: 'Tangent slope (zeros at x = ±1).',
          formatEvaluation: (p, d) => `f'(${p.xCoord ?? 1.0}) = ${p.scaleParam ?? 1.0}((${p.xCoord ?? 1.0})² - 1) = ${(d?.slope ?? 0).toFixed(2)}`
        },
        {
          name: 'Second Derivative (Concavity)',
          formulaLatex: 'f\'\'(x) = 2k x',
          description: 'Rate of change of slope (inflection at x = 0).',
          formatEvaluation: (p, d) => `f''(${p.xCoord ?? 1.0}) = 2 · ${p.scaleParam ?? 1.0} · ${p.xCoord ?? 1.0} = ${(d?.secondDerivative ?? 2.0).toFixed(2)}`
        }
      ],
      guidedTasks: [
        {
          id: 'calc-3-t1',
          title: 'Find the Local Minimum',
          instruction: 'Slide x to exactly +1.0 where f\'(x) = 0 and f\'\'(x) > 0, identifying the stable local minimum vertex.',
          hint: 'At x = 1, (1² - 1) = 0, so tangent slope is completely flat!',
          targetMetric: 'xCoord',
          targetValue: 1.0,
          tolerance: 0.05,
          rewardXp: 35,
          rewardGeo: 20,
          checkSatisfied: (p) => Math.abs((p.xCoord ?? 0) - 1.0) <= 0.05
        }
      ],
      whatIfPrompts: [
        'Why does f\'\'(0) = 0 mark an inflection point? Because concavity changes from negative (frown) to positive (smile) as x crosses 0.',
        'Why does a horizontal tangent not guarantee an extremum? Functions like y = x³ have f\'(0) = 0 but continue increasing (saddle point).'
      ],
      conceptTags: ['Concavity', 'Second Derivative', 'Critical Points', 'Optimization']
    },
    4: {
      id: 'calc-s4-lab',
      courseId: 'course-calculus',
      stageNumber: 4,
      subtopicName: 'Riemann Accumulation & Integrals',
      modelType: 'concept_lab',
      title: 'Riemann Sums & Definite Integrals Lab',
      conceptFocus: 'Riemann Rectangles, Area Under Curve, and the Fundamental Theorem of Calculus',
      overview: 'Partition the interval [0, b] under f(x) = x² into N discrete rectangles. Watch the Riemann sum converge to the exact integral ∫ x² dx = b³/3 as N increases.',
      learningGoals: [
        'Visualize definite integration as the infinite accumulation of infinitesimal slices: ∫ f(x) dx = lim(N→∞) Σ f(xᵢ)Δx.',
        'Observe how increasing partition count N shrinks approximation error towards 0.',
        'Apply the Fundamental Theorem of Calculus: ∫₀ᵇ x² dx = [x³/3]₀ᵇ = b³/3.'
      ],
      parameters: [
        {
          key: 'upperLimit',
          label: 'Upper Bound (b)',
          symbol: 'b',
          min: 1.0,
          max: 4.0,
          step: 0.5,
          defaultValue: 3.0,
          unit: '',
          description: 'Upper limit of definite integration.'
        },
        {
          key: 'partitionCount',
          label: 'Rectangles (N)',
          symbol: 'N',
          min: 2,
          max: 20,
          step: 1,
          defaultValue: 6,
          unit: 'slices',
          description: 'Number of Riemann partition subintervals.'
        }
      ],
      formulas: [
        {
          name: 'Subinterval Width',
          formulaLatex: '\\Delta x = \\frac{b}{N}',
          description: 'Width of each rectangle slice.',
          formatEvaluation: (p, d) => `Δx = ${p.upperLimit ?? 3.0} / ${p.partitionCount ?? 6} = ${(d?.deltaX ?? 0.50).toFixed(2)}`
        },
        {
          name: 'Riemann Sum Area',
          formulaLatex: 'A_{\\text{approx}} = \\sum_{i=1}^N f(x_i) \\Delta x',
          description: 'Total area of N rectangular slices.',
          formatEvaluation: (p, d) => `Σ f(xᵢ)Δx = ${(d?.riemannSum ?? 11.38).toFixed(2)} units²`
        },
        {
          name: 'Exact Definite Integral',
          formulaLatex: '\\int_0^b x^2 dx = \\frac{b^3}{3}',
          description: 'Exact analytical continuous area.',
          formatEvaluation: (p, d) => `∫₀^${p.upperLimit ?? 3} x² dx = (${p.upperLimit ?? 3})³ / 3 = ${(d?.exactIntegral ?? 9.00).toFixed(2)} units²`
        }
      ],
      guidedTasks: [
        {
          id: 'calc-4-t1',
          title: 'Integral Convergence Challenge',
          instruction: 'Set upper bound b = 3.0 and increase rectangles N to 15 or higher to bring Riemann approximation within 1.0 unit of the exact area (9.00).',
          hint: 'More rectangles drastically reduce the excess triangular overhang!',
          targetMetric: 'partitionCount',
          targetValue: 15,
          tolerance: 2,
          rewardXp: 40,
          rewardGeo: 25,
          checkSatisfied: (p, d) => (p.partitionCount ?? 0) >= 14 && Math.abs((d.exactIntegral ?? 9) - 9.00) <= 0.1
        }
      ],
      whatIfPrompts: [
        'What is the geometrical meaning of integration? Accumulating continuous signed area between the function and the horizontal axis.',
        'Why does a right-Riemann sum overestimate an increasing function? Because the rectangle height is chosen at the rightmost (highest) edge of each subinterval.'
      ],
      conceptTags: ['Riemann Sums', 'Definite Integrals', 'Fundamental Theorem', 'Area Under Curve']
    },
    5: {
      id: 'calc-s5-lab',
      courseId: 'course-calculus',
      stageNumber: 5,
      subtopicName: 'Differential Equations & Exponential Growth',
      modelType: 'concept_lab',
      title: 'Differential Equations & Exponential Growth Lab',
      conceptFocus: 'Separable Differential Equations (dy/dt = ky) and Continuous Compound Growth (y = y₀eᵏᵗ)',
      overview: 'Adjust growth rate constant k, initial amount y₀, and time t. Observe how rate of change dy/dt scales proportionally with current magnitude.',
      learningGoals: [
        'Solve the first-order differential equation dy/dt = k·y by separating variables: ∫ dy/y = ∫ k dt.',
        'Demonstrate that natural exponential eᵏᵗ is the unique function whose derivative is proportional to itself.',
        'Calculate doubling time T = ln(2) / k.'
      ],
      parameters: [
        {
          key: 'growthRate',
          label: 'Growth Constant (k)',
          symbol: 'k',
          min: 0.1,
          max: 1.0,
          step: 0.05,
          defaultValue: 0.4,
          unit: '1/s',
          description: 'Proportionality rate of growth.'
        },
        {
          key: 'initialAmount',
          label: 'Initial Value (y₀)',
          symbol: 'y₀',
          min: 5,
          max: 50,
          step: 5,
          defaultValue: 10,
          unit: '',
          description: 'Starting population or quantity at t = 0.'
        },
        {
          key: 'timeElapsed',
          label: 'Time Elapsed (t)',
          symbol: 't',
          min: 1,
          max: 10,
          step: 0.5,
          defaultValue: 4,
          unit: 's',
          description: 'Time parameter along the response curve.'
        }
      ],
      formulas: [
        {
          name: 'Instantaneous Rate of Growth',
          formulaLatex: '\\frac{dy}{dt} = k \\cdot y',
          description: 'Growth speed proportional to current size.',
          formatEvaluation: (p, d) => `dy/dt = ${p.growthRate ?? 0.4} · ${(d?.currentValue ?? 49.5).toFixed(1)} = ${(d?.growthRateVal ?? 19.8).toFixed(1)} /s`
        },
        {
          name: 'Exponential Solution',
          formulaLatex: 'y(t) = y_0 \\cdot e^{kt}',
          description: 'Continuous accumulated magnitude.',
          formatEvaluation: (p, d) => `y(${p.timeElapsed ?? 4}) = ${p.initialAmount ?? 10} · e^(${p.growthRate ?? 0.4} · ${p.timeElapsed ?? 4}) = ${(d?.currentValue ?? 49.5).toFixed(1)}`
        }
      ],
      guidedTasks: [
        {
          id: 'calc-5-t1',
          title: 'Century Threshold Explosion',
          instruction: 'Tune rate k and time t so that accumulated quantity y(t) exceeds 100.0.',
          hint: 'With y₀ = 10, setting k = 0.5 and t = 5 yields y = 10 · e^2.5 ≈ 121.8!',
          targetMetric: 'currentValue',
          targetValue: 120,
          tolerance: 20,
          rewardXp: 40,
          rewardGeo: 25,
          checkSatisfied: (p, d) => (d.currentValue ?? 0) >= 100.0
        }
      ],
      whatIfPrompts: [
        'What happens when k is negative (k < 0)? The system models exponential radioactive decay or thermal cooling where y approaches 0 asymptotically.',
        'Why does compound interest involve e? Because continuous compounding at annual rate r limits to lim(n→∞) (1 + r/n)ⁿᵗ = eʳᵗ.'
      ],
      conceptTags: ['Differential Equations', 'Exponential Growth', 'Euler Number e', 'Calculus Synthesis']
    }
  },

  // =========================================================================
  // 4. COMPUTER SCIENCE & ALGORITHMICS
  // =========================================================================
  'course-cs': {
    1: {
      id: 'cs-s1-lab',
      courseId: 'course-cs',
      stageNumber: 1,
      subtopicName: 'Asymptotic Complexity & Big-O Scaling',
      modelType: 'concept_lab',
      title: 'Big-O Growth Rates & Scaling Lab',
      conceptFocus: 'Orders of Growth: O(1), O(log N), O(N), O(N log N), O(N²)',
      overview: 'Adjust input size N. Observe operation counts explode exponentially for O(N²) while logarithmic algorithms O(log N) remain nearly instant.',
      learningGoals: [
        'Understand worst-case upper bound asymptotic complexity (Big-O).',
        'Compare operation scaling: when N = 1000, O(log₂ N) is only ~10 operations while O(N²) requires 1,000,000 operations!',
        'Appreciate why polynomial time algorithms are critical in production software.'
      ],
      parameters: [
        {
          key: 'inputSize',
          label: 'Input Size (N)',
          symbol: 'N',
          min: 10,
          max: 1000,
          step: 50,
          defaultValue: 100,
          unit: 'items',
          description: 'Problem size being processed by the algorithm.'
        },
        {
          key: 'constantFactor',
          label: 'Constant Factor (c)',
          symbol: 'c',
          min: 1,
          max: 10,
          step: 1,
          defaultValue: 1,
          unit: 'x',
          description: 'Instruction constant multiplier per cycle.'
        }
      ],
      formulas: [
        {
          name: 'Logarithmic Operations',
          formulaLatex: 'T_{\\text{log}} = \\lceil \\log_2(N) \\rceil',
          description: 'Binary search / divide and conquer.',
          formatEvaluation: (p, d) => `O(log₂ ${p.inputSize ?? 100}) = ${(d?.opsLogN ?? 7).toFixed(0)} operations`
        },
        {
          name: 'Linear Operations',
          formulaLatex: 'T_{\\text{linear}} = N',
          description: 'Single pass iterative scan.',
          formatEvaluation: (p, d) => `O(${p.inputSize ?? 100}) = ${(d?.opsN ?? 100).toFixed(0)} operations`
        },
        {
          name: 'Quadratic Operations',
          formulaLatex: 'T_{\\text{quad}} = N^2',
          description: 'Nested loops / brute force comparison.',
          formatEvaluation: (p, d) => `O((${p.inputSize ?? 100})²) = ${(d?.opsNSquared ?? 10000).toFixed(0)} operations`
        }
      ],
      guidedTasks: [
        {
          id: 'cs-1-t1',
          title: 'Algorithmic Divergence Observation',
          instruction: 'Increase input size N to 500. Observe that quadratic operations reach 250,000 while logarithmic search needs only 9 steps!',
          hint: 'Notice the enormous 27,000x speedup between O(log N) and O(N²)!',
          targetMetric: 'inputSize',
          targetValue: 500,
          tolerance: 50,
          rewardXp: 30,
          rewardGeo: 15,
          checkSatisfied: (p) => (p.inputSize ?? 0) >= 450
        }
      ],
      whatIfPrompts: [
        'Why does O(log N) scale so gracefully? Because each step cuts the remaining search space in half (2¹⁰ ≈ 1,000, 2²⁰ ≈ 1,000,000).',
        'Why does Big-O ignore constant factors and lower-order terms? Because as N grows towards infinity, the highest-order term completely dominates execution time.'
      ],
      conceptTags: ['Big-O', 'Asymptotic Complexity', 'Algorithms', 'Efficiency']
    },
    2: {
      id: 'cs-s2-lab',
      courseId: 'course-cs',
      stageNumber: 2,
      subtopicName: 'Call Stack Frames & Scope Chains',
      modelType: 'concept_lab',
      title: 'Call Stack & Recursion Depth Lab',
      conceptFocus: 'Call Stack Frames, LIFO (Last In First Out), and Recursion Depth Limits',
      overview: 'Push and pop execution frames onto an interactive call stack. Adjust recursion depth to visualize stack overflow boundaries.',
      learningGoals: [
        'Visualize how execution context frames are allocated in memory upon function invocation.',
        'Understand base cases in recursive algorithms that prevent maximum call stack exceeded exceptions.',
        'Contrast memory consumption of iterative algorithms O(1) vs recursive call stacks O(N).'
      ],
      parameters: [
        {
          key: 'recursionDepth',
          label: 'Recursion Depth (N)',
          symbol: 'N',
          min: 1,
          max: 20,
          step: 1,
          defaultValue: 5,
          unit: 'frames',
          description: 'Number of nested recursive function invocations.'
        },
        {
          key: 'frameMemory',
          label: 'Frame Size',
          symbol: 'S',
          min: 16,
          max: 128,
          step: 16,
          defaultValue: 32,
          unit: 'KB',
          description: 'Stack memory allocated per execution context.'
        }
      ],
      formulas: [
        {
          name: 'Total Stack Memory',
          formulaLatex: 'M_{\\text{stack}} = N \\cdot S',
          description: 'Total memory consumed by active stack frames.',
          formatEvaluation: (p, d) => `M = ${p.recursionDepth ?? 5} frames · ${p.frameMemory ?? 32} KB = ${(d?.totalStackMemory ?? 0).toFixed(0)} KB`
        }
      ],
      guidedTasks: [
        {
          id: 'cs-2-t1',
          title: 'Stack Memory Calibration',
          instruction: 'Adjust depth and frame size until total stack memory reaches exactly 256 KB.',
          hint: 'Try N = 8 frames with 32 KB per frame: 8 · 32 = 256 KB.',
          targetMetric: 'totalStackMemory',
          targetValue: 256,
          tolerance: 5,
          rewardXp: 30,
          rewardGeo: 15,
          checkSatisfied: (p, d) => Math.abs((d.totalStackMemory ?? 0) - 256) <= 5
        }
      ],
      whatIfPrompts: [
        'What causes a Stack Overflow error? Calling a function without reaching a valid base case until stack memory is exhausted.',
        'How does tail-call optimization solve this? By reusing the current stack frame instead of allocating a new frame!'
      ],
      conceptTags: ['Computer Science', 'Call Stack', 'Recursion', 'Memory']
    },
    3: {
      id: 'cs-s3-lab',
      courseId: 'course-cs',
      stageNumber: 3,
      subtopicName: 'Binary Search Trees & Logarithmic Depth',
      modelType: 'concept_lab',
      title: 'Binary Search Tree & Depth Lab',
      conceptFocus: 'Tree Height H = ⌈log₂(N+1)⌉, Search Steps, and Invariant Ordering',
      overview: 'Insert nodes into a balanced binary search tree. Watch tree height grow logarithmically, bounding search comparisons to O(log N).',
      learningGoals: [
        'Understand the Binary Search Tree invariant: left child < parent < right child.',
        'Calculate tree height H = ⌈log₂(N + 1)⌉ for a perfectly balanced tree.',
        'Observe how unbalanced degenerate trees degrade to O(N) linked lists.'
      ],
      parameters: [
        {
          key: 'treeNodes',
          label: 'Total Nodes (N)',
          symbol: 'N',
          min: 8,
          max: 1024,
          step: 8,
          defaultValue: 64,
          unit: 'nodes',
          description: 'Total items stored in the binary search tree.'
        },
        {
          key: 'branchFactor',
          label: 'Branch Factor (b)',
          symbol: 'b',
          min: 2,
          max: 4,
          step: 1,
          defaultValue: 2,
          unit: 'ways',
          description: 'Branching degree per node (2 for standard BST).'
        }
      ],
      formulas: [
        {
          name: 'Balanced Tree Height',
          formulaLatex: 'H = \\lceil \\log_2(N + 1) \\rceil',
          description: 'Maximum levels from root to leaf.',
          formatEvaluation: (p, d) => `H = ⌈log₂(${p.treeNodes ?? 64} + 1)⌉ = ${(d?.treeHeight ?? 6).toFixed(0)} levels`
        },
        {
          name: 'Worst-Case Search Comparisons',
          formulaLatex: 'T_{\\text{search}} = H',
          description: 'Maximum branch decisions needed to find an element.',
          formatEvaluation: (p, d) => `Max Search = ${(d?.treeHeight ?? 6).toFixed(0)} comparisons`
        }
      ],
      guidedTasks: [
        {
          id: 'cs-3-t1',
          title: 'Thousand-Node Logarithmic Bound',
          instruction: 'Increase tree nodes N to 512 to observe that search comparisons remain capped at only 10 steps.',
          hint: '2⁹ = 512, so height is exactly 10 levels!',
          targetMetric: 'treeNodes',
          targetValue: 512,
          tolerance: 32,
          rewardXp: 35,
          rewardGeo: 20,
          checkSatisfied: (p) => (p.treeNodes ?? 0) >= 480
        }
      ],
      whatIfPrompts: [
        'Why do self-balancing trees (AVL / Red-Black) perform rotations? To prevent unbalanced insertion sequences from degrading search to O(N).',
        'What is an in-order traversal of a BST? Visiting left subtree, node, then right subtree yields values in strictly ascending sorted order.'
      ],
      conceptTags: ['Binary Search Tree', 'Logarithmic Height', 'Data Structures']
    },
    4: {
      id: 'cs-s4-lab',
      courseId: 'course-cs',
      stageNumber: 4,
      subtopicName: 'Dynamic Programming & Memoization',
      modelType: 'concept_lab',
      title: 'Dynamic Programming & Cache Speedup Lab',
      conceptFocus: 'Overlapping Subproblems, Memoization Table, and Exponential to Linear Reduction',
      overview: 'Compute Fibonacci numbers using naive recursion vs memoization. See naive recursive calls explode exponentially (2ᴺ) while DP stores results in linear O(N) operations.',
      learningGoals: [
        'Identify overlapping subproblems that cause exponential redundant computations in naive recursion.',
        'Visualize how memoization caches previously solved subproblem solutions.',
        'Observe dramatic speedup: for N = 20, naive recursion executes 1,048,576 calls while DP requires only 39 calls!'
      ],
      parameters: [
        {
          key: 'problemSize',
          label: 'Problem Size (N)',
          symbol: 'N',
          min: 5,
          max: 25,
          step: 1,
          defaultValue: 12,
          unit: '',
          description: 'Target Fibonacci index or subproblem dimension.'
        },
        {
          key: 'subproblemBranch',
          label: 'Branching Calls',
          symbol: 'k',
          min: 2,
          max: 3,
          step: 1,
          defaultValue: 2,
          unit: 'calls',
          description: 'Number of recursive subproblem calls per frame.'
        }
      ],
      formulas: [
        {
          name: 'Naive Recursive Calls',
          formulaLatex: 'T_{\\text{naive}} \\approx 2^N',
          description: 'Exponential calls without caching.',
          formatEvaluation: (p, d) => `2^${p.problemSize ?? 12} = ${(d?.naiveCalls ?? 4096).toFixed(0)} calls`
        },
        {
          name: 'Memoized DP Operations',
          formulaLatex: 'T_{\\text{memo}} = 2N - 1',
          description: 'Linear operations with memoization cache.',
          formatEvaluation: (p, d) => `2(${p.problemSize ?? 12}) - 1 = ${(d?.memoCalls ?? 23).toFixed(0)} calls`
        },
        {
          name: 'Speedup Factor',
          formulaLatex: 'S = \\frac{2^N}{2N - 1}',
          description: 'Performance multiplier from caching.',
          formatEvaluation: (p, d) => `Speedup = ${(d?.speedupFactor ?? 178).toFixed(0)}x faster`
        }
      ],
      guidedTasks: [
        {
          id: 'cs-4-t1',
          title: 'Thousand-Fold Speedup Discovery',
          instruction: 'Increase problem size N to 16 to observe a speedup factor exceeding 2000x.',
          hint: 'For N = 16: 2¹⁶ = 65,536 calls vs 31 DP calls = 2114x faster!',
          targetMetric: 'problemSize',
          targetValue: 16,
          tolerance: 1,
          rewardXp: 35,
          rewardGeo: 20,
          checkSatisfied: (p) => (p.problemSize ?? 0) >= 16
        }
      ],
      whatIfPrompts: [
        'When is a problem suitable for Dynamic Programming? When it has both Optimal Substructure and Overlapping Subproblems.',
        'What is the difference between top-down memoization and bottom-up tabulation? Top-down uses recursion + cache; bottom-up iteratively fills a table without call stack overhead.'
      ],
      conceptTags: ['Dynamic Programming', 'Memoization', 'Overlapping Subproblems', 'Cache']
    },
    5: {
      id: 'cs-s5-lab',
      courseId: 'course-cs',
      stageNumber: 5,
      subtopicName: 'Space-Time Complexity Tradeoffs',
      modelType: 'concept_lab',
      title: 'Space-Time Complexity & Throughput Lab',
      conceptFocus: 'Memory vs Latency Tradeoff, Buffer Caching, and Disk I/O Bottlenecks',
      overview: 'Adjust RAM cache buffer size and batch processing factor. Observe how trading memory for precomputed cache reduces disk I/O latency to near zero.',
      learningGoals: [
        'Understand the fundamental Space-Time tradeoff: using more memory can drastically reduce processing time.',
        'Observe how hash tables trade O(N) additional space for O(1) instantaneous lookup speed.',
        'Analyze throughput curves as RAM buffer sizes scale.'
      ],
      parameters: [
        {
          key: 'bufferSize',
          label: 'RAM Cache Buffer',
          symbol: 'B',
          min: 16,
          max: 512,
          step: 16,
          defaultValue: 64,
          unit: 'MB',
          description: 'Memory allocated for intermediate result caching.'
        },
        {
          key: 'batchSize',
          label: 'Batch Chunk',
          symbol: 'K',
          min: 50,
          max: 1000,
          step: 50,
          defaultValue: 200,
          unit: 'items',
          description: 'Chunk size processed per I/O cycle.'
        }
      ],
      formulas: [
        {
          name: 'I/O Latency',
          formulaLatex: 'L = \\frac{1000}{B}',
          description: 'Query latency with memory caching.',
          formatEvaluation: (p, d) => `L = 1000 / ${p.bufferSize ?? 64} = ${(d?.ioLatency ?? 15.6).toFixed(1)} ms`
        },
        {
          name: 'Processing Throughput',
          formulaLatex: 'T = K \\cdot \\frac{B}{10}',
          description: 'Overall system throughput.',
          formatEvaluation: (p, d) => `Throughput = ${p.batchSize ?? 200} · (${p.bufferSize ?? 64} / 10) = ${(d?.throughput ?? 1280).toFixed(0)} req/s`
        }
      ],
      guidedTasks: [
        {
          id: 'cs-5-t1',
          title: 'Sub-5ms Latency Tuning',
          instruction: 'Allocate at least 256 MB of cache buffer to reduce latency below 4.0 ms.',
          hint: 'L = 1000 / 256 ≈ 3.9 ms!',
          targetMetric: 'bufferSize',
          targetValue: 256,
          tolerance: 16,
          rewardXp: 40,
          rewardGeo: 25,
          checkSatisfied: (p) => (p.bufferSize ?? 0) >= 250
        }
      ],
      whatIfPrompts: [
        'Why can’t we just cache everything in RAM? Because RAM is finite and expensive; cache eviction policies (LRU, LFU) must discard stale entries.',
        'Why do database indexes consume so much disk space? B-Trees trade significant extra storage to enable O(log N) indexed queries instead of full table scans.'
      ],
      conceptTags: ['Space-Time Tradeoff', 'Cache', 'Latency', 'System Design']
    }
  }
};

/**
 * Resolves a practical model configuration for any course and stage number.
 * If not explicitly registered, creates an intelligent, safe fallback configuration.
 */
export function getPracticalModelConfig(courseId: string, stageNumber: number): PracticalModelConfig {
  const courseCatalog = PRACTICAL_MODELS_CATALOG[courseId];
  if (courseCatalog && courseCatalog[stageNumber]) {
    return courseCatalog[stageNumber];
  }

  // Fallback: If mechanics, default to kinematics or force simulation
  if (courseId === 'course-mechanics') {
    return PRACTICAL_MODELS_CATALOG['course-mechanics'][1];
  }

  // Generic universal fallback
  return {
    id: `${courseId}-s${stageNumber}-lab`,
    courseId,
    stageNumber,
    subtopicName: `Stage ${stageNumber} Practical Model`,
    modelType: 'concept_lab',
    title: `Stage ${stageNumber} Interactive Concept Lab`,
    conceptFocus: 'Interactive Parameter Tuning & Conceptual Modeling',
    overview: 'Explore mathematical relationships and dynamic response variables for this subtopic.',
    learningGoals: [
      'Investigate parameter variations and physical or mathematical cause-and-effect.',
      'Analyze substituted formula cards with real-time numeric evaluations.'
    ],
    parameters: [
      {
        key: 'paramA',
        label: 'Primary Variable (A)',
        symbol: 'A',
        min: 1,
        max: 50,
        step: 1,
        defaultValue: 20,
        unit: 'units',
        description: 'Input parameter A.'
      },
      {
        key: 'paramB',
        label: 'Secondary Variable (B)',
        symbol: 'B',
        min: 1,
        max: 20,
        step: 0.5,
        defaultValue: 5,
        unit: 'units',
        description: 'Input parameter B.'
      }
    ],
    formulas: [
      {
        name: 'Proportional Relation',
        formulaLatex: 'Y = A \\cdot B',
        description: 'Product response function.',
        formatEvaluation: (p, d) => `Y = ${p.paramA ?? 10} · ${p.paramB ?? 5} = ${(d?.result ?? 0).toFixed(2)}`
      }
    ],
    guidedTasks: [
      {
        id: 'generic-t1',
        title: 'Calibrate Response',
        instruction: 'Adjust parameters so output product Y reaches 100.',
        hint: 'Set A = 20 and B = 5: 20 · 5 = 100.',
        targetMetric: 'result',
        targetValue: 100,
        tolerance: 2,
        rewardXp: 25,
        rewardGeo: 15,
        checkSatisfied: (p, d) => Math.abs(d.result - 100) <= 2
      }
    ],
    whatIfPrompts: [
      'What happens when parameter A doubles while B is halved? The product remains constant.'
    ],
    conceptTags: ['Interactive Simulation', 'Parameters', 'STEM']
  };
}
