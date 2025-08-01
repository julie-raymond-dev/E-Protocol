import { useAuth0 } from '@auth0/auth0-react';
import { LogOut, User, Calendar, ChefHat } from 'lucide-react';
import { useState } from 'react';

/**
 * Navigation bar component with user authentication and menu actions
 * @returns {JSX.Element} Navbar component with logout, navigation, and menu functionality
 */
export default function Navbar() {
  const { logout, user } = useAuth0();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /**
   * Handles user logout by calling Auth0 logout with return URL
   */
  const handleLogout = () => {
    logout({ 
      logoutParams: { 
        returnTo: window.location.origin 
      } 
    });
  };

  /**
   * Dispatches custom event to navigate back to today's date
   */
  const goToToday = () => {
    // Dispatch custom event to return to today
    window.dispatchEvent(new CustomEvent('goToToday'));
    setIsMenuOpen(false);
  };

  /**
   * Dispatches custom event to open the recipe manager
   */
  const openRecipes = () => {
    // Dispatch custom event to open recipes
    window.dispatchEvent(new CustomEvent('openRecipes'));
    setIsMenuOpen(false);
  };

  /**
   * Toggles the mobile menu open/closed state
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24">
          <div className="flex items-center">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">E-Protocol</h1>
              <p className="text-sm sm:text-base text-gray-600">Bonjour {user?.name || user?.email?.split('@')[0] || 'Utilisateur'} 👋</p>
            </div>
          </div>
          
          {/* Menu Burger Button */}
          <button
            onClick={toggleMenu}
            className={`relative p-3 rounded-xl transition-all duration-300 ${
              isMenuOpen ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'hover:bg-gray-100'
            }`}
          >
            {/* Menu burger avec animation */}
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${
                isMenuOpen 
                  ? 'bg-white rotate-45 translate-y-1' 
                  : 'bg-gray-600 mb-1 transform-none'
              }`}></span>
              <span className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${
                isMenuOpen 
                  ? 'bg-white opacity-0' 
                  : 'bg-gray-600 mb-1'
              }`}></span>
              <span className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${
                isMenuOpen 
                  ? 'bg-white -rotate-45 -translate-y-1' 
                  : 'bg-gray-600 transform-none'
              }`}></span>
            </div>
            
            {/* Scintillement arc-en-ciel */}
            {isMenuOpen && (
              <div className="absolute inset-0 rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 via-indigo-400 to-purple-400 opacity-20 animate-pulse rounded-xl"></div>
                <div className="absolute top-1 left-1 w-1 h-1 bg-yellow-300 rounded-full animate-ping"></div>
                <div className="absolute top-2 right-2 w-1 h-1 bg-pink-300 rounded-full animate-ping animation-delay-150"></div>
                <div className="absolute bottom-1 left-2 w-1 h-1 bg-blue-300 rounded-full animate-ping animation-delay-300"></div>
                <div className="absolute bottom-2 right-1 w-1 h-1 bg-green-300 rounded-full animate-ping animation-delay-75"></div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Dropdown menu */}
      <div className={`absolute top-full left-0 right-0 bg-white border-b shadow-lg transition-all duration-300 z-50 ${
        isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
          {/* Utilisateur info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">{user?.name || user?.email}</span>
          </div>
          
          {/* Bouton Mes Recettes */}
          <button
            onClick={openRecipes}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-purple-50 rounded-lg transition-colors group"
          >
            <ChefHat className="h-5 w-5 text-purple-600" />
            <span className="text-sm text-gray-700 group-hover:text-purple-700">Mes Recettes</span>
          </button>
          
          {/* Bouton Aujourd'hui */}
          <button
            onClick={goToToday}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-emerald-50 rounded-lg transition-colors group"
          >
            <Calendar className="h-5 w-5 text-emerald-600" />
            <span className="text-sm text-gray-700 group-hover:text-emerald-700">Retour à aujourd'hui</span>
          </button>
          
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-red-50 rounded-lg transition-colors group"
          >
            <LogOut className="h-5 w-5 text-red-600" />
            <span className="text-sm text-gray-700 group-hover:text-red-700">Déconnexion</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
