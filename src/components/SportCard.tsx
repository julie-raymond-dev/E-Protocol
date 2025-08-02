import { useState, useEffect } from 'react';
import { Check, Dumbbell, ChevronDown } from 'lucide-react';
import { calculateCaloriesBurned, getActivityMet } from '../data/activities-met';
import { userProfileService } from '../services/userProfileService';
import { UserProfile } from '../types';

interface SportCardProps {
  readonly activity: string;
  readonly completed: boolean;
  readonly onToggle: () => void;
  readonly onChangeClick?: () => void;
}

export default function SportCard({ activity, completed, onToggle, onChangeClick }: SportCardProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await userProfileService.getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      }
    };

    loadUserProfile();
  }, []);

  // Calculate calories burned for this activity
  const getCaloriesInfo = () => {
    const met = getActivityMet(activity);
    if (!met) return { calories: 0, metValue: 0 };

    // Use user weight if available, otherwise default to 60kg
    const weight = userProfile?.poids || 60;
    const calories = calculateCaloriesBurned(activity, weight, 45);
    
    return { calories, metValue: met };
  };

  const { calories, metValue } = getCaloriesInfo();
  
  // Handle click on the card (but not on specific buttons)
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onToggle();
  };

  // Handle keyboard interaction
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };
  
  return (
    <div 
      className={`bg-white rounded-xl p-4 border-2 transition-all duration-200 cursor-pointer ${
        completed ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 hover:border-emerald-200'
      }`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="switch"
      tabIndex={0}
      aria-checked={completed}
      aria-label={`${completed ? 'Désactiver' : 'Activer'} l'activité ${activity}`}
    >
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
            <p className="text-sm text-gray-600">
              {calories > 0 ? `~${calories} kcal (45 min)` : 'Activité physique'}
              {metValue > 0 && (
                <span className="text-xs text-gray-500 ml-1">• MET {metValue}</span>
              )}
            </p>
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