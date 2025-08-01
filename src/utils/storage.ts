import { DayProgress } from '../types';

const STORAGE_KEYS = {
  USER: 'protocol_user',
  PROGRESS: 'protocol_progress'
};

/**
 * Saves user information to localStorage
 * @param {string} username - The username to save
 */
export function saveUser(username: string): void {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ username, loginTime: Date.now() }));
}

/**
 * Retrieves the current user from localStorage
 * @returns {string | null} The username or null if not found
 */
export function getUser(): string | null {
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  if (userData) {
    const { username } = JSON.parse(userData);
    return username;
  }
  return null;
}

/**
 * Removes user data from localStorage (logout)
 */
export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.USER);
}

/**
 * Saves daily progress data to localStorage
 * @param {DayProgress} progress - The progress data to save
 */
export function saveDayProgress(progress: DayProgress): void {
  const allProgress = getAllProgress();
  allProgress[progress.date] = progress;
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
}

/**
 * Retrieves progress data for a specific date
 * @param {string} date - The date in YYYY-MM-DD format
 * @returns {DayProgress | null} Progress data or null if not found
 */
export function getDayProgress(date: string): DayProgress | null {
  const allProgress = getAllProgress();
  return allProgress[date] || null;
}

/**
 * Updates selected meals for a specific date
 * @param {string} date - The date in YYYY-MM-DD format
 * @param {object} selectedMeals - Object containing meal selections
 */
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

/**
 * Updates selected activity for a specific date
 * @param {string} date - The date in YYYY-MM-DD format
 * @param {string} selectedActivity - The selected activity name
 */
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

/**
 * Retrieves all progress data from localStorage
 * @returns {Record<string, DayProgress>} Object containing all progress data by date
 */
export function getAllProgress(): Record<string, DayProgress> {
  const progressData = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return progressData ? JSON.parse(progressData) : {};
}