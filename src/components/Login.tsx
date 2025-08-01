import { useState, FormEvent } from 'react';
import { User, LogIn } from 'lucide-react';
import { saveUser } from '../utils/storage';

interface LoginProps {
  readonly onLogin: (username: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Configuration à partir des variables d'environnement
    const VALID_USERNAME = import.meta.env.VITE_AUTH_USERNAME;
    const VALID_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD;
    
    if (!VALID_USERNAME || !VALID_PASSWORD) {
      setError('Variables d\'environnement non configurées. Voir .env.example');
      return;
    }
    
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      saveUser(username);
      onLogin(username);
    } else {
      setError('Nom d\'utilisateur ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-emerald-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <User className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mon Protocole</h1>
          <p className="text-gray-600">Accès personnel sécurisé</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Votre nom d'utilisateur"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Votre mot de passe"
              required
            />
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="h-5 w-5" />
            Se connecter
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-600">
          <p className="font-medium mb-1">Informations de connexion :</p>
          <p>Configurées via les variables d'environnement</p>
          <p>Voir le fichier .env.example pour plus d'informations</p>
        </div>
      </div>
    </div>
  );
}