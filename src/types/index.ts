export interface User {
  username: string;
  password: string;
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
    dejeuner?: string;
    diner?: string;
    colation?: string;
  };
  selectedActivity?: string;
}