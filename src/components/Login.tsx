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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <Loader className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
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
    </div>
  );
}