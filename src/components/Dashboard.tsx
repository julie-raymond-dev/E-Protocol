import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { generateDayProtocol } from '../utils/protocolGenerator';
import { getDayProgress, saveDayProgress, updateSelectedMeals, updateSelectedActivity } from '../utils/storage';
import { DayProtocol, DayProgress } from '../types';
import { OBJECTIVES, PLATS, COLLATIONS, COMPLEMENTS_MACROS } from '../data/protocol';
import MacroCard from './MacroCard';
import MealCard from './MealCard';
import SportCard from './SportCard';
import ComplementsCard from './ComplementsCard';
import MealSelector from './MealSelector';
import ActivitySelector from './ActivitySelector';
import WeeklySummary from './WeeklySummary';

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [protocol, setProtocol] = useState<DayProtocol>();
  const [progress, setProgress] = useState<DayProgress>();
  const [mealSelector, setMealSelector] = useState<{
    isOpen: boolean;
    type: 'dejeuner' | 'diner' | 'colation' | null;
  }>({ isOpen: false, type: null });
  const [activitySelector, setActivitySelector] = useState(false);
  const [weeklySummaryOpen, setWeeklySummaryOpen] = useState(false);

  useEffect(() => {
    const existingProgress = getDayProgress(currentDate.toISOString().split('T')[0]);
    const customMeals = existingProgress?.selectedMeals;
    const customActivity = existingProgress?.selectedActivity;
    
    const dayProtocol = generateDayProtocol(currentDate, customMeals, customActivity);
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
  }, [currentDate]);

  const updateProgress = (updates: Partial<DayProgress>) => {
    if (!progress) return;
    
    const newProgress = { ...progress, ...updates };
    setProgress(newProgress);
    saveDayProgress(newProgress);
  };

  const handleMealSelection = (mealType: 'dejeuner' | 'diner' | 'colation', mealKey: string) => {
    if (!protocol || !progress) return;
    
    const selectedMeals = { ...progress.selectedMeals, [mealType]: mealKey };
    updateSelectedMeals(protocol.date, selectedMeals);
    
    // Régénérer le protocole avec le nouveau plat
    const newProtocol = generateDayProtocol(currentDate, selectedMeals);
    setProtocol(newProtocol);
    
    // Mettre à jour le progress avec les nouvelles sélections
    updateProgress({ selectedMeals });
  };

  const handleActivitySelection = (activity: string) => {
    if (!protocol || !progress) return;
    
    updateSelectedActivity(protocol.date, activity);
    
    // Régénérer le protocole avec la nouvelle activité
    const newProtocol = generateDayProtocol(currentDate, progress.selectedMeals, activity);
    setProtocol(newProtocol);
    
    // Mettre à jour le progress avec la nouvelle activité
    updateProgress({ selectedActivity: activity });
  };

  const openMealSelector = (type: 'dejeuner' | 'diner' | 'colation') => {
    setMealSelector({ isOpen: true, type });
  };

  const closeMealSelector = () => {
    setMealSelector({ isOpen: false, type: null });
  };

  const openActivitySelector = () => {
    setActivitySelector(true);
  };

  const closeActivitySelector = () => {
    setActivitySelector(false);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const isToday = currentDate.toDateString() === new Date().toDateString();

  if (!protocol || !progress) return null;

  const getCurrentMealKey = (mealType: 'dejeuner' | 'diner' | 'colation'): string => {
    if (mealType === 'colation') {
      return progress.selectedMeals?.colation || 'Fruit + amandes';
    }
    
    const mealName = protocol[mealType].name;
    return Object.keys(PLATS).find(key => PLATS[key].name === mealName) || Object.keys(PLATS)[0];
  };

  // Calculer les macros réelles en ne prenant en compte que les sources cochées
  const calculateActualMacros = () => {
    if (!protocol || !progress) return { kcal: 0, P: 0, L: 0, G: 0 };

    const totals = { kcal: 0, P: 0, L: 0, G: 0 };

    // Petit-déjeuner
    if (progress.petitDejeuner) {
      totals.kcal += protocol.petitDejeuner.kcal;
      totals.P += protocol.petitDejeuner.P;
      totals.L += protocol.petitDejeuner.L;
      totals.G += protocol.petitDejeuner.G;
    }

    // Déjeuner
    if (progress.dejeuner) {
      totals.kcal += protocol.dejeuner.kcal;
      totals.P += protocol.dejeuner.P;
      totals.L += protocol.dejeuner.L;
      totals.G += protocol.dejeuner.G;
    }

    // Dîner
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

    // Compléments
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

  // Vérifier si c'est dimanche pour afficher le récapitulatif
  const isSunday = currentDate.getDay() === 0;

  // Données simulées pour le récapitulatif hebdomadaire
  const getWeeklySummaryData = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return {
      week: `${startOfWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`,
      objectives: {
        calories: { achieved: 1650, target: OBJECTIVES.KCAL },
        proteins: { achieved: 95, target: OBJECTIVES.P },
        lipids: { achieved: 45, target: OBJECTIVES.L },
        carbs: { achieved: 210, target: OBJECTIVES.G },
      },
      activities: {
        planned: 5,
        completed: 4,
        types: ['Bodypump', 'Yoga', 'Cardio-musculation', 'Pilates']
      },
      meals: {
        planned: 35, // 5 repas x 7 jours
        completed: 32
      },
      complements: {
        planned: 42, // 6 compléments x 7 jours
        completed: 38
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
        {/* Bouton récapitulatif hebdomadaire (affiché uniquement le dimanche) */}
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

        {/* Macros Overview */}
        <div className="grid grid-cols-2 gap-4">
          <MacroCard
            label="Calories"
            value={actualMacros.kcal}
            objective={OBJECTIVES.KCAL}
            unit=""
            color="bg-orange-500"
          />
          <MacroCard
            label="Protéines"
            value={actualMacros.P}
            objective={OBJECTIVES.P}
            unit="g"
            color="bg-emerald-500"
          />
          <MacroCard
            label="Lipides"
            value={actualMacros.L}
            objective={OBJECTIVES.L}
            unit="g"
            color="bg-blue-500"
          />
          <MacroCard
            label="Glucides"
            value={actualMacros.G}
            objective={OBJECTIVES.G}
            unit="g"
            color="bg-purple-500"
          />
        </div>

        {/* Meals */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Repas du jour</h2>
          
          <MealCard
            meal={protocol.petitDejeuner}
            completed={progress.petitDejeuner}
            onToggle={() => updateProgress({ petitDejeuner: !progress.petitDejeuner })}
          />
          
          <MealCard
            meal={protocol.dejeuner}
            completed={progress.dejeuner}
            onToggle={() => updateProgress({ dejeuner: !progress.dejeuner })}
            canChange={true}
            onChangeClick={() => openMealSelector('dejeuner')}
          />
          
          <MealCard
            meal={protocol.diner}
            completed={progress.diner}
            onToggle={() => updateProgress({ diner: !progress.diner })}
            canChange={true}
            onChangeClick={() => openMealSelector('diner')}
          />
          
          <MealCard
            meal={protocol.colation}
            completed={progress.colation}
            onToggle={() => updateProgress({ colation: !progress.colation })}
            canChange={true}
            onChangeClick={() => openMealSelector('colation')}
          />
          
          <MealCard
            meal={protocol.clearWhey}
            completed={progress.clearWhey}
            onToggle={() => updateProgress({ clearWhey: !progress.clearWhey })}
          />
        </div>

        {/* Sport */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Sport</h2>
          <SportCard
            activity={protocol.sport}
            completed={progress.sport}
            onToggle={() => updateProgress({ sport: !progress.sport })}
            onChangeClick={openActivitySelector}
          />
        </div>

        {/* Compléments */}
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
        title={
          mealSelector.type === 'dejeuner' ? 'Choisir le déjeuner' :
          mealSelector.type === 'diner' ? 'Choisir le dîner' :
          'Choisir la collation'
        }
        meals={mealSelector.type === 'colation' ? COLLATIONS : PLATS}
        selectedMeal={mealSelector.type ? getCurrentMealKey(mealSelector.type) : ''}
        onSelectMeal={(mealKey) => {
          if (mealSelector.type) {
            handleMealSelection(mealSelector.type, mealKey);
          }
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
    </div>
  );
}