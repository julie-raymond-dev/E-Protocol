import { useAuth0 } from '@auth0/auth0-react';
import { LogIn, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import logoImage from '../assets/e-protocol-logo.jpg';

/**
 * Login component providing Auth0 authentication interface
 * @returns {JSX.Element} Login form with Auth0 integration
 */
export default function Login() {
  const { loginWithRedirect, isLoading, error } = useAuth0();
  const [mouseTrail, setMouseTrail] = useState<Array<{x: number, y: number, id: number, timestamp: number}>>([]);

  // Nettoie automatiquement les anciennes traces
  useEffect(() => {
    const cleanupOldTrails = () => {
      const now = Date.now();
      const validTrails = mouseTrail.filter(point => now - point.timestamp < 2000);
      if (validTrails.length !== mouseTrail.length) {
        setMouseTrail(validTrails);
      }
    };
    
    const interval = setInterval(cleanupOldTrails, 100);
    return () => clearInterval(interval);
  }, [mouseTrail]);

  /**
   * Handles mouse movement to create smooth trail effect
   */
  const handleMouseMove = (e: React.MouseEvent) => {
    const newTrail = {
      x: e.clientX,
      y: e.clientY,
      id: Date.now() + Math.random(),
      timestamp: Date.now()
    };
    
    setMouseTrail(prev => {
      // Garde plus de points pour plus de fluidité
      const updated = [...prev, newTrail];
      return updated.slice(-20); // Garde les 20 dernières positions
    });
  };

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
    
    // Couleurs basées sur votre logo + noir et gris
    const logoColors = [
      // Couleurs principales du logo
      '#1ac694', '#23a2cf', '#4378a1', '#74c4ae', '#3597ab', '#29afc0',
      // Gris et noirs
      '#46434e', '#5a5c5c', '#948c94', '#000000', '#1a1a1a', '#333333',
      // Variations plus claires
      '#edf4f4', '#a0d4c7', '#7fb8d1', '#9cb4d1'
    ];
    
    // Configuration des différents types de points
    const dotConfigs = [
      { size: 'w-3 h-3', count: 8 },   // Très gros points
      { size: 'w-2 h-2', count: 15 },  // Gros points
      { size: 'w-1.5 h-1.5', count: 20 }, // Moyens points
      { size: 'w-1 h-1', count: 30 },  // Petits points
      { size: 'w-0.5 h-0.5', count: 40 }, // Mini points
      { size: 'w-px h-px', count: 25 }  // Micro points
    ];

    /**
     * Génère une position aléatoire en style inline
     * @returns {object} Style CSS avec position aléatoire
     */
    const getRandomPosition = () => {
      const top = Math.floor(Math.random() * 90) + 5; // Entre 5% et 95%
      const left = Math.floor(Math.random() * 90) + 5; // Entre 5% et 95%
      return {
        top: `${top}%`,
        left: `${left}%`
      };
    };
    
    const createDot = (config: {size: string, count: number}, configIndex: number, i: number) => {
      const randomColor = logoColors[Math.floor(Math.random() * logoColors.length)];
      const randomPosition = getRandomPosition();
      const delay = Math.floor(Math.random() * 500);
      
      return (
        <div
          key={`dot-${configIndex}-${i}`}
          className={`absolute ${config.size} rounded-full animate-ping`}
          style={{
            backgroundColor: randomColor,
            animationDelay: `${delay}ms`,
            ...randomPosition
          }}
        />
      );
    };
    
    dotConfigs.forEach((config, configIndex) => {
      for (let i = 0; i < config.count; i++) {
        dots.push(createDot(config, configIndex, i));
      }
    });

    return dots;
  };

  /**
   * Renders the mouse trail effect with slow explosions (surcouche)
   * @returns {JSX.Element} Mouse trail with slow animated explosions
   */
  const renderMouseTrail = () => (
    <div className="absolute inset-0 pointer-events-none z-20">
      {mouseTrail.map((point) => {
        const age = Date.now() - point.timestamp;
        const maxAge = 2000;
        const lifeProgress = 1 - (age / maxAge);
        
        return (
          <div
            key={point.id}
            className="absolute pointer-events-none"
            style={{
              left: point.x - 15,
              top: point.y - 15,
              width: '30px',
              height: '30px',
            }}
          >
            {/* Explosion centrale lente */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: 'rgba(4, 120, 87, 0.6)',
                boxShadow: '0 0 20px rgba(4, 120, 87, 0.8)',
                transform: `scale(${lifeProgress * 2})`,
                opacity: lifeProgress * 0.7,
                animation: 'slow-explosion 3s ease-out forwards',
              }}
            />
            
            {/* Cercles d'expansion lents */}
            <div
              className="absolute inset-0 rounded-full border-2"
              style={{
                borderColor: 'rgba(4, 120, 87, 0.4)',
                transform: `scale(${1 + (1 - lifeProgress) * 1.5})`,
                opacity: lifeProgress * 0.5,
                animation: 'slow-ring-expansion 2.5s ease-out forwards',
              }}
            />
            
            {/* Petites particules qui s'éparpillent lentement */}
            {[0, 72, 144, 216, 288].map((angle) => (
              <div
                key={`particle-${point.id}-${angle}`}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: 'rgba(4, 120, 87, 0.8)',
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${10 + (1 - lifeProgress) * 15}px)`,
                  opacity: lifeProgress * 0.9,
                  boxShadow: '0 0 6px rgba(4, 120, 87, 0.6)',
                  transition: 'all 0.3s ease-out',
                }}
              />
            ))}
          </div>
        );
      })}
      <style>{`
        @keyframes slow-explosion {
          0% { 
            transform: scale(0.1); 
            opacity: 1; 
          }
          50% { 
            transform: scale(1.2); 
            opacity: 0.8; 
          }
          100% { 
            transform: scale(2); 
            opacity: 0; 
          }
        }
        @keyframes slow-ring-expansion {
          0% { 
            transform: scale(0.5); 
            opacity: 0.8; 
          }
          100% { 
            transform: scale(3); 
            opacity: 0; 
          }
        }
      `}</style>
    </div>
  );

  /**
   * Renders the logo-inspired background effect (base layer - toujours visible)
   * @returns {JSX.Element} Background with sparkling dots always visible
   */
  const renderBackgroundEffect = () => (
    <div className="absolute inset-0 z-10">
      <div 
        className="absolute inset-0 opacity-20 animate-pulse"
        style={{
          background: 'linear-gradient(135deg, #1ac694 0%, #23a2cf 25%, #4378a1 50%, #74c4ae 75%, #29afc0 100%)'
        }}
      ></div>
      {generateSparklingDots()}
    </div>
  );

  if (isLoading) {
    return (
      <main 
        className="min-h-screen relative flex items-center justify-center p-4"
        style={{
          background: 'linear-gradient(135deg, #46434e 0%, #5a5c5c 50%, #948c94 100%)'
        }}
        onMouseMove={handleMouseMove}
        aria-label="Page de connexion"
      >
        {renderBackgroundEffect()}
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center relative z-30">
          <Loader className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </main>
    );
  }

  return (
    <main 
      className="min-h-screen relative flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #46434e 0%, #5a5c5c 50%, #948c94 100%)'
      }}
      onMouseMove={handleMouseMove}
      aria-label="Page de connexion"
    >
      {renderBackgroundEffect()}
      {renderMouseTrail()}
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center relative z-30">
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
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
    </main>
  );
}
