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
      <App />
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
