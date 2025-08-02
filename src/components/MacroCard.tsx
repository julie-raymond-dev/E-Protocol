import { roundTo } from '../utils/numberUtils';

/**
 * Props for the MacroCard component
 */
interface MacroCardProps {
  readonly label: string;
  readonly value: number;
  readonly objective: number;
  readonly unit: string;
  readonly color: string;
}

/**
 * Macro card component displaying macronutrient progress
 * @param {MacroCardProps} props - Component props
 * @param {string} props.label - Label for the macronutrient
 * @param {number} props.value - Current value achieved
 * @param {number} props.objective - Target objective value
 * @param {string} props.unit - Unit of measurement
 * @param {string} props.color - Color theme for the card
 * @returns {JSX.Element} Macro card component with progress bar
 */
export default function MacroCard({ label, value, objective, unit, color }: MacroCardProps) {
  // Handle cases where objective is 0 (no profile set)
  const hasObjective = objective > 0;
  const percentage = hasObjective ? roundTo((value / objective) * 100, 1) : 0;
  const hasProgress = value > 0;

  // Determine badge styling based on percentage
  let badgeClasses = 'text-xs px-2 py-1 rounded-full ';
  if (!hasObjective) {
    badgeClasses += 'bg-gray-100 text-gray-400';
  } else if (percentage > 100) {
    badgeClasses += 'bg-red-100 text-red-700';
  } else if (percentage === 100) {
    badgeClasses += 'bg-emerald-100 text-emerald-700';
  } else {
    badgeClasses += 'bg-gray-200 text-gray-600';
  }

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={badgeClasses}>
          {hasObjective ? `${percentage}%` : '0%'}
        </span>
      </div>
      
      <div className="mb-2">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">{roundTo(value, 1)}</span>
          <span className="text-sm text-gray-500">
            / {hasObjective ? roundTo(objective, 1) : '0'}{unit}
          </span>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            !hasProgress || !hasObjective 
              ? 'bg-gray-300'
              : percentage > 100
                ? 'bg-red-500'
                : percentage === 100
                  ? 'bg-emerald-500'
                  : color
          }`}
          style={{ 
            width: hasObjective && hasProgress ? `${Math.min(percentage, 100)}%` : '0%' 
          }}
        ></div>
      </div>
    </div>
  );
}