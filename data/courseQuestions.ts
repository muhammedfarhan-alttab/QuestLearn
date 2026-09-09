export interface CourseQuestion {
  id: string;
  courseId: string;
  stageNumber: number;
  subtopicName: string;
  questionType?: 'numerical' | 'conceptual' | 'analytical';
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
        questionType: 'conceptual',
        question: 'A projectile is launched with an initial speed v₀ at an angle of 30° above the horizontal. Neglecting air resistance, what is its acceleration at the highest point of its trajectory?',
        options: ['g downwards', '0', 'g cos(30°) perpendicular to velocity', 'g sin(30°) along trajectory'],
        answer: 0,
        explanation: 'Gravity is the sole acceleration acting throughout the entire trajectory, always pointing downwards with magnitude g = 9.8 m/s².',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      },
      // Kinematics -> Velocity -> Numerical (Question 1/5)
      {
        id: 'mech-s1-q2',
        courseId: 'course-mechanics',
        stageNumber: 1,
        subtopicName: 'Vector Displacement & Kinematics',
        questionType: 'numerical',
        question: 'A car accelerates uniformly from rest to 24 m/s in 6.0 seconds. What total distance does it cover during this interval?',
        options: ['72 meters', '144 meters', '36 meters', '48 meters'],
        answer: 0,
        explanation: 'Average velocity v_avg = (0 + 24) / 2 = 12 m/s. Total distance Δx = v_avg × t = 12 m/s × 6.0 s = 72 meters.',
        difficulty: 'easy',
        rewardXp: 55,
        rewardGeo: 30
      },
      // Kinematics -> Velocity -> Numerical (Question 2/5)
      {
        id: 'mech-s1-q2b',
        courseId: 'course-mechanics',
        stageNumber: 1,
        subtopicName: 'Vector Displacement & Kinematics',
        questionType: 'numerical',
        question: 'A high-speed bullet train traveling at 60 m/s brakes uniformly to a complete stop over a distance of 450 meters. What is the magnitude of its deceleration?',
        options: ['4.0 m/s²', '2.0 m/s²', '6.0 m/s²', '8.0 m/s²'],
        answer: 0,
        explanation: 'Using v² = v₀² + 2aΔx: 0 = 60² + 2(a)(450) => 900a = -3600 => a = -4.0 m/s². Deceleration magnitude is 4.0 m/s².',
        difficulty: 'intermediate',
        rewardXp: 60,
        rewardGeo: 35
      },
      // Kinematics -> Velocity -> Numerical (Question 3/5)
      {
        id: 'mech-s1-q2c',
        courseId: 'course-mechanics',
        stageNumber: 1,
        subtopicName: 'Vector Displacement & Kinematics',
        questionType: 'numerical',
        question: 'A maglev vehicle traveling with an initial velocity of 10 m/s accelerates uniformly at 5.0 m/s² for 6.0 seconds. What is the total distance covered during this acceleration?',
        options: ['150 meters', '90 meters', '180 meters', '120 meters'],
        answer: 0,
        explanation: 'Using Δx = v₀t + ½at²: Δx = (10)(6.0) + 0.5(5.0)(6.0)² = 60 + 0.5(5.0)(36) = 60 + 90 = 150 meters.',
        difficulty: 'intermediate',
        rewardXp: 60,
        rewardGeo: 35
      },
      // Kinematics -> Velocity -> Numerical (Question 4/5)
      {
        id: 'mech-s1-q2d',
        courseId: 'course-mechanics',
        stageNumber: 1,
        subtopicName: 'Vector Displacement & Kinematics',
        questionType: 'numerical',
        question: 'An electric sports car accelerates uniformly from rest at a constant rate of 4.5 m/s² for 8.0 seconds. What is its final velocity at the end of this period?',
        options: ['36.0 m/s', '32.0 m/s', '40.0 m/s', '28.0 m/s'],
        answer: 0,
        explanation: 'Using v = v₀ + at: v = 0 + (4.5 m/s²)(8.0 s) = 36.0 m/s.',
        difficulty: 'easy',
        rewardXp: 55,
        rewardGeo: 30
      },
      // Kinematics -> Velocity -> Numerical (Question 5/5)
      {
        id: 'mech-s1-q2e',
        courseId: 'course-mechanics',
        stageNumber: 1,
        subtopicName: 'Vector Displacement & Kinematics',
        questionType: 'numerical',
        question: 'A supersonic test drone cruising at 120 m/s accelerates uniformly at 8.0 m/s² over a duration of 4.0 seconds. What total displacement does it achieve during this burn?',
        options: ['544 meters', '480 meters', '608 meters', '512 meters'],
        answer: 0,
        explanation: 'Using Δx = v₀t + ½at²: Δx = (120)(4.0) + 0.5(8.0)(4.0)² = 480 + 0.5(8.0)(16) = 480 + 64 = 544 meters.',
        difficulty: 'hard',
        rewardXp: 70,
        rewardGeo: 45
      },
      {
        id: 'mech-s1-q3',
        courseId: 'course-mechanics',
        stageNumber: 1,
        subtopicName: 'Vector Displacement & Kinematics',
        questionType: 'numerical',
        question: 'A rock is dropped from rest off a cliff and hits the ground after 4.0 seconds (g = 9.8 m/s²). What is the height of the cliff?',
        options: ['78.4 m', '39.2 m', '156.8 m', '19.6 m'],
        answer: 0,
        explanation: 'Using Δy = ½ g t² = 0.5 × 9.8 × (4.0)² = 4.9 × 16 = 78.4 meters.',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 35
      },
      {
        id: 'mech-s1-q3b',
        courseId: 'course-mechanics',
        stageNumber: 1,
        subtopicName: 'Vector Displacement & Kinematics',
        questionType: 'numerical',
        question: 'A stone is projected vertically upward from ground level with an initial velocity of 29.4 m/s (g = 9.8 m/s²). How long does it take to reach its apex?',
        options: ['3.0 seconds', '6.0 seconds', '1.5 seconds', '4.5 seconds'],
        answer: 0,
        explanation: 'At the apex, vy = 0. Using vy = v₀y - gt: 0 = 29.4 - 9.8t => t = 29.4 / 9.8 = 3.0 seconds.',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 40
      },
      {
        id: 'mech-s1-q4',
        courseId: 'course-mechanics',
        stageNumber: 1,
        subtopicName: 'Vector Displacement & Kinematics',
        questionType: 'analytical',
        question: 'If vector A = 3î + 4ĵ and vector B = -3î + 8ĵ, what is the magnitude of the resultant vector R = A + B?',
        options: ['12 units', '13 units', '15 units', '7 units'],
        answer: 0,
        explanation: 'R = (3 - 3)î + (4 + 8)ĵ = 0î + 12ĵ. The magnitude is √(0² + 12²) = 12 units.',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 40
      },
      {
        id: 'mech-s1-q4b',
        courseId: 'course-mechanics',
        stageNumber: 1,
        subtopicName: 'Vector Displacement & Kinematics',
        questionType: 'analytical',
        question: 'A surveyor walks 9.0 km directly East, then turns North and walks 12.0 km. What is the straight-line magnitude of the resultant displacement from the start?',
        options: ['15.0 km', '21.0 km', '10.5 km', '18.0 km'],
        answer: 0,
        explanation: 'Using the Pythagorean theorem: R = √(9.0² + 12.0²) = √(81 + 144) = √225 = 15.0 km.',
        difficulty: 'easy',
        rewardXp: 55,
        rewardGeo: 30
      }
    ],

    // Stage 2: Newton's Laws & Friction
    2: [
      {
        id: 'mech-s2-q1',
        courseId: 'course-mechanics',
        stageNumber: 2,
        subtopicName: 'Newtonian Force & Friction',
        questionType: 'numerical',
        question: 'A 5.0 kg crate is pushed across a horizontal floor with a horizontal force of 30 N. If the coefficient of kinetic friction μₖ = 0.40 and g = 9.8 m/s², what is the net acceleration?',
        options: ['2.08 m/s²', '6.00 m/s²', '3.92 m/s²', '1.20 m/s²'],
        answer: 0,
        explanation: 'Normal force N = mg = 5.0 × 9.8 = 49 N. Friction force f_k = μₖ N = 0.40 × 49 = 19.6 N. Net force = 30 - 19.6 = 10.4 N. a = F_net / m = 10.4 / 5.0 = 2.08 m/s².',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 45
      },
      {
        id: 'mech-s2-q1b',
        courseId: 'course-mechanics',
        stageNumber: 2,
        subtopicName: 'Newtonian Force & Friction',
        questionType: 'numerical',
        question: 'A 10.0 kg box is pulled horizontally across a rough floor with an applied force of 80 N. If the coefficient of kinetic friction μₖ = 0.30 and g = 9.8 m/s², what is the crate\'s acceleration?',
        options: ['5.06 m/s²', '8.00 m/s²', '2.94 m/s²', '4.12 m/s²'],
        answer: 0,
        explanation: 'Normal force N = 10.0 × 9.8 = 98 N. Friction f_k = 0.30 × 98 = 29.4 N. Net force = 80 - 29.4 = 50.6 N. a = 50.6 / 10.0 = 5.06 m/s².',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 45
      },
      {
        id: 'mech-s2-q2',
        courseId: 'course-mechanics',
        stageNumber: 2,
        subtopicName: 'Newtonian Force & Friction',
        questionType: 'numerical',
        question: 'An elevator of mass 1000 kg accelerates upwards at 2.0 m/s² (g = 9.8 m/s²). What is the tension in the supporting cable?',
        options: ['11,800 N', '9,800 N', '7,800 N', '2,000 N'],
        answer: 0,
        explanation: 'T - mg = ma => T = m(g + a) = 1000 × (9.8 + 2.0) = 1000 × 11.8 = 11,800 N.',
        difficulty: 'easy',
        rewardXp: 65,
        rewardGeo: 40
      },
      {
        id: 'mech-s2-q2b',
        courseId: 'course-mechanics',
        stageNumber: 2,
        subtopicName: 'Newtonian Force & Friction',
        questionType: 'numerical',
        question: 'A 60.0 kg astronaut stands on a scale inside an elevator accelerating downwards at 1.8 m/s² on Earth (g = 9.8 m/s²). What apparent weight does the scale read?',
        options: ['480 N', '588 N', '696 N', '108 N'],
        answer: 0,
        explanation: 'Normal force N = m(g - a) = 60.0 × (9.8 - 1.8) = 60.0 × 8.0 = 480 N.',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 40
      },
      {
        id: 'mech-s2-q3',
        courseId: 'course-mechanics',
        stageNumber: 2,
        subtopicName: 'Newtonian Force & Friction',
        questionType: 'conceptual',
        question: 'According to Newton’s Third Law, if a horse pulls a cart forward with force F, the cart pulls back on the horse with force -F. Why does the cart accelerate forward?',
        options: [
          'The ground exerts a forward static friction force on the horse\'s hooves that exceeds the resistive forces on the cart.',
          'The horse exerts force before the cart reacts, creating a net forward imbalance.',
          'The mass of the horse cancels out the reaction force.',
          'Action and reaction act on the same body, producing an unbalanced net torque.'
        ],
        answer: 0,
        explanation: 'Action-reaction forces act on different bodies. The horse accelerates because the ground pushes forward on the horse\'s hooves with greater magnitude than the backward pull from the cart.',
        difficulty: 'intermediate',
        rewardXp: 75,
        rewardGeo: 50
      },
      {
        id: 'mech-s2-q4',
        courseId: 'course-mechanics',
        stageNumber: 2,
        subtopicName: 'Newtonian Force & Friction',
        questionType: 'numerical',
        question: 'A car negotiates an unbanked circular curve of radius 50 m on a wet road where the static friction coefficient μₛ = 0.20 (g = 9.8 m/s²). What is the maximum speed without skidding?',
        options: ['9.9 m/s', '14.0 m/s', '7.0 m/s', '19.6 m/s'],
        answer: 0,
        explanation: 'Centripetal force is provided by friction: m v² / r ≤ μₛ m g => v_max = √(μₛ g r) = √(0.20 × 9.8 × 50) = √98 ≈ 9.9 m/s.',
        difficulty: 'hard',
        rewardXp: 80,
        rewardGeo: 50
      }
    ],

    // Stage 3: Work, Energy & Conservation of Energy
    3: [
      {
        id: 'mech-s3-q1',
        courseId: 'course-mechanics',
        stageNumber: 3,
        subtopicName: 'Work-Energy Theorem',
        questionType: 'numerical',
        question: 'A spring with spring constant k = 400 N/m is compressed by 0.10 m from equilibrium. How much elastic potential energy is stored?',
        options: ['2.0 Joules', '4.0 Joules', '20.0 Joules', '0.20 Joules'],
        answer: 0,
        explanation: 'U_s = ½ k x² = 0.5 × 400 × (0.10)² = 200 × 0.01 = 2.0 Joules.',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 35
      },
      {
        id: 'mech-s3-q1b',
        courseId: 'course-mechanics',
        stageNumber: 3,
        subtopicName: 'Work-Energy Theorem',
        questionType: 'numerical',
        question: 'A spring with k = 800 N/m is compressed by 0.15 m and used to launch a 0.20 kg ball horizontally across a frictionless surface. What is the launch speed?',
        options: ['9.49 m/s', '6.00 m/s', '12.25 m/s', '4.74 m/s'],
        answer: 0,
        explanation: 'Conservation of energy: ½ k x² = ½ m v² => v = x √(k/m) = 0.15 × √(800 / 0.20) = 0.15 × √4000 = 0.15 × 63.245 ≈ 9.49 m/s.',
        difficulty: 'intermediate',
        rewardXp: 75,
        rewardGeo: 45
      },
      {
        id: 'mech-s3-q2',
        courseId: 'course-mechanics',
        stageNumber: 3,
        subtopicName: 'Work-Energy Theorem',
        questionType: 'numerical',
        question: 'A 1500 kg automobile increases its speed from 10 m/s to 30 m/s. What net work was done on the vehicle?',
        options: ['6.0 × 10⁵ J', '3.0 × 10⁵ J', '1.2 × 10⁶ J', '4.5 × 10⁵ J'],
        answer: 0,
        explanation: 'W_net = ΔK = ½ m (v_f² - v_i²) = 0.5 × 1500 × (900 - 100) = 750 × 800 = 600,000 J = 6.0 × 10⁵ J.',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 45
      },
      {
        id: 'mech-s3-q2b',
        courseId: 'course-mechanics',
        stageNumber: 3,
        subtopicName: 'Work-Energy Theorem',
        questionType: 'numerical',
        question: 'A 2000 kg transport truck slows down uniformly from 25 m/s to 15 m/s. How much work is done by the braking system?',
        options: ['-4.0 × 10⁵ J', '-8.0 × 10⁵ J', '-2.0 × 10⁵ J', '-5.0 × 10⁵ J'],
        answer: 0,
        explanation: 'W = ΔK = ½ (2000)(15² - 25²) = 1000 × (225 - 625) = 1000 × (-400) = -400,000 J = -4.0 × 10⁵ J.',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 45
      },
      {
        id: 'mech-s3-q3',
        courseId: 'course-mechanics',
        stageNumber: 3,
        subtopicName: 'Work-Energy Theorem',
        questionType: 'analytical',
        question: 'A conservative force field has potential energy U(x) = 4x³ - 6x. What is the force F(x) acting on a particle at x = 2.0 meters?',
        options: ['-42 N', '+42 N', '-26 N', '+26 N'],
        answer: 0,
        explanation: 'F(x) = -dU/dx = -(12x² - 6) = -12x² + 6. At x = 2: F(2) = -12(4) + 6 = -48 + 6 = -42 N.',
        difficulty: 'hard',
        rewardXp: 85,
        rewardGeo: 55
      },
      {
        id: 'mech-s3-q4',
        courseId: 'course-mechanics',
        stageNumber: 3,
        subtopicName: 'Work-Energy Theorem',
        questionType: 'numerical',
        question: 'An electric motor delivers a steady 750 Watts of power. How long will it take to lift a 150 kg mass vertically by 10.0 meters at constant speed (g = 9.8 m/s²)?',
        options: ['19.6 seconds', '9.8 seconds', '15.0 seconds', '25.2 seconds'],
        answer: 0,
        explanation: 'Work required W = mgh = 150 × 9.8 × 10 = 14,700 J. Time t = W / P = 14,700 / 750 = 19.6 seconds.',
        difficulty: 'intermediate',
        rewardXp: 75,
        rewardGeo: 45
      }
    ],

    // Stage 4: Linear Momentum, Impulse & Collisions
    4: [
      {
        id: 'mech-s4-q1',
        courseId: 'course-mechanics',
        stageNumber: 4,
        subtopicName: 'Linear Momentum & Collisions',
        questionType: 'numerical',
        question: 'A 0.15 kg baseball traveling at 40 m/s is struck by a bat and leaves at 50 m/s in the exact opposite direction. What is the magnitude of the impulse delivered to the ball?',
        options: ['13.5 N·s', '1.5 N·s', '7.5 N·s', '15.0 N·s'],
        answer: 0,
        explanation: 'Impulse J = Δp = m (v_f - v_i). Taking initial direction as positive: J = 0.15 × (-50 - (+40)) = 0.15 × (-90) = -13.5 N·s. Magnitude is 13.5 N·s.',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 45
      },
      {
        id: 'mech-s4-q1b',
        courseId: 'course-mechanics',
        stageNumber: 4,
        subtopicName: 'Linear Momentum & Collisions',
        questionType: 'numerical',
        question: 'A 0.40 kg soccer ball moving at 25 m/s is kicked directly back in the reverse direction at 35 m/s. If the contact time with the boot is 0.020 s, what is the average force exerted?',
        options: ['1200 N', '600 N', '2400 N', '800 N'],
        answer: 0,
        explanation: 'Δp = m(v_f - v_i) = 0.40 × (35 - (-25)) = 0.40 × 60 = 24 N·s. Average force F_avg = Δp / Δt = 24 / 0.020 = 1200 N.',
        difficulty: 'intermediate',
        rewardXp: 75,
        rewardGeo: 45
      },
      {
        id: 'mech-s4-q2',
        courseId: 'course-mechanics',
        stageNumber: 4,
        subtopicName: 'Linear Momentum & Collisions',
        questionType: 'conceptual',
        question: 'In a completely inelastic collision between two moving bodies in an isolated system, which statement is true?',
        options: [
          'Total momentum is conserved, but kinetic energy is not conserved.',
          'Both momentum and kinetic energy are conserved.',
          'Kinetic energy is conserved, but momentum is lost.',
          'Neither momentum nor kinetic energy is conserved.'
        ],
        answer: 0,
        explanation: 'In any collision without external net forces, linear momentum is strictly conserved. In a completely inelastic collision, the maximum possible kinetic energy is converted to internal energy/deformation.',
        difficulty: 'easy',
        rewardXp: 55,
        rewardGeo: 30
      },
      {
        id: 'mech-s4-q3',
        courseId: 'course-mechanics',
        stageNumber: 4,
        subtopicName: 'Linear Momentum & Collisions',
        questionType: 'numerical',
        question: 'A 2.0 kg toy railcar traveling at 3.0 m/s collides and couples with an initially stationary 4.0 kg railcar. What is their combined velocity after the collision?',
        options: ['1.0 m/s', '1.5 m/s', '0.5 m/s', '2.0 m/s'],
        answer: 0,
        explanation: 'Conservation of momentum: m₁ v₁ + m₂ v₂ = (m₁ + m₂) v_f => 2.0 × 3.0 + 4.0 × 0 = (2.0 + 4.0) v_f => 6.0 = 6.0 v_f => v_f = 1.0 m/s.',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 35
      },
      {
        id: 'mech-s4-q3b',
        courseId: 'course-mechanics',
        stageNumber: 4,
        subtopicName: 'Linear Momentum & Collisions',
        questionType: 'numerical',
        question: 'A 1200 kg car moving at 20 m/s collides with a stationary 1800 kg truck and lock bumpers. What is their common speed immediately after the impact?',
        options: ['8.0 m/s', '10.0 m/s', '12.0 m/s', '6.5 m/s'],
        answer: 0,
        explanation: 'Conservation of momentum: (1200 × 20) + (1800 × 0) = (1200 + 1800) v_f => 24,000 = 3000 v_f => v_f = 8.0 m/s.',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 45
      },
      {
        id: 'mech-s4-q4',
        courseId: 'course-mechanics',
        stageNumber: 4,
        subtopicName: 'Linear Momentum & Collisions',
        questionType: 'analytical',
        question: 'A rocket of initial mass M expels fuel at constant relative exhaust velocity u. When the rocket has burned fuel such that its mass is reduced to M / 2, what is its change in velocity Δv (neglecting gravity and drag)?',
        options: ['u ln(2)', '2 u', '0.5 u', 'u / ln(2)'],
        answer: 0,
        explanation: 'Tsiolkovsky Rocket Equation: Δv = u ln(m_i / m_f) = u ln(M / (M/2)) = u ln(2) ≈ 0.693 u.',
        difficulty: 'hard',
        rewardXp: 85,
        rewardGeo: 55
      }
    ],

    // Stage 5: Rotational Dynamics & Torque
    5: [
      {
        id: 'mech-s5-q1',
        courseId: 'course-mechanics',
        stageNumber: 5,
        subtopicName: 'Rotational Dynamics & Apex Synthesis',
        questionType: 'conceptual',
        question: 'A solid cylinder (I = ½ M R²) and a thin cylindrical hoop (I = M R²) of equal mass and radius roll down an incline from rest without slipping. Which reaches the bottom first?',
        options: [
          'The solid cylinder reaches the bottom first.',
          'The thin hoop reaches the bottom first.',
          'They reach the bottom at the exact same time.',
          'Depends on the angle of the incline.'
        ],
        answer: 0,
        explanation: 'The solid cylinder has a smaller fraction of its kinetic energy tied up in rotation (½ vs 1), allocating more energy to translational speed, so its linear acceleration is higher: a = g sin(θ) / (1 + I / (MR²)).',
        difficulty: 'intermediate',
        rewardXp: 75,
        rewardGeo: 50
      },
      {
        id: 'mech-s5-q1b',
        courseId: 'course-mechanics',
        stageNumber: 5,
        subtopicName: 'Rotational Dynamics & Apex Synthesis',
        questionType: 'analytical',
        question: 'A uniform solid sphere (I = 2/5 M R²) rolls without slipping down an incline of height h from rest. What is its linear speed at the bottom?',
        options: ['√(10/7 g h)', '√(2 g h)', '√(4/3 g h)', '√(5/7 g h)'],
        answer: 0,
        explanation: 'Mgh = ½ M v² + ½ (2/5 M R²)(v/R)² = ½ M v² + 1/5 M v² = 7/10 M v². Solving gives v = √(10/7 g h).',
        difficulty: 'hard',
        rewardXp: 85,
        rewardGeo: 55
      },
      {
        id: 'mech-s5-q2',
        courseId: 'course-mechanics',
        stageNumber: 5,
        subtopicName: 'Rotational Dynamics & Apex Synthesis',
        questionType: 'numerical',
        question: 'A figure skater spins with angular velocity ω₀ with arms outstretched. By pulling her arms in, she reduces her moment of inertia to I₀ / 2. Assuming no external torque, what is her new angular velocity?',
        options: ['2 ω₀', 'ω₀ / 2', '4 ω₀', '√2 ω₀'],
        answer: 0,
        explanation: 'Conservation of angular momentum: L_i = L_f => I₀ ω₀ = (I₀ / 2) ω_f => ω_f = 2 ω₀.',
        difficulty: 'easy',
        rewardXp: 65,
        rewardGeo: 40
      },
      {
        id: 'mech-s5-q3',
        courseId: 'course-mechanics',
        stageNumber: 5,
        subtopicName: 'Rotational Dynamics & Apex Synthesis',
        questionType: 'numerical',
        question: 'Two uniform spheres of masses M and 4M have their centers separated by distance D. At what distance from the center of mass M is the center of mass of the system located?',
        options: ['0.8 D', '0.2 D', '0.5 D', '0.25 D'],
        answer: 0,
        explanation: 'Taking mass M at x = 0: x_cm = (M × 0 + 4M × D) / (M + 4M) = (4M D) / (5M) = 4/5 D = 0.8 D.',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 45
      },
      {
        id: 'mech-s5-q4',
        courseId: 'course-mechanics',
        stageNumber: 5,
        subtopicName: 'Rotational Dynamics & Apex Synthesis',
        questionType: 'analytical',
        question: 'A uniform rod of length L and mass M is pivoted smoothly about one end (I = ⅓ M L²). When released from a horizontal position, what is its initial angular acceleration α?',
        options: ['3g / (2L)', 'g / L', '2g / (3L)', '3g / L'],
        answer: 0,
        explanation: 'Torque about pivot: τ = M g (L/2). τ = I α => M g (L/2) = (⅓ M L²) α => α = (M g L / 2) / (⅓ M L²) = 3g / (2L).',
        difficulty: 'hard',
        rewardXp: 90,
        rewardGeo: 60
      },
      {
        id: 'mech-s5-q4b',
        courseId: 'course-mechanics',
        stageNumber: 5,
        subtopicName: 'Rotational Dynamics & Apex Synthesis',
        questionType: 'numerical',
        question: 'A constant net torque of 25.0 N·m is applied to a flywheel with moment of inertia I = 5.0 kg·m². What angular acceleration does it experience?',
        options: ['5.0 rad/s²', '125.0 rad/s²', '0.20 rad/s²', '2.5 rad/s²'],
        answer: 0,
        explanation: 'Using τ = I α: α = τ / I = 25.0 N·m / 5.0 kg·m² = 5.0 rad/s².',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 35
      }
    ]
  },

  // =========================================================================
  // 2. MATHEMATICS — CALCULUS I & DIFFERENTIAL ANALYSIS
  // =========================================================================
  'course-calculus': {
    // Stage 1: Limits & Continuity
    1: [
      {
        id: 'calc-s1-q1',
        courseId: 'course-calculus',
        stageNumber: 1,
        subtopicName: 'Foundational Limits & Continuity',
        questionType: 'analytical',
        question: 'Evaluate the limit: lim (x → 0) [ (e^(4x) - 1) / (2x) ].',
        options: ['2', '4', '1', '0'],
        answer: 0,
        explanation: 'Indeterminate form 0/0. Applying L’Hôpital’s Rule: d/dx(e^(4x) - 1) = 4e^(4x), and d/dx(2x) = 2. lim (x → 0) [ 4e^(4x) / 2 ] = 4(1) / 2 = 2.',
        difficulty: 'easy',
        rewardXp: 55,
        rewardGeo: 30
      },
      {
        id: 'calc-s1-q1b',
        courseId: 'course-calculus',
        stageNumber: 1,
        subtopicName: 'Foundational Limits & Continuity',
        questionType: 'analytical',
        question: 'Evaluate the fundamental trigonometric limit: lim (x → 0) [ sin(6x) / (3x) ].',
        options: ['2', '1', '6', '1/2'],
        answer: 0,
        explanation: 'Using the standard limit lim(θ → 0) [sin(θ)/θ] = 1: lim [2 · (sin(6x) / (6x))] = 2(1) = 2.',
        difficulty: 'easy',
        rewardXp: 55,
        rewardGeo: 30
      },
      {
        id: 'calc-s1-q1c',
        courseId: 'course-calculus',
        stageNumber: 1,
        subtopicName: 'Foundational Limits & Continuity',
        questionType: 'analytical',
        question: 'Evaluate the limit: lim (x → 0) [ (1 - cos(x)) / x² ].',
        options: ['1/2', '1', '0', 'Does not exist'],
        answer: 0,
        explanation: 'Applying L’Hôpital’s Rule twice: lim [sin(x) / (2x)] = lim [cos(x) / 2] = 1/2.',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 40
      },
      {
        id: 'calc-s1-q2',
        courseId: 'course-calculus',
        stageNumber: 1,
        subtopicName: 'Foundational Limits & Continuity',
        questionType: 'analytical',
        question: 'What is lim (x → ∞) [ (5x³ - 2x + 1) / (3x³ + 7x² - 4) ]?',
        options: ['5/3', '0', '∞', '-1/4'],
        answer: 0,
        explanation: 'For polynomials of equal degree in numerator and denominator as x → ∞, the limit equals the ratio of leading coefficients: 5 / 3.',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      },
      {
        id: 'calc-s1-q3',
        courseId: 'course-calculus',
        stageNumber: 1,
        subtopicName: 'Foundational Limits & Continuity',
        questionType: 'conceptual',
        question: 'If -x² ≤ f(x) ≤ x² for all real x, what is lim (x → 0) f(x)?',
        options: ['0', '1', 'Does not exist', 'Undefined'],
        answer: 0,
        explanation: 'By the Squeeze (Sandwich) Theorem: since lim (x → 0) (-x²) = 0 and lim (x → 0) (x²) = 0, f(x) is squeezed to 0 as x → 0.',
        difficulty: 'intermediate',
        rewardXp: 60,
        rewardGeo: 35
      },
      {
        id: 'calc-s1-q4',
        courseId: 'course-calculus',
        stageNumber: 1,
        subtopicName: 'Foundational Limits & Continuity',
        questionType: 'conceptual',
        question: 'At which values of x is f(x) = (x - 2) / (x² - 4) discontinuous, and what are the types of discontinuities?',
        options: [
          'Removable at x = 2; Infinite (vertical asymptote) at x = -2',
          'Jump discontinuity at x = 2 and x = -2',
          'Removable at both x = 2 and x = -2',
          'Continuous everywhere on ℝ'
        ],
        answer: 0,
        explanation: 'x² - 4 = (x - 2)(x + 2). The factor (x - 2) cancels, leaving 1 / (x + 2) for x ≠ 2. Hence, x = 2 is a removable hole (limit exists = 1/4), while x = -2 is a non-removable infinite vertical asymptote.',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 40
      }
    ],

    // Stage 2: Differentiation Techniques & Chain Rule
    2: [
      {
        id: 'calc-s2-q1',
        courseId: 'course-calculus',
        stageNumber: 2,
        subtopicName: 'Chain Rule & Derivative Operators',
        questionType: 'analytical',
        question: 'If y = ln(sec(x) + tan(x)), what is dy/dx?',
        options: ['sec(x)', 'tan(x)', 'sec²(x)', 'sec(x) tan(x)'],
        answer: 0,
        explanation: 'dy/dx = [sec(x)tan(x) + sec²(x)] / [sec(x) + tan(x)] = sec(x)[tan(x) + sec(x)] / [sec(x) + tan(x)] = sec(x).',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 45
      },
      {
        id: 'calc-s2-q1b',
        courseId: 'course-calculus',
        stageNumber: 2,
        subtopicName: 'Chain Rule & Derivative Operators',
        questionType: 'analytical',
        question: 'Find the derivative dy/dx for the function y = ln(x² + 4).',
        options: ['2x / (x² + 4)', '1 / (x² + 4)', '2x (x² + 4)', 'x / (x² + 4)'],
        answer: 0,
        explanation: 'Using the chain rule: d/dx[ln(u)] = (1/u) · du/dx = (1 / (x² + 4)) · (2x) = 2x / (x² + 4).',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 35
      },
      {
        id: 'calc-s2-q2',
        courseId: 'course-calculus',
        stageNumber: 2,
        subtopicName: 'Chain Rule & Derivative Operators',
        questionType: 'numerical',
        question: 'Find dy/dx implicitly for the curve: x² + y² = 25 at the coordinate point (3, 4).',
        options: ['-3/4', '3/4', '-4/3', '4/3'],
        answer: 0,
        explanation: 'Differentiating both sides: 2x + 2y (dy/dx) = 0 => dy/dx = -x / y. At (3, 4), dy/dx = -3/4.',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 35
      },
      {
        id: 'calc-s2-q2b',
        courseId: 'course-calculus',
        stageNumber: 2,
        subtopicName: 'Chain Rule & Derivative Operators',
        questionType: 'numerical',
        question: 'Using implicit differentiation for the folium curve x³ + y³ = 9, what is dy/dx at the point (1, 2)?',
        options: ['-1/4', '-1/2', '1/4', '-3/4'],
        answer: 0,
        explanation: 'Differentiating implicitly: 3x² + 3y² (dy/dx) = 0 => dy/dx = -x² / y². At (1, 2): dy/dx = -(1²) / (2²) = -1/4.',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 40
      },
      {
        id: 'calc-s2-q3',
        courseId: 'course-calculus',
        stageNumber: 2,
        subtopicName: 'Chain Rule & Derivative Operators',
        questionType: 'analytical',
        question: 'What is the derivative of f(x) = x^(x) for x > 0?',
        options: ['x^(x) · (ln(x) + 1)', 'x · x^(x - 1)', 'x^(x) · ln(x)', 'x^(x - 1)'],
        answer: 0,
        explanation: 'Using logarithmic differentiation: y = x^x => ln(y) = x ln(x). Differentiating: (1/y) y\' = ln(x) + x(1/x) = ln(x) + 1 => y\' = x^x (ln(x) + 1).',
        difficulty: 'hard',
        rewardXp: 80,
        rewardGeo: 50
      },
      {
        id: 'calc-s2-q4',
        courseId: 'course-calculus',
        stageNumber: 2,
        subtopicName: 'Chain Rule & Derivative Operators',
        questionType: 'numerical',
        question: 'A spherical balloon is being inflated such that its volume increases at 100 cm³/s. At what rate is the radius increasing when r = 5.0 cm?',
        options: ['1 / π cm/s', '2 / π cm/s', '4π cm/s', '1 / (25π) cm/s'],
        answer: 0,
        explanation: 'V = 4/3 π r³ => dV/dt = 4π r² (dr/dt). 100 = 4π (5)² (dr/dt) = 4π(25) dr/dt = 100π dr/dt => dr/dt = 100 / (100π) = 1 / π cm/s.',
        difficulty: 'hard',
        rewardXp: 85,
        rewardGeo: 55
      }
    ],

    // Stage 3: Optimization, Extrema & Concavity
    3: [
      {
        id: 'calc-s3-q1',
        courseId: 'course-calculus',
        stageNumber: 3,
        subtopicName: 'Optimization & Concavity',
        questionType: 'analytical',
        question: 'Find all critical numbers of the function f(x) = x³ - 3x² - 9x + 5.',
        options: ['x = -1 and x = 3', 'x = 1 and x = -3', 'x = 3 only', 'x = 0 and x = 3'],
        answer: 0,
        explanation: 'f\'(x) = 3x² - 6x - 9 = 3(x² - 2x - 3) = 3(x - 3)(x + 1). Setting f\'(x) = 0 yields critical points at x = 3 and x = -1.',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 35
      },
      {
        id: 'calc-s3-q1b',
        courseId: 'course-calculus',
        stageNumber: 3,
        subtopicName: 'Optimization & Concavity',
        questionType: 'analytical',
        question: 'Find the critical points of the function g(x) = 2x³ - 6x.',
        options: ['x = -1 and x = 1', 'x = 0 only', 'x = -√3 and x = √3', 'x = 2 and x = -2'],
        answer: 0,
        explanation: 'g\'(x) = 6x² - 6 = 6(x² - 1) = 0 => x = ±1.',
        difficulty: 'easy',
        rewardXp: 55,
        rewardGeo: 30
      },
      {
        id: 'calc-s3-q2',
        courseId: 'course-calculus',
        stageNumber: 3,
        subtopicName: 'Optimization & Concavity',
        questionType: 'analytical',
        question: 'What is the x-coordinate of the inflection point of the cubic curve f(x) = 2x³ - 6x² + 4x - 1?',
        options: ['x = 1', 'x = 2', 'x = 0', 'x = 3'],
        answer: 0,
        explanation: 'f\'(x) = 6x² - 12x + 4. f\'\'(x) = 12x - 12. Setting f\'\'(x) = 0 gives 12x = 12 => x = 1. Since f\'\' changes sign at x = 1, it is an inflection point.',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 40
      },
      {
        id: 'calc-s3-q3',
        courseId: 'course-calculus',
        stageNumber: 3,
        subtopicName: 'Optimization & Concavity',
        questionType: 'numerical',
        question: 'A farmer wants to fence in a rectangular field with fixed perimeter of 400 meters. What dimensions maximize the enclosed area?',
        options: ['100 m × 100 m', '150 m × 50 m', '120 m × 80 m', '200 m × 0 m'],
        answer: 0,
        explanation: 'Perimeter 2x + 2y = 400 => y = 200 - x. Area A(x) = x(200 - x) = 200x - x². A\'(x) = 200 - 2x = 0 => x = 100 m, y = 100 m (a square).',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 45
      },
      {
        id: 'calc-s3-q3b',
        courseId: 'course-calculus',
        stageNumber: 3,
        subtopicName: 'Optimization & Concavity',
        questionType: 'numerical',
        question: 'A gardener encloses a rectangular vegetable patch adjacent to a stone wall (requiring fencing on only 3 sides). With 120 meters of fencing, what is the maximum area?',
        options: ['1800 m²', '1600 m²', '2400 m²', '900 m²'],
        answer: 0,
        explanation: '2x + y = 120 => y = 120 - 2x. Area A(x) = x(120 - 2x) = 120x - 2x². A\'(x) = 120 - 4x = 0 => x = 30 m, y = 60 m. Max Area = 30 × 60 = 1800 m².',
        difficulty: 'intermediate',
        rewardXp: 75,
        rewardGeo: 45
      },
      {
        id: 'calc-s3-q4',
        courseId: 'course-calculus',
        stageNumber: 3,
        subtopicName: 'Optimization & Concavity',
        questionType: 'conceptual',
        question: 'Does f(x) = |x| satisfy the Mean Value Theorem on [-1, 2]?',
        options: [
          'No, because f is not differentiable at x = 0.',
          'Yes, because f is continuous everywhere.',
          'No, because f is discontinuous at x = 0.',
          'Yes, with c = 0.5.'
        ],
        answer: 0,
        explanation: 'The Mean Value Theorem requires the function to be continuous on [a, b] AND differentiable on (a, b). Since |x| has a sharp cusp at x = 0, it is not differentiable there.',
        difficulty: 'hard',
        rewardXp: 80,
        rewardGeo: 50
      }
    ],

    // Stage 4: Integration & The Fundamental Theorem
    4: [
      {
        id: 'calc-s4-q1',
        courseId: 'course-calculus',
        stageNumber: 4,
        subtopicName: 'Integration & Fundamental Theorem',
        questionType: 'analytical',
        question: 'Evaluate the indefinite integral: ∫ (2x / (x² + 1)) dx.',
        options: ['ln(x² + 1) + C', 'arctan(x) + C', '2 ln|x| + C', '1 / (x² + 1)² + C'],
        answer: 0,
        explanation: 'Let u = x² + 1, then du = 2x dx. The integral becomes ∫ (1/u) du = ln|u| + C = ln(x² + 1) + C.',
        difficulty: 'easy',
        rewardXp: 55,
        rewardGeo: 30
      },
      {
        id: 'calc-s4-q1b',
        courseId: 'course-calculus',
        stageNumber: 4,
        subtopicName: 'Integration & Fundamental Theorem',
        questionType: 'analytical',
        question: 'Evaluate the indefinite integral: ∫ (3x² / (x³ + 5)) dx.',
        options: ['ln|x³ + 5| + C', '3 ln|x³ + 5| + C', '1 / (x³ + 5) + C', 'x³ ln(x) + C'],
        answer: 0,
        explanation: 'Let u = x³ + 5, then du = 3x² dx. ∫ (1/u) du = ln|u| + C = ln|x³ + 5| + C.',
        difficulty: 'easy',
        rewardXp: 55,
        rewardGeo: 30
      },
      {
        id: 'calc-s4-q2',
        courseId: 'course-calculus',
        stageNumber: 4,
        subtopicName: 'Integration & Fundamental Theorem',
        questionType: 'analytical',
        question: 'If F(x) = ∫ from 1 to x² of [ sqrt(t³ + 1) ] dt, what is F\'(x)?',
        options: [
          '2x · sqrt(x⁶ + 1)',
          'sqrt(x⁶ + 1)',
          '2x · sqrt(x³ + 1)',
          'sqrt(x³ + 1)'
        ],
        answer: 0,
        explanation: 'By the Fundamental Theorem of Calculus and Chain Rule: d/dx [∫ from a to g(x) f(t) dt] = f(g(x)) · g\'(x). Here f(x²) = sqrt((x²)³ + 1) = sqrt(x⁶ + 1), and g\'(x) = 2x.',
        difficulty: 'hard',
        rewardXp: 80,
        rewardGeo: 50
      },
      {
        id: 'calc-s4-q3',
        courseId: 'course-calculus',
        stageNumber: 4,
        subtopicName: 'Integration & Fundamental Theorem',
        questionType: 'numerical',
        question: 'Evaluate: ∫ from 0 to π/4 of [ sec²(x) dx ].',
        options: ['1', '√2', 'π/4', '0'],
        answer: 0,
        explanation: 'The antiderivative of sec²(x) is tan(x). Evaluating from 0 to π/4: tan(π/4) - tan(0) = 1 - 0 = 1.',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 35
      },
      {
        id: 'calc-s4-q3b',
        courseId: 'course-calculus',
        stageNumber: 4,
        subtopicName: 'Integration & Fundamental Theorem',
        questionType: 'numerical',
        question: 'Evaluate the definite integral: ∫ from 0 to 1 of (3x² + 2x + 1) dx.',
        options: ['3', '2', '6', '1'],
        answer: 0,
        explanation: 'Antiderivative is [x³ + x² + x] from 0 to 1 = (1 + 1 + 1) - 0 = 3.',
        difficulty: 'easy',
        rewardXp: 55,
        rewardGeo: 30
      },
      {
        id: 'calc-s4-q4',
        courseId: 'course-calculus',
        stageNumber: 4,
        subtopicName: 'Integration & Fundamental Theorem',
        questionType: 'analytical',
        question: 'Using integration by parts (∫ u dv = uv - ∫ v du), evaluate ∫ x · e^x dx.',
        options: ['x e^x - e^x + C', 'x e^x + e^x + C', '½ x² e^x + C', 'e^x + C'],
        answer: 0,
        explanation: 'Let u = x (du = dx) and dv = e^x dx (v = e^x). ∫ x e^x dx = x e^x - ∫ e^x dx = x e^x - e^x + C.',
        difficulty: 'intermediate',
        rewardXp: 75,
        rewardGeo: 45
      }
    ],

    // Stage 5: Multivariable & Demigod Synthesis
    5: [
      {
        id: 'calc-s5-q1',
        courseId: 'course-calculus',
        stageNumber: 5,
        subtopicName: 'Comprehensive Calculus Demigod Synthesis',
        questionType: 'analytical',
        question: 'What is the volume of the solid generated by revolving the region bounded by y = x² and y = 0 from x = 0 to 2 about the x-axis?',
        options: ['32π / 5', '16π / 5', '8π / 3', '64π / 5'],
        answer: 0,
        explanation: 'Disk method: V = π ∫ from 0 to 2 of [y²] dx = π ∫ from 0 to 2 of [x⁴] dx = π [x⁵ / 5] from 0 to 2 = π (32 / 5) = 32π / 5.',
        difficulty: 'intermediate',
        rewardXp: 85,
        rewardGeo: 55
      },
      {
        id: 'calc-s5-q2',
        courseId: 'course-calculus',
        stageNumber: 5,
        subtopicName: 'Comprehensive Calculus Demigod Synthesis',
        questionType: 'analytical',
        question: 'Evaluate the improper integral: ∫ from 1 to ∞ of [ 1 / x² ] dx.',
        options: ['1', 'Diverges to ∞', '0', '1/2'],
        answer: 0,
        explanation: 'lim (b → ∞) ∫ from 1 to b of [ x^(-2) ] dx = lim (b → ∞) [ -1/x ] from 1 to b = lim (b → ∞) [ -1/b - (-1/1) ] = 0 + 1 = 1.',
        difficulty: 'intermediate',
        rewardXp: 80,
        rewardGeo: 50
      },
      {
        id: 'calc-s5-q2b',
        courseId: 'course-calculus',
        stageNumber: 5,
        subtopicName: 'Comprehensive Calculus Demigod Synthesis',
        questionType: 'conceptual',
        question: 'What is the behavior of the improper integral: ∫ from 1 to ∞ of [ 1 / x ] dx?',
        options: ['Diverges to ∞ (p-integral with p = 1)', 'Converges to 1', 'Converges to 0', 'Converges to ln(2)'],
        answer: 0,
        explanation: 'For p-integrals ∫ 1/x^p dx on [1, ∞), convergence requires p > 1. For p = 1, [ln(x)] diverges to ∞.',
        difficulty: 'intermediate',
        rewardXp: 75,
        rewardGeo: 45
      },
      {
        id: 'calc-s5-q3',
        courseId: 'course-calculus',
        stageNumber: 5,
        subtopicName: 'Comprehensive Calculus Demigod Synthesis',
        questionType: 'analytical',
        question: 'Find the general solution to the separable differential equation: dy/dx = 2x y.',
        options: ['y = C e^(x²)', 'y = x² + C', 'y = e^(2x) + C', 'y = C ln(x)'],
        answer: 0,
        explanation: 'Separating variables: (1/y) dy = 2x dx => ∫ (1/y) dy = ∫ 2x dx => ln|y| = x² + C₁ => y = C e^(x²).',
        difficulty: 'hard',
        rewardXp: 90,
        rewardGeo: 60
      },
      {
        id: 'calc-s5-q4',
        courseId: 'course-calculus',
        stageNumber: 5,
        subtopicName: 'Comprehensive Calculus Demigod Synthesis',
        questionType: 'analytical',
        question: 'What is the radius of convergence R for the power series: ∑ from n=1 to ∞ of [ (x^n) / (n · 3^n) ]?',
        options: ['R = 3', 'R = 1/3', 'R = 1', 'R = ∞'],
        answer: 0,
        explanation: 'Ratio test: lim |a_{n+1}/a_n| = lim |x^(n+1) / ((n+1) 3^(n+1)) · (n 3^n) / x^n| = (|x| / 3) lim [n / (n+1)] = |x| / 3 < 1 => |x| < 3. R = 3.',
        difficulty: 'hard',
        rewardXp: 95,
        rewardGeo: 65
      },
      {
        id: 'calc-s5-q4b',
        courseId: 'course-calculus',
        stageNumber: 5,
        subtopicName: 'Comprehensive Calculus Demigod Synthesis',
        questionType: 'conceptual',
        question: 'What is the Maclaurin series expansion of the exponential function e^x?',
        options: [
          '∑ from n=0 to ∞ of [ x^n / n! ]',
          '∑ from n=0 to ∞ of [ (-1)^n x^n / n! ]',
          '∑ from n=1 to ∞ of [ x^n / n ]',
          '∑ from n=0 to ∞ of [ x^(2n) / (2n)! ]'
        ],
        answer: 0,
        explanation: 'Since all derivatives of e^x at x = 0 equal 1, the Taylor/Maclaurin series is ∑ x^n / n! = 1 + x + x²/2! + x³/3! + ...',
        difficulty: 'easy',
        rewardXp: 65,
        rewardGeo: 40
      }
    ]
  },

  // =========================================================================
  // 3. COMPUTER SCIENCE — DATA STRUCTURES & ALGORITHMS
  // =========================================================================
  'course-cs': {
    // Stage 1: Asymptotic Complexity & Master Theorem
    1: [
      {
        id: 'cs-s1-q1',
        courseId: 'course-cs',
        stageNumber: 1,
        subtopicName: 'Asymptotic Complexity & Big-O',
        questionType: 'analytical',
        question: 'Using the Master Theorem, what is the asymptotic time complexity of the recurrence: T(n) = 2 T(n/2) + O(n)?',
        options: ['Θ(n log n)', 'Θ(n)', 'Θ(n²)', 'Θ(log n)'],
        answer: 0,
        explanation: 'Here a = 2, b = 2, log_b(a) = log₂(2) = 1. The work at each level f(n) = O(n¹) matches n^(log_b(a)). By Case 2 of Master Theorem, T(n) = Θ(n log n) (classic MergeSort).',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 40
      },
      {
        id: 'cs-s1-q1b',
        courseId: 'course-cs',
        stageNumber: 1,
        subtopicName: 'Asymptotic Complexity & Big-O',
        questionType: 'analytical',
        question: 'Using the Master Theorem, what is the asymptotic complexity of the recurrence: T(n) = 4 T(n/2) + O(n)?',
        options: ['Θ(n²)', 'Θ(n log n)', 'Θ(n³)', 'Θ(n)'],
        answer: 0,
        explanation: 'Here a = 4, b = 2, log_b(a) = log₂(4) = 2. Since f(n) = O(n) is polynomial smaller than n² (n^(2 - ε)), Case 1 applies: T(n) = Θ(n²).',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 45
      },
      {
        id: 'cs-s1-q2',
        courseId: 'course-cs',
        stageNumber: 1,
        subtopicName: 'Asymptotic Complexity & Big-O',
        questionType: 'conceptual',
        question: 'Which of the following functions grows the fastest asymptotically as n → ∞?',
        options: ['n!', '2^n', 'n³', 'n log n'],
        answer: 0,
        explanation: 'Factorial growth (n!) outpaces exponential growth (2^n) which outpaces polynomial (n³) and linearithmic (n log n).',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      },
      {
        id: 'cs-s1-q3',
        courseId: 'course-cs',
        stageNumber: 1,
        subtopicName: 'Asymptotic Complexity & Big-O',
        questionType: 'conceptual',
        question: 'What is the amortized time complexity of inserting n elements into an initially empty dynamic array with doubling capacity?',
        options: ['O(1) per insert', 'O(n) per insert', 'O(log n) per insert', 'O(n²) total'],
        answer: 0,
        explanation: 'Although individual resizing operations take O(k) time, array doubling occurs infrequently enough that the total work for n insertions is O(n), yielding an amortized cost of O(1) per insert.',
        difficulty: 'intermediate',
        rewardXp: 60,
        rewardGeo: 35
      },
      {
        id: 'cs-s1-q4',
        courseId: 'course-cs',
        stageNumber: 1,
        subtopicName: 'Asymptotic Complexity & Big-O',
        questionType: 'conceptual',
        question: 'What is the tight lower bound for comparison-based sorting algorithms in the worst case?',
        options: ['Ω(n log n)', 'Ω(n)', 'Ω(n²)', 'Ω(log n)'],
        answer: 0,
        explanation: 'A decision tree for comparison sorting of n elements has n! leaves. The minimum tree height is log₂(n!) = Ω(n log n) by Stirling’s approximation.',
        difficulty: 'hard',
        rewardXp: 80,
        rewardGeo: 50
      },
      {
        id: 'cs-s1-q4b',
        courseId: 'course-cs',
        stageNumber: 1,
        subtopicName: 'Asymptotic Complexity & Big-O',
        questionType: 'conceptual',
        question: 'What is the optimal time complexity to find the minimum element in an unsorted array of n elements?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
        answer: 0,
        explanation: 'In an unsorted array, every element must be inspected at least once to ensure no smaller value exists, requiring linear O(n) time.',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      }
    ],

    // Stage 2: Memory Hierarchy, Stack & Heap
    2: [
      {
        id: 'cs-s2-q1',
        courseId: 'course-cs',
        stageNumber: 2,
        subtopicName: 'Memory & Execution Stack',
        questionType: 'conceptual',
        question: 'Where are dynamic object allocations managed and garbage collected in modern language runtimes (e.g., V8, JVM)?',
        options: ['Heap Memory', 'Call Stack', 'CPU Registers', 'Static Data Segment'],
        answer: 0,
        explanation: 'Dynamic objects, arrays, and closures with variable lifetimes are allocated on the Heap and tracked by automatic garbage collection.',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      },
      {
        id: 'cs-s2-q1b',
        courseId: 'course-cs',
        stageNumber: 2,
        subtopicName: 'Memory & Execution Stack',
        questionType: 'conceptual',
        question: 'Where are local primitive variables and active execution frames stored in a running thread?',
        options: ['Call Stack', 'Heap Memory', 'Hard Disk Swap', 'Static BSS Segment'],
        answer: 0,
        explanation: 'Function frames, return addresses, and local scalar variables are pushed onto and popped from the contiguous Call Stack in LIFO order.',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      },
      {
        id: 'cs-s2-q2',
        courseId: 'course-cs',
        stageNumber: 2,
        subtopicName: 'Memory & Execution Stack',
        questionType: 'analytical',
        question: 'What is the space complexity of a recursive depth-first search on a tree with maximum depth h?',
        options: ['O(h)', 'O(n)', 'O(1)', 'O(h²)'],
        answer: 0,
        explanation: 'The call stack grows proportional to the maximum height of the recursion tree, requiring O(h) activation records.',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 40
      },
      {
        id: 'cs-s2-q3',
        courseId: 'course-cs',
        stageNumber: 2,
        subtopicName: 'Memory & Execution Stack',
        questionType: 'conceptual',
        question: 'In JavaScript, why does `typeof NaN` return "number"?',
        options: [
          'IEEE 754 floating-point standard specifies NaN as a numerical error value within the floating-point type.',
          'It is an unintended bug from JavaScript 1.0 that was never fixed.',
          'NaN is converted to zero before typeof evaluates it.',
          'typeof only recognizes string, object, and number.'
        ],
        answer: 0,
        explanation: 'NaN stands for "Not-a-Number", but per IEEE 754 floating-point specification, it is a numeric data type representing an undefined or unrepresentable numerical result (e.g., 0/0).',
        difficulty: 'intermediate',
        rewardXp: 60,
        rewardGeo: 35
      },
      {
        id: 'cs-s2-q4',
        courseId: 'course-cs',
        stageNumber: 2,
        subtopicName: 'Memory & Execution Stack',
        questionType: 'conceptual',
        question: 'What occurs when an uncontrolled recursive function exceeds maximum call stack capacity?',
        options: ['Stack Overflow Exception', 'Out of Memory (Heap) error', 'Silent truncation', 'Segmentation Fault in swap'],
        answer: 0,
        explanation: 'Each function invocation pushes a new frame onto the stack. Without a terminating base case, the allotted stack memory is exhausted, throwing a StackOverflow error.',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      },
      {
        id: 'cs-s2-q4b',
        courseId: 'course-cs',
        stageNumber: 2,
        subtopicName: 'Memory & Execution Stack',
        questionType: 'conceptual',
        question: 'What defines a memory leak in a garbage-collected language environment?',
        options: [
          'Unused memory that remains referenced by active roots and cannot be reclaimed by the garbage collector.',
          'Memory consumed by the operating system kernel.',
          'Deallocated pointers accessed after free.',
          'Variable names longer than 256 characters.'
        ],
        answer: 0,
        explanation: 'A memory leak occurs when application objects that are no longer needed remain reachable from root references (e.g. global maps, event listeners), preventing garbage collection.',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 40
      }
    ],

    // Stage 3: Balanced Trees & Traversals
    3: [
      {
        id: 'cs-s3-q1',
        courseId: 'course-cs',
        stageNumber: 3,
        subtopicName: 'AVL & Binary Search Trees',
        questionType: 'conceptual',
        question: 'In an AVL tree, what is the balance factor condition required at every single node?',
        options: ['Balance factor ∈ {-1, 0, +1}', 'Balance factor = 0 only', 'Balance factor ≤ 2', 'Height(left) = Height(right)'],
        answer: 0,
        explanation: 'An AVL tree maintains height balance such that for every node, |height(left) - height(right)| ≤ 1, ensuring O(log n) lookups.',
        difficulty: 'easy',
        rewardXp: 55,
        rewardGeo: 30
      },
      {
        id: 'cs-s3-q2',
        courseId: 'course-cs',
        stageNumber: 3,
        subtopicName: 'AVL & Binary Search Trees',
        questionType: 'conceptual',
        question: 'What tree rotation is performed when an insertion occurs into the right subtree of the left child (LR case)?',
        options: ['Left-Right Double Rotation', 'Single Right Rotation', 'Single Left Rotation', 'Right-Left Double Rotation'],
        answer: 0,
        explanation: 'An LR imbalance is restored by first performing a Left rotation on the left child, followed by a Right rotation on the root.',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 45
      },
      {
        id: 'cs-s3-q3',
        courseId: 'course-cs',
        stageNumber: 3,
        subtopicName: 'AVL & Binary Search Trees',
        questionType: 'conceptual',
        question: 'Which tree traversal produces keys in strictly non-decreasing sorted order for a valid Binary Search Tree?',
        options: ['In-order (Left, Root, Right)', 'Pre-order (Root, Left, Right)', 'Post-order (Left, Right, Root)', 'Level-order (BFS)'],
        answer: 0,
        explanation: 'In-order traversal visits all elements smaller than the root, then the root itself, then all elements larger, yielding sorted output.',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      },
      {
        id: 'cs-s3-q4',
        courseId: 'course-cs',
        stageNumber: 3,
        subtopicName: 'AVL & Binary Search Trees',
        questionType: 'analytical',
        question: 'What is the worst-case time complexity of Red-Black Tree insertion of an element?',
        options: ['O(log n)', 'O(n)', 'O(1)', 'O(n log n)'],
        answer: 0,
        explanation: 'Red-Black trees ensure the path from root to farthest leaf is at most twice as long as to the nearest. Lookup, insertion, and deletion all run in O(log n).',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 40
      },
      {
        id: 'cs-s3-q4b',
        courseId: 'course-cs',
        stageNumber: 3,
        subtopicName: 'AVL & Binary Search Trees',
        questionType: 'analytical',
        question: 'What is the minimum possible height of a binary tree containing n nodes?',
        options: ['⌊log₂(n)⌋', 'n - 1', 'n / 2', '2^n'],
        answer: 0,
        explanation: 'In a complete binary tree, level k contains up to 2^k nodes. The minimum height is ⌊log₂(n)⌋.',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 35
      },
      {
        id: 'cs-s3-q4c',
        courseId: 'course-cs',
        stageNumber: 3,
        subtopicName: 'AVL & Binary Search Trees',
        questionType: 'conceptual',
        question: 'In a degenerate, completely unbalanced Binary Search Tree (resembling a linked list), what is the search time complexity?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
        answer: 0,
        explanation: 'If items are inserted in sorted order without balancing, the tree degenerates into a linear chain, leading to worst-case O(n) search time.',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      }
    ],

    // Stage 4: Graph Algorithms & Traversals
    4: [
      {
        id: 'cs-s4-q1',
        courseId: 'course-cs',
        stageNumber: 4,
        subtopicName: 'Graph Algorithms',
        questionType: 'conceptual',
        question: 'Which data structure is used to implement Breadth-First Search (BFS) traversal of a graph?',
        options: ['FIFO Queue', 'LIFO Stack', 'Priority Queue (Min-Heap)', 'Binary Search Tree'],
        answer: 0,
        explanation: 'BFS explores vertices level by level, requiring a First-In First-Out (FIFO) queue to process discovered nodes in arrival order.',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      },
      {
        id: 'cs-s4-q1b',
        courseId: 'course-cs',
        stageNumber: 4,
        subtopicName: 'Graph Algorithms',
        questionType: 'conceptual',
        question: 'Which data structure is used to implement Depth-First Search (DFS) iteratively?',
        options: ['LIFO Stack', 'FIFO Queue', 'Hash Table', 'Disjoint Set'],
        answer: 0,
        explanation: 'DFS dives as deeply as possible before backtracking, which naturally maps to the Last-In First-Out (LIFO) behavior of a stack.',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      },
      {
        id: 'cs-s4-q2',
        courseId: 'course-cs',
        stageNumber: 4,
        subtopicName: 'Graph Algorithms',
        questionType: 'conceptual',
        question: 'What will happen if Dijkstra’s algorithm is executed on a graph containing negative edge weights?',
        options: [
          'It may produce incorrect shortest paths because it assumes visited nodes have finalized distances.',
          'It automatically converts them to positive numbers.',
          'It runs in O(V³) time like Floyd-Warshall.',
          'It is guaranteed to work as long as there are no negative cycles.'
        ],
        answer: 0,
        explanation: 'Dijkstra’s greedy choice property assumes that once a vertex is extracted from the priority queue, its shortest path is permanently determined. Negative weights violate this assumption.',
        difficulty: 'intermediate',
        rewardXp: 75,
        rewardGeo: 50
      },
      {
        id: 'cs-s4-q3',
        courseId: 'course-cs',
        stageNumber: 4,
        subtopicName: 'Graph Algorithms',
        questionType: 'analytical',
        question: 'What is the time complexity of Dijkstra’s algorithm using a min-heap priority queue for a graph with V vertices and E edges?',
        options: ['O((V + E) log V)', 'O(V²)', 'O(V · E)', 'O(E log E)'],
        answer: 0,
        explanation: 'Each vertex is extracted from the heap in O(log V), and each edge relaxation updates the heap in O(log V), yielding total time O((V + E) log V).',
        difficulty: 'intermediate',
        rewardXp: 75,
        rewardGeo: 50
      },
      {
        id: 'cs-s4-q4',
        courseId: 'course-cs',
        stageNumber: 4,
        subtopicName: 'Graph Algorithms',
        questionType: 'analytical',
        question: 'Which algorithm detects whether a directed graph contains a cycle in O(V + E) time?',
        options: ['DFS with 3-color vertex marking (white, gray, black)', 'Dijkstra’s Algorithm', 'Kruskal’s Algorithm', 'Prim’s Algorithm'],
        answer: 0,
        explanation: 'A directed graph has a cycle if and only if DFS encounters a "back edge" leading to a vertex currently in the recursion stack (marked gray).',
        difficulty: 'hard',
        rewardXp: 85,
        rewardGeo: 55
      },
      {
        id: 'cs-s4-q4b',
        courseId: 'course-cs',
        stageNumber: 4,
        subtopicName: 'Graph Algorithms',
        questionType: 'conceptual',
        question: 'Which problem do Prim\'s and Kruskal\'s greedy algorithms solve on a connected, undirected weighted graph?',
        options: ['Minimum Spanning Tree (MST)', 'All-Pairs Shortest Paths', 'Maximum Bipartite Matching', 'Eulerian Path'],
        answer: 0,
        explanation: 'Both Prim\'s and Kruskal\'s algorithms compute a Minimum Spanning Tree (MST), connecting all vertices with minimum total edge weight.',
        difficulty: 'easy',
        rewardXp: 55,
        rewardGeo: 30
      }
    ],

    // Stage 5: Dynamic Programming & Apex Synthesis
    5: [
      {
        id: 'cs-s5-q1',
        courseId: 'course-cs',
        stageNumber: 5,
        subtopicName: 'Advanced Dynamic Programming',
        questionType: 'analytical',
        question: 'In the 0/1 Knapsack Problem with N items and capacity W, what is the time complexity of the standard DP solution?',
        options: ['O(N · W) pseudo-polynomial', 'O(2^N) strictly', 'O(N log W)', 'O(W²)'],
        answer: 0,
        explanation: 'The DP table size is (N + 1) × (W + 1), and each state transition requires O(1) computation, taking O(N · W) time. It is pseudo-polynomial because W depends on the numeric value, not input bit length.',
        difficulty: 'intermediate',
        rewardXp: 80,
        rewardGeo: 50
      },
      {
        id: 'cs-s5-q2',
        courseId: 'course-cs',
        stageNumber: 5,
        subtopicName: 'Advanced Dynamic Programming',
        questionType: 'analytical',
        question: 'What is the length of the Longest Common Subsequence (LCS) between strings "ABCDE" and "ACE"?',
        options: ['3', '2', '4', '1'],
        answer: 0,
        explanation: 'The common characters appearing in order are "A", "C", and "E", forming an LCS of length 3 ("ACE").',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 35
      },
      {
        id: 'cs-s5-q2b',
        courseId: 'course-cs',
        stageNumber: 5,
        subtopicName: 'Advanced Dynamic Programming',
        questionType: 'numerical',
        question: 'What is the Edit Distance (Levenshtein Distance) between "kitten" and "sitting"?',
        options: ['3', '2', '4', '1'],
        answer: 0,
        explanation: 'Three operations: substitute k -> s ("sitten"), substitute e -> i ("sittin"), append g ("sitting"). Total cost = 3.',
        difficulty: 'intermediate',
        rewardXp: 75,
        rewardGeo: 45
      },
      {
        id: 'cs-s5-q3',
        courseId: 'course-cs',
        stageNumber: 5,
        subtopicName: 'Advanced Dynamic Programming',
        questionType: 'conceptual',
        question: 'Which algorithmic paradigm computes shortest paths between all pairs of vertices in a graph in O(V³) time?',
        options: ['Floyd-Warshall Algorithm', 'Bellman-Ford Algorithm', 'Dijkstra with Fibonacci Heap', 'Kruskal Algorithm'],
        answer: 0,
        explanation: 'Floyd-Warshall dynamic programming uses recurrence dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]) through three nested loops over V vertices.',
        difficulty: 'hard',
        rewardXp: 85,
        rewardGeo: 55
      },
      {
        id: 'cs-s5-q4',
        courseId: 'course-cs',
        stageNumber: 5,
        subtopicName: 'Advanced Dynamic Programming',
        questionType: 'numerical',
        question: 'How many ways can a staircase of 4 steps be climbed if you can take either 1 or 2 steps at a time?',
        options: ['5 ways', '4 ways', '8 ways', '3 ways'],
        answer: 0,
        explanation: 'This follows the Fibonacci relation dp[n] = dp[n-1] + dp[n-2]: dp[1] = 1, dp[2] = 2, dp[3] = 3, dp[4] = 3 + 2 = 5 ways.',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 35
      },
      {
        id: 'cs-s5-q4b',
        courseId: 'course-cs',
        stageNumber: 5,
        subtopicName: 'Advanced Dynamic Programming',
        questionType: 'conceptual',
        question: 'What two fundamental properties must a computational problem exhibit for Dynamic Programming to be applicable?',
        options: [
          'Optimal Substructure and Overlapping Subproblems',
          'Greedy Choice and Constant Memory',
          'Divide and Conquer and Parallelizability',
          'Linear Independence and Associativity'
        ],
        answer: 0,
        explanation: 'Dynamic Programming requires that an optimal solution can be constructed from optimal solutions of subproblems (Optimal Substructure) and that the same subproblems are solved repeatedly (Overlapping Subproblems).',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 45
      }
    ]
  },

  // =========================================================================
  // 4. PHYSICS II — ELECTROMAGNETISM & FIELD THEORY
  // =========================================================================
  'course-electromagnetism': {
    // Stage 1: Coulomb's Law & Electrostatics
    1: [
      {
        id: 'em-s1-q1',
        courseId: 'course-electromagnetism',
        stageNumber: 1,
        subtopicName: 'Coulomb’s Electrostatic Law',
        questionType: 'numerical',
        question: 'Two identical charges of +2.0 μC are separated by 0.30 meters in vacuum (k = 8.99 × 10⁹ N·m²/C²). What is the magnitude of the repulsive electrostatic force between them?',
        options: ['0.40 N', '4.0 N', '0.040 N', '1.20 N'],
        answer: 0,
        explanation: 'F = k |q₁ q₂| / r² = (8.99 × 10⁹) × (2.0 × 10⁻⁶)² / (0.30)² = (8.99 × 10⁹ × 4.0 × 10⁻¹²) / 0.09 = 35.96 / 0.09 ≈ 0.40 N.',
        difficulty: 'easy',
        rewardXp: 55,
        rewardGeo: 30
      },
      {
        id: 'em-s1-q1b',
        courseId: 'course-electromagnetism',
        stageNumber: 1,
        subtopicName: 'Coulomb’s Electrostatic Law',
        questionType: 'numerical',
        question: 'Two point charges of +3.0 μC and -4.0 μC are separated by 0.20 meters in vacuum (k ≈ 9.0 × 10⁹ N·m²/C²). What is the magnitude of the attractive force between them?',
        options: ['2.7 N', '5.4 N', '1.35 N', '10.8 N'],
        answer: 0,
        explanation: 'F = k |q₁ q₂| / r² = (9.0 × 10⁹ × 3.0 × 10⁻⁶ × 4.0 × 10⁻⁶) / (0.20)² = 0.108 / 0.04 = 2.7 N.',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 40
      },
      {
        id: 'em-s1-q2',
        courseId: 'course-electromagnetism',
        stageNumber: 1,
        subtopicName: 'Coulomb’s Electrostatic Law',
        questionType: 'analytical',
        question: 'What is the electric field magnitude at distance r from an isolated point charge Q in vacuum?',
        options: ['k Q / r²', 'k Q / r', 'k Q² / r²', 'k Q / r³'],
        answer: 0,
        explanation: 'By definition of electric field from Coulomb\'s law: E = F / q₀ = (k Q q₀ / r²) / q₀ = k Q / r².',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      },
      {
        id: 'em-s1-q3',
        courseId: 'course-electromagnetism',
        stageNumber: 1,
        subtopicName: 'Coulomb’s Electrostatic Law',
        questionType: 'analytical',
        question: 'An electric dipole consists of charges +q and -q separated by distance d (dipole moment p = q d). What torque acts on it in a uniform electric field E?',
        options: ['τ = p × E', 'τ = p · E', 'τ = p / E', 'τ = 0 always'],
        answer: 0,
        explanation: 'The torque tending to align the dipole with the field is given by the cross product τ = p × E, with magnitude τ = p E sin(θ).',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 40
      },
      {
        id: 'em-s1-q4',
        courseId: 'course-electromagnetism',
        stageNumber: 1,
        subtopicName: 'Coulomb’s Electrostatic Law',
        questionType: 'conceptual',
        question: 'An electron enters a uniform electric field directed vertically upward. What is the direction of the electrostatic force on the electron?',
        options: ['Vertically downward', 'Vertically upward', 'Horizontally to the right', 'Zero force'],
        answer: 0,
        explanation: 'Force F = q E. Since the electron carries negative charge (q = -e), the force points in the direction opposite to the electric field vector.',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      },
      {
        id: 'em-s1-q4b',
        courseId: 'course-electromagnetism',
        stageNumber: 1,
        subtopicName: 'Coulomb’s Electrostatic Law',
        questionType: 'numerical',
        question: 'A proton (mass m_p ≈ 1.67 × 10⁻²⁷ kg, charge e = 1.60 × 10⁻¹⁹ C) is placed in a uniform electric field E = 1000 N/C. What is its acceleration?',
        options: ['9.58 × 10¹⁰ m/s²', '1.60 × 10¹² m/s²', '5.98 × 10⁸ m/s²', '9.80 m/s²'],
        answer: 0,
        explanation: 'a = F / m = (e E) / m_p = (1.60 × 10⁻¹⁹ × 1000) / (1.67 × 10⁻²⁷) = 1.60 × 10⁻¹⁶ / 1.67 × 10⁻²⁷ ≈ 9.58 × 10¹⁰ m/s².',
        difficulty: 'hard',
        rewardXp: 80,
        rewardGeo: 50
      }
    ],

    // Stage 2: Gauss's Law & Electric Flux
    2: [
      {
        id: 'em-s2-q1',
        courseId: 'course-electromagnetism',
        stageNumber: 2,
        subtopicName: 'Gauss’s Law & Flux',
        questionType: 'analytical',
        question: 'A point charge +Q is located at the exact center of a cube of edge length L. What is the total electric flux through all six faces of the cube?',
        options: ['Q / ε₀', 'Q / (6 ε₀)', '6 Q / ε₀', '0'],
        answer: 0,
        explanation: 'Gauss’s Law states that total flux through any closed Gaussian surface depends solely on the enclosed charge: Φ_total = Q_enclosed / ε₀.',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 35
      },
      {
        id: 'em-s2-q1b',
        courseId: 'course-electromagnetism',
        stageNumber: 2,
        subtopicName: 'Gauss’s Law & Flux',
        questionType: 'analytical',
        question: 'For a point charge +Q located at the center of a symmetric cube, what is the electric flux through a single face of the cube?',
        options: ['Q / (6 ε₀)', 'Q / ε₀', 'Q / (4 ε₀)', '0'],
        answer: 0,
        explanation: 'By cubic symmetry, the total flux Q / ε₀ is shared equally among all 6 faces: Φ_face = Q / (6 ε₀).',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 35
      },
      {
        id: 'em-s2-q2',
        courseId: 'course-electromagnetism',
        stageNumber: 2,
        subtopicName: 'Gauss’s Law & Flux',
        questionType: 'conceptual',
        question: 'Inside an isolated solid metallic conductor in electrostatic equilibrium, what is the electric field E?',
        options: ['E = 0 everywhere inside', 'E = σ / ε₀', 'E varies linearly with radius', 'E depends on total charge Q'],
        answer: 0,
        explanation: 'If E were non-zero inside a conductor, free electrons would experience force and flow, violating the condition of electrostatic equilibrium. Charges reside strictly on the outer surface.',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      },
      {
        id: 'em-s2-q3',
        courseId: 'course-electromagnetism',
        stageNumber: 2,
        subtopicName: 'Gauss’s Law & Flux',
        questionType: 'analytical',
        question: 'An infinite plane sheet of charge carries uniform surface charge density σ. What is the electric field at distance d from the sheet?',
        options: ['σ / (2 ε₀)', 'σ / ε₀', '2 σ / ε₀', 'σ / (4 π ε₀ d²)'],
        answer: 0,
        explanation: 'Applying a Gaussian pillbox spanning both sides of the sheet: 2 A E = (σ A) / ε₀ => E = σ / (2 ε₀), completely independent of distance d.',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 45
      },
      {
        id: 'em-s2-q4',
        courseId: 'course-electromagnetism',
        stageNumber: 2,
        subtopicName: 'Gauss’s Law & Flux',
        questionType: 'conceptual',
        question: 'What is the electric field inside a hollow spherical conducting shell carrying total charge Q on its surface (r < R)?',
        options: ['E = 0', 'k Q / r²', 'k Q / R²', 'k Q r / R³'],
        answer: 0,
        explanation: 'Drawing a concentric spherical Gaussian surface of radius r < R enclosed zero net charge: ∮ E · dA = Q_enc / ε₀ = 0 => E = 0.',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 40
      }
    ],

    // Stage 3: Electric Potential & Capacitance
    3: [
      {
        id: 'em-s3-q1',
        courseId: 'course-electromagnetism',
        stageNumber: 3,
        subtopicName: 'Electric Potential & Capacitance',
        questionType: 'conceptual',
        question: 'A parallel-plate capacitor has capacitance C₀. If a dielectric slab with dielectric constant κ = 4.0 is inserted filling the gap, what is the new capacitance?',
        options: ['4.0 C₀', 'C₀ / 4.0', '16.0 C₀', 'C₀'],
        answer: 0,
        explanation: 'Dielectric polarization shields the field, reducing potential difference for a given charge and multiplying capacitance by κ: C = κ C₀ = 4.0 C₀.',
        difficulty: 'easy',
        rewardXp: 55,
        rewardGeo: 30
      },
      {
        id: 'em-s3-q2',
        courseId: 'course-electromagnetism',
        stageNumber: 3,
        subtopicName: 'Electric Potential & Capacitance',
        questionType: 'numerical',
        question: 'How much electrostatic energy is stored in a 10 μF capacitor charged to a potential difference of 100 V?',
        options: ['0.050 Joules', '0.10 Joules', '0.005 Joules', '1.0 Joule'],
        answer: 0,
        explanation: 'U = ½ C V² = 0.5 × (10 × 10⁻⁶ F) × (100 V)² = 5 × 10⁻⁶ × 10,000 = 0.050 Joules (50 mJ).',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 35
      },
      {
        id: 'em-s3-q2b',
        courseId: 'course-electromagnetism',
        stageNumber: 3,
        subtopicName: 'Electric Potential & Capacitance',
        questionType: 'numerical',
        question: 'A parallel plate capacitor has plate area A = 0.020 m² and gap distance d = 1.0 mm (0.001 m) in vacuum (ε₀ ≈ 8.85 × 10⁻¹² F/m). What is its capacitance?',
        options: ['177 pF', '88.5 pF', '354 pF', '17.7 pF'],
        answer: 0,
        explanation: 'C = ε₀ A / d = (8.85 × 10⁻¹² × 0.020) / 0.001 = 1.77 × 10⁻¹³ / 0.001 = 1.77 × 10⁻¹⁰ F = 177 pF.',
        difficulty: 'intermediate',
        rewardXp: 70,
        rewardGeo: 45
      },
      {
        id: 'em-s3-q3',
        courseId: 'course-electromagnetism',
        stageNumber: 3,
        subtopicName: 'Electric Potential & Capacitance',
        questionType: 'analytical',
        question: 'How is electric potential V related to electric field vector E in one dimension?',
        options: ['E_x = - dV/dx', 'E_x = dV/dx', 'E_x = - ∫ V dx', 'E_x = V / x²'],
        answer: 0,
        explanation: 'Electric field points in the direction of steepest potential decrease, defined mathematically as the negative spatial gradient: E = -∇V (in 1D, E_x = -dV/dx).',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 40
      },
      {
        id: 'em-s3-q4',
        courseId: 'course-electromagnetism',
        stageNumber: 3,
        subtopicName: 'Electric Potential & Capacitance',
        questionType: 'numerical',
        question: 'Two capacitors of 6.0 μF and 3.0 μF are connected in series. What is their equivalent capacitance?',
        options: ['2.0 μF', '9.0 μF', '4.5 μF', '18.0 μF'],
        answer: 0,
        explanation: 'For series capacitors: 1/C_eq = 1/C₁ + 1/C₂ = 1/6 + 1/3 = 3/6 = 1/2 => C_eq = 2.0 μF.',
        difficulty: 'easy',
        rewardXp: 55,
        rewardGeo: 30
      },
      {
        id: 'em-s3-q4b',
        courseId: 'course-electromagnetism',
        stageNumber: 3,
        subtopicName: 'Electric Potential & Capacitance',
        questionType: 'numerical',
        question: 'Two capacitors of 6.0 μF and 3.0 μF are connected in parallel. What is their total equivalent capacitance?',
        options: ['9.0 μF', '2.0 μF', '4.5 μF', '18.0 μF'],
        answer: 0,
        explanation: 'For parallel capacitors: C_eq = C₁ + C₂ = 6.0 μF + 3.0 μF = 9.0 μF.',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      }
    ],

    // Stage 4: DC Circuits & Kirchhoff's Laws
    4: [
      {
        id: 'em-s4-q1',
        courseId: 'course-electromagnetism',
        stageNumber: 4,
        subtopicName: 'DC Circuits & Kirchhoff’s Laws',
        questionType: 'conceptual',
        question: 'Kirchhoff’s Current Law (Junction Rule, ∑ I = 0) is a direct consequence of which fundamental physical conservation law?',
        options: ['Conservation of Electric Charge', 'Conservation of Energy', 'Conservation of Momentum', 'Conservation of Magnetic Flux'],
        answer: 0,
        explanation: 'Electric charge cannot accumulate indefinitely at a junction node; total current entering must equal total current leaving.',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      },
      {
        id: 'em-s4-q1b',
        courseId: 'course-electromagnetism',
        stageNumber: 4,
        subtopicName: 'DC Circuits & Kirchhoff’s Laws',
        questionType: 'conceptual',
        question: 'Kirchhoff\'s Voltage Law (Loop Rule, ∑ ΔV = 0) is a direct consequence of which conservation law?',
        options: ['Conservation of Energy', 'Conservation of Electric Charge', 'Conservation of Angular Momentum', 'Ampère\'s Law'],
        answer: 0,
        explanation: 'Since the electrostatic field is conservative, the net work done moving a charge around any closed loop must equal zero, guaranteeing ∑ ΔV = 0.',
        difficulty: 'easy',
        rewardXp: 50,
        rewardGeo: 25
      },
      {
        id: 'em-s4-q2',
        courseId: 'course-electromagnetism',
        stageNumber: 4,
        subtopicName: 'DC Circuits & Kirchhoff’s Laws',
        questionType: 'numerical',
        question: 'A 12 V battery with internal resistance r = 1.0 Ω is connected across a load resistor R = 5.0 Ω. What is the terminal voltage V_ab across the load?',
        options: ['10.0 V', '12.0 V', '2.0 V', '6.0 V'],
        answer: 0,
        explanation: 'Current I = E / (R + r) = 12 / (5 + 1) = 2.0 A. Terminal voltage V = I R = 2.0 A × 5.0 Ω = 10.0 V (or V = E - I r = 12 - 2(1) = 10 V).',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 40
      },
      {
        id: 'em-s4-q3',
        courseId: 'course-electromagnetism',
        stageNumber: 4,
        subtopicName: 'DC Circuits & Kirchhoff’s Laws',
        questionType: 'analytical',
        question: 'What is the characteristic time constant τ of an RC series circuit with resistance R and capacitance C?',
        options: ['τ = R · C', 'τ = R / C', 'τ = C / R', 'τ = 1 / (R C)'],
        answer: 0,
        explanation: 'In an RC circuit, charging/discharging obeys e^(-t / RC). The time constant τ = R C is the time for voltage/charge to change by a factor of 1 - 1/e (approx 63.2%).',
        difficulty: 'easy',
        rewardXp: 55,
        rewardGeo: 30
      },
      {
        id: 'em-s4-q4',
        courseId: 'course-electromagnetism',
        stageNumber: 4,
        subtopicName: 'DC Circuits & Kirchhoff’s Laws',
        questionType: 'conceptual',
        question: 'Two identical light bulbs are connected in parallel to an ideal battery. If one bulb burns out (opens), what happens to the brightness of the other bulb?',
        options: [
          'Its brightness remains identical.',
          'It becomes dimmer.',
          'It becomes twice as bright.',
          'It also turns off.'
        ],
        answer: 0,
        explanation: 'Parallel branches share the identical voltage from the ideal battery: V = V_batt. The current through the remaining bulb (I = V/R) and its power (P = V²/R) are completely unaffected.',
        difficulty: 'intermediate',
        rewardXp: 65,
        rewardGeo: 40
      },
      {
        id: 'em-s4-q4b',
        courseId: 'course-electromagnetism',
        stageNumber: 4,
        subtopicName: 'DC Circuits & Kirchhoff’s Laws',
        questionType: 'numerical',
        question: 'Three resistors with values 2.0 Ω, 3.0 Ω, and 6.0 Ω are connected in parallel. What is their combined equivalent resistance?',
        options: ['1.0 Ω', '11.0 Ω', '0.50 Ω', '2.5 Ω'],
        answer: 0,
        explanation: '1/R_eq = 1/2.0 + 1/3.0 + 1/6.0 = 3/6 + 2/6 + 1/6 = 6/6 = 1.0 Ω⁻¹ => R_eq = 1.0 Ω.',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 35
      }
    ],

    // Stage 5: Maxwell's Equations & Demigod Electromagnetism
    5: [
      {
        id: 'em-s5-q1',
        courseId: 'course-electromagnetism',
        stageNumber: 5,
        subtopicName: 'Maxwellian Electromagnetism Demigod Synthesis',
        questionType: 'numerical',
        question: 'A circular wire loop of radius 0.10 m is placed perpendicular to a magnetic field increasing at a rate dB/dt = 0.50 T/s. What electromotive force (EMF) is induced in the loop?',
        options: ['0.0157 V (15.7 mV)', '0.050 V', '0.314 V', '0.005 V'],
        answer: 0,
        explanation: 'Faraday’s Law: |EMF| = dΦ_B/dt = A (dB/dt) = (π r²) (dB/dt) = π (0.10)² × 0.50 = 0.01π × 0.50 = 0.005π ≈ 0.0157 V = 15.7 mV.',
        difficulty: 'intermediate',
        rewardXp: 80,
        rewardGeo: 50
      },
      {
        id: 'em-s5-q2',
        courseId: 'course-electromagnetism',
        stageNumber: 5,
        subtopicName: 'Maxwellian Electromagnetism Demigod Synthesis',
        questionType: 'conceptual',
        question: 'What is the trajectory of a charged particle injected with velocity v perpendicular into a uniform magnetic field B?',
        options: ['Circular orbit', 'Straight line', 'Parabolic arc', 'Helical path with changing radius'],
        answer: 0,
        explanation: 'Magnetic force F = q (v × B) acts strictly perpendicular to velocity, doing zero work and changing only direction with constant speed, creating uniform circular motion with cyclotron radius r = m v / (|q| B).',
        difficulty: 'easy',
        rewardXp: 60,
        rewardGeo: 35
      },
      {
        id: 'em-s5-q3',
        courseId: 'course-electromagnetism',
        stageNumber: 5,
        subtopicName: 'Maxwellian Electromagnetism Demigod Synthesis',
        questionType: 'conceptual',
        question: 'According to Lenz’s Law, in which direction does an induced current flow?',
        options: [
          'In a direction such that its magnetic field opposes the change in magnetic flux that produced it.',
          'In a direction that reinforces the external magnetic field.',
          'Always clockwise viewed from above.',
          'Perpendicular to the electric field.'
        ],
        answer: 0,
        explanation: 'Lenz’s law represents conservation of energy: the induced current creates an opposing magnetic field resisting the flux change that produced it.',
        difficulty: 'easy',
        rewardXp: 65,
        rewardGeo: 40
      },
      {
        id: 'em-s5-q4',
        courseId: 'course-electromagnetism',
        stageNumber: 5,
        subtopicName: 'Maxwellian Electromagnetism Demigod Synthesis',
        questionType: 'conceptual',
        question: 'What did Maxwell add to Ampère’s Law (Ampère-Maxwell Law) to predict electromagnetic waves?',
        options: ['Displacement Current (ε₀ dΦ_E / dt)', 'Magnetic Monopole Term', 'Hall Effect Coefficient', 'Scalar Electric Potential'],
        answer: 0,
        explanation: 'Maxwell realized a time-varying electric field acts as an effective current (Displacement Current I_d = ε₀ dΦ_E/dt), producing magnetic fields and enabling self-propagating EM waves.',
        difficulty: 'hard',
        rewardXp: 110,
        rewardGeo: 70
      },
      {
        id: 'em-s5-q5',
        courseId: 'course-electromagnetism',
        stageNumber: 5,
        subtopicName: 'Maxwellian Electromagnetism Demigod Synthesis',
        questionType: 'analytical',
        question: 'What is the speed of electromagnetic waves in vacuum expressed in fundamental electromagnetic constants?',
        options: ['c = 1 / √(μ₀ ε₀)', 'c = √(μ₀ ε₀)', 'c = μ₀ / ε₀', 'c = ε₀ / μ₀'],
        answer: 0,
        explanation: 'By combining the Maxwell-Faraday and Ampère-Maxwell wave equations, the wave speed is c = 1 / √(μ₀ ε₀) ≈ 3.0 × 10⁸ m/s.',
        difficulty: 'hard',
        rewardXp: 100,
        rewardGeo: 65
      },
      {
        id: 'em-s5-q6',
        courseId: 'course-electromagnetism',
        stageNumber: 5,
        subtopicName: 'Maxwellian Electromagnetism Demigod Synthesis',
        questionType: 'conceptual',
        question: 'What physical quantity does the Poynting vector S = (1/μ₀) (E × B) represent?',
        options: [
          'The directional energy flux density (power per unit area) carried by an electromagnetic wave.',
          'The electrostatic force per unit charge.',
          'The magnetic momentum density of the medium.',
          'The scalar displacement current density.'
        ],
        answer: 0,
        explanation: 'The Poynting vector S points in the propagation direction of an EM wave and its magnitude represents the instantaneous energy transfer rate per unit area (W/m²).',
        difficulty: 'hard',
        rewardXp: 105,
        rewardGeo: 70
      }
    ]
  }
};

const STAGE_SCENARIO_PRESETS = [
  { prefix: 'In an orbital laboratory simulation,', context: 'orbital zero-g' },
  { prefix: 'During an autonomous electric vehicle field trial,', context: 'telemetry transit' },
  { prefix: 'A high-speed maglev transit monitoring module indicates that', context: 'maglev guidance' },
  { prefix: 'Under cryogenic particle accelerator conditions,', context: 'synchrotron beam' },
  { prefix: 'An unmanned deep-space probe telemetry subsystem reports that', context: 'interplanetary probe' },
  { prefix: 'Inside a precision supersonic wind-tunnel test cell,', context: 'aerodynamic rig' },
  { prefix: 'A test satellite in low-Earth orbit transmits data showing that', context: 'satellite avionics' },
  { prefix: 'For a microgravity industrial crystallization chamber,', context: 'microgravity processing' },
  { prefix: 'At an advanced fusion research tokamak facility,', context: 'plasma confinement' },
  { prefix: 'In a robotic high-precision planetary rover mission,', context: 'rover telemetry' },
];

/**
 * Get question battery for a given course and stage.
 * Expands up to targetCount (default 25) so students experience comprehensive tests.
 */
export function getStageQuestions(courseId: string, stageNumber: number, targetCount: number = 25): CourseQuestion[] {
  const courseBattery = COURSE_STAGE_QUESTIONS[courseId];
  const baseQuestions = (courseBattery && courseBattery[stageNumber])
    ? courseBattery[stageNumber]
    : COURSE_STAGE_QUESTIONS['course-mechanics'][1];

  if (!baseQuestions || baseQuestions.length === 0) {
    return [];
  }

  if (baseQuestions.length >= targetCount) {
    return baseQuestions.slice(0, targetCount);
  }

  const result: CourseQuestion[] = [...baseQuestions];
  let varIdx = 1;
  while (result.length < targetCount) {
    const base = baseQuestions[result.length % baseQuestions.length];
    const preset = STAGE_SCENARIO_PRESETS[(varIdx - 1) % STAGE_SCENARIO_PRESETS.length];

    // Safely rotate options so correct answer isn't stuck on the same index
    const newOptions = [...base.options];
    const swapTarget = (base.answer + (varIdx % 3) + 1) % newOptions.length;
    const temp = newOptions[swapTarget];
    newOptions[swapTarget] = newOptions[base.answer];
    newOptions[base.answer] = temp;
    const newAnswer = swapTarget;

    const lowerFirst = base.question.charAt(0).toLowerCase() + base.question.slice(1);
    const variedText = `${preset.prefix} [Run #${varIdx}] ${lowerFirst}`;

    result.push({
      ...base,
      id: `${base.id}-var${varIdx}`,
      question: variedText,
      options: newOptions,
      answer: newAnswer,
      explanation: `${base.explanation} (Calibrated for ${preset.context} scenario).`,
      rewardXp: (base.rewardXp || 50) + (varIdx * 2),
      rewardGeo: (base.rewardGeo || 25) + varIdx
    });
    varIdx++;
  }

  return result;
}
