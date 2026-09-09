'use client';
import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Coins, 
  Swords, 
  X, 
  ChevronRight, 
  Lightbulb, 
  HelpCircle,
  Layers,
  ArrowRight,
  ShieldAlert,
  Flame,
  Zap,
  Target
} from 'lucide-react';
import { WorldStageNode } from './WorldMapView';
import { CourseData } from './CoursesView';

export interface SubtopicLectureContent {
  courseId: string;
  stageNumber: number;
  subtopicTitle: string;
  conceptFocus: string;
  diagnosticMisconception: string;
  theoryOverview: string[];
  keyEquations: { name: string; formula: string; explanation: string }[];
  workedExample: {
    problem: string;
    givens: string[];
    steps: { stepNum: number; action: string; math: string; reason: string }[];
    finalAnswer: string;
    trapExplanation: string;
  };
  proTipsAndPitfalls: string[];
  quickRecallCheck: {
    question: string;
    answer: string;
  };
}

export const COURSE_LECTURE_NOTES: Record<string, Record<number, SubtopicLectureContent>> = {
  // =========================================================================
  // 1. CLASSICAL MECHANICS
  // =========================================================================
  'course-mechanics': {
    1: {
      courseId: 'course-mechanics',
      stageNumber: 1,
      subtopicTitle: 'Vector Displacement, Kinematics & 2D Projectiles',
      conceptFocus: 'Foundational Vectors & Displacement',
      diagnosticMisconception: 'Believing that acceleration at the peak of a projectile’s path is zero because instantaneous vertical velocity is momentarily zero.',
      theoryOverview: [
        'Kinematics describes motion without considering the forces causing it. In two dimensions, orthogonal motion components (x and y) are completely independent.',
        'Horizontal motion has zero acceleration (assuming negligible drag), yielding constant velocity: v_x(t) = v_{0x}.',
        'Vertical motion experiences constant gravitational acceleration downwards: a_y = -g (-9.8 m/s²). Even at the highest point of projectile flight where v_y = 0, the downward acceleration remains strictly -g.',
        'Displacement is a vector pointing from the initial coordinates directly to the final coordinates, independent of the distance traversed along the curved path.'
      ],
      keyEquations: [
        {
          name: 'Horizontal Position',
          formula: 'x(t) = x_0 + v_{0}\\cos(\\theta)\\,t',
          explanation: 'No horizontal forces act, so velocity remains constant throughout.'
        },
        {
          name: 'Vertical Position',
          formula: 'y(t) = y_0 + v_{0}\\sin(\\theta)\\,t - \\frac{1}{2}g t^2',
          explanation: 'Constant downward gravitational acceleration g = 9.8 m/s².'
        },
        {
          name: 'Time of Flight (Flat Ground)',
          formula: 'T = \\frac{2 v_0 \\sin(\\theta)}{g}',
          explanation: 'Obtained by setting y(T) = 0 and solving for nonzero time.'
        }
      ],
      workedExample: {
        problem: 'A shuriken is thrown from a rooftop 20.0 m high with an initial velocity of 15.0 m/s at an angle of 30° above horizontal. Find the maximum height above ground reached by the projectile.',
        givens: ['y₀ = 20.0 m', 'v₀ = 15.0 m/s', 'θ = 30°', 'g = 9.8 m/s²'],
        steps: [
          {
            stepNum: 1,
            action: 'Calculate the vertical component of initial velocity',
            math: 'v_{0y} = v_0 \\sin(30°) = 15.0 \\times 0.5 = 7.5\\text{ m/s}',
            reason: 'Only vertical velocity determines altitude gain.'
          },
          {
            stepNum: 2,
            action: 'Use kinematic relation v_y² = v_{0y}² - 2g(y_max - y₀) with v_y = 0 at apex',
            math: '0 = (7.5)^2 - 2(9.8)(\\Delta y) \\implies 56.25 = 19.6\\,\\Delta y',
            reason: 'At the apex, vertical velocity momentarily reaches zero.'
          },
          {
            stepNum: 3,
            action: 'Solve for maximum altitude above ground',
            math: '\\Delta y = \\frac{56.25}{19.6} \\approx 2.87\\text{ m} \\implies y_{\\text{max}} = 20.0 + 2.87 = 22.87\\text{ m}',
            reason: 'Add initial launch elevation to relative vertical displacement.'
          }
        ],
        finalAnswer: 'Maximum altitude = 22.87 meters above the ground.',
        trapExplanation: 'Common Trap: Forgetting to add the initial rooftop elevation (20 m), or using the full speed v₀ = 15 m/s instead of the vertical component v₀ sin(θ).'
      },
      proTipsAndPitfalls: [
        'Always split 2D vectors into orthogonal Cartesian components before performing algebraic calculations.',
        'Remember: g is an acceleration, not a force. The gravitational force is F_g = mg.',
        'At apex, vertical speed is 0 m/s, but horizontal speed remains v₀ cos(θ).'
      ],
      quickRecallCheck: {
        question: 'What is the direction of the net acceleration of a tennis ball at the apex of its trajectory?',
        answer: 'Straight downwards towards the center of the Earth (magnitude g = 9.8 m/s²).'
      }
    },
    2: {
      courseId: 'course-mechanics',
      stageNumber: 2,
      subtopicTitle: 'Newton’s Laws of Motion, Friction & Free-Body Diagrams',
      conceptFocus: 'Net Force & Inertial Reference',
      diagnosticMisconception: 'Confusing action-reaction pairs with equal-and-opposite forces acting on the SAME body (e.g. thinking normal force and weight are a Newton’s 3rd law pair).',
      theoryOverview: [
        'Newton’s 1st Law (Inertia): An object maintains constant velocity unless acted upon by a nonzero net external force.',
        'Newton’s 2nd Law: The vector sum of external forces equals the product of mass and acceleration: ΣF = ma.',
        'Newton’s 3rd Law: When body A exerts force on body B, body B simultaneously exerts an equal in magnitude and opposite in direction force on body A: F_{A on B} = -F_{B on A}. Crucially, action-reaction pairs ALWAYS act on two different bodies.',
        'Friction: Static friction f_s ≤ μ_s N adjusts to oppose pending motion up to its threshold. Kinetic friction f_k = μ_k N is constant for sliding surfaces.'
      ],
      keyEquations: [
        {
          name: 'Newton’s Second Law',
          formula: '\\sum \\vec{F} = m\\vec{a}',
          explanation: 'Acceleration is directly proportional to net force and inversely proportional to inertial mass.'
        },
        {
          name: 'Maximum Static Friction',
          formula: 'f_{s,\\text{max}} = \\mu_s N',
          explanation: 'Threshold force required to initiate sliding motion.'
        },
        {
          name: 'Kinetic Friction Force',
          formula: 'f_k = \\mu_k N',
          explanation: 'Opposes relative sliding velocity between contacting surfaces.'
        }
      ],
      workedExample: {
        problem: 'A 10.0 kg crate rests on a rough ramp inclined at 30° above the horizontal. The coefficient of static friction is μ_s = 0.60. Does the crate slide down on its own?',
        givens: ['m = 10.0 kg', 'θ = 30°', 'μ_s = 0.60', 'g = 9.8 m/s²'],
        steps: [
          {
            stepNum: 1,
            action: 'Calculate component of gravitational force pulling down the incline',
            math: 'F_{\\parallel} = mg \\sin(30°) = (10)(9.8)(0.5) = 49.0\\text{ N}',
            reason: 'Gravitational vector resolved parallel to the ramp surface.'
          },
          {
            stepNum: 2,
            action: 'Find the normal force perpendicular to the ramp',
            math: 'N = mg \\cos(30°) = (10)(9.8)(0.866) = 84.87\\text{ N}',
            reason: 'Normal force balances the perpendicular component of gravity.'
          },
          {
            stepNum: 3,
            action: 'Compute maximum static friction resistance',
            math: 'f_{s,\\text{max}} = \\mu_s N = 0.60 \\times 84.87 = 50.92\\text{ N}',
            reason: 'If F_parallel ≤ f_{s,max}, static friction prevents motion.'
          }
        ],
        finalAnswer: 'No, the crate remains stationary because F_parallel (49.0 N) < f_{s,max} (50.92 N).',
        trapExplanation: 'The critical slip angle is tan(θ_c) = μ_s. Here tan(30°) = 0.577, which is less than 0.60, confirming the crate will not slide.'
      },
      proTipsAndPitfalls: [
        'Normal force is NOT always mg. On an incline, N = mg cos(θ). If vertical accelerations exist (like an elevator), N = m(g + a).',
        'Action and reaction forces never cancel each other because they act on separate bodies.'
      ],
      quickRecallCheck: {
        question: 'What is the reaction force to Earth’s gravitational pull on a falling apple?',
        answer: 'The upward gravitational pull of the apple on the entire Earth (equal in magnitude, opposite in direction).'
      }
    },
    3: {
      courseId: 'course-mechanics',
      stageNumber: 3,
      subtopicTitle: 'Work-Energy Theorem, Conservative Forces & Potential Energy',
      conceptFocus: 'Conservation of Mechanical Energy',
      diagnosticMisconception: 'Assuming normal force or centripetal force does work on a body, ignoring that perpendicular forces do zero mechanical work.',
      theoryOverview: [
        'Work is defined as W = ∫ F · dr = F d cos(θ). If force is perpendicular to displacement (cos 90° = 0), zero work is performed.',
        'Work-Energy Theorem: The net work done by ALL forces acting on a particle equals the change in its kinetic energy: W_{net} = ΔK = ½mv_f² - ½mv_i².',
        'Conservative forces (gravity, ideal springs) allow definition of a potential energy U such that W_{cons} = -ΔU.',
        'When only conservative forces do work, total mechanical energy is conserved: E_{mech} = K + U = \\text{constant}. Non-conservative forces (friction, drag) dissipate mechanical energy into thermal energy: W_{nc} = ΔE_{mech}.'
      ],
      keyEquations: [
        {
          name: 'Mechanical Work',
          formula: 'W = \\vec{F} \\cdot \\vec{d} = F d \\cos(\\theta)',
          explanation: 'Only the force component parallel to displacement transfers energy.'
        },
        {
          name: 'Kinetic & Gravitational Energy',
          formula: 'K = \\frac{1}{2}m v^2, \\quad U_g = m g h',
          explanation: 'State variables describing motion and spatial configuration.'
        },
        {
          name: 'Conservation of Energy',
          formula: 'K_i + U_i + W_{\\text{ext}} = K_f + U_f + E_{\\text{thermal}}',
          explanation: 'Universal balance of mechanical and dissipated energies.'
        }
      ],
      workedExample: {
        problem: 'A roller-coaster car of mass 500 kg starts from rest at height h = 40.0 m. Neglecting friction, what is its speed at the top of a loop-the-loop of height 15.0 m?',
        givens: ['m = 500 kg', 'h_i = 40.0 m', 'v_i = 0 m/s', 'h_f = 15.0 m'],
        steps: [
          {
            stepNum: 1,
            action: 'Set up conservation of mechanical energy',
            math: 'm g h_i + \\frac{1}{2} m v_i^2 = m g h_f + \\frac{1}{2} m v_f^2',
            reason: 'No non-conservative forces act, so E_initial = E_final.'
          },
          {
            stepNum: 2,
            action: 'Divide through by mass m and insert knowns',
            math: 'g(h_i - h_f) = \\frac{1}{2} v_f^2 \\implies 9.8(40.0 - 15.0) = \\frac{1}{2} v_f^2',
            reason: 'Mass cancels out, proving speed is independent of the car’s weight.'
          },
          {
            stepNum: 3,
            action: 'Solve for final speed',
            math: 'v_f^2 = 2 \\times 9.8 \\times 25.0 = 490 \\implies v_f = \\sqrt{490} \\approx 22.14\\text{ m/s}',
            reason: 'Take the square root of the converted kinetic energy term.'
          }
        ],
        finalAnswer: 'The car speed at loop top is 22.1 m/s.',
        trapExplanation: 'Notice that the mass (500 kg) is redundant. Speed in pure gravitational descent depends solely on the vertical elevation delta Δh.'
      },
      proTipsAndPitfalls: [
        'Centripetal forces do ZERO work because they are perpetually perpendicular to the instantaneous velocity vector.',
        'Spring potential energy is U_s = ½ k x², always positive regardless of whether the spring is compressed or extended.'
      ],
      quickRecallCheck: {
        question: 'Does the Earth’s gravitational force do work on a satellite in a circular orbit?',
        answer: 'No. Gravity acts perpendicular to orbital displacement at every point (cos 90° = 0), so work done is zero.'
      }
    },
    4: {
      courseId: 'course-mechanics',
      stageNumber: 4,
      subtopicTitle: 'Linear Momentum, Impulse & Inelastic/Elastic Collisions',
      conceptFocus: 'Impulse, Inelastic Impact & Center of Mass',
      diagnosticMisconception: 'Assuming kinetic energy is always conserved in collisions, failing to distinguish between elastic and inelastic collisions.',
      theoryOverview: [
        'Linear momentum is defined as p = mv. It is a vector quantity having the exact same direction as the velocity vector.',
        'Impulse-Momentum Theorem: J = ∫ F dt = Δp. A force applied over time changes momentum. Soft car crumple zones extend impact duration Δt, drastically reducing peak impact force F.',
        'Conservation of Momentum: In any closed, isolated system with no net external forces, total momentum is strictly conserved: Σp_i = Σp_f.',
        'Collision Classification: Elastic collisions conserve BOTH momentum and kinetic energy. Inelastic collisions conserve momentum but convert kinetic energy into thermal/deformation energy. In a completely inelastic collision, bodies stick together.'
      ],
      keyEquations: [
        {
          name: 'Impulse Definition',
          formula: '\\vec{J} = \\int \\vec{F}\\,dt = \\vec{F}_{\\text{avg}}\\,\\Delta t = \\Delta \\vec{p}',
          explanation: 'Impulse equals the area under the force-versus-time curve.'
        },
        {
          name: 'Conservation of Linear Momentum',
          formula: 'm_1 \\vec{v}_{1i} + m_2 \\vec{v}_{2i} = m_1 \\vec{v}_{1f} + m_2 \\vec{v}_{2f}',
          explanation: 'Applies to all collision types in the absence of net external forces.'
        },
        {
          name: 'Perfect Inelastic Final Velocity',
          formula: 'v_f = \\frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}',
          explanation: 'When colliding masses coalesce into a single composite body.'
        }
      ],
      workedExample: {
        problem: 'A 1200 kg car traveling east at 20 m/s collides head-on and sticks to an 1800 kg truck traveling west at 10 m/s. What is their combined velocity immediately after impact?',
        givens: ['m₁ = 1200 kg', 'v₁ = +20 m/s (East)', 'm₂ = 1800 kg', 'v₂ = -10 m/s (West)'],
        steps: [
          {
            stepNum: 1,
            action: 'Define coordinate axis and compute total initial momentum',
            math: 'p_i = m_1 v_1 + m_2 v_2 = (1200)(+20) + (1800)(-10) = 24000 - 18000 = +6000\\text{ kg}\\cdot\\text{m/s}',
            reason: 'Assign signs carefully: East is positive, West is negative.'
          },
          {
            stepNum: 2,
            action: 'Equate initial momentum to composite final momentum',
            math: 'p_f = (m_1 + m_2) v_f = (1200 + 1800) v_f = 3000 v_f',
            reason: 'The bodies stick together in a completely inelastic collision.'
          },
          {
            stepNum: 3,
            action: 'Solve for final velocity',
            math: 'v_f = \\frac{+6000}{3000} = +2.0\\text{ m/s}',
            reason: 'Positive result indicates the wreckage moves East.'
          }
        ],
        finalAnswer: 'Combined velocity is 2.0 m/s directed East.',
        trapExplanation: 'Sign Error Trap: Forgetting that momentum is a vector. Adding magnitudes instead of subtracting opposing directions produces a completely wrong answer.'
      },
      proTipsAndPitfalls: [
        'Never forget signs for directional velocity! West/South/Left are negative in standard Cartesian axes.',
        'Kinetic energy is NOT conserved in car crashes or sticky collisions; it is dissipated into bending metal and sound.'
      ],
      quickRecallCheck: {
        question: 'Why do airbags reduce serious injuries during high-speed collisions?',
        answer: 'They increase the collision duration Δt over which the driver decelerates, minimizing the average impact force F = Δp / Δt.'
      }
    },
    5: {
      courseId: 'course-mechanics',
      stageNumber: 5,
      subtopicTitle: 'Rotational Dynamics, Moment of Inertia, Torque & Universal Gravitation',
      conceptFocus: 'Comprehensive Multi-Concept Synthesis',
      diagnosticMisconception: 'Confusing mass with moment of inertia, ignoring that rotational resistance depends heavily on the spatial distance r² of mass from the axis of rotation.',
      theoryOverview: [
        'Rotational motion is the exact rotational analog of linear translation: mass becomes moment of inertia I = Σ m_i r_i², force becomes torque τ = r × F, and linear momentum becomes angular momentum L = Iω.',
        'Newton’s 2nd Law for Rotation: Στ = Iα. Applying force farther from the pivot (lever arm) produces greater torque: τ = r F sin(θ).',
        'Conservation of Angular Momentum: If net external torque is zero (Στ = 0), angular momentum is conserved: I_i ω_i = I_f ω_f. A figure skater pulling in arms decreases I, dramatically increasing spin rate ω.',
        'Newton’s Universal Gravitation: F_g = G m₁m₂ / r². Gravitational force obeys the inverse-square law; doubling separation distance reduces attraction to one-fourth.'
      ],
      keyEquations: [
        {
          name: 'Torque Vector',
          formula: '\\vec{\\tau} = \\vec{r} \\times \\vec{F} \\implies \\tau = r F \\sin(\\theta)',
          explanation: 'Maximum rotational effect occurs when force is applied perpendicularly to the lever arm.'
        },
        {
          name: 'Rotational Second Law',
          formula: '\\sum \\tau = I \\alpha, \\quad \\text{where } I = \\int r^2\\,dm',
          explanation: 'Angular acceleration α is inversely proportional to moment of inertia.'
        },
        {
          name: 'Universal Gravitation',
          formula: 'F_g = G \\frac{m_1 m_2}{r^2}, \\quad G = 6.674 \\times 10^{-11}\\,\\text{N}\\cdot\\text{m}^2/\\text{kg}^2',
          explanation: 'Attractive central force between any two masses.'
        }
      ],
      workedExample: {
        problem: 'A star with radius R and rotation period T collapses into a neutron star of radius 0.01 R with no mass loss. What is the new rotational period?',
        givens: ['R_i = R', 'R_f = 0.01 R', 'Mass M constant', 'Uniform sphere I = (2/5) M R²'],
        steps: [
          {
            stepNum: 1,
            action: 'Express angular momentum conservation',
            math: 'I_i \\omega_i = I_f \\omega_f \\implies \\left(\\frac{2}{5} M R_i^2\\right) \\left(\\frac{2\\pi}{T_i}\\right) = \\left(\\frac{2}{5} M R_f^2\\right) \\left(\\frac{2\\pi}{T_f}\\right)',
            reason: 'No external torques act during gravitational collapse.'
          },
          {
            stepNum: 2,
            action: 'Simplify and relate periods to radii',
            math: '\\frac{R_i^2}{T_i} = \\frac{R_f^2}{T_f} \\implies T_f = T_i \\left(\\frac{R_f}{R_i}\\right)^2',
            reason: 'Mass and constant geometric factors cancel.'
          },
          {
            stepNum: 3,
            action: 'Substitute R_f / R_i = 0.01 = 10⁻²',
            math: 'T_f = T_i (10^{-2})^2 = T_i \\times 10^{-4} = \\frac{T_i}{10000}',
            reason: 'The squared radius shrinkage produces an enormous spin acceleration.'
          }
        ],
        finalAnswer: 'The new rotation period is 1/10,000 of the original period (spins 10,000 times faster!).',
        trapExplanation: 'R² Factor Trap: Forgetting the exponent 2 on radius in moment of inertia would lead to an incorrect factor of 100 instead of 10,000.'
      },
      proTipsAndPitfalls: [
        'Mass farther from rotation axis resists acceleration exponentially more due to the r² term in I.',
        'Kepler’s second law (equal areas in equal times) is a direct consequence of conservation of angular momentum under central gravitational forces.'
      ],
      quickRecallCheck: {
        question: 'Why does a solid cylinder roll down an incline faster than a hollow pipe of the same mass and radius?',
        answer: 'The solid cylinder has a smaller moment of inertia (½MR² vs MR²), requiring less kinetic energy to rotate and leaving more energy for linear translation down the ramp.'
      }
    }
  },

  // =========================================================================
  // 2. CALCULUS
  // =========================================================================
  'course-calculus': {
    1: {
      courseId: 'course-calculus',
      stageNumber: 1,
      subtopicTitle: 'Limits, ε-δ Continuity & Asymptotic Boundaries',
      conceptFocus: 'Foundational Limits & Continuity',
      diagnosticMisconception: 'Assuming that f(c) must be defined for lim_{x→c} f(x) to exist, or equating a function value with its limit.',
      theoryOverview: [
        'A limit lim_{x→c} f(x) = L describes the value f(x) approaches as x becomes arbitrarily close to c, completely independent of whether f(c) exists.',
        'Formal ε-δ Definition: For every ε > 0, there exists δ > 0 such that whenever 0 < |x - c| < δ, we have |f(x) - L| < ε.',
        'A function is continuous at c if and only if three conditions hold: (1) f(c) is defined, (2) lim_{x→c} f(x) exists, and (3) lim_{x→c} f(x) = f(c).',
        'Indeterminate forms like 0/0 and ∞/∞ represent algebraic ambiguity requiring factoring, rationalization, or L’Hôpital’s rule.'
      ],
      keyEquations: [
        {
          name: 'Fundamental Squeeze Theorem',
          formula: 'g(x) \\le f(x) \\le h(x) \\implies \\lim_{x\\to c} g(x) = \\lim_{x\\to c} h(x) = L \\implies \\lim_{x\\to c} f(x) = L',
          explanation: 'Pins an oscillatory or complex function between two known boundaries.'
        },
        {
          name: 'Trigonometric Limit Anchor',
          formula: '\\lim_{x\\to 0} \\frac{\\sin(x)}{x} = 1, \\quad \\lim_{x\\to 0} \\frac{1 - \\cos(x)}{x} = 0',
          explanation: 'Essential limits for deriving derivative formulas for trigonometric functions.'
        },
        {
          name: 'L’Hôpital’s Rule',
          formula: '\\lim_{x\\to c} \\frac{f(x)}{g(x)} = \\lim_{x\\to c} \\frac{f\'(x)}{g\'(x)} \\quad \\text{(if form is 0/0 or } \\pm\\infty/\\pm\\infty\\text{)}',
          explanation: 'Differentiates numerator and denominator independently.'
        }
      ],
      workedExample: {
        problem: 'Evaluate the limit: lim_{x→0} (e^{3x} - 1 - 3x) / x²',
        givens: ['Numerator f(x) = e^{3x} - 1 - 3x', 'Denominator g(x) = x²', 'Direct substitution yields (1 - 1 - 0) / 0 = 0/0 (indeterminate)'],
        steps: [
          {
            stepNum: 1,
            action: 'Apply L’Hôpital’s Rule for 0/0 form (1st derivative)',
            math: '\\lim_{x\\to 0} \\frac{3e^{3x} - 3}{2x}',
            reason: 'd/dx[e^{3x} - 1 - 3x] = 3e^{3x} - 3, and d/dx[x²] = 2x.'
          },
          {
            stepNum: 2,
            action: 'Check substitution: (3 - 3)/0 = 0/0. Apply L’Hôpital’s Rule a second time',
            math: '\\lim_{x\\to 0} \\frac{9e^{3x}}{2}',
            reason: 'd/dx[3e^{3x} - 3] = 9e^{3x}, and d/dx[2x] = 2.'
          },
          {
            stepNum: 3,
            action: 'Evaluate at x = 0',
            math: '\\frac{9 e^0}{2} = \\frac{9(1)}{2} = \\frac{9}{2} = 4.5',
            reason: 'Denominator is now non-zero; direct substitution yields exact limit.'
          }
        ],
        finalAnswer: 'The limit is 9/2 (or 4.5).',
        trapExplanation: 'Quotient Rule Trap: Do NOT use the quotient rule when applying L’Hôpital’s rule! Differentiate numerator f’(x) and denominator g’(x) separately.'
      },
      proTipsAndPitfalls: [
        'Never apply L’Hôpital’s rule unless the limit is strictly of indeterminate form 0/0 or ±∞/±∞.',
        'A jump discontinuity occurs when left and right limits exist but are unequal: lim_{x→c⁻} ≠ lim_{x→c⁺}.'
      ],
      quickRecallCheck: {
        question: 'What is lim_{x→0} x² sin(1/x)?',
        answer: '0 (by the Squeeze Theorem, since -x² ≤ x² sin(1/x) ≤ x² and ±x² → 0).'
      }
    },
    2: {
      courseId: 'course-calculus',
      stageNumber: 2,
      subtopicTitle: 'Differential Calculus, Chain Rule, Implicit Slopes & Rates',
      conceptFocus: 'Chain Rule, Product Rule & Implicit Slopes',
      diagnosticMisconception: 'Forgetting to multiply by the derivative of the inner function when applying the chain rule to composite functions.',
      theoryOverview: [
        'The derivative f’(x) represents the instantaneous rate of change of f at x, geometrically equivalent to the slope of the tangent line.',
        'Chain Rule: For composite functions f(g(x)), the rate of change of the outer function with respect to the inner is multiplied by the rate of change of the inner: d/dx[f(g(x))] = f’(g(x)) · g’(x).',
        'Implicit Differentiation: When y cannot be easily solved in terms of x (e.g. x³ + y³ = 6xy), differentiate both sides with respect to x, treating y as a differentiable function of x and invoking dy/dx via the chain rule.',
        'Related Rates: Relates time rates of change (dx/dt, dy/dt) through an underlying geometric or algebraic constraint equation.'
      ],
      keyEquations: [
        {
          name: 'The Chain Rule',
          formula: '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)',
          explanation: 'Product of outer derivative evaluated at inner, times inner derivative.'
        },
        {
          name: 'Product & Quotient Rules',
          formula: '(uv)\' = u\'v + uv\', \\quad \\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2}',
          explanation: 'Core operational rules for multiplying and dividing functions.'
        },
        {
          name: 'Implicit Tangent Slope',
          formula: 'F(x,y) = 0 \\implies \\frac{dy}{dx} = -\\frac{F_x}{F_y}',
          explanation: 'Slope of curves defined implicitly without explicit separation.'
        }
      ],
      workedExample: {
        problem: 'Find dy/dx for the curve x² + y² = 25 at the point (3, 4).',
        givens: ['x² + y² = 25', 'Point (x, y) = (3, 4)'],
        steps: [
          {
            stepNum: 1,
            action: 'Differentiate both sides with respect to x',
            math: '\\frac{d}{dx}[x^2] + \\frac{d}{dx}[y^2] = \\frac{d}{dx}[25]',
            reason: 'Apply derivative operator across the equation.'
          },
          {
            stepNum: 2,
            action: 'Apply power rule and chain rule to y²',
            math: '2x + 2y\\frac{dy}{dx} = 0',
            reason: 'd/dx[y²] = 2y (dy/dx) because y is a function of x.'
          },
          {
            stepNum: 3,
            action: 'Isolate dy/dx and substitute (3, 4)',
            math: '\\frac{dy}{dx} = -\\frac{2x}{2y} = -\\frac{x}{y} = -\\frac{3}{4}',
            reason: 'Slope of the tangent line to the circle at (3, 4) is -3/4.'
          }
        ],
        finalAnswer: 'dy/dx at (3, 4) is -3/4.',
        trapExplanation: 'Inner Derivative Trap: Writing d/dx[y²] = 2y instead of 2y(dy/dx) will completely drop the slope term!'
      },
      proTipsAndPitfalls: [
        'Whenever you differentiate any expression containing y with respect to x, append (dy/dx).',
        'For related rates problems, always differentiate with respect to time t, not x.'
      ],
      quickRecallCheck: {
        question: 'What is d/dx [ln(cos(x))]?',
        answer: '-tan(x), derived as (1/cos(x)) · (-sin(x)) = -sin(x)/cos(x) = -tan(x).'
      }
    },
    3: {
      courseId: 'course-calculus',
      stageNumber: 3,
      subtopicTitle: 'Mean Value Theorem, Concavity, Inflections & Optimization',
      conceptFocus: 'Optimization, Inflection Points & Mean Value',
      diagnosticMisconception: 'Assuming that f’’(c) = 0 automatically implies an inflection point without verifying that concavity actually changes sign.',
      theoryOverview: [
        'Critical Points occur where f’(x) = 0 or f’(x) does not exist. Extreme values on closed intervals must occur at critical points or endpoints (Extreme Value Theorem).',
        'First Derivative Test: If f’ changes from + to -, f has a local maximum. If f’ changes from - to +, f has a local minimum.',
        'Concavity & Inflection: f’’(x) > 0 implies concave up (bowl holds water), while f’’(x) < 0 implies concave down. An Inflection Point requires f’’(x) to change algebraic sign.',
        'Mean Value Theorem (MVT): If f is continuous on [a, b] and differentiable on (a, b), there exists at least one c ∈ (a, b) such that f’(c) = [f(b) - f(a)] / (b - a).'
      ],
      keyEquations: [
        {
          name: 'Mean Value Theorem',
          formula: 'f\'(c) = \\frac{f(b) - f(a)}{b - a}',
          explanation: 'Instantaneous rate equals average rate at at least one interior point.'
        },
        {
          name: 'Second Derivative Test',
          formula: 'f\'(c) = 0 \\text{ and } f\'\'(c) > 0 \\implies \\text{Local Minimum}',
          explanation: 'Concave upward curvature establishes a local trough.'
        },
        {
          name: 'Inflection Condition',
          formula: 'f\'\'(x) \\text{ changes sign across } x = c',
          explanation: 'Point where the curve switches between concave up and concave down.'
        }
      ],
      workedExample: {
        problem: 'A farmer wants to fence a rectangular pen with perimeter 200 m against a straight river (no fence needed along the river). What dimensions maximize the enclosed area?',
        givens: ['Perimeter of 3 sides = 200 m', 'Width = x, Length along river = L', 'Constraint: 2x + L = 200'],
        steps: [
          {
            stepNum: 1,
            action: 'Express area in terms of a single variable x',
            math: 'L = 200 - 2x \\implies A(x) = x(200 - 2x) = 200x - 2x^2',
            reason: 'Substitute constraint into primary objective equation.'
          },
          {
            stepNum: 2,
            action: 'Find critical points by setting derivative to zero',
            math: 'A\'(x) = 200 - 4x = 0 \\implies 4x = 200 \\implies x = 50\\text{ m}',
            reason: 'Stationary points provide potential maximum candidates.'
          },
          {
            stepNum: 3,
            action: 'Verify maximum with second derivative test and find L',
            math: 'A\'\'(x) = -4 < 0 \\text{ (concave down everywhere)} \\implies L = 200 - 2(50) = 100\\text{ m}',
            reason: 'Negative second derivative confirms a global maximum.'
          }
        ],
        finalAnswer: 'Dimensions are 50 m (width) by 100 m (length), yielding maximum area of 5,000 m².',
        trapExplanation: 'Standard rectangle perimeter is 2x + 2L, but because the river serves as one boundary, the constraint is 2x + L = 200.'
      },
      proTipsAndPitfalls: [
        'Consider f(x) = x⁴: f’’(0) = 0, but x = 0 is NOT an inflection point because f’’(x) = 12x² is non-negative everywhere.',
        'In optimization, always check boundary endpoints if the domain is closed [a, b].'
      ],
      quickRecallCheck: {
        question: 'Does the function f(x) = |x| satisfy the hypotheses of the Mean Value Theorem on [-1, 1]?',
        answer: 'No, because f(x) is not differentiable at x = 0 (sharp corner).'
      }
    },
    4: {
      courseId: 'course-calculus',
      stageNumber: 4,
      subtopicTitle: 'Definite Integrals, Riemann Sums & Fundamental Theorem of Calculus',
      conceptFocus: 'Riemann Accumulation & Integrals',
      diagnosticMisconception: 'Forgetting to apply the chain rule when differentiating an integral whose limits are functions of x: d/dx [∫_{a}^{u(x)} f(t) dt].',
      theoryOverview: [
        'The definite integral ∫_a^b f(x) dx represents the signed net area under f(x) from x = a to x = b, formally constructed as the infinite limit of Riemann sums.',
        'FTC Part 1: If F(x) = ∫_a^x f(t) dt, then F’(x) = f(x). Differentiation and integration are inverse operations.',
        'FTC Part 2: If F is an antiderivative of f, then ∫_a^b f(x) dx = F(b) - F(a).',
        'Integration by Substitution (u-sub) is the reverse chain rule: ∫ f(g(x)) g’(x) dx = ∫ f(u) du.'
      ],
      keyEquations: [
        {
          name: 'FTC Part 1 with Chain Rule (Leibniz)',
          formula: '\\frac{d}{dx}\\left[\\int_{v(x)}^{u(x)} f(t)\\,dt\\right] = f(u(x))\\,u\'(x) - f(v(x))\\,v\'(x)',
          explanation: 'Derivative of variable-limit integral.'
        },
        {
          name: 'FTC Part 2 (Evaluation)',
          formula: '\\int_{a}^{b} f(x)\\,dx = F(b) - F(a), \\quad \\text{where } F\'(x) = f(x)',
          explanation: 'Computes net accumulation via antiderivative.'
        },
        {
          name: 'Integration by Substitution',
          formula: '\\int f(g(x))g\'(x)\\,dx = \\int f(u)\\,du',
          explanation: 'Transforms integrand into simpler variable u = g(x).'
        }
      ],
      workedExample: {
        problem: 'Find the derivative of F(x) = ∫_{0}^{x³} sin(t²) dt with respect to x.',
        givens: ['F(x) = ∫_{0}^{x³} sin(t²) dt', 'Upper limit u(x) = x³', 'Lower limit is constant 0'],
        steps: [
          {
            stepNum: 1,
            action: 'Identify inner function and its derivative',
            math: 'u(x) = x^3 \\implies u\'(x) = 3x^2',
            reason: 'Upper limit is a composite function of x.'
          },
          {
            stepNum: 2,
            action: 'Apply FTC Part 1 with Chain Rule',
            math: 'F\'(x) = \\sin((u(x))^2) \\cdot u\'(x) = \\sin((x^3)^2) \\cdot 3x^2',
            reason: 'Substitute upper limit into integrand and multiply by u’(x).'
          },
          {
            stepNum: 3,
            action: 'Simplify power of power',
            math: 'F\'(x) = 3x^2 \\sin(x^6)',
            reason: '(x³)² = x⁶.'
          }
        ],
        finalAnswer: 'F’(x) = 3x² sin(x⁶).',
        trapExplanation: 'Chain Rule Trap: Simply writing sin(x⁶) without multiplying by 3x² forgets that the upper integration limit is varying at rate 3x².'
      },
      proTipsAndPitfalls: [
        'When evaluating definite integrals using u-substitution, ALWAYS update the integration limits: u(a) and u(b).',
        'Signed area means area below the x-axis contributes negatively to the integral.'
      ],
      quickRecallCheck: {
        question: 'What is ∫_{-2}^{2} x³ cos(x) dx?',
        answer: '0, because the integrand is an odd function (x³ is odd, cos(x) is even, product is odd) over a symmetric interval [-a, a].'
      }
    },
    5: {
      courseId: 'course-calculus',
      stageNumber: 5,
      subtopicTitle: 'Integration by Parts, Partial Fractions & Infinite Power Series',
      conceptFocus: 'Improper Integrals, Power Series & Radius of Convergence',
      diagnosticMisconception: 'Assuming that lim_{n→∞} a_n = 0 implies the infinite series Σ a_n converges (e.g. harmonic series 1/n diverges even though 1/n → 0).',
      theoryOverview: [
        'Integration by Parts: ∫ u dv = uv - ∫ v du. Choose u using the LIATE rule: Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential.',
        'Improper Integrals: Evaluated as limits: ∫_1^∞ f(x) dx = lim_{t→∞} ∫_1^t f(x) dx. The p-integral ∫_1^∞ 1/x^p dx converges if and only if p > 1.',
        'Divergence Test: If lim_{n→∞} a_n ≠ 0, the series Σ a_n diverges. Warning: If lim = 0, the test is INCONCLUSIVE.',
        'Ratio Test: Compute L = lim_{n→∞} |a_{n+1} / a_n|. If L < 1, absolute convergence. If L > 1, divergence. If L = 1, test is inconclusive. Yields Radius of Convergence R = 1/L.'
      ],
      keyEquations: [
        {
          name: 'Integration by Parts',
          formula: '\\int u\\,dv = u v - \\int v\\,du',
          explanation: 'Reverse product rule for integration.'
        },
        {
          name: 'The Ratio Test Limit',
          formula: 'L = \\lim_{n\\to\\infty} \\left|\\frac{a_{n+1}}{a_n}\\right| < 1 \\implies \\text{Absolute Convergence}',
          explanation: 'Determines convergence interval and radius.'
        },
        {
          name: 'Maclaurin Expansion of e^x',
          formula: 'e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\dots',
          explanation: 'Converges for all real numbers x (R = ∞).'
        }
      ],
      workedExample: {
        problem: 'Find the radius of convergence R for the power series: Σ_{n=1}^{∞} (3^n x^n) / n',
        givens: ['Term a_n = (3^n x^n) / n', 'Term a_{n+1} = (3^{n+1} x^{n+1}) / (n + 1)'],
        steps: [
          {
            stepNum: 1,
            action: 'Set up the Ratio Test expression',
            math: '\\left|\\frac{a_{n+1}}{a_n}\\right| = \\left|\\frac{3^{n+1} x^{n+1}}{n+1} \\cdot \\frac{n}{3^n x^n}\\right|',
            reason: 'Divide (n+1)-th term by n-th term.'
          },
          {
            stepNum: 2,
            action: 'Simplify exponential and polynomial factors',
            math: '= 3 |x| \\cdot \\frac{n}{n+1}',
            reason: '3^{n+1}/3^n = 3, and x^{n+1}/x^n = x.'
          },
          {
            stepNum: 3,
            action: 'Take limit as n → ∞ and enforce L < 1',
            math: '\\lim_{n\\to\\infty} 3|x| \\left(\\frac{n}{n+1}\\right) = 3|x| < 1 \\implies |x| < \\frac{1}{3}',
            reason: 'n/(n+1) → 1 as n → ∞.'
          }
        ],
        finalAnswer: 'Radius of convergence is R = 1/3.',
        trapExplanation: 'Divergence Test Misconception: If asked about the harmonic series Σ 1/n, students often say it converges because 1/n → 0. By the integral test, ∫_1^∞ (1/x) dx = [ln x] → ∞, proving it diverges.'
      },
      proTipsAndPitfalls: [
        'Radius of convergence R = 1/3 means the series converges on (-1/3, 1/3). Endpoints must be tested separately!',
        'LIATE heuristic: Choose u as the first function type appearing in LIATE: Logarithmic, Inverse trig, Algebraic, Trig, Exponential.'
      ],
      quickRecallCheck: {
        question: 'Does the alternating harmonic series Σ_{n=1}^∞ (-1)^{n+1}/n converge?',
        answer: 'Yes! It converges conditionally to ln(2) by the Alternating Series Test.'
      }
    }
  },

  // =========================================================================
  // 3. COMPUTER SCIENCE & ALGORITHMS
  // =========================================================================
  'course-cs': {
    1: {
      courseId: 'course-cs',
      stageNumber: 1,
      subtopicTitle: 'Asymptotic Complexity, Big-O Notation & Master Theorem',
      conceptFocus: 'Big-O Growth Rates & Space-Time Tradeoffs',
      diagnosticMisconception: 'Assuming that smaller Big-O runtime always beats a higher Big-O runtime for small n, ignoring constant factors and cache effects.',
      theoryOverview: [
        'Big-O notation O(f(n)) characterizes the asymptotic upper bound of an algorithm’s time or memory requirements as input size n grows to infinity.',
        'Growth Hierarchy: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2^n) < O(n!).',
        'Master Theorem solves divide-and-conquer recurrences of form T(n) = aT(n/b) + f(n):',
        'Case 1: If f(n) = O(n^{log_b a - ε}), then T(n) = Θ(n^{log_b a}).',
        'Case 2: If f(n) = Θ(n^{log_b a}), then T(n) = Θ(n^{log_b a} log n).',
        'Case 3: If f(n) = Ω(n^{log_b a + ε}), then T(n) = Θ(f(n)).'
      ],
      keyEquations: [
        {
          name: 'Master Theorem Recurrence',
          formula: 'T(n) = a\\,T(n/b) + O(n^d)',
          explanation: 'a = subproblems, b = shrinkage factor, d = merge step exponent.'
        },
        {
          name: 'Merge Sort Recurrence',
          formula: 'T(n) = 2T(n/2) + O(n) \\implies O(n \\log n)',
          explanation: 'Case 2 of Master Theorem where log_2(2) = 1 = d.'
        },
        {
          name: 'Binary Search Recurrence',
          formula: 'T(n) = T(n/2) + O(1) \\implies O(\\log n)',
          explanation: 'Logarithmic search halving search space at each step.'
        }
      ],
      workedExample: {
        problem: 'Solve the recurrence: T(n) = 4 T(n/2) + n. Find its asymptotic complexity.',
        givens: ['a = 4 (four recursive subproblems)', 'b = 2 (input halved each time)', 'f(n) = n = O(n¹)'],
        steps: [
          {
            stepNum: 1,
            action: 'Calculate the watershed exponent log_b(a)',
            math: '\\log_b(a) = \\log_2(4) = 2',
            reason: 'Determines the computational weight of the leaf nodes in the recursion tree.'
          },
          {
            stepNum: 2,
            action: 'Compare f(n) = n¹ with n^{log_b a} = n²',
            math: 'n^1 = O(n^{2 - 1}) = O(n^{\\log_2 4 - \\epsilon}) \\quad \\text{with } \\epsilon = 1',
            reason: 'The work done at the leaves n² strictly dominates work done at the root n.'
          },
          {
            stepNum: 3,
            action: 'Apply Master Theorem Case 1',
            math: 'T(n) = \\Theta(n^{\\log_b a}) = \\Theta(n^2)',
            reason: 'Case 1 applies when leaf work dominates.'
          }
        ],
        finalAnswer: 'T(n) = Θ(n²).',
        trapExplanation: 'Misconception Trap: Assuming T(n) must have a log n factor like Merge Sort. Because a = 4 subproblems are spawned rather than 2, the workload explodes quadratically.'
      },
      proTipsAndPitfalls: [
        'Space complexity includes both allocated data structures and the implicit call stack depth.',
        'Quicksort has O(n log n) average time, but O(n²) worst-case when bad pivot selection occurs on sorted data.'
      ],
      quickRecallCheck: {
        question: 'What is the time complexity to find an element in an unsorted array vs a sorted array?',
        answer: 'O(n) linear scan for unsorted array vs O(log n) binary search for sorted array.'
      }
    },
    2: {
      courseId: 'course-cs',
      stageNumber: 2,
      subtopicTitle: 'Memory Model, Call Stack, Heap & Recursive Invariants',
      conceptFocus: 'Call Stack, Scope Chains & Memory Heap',
      diagnosticMisconception: 'Failing to define a valid base case in recursion, causing a stack overflow exception by exhausting frame capacity.',
      theoryOverview: [
        'Call Stack: Contiguous memory storing active stack frames (local variables, parameters, return addresses). Managed via LIFO order with rapid O(1) push/pop.',
        'Heap: Dynamic pool of memory for objects and closures with arbitrary lifetimes. Managed via garbage collection or manual free/delete.',
        'Recursion requires two elements: (1) One or more Base Cases to terminate execution, and (2) Recursive Progress that strictly reduces problem state toward base cases.',
        'Tail Call Optimization (TCO): When the recursive call is the absolute final action in a function, the compiler can reuse the current stack frame, eliminating stack overflow.'
      ],
      keyEquations: [
        {
          name: 'Call Stack Space Bound',
          formula: '\\text{Space} = O(d), \\quad d = \\text{Maximum Recursion Depth}',
          explanation: 'Memory allocated on the execution stack proportional to call depth.'
        },
        {
          name: 'Tail Recursive Form',
          formula: 'f(n, \\text{acc}) = f(n-1, \\text{acc} \\times n)',
          explanation: 'Accumulator parameter enables reuse of stack frame without pending ops.'
        },
        {
          name: 'Fibonacci Naive Recurrence',
          formula: 'T(n) = T(n-1) + T(n-2) + O(1) \\implies O(2^n)',
          explanation: 'Explosion of redundant computations in un-memoized tree.'
        }
      ],
      workedExample: {
        problem: 'Why does naive recursive Fibonacci fib(n) execute in O(2^n) time, and how does memoization optimize it to O(n)?',
        givens: ['fib(n) = fib(n-1) + fib(n-2)', 'fib(0) = 0, fib(1) = 1'],
        steps: [
          {
            stepNum: 1,
            action: 'Trace overlapping subproblems in naive tree',
            math: 'fib(5) = fib(4) + fib(3) = (fib(3) + fib(2)) + (fib(2) + fib(1))',
            reason: 'fib(3) is recomputed twice; fib(2) is recomputed three times.'
          },
          {
            stepNum: 2,
            action: 'Apply memoization cache table',
            math: '\\text{memo}[n] = \\text{fib}(n) \\text{ cached on first arrival}',
            reason: 'Subsequent calls for fib(k) return cached result in O(1) time.'
          },
          {
            stepNum: 3,
            action: 'Calculate memoized complexity',
            math: '\\text{Distinct states} = n+1, \\quad \\text{Work per state} = O(1) \\implies O(n)',
            reason: 'Each subproblem state is evaluated exactly once.'
          }
        ],
        finalAnswer: 'Memoization collapses the O(2^n) binary tree into an O(n) linear DAG.',
        trapExplanation: 'Passing large structures by value in recursive calls creates O(n) copies per frame, turning what should be O(n) memory into O(n²).'
      },
      proTipsAndPitfalls: [
        'Stack Overflow: Exceeding call stack limit (~10,000 frames in JavaScript/Python). Convert to iteration or use explicit stack structure.',
        'Lexical closures retain references to enclosing heap variables even after outer function returns.'
      ],
      quickRecallCheck: {
        question: 'Where are primitive local variables stored vs dynamically allocated arrays in C/C++?',
        answer: 'Local primitives are stored on the Stack; dynamic arrays allocated with malloc/new reside on the Heap.'
      }
    },
    3: {
      courseId: 'course-cs',
      stageNumber: 3,
      subtopicTitle: 'Binary Search Trees, Self-Balancing AVL Trees & Traversals',
      conceptFocus: 'AVL Trees, Binary Search Invariants & Depth',
      diagnosticMisconception: 'Assuming that inserting sorted data into a standard BST retains O(log n) search time, ignoring degenerate O(n) linked-list degradation.',
      theoryOverview: [
        'BST Invariant: For any node N, all keys in left subtree < N.key, and all keys in right subtree > N.key.',
        'Tree Traversals: In-Order (Left-Root-Right) visits BST keys in strictly sorted ascending order. Pre-Order (Root-Left-Right) is used for serialization. Post-Order (Left-Right-Root) is used for bottom-up deletion.',
        'AVL Balance Factor: BF(N) = Height(Left) - Height(Right). An AVL tree enforces BF ∈ {-1, 0, 1} at every single node.',
        'Rotations: When insertion causes BF = ±2, tree balance is restored in O(1) time using Single Rotations (Left-Left or Right-Right) or Double Rotations (Left-Right or Right-Left).'
      ],
      keyEquations: [
        {
          name: 'AVL Height Invariant',
          formula: 'h \\le 1.44 \\log_2(n) \\implies \\text{Lookup Time } O(\\log n)',
          explanation: 'Guarantees strictly logarithmic height under all insertion orders.'
        },
        {
          name: 'Balance Factor Formula',
          formula: '\\text{BF}(u) = \\text{height}(u.\\text{left}) - \\text{height}(u.\\text{right}) \\in \\{-1, 0, +1\\}',
          explanation: 'Trigger metric for AVL rotation rebalancing.'
        },
        {
          name: 'In-Order Traversal Invariant',
          formula: '\\text{InOrder}(T) = [k_1, k_2, \\dots, k_n] \\quad \\text{with } k_1 < k_2 < \\dots < k_n',
          explanation: 'Produces monotonically increasing sequence on valid BST.'
        }
      ],
      workedExample: {
        problem: 'Given an AVL node with keys inserted in order [10, 20, 30], what rotation is required to restore balance?',
        givens: ['Root 10 has no left child, right child 20', 'Node 20 has right child 30', 'Right-Right (RR) imbalance'],
        steps: [
          {
            stepNum: 1,
            action: 'Calculate Balance Factor of root node 10',
            math: '\\text{height}(\\text{left}) = -1, \\quad \\text{height}(\\text{right}) = 1 \\implies \\text{BF}(10) = -2',
            reason: 'Imbalance detected because |BF| > 1.'
          },
          {
            stepNum: 2,
            action: 'Check right child BF to classify case',
            math: '\\text{BF}(20) = 0 - 1 = -1',
            reason: 'Both parent and child are right-heavy (Right-Right Case).'
          },
          {
            stepNum: 3,
            action: 'Execute Single Left Rotation on root 10',
            math: '20 \\text{ becomes new root, with left child } 10 \\text{ and right child } 30',
            reason: 'Rotates 20 up; 10 moves down to become left child.'
          }
        ],
        finalAnswer: 'A Single Left Rotation on node 10 yields a balanced tree with root 20.',
        trapExplanation: 'Left-Right (LR) vs Right-Right (RR): If keys were [10, 30, 20], a Double Rotation (Right rotation on 30, followed by Left rotation on 10) would be required.'
      },
      proTipsAndPitfalls: [
        'An un-balanced BST degrades to an O(n) linked list if elements are inserted in already sorted order.',
        'BST node deletion with two children requires replacing the node with its in-order predecessor or in-order successor.'
      ],
      quickRecallCheck: {
        question: 'What is the maximum number of rotations needed to rebalance an AVL tree after a single insertion?',
        answer: 'At most one rotation (either single or double) restores AVL balance along the entire ancestor path.'
      }
    },
    4: {
      courseId: 'course-cs',
      stageNumber: 4,
      subtopicTitle: 'Graph Algorithms, Breadth-First Search, DFS & Dijkstra Shortest Path',
      conceptFocus: 'Optimal Substructure & Memoization DAGs',
      diagnosticMisconception: 'Attempting to run Dijkstra’s algorithm on graphs with negative edge weights, leading to incorrect shortest paths.',
      theoryOverview: [
        'Breadth-First Search (BFS): Uses a FIFO Queue to explore vertices in increasing distance order. Finds shortest path in UNWEIGHTED graphs in O(V + E) time.',
        'Depth-First Search (DFS): Uses recursion or a LIFO Stack to explore branches to maximum depth. Used for topological sorting, cycle detection, and strongly connected components.',
        'Dijkstra’s Algorithm: Greedy algorithm finding shortest paths from single source on NON-NEGATIVE weighted graphs using a Min-Priority Queue in O((V + E) log V) time.',
        'Negative Weights: Dijkstra fails because once a node is settled, it assumes no cheaper path can be found later. Use Bellman-Ford (O(V·E)) when negative edge weights exist.'
      ],
      keyEquations: [
        {
          name: 'Dijkstra Edge Relaxation',
          formula: '\\text{if } d[u] + w(u, v) < d[v] \\implies d[v] = d[u] + w(u, v)',
          explanation: 'Updates distance estimate if a shorter path through u is discovered.'
        },
        {
          name: 'Dijkstra Min-Heap Runtime',
          formula: 'O((V + E) \\log V)',
          explanation: 'Every vertex is extracted once and every edge relaxed with heap update.'
        },
        {
          name: 'BFS Unweighted Shortest Path',
          formula: 'O(V + E)',
          explanation: 'Visits each vertex and traverses each edge in linear time.'
        }
      ],
      workedExample: {
        problem: 'Why does Dijkstra fail on the graph: S → A (cost 3), S → B (cost 5), A → B (cost -4)?',
        givens: ['Source S', 'Edges: (S,A)=3, (S,B)=5, (A,B)=-4'],
        steps: [
          {
            stepNum: 1,
            action: 'Dijkstra extracts minimum distance node from S',
            math: 'd[A] = 3, \\quad d[B] = 5 \\implies \\text{Extract } A \\text{ first (distance 3)}',
            reason: 'Greedy priority selects lowest provisional cost.'
          },
          {
            stepNum: 2,
            action: 'Relax edge from A to B',
            math: 'd[B] = \\min(5, 3 + (-4)) = \\min(5, -1) = -1',
            reason: 'Path S → A → B costs -1.'
          },
          {
            stepNum: 3,
            action: 'Consider if B was extracted before another edge decreased',
            math: '\\text{If an edge into settled node existed, Dijkstra would never re-evaluate it}',
            reason: 'Dijkstra marks vertices as finalized permanently upon extraction.'
          }
        ],
        finalAnswer: 'Negative edges violate Dijkstra’s greedy subproblem monotonicity invariant; Bellman-Ford must be used.',
        trapExplanation: 'Common Trap: Running Dijkstra on unweighted graphs wastes time with min-heaps; simple BFS is faster and simpler.'
      },
      proTipsAndPitfalls: [
        'Topological sort is only possible on Directed Acyclic Graphs (DAGs).',
        'Always mark nodes as visited when pushing to the BFS queue, NOT when popping, to prevent duplicate queue additions.'
      ],
      quickRecallCheck: {
        question: 'Which algorithm detects negative weight cycles in a directed graph?',
        answer: 'The Bellman-Ford algorithm (if distances can still be relaxed on the V-th iteration, a negative cycle exists).'
      }
    },
    5: {
      courseId: 'course-cs',
      stageNumber: 5,
      subtopicTitle: 'Dynamic Programming, Memoization, Tabulation & Optimal Substructure',
      conceptFocus: 'Advanced Algorithmic Mastery & Complete Hypnosis',
      diagnosticMisconception: 'Confusing greedy choice with dynamic programming, failing to verify whether a problem exhibits optimal substructure and overlapping subproblems.',
      theoryOverview: [
        'Dynamic Programming (DP) solves complex optimization problems by breaking them into overlapping subproblems and storing intermediate answers to prevent redundant re-evaluation.',
        'Two Necessary Prerequisites: (1) Optimal Substructure: An optimal solution to the problem contains optimal solutions to its subproblems. (2) Overlapping Subproblems: The recursive space repeatedly visits identical states.',
        'Approaches: Top-Down Memoization (Recursive with hash-map/array cache) vs Bottom-Up Tabulation (Iterative filling of DP table in topological order).',
        'Classic Archetypes: 0/1 Knapsack, Longest Common Subsequence (LCS), Matrix Chain Multiplication, Coin Change, and Edit Distance.'
      ],
      keyEquations: [
        {
          name: '0/1 Knapsack State Transition',
          formula: 'DP[i, w] = \\max(DP[i-1, w], \\, v_i + DP[i-1, w - w_i])',
          explanation: 'Choice between excluding item i or including item i.'
        },
        {
          name: 'Longest Common Subsequence (LCS)',
          formula: 'DP[i, j] = \\begin{cases} 1 + DP[i-1, j-1] & \\text{if } A[i] = B[j] \\\\ \\max(DP[i-1, j], DP[i, j-1]) & \\text{if } A[i] \\ne B[j] \\end{cases}',
          explanation: 'Matches character or takes best of skipping in either string.'
        },
        {
          name: 'Coin Change Minimum Coins',
          formula: 'DP[c] = 1 + \\min_{k} \\{ DP[c - \\text{coin}_k] \\}',
          explanation: 'Unbounded optimal choice over available coin denominations.'
        }
      ],
      workedExample: {
        problem: 'Find the minimum coins needed to make amount 6 using coins {1, 3, 4}.',
        givens: ['Coins = {1, 3, 4}', 'Target amount = 6', 'DP[0] = 0 (base case)'],
        steps: [
          {
            stepNum: 1,
            action: 'Compute DP values for amounts 1 through 3',
            math: 'DP[1] = 1 (coin 1), \\quad DP[2] = 2 (1+1), \\quad DP[3] = 1 (coin 3)',
            reason: 'DP[c] = 1 + min(DP[c - coin]).'
          },
          {
            stepNum: 2,
            action: 'Compute DP[4] and DP[5]',
            math: 'DP[4] = 1 (coin 4), \\quad DP[5] = 1 + \\min(DP[4], DP[2], DP[1]) = 1 + 1 = 2 (4+1)',
            reason: 'Test all coin denominations that fit.'
          },
          {
            stepNum: 3,
            action: 'Compute DP[6] target',
            math: 'DP[6] = 1 + \\min(DP[6-1], DP[6-3], DP[6-4]) = 1 + \\min(DP[5], DP[3], DP[2]) = 1 + \\min(2, 1, 2) = 2',
            reason: 'Choice 6 - 3 = 3 with cost DP[3]=1 yields 1 + 1 = 2 coins (3 + 3).'
          }
        ],
        finalAnswer: 'Minimum coins = 2 (using two 3-value coins: 3 + 3 = 6).',
        trapExplanation: 'Greedy Trap: A greedy approach picks the largest coin first: 4 + 1 + 1 = 3 coins, which is suboptimal compared to 3 + 3 = 2 coins!'
      },
      proTipsAndPitfalls: [
        'Always identify the base cases first (e.g. DP[0] = 0, or DP[i, 0] = 0).',
        'State space reduction: Many 2D DP tables can be optimized to 1D arrays if the current row only depends on the immediately preceding row.'
      ],
      quickRecallCheck: {
        question: 'Why does the greedy algorithm fail for 0/1 Knapsack but succeed for Fractional Knapsack?',
        answer: 'In 0/1 Knapsack you cannot take partial items, so highest value-to-weight ratio items may leave unusable empty space.'
      }
    }
  },

  // =========================================================================
  // 4. ELECTROMAGNETISM
  // =========================================================================
  'course-em': {
    1: {
      courseId: 'course-em',
      stageNumber: 1,
      subtopicTitle: 'Coulomb’s Law, Electric Fields & Superposition Principle',
      conceptFocus: 'Foundational Vectors & Charge Distribution',
      diagnosticMisconception: 'Adding electric field magnitudes as scalars rather than performing vector component addition.',
      theoryOverview: [
        'Coulomb’s Law: Electric force between two point charges is proportional to their product and inversely proportional to the square of separation: F = k |q₁q₂| / r².',
        'Electric Field E = F / q₀ is the force per unit positive test charge. Electric field vectors point AWAY from positive charges and TOWARDS negative charges.',
        'Principle of Superposition: The total electric field at any point in space is the strict vector sum of electric fields produced by each individual charge: E_{total} = Σ E_i.',
        'Electric Dipole: A pair of equal and opposite charges ±q separated by distance d. Dipole moment p = qd points from negative to positive.'
      ],
      keyEquations: [
        {
          name: 'Coulomb’s Force Law',
          formula: 'F_e = k_e \\frac{|q_1 q_2|}{r^2}, \\quad k_e = \\frac{1}{4\\pi \\epsilon_0} \\approx 8.99 \\times 10^9\\,\\text{N}\\cdot\\text{m}^2/\\text{C}^2',
          explanation: 'Fundamental electrostatic force between point charges.'
        },
        {
          name: 'Electric Field of Point Charge',
          formula: '\\vec{E} = k_e \\frac{q}{r^2}\\,\\hat{r}',
          explanation: 'Vector field radiating radially outwards (+) or inwards (-).'
        },
        {
          name: 'Electric Field Superposition',
          formula: '\\vec{E}_{\\text{net}} = \\sum_{i} \\vec{E}_i = \\left(\\sum E_{ix}\\right)\\hat{i} + \\left(\\sum E_{iy}\\right)\\hat{j}',
          explanation: 'Vector sum decomposed into Cartesian axes.'
        }
      ],
      workedExample: {
        problem: 'Two identical charges q = +2.0 μC are placed at (0, 3 m) and (0, -3 m). What is the net electric field at the origin (0, 0)?',
        givens: ['q₁ = +2.0 μC at (0, 3)', 'q₂ = +2.0 μC at (0, -3)', 'Test point at (0, 0)'],
        steps: [
          {
            stepNum: 1,
            action: 'Determine field vector from q₁ at the origin',
            math: '\\vec{E}_1 = k \\frac{q}{3^2}\\,(-\\hat{j}) \\quad \\text{(points downward away from positive charge)}',
            reason: 'Positive charge at y = 3 pushes test positive charge downward towards origin.'
          },
          {
            stepNum: 2,
            action: 'Determine field vector from q₂ at the origin',
            math: '\\vec{E}_2 = k \\frac{q}{3^2}\\,(+\\hat{j}) \\quad \\text{(points upward away from positive charge)}',
            reason: 'Positive charge at y = -3 pushes test positive charge upward towards origin.'
          },
          {
            stepNum: 3,
            action: 'Sum the vectors',
            math: '\\vec{E}_{\\text{net}} = \\vec{E}_1 + \\vec{E}_2 = -E\\,\\hat{j} + E\\,\\hat{j} = \\vec{0}',
            reason: 'Symmetrical equal magnitudes cancel each other out completely.'
          }
        ],
        finalAnswer: 'Net electric field at origin is 0 N/C.',
        trapExplanation: 'Scalar Addition Trap: Adding scalar magnitudes (E + E = 2E) gives an erroneous nonzero result. Electric fields are vectors!'
      },
      proTipsAndPitfalls: [
        'Electric field lines never cross each other; their local density indicates field strength.',
        'A conductor in electrostatic equilibrium has E = 0 everywhere inside its bulk material.'
      ],
      quickRecallCheck: {
        question: 'What happens to the electrostatic force between two charges if the separation distance is tripled?',
        answer: 'The force decreases to 1/9 of its original value (inverse-square law: 1/3² = 1/9).'
      }
    },
    2: {
      courseId: 'course-em',
      stageNumber: 2,
      subtopicTitle: 'Gauss’s Law, Electric Flux & Symmetric Charge Enclosures',
      conceptFocus: 'Gauss Law & Cylindrical/Planar Symmetry',
      diagnosticMisconception: 'Believing that zero net electric flux through a closed surface implies the electric field is zero everywhere on that surface.',
      theoryOverview: [
        'Electric Flux Φ_E = ∫ E · dA measures the total number of electric field lines piercing through a surface area.',
        'Gauss’s Law: The net electric flux through ANY closed Gaussian surface is directly proportional to the total enclosed charge: Φ_E = ∮ E · dA = Q_{enc} / ε_0.',
        'Symmetry requirement: Gauss’s law is always true, but only useful for calculating electric fields when high symmetry (Spherical, Cylindrical, or Planar) allows E to be pulled out of the integral: E ∮ dA = E · A.',
        'Charges outside the Gaussian surface contribute zero net flux through the closed surface because every field line that enters must also exit.'
      ],
      keyEquations: [
        {
          name: 'Gauss’s Law',
          formula: '\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{\\text{enclosed}}}{\\epsilon_0}, \\quad \\epsilon_0 = 8.854 \\times 10^{-12}\\,\\text{F/m}',
          explanation: 'Flux through any closed boundary depends strictly on interior charge.'
        },
        {
          name: 'Field of Infinite Line of Charge',
          formula: 'E = \\frac{\\lambda}{2\\pi \\epsilon_0 r}',
          explanation: 'Derived using cylindrical Gaussian surface.'
        },
        {
          name: 'Field of Infinite Charged Sheet',
          formula: 'E = \\frac{\\sigma}{2\\epsilon_0}',
          explanation: 'Constant field independent of distance from infinite sheet.'
        }
      ],
      workedExample: {
        problem: 'Find the electric field at distance r outside an isolated solid conducting sphere of radius R carrying total charge Q.',
        givens: ['Sphere radius R', 'Observation distance r > R', 'Spherical symmetry'],
        steps: [
          {
            stepNum: 1,
            action: 'Choose a concentric spherical Gaussian surface of radius r',
            math: '\\oint \\vec{E} \\cdot d\\vec{A} = E \\oint dA = E(4\\pi r^2)',
            reason: 'E is radially symmetric and perpendicular to the spherical surface.'
          },
          {
            stepNum: 2,
            action: 'Identify enclosed charge',
            math: 'Q_{\\text{enc}} = Q',
            reason: 'The entire sphere of charge is enclosed since r > R.'
          },
          {
            stepNum: 3,
            action: 'Equate flux to Q_enc / ε_0',
            math: 'E(4\\pi r^2) = \\frac{Q}{\\epsilon_0} \\implies E = \\frac{Q}{4\\pi \\epsilon_0 r^2} = k \\frac{Q}{r^2}',
            reason: 'Matches point charge formula exactly!'
          }
        ],
        finalAnswer: 'E = k Q / r² (identical to a point charge Q located at the center).',
        trapExplanation: 'Conducting Sphere Interior Trap: If r < R (inside the conductor), Q_enc = 0, so E = 0 inside the conductor!'
      },
      proTipsAndPitfalls: [
        'If a dipole is inside a closed box, total net flux is zero (because Q_enc = +q - q = 0), even though E is nonzero everywhere on the box walls.',
        'Excess charge on any isolated conductor resides entirely on its outer surface.'
      ],
      quickRecallCheck: {
        question: 'What is the electric field inside a hollow metal cavity surrounded by charge?',
        answer: 'Strictly zero (Faraday cage shielding effect).'
      }
    },
    3: {
      courseId: 'course-em',
      stageNumber: 3,
      subtopicTitle: 'Electric Potential, Capacitance & Stored Electrostatic Energy',
      conceptFocus: 'Resistors, Capacitance & Potential Drops',
      diagnosticMisconception: 'Confusing electric potential (Voltage, scalar in Volts) with electric potential energy (in Joules) or electric field (vector in N/C).',
      theoryOverview: [
        'Electric Potential V = U / q is potential energy per unit charge. Potential differences ΔV = -∫ E · ds drive electric currents.',
        'Equipotential Surfaces: Surfaces where V is constant everywhere. Electric field vectors are ALWAYS perpendicular to equipotential surfaces, pointing from high potential to low potential.',
        'Capacitors store separated charges: Q = C V. Capacitance C depends purely on geometry and dielectric medium: C = κε_0 A / d.',
        'Energy Stored in Capacitor: U = ½ C V² = ½ Q V = Q² / (2C). Inserting a dielectric with constant κ > 1 increases capacitance by factor κ.'
      ],
      keyEquations: [
        {
          name: 'Potential Difference in Uniform Field',
          formula: '\\Delta V = -E d \\cos(\\theta)',
          explanation: 'Voltage decreases along the direction of electric field lines.'
        },
        {
          name: 'Parallel Plate Capacitance',
          formula: 'C = \\kappa \\epsilon_0 \\frac{A}{d}',
          explanation: 'Proportional to plate area A and dielectric constant κ; inversely proportional to gap d.'
        },
        {
          name: 'Electrostatic Energy Stored',
          formula: 'U_c = \\frac{1}{2} C V^2 = \\frac{Q^2}{2C}',
          explanation: 'Energy stored in the electric field between plates.'
        }
      ],
      workedExample: {
        problem: 'A parallel plate capacitor is charged to 100 V and then disconnected from the battery. A dielectric with κ = 3.0 is inserted between the plates. What is the new voltage across the plates?',
        givens: ['Initial V₀ = 100 V', 'Disconnected battery implies Charge Q remains constant', 'κ = 3.0'],
        steps: [
          {
            stepNum: 1,
            action: 'Determine effect of dielectric on capacitance',
            math: 'C_{\\text{new}} = \\kappa C_0 = 3.0 C_0',
            reason: 'Dielectric increases capacitance by factor κ.'
          },
          {
            stepNum: 2,
            action: 'Use Q = C V with constant Q',
            math: 'Q = C_0 V_0 = C_{\\text{new}} V_{\\text{new}} \\implies C_0 V_0 = (3.0 C_0) V_{\\text{new}}',
            reason: 'Because capacitor is disconnected, charges have no conductive path to escape.'
          },
          {
            stepNum: 3,
            action: 'Solve for new voltage',
            math: 'V_{\\text{new}} = \\frac{V_0}{3.0} = \\frac{100}{3.0} \\approx 33.3\\text{ V}',
            reason: 'Voltage decreases by factor 1/κ.'
          }
        ],
        finalAnswer: 'New voltage across the plates is 33.3 Volts.',
        trapExplanation: 'Battery Connected vs Disconnected: If the battery remained connected, Voltage V would remain fixed at 100 V, and charge Q would increase threefold instead!'
      },
      proTipsAndPitfalls: [
        'Positive charges naturally accelerate toward lower electric potential regions; negative charges accelerate toward higher potential.',
        'Capacitors in parallel add directly: C_eq = C₁ + C₂. Capacitors in series add inversely: 1/C_eq = 1/C₁ + 1/C₂.'
      ],
      quickRecallCheck: {
        question: 'How much work is required to move an electron along an equipotential line?',
        answer: 'Zero work, because ΔV = 0, so W = -q ΔV = 0.'
      }
    },
    4: {
      courseId: 'course-em',
      stageNumber: 4,
      subtopicTitle: 'DC Resistive Circuits, Ohm’s Law & Kirchhoff’s Rules',
      conceptFocus: 'Cross-Product Magnetic Deflection & Faraday Law',
      diagnosticMisconception: 'Assuming current gets "used up" as it flows through resistors in a circuit, violating conservation of charge.',
      theoryOverview: [
        'Ohm’s Law: V = IR relates potential difference, electric current (Coulombs per second), and resistance (Ohms).',
        'Kirchhoff’s Junction Rule (Current Law - KCL): Total current entering any circuit junction must equal total current leaving: Σ I_{in} = Σ I_{out}. Direct consequence of Conservation of Charge.',
        'Kirchhoff’s Loop Rule (Voltage Law - KVL): The algebraic sum of all potential changes around any closed circuit loop is zero: Σ ΔV = 0. Direct consequence of Conservation of Energy.',
        'Equivalent Resistance: Series resistors share the same current and add directly: R_eq = R₁ + R₂. Parallel resistors share the same voltage and add reciprocally: 1/R_eq = 1/R₁ + 1/R₂.'
      ],
      keyEquations: [
        {
          name: 'Ohm’s Law',
          formula: 'V = I R, \\quad P = I V = I^2 R = \\frac{V^2}{R}',
          explanation: 'Ohmic resistance relationship and dissipated electrical power.'
        },
        {
          name: 'Parallel Resistors Rule',
          formula: '\\frac{1}{R_{\\text{eq}}} = \\frac{1}{R_1} + \\frac{1}{R_2} \\implies R_{\\text{eq}} = \\frac{R_1 R_2}{R_1 + R_2}',
          explanation: 'Equivalent resistance of two parallel branches.'
        },
        {
          name: 'Kirchhoff’s Loop Law',
          formula: '\\sum_{\\text{loop}} \\Delta V_k = 0',
          explanation: 'Sum of EMF gains and resistive voltage drops around a loop.'
        }
      ],
      workedExample: {
        problem: 'A 12V ideal battery is connected to two parallel resistors of 6 Ω and 12 Ω. What is the total current drawn from the battery?',
        givens: ['EMF = 12 V', 'R₁ = 6 Ω', 'R₂ = 12 Ω in parallel'],
        steps: [
          {
            stepNum: 1,
            action: 'Calculate equivalent resistance of the parallel network',
            math: 'R_{\\text{eq}} = \\frac{R_1 R_2}{R_1 + R_2} = \\frac{6 \\times 12}{6 + 12} = \\frac{72}{18} = 4.0\\,\\Omega',
            reason: 'Product over sum formula for two parallel resistors.'
          },
          {
            stepNum: 2,
            action: 'Calculate total circuit current using Ohm’s law',
            math: 'I_{\\text{total}} = \\frac{V}{R_{\\text{eq}}} = \\frac{12\\text{ V}}{4.0\\,\\Omega} = 3.0\\text{ A}',
            reason: 'Battery supplies current through equivalent circuit.'
          },
          {
            stepNum: 3,
            action: 'Verify using junction currents',
            math: 'I_1 = \\frac{12}{6} = 2.0\\text{ A}, \\quad I_2 = \\frac{12}{12} = 1.0\\text{ A} \\implies I_1 + I_2 = 3.0\\text{ A}',
            reason: 'Confirms Kirchhoff’s junction rule.'
          }
        ],
        finalAnswer: 'Total current drawn from the battery is 3.0 Amperes.',
        trapExplanation: 'Series Addition Trap: Adding 6 + 12 = 18 Ω is incorrect because current splits between parallel paths. Parallel resistance is always smaller than the smallest branch!'
      },
      proTipsAndPitfalls: [
        'Adding more resistors in parallel DECREASES the overall equivalent resistance and increases battery current draw.',
        'An ideal voltmeter has infinite resistance (placed in parallel); an ideal ammeter has zero resistance (placed in series).'
      ],
      quickRecallCheck: {
        question: 'What happens to the brightness of a lightbulb in a parallel household circuit when another lightbulb in parallel is switched on?',
        answer: 'Its brightness remains unchanged because each parallel branch maintains the exact same voltage (120V).'
      }
    },
    5: {
      courseId: 'course-em',
      stageNumber: 5,
      subtopicTitle: 'Magnetic Fields, Lorentz Force, Faraday’s Law & Induction',
      conceptFocus: 'Comprehensive Maxwellian Synthesis',
      diagnosticMisconception: 'Applying the right-hand rule to a negative charge (like an electron) without reversing the resulting direction of magnetic force.',
      theoryOverview: [
        'Lorentz Magnetic Force: F_B = q(v × B) = q v B sin(θ). Magnetic force is perpendicular to BOTH velocity and magnetic field, doing ZERO work on a charged particle.',
        'Magnetic Deflection: A charged particle entering a uniform perpendicular magnetic field undergoes uniform circular motion with cyclotron radius r = mv / (qB).',
        'Faraday’s Law of Induction: A changing magnetic flux Φ_B = ∫ B · dA induces an electromotive force (EMF): ε = -N (dΦ_B / dt).',
        'Lenz’s Law: The direction of any induced current opposes the change in magnetic flux that produced it (indicated by the negative sign in Faraday’s law).'
      ],
      keyEquations: [
        {
          name: 'Magnetic Lorentz Force',
          formula: '\\vec{F}_B = q (\\vec{v} \\times \\vec{B}) \\implies F_B = |q| v B \\sin(\\theta)',
          explanation: 'Force is perpendicular to velocity; does zero mechanical work.'
        },
        {
          name: 'Cyclotron Orbit Radius',
          formula: 'r = \\frac{m v}{q B}',
          explanation: 'Radius of circular trajectory in uniform magnetic field.'
        },
        {
          name: 'Faraday-Lenz Law',
          formula: '\\mathcal{E} = -\\frac{d\\Phi_B}{dt} = -\\frac{d}{dt}(B A \\cos(\\theta))',
          explanation: 'Induced EMF opposes flux change.'
        }
      ],
      workedExample: {
        problem: 'A proton (q = +1.6 × 10⁻¹⁹ C, m = 1.67 × 10⁻²⁷ kg) moves at 2.0 × 10⁶ m/s perpendicular to a uniform 0.50 T magnetic field. What is the radius of its circular orbit?',
        givens: ['q = 1.6 × 10⁻¹⁹ C', 'm = 1.67 × 10⁻²⁷ kg', 'v = 2.0 × 10⁶ m/s', 'B = 0.50 T', 'θ = 90°'],
        steps: [
          {
            stepNum: 1,
            action: 'Equate magnetic force to centripetal force',
            math: 'q v B = \\frac{m v^2}{r} \\implies r = \\frac{m v}{q B}',
            reason: 'Magnetic force provides the necessary centripetal acceleration.'
          },
          {
            stepNum: 2,
            action: 'Substitute numerical values',
            math: 'r = \\frac{(1.67 \\times 10^{-27}) (2.0 \\times 10^6)}{(1.6 \\times 10^{-19}) (0.50)}',
            reason: 'Insert mass, velocity, charge, and field.'
          },
          {
            stepNum: 3,
            action: 'Compute final radius',
            math: 'r = \\frac{3.34 \\times 10^{-21}}{8.0 \\times 10^{-20}} \\approx 0.04175\\text{ m} = 4.18\\text{ cm}',
            reason: 'Evaluate scientific notation exponents carefully.'
          }
        ],
        finalAnswer: 'The radius of the circular orbit is 4.18 cm.',
        trapExplanation: 'Electron Sign Trap: If an electron were used instead of a proton, the orbital radius would be thousands of times smaller due to its tiny mass, and it would circulate in the opposite direction!'
      },
      proTipsAndPitfalls: [
        'Magnetic fields do ZERO work on moving charges because F_B is perpetually perpendicular to velocity (v · F_B = 0). They alter direction, NEVER speed or kinetic energy.',
        'Lenz’s law preserves conservation of energy; if induced currents aided flux changes, a perpetual motion runaway would occur.'
      ],
      quickRecallCheck: {
        question: 'Does a stationary charge experience a magnetic force in a strong magnetic field?',
        answer: 'No. F_B = q v B sin(θ); when speed v = 0, magnetic force is strictly zero.'
      }
    }
  }
};

export default function LectureNotesModal({
  isOpen,
  onClose,
  course,
  stage,
  diagnosedGaps = [],
  onStartTest,
  onClaimGeo,
  onOpenInteractiveNotes
}: {
  isOpen: boolean;
  onClose: () => void;
  course: CourseData;
  stage: WorldStageNode;
  diagnosedGaps?: string[];
  onStartTest: () => void;
  onClaimGeo: (amount: number) => void;
  onOpenInteractiveNotes?: () => void;
}) {
  const [claimedReward, setClaimedReward] = useState(false);
  const [activeTab, setActiveTab] = useState<'theory' | 'equations' | 'worked_example' | 'traps'>('theory');

  if (!isOpen) return null;

  const courseNotes = COURSE_LECTURE_NOTES[course.id];
  const lecture: SubtopicLectureContent | undefined = courseNotes ? courseNotes[stage.stageNumber] : undefined;

  // Check if student's diagnostic flagged a gap in this subtopic
  const isGapArea = stage.status === 'remediation_priority' || diagnosedGaps.some(g => 
    stage.conceptFocus.toLowerCase().includes(g.toLowerCase()) || 
    g.toLowerCase().includes(stage.conceptFocus.toLowerCase()) ||
    stage.name.toLowerCase().includes(g.toLowerCase())
  );

  const handleClaim = () => {
    if (!claimedReward) {
      setClaimedReward(true);
      onClaimGeo(25);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border-2 border-indigo-500/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] font-mono text-slate-100"
      >
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400">
                  {course.title} // Stage {stage.stageNumber}
                </span>
                <span className="text-[10px] text-slate-500">
                  ({stage.kanji})
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white">
                {lecture ? lecture.subtopicTitle : stage.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenInteractiveNotes && (
              <button
                onClick={() => {
                  onClose();
                  onOpenInteractiveNotes();
                }}
                className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black rounded-lg text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-md shadow-cyan-500/20 uppercase tracking-wider"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>Launch AI Study Suite</span>
              </button>
            )}
            {!claimedReward ? (
              <button
                onClick={handleClaim}
                className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>Claim +25 Geo</span>
              </button>
            ) : (
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>+25 Geo Claimed</span>
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
              title="Close Notes"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Diagnostic Misconception Advisory Banner */}
        {isGapArea && lecture && (
          <div className="bg-amber-950/50 border-b border-amber-500/40 px-5 py-2.5 flex items-start space-x-3 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-amber-300 font-bold uppercase tracking-wider text-[11px] block">
                QuestLearn AI Diagnostic Advisory — Targeted Remediation Focus:
              </span>
              <p className="text-amber-200/90 text-[11px] leading-relaxed mt-0.5">
                {lecture.diagnosticMisconception}
              </p>
            </div>
          </div>
        )}

        {/* Content Navigation Tabs */}
        <div className="px-5 pt-3 bg-slate-950/60 border-b border-slate-800 flex items-center space-x-2 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-3 py-2 border-b-2 font-bold transition flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'theory'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Core Theory & Intuition</span>
          </button>

          <button
            onClick={() => setActiveTab('equations')}
            className={`px-3 py-2 border-b-2 font-bold transition flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'equations'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Formulas & Mathematical Laws</span>
          </button>

          <button
            onClick={() => setActiveTab('worked_example')}
            className={`px-3 py-2 border-b-2 font-bold transition flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'worked_example'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Step-by-Step Worked Problem</span>
          </button>

          <button
            onClick={() => setActiveTab('traps')}
            className={`px-3 py-2 border-b-2 font-bold transition flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'traps'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Exam Traps & Quick Check</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-300">
          {lecture ? (
            <>
              {/* TAB 1: THEORY */}
              {activeTab === 'theory' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                    <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
                      <Target className="w-4 h-4 text-indigo-400" />
                      <span>Conceptual Breakdown: {lecture.conceptFocus}</span>
                    </h3>
                    <div className="space-y-2.5 text-slate-300">
                      {lecture.theoryOverview.map((paragraph, i) => (
                        <p key={i} className="flex items-start space-x-2">
                          <span className="text-indigo-400 font-bold mt-0.5">•</span>
                          <span>{paragraph}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 bg-indigo-950/30 border border-indigo-500/30 rounded-xl">
                    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block mb-1">
                      Anime Battleground Lore Connection:
                    </span>
                    <p className="text-indigo-200/90 italic text-[11px]">
                      "{stage.lore}"
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: EQUATIONS */}
              {activeTab === 'equations' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Governing Equations & Formulations:
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {lecture.keyEquations.map((eq, i) => (
                      <div key={i} className="p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-indigo-300">{eq.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">EQUATION {i + 1}</span>
                        </div>
                        <div className="py-2.5 px-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-cyan-300 text-sm font-bold tracking-wide overflow-x-auto my-2">
                          {eq.formula}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {eq.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: WORKED EXAMPLE */}
              {activeTab === 'worked_example' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[10px] font-bold uppercase">
                        Mastery Exemplar
                      </span>
                      <h3 className="text-xs font-bold text-white">Full Derivation Walkthrough</h3>
                    </div>

                    <p className="text-slate-200 text-sm font-semibold bg-slate-900 p-3 rounded-lg border border-slate-800">
                      {lecture.workedExample.problem}
                    </p>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                        Given Constraints:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {lecture.workedExample.givens.map((g, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-900 text-cyan-300 border border-slate-800 rounded text-[11px]">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-2.5 pt-2">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">
                        Step-by-Step Derivation:
                      </span>
                      {lecture.workedExample.steps.map((st) => (
                        <div key={st.stepNum} className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/80 space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                              {st.stepNum}
                            </span>
                            <span className="text-xs font-bold text-indigo-300">{st.action}</span>
                          </div>
                          <div className="py-1 px-2.5 bg-slate-950 rounded border border-slate-800 font-mono text-amber-300 text-xs font-bold overflow-x-auto ml-7">
                            {st.math}
                          </div>
                          <p className="text-[10px] text-slate-400 ml-7 italic">
                            Rationale: {st.reason}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Final Answer */}
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-lg flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-bold text-emerald-300">
                        {lecture.workedExample.finalAnswer}
                      </span>
                    </div>

                    {/* Trap Analysis */}
                    <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-lg text-[11px] text-rose-300">
                      <span className="font-bold block text-rose-400 uppercase text-[10px] mb-0.5">
                        Common Exam Trap:
                      </span>
                      {lecture.workedExample.trapExplanation}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TRAPS & QUICK CHECK */}
              {activeTab === 'traps' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5">
                    <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>Crucial Pitfalls & High-Frequency Mistakes:</span>
                    </h3>
                    <ul className="space-y-2 text-slate-300 text-xs">
                      {lecture.proTipsAndPitfalls.map((tip, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-rose-400 font-bold">⚠️</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-indigo-950/40 border border-indigo-500/40 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <HelpCircle className="w-4 h-4 text-indigo-400" />
                      <span>Instant Recall Self-Check:</span>
                    </h4>
                    <p className="text-white font-semibold text-xs">
                      {lecture.quickRecallCheck.question}
                    </p>
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-cyan-300 text-xs">
                      <b>Correct Recall Answer:</b> {lecture.quickRecallCheck.answer}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p>Lecture notes for this stage are being compiled.</p>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Action */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            {isGapArea ? (
              <span className="text-amber-400 font-bold">
                ⚠️ Remediation Review Recommended before testing.
              </span>
            ) : (
              <span>Review notes to maximize your combat performance and Zanpakuto strikes!</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Close Notes
            </button>

            <button
              onClick={() => {
                if (!claimedReward) {
                  onClaimGeo(25);
                  setClaimedReward(true);
                }
                onClose();
                onStartTest();
              }}
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 via-indigo-600 to-amber-500 hover:from-cyan-400 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Attend Stage {stage.stageNumber} Test</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
