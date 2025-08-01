import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Meal } from '../types';

interface MealCardProps {
  meal: Meal;
  completed: boolean;
  onToggle: () => void;
  canChange?: boolean;
  onChangeClick?: () => void;
}

export default function MealCard({ meal, completed, onToggle, canChange, onChangeClick }: MealCardProps) {
  return (
    <div className={`bg-white rounded-xl p-4 border-2 transition-all duration-200 ${
      completed ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 hover:border-emerald-200'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 text-lg">{meal.name}</h3>
            {canChange && (
              <button
                onClick={onChangeClick}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`p-2 rounded-full transition-all duration-200 ${
            completed
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-200 text-gray-400 hover:bg-emerald-100 hover:text-emerald-600'
          }`}
        >
          <Check className="h-5 w-5" />
        </button>
      </div>

      {meal.ingredients && (
        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{meal.ingredients}</p>
      )}

      <div className="grid grid-cols-4 gap-2">
        <div className="text-center">
          <div className="text-lg font-bold text-orange-600">{meal.kcal}</div>
          <div className="text-xs text-gray-500">kcal</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-emerald-600">{meal.P}g</div>
          <div className="text-xs text-gray-500">P</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{meal.L}g</div>
          <div className="text-xs text-gray-500">L</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">{meal.G}g</div>
          <div className="text-xs text-gray-500">G</div>
        </div>
      </div>
    </div>
  );
}