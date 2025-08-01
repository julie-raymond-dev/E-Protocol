import React from 'react';
import { Check, Pill } from 'lucide-react';

interface ComplementsCardProps {
  complements: string[];
  completedList: boolean[];
  onToggle: (index: number) => void;
}

export default function ComplementsCard({ complements, completedList, onToggle }: ComplementsCardProps) {
  const completedCount = completedList.filter(Boolean).length;
  const totalCount = complements.length;

  return (
    <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-purple-100">
            <Pill className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Compléments</h3>
            <p className="text-sm text-gray-600">{completedCount}/{totalCount} pris</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {complements.map((complement, index) => (
          <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
            <button
              onClick={() => onToggle(index)}
              className={`p-1 rounded-full transition-all duration-200 ${
                completedList[index]
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-400 hover:bg-emerald-100 hover:text-emerald-600'
              }`}
            >
              <Check className="h-4 w-4" />
            </button>
            <span className={`text-sm ${
              completedList[index] ? 'text-gray-500 line-through' : 'text-gray-700'
            }`}>
              {complement}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}