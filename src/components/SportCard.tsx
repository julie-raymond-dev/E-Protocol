import React from 'react';
import { Check, Dumbbell, ChevronDown } from 'lucide-react';

interface SportCardProps {
  activity: string;
  completed: boolean;
  onToggle: () => void;
  onChangeClick?: () => void;
}

export default function SportCard({ activity, completed, onToggle, onChangeClick }: SportCardProps) {
  return (
    <div className={`bg-white rounded-xl p-4 border-2 transition-all duration-200 ${
      completed ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 hover:border-emerald-200'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${
            completed ? 'bg-emerald-100' : 'bg-blue-100'
          }`}>
            <Dumbbell className={`h-5 w-5 ${
              completed ? 'text-emerald-600' : 'text-blue-600'
            }`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{activity}</h3>
              {onChangeClick && (
                <button
                  onClick={onChangeClick}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600">Activité UCPA</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
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
    </div>
  );
}