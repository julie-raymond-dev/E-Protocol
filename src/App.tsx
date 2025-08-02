import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import UserProfile from './components/UserProfile';
import { RecipesProvider } from './contexts/RecipesContext';
import { Loader } from 'lucide-react';

/**
 * Main application component that handles authentication and renders the appropriate UI
 * @returns {JSX.Element} The main app component with authentication flow
 */
function App() {
  const { isLoading, isAuthenticated } = useAuth0();
  const [userProfileOpen, setUserProfileOpen] = useState(false);

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
      <RecipesProvider>
        <Navbar onOpenProfile={() => setUserProfileOpen(true)} />
        <Dashboard onOpenProfile={() => setUserProfileOpen(true)} />
        <UserProfile 
          isOpen={userProfileOpen} 
          onClose={() => setUserProfileOpen(false)} 
        />
      </RecipesProvider>
    </div>
  );
}

export default App;