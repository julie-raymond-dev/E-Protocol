import { useAuth0 } from '@auth0/auth0-react';
import { User, LogIn, Loader } from 'lucide-react';

export default function Login() {
  const { loginWithRedirect, isLoading, error } = useAuth0();

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
          <div className="bg-emerald-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <User className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mon Protocole</h1>
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