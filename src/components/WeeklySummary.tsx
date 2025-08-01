import { Calendar, Target, Award, TrendingUp, TrendingDown } from 'lucide-react';

interface WeeklySummaryData {
  week: string;
  objectives: {
    calories: { achieved: number; target: number };
    proteins: { achieved: number; target: number };
    lipids: { achieved: number; target: number };
    carbs: { achieved: number; target: number };
  };
  activities: {
    planned: number;
    completed: number;
    types: string[];
  };
  meals: {
    planned: number;
    completed: number;
  };
  complements: {
    planned: number;
    completed: number;
  };
}

interface WeeklySummaryProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly weeklyData: WeeklySummaryData;
}

export default function WeeklySummary({ isOpen, onClose, weeklyData }: WeeklySummaryProps) {
  if (!isOpen) return null;

  const calculatePercentage = (achieved: number, target: number) => 
    Math.round((achieved / target) * 100);

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 90) return <Award className="h-5 w-5 text-green-600" />;
    if (percentage >= 70) return <TrendingUp className="h-5 w-5 text-yellow-600" />;
    return <TrendingDown className="h-5 w-5 text-red-600" />;
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const macros = [
    { label: 'Calories', key: 'calories', unit: 'kcal' },
    { label: 'Protéines', key: 'proteins', unit: 'g' },
    { label: 'Lipides', key: 'lipids', unit: 'g' },
    { label: 'Glucides', key: 'carbs', unit: 'g' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-emerald-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Récapitulatif Hebdomadaire</h2>
              <p className="text-sm text-gray-600">{weeklyData.week}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-8"  style={{ maxHeight: 'calc(90vh - 100px)' }}>
          {/* Objectifs Nutritionnels */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-600" />
              Objectifs Nutritionnels
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {macros.map(({ label, key, unit }) => {
                const data = weeklyData.objectives[key as keyof typeof weeklyData.objectives];
                const percentage = calculatePercentage(data.achieved, data.target);
                return (
                  <div key={key} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      {getStatusIcon(percentage)}
                    </div>
                    <div className="mb-3">
                      <div className="text-2xl font-bold text-gray-900">
                        {Math.round(data.achieved)}
                      </div>
                      <div className="text-sm text-gray-500">
                        / {data.target} {unit}
                      </div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full border text-center ${getStatusColor(percentage)}`}>
                      {percentage}% atteint
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activités */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Activités Physiques
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-blue-900">Sessions Réalisées</h4>
                  <div className="text-3xl font-bold text-blue-600">
                    {weeklyData.activities.completed}/{weeklyData.activities.planned}
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3">
                  <div
                    className="h-3 bg-blue-600 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((weeklyData.activities.completed / weeklyData.activities.planned) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-6">
                <h4 className="font-semibold text-purple-900 mb-4">Types d'Activités</h4>
                <div className="space-y-2">
                  {weeklyData.activities.types.map((activity) => (
                    <div key={activity} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-sm text-purple-800">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Suivi Alimentaire */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Suivi Alimentaire
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-green-900">Repas</h4>
                  <div className="text-3xl font-bold text-green-600">
                    {weeklyData.meals.completed}/{weeklyData.meals.planned}
                  </div>
                </div>
                <div className="w-full bg-green-200 rounded-full h-3">
                  <div
                    className="h-3 bg-green-600 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((weeklyData.meals.completed / weeklyData.meals.planned) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-orange-900">Compléments</h4>
                  <div className="text-3xl font-bold text-orange-600">
                    {weeklyData.complements.completed}/{weeklyData.complements.planned}
                  </div>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-3">
                  <div
                    className="h-3 bg-orange-600 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((weeklyData.complements.completed / weeklyData.complements.planned) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Badge de Réussite */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-emerald-100 text-emerald-800 px-6 py-3 rounded-full">
              <Award className="h-6 w-6" />
              <span className="font-semibold">
                Excellent travail cette semaine ! 🏆
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
