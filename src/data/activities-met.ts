/**
 * MET (Metabolic Equivalent of Task) values for different activities
 * Used to calculate calories burned based on: (MET × weight in kg × 3.5) / 200 × duration in minutes
 */

export interface ActivityMet {
  name: string;
  met: number;
  category: string;
}

export const ACTIVITIES_MET: ActivityMet[] = [
  // Group fitness classes - Low intensity (Bien-être/Relaxation)
  { name: "Bodybalance", met: 3.5, category: "Bien-être" },
  { name: "Pilates", met: 3.0, category: "Bien-être" },
  { name: "Stretching", met: 2.5, category: "Bien-être" },
  { name: "Swiss Ball", met: 3.2, category: "Bien-être" },
  { name: "Yoga", met: 2.8, category: "Bien-être" },

  // Group fitness classes - High intensity cardio (Cardio)
  { name: "Cardio Combat", met: 8.0, category: "Cardio" },
  { name: "Step", met: 7.5, category: "Cardio" },
  { name: "Step Débutant", met: 6.0, category: "Cardio" },
  { name: "Step Intermédiaire", met: 6.8, category: "Cardio" },
  { name: "LIA", met: 5.5, category: "Cardio" },
  { name: "Zumba", met: 8.0, category: "Cardio" },

  // Group fitness classes - Strength/Mixed (Renforcement)
  { name: "Bodypump", met: 7.0, category: "Renforcement" },
  { name: "Body Sculpt", met: 6.5, category: "Renforcement" },
  { name: "Cuisses Abdos Fessiers", met: 6.0, category: "Renforcement" },
  { name: "RPM", met: 8.5, category: "Cardio" },

  // High intensity specialized classes (Haute Intensité)
  { name: "Hyrox", met: 9.0, category: "Haute Intensité" },
  { name: "HBX Boxing", met: 8.5, category: "Haute Intensité" },
  { name: "HBX Fusion", met: 8.8, category: "Haute Intensité" },
  { name: "HBX Move", met: 8.0, category: "Haute Intensité" },

  // Open access activities (Sports Libres)
  { name: "Cardio-musculation", met: 6.5, category: "Sports Libres" },
  { name: "Escalade", met: 5.5, category: "Sports Libres" },
  { name: "Golf", met: 3.0, category: "Sports Libres" },
  { name: "Squash", met: 9.0, category: "Sports Libres" },

  // Personal options (Activité Légère)
  { name: "Repos actif", met: 1.5, category: "Activité Légère" },
  { name: "Marche", met: 3.5, category: "Activité Légère" },
  { name: "Étirements libres", met: 2.3, category: "Activité Légère" }
];

/**
 * Create a map of activity name to MET value for quick lookup
 */
export const ACTIVITIES_MET_MAP: Record<string, number> = ACTIVITIES_MET.reduce((acc, activity) => {
  acc[activity.name] = activity.met;
  return acc;
}, {} as Record<string, number>);

/**
 * Calculate calories burned for an activity
 * @param activityName - Name of the activity
 * @param weightKg - Weight in kg
 * @param durationMin - Duration in minutes (default: 45)
 * @returns Calories burned
 */
export function calculateCaloriesBurned(
  activityName: string, 
  weightKg: number, 
  durationMin: number = 45
): number {
  const met = ACTIVITIES_MET_MAP[activityName];
  if (!met) {
    console.warn(`MET value not found for activity: ${activityName}`);
    return 0;
  }
  
  // Formula: (MET × weight in kg × 3.5) / 200 × duration in minutes
  return Math.round((met * weightKg * 3.5 / 200) * durationMin);
}

/**
 * Get MET value for an activity
 * @param activityName - Name of the activity
 * @returns MET value or null if not found
 */
export function getActivityMet(activityName: string): number | null {
  return ACTIVITIES_MET_MAP[activityName] || null;
}

/**
 * Group activities by category
 */
export const ACTIVITIES_BY_CATEGORY = ACTIVITIES_MET.reduce((acc, activity) => {
  if (!acc[activity.category]) {
    acc[activity.category] = [];
  }
  acc[activity.category].push(activity);
  return acc;
}, {} as Record<string, ActivityMet[]>);
