import { X, Check, Plus } from 'lucide-react';
import { Meal } from '../types';
import { roundTo } from '../utils/numberUtils';

interface MealSelectorProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly meals: Record<string, Meal>;
  readonly selectedMeal: string;
  readonly onSelectMeal: (mealKey: string) => void;
  readonly mealType?: 'petitDejeuner' | 'dejeuner' | 'diner' | 'colation';
  readonly onCreateNew?: () => void;
}

export default function MealSelector({ 
  isOpen, 
  onClose, 
  title, 
  meals, 
  selectedMeal, 
  onSelectMeal,
  mealType,
  onCreateNew
}: MealSelectorProps) {
  if (!isOpen) return null;

  const getMealTypeName = (type: string) => {
    switch (type) {
      case 'petitDejeuner': return 'petit déjeuner';
      case 'dejeuner': return 'déjeuner';
      case 'diner': return 'dîner';
      case 'colation': return 'collation';
      default: return 'repas';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white rounded-t-2xl w-full h-[90vh] flex flex-col">
        <div className="sticky top-0 bg-white border-b px-4 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-8" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          {/* Bouton pour créer un nouveau repas */}
          {onCreateNew && mealType && (
            <button
              onClick={() => {
                onCreateNew();
                onClose();
              }}
              className="w-full p-4 rounded-xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 text-emerald-600 hover:text-emerald-700"
            >
              <div className="flex items-center justify-center gap-2">
                <Plus className="h-5 w-5" />
                <span className="font-medium">
                  Créer un nouveau {getMealTypeName(mealType)}
                </span>
              </div>
            </button>
          )}
          
          {Object.entries(meals).map(([key, meal]) => (
            <button
              key={key}
              onClick={() => {
                onSelectMeal(key);
                onClose();
              }}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedMeal === key
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{meal.name}</h3>
                {selectedMeal === key && (
                  <div className="p-1 rounded-full bg-emerald-600">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              
              {meal.ingredients && (
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  {meal.ingredients}
                </p>
              )}
              
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center">
                  <div className="text-sm font-bold text-orange-600">{roundTo(meal.kcal, 1)}</div>
                  <div className="text-xs text-gray-500">kcal</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-emerald-600">{roundTo(meal.P, 1)}g</div>
                  <div className="text-xs text-gray-500">P</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-blue-600">{roundTo(meal.L, 1)}g</div>
                  <div className="text-xs text-gray-500">L</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-600">{roundTo(meal.G, 1)}g</div>
                  <div className="text-xs text-gray-500">G</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}