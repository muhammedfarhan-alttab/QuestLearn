// Interactive Lecture Notes Data Catalog
// Supports all 4 courses, 20 stages, concept highlights, flashcards, knowledge checks, and revision summaries.

export type DifficultyMode = 'beginner' | 'intermediate' | 'advanced';

export type KnowledgeCheckType = 'mcq' | 'true_false' | 'fill_blank';

export interface KnowledgeCheckItem {
  id: string;
  type: KnowledgeCheckType;
  prompt: string;
  options?: string[]; // for mcq or true_false
  correctAnswer: number | string | boolean; // index for mcq, boolean for true_false, string for fill_blank
  explanation: string;
  blankAnswer?: string; // for fill_blank exact/case-insensitive match
  rewardXp: number;
  rewardGeo: number;
}

export interface ConceptHighlights {
  definitions: { term: string; definition: string; keySymbol?: string }[];
  formulas: { name: string; formula: string; units: string; breakdown: string }[];
  keyPoints: string[];
  examTips: string[];
}

export interface FlashcardItem {
  id: string;
  concept: string;
  front: string;
  back: string;
  category: 'formula' | 'definition' | 'derivation' | 'exam_trick';
  difficulty: DifficultyMode;
}

export interface ChapterSummaryData {
  fiveKeyTakeaways: string[];
  importantFormulas: { name: string; math: string; note: string }[];
  commonMistakes: { mistake: string; correction: string; why: string }[];
  revisionChecklist: { id: string; label: string; details: string }[];
}

export interface CuratedDoubt {
  question: string;
  answer: string;
  analogy: string;
}

export interface TheorySection {
  id: string;
  title: string;
  paragraphs: string[];
  equation?: { name: string; formula: string; explanation: string };
  knowledgeChecks: KnowledgeCheckItem[];
}

export interface ChapterLectureData {
  courseId: string;
  stageNumber: number;
  chapterTitle: string;
  conceptFocus: string;
  lore: string;
  theoryOverview: string[];
  sections: TheorySection[];
  highlights: ConceptHighlights;
  flashcards: FlashcardItem[];
  summary: ChapterSummaryData;
  curatedDoubts: CuratedDoubt[];
}

export const CHAPTER_LECTURE_CATALOG: Record<string, Record<number, ChapterLectureData>> = {
  // =========================================================================
  // 1. PHYSICS I — CLASSICAL MECHANICS
  // =========================================================================
  'course-mechanics': {
    // Stage 1: Vector Displacement, Kinematics & 2D Projectiles
    1: {
      courseId: 'course-mechanics',
      stageNumber: 1,
      chapterTitle: 'Kinematics & 2D Projectile Motion',
      conceptFocus: 'Vector Displacement, Trajectories & Independence of Motion',
      lore: 'Deep beneath the Urahara candy shop, fractured bedrock proves the bedrock laws of velocity, acceleration, and parabolic projectile arcs.',
      theoryOverview: [
        'Kinematics describes motion purely through coordinates, velocity, and acceleration without concerning the forces generating them.',
        'In two dimensions, horizontal and vertical motions are strictly independent. The horizontal component moves at constant velocity (neglecting air drag), while the vertical component undergoes constant gravitational acceleration g downwards.',
        'At the apex of a projectile trajectory, instantaneous vertical velocity momentarily reaches zero (v_y = 0), but acceleration remains strictly g downwards (-9.8 m/s²).',
        'Displacement is the direct vector connecting the initial position to the final position, independent of the distance traversed along the curved path.'
      ],
      sections: [
        {
          id: 'mech-1-s1',
          title: '1. Independence of 2D Motion Components',
          paragraphs: [
            'Any 2D motion can be decomposed into orthogonal x (horizontal) and y (vertical) vectors. What happens along the x-axis has zero effect on the y-axis motion.',
            'Because gravity acts only along the vertical line towards Earth’s center, horizontal acceleration is zero (a_x = 0). Thus, horizontal velocity v_x remains perfectly constant throughout flight: v_x(t) = v_{0} \\cos(\\theta).'
          ],
          equation: {
            name: 'Horizontal Position Equation',
            formula: 'x(t) = x_0 + v_{0} \\cos(\\theta)\\,t',
            explanation: 'Shows linear displacement in time due to zero horizontal acceleration.'
          },
          knowledgeChecks: [
            {
              id: 'kc-mech-1-1',
              type: 'true_false',
              prompt: 'True or False: A ball dropped vertically from a tower hits the flat ground at the exact same instant as a ball fired horizontally from the same height (ignoring air drag).',
              options: ['True', 'False'],
              correctAnswer: 0,
              explanation: 'True! Because vertical acceleration (g) and initial vertical velocity (0) are identical for both, their vertical times of flight are identical regardless of horizontal velocity.',
              rewardXp: 15,
              rewardGeo: 10
            },
            {
              id: 'kc-mech-1-2',
              type: 'mcq',
              prompt: 'If a projectile is launched at speed v₀ and angle θ, what is its horizontal velocity when it reaches its maximum height?',
              options: ['0', 'v₀ cos(θ)', 'v₀ sin(θ)', 'v₀ tan(θ)'],
              correctAnswer: 1,
              explanation: 'Horizontal velocity never changes in ideal projectile motion: v_x = v₀ cos(θ) at all points, including the peak.',
              rewardXp: 15,
              rewardGeo: 10
            }
          ]
        },
        {
          id: 'mech-1-s2',
          title: '2. Vertical Kinematics & Apex State',
          paragraphs: [
            'Vertical motion is governed by uniform downward acceleration a_y = -g = -9.8 m/s². As the projectile ascends, gravity decelerates it until v_y = 0 at the peak.',
            'A common misconception is that acceleration becomes zero at the highest point. If acceleration were zero when velocity is zero, the projectile would hover in mid-air permanently! Downward acceleration remains continuously 9.8 m/s².'
          ],
          equation: {
            name: 'Maximum Height Formula',
            formula: 'H = \\frac{v_0^2 \\sin^2(\\theta)}{2g}',
            explanation: 'Derived from v_y² = v_{0y}² - 2gH with v_y = 0 at the peak.'
          },
          knowledgeChecks: [
            {
              id: 'kc-mech-1-3',
              type: 'fill_blank',
              prompt: 'At the apex of a projectile’s flight, its instantaneous vertical velocity is _____ m/s.',
              blankAnswer: '0',
              correctAnswer: '0',
              explanation: 'At the highest point, vertical velocity momentarily reaches 0 m/s before changing direction downwards.',
              rewardXp: 20,
              rewardGeo: 15
            },
            {
              id: 'kc-mech-1-4',
              type: 'mcq',
              prompt: 'At what launch angle above the horizontal is the range of a projectile on level ground maximized?',
              options: ['30°', '45°', '60°', '90°'],
              correctAnswer: 1,
              explanation: 'Range R = (v₀² sin(2θ)) / g. The sine function reaches its maximum of 1 when 2θ = 90°, so θ = 45° maximizes range.',
              rewardXp: 15,
              rewardGeo: 10
            }
          ]
        }
      ],
      highlights: {
        definitions: [
          {
            term: 'Projectile Motion',
            definition: 'Form of motion experienced by an object launched into the air that is subjected only to the acceleration of gravity.',
            keySymbol: 'g = 9.8 m/s²'
          },
          {
            term: 'Displacement Vector',
            definition: 'A vector quantity representing the shortest straight-line distance and direction from initial position to final position.',
            keySymbol: '\\vec{\\Delta r} = \\vec{r}_f - \\vec{r}_i'
          },
          {
            term: 'Trajectory',
            definition: 'The parabolic path followed by a projectile flying through space under gravitational influence.',
            keySymbol: 'y(x) = x\\tan(\\theta) - \\frac{g x^2}{2v_0^2\\cos^2(\\theta)}'
          }
        ],
        formulas: [
          {
            name: 'Time of Flight (Level Ground)',
            formula: 'T = \\frac{2v_0 \\sin(\\theta)}{g}',
            units: 'seconds (s)',
            breakdown: 'Double the time taken to reach apex since ascending and descending times are symmetric.'
          },
          {
            name: 'Maximum Altitude',
            formula: 'H = \\frac{v_0^2 \\sin^2(\\theta)}{2g}',
            units: 'meters (m)',
            breakdown: 'Obtained using v_y² = v_{0y}² - 2gH with v_y = 0 at the peak.'
          },
          {
            name: 'Horizontal Range',
            formula: 'R = \\frac{v_0^2 \\sin(2\\theta)}{g}',
            units: 'meters (m)',
            breakdown: 'Product of constant horizontal speed v_0 \\cos(\\theta) and total flight time T.'
          }
        ],
        keyPoints: [
          'Horizontal velocity remains completely constant throughout flight (a_x = 0).',
          'Vertical velocity continuously decreases by 9.8 m/s every second due to gravity.',
          'Complementary launch angles (e.g. 30° and 60°) achieve the exact same horizontal range for equal initial speed.',
          'Ascent time equals descent time when launch and landing elevations are equal.'
        ],
        examTips: [
          'Watch out for non-level landing points: if landing elevation differs from launch, Range R cannot be calculated using the simple sin(2θ) formula; use vertical displacement Δy first!',
          'Always decompose initial velocity into v_{0x} = v_0 cos(θ) and v_{0y} = v_0 sin(θ) before writing kinematic equations.',
          'In JEE/CBSE problems, check whether θ is given with respect to the horizontal or vertical axis.'
        ]
      },
      flashcards: [
        {
          id: 'fc-mech-1-1',
          concept: 'Apex Acceleration',
          front: 'What is the acceleration of a projectile at the peak of its trajectory?',
          back: 'Strictly g = 9.8 m/s² directed downwards. Instantaneous vertical velocity is zero, but the gravitational force and downward acceleration remain constant.',
          category: 'definition',
          difficulty: 'beginner'
        },
        {
          id: 'fc-mech-1-2',
          concept: 'Horizontal Acceleration',
          front: 'What is the horizontal acceleration of an ideal projectile (ignoring air resistance)?',
          back: 'Zero (a_x = 0). Therefore, the horizontal velocity component remains constant throughout the entire flight.',
          category: 'formula',
          difficulty: 'beginner'
        },
        {
          id: 'fc-mech-1-3',
          concept: 'Optimal Range Angle',
          front: 'Why does a 45° launch angle yield maximum range on level ground?',
          back: 'Range R = (v₀² sin(2θ)) / g. The term sin(2θ) attains its absolute maximum value of 1 when 2θ = 90°, which means θ = 45°.',
          category: 'derivation',
          difficulty: 'intermediate'
        },
        {
          id: 'fc-mech-1-4',
          concept: 'Complementary Angles',
          front: 'Why do launch angles of 30° and 60° produce the same horizontal range?',
          back: 'Because sin(2 × 30°) = sin(60°) and sin(2 × 60°) = sin(120°) = sin(60°). Any pair of angles where θ₁ + θ₂ = 90° yields identical sin(2θ).',
          category: 'exam_trick',
          difficulty: 'intermediate'
        },
        {
          id: 'fc-mech-1-5',
          concept: 'Time of Flight Derivation',
          front: 'How is the total time of flight derived for level ground?',
          back: 'Set vertical displacement y(t) = v₀ sin(θ)t - ½gt² = 0. Factoring out t gives t[v₀ sin(θ) - ½gt] = 0. For t ≠ 0, T = (2v₀ sin(θ)) / g.',
          category: 'derivation',
          difficulty: 'advanced'
        },
        {
          id: 'fc-mech-1-6',
          concept: 'Velocity Vector at Apex',
          front: 'Is the overall velocity of a projectile ever zero during flight?',
          back: 'No (unless launched vertically at 90°). At the apex, vertical velocity is zero (v_y = 0), but the horizontal velocity component v_x = v₀ cos(θ) remains nonzero.',
          category: 'exam_trick',
          difficulty: 'intermediate'
        }
      ],
      summary: {
        fiveKeyTakeaways: [
          'Orthogonal motions are completely decoupled: horizontal motion is uniform, vertical motion has uniform acceleration g.',
          'Gravity acts downwards at every single moment of flight with magnitude g = 9.8 m/s².',
          'At the apex, v_y = 0, but v_x = v₀ cos(θ) and a_y = -g.',
          'Level ground range is maximized at 45° and identical for complementary angles (θ and 90° - θ).',
          'Time of flight depends purely on the vertical component v_{0y} = v₀ sin(θ).'
        ],
        importantFormulas: [
          { name: 'Time of Flight', math: 'T = \\frac{2v_0 \\sin(\\theta)}{g}', note: 'Valid for equal launch and landing heights.' },
          { name: 'Max Altitude', math: 'H = \\frac{v_0^2 \\sin^2(\\theta)}{2g}', note: 'Peak vertical distance above launch elevation.' },
          { name: 'Horizontal Range', math: 'R = \\frac{v_0^2 \\sin(2\\theta)}{g}', note: 'Maximum range occurs when θ = 45°.' },
          { name: 'Instantaneous Speed', math: 'v(t) = \\sqrt{v_x^2 + v_y(t)^2}', note: 'Magnitude of the resultant velocity vector.' }
        ],
        commonMistakes: [
          {
            mistake: 'Assuming acceleration is zero at the peak because velocity is zero.',
            correction: 'Acceleration is -9.8 m/s² downwards throughout the entire flight.',
            why: 'Force of gravity never turns off; only the vertical velocity changes sign.'
          },
          {
            mistake: 'Using range formula R = (v₀² sin(2θ))/g for projectiles launched from a cliff.',
            correction: 'Solve the quadratic y(t) = h + v_{0y}t - ½gt² = 0 for time first, then multiply by v_{0x}.',
            why: 'The standard formula assumes landing height equals launch height (y = 0).'
          }
        ],
        revisionChecklist: [
          { id: 'rev-1', label: 'Velocity Vector Decomposition', details: 'Can decompose any launch speed into v_x = v₀ cos(θ) and v_y = v₀ sin(θ).' },
          { id: 'rev-2', label: 'Apex Condition Mastery', details: 'Remember that v_y = 0 at the peak, but a = -g and v_x = v₀ cos(θ).' },
          { id: 'rev-3', label: 'Formula Recall (T, H, R)', details: 'Memorized T = (2v₀ sin θ)/g, H = (v₀² sin² θ)/(2g), R = (v₀² sin 2θ)/g.' },
          { id: 'rev-4', label: 'Trajectory Equation Setup', details: 'Familiar with eliminating time t to express y directly as a function of x.' }
        ]
      },
      curatedDoubts: [
        {
          question: 'Why does gravity not slow down the horizontal speed of the ball?',
          answer: 'Forces only cause acceleration along their specific line of action. Gravity pulls straight down toward Earth’s core (along the y-axis), having zero component along the horizontal x-axis (cos 90° = 0).',
          analogy: 'Imagine rolling a marble forward across a smooth floor while a fan blows straight down from the ceiling; the downward wind does not stop the forward rolling.'
        },
        {
          question: 'Why do two balls dropped and shot sideways hit the ground together?',
          answer: 'Both balls start with zero initial vertical velocity (v_{0y} = 0) and experience the exact same downward acceleration g. The horizontal speed of the second ball does not alter how fast it falls vertically.',
          analogy: 'Like two people stepping into two different elevator cars on the top floor: even if one person is jogging back and forth inside their elevator, both elevators reach the ground floor at the exact same moment.'
        }
      ]
    },

    // Stage 2: Newton's Laws & Friction
    2: {
      courseId: 'course-mechanics',
      stageNumber: 2,
      chapterTitle: 'Newton’s Laws of Motion & Friction',
      conceptFocus: 'Inertia, Action-Reaction Pairs & Frictional Dynamics',
      lore: 'Beyond the colossal iron gates of Rukongai, Newton’s laws dictate whether your Reiatsu shatters the gate or is repelled with equal force.',
      theoryOverview: [
        'Newton’s First Law (Law of Inertia) states that an object remains at rest or in uniform linear motion unless acted upon by a net external force.',
        'Newton’s Second Law connects net force to the time rate of change of linear momentum: F_net = dp/dt = m·a for constant mass.',
        'Newton’s Third Law dictates that every action force produces an equal and opposite reaction force acting on different interacting bodies.',
        'Static friction f_s adjusts to match applied force up to a maximum threshold f_{s,max} = μ_s N. Once motion begins, kinetic friction f_k = μ_k N takes over (where μ_k < μ_s).'
      ],
      sections: [
        {
          id: 'mech-2-s1',
          title: '1. Action-Reaction Pairs & Free-Body Diagrams',
          paragraphs: [
            'A critical principle of Newton’s Third Law is that action and reaction forces NEVER act on the same object, and therefore NEVER cancel each other out.',
            'When you jump, you push the Earth downwards, and the Earth pushes your feet upwards with equal magnitude. You accelerate noticeably because your mass is small; the Earth’s acceleration is negligible due to its immense mass.'
          ],
          equation: {
            name: 'Newton’s Second Law',
            formula: '\\vec{F}_{\\text{net}} = m \\vec{a} = \\frac{d\\vec{p}}{dt}',
            explanation: 'Net force equals mass times acceleration for non-relativistic systems with constant mass.'
          },
          knowledgeChecks: [
            {
              id: 'kc-mech-2-1',
              type: 'mcq',
              prompt: 'A horse pulls a cart forward. According to Newton’s Third Law, the cart pulls back on the horse with equal force. Why does the cart move forward?',
              options: [
                'The horse pushes back on the ground, and the ground pushes forward on the horse with greater force than the cart’s pull.',
                'The horse pulls slightly before the cart can react.',
                'Newton’s third law does not apply to accelerating objects.',
                'The friction on the cart wheels is greater than the horse’s force.'
              ],
              correctAnswer: 0,
              explanation: 'The net force on the horse includes the forward friction from the ground. The horse moves forward because the forward ground push exceeds the backward pull of the cart.',
              rewardXp: 15,
              rewardGeo: 10
            },
            {
              id: 'kc-mech-2-2',
              type: 'true_false',
              prompt: 'True or False: The normal force from a table on a book and the gravitational force on the book form an action-reaction pair.',
              options: ['True', 'False'],
              correctAnswer: 1,
              explanation: 'False! Both forces act on the same object (the book). The true reaction to gravity on the book is the gravitational pull of the book on Earth.',
              rewardXp: 15,
              rewardGeo: 10
            }
          ]
        },
        {
          id: 'mech-2-s2',
          title: '2. Static vs Kinetic Friction',
          paragraphs: [
            'Static friction is a self-adjusting force: it only exerts as much resistance as needed to prevent relative motion, up to a maximum limit f_{s,max} = \\mu_s N.',
            'Once the applied force exceeds f_{s,max}, the surfaces begin sliding, and friction drops to the kinetic value f_k = \\mu_k N. Because molecular bonds break during sliding, \\mu_k is strictly less than \\mu_s.'
          ],
          equation: {
            name: 'Maximum Static Friction',
            formula: 'f_{s,\\text{max}} = \\mu_s N',
            explanation: 'N is the normal force perpendicular to the contact interface.'
          },
          knowledgeChecks: [
            {
              id: 'kc-mech-2-3',
              type: 'mcq',
              prompt: 'A 10 kg block sits on a floor with μ_s = 0.5 and μ_k = 0.3. A horizontal force of 20 N is applied. What is the friction force? (g = 10 m/s²)',
              options: ['50 N', '30 N', '20 N', '0 N'],
              correctAnswer: 2,
              explanation: 'Normal force N = mg = 100 N. Maximum static friction is μ_s N = 0.5 × 100 = 50 N. Because applied force (20 N) < 50 N, static friction adjusts to exactly 20 N to keep the block at rest.',
              rewardXp: 20,
              rewardGeo: 15
            }
          ]
        }
      ],
      highlights: {
        definitions: [
          { term: 'Inertia', definition: 'The resistance of any physical object to any change in its velocity or state of motion.', keySymbol: 'Mass m (kg)' },
          { term: 'Normal Force', definition: 'The perpendicular contact force exerted by a surface on an object resting upon it.', keySymbol: 'N (Newtons)' },
          { term: 'Limiting Friction', definition: 'The maximum static friction that acts just before the body begins to slide.', keySymbol: 'f_{s,\\text{max}} = \\mu_s N' }
        ],
        formulas: [
          { name: 'Net Force', formula: '\\Sigma \\vec{F} = m \\vec{a}', units: 'Newtons (N)', breakdown: 'Vector sum of all individual forces acting on the system.' },
          { name: 'Kinetic Friction', formula: 'f_k = \\mu_k N', units: 'Newtons (N)', breakdown: 'Constant opposing force during active relative sliding.' },
          { name: 'Apparent Weight in Elevator', formula: 'N = m(g + a)', units: 'Newtons (N)', breakdown: 'a is upward acceleration; if accelerating downwards, N = m(g - a).' }
        ],
        keyPoints: [
          'Action and reaction forces act on different bodies, never canceling each other.',
          'Static friction is self-adjusting between 0 and μ_s N.',
          'Coefficient of kinetic friction μ_k is always less than static friction μ_s.',
          'Weightlessness occurs when an elevator accelerates downward at g (N = 0).'
        ],
        examTips: [
          'In inclined plane problems, always decompose weight into mg sin(θ) parallel to the incline and mg cos(θ) perpendicular to the incline.',
          'Never assume normal force N = mg automatically; if an inclined plane or pulling angle exists, N = mg cos(θ) or N = mg - F sin(θ).'
        ]
      },
      flashcards: [
        { id: 'fc-mech-2-1', concept: 'Action-Reaction Cancellation', front: 'Why do Newton’s 3rd Law forces never cancel each other out?', back: 'Because they act on two entirely different bodies (e.g. Earth on Moon vs Moon on Earth), never on the same free-body diagram.', category: 'definition', difficulty: 'beginner' },
        { id: 'fc-mech-2-2', concept: 'Self-adjusting Static Friction', front: 'If maximum static friction is 50 N and you push with 10 N, what is the friction force?', back: 'Exactly 10 N. Static friction is self-adjusting and matches the applied force until the 50 N limit is breached.', category: 'exam_trick', difficulty: 'beginner' },
        { id: 'fc-mech-2-3', concept: 'Inclined Plane Normal Force', front: 'What is the normal force on a block of mass m resting on an incline of angle θ?', back: 'N = mg cos(θ). The perpendicular component of gravity balances the surface support.', category: 'formula', difficulty: 'intermediate' },
        { id: 'fc-mech-2-4', concept: 'Apparent Weightlessness', front: 'What does a scale read if an elevator cable snaps and falls freely?', back: 'Zero. In free fall, the elevator and passenger accelerate downwards at g, so normal force N = m(g - g) = 0.', category: 'derivation', difficulty: 'intermediate' }
      ],
      summary: {
        fiveKeyTakeaways: [
          'Zero net force means constant velocity (zero acceleration), not necessarily zero speed.',
          'Net force equals rate of momentum change F = dp/dt.',
          'Action-reaction pairs act on different bodies with equal magnitude and opposite direction.',
          'Static friction adjusts to balance applied force until reaching μ_s N.',
          'Sliding friction is constant and given by f_k = μ_k N.'
        ],
        importantFormulas: [
          { name: 'Newton’s 2nd Law', math: 'F_{\\text{net}} = ma', note: 'Linear motion with constant mass.' },
          { name: 'Max Static Friction', math: 'f_{s,\\text{max}} = \\mu_s N', note: 'Threshold of impending motion.' },
          { name: 'Incline Component', math: 'F_{\\parallel} = mg \\sin(\\theta)', note: 'Force driving block down the slope.' }
        ],
        commonMistakes: [
          { mistake: 'Believing normal force is the reaction to gravity.', correction: 'Normal force is an electromagnetic repulsion from surface atoms; gravitational reaction is on Earth’s core.', why: 'Action-reaction forces must share the same physical interaction type.' }
        ],
        revisionChecklist: [
          { id: 'rev-2-1', label: 'Free Body Diagram Construction', details: 'Identify all contact forces and field forces acting on the isolated mass.' },
          { id: 'rev-2-2', label: 'Static vs Kinetic Distinction', details: 'Remember that μ_s > μ_k and static friction self-adjusts.' }
        ]
      },
      curatedDoubts: [
        {
          question: 'Why is it harder to start pushing a heavy couch than to keep it sliding?',
          answer: 'Because the coefficient of static friction (μ_s) is higher than kinetic friction (μ_k). Microscopic surface asperities lock into place when stationary; once sliding, they skim across each other.',
          analogy: 'Interlocking your fingers tightly vs rubbing your palms together lightly while moving.'
        }
      ]
    },

    // Stage 3: Work, Energy & Power
    3: {
      courseId: 'course-mechanics',
      stageNumber: 3,
      chapterTitle: 'Work, Energy & Conservative Fields',
      conceptFocus: 'Work-Energy Theorem, Conservative Forces & Mechanical Power',
      lore: 'The boundary gateway where potential and kinetic energy continuously trade places according to conservative thermodynamic laws.',
      theoryOverview: [
        'Work is defined as the line integral of force over displacement: W = ∫ F · dr = F d cos(θ). If force and displacement are perpendicular (θ = 90°), work is strictly zero.',
        'The Work-Energy Theorem proves that the net work done by all forces acting on a particle equals the change in its kinetic energy: W_net = ΔK = ½mv_f² - ½mv_i².',
        'Conservative forces (like gravity and ideal springs) have path-independent work. For any closed loop, conservative work is zero (∮ F_c · dr = 0).',
        'Mechanical energy E = K + U is conserved in the absence of non-conservative dissipation (like friction or air drag).'
      ],
      sections: [
        {
          id: 'mech-3-s1',
          title: '1. The Work-Energy Theorem',
          paragraphs: [
            'Work is done only when a force component acts along the direction of displacement. A porter carrying a suitcase horizontally on his head does zero work against gravity because force is vertical while displacement is horizontal (cos 90° = 0).',
            'Net work includes contributions from both conservative and non-conservative forces: W_net = W_conservative + W_friction = \\Delta K.'
          ],
          equation: {
            name: 'Work Done by Constant Force',
            formula: 'W = \\vec{F} \\cdot \\vec{d} = F d \\cos(\\theta)',
            explanation: 'θ is the angle between the applied force vector and the displacement vector.'
          },
          knowledgeChecks: [
            {
              id: 'kc-mech-3-1',
              type: 'mcq',
              prompt: 'A satellite orbits Earth in a circular path at constant speed. What is the work done by Earth’s gravitational force on the satellite over one full orbit?',
              options: ['0 Joules', '2πGMm / r', 'GMm / r²', '½mv²'],
              correctAnswer: 0,
              explanation: 'Gravitational force points radially inward while instantaneous velocity is tangent to the circle (θ = 90°). Since cos(90°) = 0, gravity does zero work at every instant.',
              rewardXp: 15,
              rewardGeo: 10
            }
          ]
        }
      ],
      highlights: {
        definitions: [
          { term: 'Work', definition: 'Energy transferred to or from an object via the application of force along a displacement.', keySymbol: 'W = \\int \\vec{F} \\cdot d\\vec{r} (Joules)' },
          { term: 'Conservative Force', definition: 'A force for which work done in moving between two points is independent of the path taken.', keySymbol: '\\nabla \\times \\vec{F} = 0' }
        ],
        formulas: [
          { name: 'Work-Energy Theorem', formula: 'W_{\\text{net}} = \\Delta K = \\frac{1}{2}m v_f^2 - \\frac{1}{2}m v_i^2', units: 'Joules (J)', breakdown: 'Relates total mechanical work directly to speed change.' },
          { name: 'Instantaneous Power', formula: 'P = \\frac{dW}{dt} = \\vec{F} \\cdot \\vec{v}', units: 'Watts (W = J/s)', breakdown: 'Rate of energy transfer at any given instant.' }
        ],
        keyPoints: [
          'Perpendicular forces do zero work.',
          'Gravity and springs are conservative; friction and drag are non-conservative.',
          'Power is the dot product of force and instantaneous velocity.'
        ],
        examTips: [
          'Whenever solving for final speed without needing time, prefer the Work-Energy Theorem over kinematic equations.'
        ]
      },
      flashcards: [
        { id: 'fc-mech-3-1', concept: 'Circular Motion Work', front: 'Does centripetal force do work on a revolving mass in a circle?', back: 'Zero work. Centripetal force is always perpendicular to instantaneous displacement vector (cos 90° = 0).', category: 'definition', difficulty: 'beginner' }
      ],
      summary: {
        fiveKeyTakeaways: [
          'Work is the scalar product of force and displacement.',
          'W_net = ΔK regardless of force complexity.',
          'Conservative forces store potential energy: ΔU = -W_conservative.',
          'Total mechanical energy is conserved when non-conservative work is zero.',
          'Power P = F · v represents instantaneous rate of work.'
        ],
        importantFormulas: [
          { name: 'Spring Potential Energy', math: 'U_s = \\frac{1}{2}kx^2', note: 'Hooke’s Law elastic energy.' }
        ],
        commonMistakes: [
          { mistake: 'Confusing potential energy with work.', correction: 'Potential energy change is the NEGATIVE of work done by conservative force: ΔU = -W_c.', why: 'Gravity doing positive work lowers the object’s potential energy.' }
        ],
        revisionChecklist: [
          { id: 'rev-3-1', label: 'Work-Energy Conservation Checklist', details: 'Set initial K + U equal to final K + U + losses.' }
        ]
      },
      curatedDoubts: [
        {
          question: 'Why is energy scalar even though force and displacement are vectors?',
          answer: 'Work is the dot product (scalar product) of two vectors. It quantifies how much energy was transferred, which has magnitude but no spatial direction in 3D space.',
          analogy: 'Your bank balance increases or decreases by a number of dollars, but the money has no compass direction.'
        }
      ]
    },

    // Stage 4: Momentum & Impulse
    4: {
      courseId: 'course-mechanics',
      stageNumber: 4,
      chapterTitle: 'Linear Momentum, Collisions & Center of Mass',
      conceptFocus: 'Impulse-Momentum Theorem, Elastic/Inelastic Impacts & Center of Mass',
      lore: 'The desolate quartz expanse where supersonic speed and momentum transfer collide beneath a perpetual crescent moon.',
      theoryOverview: [
        'Linear momentum is defined as p = m·v. It is a vector quantity having the same direction as velocity.',
        'Impulse J is the integral of force over collision duration: J = ∫ F dt = F_avg Δt = Δp. Extending collision time reduces peak impact force.',
        'In any isolated system with zero net external force, total linear momentum is conserved in all directions: Σ p_initial = Σ p_final.',
        'Collisions are categorized by kinetic energy conservation: Elastic collisions conserve both momentum and kinetic energy; Inelastic collisions conserve momentum but lose kinetic energy to heat/deformation.'
      ],
      sections: [
        {
          id: 'mech-4-s1',
          title: '1. Impulse and Impact Force Mitigation',
          paragraphs: [
            'Automobile airbags and catching a cricket ball with retreating hands both use the Impulse-Momentum Theorem. Because Δp is fixed for a given change in velocity, increasing impact duration Δt dramatically decreases the average force felt by the body: F_avg = Δp / Δt.'
          ],
          equation: {
            name: 'Impulse-Momentum Theorem',
            formula: '\\vec{J} = \\int \\vec{F} dt = \\vec{F}_{\\text{avg}} \\Delta t = \\Delta \\vec{p}',
            explanation: 'Impulse equals the change in momentum.'
          },
          knowledgeChecks: [
            {
              id: 'kc-mech-4-1',
              type: 'mcq',
              prompt: 'A cricketer pulls his hands backward while catching a fast cricket ball. Why does he do this?',
              options: [
                'To increase the time of contact and reduce the impact force on his hands',
                'To increase the impulse delivered by the ball',
                'To decrease the change in momentum of the ball',
                'To catch the ball at a higher elevation'
              ],
              correctAnswer: 0,
              explanation: 'Because Δp is constant, extending time Δt lowers average force: F = Δp / Δt.',
              rewardXp: 15,
              rewardGeo: 10
            }
          ]
        }
      ],
      highlights: {
        definitions: [
          { term: 'Linear Momentum', definition: 'The quantity of motion of a moving body, measured as product of mass and velocity.', keySymbol: '\\vec{p} = m\\vec{v} (kg\\cdot m/s)' },
          { term: 'Impulse', definition: 'The overall effect of a force acting over time, equal to change in linear momentum.', keySymbol: '\\vec{J} = \\int \\vec{F} dt' }
        ],
        formulas: [
          { name: 'Conservation of Momentum', formula: 'm_1 \\vec{v}_{1i} + m_2 \\vec{v}_{2i} = m_1 \\vec{v}_{1f} + m_2 \\vec{v}_{2f}', units: 'kg·m/s', breakdown: 'Holds for all isolated collision systems.' }
        ],
        keyPoints: [
          'Momentum is conserved in all collisions if external net force is zero.',
          'Kinetic energy is ONLY conserved in perfectly elastic collisions.'
        ],
        examTips: [
          'In perfectly inelastic collisions, bodies stick together and move with common final velocity v_f = (m₁v₁ + m₂v₂) / (m₁ + m₂).'
        ]
      },
      flashcards: [
        { id: 'fc-mech-4-1', concept: 'Elastic vs Inelastic', front: 'What is the key difference between elastic and inelastic collisions?', back: 'Momentum is conserved in BOTH. However, Kinetic Energy is conserved ONLY in elastic collisions; in inelastic collisions, KE is converted into heat and deformation.', category: 'definition', difficulty: 'beginner' }
      ],
      summary: {
        fiveKeyTakeaways: [
          'Linear momentum p = mv is a vector quantity.',
          'Impulse J = F Δt = Δp; longer time means lower peak force.',
          'Isolated systems conserve total momentum.',
          'Kinetic energy is conserved only in elastic collisions.',
          'Center of mass moves as if all mass were concentrated at that point.'
        ],
        importantFormulas: [
          { name: 'Coefficient of Restitution', math: 'e = \\frac{v_{2f} - v_{1f}}{v_{1i} - v_{2i}}', note: 'e = 1 for elastic, e = 0 for completely inelastic.' }
        ],
        commonMistakes: [
          { mistake: 'Thinking kinetic energy is conserved in all collisions.', correction: 'Only momentum is always conserved in isolated collisions; kinetic energy is frequently dissipated.', why: 'Deformation and sound dissipate mechanical energy.' }
        ],
        revisionChecklist: [
          { id: 'rev-4-1', label: 'Coefficient of Restitution', details: 'Know how e measures relative separation speed over approach speed.' }
        ]
      },
      curatedDoubts: [
        {
          question: 'If momentum is conserved, why does a bouncing basketball eventually stop?',
          answer: 'The basketball and floor system loses kinetic energy to heat and sound on each inelastic bounce (e < 1). Also, Earth is part of the system, absorbing minute momentum.',
          analogy: 'Dropping a ball of dough vs a superball.'
        }
      ]
    },

    // Stage 5: Rotational Motion & Torque
    5: {
      courseId: 'course-mechanics',
      stageNumber: 5,
      chapterTitle: 'Rotational Dynamics, Torque & Angular Momentum',
      conceptFocus: 'Moment of Inertia, Torque, Angular Momentum & Rolling Motion',
      lore: 'The celestial throne of Las Noches where rotational torque and spinning Zanpakuto blade arcs determine dominion.',
      theoryOverview: [
        'Rotational dynamics mirrors linear dynamics through rotational analogues: mass m becomes Moment of Inertia I, force F becomes Torque τ, and linear momentum p becomes Angular Momentum L.',
        'Torque τ is the rotational effectiveness of a force: τ = r × F = r F sin(θ). It causes angular acceleration α according to τ_net = I·α.',
        'Moment of inertia I = Σ m_i r_i² depends not only on mass, but crucially on how mass is distributed relative to the rotation axis.',
        'Angular momentum L = I·ω is strictly conserved when net external torque is zero: I_initial ω_initial = I_final ω_final.'
      ],
      sections: [
        {
          id: 'mech-5-s1',
          title: '1. Rotational Analogues & Conservation of Angular Momentum',
          paragraphs: [
            'A spinning figure skater pulling their arms inward demonstrates the conservation of angular momentum. By pulling arms closer to the body, distance r decreases, reducing moment of inertia I. Because external torque is zero, angular velocity ω must increase dramatically: I₁ω₁ = I₂ω₂.'
          ],
          equation: {
            name: 'Torque & Angular Acceleration',
            formula: '\\vec{\\tau} = \\vec{r} \\times \\vec{F} = I \\vec{\\alpha}',
            explanation: 'Net torque equals moment of inertia times angular acceleration.'
          },
          knowledgeChecks: [
            {
              id: 'kc-mech-5-1',
              type: 'mcq',
              prompt: 'A spinning figure skater on frictionless ice pulls her arms inward. What happens to her angular momentum and rotational kinetic energy?',
              options: [
                'Angular momentum remains constant; Kinetic energy increases',
                'Both angular momentum and kinetic energy remain constant',
                'Angular momentum increases; Kinetic energy decreases',
                'Both angular momentum and kinetic energy decrease'
              ],
              correctAnswer: 0,
              explanation: 'Angular momentum is conserved (no external torque). But kinetic energy K = L² / (2I) increases because the skater does internal muscular work pulling her arms in against centrifugal effect.',
              rewardXp: 20,
              rewardGeo: 15
            }
          ]
        }
      ],
      highlights: {
        definitions: [
          { term: 'Moment of Inertia', definition: 'A quantitative measure of an object’s rotational inertia; its resistance to angular acceleration.', keySymbol: 'I = \\int r^2 dm (kg\\cdot m^2)' },
          { term: 'Torque', definition: 'The rotational equivalent of linear force; a measure of the turning tendency of a force.', keySymbol: '\\vec{\\tau} = \\vec{r} \\times \\vec{F} (N\\cdot m)' }
        ],
        formulas: [
          { name: 'Conservation of Angular Momentum', formula: 'I_1 \\omega_1 = I_2 \\omega_2', units: 'kg·m²/s', breakdown: 'Holds whenever net external torque is zero.' },
          { name: 'Rolling Without Slipping', formula: 'v_{\\text{cm}} = \\omega R, \\quad K_{\\text{total}} = \\frac{1}{2}mv_{\\text{cm}}^2 + \\frac{1}{2}I_{\\text{cm}}\\omega^2', units: 'Joules', breakdown: 'Total kinetic energy combines translation and rotation.' }
        ],
        keyPoints: [
          'Mass further from rotation axis contributes exponentially more to moment of inertia (r²).',
          'A solid cylinder rolls down an incline faster than a hollow ring because less energy is diverted into rotation.'
        ],
        examTips: [
          'Use the Parallel Axis Theorem I = I_cm + Md² to calculate moment of inertia about any parallel axis displaced by distance d.'
        ]
      },
      flashcards: [
        { id: 'fc-mech-5-1', concept: 'Rolling Race', front: 'Which rolls down an incline faster: a solid cylinder or a hollow pipe of equal mass and radius?', back: 'The solid cylinder! A solid cylinder has smaller moment of inertia (½MR² vs MR²), so it diverts less potential energy into rotational kinetic energy and more into forward translation.', category: 'exam_trick', difficulty: 'intermediate' }
      ],
      summary: {
        fiveKeyTakeaways: [
          'Torque is the rotational analogue of force: τ = r × F = Iα.',
          'Moment of inertia I measures mass distribution relative to axis: I = ∫ r² dm.',
          'Angular momentum L = Iω is conserved when net external torque is zero.',
          'Work done by muscles during arm contraction increases rotational kinetic energy.',
          'Pure rolling kinetic energy includes both translation and rotation.'
        ],
        importantFormulas: [
          { name: 'Parallel Axis Theorem', math: 'I = I_{\\text{cm}} + M d^2', note: 'Shifts moment of inertia to an axis distance d away.' }
        ],
        commonMistakes: [
          { mistake: 'Assuming rotational kinetic energy must stay constant if angular momentum is conserved.', correction: 'Kinetic energy K = L²/(2I) increases if I decreases, because internal work is performed.', why: 'Muscles pull mass inward against centrifugal tendencies.' }
        ],
        revisionChecklist: [
          { id: 'rev-5-1', label: 'Rotational Kinematics Analogy', details: 'Map θ ↔ x, ω ↔ v, α ↔ a, I ↔ m, τ ↔ F.' }
        ]
      },
      curatedDoubts: [
        {
          question: 'Why does a bicycle stay upright more easily when moving than when stopped?',
          answer: 'The spinning wheels possess angular momentum L pointing horizontally along the axle. Any tilt torque causes gyroscopic precession rather than a direct fall, giving the rider time to balance.',
          analogy: 'Spinning a spinning top vs trying to balance a stationary top on its tip.'
        }
      ]
    }
  },

  // =========================================================================
  // 2. PHYSICS II — ELECTRICITY & MAGNETISM
  // =========================================================================
  'course-electromagnetism': {
    1: {
      courseId: 'course-electromagnetism',
      stageNumber: 1,
      chapterTitle: 'Electric Charges, Coulomb’s Law & Gauss’s Law',
      conceptFocus: 'Electrostatic Fields, Flux & Symmetrical Charge Distributions',
      lore: 'The dimensional boundary where electric flux and Coulomb force fields shield sovereign Reiatsu shields.',
      theoryOverview: [
        'Coulomb’s Law quantifies the electrostatic force between two stationary point charges: F = k·|q₁q₂| / r². Like charges repel, unlike charges attract.',
        'Electric field E is the force per unit test charge: E = F / q₀. Field lines originate on positive charges and terminate on negative charges.',
        'Electric Flux Φ_E measures the flow of electric field through a surface: Φ_E = ∫ E · dA.',
        'Gauss’s Law states that total electric flux through any closed Gaussian surface equals the enclosed charge divided by ε₀: ∮ E · dA = Q_enc / ε₀.'
      ],
      sections: [
        {
          id: 'em-1-s1',
          title: '1. Gauss’s Law & Electrostatic Shielding',
          paragraphs: [
            'Gauss’s Law allows effortless computation of electric fields for symmetric charge geometries (spherical, cylindrical, and planar).',
            'Inside an electrostatic conductor in equilibrium, the electric field is strictly ZERO (E = 0). All excess charge resides entirely on the outer surface, forming a Faraday cage that shields the interior.'
          ],
          equation: {
            name: 'Gauss’s Law',
            formula: '\\Phi_E = \\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{\\text{enclosed}}}{\\varepsilon_0}',
            explanation: 'Relates total outward electric flux to net enclosed charge.'
          },
          knowledgeChecks: [
            {
              id: 'kc-em-1-1',
              type: 'mcq',
              prompt: 'What is the electric field inside a hollow metallic sphere carrying a uniform charge Q on its surface?',
              options: ['0', 'kQ / r²', 'kQ / R²', 'Infinite'],
              correctAnswer: 0,
              explanation: 'A Gaussian surface placed inside the hollow sphere encloses zero net charge (Q_enc = 0). By Gauss’s Law, E = 0 everywhere inside.',
              rewardXp: 15,
              rewardGeo: 10
            }
          ]
        }
      ],
      highlights: {
        definitions: [
          { term: 'Electric Flux', definition: 'Measure of the distribution of the electric field through a given surface.', keySymbol: '\\Phi_E = \\int \\vec{E} \\cdot d\\vec{A} (N\\cdot m^2/C)' },
          { term: 'Faraday Cage', definition: 'An enclosure used to block electromagnetic fields; E is zero inside any hollow conductor.', keySymbol: 'E_{\\text{inside}} = 0' }
        ],
        formulas: [
          { name: 'Coulomb’s Law', formula: 'F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{|q_1 q_2|}{r^2}', units: 'Newtons', breakdown: 'Point charges in vacuum; ε₀ ≈ 8.85 × 10⁻¹² F/m.' }
        ],
        keyPoints: [
          'Electric field is always perpendicular to conductor surfaces in electrostatic equilibrium.',
          'Electric flux depends only on enclosed charge, not on charges outside the Gaussian surface.'
        ],
        examTips: [
          'Charges outside a Gaussian surface contribute to the local electric field E, but their net contribution to total flux ∮ E · dA over the entire surface is strictly zero!'
        ]
      },
      flashcards: [
        { id: 'fc-em-1-1', concept: 'Conductor Interior Field', front: 'Why is the static electric field inside a solid conductor always zero?', back: 'Free electrons redistribute in picoseconds until their internal field cancels the applied field completely. If E were nonzero, free electrons would continue accelerating.', category: 'definition', difficulty: 'beginner' }
      ],
      summary: {
        fiveKeyTakeaways: [
          'Coulomb force obeys the inverse square law F ∝ 1/r².',
          'Electric field lines never cross and point from positive to negative.',
          'Gauss’s Law equates closed surface flux to Q_enc / ε₀.',
          'Field inside a conductor is zero in electrostatic equilibrium.',
          'Faraday cages block external static electric fields completely.'
        ],
        importantFormulas: [
          { name: 'Infinite Sheet Field', math: 'E = \\frac{\\sigma}{2\\varepsilon_0}', note: 'Uniform field independent of distance from infinite planar sheet.' }
        ],
        commonMistakes: [
          { mistake: 'Thinking external charges change the total flux through a Gaussian surface.', correction: 'External charges create field lines that enter and exit the closed surface, contributing zero net flux.', why: 'Every entering line must leave.' }
        ],
        revisionChecklist: [
          { id: 'rev-em-1', label: 'Gauss Law Symmetries', details: 'Practice spherical, cylindrical, and planar Gaussian surfaces.' }
        ]
      },
      curatedDoubts: [
        {
          question: 'Why are you safe inside a car when struck by lightning?',
          answer: 'The metal frame acts as a Faraday cage. Electrical charge flows along the outside metal skin into the ground without penetrating the interior cabin.',
          analogy: 'Water flowing around an umbrella while leaving you dry underneath.'
        }
      ]
    },
    2: { courseId: 'course-electromagnetism', stageNumber: 2, chapterTitle: 'Electric Potential & Capacitance', conceptFocus: 'Voltage Wells & Dielectrics', lore: 'Senkaimon potential wells.', theoryOverview: ['Voltage is electric potential energy per charge.'], sections: [], highlights: { definitions: [], formulas: [], keyPoints: [], examTips: [] }, flashcards: [], summary: { fiveKeyTakeaways: ['V = -∫ E · dr'], importantFormulas: [], commonMistakes: [], revisionChecklist: [] }, curatedDoubts: [] },
    3: { courseId: 'course-electromagnetism', stageNumber: 3, chapterTitle: 'Current, Resistance & DC Circuits', conceptFocus: 'Ohm’s Law & Kirchhoff’s Rules', lore: 'Current flow in Soul Society circuits.', theoryOverview: ['Kirchhoff junction and loop laws govern circuits.'], sections: [], highlights: { definitions: [], formulas: [], keyPoints: [], examTips: [] }, flashcards: [], summary: { fiveKeyTakeaways: ['Σ I = 0 at junctions', 'Σ V = 0 around loops'], importantFormulas: [], commonMistakes: [], revisionChecklist: [] }, curatedDoubts: [] },
    4: { courseId: 'course-electromagnetism', stageNumber: 4, chapterTitle: 'Magnetic Forces & Biot-Savart Law', conceptFocus: 'Lorentz Force & Ampere’s Law', lore: 'Magnetic field vectors around charged currents.', theoryOverview: ['Moving charges experience magnetic force F = q(v × B).'], sections: [], highlights: { definitions: [], formulas: [], keyPoints: [], examTips: [] }, flashcards: [], summary: { fiveKeyTakeaways: ['F = q(v × B) is always perpendicular to velocity.'], importantFormulas: [], commonMistakes: [], revisionChecklist: [] }, curatedDoubts: [] },
    5: { courseId: 'course-electromagnetism', stageNumber: 5, chapterTitle: 'Electromagnetic Induction & Maxwell’s Equations', conceptFocus: 'Faraday’s Law & Lenz’s Law', lore: 'Induction storms across Las Noches.', theoryOverview: ['Changing magnetic flux induces an electromotive force (EMF).'], sections: [], highlights: { definitions: [], formulas: [], keyPoints: [], examTips: [] }, flashcards: [], summary: { fiveKeyTakeaways: ['EMF = -dΦ_B / dt.'], importantFormulas: [], commonMistakes: [], revisionChecklist: [] }, curatedDoubts: [] }
  },

  // =========================================================================
  // 3. MATHEMATICS — CALCULUS
  // =========================================================================
  'course-calculus': {
    1: {
      courseId: 'course-calculus',
      stageNumber: 1,
      chapterTitle: 'Limits, Continuity & Foundational Derivations',
      conceptFocus: 'Epsilon-Delta Definition, Squeeze Theorem & L’Hôpital’s Rule',
      lore: 'The boundary of infinitesimal change where limits pierce the veil of indeterminate forms.',
      theoryOverview: [
        'A limit describes the behavior of a function as its input gets arbitrarily close to a specific value: lim_{x → a} f(x) = L.',
        'A function is continuous at x = a if and only if: (1) f(a) is defined, (2) lim_{x → a} f(x) exists, and (3) lim_{x → a} f(x) = f(a).',
        'L’Hôpital’s Rule allows evaluation of indeterminate forms (0/0 or ∞/∞) by differentiating numerator and denominator separately: lim f(x)/g(x) = lim f’(x)/g’(x).'
      ],
      sections: [
        {
          id: 'calc-1-s1',
          title: '1. Indeterminate Forms & L’Hôpital’s Rule',
          paragraphs: [
            'When direct substitution yields 0/0 or ∞/∞, it does not mean the limit does not exist! It means the limit is indeterminate.',
            'L’Hôpital’s Rule applies strictly to 0/0 or ±∞/∞. Always verify that the form is truly indeterminate before taking derivatives of numerator and denominator.'
          ],
          equation: {
            name: 'L’Hôpital’s Rule',
            formula: '\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f\'(x)}{g\'(x)}',
            explanation: 'Differentiate top and bottom independently until indeterminate form resolves.'
          },
          knowledgeChecks: [
            {
              id: 'kc-calc-1-1',
              type: 'mcq',
              prompt: 'What is the limit of (sin x) / x as x approaches 0?',
              options: ['1', '0', 'Undefined', 'Infinity'],
              correctAnswer: 0,
              explanation: 'As x → 0, sin(x)/x gives 0/0. Applying L’Hôpital’s Rule: d(sin x)/dx = cos x and d(x)/dx = 1. Limit is cos(0)/1 = 1.',
              rewardXp: 15,
              rewardGeo: 10
            }
          ]
        }
      ],
      highlights: {
        definitions: [
          { term: 'Continuous Function', definition: 'A function without jumps, breaks, or holes; lim_{x→a} f(x) = f(a).', keySymbol: 'f(a) = L' },
          { term: 'Derivative', definition: 'The instantaneous rate of change of a function, defined as the limit of the difference quotient.', keySymbol: 'f\'(x) = \\lim_{h\\to 0}\\frac{f(x+h)-f(x)}{h}' }
        ],
        formulas: [
          { name: 'Standard Trig Limit', formula: '\\lim_{x\\to 0} \\frac{\\sin(x)}{x} = 1', units: 'dimensionless', breakdown: 'Essential foundation for deriving trig derivatives.' }
        ],
        keyPoints: [
          'Never use Quotient Rule when applying L’Hôpital’s Rule; differentiate numerator and denominator separately.'
        ],
        examTips: [
          'Always check if the form is indeterminate before applying L’Hôpital’s Rule; applying it to a determinate fraction gives the wrong answer!'
        ]
      },
      flashcards: [
        { id: 'fc-calc-1-1', concept: 'L’Hôpital Prerequisite', front: 'When is L’Hôpital’s Rule valid to use?', back: 'ONLY when direct substitution produces an indeterminate form: 0/0 or ±∞/∞. If the fraction has a determinate limit like 0/5 or 3/0, L’Hôpital cannot be used!', category: 'exam_trick', difficulty: 'beginner' }
      ],
      summary: {
        fiveKeyTakeaways: [
          'Limits describe approaching behavior, not necessarily the value at the point.',
          'Continuity requires limit to match actual function value.',
          'Indeterminate forms 0/0 require algebraic simplification or L’Hôpital’s Rule.',
          'Differentiability implies continuity, but continuity does not guarantee differentiability.',
          'The Squeeze Theorem traps functions between known bounds to prove limits.'
        ],
        importantFormulas: [
          { name: 'Derivative Definition', math: 'f\'(x) = \\lim_{h\\to 0} \\frac{f(x+h) - f(x)}{h}', note: 'First principles derivation.' }
        ],
        commonMistakes: [
          { mistake: 'Applying Quotient Rule inside L’Hôpital’s Rule.', correction: 'Differentiate the top and bottom independently: f’(x) / g’(x).', why: 'L’Hôpital compares relative rates of change.' }
        ],
        revisionChecklist: [
          { id: 'rev-calc-1', label: 'Indeterminate Form Identification', details: 'Recognize 0/0, ∞/∞, 0·∞, 1^∞, ∞ - ∞.' }
        ]
      },
      curatedDoubts: [
        {
          question: 'Why does 0/0 not equal 1 or 0?',
          answer: '0/0 is indeterminate because it depends entirely on how quickly the numerator and denominator approach zero. For example, 2x / x approaches 2, while 5x / x approaches 5, yet both are 0/0 at x = 0.',
          analogy: 'A race between two runners towards the finish line: whoever was traveling faster determines the outcome.'
        }
      ]
    },
    2: { courseId: 'course-calculus', stageNumber: 2, chapterTitle: 'Differential Rules & Chain Rule', conceptFocus: 'Product, Quotient & Chain Rules', lore: 'Zanpakuto sharpness calculus.', theoryOverview: ['Derivatives of composite functions require the chain rule.'], sections: [], highlights: { definitions: [], formulas: [], keyPoints: [], examTips: [] }, flashcards: [], summary: { fiveKeyTakeaways: ['(f ∘ g)’ = f’(g(x)) · g’(x)'], importantFormulas: [], commonMistakes: [], revisionChecklist: [] }, curatedDoubts: [] },
    3: { courseId: 'course-calculus', stageNumber: 3, chapterTitle: 'Optimization & Curve Sketching', conceptFocus: 'Critical Points & Inflection', lore: 'Finding optimal Bankai power curves.', theoryOverview: ['First and second derivative tests find local extrema.'], sections: [], highlights: { definitions: [], formulas: [], keyPoints: [], examTips: [] }, flashcards: [], summary: { fiveKeyTakeaways: ['f’ = 0 marks stationary points.'], importantFormulas: [], commonMistakes: [], revisionChecklist: [] }, curatedDoubts: [] },
    4: { courseId: 'course-calculus', stageNumber: 4, chapterTitle: 'Indefinite & Definite Integrals', conceptFocus: 'Fundamental Theorem of Calculus', lore: 'Accumulation of spiritual pressure.', theoryOverview: ['Integration is the inverse operation of differentiation.'], sections: [], highlights: { definitions: [], formulas: [], keyPoints: [], examTips: [] }, flashcards: [], summary: { fiveKeyTakeaways: ['∫ f(x) dx = F(b) - F(a).'], importantFormulas: [], commonMistakes: [], revisionChecklist: [] }, curatedDoubts: [] },
    5: { courseId: 'course-calculus', stageNumber: 5, chapterTitle: 'Advanced Integration Techniques & Differential Equations', conceptFocus: 'Parts, Partial Fractions & Separation of Variables', lore: 'Yhwach transcendental Quincy equations.', theoryOverview: ['Integration by parts uses ∫ u dv = uv - ∫ v du.'], sections: [], highlights: { definitions: [], formulas: [], keyPoints: [], examTips: [] }, flashcards: [], summary: { fiveKeyTakeaways: ['Integration by parts undoes the product rule.'], importantFormulas: [], commonMistakes: [], revisionChecklist: [] }, curatedDoubts: [] }
  },

  // =========================================================================
  // 4. COMPUTER SCIENCE & ALGORITHMICS
  // =========================================================================
  'course-cs': {
    1: {
      courseId: 'course-cs',
      stageNumber: 1,
      chapterTitle: 'Asymptotic Complexity & Big-O Notation',
      conceptFocus: 'Time & Space Complexity, Recurrences & Big-O Analysis',
      lore: 'The algorithmic domain of Kisuke Urahara where computation costs determine survival in high-speed code execution.',
      theoryOverview: [
        'Big-O notation describes the upper bound of algorithm runtime as input size n approaches infinity.',
        'Common time complexities in order of efficiency: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!).',
        'Space complexity measures the auxiliary memory required by an algorithm, including recursive call stack frames.'
      ],
      sections: [
        {
          id: 'cs-1-s1',
          title: '1. Asymptotic Analysis & Dominant Terms',
          paragraphs: [
            'In Big-O notation, we drop constant multipliers and lower-order terms because for massive n, the highest-order term completely dominates execution time.',
            'For example, f(n) = 3n² + 100n + 5000 is O(n²) because when n = 1,000,000, n² is one trillion, making 100n and constants completely negligible.'
          ],
          equation: {
            name: 'Formal Big-O Definition',
            formula: 'f(n) \\le c \\cdot g(n) \\quad \\text{for all } n \\ge n_0',
            explanation: 'f(n) is bounded from above by a constant multiple of g(n).'
          },
          knowledgeChecks: [
            {
              id: 'kc-cs-1-1',
              type: 'mcq',
              prompt: 'What is the time complexity of searching for an element in a balanced binary search tree with n nodes?',
              options: ['O(log n)', 'O(n)', 'O(1)', 'O(n log n)'],
              correctAnswer: 0,
              explanation: 'At each comparison in a balanced BST, half of the remaining elements are eliminated, yielding logarithmic O(log n) search time.',
              rewardXp: 15,
              rewardGeo: 10
            }
          ]
        }
      ],
      highlights: {
        definitions: [
          { term: 'Big-O Notation', definition: 'Mathematical notation that describes the limiting behavior of a function when the argument tends towards infinity.', keySymbol: 'O(g(n))' },
          { term: 'Auxiliary Space', definition: 'Extra space or temporary memory used by an algorithm, excluding input size.', keySymbol: 'O(1) \\text{ auxiliary}' }
        ],
        formulas: [
          { name: 'Binary Search Recurrence', formula: 'T(n) = T(n/2) + O(1) \\implies O(\\log n)', units: 'steps', breakdown: 'Master theorem Case 2 applies.' }
        ],
        keyPoints: [
          'Constants and lower-order terms do not affect asymptotic Big-O classification.',
          'Recursion incurs O(depth) call stack memory overhead.'
        ],
        examTips: [
          'When nested loops both run up to n, complexity is O(n²); if inner loop doubles (j *= 2), complexity is O(n log n).'
        ]
      },
      flashcards: [
        { id: 'fc-cs-1-1', concept: 'Logarithmic Growth', front: 'Why is O(log n) considered exceptionally fast?', back: 'Because log₂(1,000,000) is approximately 20 operations! Even for billions of inputs, logarithmic algorithms complete in a handful of steps.', category: 'definition', difficulty: 'beginner' }
      ],
      summary: {
        fiveKeyTakeaways: [
          'Big-O focuses on scalability for very large n.',
          'Drop constant coefficients and lower-order terms.',
          'Binary search is O(log n); linear search is O(n).',
          'Divide-and-conquer algorithms like Merge Sort run in O(n log n).',
          'Recursive call stack counts towards space complexity.'
        ],
        importantFormulas: [
          { name: 'Master Theorem Form', math: 'T(n) = aT(n/b) + f(n)', note: 'Solves divide-and-conquer recurrences.' }
        ],
        commonMistakes: [
          { mistake: 'Assuming two separate loops are O(n²).', correction: 'Two sequential loops are O(n + n) = O(n); only nested loops multiply to O(n²).', why: 'Operations are added sequentially, not nested.' }
        ],
        revisionChecklist: [
          { id: 'rev-cs-1', label: 'Complexity Hierarchy Ranking', details: 'Be able to order 1, log n, n, n log n, n², 2ⁿ.' }
        ]
      },
      curatedDoubts: [
        {
          question: 'Does an O(n) algorithm always run faster than an O(n²) algorithm?',
          answer: 'For very small inputs (e.g. n = 2), an O(n²) algorithm might finish faster due to smaller setup overhead. But as n grows beyond a crossover point n₀, O(n) is guaranteed to win by an enormous margin.',
          analogy: 'A supercar that takes 5 seconds to start the engine vs a bicycle that pedaling starts immediately; over 100 miles, the car wins easily.'
        }
      ]
    },
    2: { courseId: 'course-cs', stageNumber: 2, chapterTitle: 'Data Structures: Arrays, Lists & Hash Maps', conceptFocus: 'Memory Allocation & Amortized Lookups', lore: 'Data caches in Seireitei archives.', theoryOverview: ['Hash tables achieve O(1) expected lookup.'], sections: [], highlights: { definitions: [], formulas: [], keyPoints: [], examTips: [] }, flashcards: [], summary: { fiveKeyTakeaways: ['Hash maps offer O(1) expected lookup.'], importantFormulas: [], commonMistakes: [], revisionChecklist: [] }, curatedDoubts: [] },
    3: { courseId: 'course-cs', stageNumber: 3, chapterTitle: 'Recursion & Divide-and-Conquer', conceptFocus: 'Merge Sort & Recursion Trees', lore: 'Recursive spells of Urahara.', theoryOverview: ['Divide, conquer, and combine.'], sections: [], highlights: { definitions: [], formulas: [], keyPoints: [], examTips: [] }, flashcards: [], summary: { fiveKeyTakeaways: ['Base cases prevent stack overflow.'], importantFormulas: [], commonMistakes: [], revisionChecklist: [] }, curatedDoubts: [] },
    4: { courseId: 'course-cs', stageNumber: 4, chapterTitle: 'Trees, Graphs & Traversal Algorithms', conceptFocus: 'BFS, DFS & Shortest Path', lore: 'Navigating Hueco Mundo graph networks.', theoryOverview: ['BFS finds shortest unweighted paths.'], sections: [], highlights: { definitions: [], formulas: [], keyPoints: [], examTips: [] }, flashcards: [], summary: { fiveKeyTakeaways: ['BFS uses a Queue; DFS uses a Stack.'], importantFormulas: [], commonMistakes: [], revisionChecklist: [] }, curatedDoubts: [] },
    5: { courseId: 'course-cs', stageNumber: 5, chapterTitle: 'Dynamic Programming & Memoization', conceptFocus: 'Optimal Substructure & Overlapping Subproblems', lore: 'Aizen complete hypnosis state transitions.', theoryOverview: ['Memoization caches results of overlapping recursive calls.'], sections: [], highlights: { definitions: [], formulas: [], keyPoints: [], examTips: [] }, flashcards: [], summary: { fiveKeyTakeaways: ['DP converts exponential O(2ⁿ) recursion to polynomial O(n).'], importantFormulas: [], commonMistakes: [], revisionChecklist: [] }, curatedDoubts: [] }
  }
};

/**
 * Helper to retrieve lecture data for any course and stage, with safe fallback.
 */
export function getChapterLectureData(courseId: string, stageNumber: number): ChapterLectureData {
  const courseChapters = CHAPTER_LECTURE_CATALOG[courseId] || CHAPTER_LECTURE_CATALOG['course-mechanics'];
  const chapter = courseChapters[stageNumber] || courseChapters[1] || CHAPTER_LECTURE_CATALOG['course-mechanics'][1];
  return chapter;
}
