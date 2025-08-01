import React from 'react';

interface MacroCardProps {
  label: string;
  value: number;
  objective: number;
  unit: string;
  color: string;
}

export default function MacroCard({ label, value, objective, unit, color }: MacroCardProps) {
  const percentage = Math.round((value / objective) * 100);
  const isComplete = percentage >= 100;

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${
          isComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
        }`}>
          {percentage}%
        </span>
      </div>
      
      <div className="mb-2">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">{Math.round(value)}</span>
          <span className="text-sm text-gray-500">/ {objective}{unit}</span>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}