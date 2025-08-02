export interface User {
  username: string;
  password: string;
}

export interface UserProfile {
  id: string;
  poids: number; // kg
  taille: number; // cm
  age: number; // ans
  sexe: 'femme' | 'homme';
  niveau_activite: number; // 1.2 à 1.9
  niveau_activite_label: string; // Label descriptif
  objectif: 'perte' | 'maintien' | 'prise';
  regime_type: 'standard' | 'proteine_glucides_reduits'; // Type de régime
  bmr: number; // Calculé automatiquement
  tdee: number; // Calculé automatiquement
  calories_cibles: number; // Calculé automatiquement
  macros_cibles: {
    proteines: number; // g
    lipides: number; // g
    glucides: number; // g
  };
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  name: string;
  kcal: number;
  P: number;
  L: number;
  G: number;
  ingredients?: string;
}

export interface DayProtocol {
  date: string;
  petitDejeuner: Meal;
  dejeuner: Meal;
  diner: Meal;
  colation: Meal;
  clearWhey: Meal;
  sport: string;
  complements: string[];
  totals: {
    kcal: number;
    P: number;
    L: number;
    G: number;
  };
}

export interface DayProgress {
  date: string;
  petitDejeuner: boolean;
  dejeuner: boolean;
  diner: boolean;
  colation: boolean;
  clearWhey: boolean;
  sport: boolean;
  complements: boolean[];
  selectedMeals?: {
    petitDejeuner?: string;
    dejeuner?: string;
    diner?: string;
    colation?: string;
  };
  selectedActivity?: string;
}