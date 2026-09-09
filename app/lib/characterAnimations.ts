/**
 * QuestLearn - Character Animation Engine
 * 
 * Supports 6 core animation states:
 * 1. Idle: Breathing animation (looping rise/fall chest rhythm)
 * 2. Celebration: Correct answer reaction (joyful jump, fist pump, star aura)
 * 3. Hurt: Wrong answer reaction (stagger backwards, red impact flash)
 * 4. Attack: Boss battle strike (forward dash lunge & blade slash)
 * 5. Dance: Victory celebration (rhythmic side-to-side groove & bounce)
 * 6. Knockout: Defeat collapse (collapse to ground with circling dizzy stars)
 */

export type CharacterAnimationState =
  | 'idle'
  | 'celebration'
  | 'hurt'
  | 'attack'
  | 'slash_strike'
  | 'ash_of_war'
  | 'dance'
  | 'knockout'
  | 'test_attack';

export interface CharacterAnimationMeta {
  key: CharacterAnimationState;
  label: string;
  category: 'idle' | 'correct' | 'wrong' | 'battle' | 'victory' | 'defeat';
  description: string;
  durationMs: number;
  isLoop: boolean;
  cssClass: string;
  icon: string;
}

export const CHARACTER_ANIMATIONS: Record<string, CharacterAnimationMeta> = {
  idle: {
    key: 'idle',
    label: 'Breathing Idle',
    category: 'idle',
    description: 'Smooth rhythmic chest and body breathing cycle',
    durationMs: 2200,
    isLoop: true,
    cssClass: 'anim-breathing',
    icon: '🫁'
  },
  celebration: {
    key: 'celebration',
    label: 'Celebration',
    category: 'correct',
    description: 'Joyful victory leap and fist pump on correct answers',
    durationMs: 750,
    isLoop: false,
    cssClass: 'anim-celebration',
    icon: '🎉'
  },
  hurt: {
    key: 'hurt',
    label: 'Hurt Stagger',
    category: 'wrong',
    description: 'Recoil backwards with red pain flash on wrong answers',
    durationMs: 550,
    isLoop: false,
    cssClass: 'anim-hurt',
    icon: '💥'
  },
  attack: {
    key: 'attack',
    label: 'Boss Attack',
    category: 'battle',
    description: 'Supersonic forward dash and blade slash against the boss',
    durationMs: 500,
    isLoop: false,
    cssClass: 'anim-attack',
    icon: '⚔️'
  },
  slash_strike: {
    key: 'slash_strike',
    label: 'Slash Strike',
    category: 'battle',
    description: 'Zanpakuto supersonic blade slash',
    durationMs: 500,
    isLoop: false,
    cssClass: 'anim-attack',
    icon: '⚡'
  },
  ash_of_war: {
    key: 'ash_of_war',
    label: 'Bankai Finisher',
    category: 'battle',
    description: 'Maximum spiritual pressure Bankai attack',
    durationMs: 650,
    isLoop: false,
    cssClass: 'anim-attack',
    icon: '🌌'
  },
  dance: {
    key: 'dance',
    label: 'Victory Dance',
    category: 'victory',
    description: 'Looping celebratory groove and bounce after felling the boss',
    durationMs: 1200,
    isLoop: true,
    cssClass: 'anim-dance',
    icon: '🕺'
  },
  knockout: {
    key: 'knockout',
    label: 'Knockout Collapse',
    category: 'defeat',
    description: 'Stagger fall to ground with circling dizzy stars on 0 HP',
    durationMs: 850,
    isLoop: false,
    cssClass: 'anim-knockout',
    icon: '💫'
  },
  test_attack: {
    key: 'test_attack',
    label: 'Test Strike',
    category: 'battle',
    description: 'Practice attack in character preview',
    durationMs: 500,
    isLoop: false,
    cssClass: 'anim-attack',
    icon: '🗡️'
  }
};

/**
 * Normalizes input state and hurt status into a clean CharacterAnimationState
 */
export function resolveAnimationState(animState?: string, isHurt = false): CharacterAnimationState {
  if (isHurt) return 'hurt';
  if (!animState) return 'idle';

  switch (animState) {
    case 'celebration':
      return 'celebration';
    case 'hurt':
      return 'hurt';
    case 'attack':
    case 'slash_strike':
    case 'test_attack':
      return 'attack';
    case 'ash_of_war':
      return 'ash_of_war';
    case 'dance':
      return 'dance';
    case 'knockout':
      return 'knockout';
    case 'idle':
    default:
      return 'idle';
  }
}

/**
 * Returns Framer Motion animate property values for each character animation state.
 * Works seamlessly with GPU acceleration on mobile and desktop.
 */
export function getHeroMotionAnimate(state: CharacterAnimationState, isHurt = false) {
  const effective = resolveAnimationState(state, isHurt);

  switch (effective) {
    case 'hurt':
      return {
        x: [0, -22, 18, -14, 10, -4, 0],
        y: [0, 6, -3, 3, 0],
        rotate: [0, -14, 10, -6, 4, 0],
        opacity: [1, 0.35, 0.9, 0.45, 1],
        filter: [
          'brightness(1) drop-shadow(0 0 0px transparent)',
          'brightness(2.8) drop-shadow(0 0 18px #ef4444) hue-rotate(-20deg)',
          'brightness(1) drop-shadow(0 0 0px transparent)'
        ],
        scale: [1, 0.94, 1.03, 0.98, 1]
      };

    case 'celebration':
      return {
        y: [0, -28, -6, -20, 0],
        x: [0, -4, 4, -2, 0],
        scale: [1, 1.18, 1.02, 1.1, 1],
        rotate: [0, -10, 10, -5, 0],
        filter: [
          'brightness(1)',
          'brightness(1.5) drop-shadow(0 0 14px #34d399)',
          'brightness(1.2)',
          'brightness(1)'
        ],
        opacity: 1
      };

    case 'attack':
    case 'slash_strike':
    case 'test_attack':
      return {
        x: [0, 60, 160, 200, 0],
        y: [0, -20, 6, 2, 0],
        scale: [1, 1.15, 1.28, 1.18, 1],
        rotate: [0, -25, 35, -12, 0],
        filter: [
          'brightness(1)',
          'brightness(2.2) drop-shadow(0 0 16px #38bdf8)',
          'brightness(1)'
        ],
        opacity: 1
      };

    case 'ash_of_war':
      return {
        x: [0, 80, 200, 230, 0],
        y: [0, -28, 4, 0, 0],
        scale: [1, 1.25, 1.42, 1.2, 1],
        rotate: [0, -32, 42, -15, 0],
        filter: [
          'brightness(1)',
          'brightness(3) drop-shadow(0 0 24px #a855f7)',
          'brightness(1)'
        ],
        opacity: 1
      };

    case 'dance':
      return {
        y: [0, -16, 0, -16, 0],
        x: [0, -12, 0, 12, 0],
        rotate: [0, -12, 0, 12, 0],
        scaleY: [1, 1.12, 0.94, 1.12, 1],
        scaleX: [1, 0.94, 1.06, 0.94, 1],
        filter: [
          'brightness(1) drop-shadow(0 0 8px rgba(245,158,11,0.3))',
          'brightness(1.2) drop-shadow(0 0 18px rgba(245,158,11,0.7))',
          'brightness(1) drop-shadow(0 0 8px rgba(245,158,11,0.3))'
        ],
        opacity: 1
      };

    case 'knockout':
      return {
        x: [0, -12, -26, -38, -38],
        y: [0, -10, 16, 32, 34],
        rotate: [0, -22, -60, -88, -90],
        opacity: [1, 0.9, 0.8, 0.65, 0.65],
        filter: [
          'brightness(1) grayscale(0%)',
          'brightness(1.5) grayscale(40%)',
          'brightness(0.75) grayscale(85%)'
        ],
        scale: [1, 0.98, 0.94, 0.9, 0.9]
      };

    case 'idle':
    default:
      return {
        scaleY: [1, 1.045, 1],
        scaleX: [1, 0.985, 1],
        y: [0, -3, 0],
        rotate: [0, 0, 0],
        x: 0,
        opacity: 1,
        filter: 'brightness(1) drop-shadow(0 0 0px transparent)'
      };
  }
}

/**
 * Returns Framer Motion transition properties for each character animation state.
 */
export function getHeroMotionTransition(state: CharacterAnimationState, isHurt = false) {
  const effective = resolveAnimationState(state, isHurt);

  switch (effective) {
    case 'idle':
      return {
        duration: 2.2,
        repeat: Infinity,
        ease: 'easeInOut' as const
      };

    case 'dance':
      return {
        duration: 1.2,
        repeat: Infinity,
        ease: 'easeInOut' as const
      };

    case 'celebration':
      return {
        duration: 0.75,
        ease: 'easeOut' as const
      };

    case 'hurt':
      return {
        duration: 0.55,
        ease: 'easeInOut' as const
      };

    case 'attack':
    case 'slash_strike':
    case 'test_attack':
      return {
        duration: 0.5,
        ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number]
      };

    case 'ash_of_war':
      return {
        duration: 0.65,
        ease: [0.15, 0.85, 0.25, 1] as [number, number, number, number]
      };

    case 'knockout':
      return {
        duration: 0.85,
        ease: 'easeInOut' as const
      };

    default:
      return {
        duration: 1.8,
        repeat: Infinity,
        ease: 'easeInOut' as const
      };
  }
}

/**
 * Returns character-specific unique animation motion keyframes for Framer Motion.
 * Tailors speed, trajectories, rotation, and particle aura filters to each Bleach hero's combat lore.
 */
export function getHeroUniqueMotion(heroId: string, state: CharacterAnimationState, isHurt = false) {
  const effective = resolveAnimationState(state, isHurt);

  // Common knockout fallback
  if (effective === 'knockout') {
    return getHeroMotionAnimate('knockout', false);
  }

  switch (heroId) {
    case 'ichigo':
      if (effective === 'attack') {
        return {
          x: [0, 90, 220, 240, 0],
          y: [0, -26, 4, 0, 0],
          scale: [1, 1.25, 1.35, 1.15, 1],
          rotate: [0, -30, 40, -10, 0],
          filter: [
            'brightness(1)',
            'brightness(2.6) drop-shadow(0 0 20px #ef4444) drop-shadow(0 0 35px #7f1d1d)',
            'brightness(1)'
          ],
          opacity: 1
        };
      }
      if (effective === 'hurt') {
        return {
          x: [0, -28, 20, -16, 8, 0],
          rotate: [0, -18, 12, -8, 0],
          filter: ['brightness(1)', 'brightness(2.8) drop-shadow(0 0 20px #dc2626)', 'brightness(1)'],
          opacity: [1, 0.4, 0.9, 0.5, 1]
        };
      }
      if (effective === 'celebration' || effective === 'dance') {
        return {
          y: [0, -34, -4, -22, 0],
          x: [0, -6, 6, -3, 0],
          scale: [1, 1.22, 1.05, 1.12, 1],
          filter: ['brightness(1)', 'brightness(1.6) drop-shadow(0 0 16px #f97316)', 'brightness(1)']
        };
      }
      // Idle
      return {
        scaleY: [1, 1.05, 1],
        scaleX: [1, 0.98, 1],
        y: [0, -4, 0],
        filter: [
          'drop-shadow(0 0 6px rgba(249,115,22,0.3))',
          'drop-shadow(0 0 14px rgba(239,68,68,0.5))',
          'drop-shadow(0 0 6px rgba(249,115,22,0.3))'
        ]
      };

    case 'kenpachi':
      if (effective === 'attack') {
        // Heavy downward ground-cleave
        return {
          x: [0, 40, 150, 180, 0],
          y: [0, -40, 48, 10, 0],
          scale: [1, 1.35, 1.45, 1.2, 1],
          rotate: [0, -40, 50, -5, 0],
          filter: [
            'brightness(1)',
            'brightness(2.8) drop-shadow(0 0 25px #eab308) drop-shadow(0 0 45px #ca8a04)',
            'brightness(1)'
          ]
        };
      }
      if (effective === 'hurt') {
        // Laughs off hits, minimal flinch
        return {
          x: [0, -10, 6, -4, 0],
          rotate: [0, -6, 4, 0],
          filter: ['brightness(1)', 'brightness(2) drop-shadow(0 0 15px #eab308)', 'brightness(1)']
        };
      }
      if (effective === 'celebration' || effective === 'dance') {
        return {
          scale: [1, 1.25, 1.1, 1.2, 1],
          y: [0, -20, 0, -15, 0],
          rotate: [0, -8, 8, -4, 0],
          filter: ['brightness(1)', 'brightness(2) drop-shadow(0 0 25px #facc15)', 'brightness(1)']
        };
      }
      // Idle: intimidating swagger
      return {
        scaleY: [1, 1.06, 1],
        scaleX: [1, 0.97, 1],
        y: [0, -5, 0],
        filter: [
          'drop-shadow(0 0 8px rgba(234,179,8,0.4))',
          'drop-shadow(0 0 18px rgba(202,138,4,0.6))',
          'drop-shadow(0 0 8px rgba(234,179,8,0.4))'
        ]
      };

    case 'byakuya':
      if (effective === 'attack') {
        // Calm hand gesture with converging petal vortex
        return {
          x: [0, 30, 60, 40, 0],
          y: [0, -12, -4, 0, 0],
          scale: [1, 1.15, 1.2, 1.08, 1],
          rotate: [0, -8, 12, 0],
          filter: [
            'brightness(1)',
            'brightness(2.4) drop-shadow(0 0 24px #ec4899) drop-shadow(0 0 40px #f43f5e)',
            'brightness(1)'
          ]
        };
      }
      if (effective === 'hurt') {
        return {
          x: [0, -16, 12, -8, 0],
          rotate: [0, -8, 6, 0],
          filter: ['brightness(1)', 'brightness(2) drop-shadow(0 0 16px #f472b6)', 'brightness(1)']
        };
      }
      if (effective === 'celebration' || effective === 'dance') {
        return {
          y: [0, -18, 0, -12, 0],
          rotate: [0, -4, 4, 0],
          filter: ['brightness(1)', 'brightness(1.8) drop-shadow(0 0 20px #f472b6)', 'brightness(1)']
        };
      }
      // Idle: serene noble float
      return {
        y: [0, -8, 0],
        scaleY: [1, 1.03, 1],
        filter: [
          'drop-shadow(0 0 8px rgba(236,72,153,0.3))',
          'drop-shadow(0 0 16px rgba(244,114,182,0.6))',
          'drop-shadow(0 0 8px rgba(236,72,153,0.3))'
        ]
      };

    case 'rukia':
      if (effective === 'attack') {
        // Absolute zero pirouette spin with Hakka no Togame frost pillar
        return {
          x: [0, 50, 140, 160, 0],
          y: [0, -20, 0, 0],
          rotate: [0, 180, 360, 0],
          scale: [1, 1.28, 1.38, 1.1, 1],
          filter: [
            'brightness(1)',
            'brightness(3) drop-shadow(0 0 26px #38bdf8) drop-shadow(0 0 45px #0284c7)',
            'brightness(1)'
          ]
        };
      }
      if (effective === 'hurt') {
        return {
          x: [0, -20, 14, -10, 0],
          rotate: [0, -12, 8, 0],
          filter: ['brightness(1)', 'brightness(2.2) drop-shadow(0 0 16px #38bdf8)', 'brightness(1)']
        };
      }
      if (effective === 'celebration' || effective === 'dance') {
        return {
          y: [0, -28, -6, -18, 0],
          rotate: [0, -10, 10, -5, 0],
          scale: [1, 1.2, 1.04, 1.12, 1],
          filter: ['brightness(1)', 'brightness(2) drop-shadow(0 0 22px #7dd3fc)', 'brightness(1)']
        };
      }
      // Idle: frost crystal motes
      return {
        y: [0, -6, 0],
        scaleY: [1, 1.035, 1],
        filter: [
          'drop-shadow(0 0 6px rgba(56,189,248,0.3))',
          'drop-shadow(0 0 16px rgba(125,211,252,0.6))',
          'drop-shadow(0 0 6px rgba(56,189,248,0.3))'
        ]
      };

    case 'aizen':
      if (effective === 'attack') {
        // Kyoka Suigetsu glass shatter illusion + Kurohitsugi gravity warp
        return {
          x: [0, 20, 80, 60, 0],
          y: [0, -18, -6, 0],
          scale: [1, 1.35, 0.9, 1.25, 1],
          rotate: [0, -12, 18, 0],
          filter: [
            'brightness(1)',
            'brightness(3) drop-shadow(0 0 30px #a855f7) drop-shadow(0 0 50px #581c87)',
            'brightness(1)'
          ]
        };
      }
      if (effective === 'hurt') {
        // Shatters like illusion glass
        return {
          opacity: [1, 0.2, 0.85, 0.3, 1],
          scale: [1, 0.9, 1.05, 0.96, 1],
          filter: ['brightness(1)', 'brightness(2.8) drop-shadow(0 0 22px #c084fc)', 'brightness(1)']
        };
      }
      if (effective === 'celebration' || effective === 'dance') {
        return {
          y: [0, -20, 0, -12, 0],
          scale: [1, 1.2, 1.08, 1.15, 1],
          filter: ['brightness(1)', 'brightness(2.4) drop-shadow(0 0 25px #c084fc)', 'brightness(1)']
        };
      }
      // Idle: transcendent gravity hover
      return {
        y: [0, -10, 0],
        scale: [1, 1.04, 1],
        filter: [
          'drop-shadow(0 0 10px rgba(168,85,247,0.4))',
          'drop-shadow(0 0 22px rgba(147,51,234,0.7))',
          'drop-shadow(0 0 10px rgba(168,85,247,0.4))'
        ]
      };

    case 'yamamoto':
      if (effective === 'attack') {
        // Zanka no Tachi 15,000,000° solar incinerator wave
        return {
          x: [0, 60, 180, 200, 0],
          y: [0, -32, 10, 0, 0],
          scale: [1, 1.38, 1.5, 1.2, 1],
          rotate: [0, -25, 35, 0],
          filter: [
            'brightness(1)',
            'brightness(3.2) drop-shadow(0 0 32px #f59e0b) drop-shadow(0 0 55px #dc2626)',
            'brightness(1)'
          ]
        };
      }
      if (effective === 'hurt') {
        return {
          x: [0, -12, 8, -4, 0],
          filter: ['brightness(1)', 'brightness(2.5) drop-shadow(0 0 22px #ef4444)', 'brightness(1)']
        };
      }
      // Idle: raging infernal solar embers
      return {
        scaleY: [1, 1.055, 1],
        scaleX: [1, 0.975, 1],
        y: [0, -4, 0],
        filter: [
          'drop-shadow(0 0 10px rgba(245,158,11,0.4))',
          'drop-shadow(0 0 24px rgba(239,68,68,0.7))',
          'drop-shadow(0 0 10px rgba(245,158,11,0.4))'
        ]
      };

    case 'ulquiorra_hero':
      if (effective === 'attack') {
        // Lanza del Relampago emerald javelin strike
        return {
          x: [0, 80, 210, 230, 0],
          y: [0, -24, 6, 0, 0],
          scale: [1, 1.3, 1.42, 1.15, 1],
          rotate: [0, -28, 38, 0],
          filter: [
            'brightness(1)',
            'brightness(3) drop-shadow(0 0 28px #10b981) drop-shadow(0 0 48px #047857)',
            'brightness(1)'
          ]
        };
      }
      if (effective === 'hurt') {
        // Cellular regeneration green flash
        return {
          x: [0, -18, 12, -8, 0],
          filter: ['brightness(1)', 'brightness(2.6) drop-shadow(0 0 22px #34d399)', 'brightness(1)']
        };
      }
      // Idle: bat wing flutter
      return {
        y: [0, -7, 0],
        scaleY: [1, 1.04, 1],
        filter: [
          'drop-shadow(0 0 8px rgba(16,185,129,0.3))',
          'drop-shadow(0 0 18px rgba(52,211,153,0.6))',
          'drop-shadow(0 0 8px rgba(16,185,129,0.3))'
        ]
      };

    default:
      // Other heroes (Yoruichi, Renji, Shunsui, Urahara, Toshiro) use enhanced dynamic motions
      return getHeroMotionAnimate(effective, isHurt);
  }
}

/**
 * Returns character-specific Framer Motion transition config
 */
export function getHeroUniqueTransition(heroId: string, state: CharacterAnimationState, isHurt = false) {
  const effective = resolveAnimationState(state, isHurt);

  if (effective === 'attack') {
    if (heroId === 'ichigo' || heroId === 'yoruichi') {
      // Supersonic speed attack
      return { duration: 0.42, ease: [0.15, 0.9, 0.2, 1] as [number, number, number, number] };
    }
    if (heroId === 'kenpachi' || heroId === 'yamamoto') {
      // Titanic heavy attack
      return { duration: 0.62, ease: [0.2, 0.8, 0.25, 1] as [number, number, number, number] };
    }
  }

  return getHeroMotionTransition(effective, isHurt);
}

