// Persistent LocalStorage helper for Character Classes and Coin Upgrades
import { CharacterClassId, CHARACTER_CLASSES, MAX_CLASS_LEVEL } from '../data/characterClassesData';

const SELECTED_CLASS_KEY = 'questlearn_selected_character_class';
const CLASS_LEVELS_KEY = 'questlearn_character_class_levels';

export type CharacterClassLevelsMap = Record<CharacterClassId, number>;

export const DEFAULT_CLASS_LEVELS: CharacterClassLevelsMap = {
  healer: 1,
  warrior: 1,
  guardian: 1,
  mage: 1,
  immortal: 1,
};

export const DEFAULT_SELECTED_CLASS: CharacterClassId = 'warrior';

/**
 * Loads all class levels from localStorage, falling back to Level 1.
 */
export function loadCharacterClassLevels(): CharacterClassLevelsMap {
  if (typeof window === 'undefined') return { ...DEFAULT_CLASS_LEVELS };

  try {
    const raw = localStorage.getItem(CLASS_LEVELS_KEY);
    if (!raw) return { ...DEFAULT_CLASS_LEVELS };

    const parsed = JSON.parse(raw);
    const result: CharacterClassLevelsMap = { ...DEFAULT_CLASS_LEVELS };

    (Object.keys(DEFAULT_CLASS_LEVELS) as CharacterClassId[]).forEach((classId) => {
      const val = parseInt(parsed[classId], 10);
      if (!isNaN(val) && val >= 1) {
        result[classId] = Math.min(MAX_CLASS_LEVEL, val);
      }
    });

    return result;
  } catch (err) {
    console.warn('Failed to read character class levels from localStorage', err);
    return { ...DEFAULT_CLASS_LEVELS };
  }
}

/**
 * Saves a new level for a specific class into localStorage.
 */
export function saveCharacterClassLevel(classId: CharacterClassId, level: number): CharacterClassLevelsMap {
  const currentLevels = loadCharacterClassLevels();
  const clamped = Math.max(1, Math.min(MAX_CLASS_LEVEL, level));
  currentLevels[classId] = clamped;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CLASS_LEVELS_KEY, JSON.stringify(currentLevels));
    } catch (err) {
      console.warn('Failed to save character class levels to localStorage', err);
    }
  }

  return currentLevels;
}

/**
 * Loads the currently equipped character class.
 */
export function loadSelectedCharacterClass(): CharacterClassId {
  if (typeof window === 'undefined') return DEFAULT_SELECTED_CLASS;

  try {
    const saved = localStorage.getItem(SELECTED_CLASS_KEY) as CharacterClassId;
    if (saved && CHARACTER_CLASSES[saved]) {
      return saved;
    }
  } catch (err) {
    console.warn('Failed to read selected class from localStorage', err);
  }

  return DEFAULT_SELECTED_CLASS;
}

/**
 * Saves the selected character class into localStorage.
 */
export function saveSelectedCharacterClass(classId: CharacterClassId): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(SELECTED_CLASS_KEY, classId);
  } catch (err) {
    console.warn('Failed to save selected class to localStorage', err);
  }
}
