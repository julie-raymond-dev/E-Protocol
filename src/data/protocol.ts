import { Meal } from '../types';

/**
 * Daily macronutrient and calorie objectives
 */
export const OBJECTIVES = {
  P: 102,
  L: 49,
  G: 230,
  KCAL: 1770
};

/**
 * Available meal options with their macronutrient values
 */
export const PLATS: Record<string, Meal> = {
  "Poulet tikka quinoa": { name: "Poulet tikka quinoa", kcal: 450, P: 42, L: 11, G: 44 },
  "Poulet sauce tomate": { name: "Poulet sauce tomate", kcal: 445, P: 40, L: 9, G: 49 },
  "Omelette quinoa": { name: "Omelette quinoa", kcal: 450, P: 26, L: 17, G: 46 },
  "Boulettes bœuf pâtes": { name: "Boulettes bœuf pâtes", kcal: 465, P: 37, L: 12, G: 50 },
  "Saumon teriyaki riz": { name: "Saumon teriyaki riz", kcal: 470, P: 36, L: 15, G: 47 },
  "Œufs brouillés patate douce": { name: "Œufs brouillés patate douce", kcal: 455, P: 25, L: 18, G: 45 },
  "Poulet sauce tomate lentilles": { name: "Poulet sauce tomate lentilles", kcal: 445, P: 40, L: 9, G: 49 },
  "Dinde curry riz complet": { name: "Dinde curry riz complet", kcal: 440, P: 38, L: 10, G: 48 },
  "Poulet paprika patate douce": { name: "Poulet paprika patate douce", kcal: 455, P: 41, L: 13, G: 44 }
};

/**
 * Array of available meal names
 */
export const PLAT_NAMES = Object.keys(PLATS);

/**
 * Available activity and exercise options
 */
export const ACTIVITES = [
  // Group fitness classes
  "Bodybalance", "Pilates", "Stretching", "Swiss Ball", "Yoga",
  "Cardio Combat", "Step", "Step Débutant", "Step Intermédiaire", "LIA",
  "Bodypump", "Body Sculpt", "Cuisses Abdos Fessiers", "RPM", "Zumba",
  "Hyrox", "HBX Boxing", "HBX Fusion", "HBX Move",
  
  // Open access activities
  "Cardio-musculation", "Escalade", "Golf", "Squash",
  
  // Personal options
  "Repos actif", "Marche", "Étirements libres"
];

/**
 * Estimated calories burned for 45-minute sessions
 * Values are averages for a 60kg person
 */
export const ACTIVITES_CALORIES: Record<string, number> = {
  // Group fitness classes - Low intensity
  "Bodybalance": 180,
  "Pilates": 160,
  "Stretching": 120,
  "Swiss Ball": 170,
  "Yoga": 140,
  
  // Group fitness classes - High intensity cardio
  "Cardio Combat": 350,
  "Step": 320,
  "Step Débutant": 280,
  "Step Intermédiaire": 320,
  "LIA": 300,
  "Zumba": 330,
  
  // Group fitness classes - Strength/Mixed
  "Bodypump": 250,
  "Body Sculpt": 240,
  "Cuisses Abdos Fessiers": 220,
  "RPM": 380,
  
  // High intensity specialized classes
  "Hyrox": 400,
  "HBX Boxing": 380,
  "HBX Fusion": 320,
  "HBX Move": 300,
  
  // Open access activities
  "Cardio-musculation": 280,
  "Escalade": 320,
  "Golf": 200,
  "Squash": 360,
  
  // Personal options
  "Repos actif": 100,
  "Marche": 150,
  "Étirements libres": 90
};

/**
 * Macronutrient values for supplements (per daily dose)
 */
export const COMPLEMENTS_MACROS = {
  "Clear Whey (25 g)": { kcal: 120, P: 25, L: 0, G: 0 },
  "Créatine Creapure (5 g)": { kcal: 0, P: 0, L: 0, G: 0 },
  "Fat Burner (4 caps)": { kcal: 8, P: 0.4, L: 0.1, G: 0.7 },
  "Multivitamines (3 caps)": { kcal: 7, P: 0.3, L: 0.2, G: 0.5 },
  "Oméga-3 (2 caps)": { kcal: 18, P: 0, L: 2, G: 0 },
  "Magnésium (2 caps)": { kcal: 4, P: 0.1, L: 0, G: 0.9 }
};

/**
 * List of available supplement names
 */
export const COMPLEMENTS = [
  "Multivitamines (3 caps)",
  "Oméga-3 (2 caps)",
  "Fat Burner (4 caps)",
  "Clear Whey (25 g)",
  "Créatine Creapure (5 g)",
  "Magnésium (2 caps)"
];

/**
 * Standard breakfast meal configuration
 */
export const PETIT_DEJEUNER: Meal = {
  name: "Petit-déjeuner",
  kcal: 339,
  P: 20,
  L: 8.6,
  G: 42,
  ingredients: "Flocons avoine 40 g + yaourt brebis 150 g + chia 10 g + purée amande 5 g + ½ pomme + cannelle/citron"
};

/**
 * Standard snack meal configuration
 */
export const COLATION: Meal = {
  name: "Colation",
  kcal: 80,
  P: 2,
  L: 4,
  G: 10,
  ingredients: "1 fruit + 10 amandes"
};

/**
 * Available snack options with their macronutrient values
 */
export const COLLATIONS: Record<string, Meal> = {
  "Fruit + amandes": {
    name: "Fruit + amandes",
    kcal: 80,
    P: 2,
    L: 4,
    G: 10,
    ingredients: "1 fruit + 10 amandes"
  },
  "Poire + noix": {
    name: "Poire + noix",
    kcal: 80,
    P: 2,
    L: 4,
    G: 10,
    ingredients: "1 petite poire (~130 g) + 10 cerneaux noix (~10 g)"
  },
  "Clémentine + beurre cacahuète": {
    name: "Clémentine + beurre cacahuète",
    kcal: 80,
    P: 2,
    L: 4,
    G: 10,
    ingredients: "1 clémentine (~75 g) + 5 g beurre cacahuète"
  },
  "Yaourt soja + graines lin": {
    name: "Yaourt soja + graines lin",
    kcal: 80,
    P: 2,
    L: 4,
    G: 10,
    ingredients: "100 g yaourt soja nature + 5 g lin moulu"
  },
  "Carotte + purée amande": {
    name: "Carotte + purée amande",
    kcal: 80,
    P: 2,
    L: 4,
    G: 10,
    ingredients: "1 mini carotte (~60 g) + 5 g purée amande"
  },
  "Kiwi + coco râpée": {
    name: "Kiwi + coco râpée",
    kcal: 80,
    P: 2,
    L: 4,
    G: 10,
    ingredients: "1 kiwi (~70 g) + 5 g coco râpée"
  }
};

export const COLLATION_NAMES = Object.keys(COLLATIONS);

export const CLEAR_WHEY: Meal = {
  name: "Clear Whey",
  kcal: 120,
  P: 25,
  L: 0,
  G: 0,
  ingredients: "25 g Thé Pêche + 300 ml eau (post-sport)"
};