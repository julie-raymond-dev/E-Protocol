import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { generateDayProtocol } from '../utils/protocolGenerator';
import { getDayProgress, saveDayProgress, updateSelectedMeals, updateSelectedActivity } from '../utils/storage';
import { DayProtocol, DayProgress, Meal, UserProfile } from '../types';
import { PLATS, COLLATIONS, COMPLEMENTS_MACROS, PETIT_DEJEUNER } from '../data/protocol';
import { userProfileService } from '../services/userProfileService';
import { calculateCaloriesBurned, getActivityMet } from '../data/activities-met';
import MacroCard from './MacroCard';
import MealCard from './MealCard';
import SportCard from './SportCard';
import ComplementsCard from './ComplementsCard';
import ProfileBanner from './ProfileBanner';
import MealSelector from './MealSelector';
import ActivitySelector from './ActivitySelector';
import WeeklySummary from './WeeklySummary';
import RecipeManager from './RecipeManager';
import { useRecipes } from '../hooks/useRecipes';
import { Recipe } from '../services/recipeStorage';

/**
 * Type definition for meal types in the protocol
 */
type MealType = 'petitDejeuner' | 'dejeuner' | 'diner' | 'colation';

/**
 * Type for weekly summary totals tracking
 */
interface WeeklyTotals {
  calories: number;
  proteins: number;
  lipids: number;
  carbs: number;
  completedActivities: number;
  completedMeals: number;
  completedComplements: number;
  plannedComplements: number;
  activityTypes: Set<string>;
}

/**
 * Type for meal with macro information
 */
interface MealWithMacros {
  kcal: number;
  P: number;
  L: number;
  G: number;
}

interface DashboardProps {
  readonly onOpenProfile: () => void;
}

export interface DashboardRef {
  refreshProfile: () => void;
}

/**
 * Main dashboard component for displaying daily nutrition protocol and progress tracking
 * @returns {JSX.Element} Dashboard component with meal cards, activity tracking, and progress monitoring
 */
const Dashboard = forwardRef<DashboardRef, DashboardProps>(({ onOpenProfile }, ref) => {
  const { recipes } = useRecipes();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [protocol, setProtocol] = useState<DayProtocol>();
  const [progress, setProgress] = useState<DayProgress>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [mealSelector, setMealSelector] = useState<{
    isOpen: boolean;
    type: MealType | null;
  }>({ isOpen: false, type: null });
  const [activitySelector, setActivitySelector] = useState(false);
  const [weeklySummaryOpen, setWeeklySummaryOpen] = useState(false);
  const [recipeManagerOpen, setRecipeManagerOpen] = useState(false);
  const [defaultMealType, setDefaultMealType] = useState<Recipe['type'] | undefined>(undefined);

  useEffect(() => {
    const existingProgress = getDayProgress(currentDate.toISOString().split('T')[0]);
    const customMeals = existingProgress?.selectedMeals;
    const customActivity = existingProgress?.selectedActivity;
    
    const dayProtocol = generateDayProtocol(currentDate, customMeals, customActivity, recipes);
    setProtocol(dayProtocol);

    if (existingProgress) {
      setProgress(existingProgress);
    } else {
      const newProgress: DayProgress = {
        date: dayProtocol.date,
        petitDejeuner: false,
        dejeuner: false,
        diner: false,
        colation: false,
        clearWhey: false,
        sport: false,
        complements: new Array(dayProtocol.complements.length).fill(false),
        selectedMeals: {}
      };
      setProgress(newProgress);
    }
  }, [currentDate, recipes]);

  // Load user profile
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setProfileLoading(true);
        const profile = await userProfileService.getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        setUserProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  // Expose refresh method via ref
  useImperativeHandle(ref, () => ({
    refreshProfile: async () => {
      try {
        setProfileLoading(true);
        const profile = await userProfileService.getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Erreur lors du rechargement du profil:', error);
        setUserProfile(null);
      } finally {
        setProfileLoading(false);
      }
    }
  }));

  // Set up event listeners for navigation and recipe management
  useEffect(() => {
    /**
     * Handler to navigate back to today's date
     */
    const handleGoToToday = () => {
      setCurrentDate(new Date());
    };

    /**
     * Handler to open the recipe manager
     */
    const handleOpenRecipes = () => {
      setRecipeManagerOpen(true);
    };

    window.addEventListener('goToToday', handleGoToToday);
    window.addEventListener('openRecipes', handleOpenRecipes);
    
    return () => {
      window.removeEventListener('goToToday', handleGoToToday);
      window.removeEventListener('openRecipes', handleOpenRecipes);
    };
  }, []);

  /**
   * Updates the daily progress and saves it to storage
   * @param {Partial<DayProgress>} updates - Partial progress data to update
   */
  const updateProgress = (updates: Partial<DayProgress>) => {
    if (!progress) return;
    
    const newProgress = { ...progress, ...updates };
    setProgress(newProgress);
    saveDayProgress(newProgress);
  };

  /**
   * Handles meal selection and regenerates the protocol
   * @param {MealType} mealType - Type of meal being selected
   * @param {string} mealKey - Key identifier for the selected meal
   */
  const handleMealSelection = (mealType: MealType, mealKey: string) => {
    if (!protocol || !progress) return;
    
    const selectedMeals = { ...progress.selectedMeals, [mealType]: mealKey };
    updateSelectedMeals(protocol.date, selectedMeals);
    
    // Regenerate protocol with the new meal
    const newProtocol = generateDayProtocol(currentDate, selectedMeals, undefined, recipes);
    setProtocol(newProtocol);
    
    // Update progress with new selections
    updateProgress({ selectedMeals });
  };

  /**
   * Handles activity selection and regenerates the protocol
   * @param {string} activity - Selected activity identifier
   */
  const handleActivitySelection = (activity: string) => {
    if (!protocol || !progress) return;
    
    updateSelectedActivity(protocol.date, activity);
    
    // Regenerate protocol with the new activity
    const newProtocol = generateDayProtocol(currentDate, progress.selectedMeals, activity, recipes);
    setProtocol(newProtocol);
    
    // Update progress with the new activity
    updateProgress({ selectedActivity: activity });
  };

  /**
   * Opens the meal selector modal for a specific meal type
   * @param {MealType} type - Type of meal to select
   */
  const openMealSelector = (type: MealType) => {
    setMealSelector({ isOpen: true, type });
  };

  /**
   * Closes the meal selector modal
   */
  const closeMealSelector = () => {
    setMealSelector({ isOpen: false, type: null });
  };

  /**
   * Opens the activity selector modal
   */
  const openActivitySelector = () => {
    setActivitySelector(true);
  };

  /**
   * Closes the activity selector modal
   */
  const closeActivitySelector = () => {
    setActivitySelector(false);
  };

  /**
   * Navigates to the previous or next day
   * @param {'prev' | 'next'} direction - Direction to navigate
   */
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const isToday = currentDate.toDateString() === new Date().toDateString();

  if (!protocol || !progress) return null;

  /**
   * Maps Dashboard meal type to Recipe meal type
   * @param {MealType} dashboardType - Dashboard meal type
   * @returns {Recipe['type']} Recipe meal type
   */
  const mapToRecipeType = (dashboardType: MealType): Recipe['type'] => {
    if (dashboardType === 'colation') return 'collation';
    return dashboardType;
  };

  /**
   * Combines static meals with custom recipes by meal type
   * @param {MealType} mealType - Type of meal to get options for
   * @returns {Record<string, Meal>} Combined meal options
   */
  const getCombinedMealsForType = (mealType: MealType): Record<string, Meal> => {
    let staticMeals: Record<string, Meal> = {};
    
    if (mealType === 'colation') {
      staticMeals = { ...COLLATIONS };
    } else if (mealType === 'petitDejeuner') {
      // Pour les petits déjeuners, utilise le petit déjeuner standard
      staticMeals = { 'petit_dejeuner_standard': PETIT_DEJEUNER };
    } else {
      staticMeals = { ...PLATS };
    }

    // Add custom recipes of the same type
    const customRecipes: Record<string, Meal> = {};
    const recipeType = mapToRecipeType(mealType);
    recipes
      .filter(recipe => recipe.type === recipeType)
      .forEach(recipe => {
        customRecipes[recipe.id] = {
          name: recipe.name,
          kcal: recipe.kcal,
          P: recipe.P,
          L: recipe.L,
          G: recipe.G,
          ingredients: recipe.ingredients.map(ing => 
            `${ing.name} ${ing.quantity}${ing.unit}`
          ).join(' + ')
        };
      });

    return { ...staticMeals, ...customRecipes };
  };

  /**
   * Gets the current meal key for a specific meal type
   * @param {MealType} mealType - Type of meal to get key for
   * @returns {string} Current meal key
   */
  const getCurrentMealKey = (mealType: MealType): string => {
    if (mealType === 'colation') {
      return progress.selectedMeals?.colation || 'Fruit + amandes';
    }
    
    if (mealType === 'petitDejeuner') {
      return progress.selectedMeals?.petitDejeuner || protocol.petitDejeuner.name;
    }
    
    const mealName = protocol[mealType].name;
    const allMealsForType = getCombinedMealsForType(mealType);
    
    // First check if it's a custom recipe
    const customRecipeKey = Object.keys(allMealsForType).find(key => 
      allMealsForType[key].name === mealName
    );
    
    if (customRecipeKey) {
      return customRecipeKey;
    }
    
    // Fallback to static meals
    return Object.keys(PLATS).find(key => PLATS[key].name === mealName) || Object.keys(PLATS)[0];
  };

  /**
   * Calculates actual macros based on checked items only
   * @returns {Object} Object containing kcal, P, L, G values for consumed items
   */
  const calculateActualMacros = () => {
    if (!protocol || !progress) return { kcal: 0, P: 0, L: 0, G: 0 };

    const totals = { kcal: 0, P: 0, L: 0, G: 0 };

    // Breakfast
    if (progress.petitDejeuner) {
      totals.kcal += protocol.petitDejeuner.kcal;
      totals.P += protocol.petitDejeuner.P;
      totals.L += protocol.petitDejeuner.L;
      totals.G += protocol.petitDejeuner.G;
    }

    // Lunch
    if (progress.dejeuner) {
      totals.kcal += protocol.dejeuner.kcal;
      totals.P += protocol.dejeuner.P;
      totals.L += protocol.dejeuner.L;
      totals.G += protocol.dejeuner.G;
    }

    // Dinner
    if (progress.diner) {
      totals.kcal += protocol.diner.kcal;
      totals.P += protocol.diner.P;
      totals.L += protocol.diner.L;
      totals.G += protocol.diner.G;
    }

    // Collation
    if (progress.colation) {
      totals.kcal += protocol.colation.kcal;
      totals.P += protocol.colation.P;
      totals.L += protocol.colation.L;
      totals.G += protocol.colation.G;
    }

    // Clear Whey
    if (progress.clearWhey) {
      totals.kcal += protocol.clearWhey.kcal;
      totals.P += protocol.clearWhey.P;
      totals.L += protocol.clearWhey.L;
      totals.G += protocol.clearWhey.G;
    }

    // Supplements
    progress.complements.forEach((isCompleted, index) => {
      if (isCompleted && protocol.complements[index]) {
        const complementName = protocol.complements[index];
        const macros = COMPLEMENTS_MACROS[complementName as keyof typeof COMPLEMENTS_MACROS];
        if (macros) {
          totals.kcal += macros.kcal;
          totals.P += macros.P;
          totals.L += macros.L;
          totals.G += macros.G;
        }
      }
    });

    return totals;
  };

  /**
   * Calculates calories burned from completed activities
   */
  const getCaloriesBurnedFromSport = (): number => {
    if (!progress?.sport || !protocol?.sport || !userProfile) {
      return 0;
    }

    const met = getActivityMet(protocol.sport);
    if (!met) return 0;

    // Calculate calories burned for 45 minutes (default duration)
    return calculateCaloriesBurned(protocol.sport, userProfile.poids, 45);
  };

  /**
   * Gets the current nutritional objectives (from user profile or default values)
   * Includes bonus calories from completed sports activities
   */
  const getCurrentObjectives = () => {
    if (userProfile) {
      const baseCalories = userProfile.calories_cibles;
      const bonusCalories = getCaloriesBurnedFromSport();
      
      return {
        KCAL: baseCalories + bonusCalories,
        P: userProfile.macros_cibles.proteines,
        L: userProfile.macros_cibles.lipides,
        G: userProfile.macros_cibles.glucides
      };
    }
    
    // Return zero values if no profile
    return {
      KCAL: 0,
      P: 0,
      L: 0,
      G: 0
    };
  };

  /**
   * Gets the calories label with sport bonus information
   */
  const getCaloriesLabel = (): string => {
    const bonusCalories = getCaloriesBurnedFromSport();
    return bonusCalories > 0 ? `Calories (+${Math.round(bonusCalories)} sport)` : 'Calories';
  };

  // Check if it's Sunday to display the summary
  const isSunday = currentDate.getDay() === 0;

  /**
   * Calculates the date range for the current week (Monday to Sunday)
   */
  const getWeekDateRange = (currentDate: Date) => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return { startOfWeek, endOfWeek };
  };

  /**
   * Adds macros from a meal to the running totals
   */
  const addMealMacros = (meal: MealWithMacros, totals: WeeklyTotals) => {
    totals.calories += meal.kcal;
    totals.proteins += meal.P;
    totals.lipids += meal.L;
    totals.carbs += meal.G;
    totals.completedMeals++;
  };

  /**
   * Processes macros for all completed meals in a day
   */
  const processDayMeals = (dayProgress: DayProgress, dayProtocol: DayProtocol, totals: WeeklyTotals) => {
    const mealTypes = [
      { key: 'petitDejeuner', meal: dayProtocol.petitDejeuner },
      { key: 'dejeuner', meal: dayProtocol.dejeuner },
      { key: 'diner', meal: dayProtocol.diner },
      { key: 'colation', meal: dayProtocol.colation },
      { key: 'clearWhey', meal: dayProtocol.clearWhey }
    ];

    mealTypes.forEach(({ key, meal }) => {
      if (dayProgress[key as keyof DayProgress]) {
        addMealMacros(meal, totals);
      }
    });
  };

  /**
   * Processes activities and complements for a day
   */
  const processDayActivitiesAndComplements = (
    dayProgress: DayProgress, 
    dayProtocol: DayProtocol, 
    totals: WeeklyTotals
  ) => {
    // Count completed activities
    if (dayProgress.sport) {
      totals.completedActivities++;
      totals.activityTypes.add(dayProtocol.sport);
    }
    
    // Count completed complements
    totals.completedComplements += dayProgress.complements.filter(Boolean).length;
  };

  /**
   * Calculates weekly targets based on user profile
   */
  const getWeeklyTargets = () => {
    if (!userProfile) return { calories: 0, proteins: 0, lipids: 0, carbs: 0 };
    
    return {
      calories: userProfile.calories_cibles * 7,
      proteins: userProfile.macros_cibles.proteines * 7,
      lipids: userProfile.macros_cibles.lipides * 7,
      carbs: userProfile.macros_cibles.glucides * 7
    };
  };

  // Real data calculation for weekly summary
  const getWeeklySummaryData = () => {
    const { startOfWeek, endOfWeek } = getWeekDateRange(currentDate);
    
    // Initialize totals
    const totals: WeeklyTotals = {
      calories: 0,
      proteins: 0,
      lipids: 0,
      carbs: 0,
      completedActivities: 0,
      completedMeals: 0,
      completedComplements: 0,
      plannedComplements: 0,
      activityTypes: new Set<string>()
    };

    // Calculate for each day of the week (Monday to Sunday)
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const dayProgress = getDayProgress(dateString);
      
      // Get the protocol for this day (even if no progress exists)
      const customMeals = dayProgress?.selectedMeals;
      const customActivity = dayProgress?.selectedActivity;
      const dayProtocol = generateDayProtocol(date, customMeals, customActivity, recipes);
      
      // Count planned complements for this day
      totals.plannedComplements += dayProtocol.complements.length;
      
      // Only calculate consumed macros if day has progress
      if (dayProgress) {
        processDayMeals(dayProgress, dayProtocol, totals);
        processDayActivitiesAndComplements(dayProgress, dayProtocol, totals);
      }
    }

    const weeklyTargets = getWeeklyTargets();

    return {
      week: `${startOfWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`,
      objectives: {
        calories: { achieved: Math.round(totals.calories), target: weeklyTargets.calories },
        proteins: { achieved: Math.round(totals.proteins), target: weeklyTargets.proteins },
        lipids: { achieved: Math.round(totals.lipids), target: weeklyTargets.lipids },
        carbs: { achieved: Math.round(totals.carbs), target: weeklyTargets.carbs },
      },
      activities: {
        planned: 7, // 1 activity per day max
        completed: totals.completedActivities,
        types: Array.from(totals.activityTypes)
      },
      meals: {
        planned: 35, // 5 meals x 7 days
        completed: totals.completedMeals
      },
      complements: {
        planned: totals.plannedComplements,
        completed: totals.completedComplements
      }
    };
  };

  const actualMacros = calculateActualMacros();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Date Navigation */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {currentDate.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </div>
            {isToday && (
              <div className="text-xs text-emerald-600 font-medium">Aujourd'hui</div>
            )}
          </div>

          <button
            onClick={() => navigateDate('next')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Weekly summary button (displayed only on Sundays) */}
        {isSunday && (
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Récapitulatif de la semaine</h3>
                <p className="text-sm opacity-90">Consultez vos performances</p>
              </div>
              <button
                onClick={() => setWeeklySummaryOpen(true)}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Trophy className="h-4 w-4" />
                Voir
              </button>
            </div>
          </div>
        )}

        {/* Profile Banner - shown if no user profile */}
        {!profileLoading && !userProfile && (
          <ProfileBanner onOpenProfile={onOpenProfile} />
        )}

        {/* Macros Overview */}
        <div className="grid grid-cols-2 gap-4">
          <MacroCard
            label={getCaloriesLabel()}
            value={actualMacros.kcal}
            objective={getCurrentObjectives().KCAL}
            unit=""
            color="bg-orange-500"
          />
          <MacroCard
            label="Protéines"
            value={actualMacros.P}
            objective={getCurrentObjectives().P}
            unit="g"
            color="bg-emerald-500"
          />
          <MacroCard
            label="Lipides"
            value={actualMacros.L}
            objective={getCurrentObjectives().L}
            unit="g"
            color="bg-blue-500"
          />
          <MacroCard
            label="Glucides"
            value={actualMacros.G}
            objective={getCurrentObjectives().G}
            unit="g"
            color="bg-purple-500"
          />
        </div>

        {/* Meals */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Repas du jour</h2>
          
          <MealCard
            key={`petit-dejeuner-${progress.petitDejeuner}`}
            meal={protocol.petitDejeuner}
            completed={progress.petitDejeuner}
            onToggle={() => updateProgress({ petitDejeuner: !progress.petitDejeuner })}
            canChange={true}
            onChangeClick={() => openMealSelector('petitDejeuner')}
          />
          
          <MealCard
            key={`dejeuner-${progress.dejeuner}`}
            meal={protocol.dejeuner}
            completed={progress.dejeuner}
            onToggle={() => updateProgress({ dejeuner: !progress.dejeuner })}
            canChange={true}
            onChangeClick={() => openMealSelector('dejeuner')}
          />
          
          <MealCard
            key={`diner-${progress.diner}`}
            meal={protocol.diner}
            completed={progress.diner}
            onToggle={() => updateProgress({ diner: !progress.diner })}
            canChange={true}
            onChangeClick={() => openMealSelector('diner')}
          />
          
          <MealCard
            key={`colation-${progress.colation}`}
            meal={protocol.colation}
            completed={progress.colation}
            onToggle={() => updateProgress({ colation: !progress.colation })}
            canChange={true}
            onChangeClick={() => openMealSelector('colation')}
          />
          
          <MealCard
            key={`clear-whey-${progress.clearWhey}`}
            meal={protocol.clearWhey}
            completed={progress.clearWhey}
            onToggle={() => updateProgress({ clearWhey: !progress.clearWhey })}
          />
        </div>

        {/* Sport */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Sport</h2>
          <SportCard
            key={`sport-${progress.sport}`}
            activity={protocol.sport}
            completed={progress.sport}
            onToggle={() => updateProgress({ sport: !progress.sport })}
            onChangeClick={openActivitySelector}
          />
        </div>

        {/* Supplements */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Compléments</h2>
          <ComplementsCard
            complements={protocol.complements}
            completedList={progress.complements}
            onToggle={(index) => {
              const newComplements = [...progress.complements];
              newComplements[index] = !newComplements[index];
              updateProgress({ complements: newComplements });
            }}
          />
        </div>
      </div>

      {/* Meal Selector Modal */}
      <MealSelector
        isOpen={mealSelector.isOpen}
        onClose={closeMealSelector}
        title={(() => {
          if (mealSelector.type === 'petitDejeuner') return 'Choisir le petit déjeuner';
          if (mealSelector.type === 'dejeuner') return 'Choisir le déjeuner';
          if (mealSelector.type === 'diner') return 'Choisir le dîner';
          return 'Choisir la collation';
        })()}
        meals={mealSelector.type ? getCombinedMealsForType(mealSelector.type) : {}}
        selectedMeal={mealSelector.type ? getCurrentMealKey(mealSelector.type) : ''}
        onSelectMeal={(mealKey: string) => {
          if (mealSelector.type) {
            handleMealSelection(mealSelector.type, mealKey);
          }
        }}
        mealType={mealSelector.type || undefined}
        onCreateNew={() => {
          if (mealSelector.type) {
            setDefaultMealType(mapToRecipeType(mealSelector.type));
          }
          setRecipeManagerOpen(true);
        }}
      />

      {/* Activity Selector Modal */}
      <ActivitySelector
        isOpen={activitySelector}
        onClose={closeActivitySelector}
        selectedActivity={protocol?.sport || ''}
        onSelectActivity={handleActivitySelection}
      />

      {/* Weekly Summary Modal */}
      <WeeklySummary
        isOpen={weeklySummaryOpen}
        onClose={() => setWeeklySummaryOpen(false)}
        weeklyData={getWeeklySummaryData()}
      />
      {/* Recipe Manager Modal */}
      <RecipeManager
        isOpen={recipeManagerOpen}
        onClose={() => {
          setRecipeManagerOpen(false);
          setDefaultMealType(undefined);
        }}
        defaultMealType={defaultMealType}
      />
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;