import { User, AlertCircle } from 'lucide-react';

interface ProfileBannerProps {
  readonly onOpenProfile: () => void;
}

/**
 * Banner component that invites users to fill their profile
 * Displayed when no user profile is found
 */
export default function ProfileBanner({ onOpenProfile }: ProfileBannerProps) {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <AlertCircle className="h-6 w-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-purple-900">
            Configurez votre profil personnel
          </h3>
          <p className="text-sm text-purple-700 mt-1">
            Renseignez vos informations pour obtenir des objectifs nutritionnels personnalisés basés sur votre métabolisme.
          </p>
        </div>
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          <User className="h-4 w-4" />
          Créer mon profil
        </button>
      </div>
    </div>
  );
}
