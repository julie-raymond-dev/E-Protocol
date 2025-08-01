import { useContext } from 'react';
import RecipesContext from '../contexts/RecipesContext';

export const useRecipes = () => {
  const context = useContext(RecipesContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipesProvider');
  }
  return context;
};
