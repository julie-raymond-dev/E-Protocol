import { useState, useEffect } from 'react';
import { X, Dumbbell, Check } from 'lucide-react';
import { ACTIVITIES_BY_CATEGORY, calculateCaloriesBurned, getActivityMet } from '../data/activities-met';
import { userProfileService } from '../services/userProfileService';
import { UserProfile } from '../types';

interface ActivitySelectorProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly selectedActivity: string;
  readonly onSelectActivity: (activity: string) => void;
}

export default function ActivitySelector({ 
  isOpen, 
  onClose, 
  selectedActivity, 
  onSelectActivity 
}: ActivitySelectorProps) {
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

    if (isOpen) {
      loadUserProfile();
    }
  }, [isOpen]);

  // Get calories info for an activity
  const getCaloriesInfo = (activity: string) => {
    const met = getActivityMet(activity);
    if (!met) return { calories: 0, metValue: 0 };

    // Use user weight if available, otherwise default to 60kg
    const weight = userProfile?.poids || 60;
    const calories = calculateCaloriesBurned(activity, weight, 45);
    
    return { calories, metValue: met };
  };

  if (!isOpen) return null;

  const categorizeActivities = () => {
    // Use our MET-based categorization
    return Object.entries(ACTIVITIES_BY_CATEGORY).map(([category, activities]) => ({
      category,
      activities: activities.map(activity => activity.name)
    }));
  };

  const categorizedActivities = categorizeActivities();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white rounded-t-2xl w-full h-[90vh] flex flex-col">
        <div className="sticky top-0 bg-white border-b px-4 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Choisir l'activité</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-8" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          {categorizedActivities.map(({ category, activities }) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 px-2">
                {category}
              </h3>
              <div className="space-y-2">
                {activities.map((activity) => (
                  <button
                    key={activity}
                    onClick={() => {
                      onSelectActivity(activity);
                      onClose();
                    }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedActivity === activity
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          selectedActivity === activity ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <Dumbbell className={`h-5 w-5 ${
                            selectedActivity === activity ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{activity}</h4>
                          <p className="text-sm text-gray-600">
                            {getCaloriesInfo(activity).calories > 0 
                              ? `~${Math.round(getCaloriesInfo(activity).calories)} kcal (45 min)`
                              : "Calories à calculer"
                            }
                          </p>
                        </div>
                      </div>
                      {selectedActivity === activity && (
                        <div className="p-1 rounded-full bg-blue-600">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}