import { useAuth0 } from '@auth0/auth0-react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import { RecipesProvider } from './contexts/RecipesContext';
import { Loader } from 'lucide-react';

/**
 * Main application component that handles authentication and renders the appropriate UI
 * @returns {JSX.Element} The main app component with authentication flow
 */
function App() {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RecipesProvider>
        <Navbar />
        <Dashboard />
      </RecipesProvider>
    </div>
  );
}

export default App;