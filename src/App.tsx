import { useAuth0 } from '@auth0/auth0-react';
import { useState, useRef } from 'react';
import Login from './components/Login';
import Dashboard, { DashboardRef } from './components/Dashboard';
import Navbar from './components/Navbar';
import UserProfile from './components/UserProfile';
import { RecipesProvider } from './contexts/RecipesContext';
import { Loader } from 'lucide-react';

/**
 * Hook for common dashboard logic
 */
function useDashboardLogic() {
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const dashboardRef = useRef<DashboardRef>(null);

  const handleProfileChange = () => {
    if (dashboardRef.current) {
      dashboardRef.current.refreshProfile();
    }
  };

  const openProfile = () => setUserProfileOpen(true);
  const closeProfile = () => setUserProfileOpen(false);

  return {
    userProfileOpen,
    dashboardRef,
    handleProfileChange,
    openProfile,
    closeProfile
  };
}

/**
 * Main dashboard layout component
 */
function DashboardLayout() {
  const { userProfileOpen, dashboardRef, handleProfileChange, openProfile, closeProfile } = useDashboardLogic();

  return (
    <RecipesProvider>
      <Navbar onOpenProfile={openProfile} />
      <Dashboard 
        ref={dashboardRef}
        onOpenProfile={openProfile} 
      />
      <UserProfile 
        isOpen={userProfileOpen} 
        onClose={closeProfile}
        onProfileChange={handleProfileChange}
      />
    </RecipesProvider>
  );
}

/**
 * Component for demo mode (without Auth0)
 */
function DemoApp() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo mode banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white p-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg">🚀</span>
          <span className="font-semibold">Demo Mode - E-Protocol</span>
        </div>
        <p className="text-sm opacity-90 mt-1">
          Full functionality available • All data is stored locally • No registration required
        </p>
      </div>
      <DashboardLayout />
    </div>
  );
}

/**
 * Component for production mode (with Auth0)
 */
function AuthenticatedApp() {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardLayout />
    </div>
  );
}

/**
 * Main application component that handles authentication and renders the appropriate UI
 * @returns {JSX.Element} The main app component with authentication flow
 */
function App() {
  // Détection du mode démo (quand Auth0 n'est pas configuré)
  const isDemoMode = !import.meta.env.VITE_AUTH0_DOMAIN || 
                     import.meta.env.VITE_AUTH0_DOMAIN === 'e-protocol-demo.eu.auth0.com';
  
  // Rendu conditionnel basé sur le mode
  return isDemoMode ? <DemoApp /> : <AuthenticatedApp />;
}

export default App;