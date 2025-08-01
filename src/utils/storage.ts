import { DayProgress } from '../types';

const STORAGE_KEYS = {
  USER: 'protocol_user',
  PROGRESS: 'protocol_progress'
};

export function saveUser(username: string): void {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ username, loginTime: Date.now() }));
}

export function getUser(): string | null {
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  if (userData) {
    const { username } = JSON.parse(userData);
    return username;
  }
  return null;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.USER);
}

export function saveDayProgress(progress: DayProgress): void {
  const allProgress = getAllProgress();
  allProgress[progress.date] = progress;
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
}

export function getDayProgress(date: string): DayProgress | null {
  const allProgress = getAllProgress();
  return allProgress[date] || null;
}

export function updateSelectedMeals(date: string, selectedMeals: { dejeuner?: string; diner?: string; colation?: string }): void {
  const allProgress = getAllProgress();
  if (!allProgress[date]) {
    allProgress[date] = {
      date,
      petitDejeuner: false,
      dejeuner: false,
      diner: false,
      colation: false,
      clearWhey: false,
      sport: false,
      complements: [],
      selectedMeals: {}
    };
  }
  allProgress[date].selectedMeals = { ...allProgress[date].selectedMeals, ...selectedMeals };
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
}

export function updateSelectedActivity(date: string, selectedActivity: string): void {
  const allProgress = getAllProgress();
  if (!allProgress[date]) {
    allProgress[date] = {
      date,
      petitDejeuner: false,
      dejeuner: false,
      diner: false,
      colation: false,
      clearWhey: false,
      sport: false,
      complements: [],
      selectedMeals: {}
    };
  }
  allProgress[date].selectedActivity = selectedActivity;
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
}

export function getAllProgress(): Record<string, DayProgress> {
  const progressData = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return progressData ? JSON.parse(progressData) : {};
}