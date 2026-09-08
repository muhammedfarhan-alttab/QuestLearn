export interface CourseQuestion {
  id: string;
  courseId: string;
  stageNumber: number;
  subtopicName: string;
  question: string;
  options: string[];
  answer: number; // 0 to 3
  explanation: string;
  difficulty: 'easy' | 'intermediate' | 'hard';
  rewardXp: number;
  rewardGeo: number;
}

export const COURSE_STAGE_QUESTIONS: Record<string, Record<number, CourseQuestion[]>> = {
  // =========================================================================
  // 1. PHYSICS I — CLASSICAL MECHANICS
  // =========================================================================
  'course-mechanics': {
    // Stage 1: Vector Displacement, Kinematics & 2D Projectiles
    1: [
      {
        id: 'mech-s1-q1',
        courseId: 'course-mechanics',
        stageNumber: 1,
        subtopicName: 'Vector Displacement & Kinematics',
        question: 'A projectile is launched with an initial speed v₀ at an angle of 30° above the horizontal. Neglecting air resistance, what is its acceleration at the highest point of its trajectory?',
        options: ['g downwards', '0', 'g cos(30°) perpendicular to velocity', 'g sin(30°) along trajectory'],
        answer: 0,
        explanation: 'Gravity is the sole acceleration acting throughout the entire trajectory, always pointing downwards with magnitude g = 9.8 m/s².',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      },
      {
        id: 'mech-s1-q2',
        courseId: 'course-mechanics',
        stageNumber: 1,
        subtopicName: 'Vector Displacement & Kinematics',
        question: 'A car accelerates uniformly from rest to 24 m/s in 6.0 seconds. What total distance does it cover during this interval?',
        options: ['72 meters', '144 meters', '36 meters', '48 meters'],
        answer: 0,
        explanation: 'Average velocity v_avg = (0 + 24) / 2 = 12 m/s. Total distance Δx = v_avg × t = 12 m/s × 6.0 s = 72 meters.',
        difficulty: 'easy',
        rewardXp: 55,
        rewardGeo: 30
      },
      {
        id: 'mech-s1-q3',
        courseId: 'course-mechanics',
        stageNumber: 1,
        subtopicName: 'Vector Displacement & Kinematics',
        question: 'A rock is dropped from rest off a cliff and hits the ground after 4.0 seconds (g = 9.8 m/s²). What is the height of the cliff?',
        options: ['78.4 m', '39.2 m', '156.8 m', '19.6 m'],
        answer: 0,
        explanation: 'Using Δy = ½ g t² = 0.5 × 9.8 × (4.0)² = 4.9 × 16 = 78.4 meters.',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 35
      },
      {
        id: 'mech-s1-q4',
        courseId: 'course-mechanics',
        stageNumber: 1,
        subtopicName: 'Vector Displacement & Kinematics',
        question: 'If vector A = 3î + 4ĵ and vector B = -3î + 8ĵ, what is the magnitude of the resultant vector R = A + B?',
        options: ['12 units', '13 units', '15 units', '7 units'],
        answer: 0,
        explanation: 'R = (3 - 3)î + (4 + 8)ĵ = 0î + 12ĵ. The magnitude is √(0² + 12²) = 12 units.',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 40
      }
    ],

    // Stage 2: Newton's Laws & Friction
    2: [
      {
        id: 'mech-s2-q1',
        courseId: 'course-mechanics',
        stageNumber: 2,
        subtopicName: 'Newtonian Force & Friction',
        question: 'A 5.0 kg crate is pushed across a horizontal floor with a horizontal force of 30 N. If the coefficient of kinetic friction μₖ = 0.40 and g = 9.8 m/s², what is the net acceleration?',
        options: ['2.08 m/s²', '6.00 m/s²', '3.92 m/s²', '1.20 m/s²'],
        answer: 0,
        explanation: 'Frictional force f_k = μ_k · m · g = 0.40 × 5.0 × 9.8 = 19.6 N. Net force F_net = 30 - 19.6 = 10.4 N. Acceleration a = F_net / m = 10.4 / 5.0 = 2.08 m/s².',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 30
      },
      {
        id: 'mech-s2-q2',
        courseId: 'course-mechanics',
        stageNumber: 2,
        subtopicName: 'Newtonian Force & Friction',
        question: 'An elevator of mass 1000 kg accelerates upwards at 2.0 m/s² (g = 9.8 m/s²). What is the tension in the supporting cable?',
        options: ['11,800 N', '7,800 N', '9,800 N', '2,000 N'],
        answer: 0,
        explanation: 'T - mg = ma => T = m(g + a) = 1000(9.8 + 2.0) = 1000(11.8) = 11,800 N.',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 35
      },
      {
        id: 'mech-s2-q3',
        courseId: 'course-mechanics',
        stageNumber: 2,
        subtopicName: 'Newtonian Force & Friction',
        question: 'According to Newton’s Third Law, if a horse pulls a cart forward with force F, why does the cart accelerate forward?',
        options: [
          'The ground exerts a forward reaction force on the horse greater than the ground’s backward force on the cart.',
          'The horse’s pull on the cart is slightly greater than the cart’s reaction pull on the horse.',
          'The cart has lower inertia than the horse, cancelling the third-law force.',
          'Newton’s third law only applies when systems are in static equilibrium.'
        ],
        answer: 0,
        explanation: 'The action-reaction pair between horse and cart act on DIFFERENT objects. Acceleration of the system is determined by the external forces from the ground acting on the horse and cart.',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 40
      },
      {
        id: 'mech-s2-q4',
        courseId: 'course-mechanics',
        stageNumber: 2,
        subtopicName: 'Newtonian Force & Friction',
        question: 'A car negotiates an unbanked circular curve of radius 50 m on a wet road where μₛ = 0.20 (g = 9.8 m/s²). What is the maximum safe speed without skidding?',
        options: ['9.9 m/s', '14.0 m/s', '4.9 m/s', '19.6 m/s'],
        answer: 0,
        explanation: 'Static friction provides centripetal force: μ_s · g = v² / r => v = √(μ_s · g · r) = √(0.20 × 9.8 × 50) = √98 ≈ 9.9 m/s.',
        difficulty: 'hard',
        rewardXp: 75,
        rewardGeo: 45
      }
    ],

    // Stage 3: Work-Energy & Conservation
    3: [
      {
        id: 'mech-s3-q1',
        courseId: 'course-mechanics',
        stageNumber: 3,
        subtopicName: 'Work-Energy Theorem',
        question: 'A spring with spring constant k = 400 N/m is compressed by 0.10 m from its equilibrium position. What is the stored elastic potential energy?',
        options: ['2.0 Joules', '40 Joules', '4.0 Joules', '0.20 Joules'],
        answer: 0,
        explanation: 'Elastic potential energy U_s = ½ k x² = 0.5 × 400 × (0.10)² = 200 × 0.01 = 2.0 Joules.',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 35
      },
      {
        id: 'mech-s3-q2',
        courseId: 'course-mechanics',
        stageNumber: 3,
        subtopicName: 'Work-Energy Theorem',
        question: 'A 1500 kg automobile increases its speed from 10 m/s to 30 m/s. What net work was done on the automobile?',
        options: ['600,000 J', '300,000 J', '1,200,000 J', '150,000 J'],
        answer: 0,
        explanation: 'Work-Energy Theorem: W_net = ΔK = ½ m (v_f² - v_i²) = 0.5 × 1500 × (900 - 100) = 750 × 800 = 600,000 J.',
        difficulty: 'intermediate',
        rewardXp: 75,
        rewardGeo: 40
      },
      {
        id: 'mech-s3-q3',
        courseId: 'course-mechanics',
        stageNumber: 3,
        subtopicName: 'Work-Energy Theorem',
        question: 'A conservative force field has potential energy U(x) = 4x³ - 6x. What is the force F(x) acting on a particle at x = 2 m?',
        options: ['-42 N', '+42 N', '-36 N', '+36 N'],
        answer: 0,
        explanation: 'F(x) = -dU/dx = -(12x² - 6). At x = 2: F(2) = -(12(4) - 6) = -(48 - 6) = -42 N.',
        difficulty: 'hard',
        rewardXp: 80,
        rewardGeo: 45
      },
      {
        id: 'mech-s3-q4',
        courseId: 'course-mechanics',
        stageNumber: 3,
        subtopicName: 'Work-Energy Theorem',
        question: 'An electric motor delivers a steady 750 Watts of power. How long will it take to lift a 50 kg load vertically through 15 meters (g = 10 m/s²)?',
        options: ['10.0 seconds', '7.5 seconds', '15.0 seconds', '5.0 seconds'],
        answer: 0,
        explanation: 'Work required W = mgh = 50 × 10 × 15 = 7500 J. Time t = W / P = 7500 J / 750 W = 10.0 seconds.',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 40
      }
    ],

    // Stage 4: Momentum & Inelastic Collisions
    4: [
      {
        id: 'mech-s4-q1',
        courseId: 'course-mechanics',
        stageNumber: 4,
        subtopicName: 'Linear Momentum & Collisions',
        question: 'A 0.15 kg baseball traveling at 40 m/s is struck by a bat and leaves at 50 m/s in the exact opposite direction. What is the magnitude of the impulse imparted by the bat?',
        options: ['13.5 N·s', '1.5 N·s', '6.0 N·s', '7.5 N·s'],
        answer: 0,
        explanation: 'Taking initial direction as positive: J = Δp = m(v_f - v_i) = 0.15 × (-50 - 40) = 0.15 × (-90) = -13.5 N·s. Magnitude = 13.5 N·s.',
        difficulty: 'intermediate',
        rewardXp: 75,
        rewardGeo: 40
      },
      {
        id: 'mech-s4-q2',
        courseId: 'course-mechanics',
        stageNumber: 4,
        subtopicName: 'Linear Momentum & Collisions',
        question: 'In a completely inelastic collision between two moving bodies in an isolated system, which physical quantity is strictly NOT conserved?',
        options: ['Mechanical Kinetic Energy', 'Total Momentum Vector', 'Total Relativistic Energy', 'Center of Mass Velocity'],
        answer: 0,
        explanation: 'In completely inelastic collisions, the maximum possible kinetic energy is converted into internal thermal/deformation energy, though linear momentum remains strictly conserved.',
        difficulty: 'easy',
        rewardXp: 65,
        rewardGeo: 35
      },
      {
        id: 'mech-s4-q3',
        courseId: 'course-mechanics',
        stageNumber: 4,
        subtopicName: 'Linear Momentum & Collisions',
        question: 'A 2.0 kg toy railcar traveling at 3.0 m/s collides and couples with an identical 2.0 kg stationary railcar. How much kinetic energy was lost in the impact?',
        options: ['4.5 Joules', '9.0 Joules', '2.25 Joules', '0 Joules'],
        answer: 0,
        explanation: 'Initial K_i = ½(2.0)(3.0)² = 9.0 J. Final common velocity v_f = (2.0 × 3.0) / 4.0 = 1.5 m/s. Final K_f = ½(4.0)(1.5)² = 4.5 J. Lost energy = 9.0 - 4.5 = 4.5 J.',
        difficulty: 'hard',
        rewardXp: 85,
        rewardGeo: 50
      },
      {
        id: 'mech-s4-q4',
        courseId: 'course-mechanics',
        stageNumber: 4,
        subtopicName: 'Linear Momentum & Collisions',
        question: 'A rocket of initial mass M expels fuel at constant relative exhaust velocity u. If it burns 75% of its total mass, what is its increase in velocity (Tsiolkovsky equation)?',
        options: ['u ln(4)', 'u ln(0.25)', '4u', '0.75u'],
        answer: 0,
        explanation: 'Δv = u ln(M_initial / M_final) = u ln(M / 0.25M) = u ln(4).',
        difficulty: 'hard',
        rewardXp: 90,
        rewardGeo: 50
      }
    ],

    // Stage 5: Grand Boss — Rotational Torque & Gravitation
    5: [
      {
        id: 'mech-s5-q1',
        courseId: 'course-mechanics',
        stageNumber: 5,
        subtopicName: 'Rotational Dynamics & Apex Synthesis',
        question: 'A solid cylinder (I = ½ M R²) and a thin cylindrical hoop (I = M R²) of identical mass and radius roll down an incline from rest without slipping. Which reaches the bottom first?',
        options: [
          'The solid cylinder, because it has smaller rotational inertia fraction.',
          'The thin hoop, because all its mass is concentrated at the perimeter.',
          'They arrive at the exact same instant regardless of moment of inertia.',
          'It depends on the coefficient of static friction of the incline.'
        ],
        answer: 0,
        explanation: 'Acceleration a = g sin(θ) / (1 + I / MR²). The cylinder has I/MR² = 0.5 (a = 2/3 g sin θ), while the hoop has I/MR² = 1.0 (a = 1/2 g sin θ). Cylinder accelerates faster.',
        difficulty: 'hard',
        rewardXp: 95,
        rewardGeo: 60
      },
      {
        id: 'mech-s5-q2',
        courseId: 'course-mechanics',
        stageNumber: 5,
        subtopicName: 'Rotational Dynamics & Apex Synthesis',
        question: 'A figure skater spins with angular velocity ω₀ with arms outstretched. When she pulls her arms in, her moment of inertia decreases by a factor of 3. What happens to her kinetic energy?',
        options: ['Triples (increases by 3x)', 'Decreases by 3x', 'Remains unchanged', 'Increases by 9x'],
        answer: 0,
        explanation: 'Angular momentum L = Iω is conserved: ω_new = 3ω₀. Kinetic energy K = L² / (2I). If I becomes I/3, K becomes 3K₀ (chemical muscular work was done to pull arms inward).',
        difficulty: 'hard',
        rewardXp: 100,
        rewardGeo: 65
      },
      {
        id: 'mech-s5-q3',
        courseId: 'course-mechanics',
        stageNumber: 5,
        subtopicName: 'Rotational Dynamics & Apex Synthesis',
        question: 'Two uniform spheres of masses M and 4M have their centers separated by distance d. At what distance from the mass M is the net gravitational field zero?',
        options: ['d / 3', 'd / 4', 'd / 5', 'd / 2'],
        answer: 0,
        explanation: 'G M / x² = G (4M) / (d - x)² => 1/x = 2 / (d - x) => d - x = 2x => 3x = d => x = d / 3.',
        difficulty: 'hard',
        rewardXp: 95,
        rewardGeo: 60
      },
      {
        id: 'mech-s5-q4',
        courseId: 'course-mechanics',
        stageNumber: 5,
        subtopicName: 'Rotational Dynamics & Apex Synthesis',
        question: 'A uniform rod of length L and mass M is pivoted smoothly about one end. What is its angular acceleration immediately upon being released from a horizontal orientation (I_pivot = ⅓ M L²)?',
        options: ['3g / (2L)', 'g / L', '2g / (3L)', '3g / L'],
        answer: 0,
        explanation: 'Torque about pivot τ = Mg(L/2). Using τ = I α: Mg(L/2) = (⅓ M L²) α => α = (MgL/2) / (ML²/3) = 3g / (2L).',
        difficulty: 'hard',
        rewardXp: 105,
        rewardGeo: 70
      }
    ]
  },

  // =========================================================================
  // 2. DIFFERENTIAL & INTEGRAL CALCULUS
  // =========================================================================
  'course-calculus': {
    // Stage 1: Limits & Asymptotic Boundaries
    1: [
      {
        id: 'calc-s1-q1',
        courseId: 'course-calculus',
        stageNumber: 1,
        subtopicName: 'Foundational Limits & Continuity',
        question: 'Evaluate the limit: lim (x → 0) [ (e^(4x) - 1) / (2x) ].',
        options: ['2', '4', '1', '0'],
        answer: 0,
        explanation: 'By L’Hôpital’s Rule (0/0): derivative of numerator is 4e^(4x), derivative of denominator is 2. Limit = 4e⁰ / 2 = 2.',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      },
      {
        id: 'calc-s1-q2',
        courseId: 'course-calculus',
        stageNumber: 1,
        subtopicName: 'Foundational Limits & Continuity',
        question: 'What is lim (x → ∞) [ (5x³ - 2x + 1) / (3x³ + 7x² - 4) ]?',
        options: ['5/3', '∞', '0', '-1/4'],
        answer: 0,
        explanation: 'For rational functions as x → ∞, the ratio of the leading coefficients governs the limit: 5/3.',
        difficulty: 'easy',
        rewardXp: 55,
        rewardGeo: 30
      },
      {
        id: 'calc-s1-q3',
        courseId: 'course-calculus',
        stageNumber: 1,
        subtopicName: 'Foundational Limits & Continuity',
        question: 'If -x² ≤ f(x) ≤ x² for all real x, what is lim (x → 0) f(x)?',
        options: ['0 by the Squeeze (Sandwich) Theorem', '1', 'Does not exist', 'Undefined without explicit f(x)'],
        answer: 0,
        explanation: 'Since lim(-x²) = 0 and lim(x²) = 0 as x → 0, the Squeeze Theorem strictly dictates lim f(x) = 0.',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 35
      },
      {
        id: 'calc-s1-q4',
        courseId: 'course-calculus',
        stageNumber: 1,
        subtopicName: 'Foundational Limits & Continuity',
        question: 'At which values of x is f(x) = (x - 2) / (x² - 4) discontinuous, and what type of discontinuity is at x = 2?',
        options: ['x = ±2; removable discontinuity at x = 2', 'x = ±2; vertical asymptote at x = 2', 'Only x = 2; jump discontinuity', 'Only x = -2; essential discontinuity'],
        answer: 0,
        explanation: 'f(x) = 1/(x + 2) for x ≠ 2. Since lim(x → 2) f(x) = 1/4 exists, x = 2 is a removable hole, while x = -2 is an infinite vertical asymptote.',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 40
      }
    ],

    // Stage 2: Differential Operator & Power Chains
    2: [
      {
        id: 'calc-s2-q1',
        courseId: 'course-calculus',
        stageNumber: 2,
        subtopicName: 'Chain Rule & Derivative Operators',
        question: 'If y = ln(sec(x) + tan(x)), what is dy/dx?',
        options: ['sec(x)', 'tan(x)', 'sec²(x)', 'sec(x) tan(x)'],
        answer: 0,
        explanation: 'd/dx[ln(sec x + tan x)] = (sec x tan x + sec² x) / (sec x + tan x) = sec x (tan x + sec x) / (sec x + tan x) = sec x.',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 35
      },
      {
        id: 'calc-s2-q2',
        courseId: 'course-calculus',
        stageNumber: 2,
        subtopicName: 'Chain Rule & Derivative Operators',
        question: 'Find dy/dx implicitly for the curve: x² + y² = 25 at the coordinate point (3, 4).',
        options: ['-3/4', '3/4', '-4/3', '4/3'],
        answer: 0,
        explanation: '2x + 2y(dy/dx) = 0 => dy/dx = -x/y. At (3, 4): dy/dx = -3/4.',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 30
      },
      {
        id: 'calc-s2-q3',
        courseId: 'course-calculus',
        stageNumber: 2,
        subtopicName: 'Chain Rule & Derivative Operators',
        question: 'What is the derivative of f(x) = x^(x) for x > 0?',
        options: ['x^(x) (ln(x) + 1)', 'x · x^(x - 1)', 'x^(x) ln(x)', 'e^x ln(x)'],
        answer: 0,
        explanation: 'Logarithmic differentiation: ln y = x ln x. Differentiating: (1/y) y\' = ln x + x(1/x) = ln x + 1 => y\' = x^x (ln x + 1).',
        difficulty: 'hard',
        rewardXp: 75,
        rewardGeo: 45
      },
      {
        id: 'calc-s2-q4',
        courseId: 'course-calculus',
        stageNumber: 2,
        subtopicName: 'Chain Rule & Derivative Operators',
        question: 'A spherical balloon is being inflated such that its volume increases at a constant 100 cm³/s. How fast is the radius increasing when r = 5 cm?',
        options: ['1 / (π) cm/s', '4 / (π) cm/s', '1 / (4π) cm/s', '100 / (4π) cm/s'],
        answer: 0,
        explanation: 'V = (4/3) π r³ => dV/dt = 4π r² (dr/dt). At r = 5: 100 = 4π(25)(dr/dt) = 100π(dr/dt) => dr/dt = 100 / (100π) = 1/π cm/s.',
        difficulty: 'hard',
        rewardXp: 80,
        rewardGeo: 45
      }
    ],

    // Stage 3: Concavity & Stationary Extremum
    3: [
      {
        id: 'calc-s3-q1',
        courseId: 'course-calculus',
        stageNumber: 3,
        subtopicName: 'Optimization & Concavity',
        question: 'Find all critical numbers of the function f(x) = x³ - 3x² - 9x + 5.',
        options: ['x = 3 and x = -1', 'x = -3 and x = 1', 'x = 0 and x = 3', 'x = 3 only'],
        answer: 0,
        explanation: 'f\'(x) = 3x² - 6x - 9 = 3(x² - 2x - 3) = 3(x - 3)(x + 1) = 0 => x = 3, x = -1.',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 35
      },
      {
        id: 'calc-s3-q2',
        courseId: 'course-calculus',
        stageNumber: 3,
        subtopicName: 'Optimization & Concavity',
        question: 'What is the x-coordinate of the inflection point of the cubic curve f(x) = 2x³ - 6x² + 4x - 1?',
        options: ['x = 1', 'x = 2', 'x = 0', 'x = 3'],
        answer: 0,
        explanation: 'f\'(x) = 6x² - 12x + 4, f\'\'(x) = 12x - 12 = 0 => x = 1. Concavity changes sign at x = 1.',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 40
      },
      {
        id: 'calc-s3-q3',
        courseId: 'course-calculus',
        stageNumber: 3,
        subtopicName: 'Optimization & Concavity',
        question: 'A farmer wants to fence in a rectangular field with fixed perimeter of 200 meters. What dimensions maximize the enclosed area?',
        options: ['50 m × 50 m (Square)', '60 m × 40 m', '80 m × 20 m', '70 m × 30 m'],
        answer: 0,
        explanation: 'P = 2x + 2y = 200 => y = 100 - x. Area A(x) = x(100 - x) = 100x - x². A\'(x) = 100 - 2x = 0 => x = 50, y = 50.',
        difficulty: 'intermediate',
        rewardXp: 75,
        rewardGeo: 40
      },
      {
        id: 'calc-s3-q4',
        courseId: 'course-calculus',
        stageNumber: 3,
        subtopicName: 'Optimization & Concavity',
        question: 'Does f(x) = |x| satisfy the Mean Value Theorem on [-1, 2]?',
        options: ['No, because it is not differentiable at x = 0', 'Yes, because it is continuous everywhere', 'Yes, with c = 0.5', 'No, because f(-1) ≠ f(2)'],
        answer: 0,
        explanation: 'The Mean Value Theorem strictly requires f to be differentiable on the open interval (-1, 2). Since |x| has a sharp corner at x = 0, differentiability fails.',
        difficulty: 'hard',
        rewardXp: 80,
        rewardGeo: 45
      }
    ],

    // Stage 4: Riemann Accumulation & Integrals
    4: [
      {
        id: 'calc-s4-q1',
        courseId: 'course-calculus',
        stageNumber: 4,
        subtopicName: 'Integration & Fundamental Theorem',
        question: 'Evaluate the indefinite integral: ∫ (2x / (x² + 1)) dx.',
        options: ['ln(x² + 1) + C', 'arctan(x) + C', '1 / (x² + 1)² + C', '2 ln(x² + 1) + C'],
        answer: 0,
        explanation: 'Let u = x² + 1, du = 2x dx. Integral becomes ∫ (1/u) du = ln|u| + C = ln(x² + 1) + C.',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 40
      },
      {
        id: 'calc-s4-q2',
        courseId: 'course-calculus',
        stageNumber: 4,
        subtopicName: 'Integration & Fundamental Theorem',
        question: 'If F(x) = ∫ from 1 to x² of [ sqrt(t³ + 1) ] dt, what is F\'(x) by Leibniz Integral Rule?',
        options: ['2x · sqrt(x⁶ + 1)', 'sqrt(x⁶ + 1)', '2x · sqrt(x³ + 1)', 'x · sqrt(x⁶ + 1)'],
        answer: 0,
        explanation: 'By the Fundamental Theorem of Calculus with Chain Rule: d/dx [∫₁^(u(x)) f(t) dt] = f(u(x)) · u\'(x) = sqrt((x²)³ + 1) · (2x) = 2x sqrt(x⁶ + 1).',
        difficulty: 'hard',
        rewardXp: 85,
        rewardGeo: 50
      },
      {
        id: 'calc-s4-q3',
        courseId: 'course-calculus',
        stageNumber: 4,
        subtopicName: 'Integration & Fundamental Theorem',
        question: 'Evaluate: ∫ from 0 to π/4 of [ sec²(x) dx ].',
        options: ['1', '0', '√2', 'π/4'],
        answer: 0,
        explanation: 'Antiderivative of sec²(x) is tan(x). Evaluating tan(π/4) - tan(0) = 1 - 0 = 1.',
        difficulty: 'easy',
        rewardXp: 65,
        rewardGeo: 35
      },
      {
        id: 'calc-s4-q4',
        courseId: 'course-calculus',
        stageNumber: 4,
        subtopicName: 'Integration & Fundamental Theorem',
        question: 'Using integration by parts (∫ u dv = uv - ∫ v du), evaluate ∫ x · e^x dx.',
        options: ['e^x (x - 1) + C', 'e^x (x + 1) + C', 'x² e^x / 2 + C', 'e^x - x + C'],
        answer: 0,
        explanation: 'Let u = x, dv = e^x dx => du = dx, v = e^x. ∫ x e^x dx = x e^x - ∫ e^x dx = x e^x - e^x + C = e^x(x - 1) + C.',
        difficulty: 'hard',
        rewardXp: 85,
        rewardGeo: 45
      }
    ],

    // Stage 5: Grand Boss — Demigod Calculus Synthesis
    5: [
      {
        id: 'calc-s5-q1',
        courseId: 'course-calculus',
        stageNumber: 5,
        subtopicName: 'Comprehensive Calculus Demigod Synthesis',
        question: 'What is the volume of the solid generated by revolving the region bounded by y = √x, y = 0, and x = 4 about the x-axis (Disk Method)?',
        options: ['8π', '16π', '4π', '32π/3'],
        answer: 0,
        explanation: 'V = π ∫₀⁴ (√x)² dx = π ∫₀⁴ x dx = π [x²/2]₀⁴ = π (16/2) = 8π.',
        difficulty: 'hard',
        rewardXp: 100,
        rewardGeo: 65
      },
      {
        id: 'calc-s5-q2',
        courseId: 'course-calculus',
        stageNumber: 5,
        subtopicName: 'Comprehensive Calculus Demigod Synthesis',
        question: 'Evaluate the improper integral: ∫ from 1 to ∞ of [ 1 / x² ] dx.',
        options: ['1', '∞ (Diverges)', '0', '2'],
        answer: 0,
        explanation: 'lim (b → ∞) [-1/x]₁ᵇ = lim (-1/b - (-1)) = 0 + 1 = 1. The integral converges to 1.',
        difficulty: 'hard',
        rewardXp: 95,
        rewardGeo: 60
      },
      {
        id: 'calc-s5-q3',
        courseId: 'course-calculus',
        stageNumber: 5,
        subtopicName: 'Comprehensive Calculus Demigod Synthesis',
        question: 'Find the general solution to the separable differential equation: dy/dx = 3x² y.',
        options: ['y = C e^(x³)', 'y = C e^(3x)', 'y = x³ + C', 'y = ln|x³| + C'],
        answer: 0,
        explanation: '(1/y) dy = 3x² dx => ln|y| = x³ + C₁ => y = C e^(x³).',
        difficulty: 'hard',
        rewardXp: 100,
        rewardGeo: 65
      },
      {
        id: 'calc-s5-q4',
        courseId: 'course-calculus',
        stageNumber: 5,
        subtopicName: 'Comprehensive Calculus Demigod Synthesis',
        question: 'What is the radius of convergence R for the power series: ∑ from n=1 to ∞ of [ (x - 2)^n / (n · 3^n) ]?',
        options: ['R = 3', 'R = 1/3', 'R = 1', 'R = ∞'],
        answer: 0,
        explanation: 'By Ratio Test: lim |(a_(n+1) / a_n)| = lim |(x - 2)| / 3 · (n / (n + 1)) = |x - 2| / 3 < 1 => |x - 2| < 3 => R = 3.',
        difficulty: 'hard',
        rewardXp: 110,
        rewardGeo: 70
      }
    ]
  },

  // =========================================================================
  // 3. COMPUTER SCIENCE & ALGORITHMICS
  // =========================================================================
  'course-cs': {
    // Stage 1: Asymptotic Complexity & Big-O
    1: [
      {
        id: 'cs-s1-q1',
        courseId: 'course-cs',
        stageNumber: 1,
        subtopicName: 'Asymptotic Complexity & Big-O',
        question: 'Using the Master Theorem, what is the asymptotic time complexity of the recurrence relation: T(n) = 2T(n/2) + O(n)?',
        options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
        answer: 0,
        explanation: 'Here a = 2, b = 2, and f(n) = O(n¹). Since n^(log_b a) = n^(log₂ 2) = n¹, this falls into Master Theorem Case 2: T(n) = O(n log n) (MergeSort).',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      },
      {
        id: 'cs-s1-q2',
        courseId: 'course-cs',
        stageNumber: 1,
        subtopicName: 'Asymptotic Complexity & Big-O',
        question: 'Which of the following functions grows the fastest asymptotically as n → ∞?',
        options: ['2^n', 'n!', 'n^100', 'n^(log n)'],
        answer: 1,
        explanation: 'Factorial n! grows faster than any exponential c^n by Stirling’s approximation (n! ≈ √(2πn) (n/e)^n).',
        difficulty: 'easy',
        rewardXp: 55,
        rewardGeo: 30
      },
      {
        id: 'cs-s1-q3',
        courseId: 'course-cs',
        stageNumber: 1,
        subtopicName: 'Asymptotic Complexity & Big-O',
        question: 'What is the amortized time complexity of inserting n elements into an initially empty dynamic array (like std::vector or ArrayList)?',
        options: ['O(1) per insertion', 'O(n) per insertion', 'O(log n) per insertion', 'O(n²) total'],
        answer: 0,
        explanation: 'Even though geometric capacity doubling takes O(n) intermittently, the sum of all resize costs across n pushes is bounded by 2n, giving O(1) amortized time.',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 35
      },
      {
        id: 'cs-s1-q4',
        courseId: 'course-cs',
        stageNumber: 1,
        subtopicName: 'Asymptotic Complexity & Big-O',
        question: 'What is the tight lower bound for comparison-based sorting algorithms of n elements in the worst case?',
        options: ['Ω(n log n)', 'Ω(n)', 'Ω(n²)', 'Ω(log n)'],
        answer: 0,
        explanation: 'A decision tree for n! possible permutations must have height h ≥ log₂(n!) = Ω(n log n).',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 40
      }
    ],

    // Stage 2: Execution Context & Memory
    2: [
      {
        id: 'cs-s2-q1',
        courseId: 'course-cs',
        stageNumber: 2,
        subtopicName: 'Memory & Execution Stack',
        question: 'Where are dynamic object allocations managed and garbage collected in modern runtime virtual machines (e.g. V8, JVM)?',
        options: ['The Memory Heap', 'The Call Stack', 'The CPU Instruction Pipeline', 'The Register Cache'],
        answer: 0,
        explanation: 'Reference types and dynamic allocations live on the heap, whereas execution stack frames store primitive local variables and return pointers.',
        difficulty: 'easy',
        rewardXp: 55,
        rewardGeo: 30
      },
      {
        id: 'cs-s2-q2',
        courseId: 'course-cs',
        stageNumber: 2,
        subtopicName: 'Memory & Execution Stack',
        question: 'What is the space complexity of a recursive depth-first search on a tree with maximum depth h?',
        options: ['O(h) for call stack frames', 'O(1) constant space', 'O(2^h)', 'O(n²)'],
        answer: 0,
        explanation: 'The call stack grows proportionally to the current exploration branch depth, which is bounded by O(h).',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 35
      },
      {
        id: 'cs-s2-q3',
        courseId: 'course-cs',
        stageNumber: 2,
        subtopicName: 'Memory & Execution Stack',
        question: 'In JavaScript, why does `typeof NaN` return "number"?',
        options: [
          'IEEE 754 floating-point standard specifies NaN as a numerical error value within the floating-point type.',
          'It is an unintended bug from ECMAScript 1995 that cannot be deprecated.',
          'NaN is coerced to integer 0 during typeof evaluation.',
          'Typeof always returns "number" for non-string primitives.'
        ],
        answer: 0,
        explanation: 'Under the IEEE-754 floating point standard, Not-a-Number (NaN) is defined as a special numeric value indicating an undefined arithmetic result.',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 35
      },
      {
        id: 'cs-s2-q4',
        courseId: 'course-cs',
        stageNumber: 2,
        subtopicName: 'Memory & Execution Stack',
        question: 'What occurs when an uncontrolled recursive function exceeds maximum call stack memory?',
        options: ['Stack Overflow error', 'Segmentation Fault on Heap', 'Deadlock in Thread Pool', 'Infinite Event Loop Block'],
        answer: 0,
        explanation: 'Each call pushes an activation record onto the stack until available call stack memory is exhausted, throwing a Stack Overflow exception.',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      }
    ],

    // Stage 3: Self-Balancing Trees & Search
    3: [
      {
        id: 'cs-s3-q1',
        courseId: 'course-cs',
        stageNumber: 3,
        subtopicName: 'AVL & Binary Search Trees',
        question: 'In an AVL tree, what is the balance factor condition required at every node?',
        options: [
          '|height(left) - height(right)| ≤ 1',
          'height(left) === height(right)',
          '|count(left) - count(right)| ≤ 1',
          'depth(left) ≤ depth(right)'
        ],
        answer: 0,
        explanation: 'An AVL tree maintains height balance by guaranteeing that the heights of the two child subtrees of any node differ by at most one.',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 35
      },
      {
        id: 'cs-s3-q2',
        courseId: 'course-cs',
        stageNumber: 3,
        subtopicName: 'AVL & Binary Search Trees',
        question: 'What tree rotation is performed when an insertion occurs into the right subtree of a left child (Left-Right case)?',
        options: ['Left rotation on child, then Right rotation on root', 'Single Right rotation on root', 'Double Left rotation', 'Right rotation on child, then Left on root'],
        answer: 0,
        explanation: 'The LR imbalance requires a Left rotation on the left child node followed by a Right rotation on the unbalance parent node.',
        difficulty: 'hard',
        rewardXp: 80,
        rewardGeo: 45
      },
      {
        id: 'cs-s3-q3',
        courseId: 'course-cs',
        stageNumber: 3,
        subtopicName: 'AVL & Binary Search Trees',
        question: 'Which tree traversal produces keys in strictly non-decreasing sorted order for any valid Binary Search Tree?',
        options: ['In-Order Traversal (Left, Node, Right)', 'Pre-Order Traversal (Node, Left, Right)', 'Post-Order Traversal (Left, Right, Node)', 'Level-Order Traversal'],
        answer: 0,
        explanation: 'Because all left descendants are smaller and all right descendants are larger, In-Order traversal strictly outputs sorted ascending keys.',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 30
      },
      {
        id: 'cs-s3-q4',
        courseId: 'course-cs',
        stageNumber: 3,
        subtopicName: 'AVL & Binary Search Trees',
        question: 'What is the worst-case time complexity of Red-Black Tree insertion of an element?',
        options: ['O(log n)', 'O(n)', 'O(1)', 'O(n log n)'],
        answer: 0,
        explanation: 'Red-Black tree properties ensure the tree height is bounded by 2 log₂(n + 1), keeping search, insertion, and deletion strictly O(log n).',
        difficulty: 'intermediate',
        rewardXp: 75,
        rewardGeo: 40
      }
    ],

    // Stage 4: Graph Theory & Shortest Paths
    4: [
      {
        id: 'cs-s4-q1',
        courseId: 'course-cs',
        stageNumber: 4,
        subtopicName: 'Graph Algorithms',
        question: 'Which data structure is used to implement Breadth-First Search (BFS) to find shortest path in an unweighted graph?',
        options: ['First-In First-Out Queue', 'Last-In First-Out Stack', 'Min-Heap Priority Queue', 'Disjoint Set Union'],
        answer: 0,
        explanation: 'BFS explores vertices layer by layer using a FIFO Queue to guarantee finding minimum edge-count paths.',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 30
      },
      {
        id: 'cs-s4-q2',
        courseId: 'course-cs',
        stageNumber: 4,
        subtopicName: 'Graph Algorithms',
        question: 'What will happen if Dijkstra’s algorithm is executed on a graph containing negative edge weights?',
        options: [
          'It may produce incorrect shortest distances because greedy edge finality assumption is violated.',
          'It throws an infinite loop exception.',
          'It automatically converts to Bellman-Ford.',
          'It works correctly as long as there is no negative cycle.'
        ],
        answer: 0,
        explanation: 'Dijkstra assumes that once a vertex is removed from the priority queue, its shortest distance is finalized. Negative weights invalidate this greedy property.',
        difficulty: 'intermediate',
        rewardXp: 75,
        rewardGeo: 40
      },
      {
        id: 'cs-s4-q3',
        courseId: 'course-cs',
        stageNumber: 4,
        subtopicName: 'Graph Algorithms',
        question: 'What is the time complexity of Dijkstra’s algorithm using a min-heap priority queue with V vertices and E edges?',
        options: ['O((V + E) log V)', 'O(V²)', 'O(V · E)', 'O(E log E)'],
        answer: 0,
        explanation: 'Each vertex is extracted from the heap once (O(V log V)) and each edge weight can trigger a decrease-key/push (O(E log V)), yielding O((V + E) log V).',
        difficulty: 'hard',
        rewardXp: 85,
        rewardGeo: 45
      },
      {
        id: 'cs-s4-q4',
        courseId: 'course-cs',
        stageNumber: 4,
        subtopicName: 'Graph Algorithms',
        question: 'Which algorithm detects whether a directed graph contains a cycle in O(V + E) time?',
        options: ['Depth-First Search checking for back-edges', 'Kruskal’s Algorithm', 'Floyd-Warshall', 'Prim’s Algorithm'],
        answer: 0,
        explanation: 'A DFS traversal with 3-color node states (White, Gray, Black) detects cycles if a traversal hits an active ancestor node (Gray / back-edge).',
        difficulty: 'intermediate',
        rewardXp: 75,
        rewardGeo: 40
      }
    ],

    // Stage 5: Grand Boss — Dynamic Programming & Complete Hypnosis
    5: [
      {
        id: 'cs-s5-q1',
        courseId: 'course-cs',
        stageNumber: 5,
        subtopicName: 'Advanced Dynamic Programming',
        question: 'In the 0/1 Knapsack Problem with N items and capacity W, what is the time complexity of the standard dynamic programming solution?',
        options: ['O(N · W) (Pseudo-polynomial)', 'O(2^N) strictly polynomial', 'O(N log W)', 'O(W²)'],
        answer: 0,
        explanation: 'The DP table has dimensions (N + 1) × (W + 1), requiring O(NW) steps. Since W is represented in log₂(W) bits, it is pseudo-polynomial.',
        difficulty: 'hard',
        rewardXp: 100,
        rewardGeo: 60
      },
      {
        id: 'cs-s5-q2',
        courseId: 'course-cs',
        stageNumber: 5,
        subtopicName: 'Advanced Dynamic Programming',
        question: 'What is the length of the Longest Common Subsequence (LCS) between strings "AGGTAB" and "GXTXAYB"?',
        options: ['4 ("GTAB")', '5', '3', '6'],
        answer: 0,
        explanation: 'The common subsequence with maximum length is "GTAB", having length 4.',
        difficulty: 'hard',
        rewardXp: 100,
        rewardGeo: 65
      },
      {
        id: 'cs-s5-q3',
        courseId: 'course-cs',
        stageNumber: 5,
        subtopicName: 'Advanced Dynamic Programming',
        question: 'Which algorithmic paradigm computes shortest paths between all pairs of vertices in O(V³) time by testing whether path (i, j) can be shortened via vertex k?',
        options: ['Floyd-Warshall Algorithm', 'Bellman-Ford Algorithm', 'Tarjan’s Strongly Connected Components', 'Ford-Fulkerson Maximum Flow'],
        answer: 0,
        explanation: 'Floyd-Warshall uses DP recurrence: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]) over all k in 1..V.',
        difficulty: 'hard',
        rewardXp: 105,
        rewardGeo: 70
      },
      {
        id: 'cs-s5-q4',
        courseId: 'course-cs',
        stageNumber: 5,
        subtopicName: 'Advanced Dynamic Programming',
        question: 'How many ways can a staircase of 4 steps be climbed if you can take either 1 or 2 steps at a time (Fibonacci sequence)?',
        options: ['5 ways', '4 ways', '8 ways', '6 ways'],
        answer: 0,
        explanation: 'ways(0)=1, ways(1)=1, ways(2)=2, ways(3)=3, ways(4)=ways(3)+ways(2)=3+2 = 5 ways (1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2).',
        difficulty: 'intermediate',
        rewardXp: 85,
        rewardGeo: 50
      }
    ]
  },

  // =========================================================================
  // 4. PHYSICS II — ELECTRICITY & MAGNETISM
  // =========================================================================
  'course-electromagnetism': {
    // Stage 1: Coulomb's Electrostatic Force
    1: [
      {
        id: 'em-s1-q1',
        courseId: 'course-electromagnetism',
        stageNumber: 1,
        subtopicName: 'Coulomb’s Electrostatic Law',
        question: 'Two identical charges of +2.0 μC are separated by 0.30 meters in vacuum (k = 8.99 × 10⁹ N·m²/C²). What is the repulsive electrostatic force between them?',
        options: ['0.40 N', '0.12 N', '1.20 N', '4.00 N'],
        answer: 0,
        explanation: 'F = k · q₁ · q₂ / r² = (8.99 × 10⁹)(2.0 × 10⁻⁶)(2.0 × 10⁻⁶) / (0.30)² = 0.03596 / 0.09 ≈ 0.40 N.',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      },
      {
        id: 'em-s1-q2',
        courseId: 'course-electromagnetism',
        stageNumber: 1,
        subtopicName: 'Coulomb’s Electrostatic Law',
        question: 'What is the electric field magnitude at distance r from an isolated point charge q?',
        options: ['k |q| / r²', 'k |q| / r', 'k q² / r', 'k |q| / r³'],
        answer: 0,
        explanation: 'By definition, E = F / q_test = k |q| / r².',
        difficulty: 'easy',
        rewardXp: 55,
        rewardGeo: 30
      },
      {
        id: 'em-s1-q3',
        courseId: 'course-electromagnetism',
        stageNumber: 1,
        subtopicName: 'Coulomb’s Electrostatic Law',
        question: 'An electric dipole consists of charges +q and -q separated by distance d. How does the electric field scale at large distances r along its axis (r >> d)?',
        options: ['E ∝ 1 / r³', 'E ∝ 1 / r²', 'E ∝ 1 / r', 'E ∝ 1 / r⁴'],
        answer: 0,
        explanation: 'Due to cancellation between opposing charges, dipole field falls off more steeply than monopole: E ∝ 1/r³.',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 35
      },
      {
        id: 'em-s1-q4',
        courseId: 'course-electromagnetism',
        stageNumber: 1,
        subtopicName: 'Coulomb’s Electrostatic Law',
        question: 'An electron enters a uniform electric field directed vertically upward. In which direction does the electron accelerate?',
        options: ['Vertically Downward', 'Vertically Upward', 'Horizontally to the right', 'Circular orbit'],
        answer: 0,
        explanation: 'Force F = qE. Since an electron carries negative charge (q = -e), the force is directed opposite to the field: downward.',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      }
    ],

    // Stage 2: Gauss's Law
    2: [
      {
        id: 'em-s2-q1',
        courseId: 'course-electromagnetism',
        stageNumber: 2,
        subtopicName: 'Gauss’s Law & Flux',
        question: 'A point charge +Q is located at the exact center of a cube of edge length L. What is the electric flux passing through just ONE face of the cube?',
        options: ['Q / (6 ε₀)', 'Q / ε₀', 'Q / (4πε₀)', '0'],
        answer: 0,
        explanation: 'Total flux through all 6 symmetrical faces is Q/ε₀ by Gauss’s Law. By symmetry, one face receives 1/6: Q / (6ε₀).',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 35
      },
      {
        id: 'em-s2-q2',
        courseId: 'course-electromagnetism',
        stageNumber: 2,
        subtopicName: 'Gauss’s Law & Flux',
        question: 'Inside an isolated solid metallic conductor in electrostatic equilibrium, what is the electric field?',
        options: ['Zero everywhere', 'Uniform and non-zero', 'Proportional to distance from center', 'Infinite at the core'],
        answer: 0,
        explanation: 'Free mobile electrons redistribute until all internal fields cancel completely: E = 0 inside conductors in static equilibrium.',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 30
      },
      {
        id: 'em-s2-q3',
        courseId: 'course-electromagnetism',
        stageNumber: 2,
        subtopicName: 'Gauss’s Law & Flux',
        question: 'An infinite plane sheet of charge carries uniform surface charge density σ. What is the electric field at distance d from the sheet?',
        options: ['σ / (2 ε₀)', 'σ / ε₀', 'σ / (4πε₀ d)', 'σ · d / ε₀'],
        answer: 0,
        explanation: 'Using a cylindrical Gaussian pillbox: 2 E A = (σ A) / ε₀ => E = σ / (2ε₀), independent of distance d.',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 40
      },
      {
        id: 'em-s2-q4',
        courseId: 'course-electromagnetism',
        stageNumber: 2,
        subtopicName: 'Gauss’s Law & Flux',
        question: 'What is the electric field inside a hollow spherical conducting shell that carries net positive charge Q on its outer surface?',
        options: ['Zero', 'k Q / r²', 'k Q / R', 'Uniform and directed outward'],
        answer: 0,
        explanation: 'A Gaussian sphere inside encloses Q_enc = 0, so by Gauss’s Law E = 0 everywhere inside the cavity.',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 30
      }
    ],

    // Stage 3: Potential & Capacitance
    3: [
      {
        id: 'em-s3-q1',
        courseId: 'course-electromagnetism',
        stageNumber: 3,
        subtopicName: 'Electric Potential & Capacitance',
        question: 'A parallel-plate capacitor has capacitance C₀. If a dielectric slab with dielectric constant κ = 4.0 fills the space between the plates, what is the new capacitance?',
        options: ['4.0 C₀', 'C₀ / 4.0', '16.0 C₀', 'C₀'],
        answer: 0,
        explanation: 'Introducing a dielectric increases capacitance by factor κ: C = κ C₀ = 4.0 C₀.',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 30
      },
      {
        id: 'em-s3-q2',
        courseId: 'course-electromagnetism',
        stageNumber: 3,
        subtopicName: 'Electric Potential & Capacitance',
        question: 'How much electrostatic energy is stored in a 10 μF capacitor charged to a potential difference of 200 Volts?',
        options: ['0.20 Joules', '0.40 Joules', '2.00 Joules', '0.10 Joules'],
        answer: 0,
        explanation: 'U = ½ C V² = 0.5 × (10 × 10⁻⁶ F) × (200 V)² = (5 × 10⁻⁶) × 40,000 = 0.20 Joules.',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 35
      },
      {
        id: 'em-s3-q3',
        courseId: 'course-electromagnetism',
        stageNumber: 3,
        subtopicName: 'Electric Potential & Capacitance',
        question: 'How is electric potential V related to electric field vector E in one dimension?',
        options: ['E_x = - dV/dx', 'E_x = dV/dx', 'V = - dE_x/dx', 'E_x = ∫ V dx'],
        answer: 0,
        explanation: 'The electric field is the negative gradient of the electric potential: E = -∇V, so E_x = -dV/dx.',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 35
      },
      {
        id: 'em-s3-q4',
        courseId: 'course-electromagnetism',
        stageNumber: 3,
        subtopicName: 'Electric Potential & Capacitance',
        question: 'Two capacitors of 6 μF and 3 μF are connected in series. What is their equivalent capacitance?',
        options: ['2 μF', '9 μF', '18 μF', '4.5 μF'],
        answer: 0,
        explanation: 'In series: 1/C_eq = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2 => C_eq = 2 μF.',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 30
      }
    ],

    // Stage 4: DC Circuits & Kirchhoff
    4: [
      {
        id: 'em-s4-q1',
        courseId: 'course-electromagnetism',
        stageNumber: 4,
        subtopicName: 'DC Circuits & Kirchhoff’s Laws',
        question: 'Kirchhoff’s Current Law (Junction Rule, ∑ I = 0) is a direct consequence of which fundamental conservation principle?',
        options: ['Conservation of Electric Charge', 'Conservation of Energy', 'Conservation of Momentum', 'Conservation of Angular Momentum'],
        answer: 0,
        explanation: 'Current is rate of charge flow; because charge cannot accumulate indefinitely at a dimensionless junction, charge conservation requires ∑ I_in = ∑ I_out.',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 30
      },
      {
        id: 'em-s4-q2',
        courseId: 'course-electromagnetism',
        stageNumber: 4,
        subtopicName: 'DC Circuits & Kirchhoff’s Laws',
        question: 'A 12 V battery with internal resistance r = 1.0 Ω is connected across an external load of R = 5.0 Ω. What is the terminal voltage of the battery?',
        options: ['10.0 Volts', '12.0 Volts', '2.0 Volts', '6.0 Volts'],
        answer: 0,
        explanation: 'Current I = emf / (R + r) = 12 / (5 + 1) = 2.0 A. Terminal voltage V = emf - Ir = 12 - (2.0 × 1.0) = 10.0 V.',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 40
      },
      {
        id: 'em-s4-q3',
        courseId: 'course-electromagnetism',
        stageNumber: 4,
        subtopicName: 'DC Circuits & Kirchhoff’s Laws',
        question: 'What is the characteristic time constant τ of an RC series circuit with R = 200 kΩ and C = 5.0 μF?',
        options: ['1.0 second', '0.001 seconds', '10.0 seconds', '40.0 seconds'],
        answer: 0,
        explanation: 'τ = R × C = (200 × 10³ Ω) × (5.0 × 10⁻⁶ F) = 1.0 second.',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 35
      },
      {
        id: 'em-s4-q4',
        courseId: 'course-electromagnetism',
        stageNumber: 4,
        subtopicName: 'DC Circuits & Kirchhoff’s Laws',
        question: 'Two identical light bulbs are connected in parallel to a battery. If one bulb burns out, what happens to the brightness of the other bulb (ideal battery)?',
        options: ['Remains unchanged', 'Becomes dimmer', 'Becomes brighter', 'Goes out completely'],
        answer: 0,
        explanation: 'In parallel, the full battery voltage is maintained across each branch independently: V = constant, so power P = V²/R remains unchanged.',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 30
      }
    ],

    // Stage 5: Grand Boss — Magnetic Fields & Induction
    5: [
      {
        id: 'em-s5-q1',
        courseId: 'course-electromagnetism',
        stageNumber: 5,
        subtopicName: 'Maxwellian Electromagnetism Demigod Synthesis',
        question: 'A circular wire loop of radius 0.10 m is placed perpendicular to a magnetic field that collapses from 0.50 T to 0 T in 0.05 seconds. What is the induced EMF (Faraday’s Law)?',
        options: ['0.314 Volts', '3.14 Volts', '0.0314 Volts', '0.10 Volts'],
        answer: 0,
        explanation: 'Area A = π r² = π(0.10)² = 0.01π m². ΔΦ = A ΔB = 0.01π × 0.50 = 0.005π Wb. Induced emf = ΔΦ / Δt = 0.005π / 0.05 = 0.1π ≈ 0.314 V.',
        difficulty: 'hard',
        rewardXp: 100,
        rewardGeo: 65
      },
      {
        id: 'em-s5-q2',
        courseId: 'course-electromagnetism',
        stageNumber: 5,
        subtopicName: 'Maxwellian Electromagnetism Demigod Synthesis',
        question: 'What is the trajectory of a charged particle injected with velocity v perpendicular to a uniform magnetic field B?',
        options: ['Uniform Circular Motion with radius r = mv / (qB)', 'Linear acceleration along B', 'Parabolic freefall', 'Helical path with decaying pitch'],
        answer: 0,
        explanation: 'Lorentz magnetic force F = q v B acts always perpendicular to velocity, providing pure centripetal acceleration: q v B = m v² / r => r = mv / (qB).',
        difficulty: 'intermediate',
        rewardXp: 85,
        rewardGeo: 50
      },
      {
        id: 'em-s5-q3',
        courseId: 'course-electromagnetism',
        stageNumber: 5,
        subtopicName: 'Maxwellian Electromagnetism Demigod Synthesis',
        question: 'According to Lenz’s Law, in which direction does an induced current flow when external flux through a loop increases?',
        options: [
          'In the direction creating an opposing induced magnetic field to counteract the flux increase.',
          'In the direction reinforcing the external magnetic field.',
          'Always clockwise regardless of flux direction.',
          'Perpendicular to the plane of the loop.'
        ],
        answer: 0,
        explanation: 'Lenz’s law is energy conservation: induced currents oppose the change in magnetic flux that creates them.',
        difficulty: 'intermediate',
        rewardXp: 80,
        rewardGeo: 45
      },
      {
        id: 'em-s5-q4',
        courseId: 'course-electromagnetism',
        stageNumber: 5,
        subtopicName: 'Maxwellian Electromagnetism Demigod Synthesis',
        question: 'What did Maxwell add to Ampère’s Law (Ampère-Maxwell Law) to predict electromagnetic waves?',
        options: ['Displacement Current (ε₀ dΦ_E / dt)', 'Magnetic Monopole Term', 'Hall Effect Coefficient', 'Scalar Electric Potential'],
        answer: 0,
        explanation: 'Maxwell realized a time-varying electric field acts as an effective current (Displacement Current I_d = ε₀ dΦ_E/dt), producing magnetic fields and enabling self-propagating EM waves.',
        difficulty: 'hard',
        rewardXp: 110,
        rewardGeo: 70
      }
    ]
  }
};

/**
 * Get question battery for a given course and stage
 */
export function getStageQuestions(courseId: string, stageNumber: number): CourseQuestion[] {
  const courseBattery = COURSE_STAGE_QUESTIONS[courseId];
  if (courseBattery && courseBattery[stageNumber]) {
    return courseBattery[stageNumber];
  }
  // Fallback to mechanics stage 1
  return COURSE_STAGE_QUESTIONS['course-mechanics'][1];
}
