import { useContext } from 'react';
import RecipesContext from '../contexts/RecipesContext';

/**
 * Custom hook to access the RecipesContext
 * Provides access to all recipe-related state and operations
 * @returns {RecipesContextType} The recipes context containing state and actions
 * @throws {Error} When used outside of RecipesProvider
 */
export const useRecipes = () => {
  const context = useContext(RecipesContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipesProvider');
  }
  return context;
};
