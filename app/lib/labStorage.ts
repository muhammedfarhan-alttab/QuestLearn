// LocalStorage persistence for Practical Models, Guided Experiment Progress & Rewards

export interface LabStorageState {
  completedTasks: Record<string, string[]>; // labId -> array of completed taskIds
  masteredLabs: string[]; // array of labIds where all tasks are completed
  customPresets: Record<string, Record<string, number>>; // labId -> custom parameter values
}

const LAB_STORAGE_KEY = 'questlearn_practical_labs_v1';

const DEFAULT_LAB_STORAGE: LabStorageState = {
  completedTasks: {},
  masteredLabs: [],
  customPresets: {}
};

export function getLabStorageState(): LabStorageState {
  if (typeof window === 'undefined') return DEFAULT_LAB_STORAGE;
  try {
    const raw = localStorage.getItem(LAB_STORAGE_KEY);
    if (!raw) return DEFAULT_LAB_STORAGE;
    return JSON.parse(raw) as LabStorageState;
  } catch (err) {
    console.warn('Failed to parse lab storage, returning defaults:', err);
    return DEFAULT_LAB_STORAGE;
  }
}

export function saveLabStorageState(state: LabStorageState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LAB_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save lab storage:', err);
  }
}

export function isTaskCompleted(labId: string, taskId: string): boolean {
  const state = getLabStorageState();
  const tasks = state.completedTasks[labId] || [];
  return tasks.includes(taskId);
}

export function markTaskCompleted(labId: string, taskId: string, totalTasksInLab: number = 3): {
  isNewCompletion: boolean;
  isNowMastered: boolean;
} {
  const state = getLabStorageState();
  const existingTasks = state.completedTasks[labId] || [];

  if (existingTasks.includes(taskId)) {
    return { isNewCompletion: false, isNowMastered: state.masteredLabs.includes(labId) };
  }

  const updatedTasks = [...existingTasks, taskId];
  state.completedTasks[labId] = updatedTasks;

  const isNowMastered = updatedTasks.length >= totalTasksInLab;
  if (isNowMastered && !state.masteredLabs.includes(labId)) {
    state.masteredLabs.push(labId);
  }

  saveLabStorageState(state);
  return { isNewCompletion: true, isNowMastered };
}

export function getCompletedTasksCount(labId: string): number {
  const state = getLabStorageState();
  return (state.completedTasks[labId] || []).length;
}

export function isLabMastered(labId: string): boolean {
  const state = getLabStorageState();
  return state.masteredLabs.includes(labId);
}

export function saveCustomLabPreset(labId: string, params: Record<string, number>): void {
  const state = getLabStorageState();
  state.customPresets[labId] = params;
  saveLabStorageState(state);
}

export function getCustomLabPreset(labId: string): Record<string, number> | null {
  const state = getLabStorageState();
  return state.customPresets[labId] || null;
}
