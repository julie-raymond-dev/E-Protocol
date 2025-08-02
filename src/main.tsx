import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.tsx';
import './index.css';

// Configuration Auth0 pour la démo publique
const domain = import.meta.env.VITE_AUTH0_DOMAIN || 'e-protocol-demo.eu.auth0.com';
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || 'demo-client-id';

// Mode démo si les variables d'environnement ne sont pas configurées
const isDemoMode = !import.meta.env.VITE_AUTH0_DOMAIN || 
                   domain === 'e-protocol-demo.eu.auth0.com' || 
                   clientId === 'demo-client-id';

if (isDemoMode) {
  // Mode démo - Application sans authentification
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white p-4 text-center">
          <h2 className="text-lg font-semibold">🚀 Demo Mode - E-Protocol</h2>
          <p className="text-sm opacity-90">Full functionality available without authentication</p>
        </div>
        <App />
      </div>
    </StrictMode>
  );
} else {
  // Mode production avec Auth0
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
