import { useAuth0 } from '@auth0/auth0-react';
import { LogIn, Loader } from 'lucide-react';
import logoImage from '../assets/e-protocol-logo.jpg';

/**
 * Login component providing Auth0 authentication interface
 * @returns {JSX.Element} Login form with Auth0 integration
 */
export default function Login() {
  const { loginWithRedirect, isLoading, error } = useAuth0();

  /**
   * Initiates Auth0 login redirect flow
   */
  const handleLogin = () => {
    loginWithRedirect();
  };

  /**
   * Generates sparkling dots for the background animation
   * @returns {JSX.Element[]} Array of animated dot elements
   */
  const generateSparklingDots = (): JSX.Element[] => {
    const dots: JSX.Element[] = [];
    
    // Configuration des différents types de points
    const dotConfigs = [
      // Gros points (2x2)
      { size: 'w-2 h-2', colors: ['yellow-300', 'pink-300', 'blue-300', 'green-300', 'cyan-300', 'rose-300', 'violet-300', 'orange-300'], count: 12 },
      // Moyens points (1.5x1.5)
      { size: 'w-1.5 h-1.5', colors: ['orange-300', 'purple-300', 'lime-300', 'teal-300', 'indigo-300', 'amber-300', 'emerald-300', 'fuchsia-300'], count: 16 },
      // Petits points (1x1)
      { size: 'w-1 h-1', colors: ['red-400', 'yellow-400', 'green-400', 'blue-400', 'violet-400', 'pink-400', 'cyan-400', 'orange-400', 'lime-400', 'rose-400', 'teal-400', 'purple-400'], count: 24 },
      // Mini points (0.5x0.5)
      { size: 'w-0.5 h-0.5', colors: ['yellow-500', 'pink-500', 'blue-500', 'green-500', 'red-500', 'indigo-500', 'orange-500', 'violet-500', 'emerald-500', 'cyan-500', 'lime-500', 'fuchsia-500', 'amber-500', 'teal-500', 'rose-500', 'purple-500'], count: 32 },
      // Micro points (0.25x0.25 simulé avec w-px h-px)
      { size: 'w-px h-px', colors: ['red-600', 'yellow-600', 'green-600', 'blue-600', 'purple-600', 'pink-600', 'cyan-600', 'orange-600'], count: 20 }
    ];

    // Positions possibles
    const positions = [
      'top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2',
      'top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4',
      'top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6',
      'top-8 left-8', 'top-8 right-8', 'bottom-8 left-8', 'bottom-8 right-8',
      'top-10 left-10', 'top-10 right-10', 'bottom-10 left-10', 'bottom-10 right-10',
      'top-12 left-12', 'top-12 right-12', 'bottom-12 left-12', 'bottom-12 right-12',
      'top-16 left-16', 'top-16 right-16', 'bottom-16 left-16', 'bottom-16 right-16',
      'top-20 left-20', 'top-20 right-20', 'bottom-20 left-20', 'bottom-20 right-20',
      'top-24 left-24', 'top-24 right-24', 'bottom-24 left-24', 'bottom-24 right-24',
      'top-1/4 left-1/4', 'top-1/4 right-1/4', 'bottom-1/4 left-1/4', 'bottom-1/4 right-1/4',
      'top-1/3 left-1/3', 'top-1/3 right-1/3', 'bottom-1/3 left-1/3', 'bottom-1/3 right-1/3',
      'top-1/2 left-1/2', 'top-1/2 right-1/2', 'bottom-1/2 left-1/2', 'bottom-1/2 right-1/2',
      'top-2/3 left-2/3', 'top-2/3 right-2/3', 'bottom-2/3 left-2/3', 'bottom-2/3 right-2/3',
      'top-3/4 left-3/4', 'top-3/4 right-3/4', 'bottom-3/4 left-3/4', 'bottom-3/4 right-3/4',
      'top-1/5 left-1/5', 'top-1/5 right-1/5', 'bottom-1/5 left-1/5', 'bottom-1/5 right-1/5',
      'top-2/5 left-2/5', 'top-2/5 right-2/5', 'bottom-2/5 left-2/5', 'bottom-2/5 right-2/5',
      'top-3/5 left-3/5', 'top-3/5 right-3/5', 'bottom-3/5 left-3/5', 'bottom-3/5 right-3/5',
      'top-4/5 left-4/5', 'top-4/5 right-4/5', 'bottom-4/5 left-4/5', 'bottom-4/5 right-4/5',
      'top-1/6 left-1/6', 'top-1/6 right-1/6', 'bottom-1/6 left-1/6', 'bottom-1/6 right-1/6',
      'top-5/6 left-5/6', 'top-5/6 right-5/6', 'bottom-5/6 left-5/6', 'bottom-5/6 right-5/6'
    ];

    let dotIndex = 0;
    
    dotConfigs.forEach((config, configIndex) => {
      for (let i = 0; i < config.count; i++) {
        const colorIndex = i % config.colors.length;
        const positionIndex = dotIndex % positions.length;
        const delay = (dotIndex * 25) % 500; // Délai entre 0 et 475ms
        
        dots.push(
          <div
            key={`dot-${configIndex}-${i}`}
            className={`absolute ${positions[positionIndex]} ${config.size} bg-${config.colors[colorIndex]} rounded-full animate-ping animation-delay-${delay}`}
          />
        );
        
        dotIndex++;
      }
    });

    return dots;
  };

  /**
   * Renders the rainbow shimmer background effect
   * @returns {JSX.Element} Rainbow background with sparkling dots
   */
  const renderBackgroundEffect = () => (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 via-indigo-400 to-purple-400 opacity-20 animate-pulse"></div>
      {generateSparklingDots()}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 relative flex items-center justify-center p-4">
        {renderBackgroundEffect()}
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center relative z-10">
          <Loader className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 relative flex items-center justify-center p-4">
      {renderBackgroundEffect()}
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-emerald-100 shadow-lg">
            <img 
              src={logoImage} 
              alt="E-Protocol Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">E-Protocol</h1>
          <p className="text-gray-600">Accès sécurisé avec Auth0</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            Erreur de connexion : {error.message}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <LogIn className="h-5 w-5" />
          Se connecter avec Auth0
        </button>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-600">
          <p className="font-medium mb-1">Authentification sécurisée :</p>
          <p>✅ Connexion via Auth0</p>
          <p>✅ Aucun mot de passe stocké localement</p>
          <p>✅ Sécurité niveau entreprise</p>
        </div>
      </div>
    </div>
  );
}