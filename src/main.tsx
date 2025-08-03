import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.tsx';
import './index.css';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

if (!domain || !clientId) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Auth0 requise</h1>
          <p className="text-gray-600 mb-4">
            Veuillez configurer vos variables d'environnement Auth0 dans le fichier <code className="bg-gray-100 px-2 py-1 rounded">.env</code>
          </p>
          <p className="text-sm text-gray-500">
            Consultez le README.md pour les instructions détaillées.
          </p>
        </div>
      </div>
    </StrictMode>
  );
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
      >
        <App />
      </Auth0Provider>
    </StrictMode>
  );
}
