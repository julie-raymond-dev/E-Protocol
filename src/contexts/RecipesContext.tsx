import React, { createContext, useEffect, useState, ReactNode, useMemo, useCallback } from 'react';
import { recipeStorage, Recipe, Ingredient, ExportData } from '../services/recipeStorage';

interface RecipesContextType {
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  
  createRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRecipe: (id: string, updates: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  
  getRecipesByType: (type: Recipe['type']) => Recipe[];
  searchRecipes: (query: string) => Recipe[];
  
  exportRecipes: () => Promise<Blob>;
  importRecipes: (file: File) => Promise<void>;
  
  generateRecipeId: () => string;
  calculateRecipeMacros: (ingredients: Ingredient[]) => { kcal: number; P: number; L: number; G: number };
}

const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

interface RecipesProviderProps {
  children: ReactNode;
}

/**
 * Provider component for managing recipes state and operations
 * @param {RecipesProviderProps} props - The provider props containing children
 * @returns {JSX.Element} The context provider with recipe management capabilities
 */
export const RecipesProvider: React.FC<RecipesProviderProps> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Initializes the IndexedDB storage and loads existing recipes
     */
    const initializeStorage = async () => {
      try {
        setIsLoading(true);
        await recipeStorage.init();
        const loadedRecipes = await recipeStorage.getAllRecipes();
        setRecipes(loadedRecipes);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de l\'initialisation');
        console.error('Erreur initialisation RecipesContext:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeStorage();
  }, []);

  /**
   * Generates a unique ID for new recipes
   * @returns {string} A unique recipe ID with timestamp and random string
   */
  const generateRecipeId = useCallback((): string => {
    return `recipe_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }, []);

  /**
   * Calculates total macronutrients from a list of ingredients
   * @param {Ingredient[]} ingredients - Array of ingredients to calculate macros for
   * @returns {object} Object containing total kcal, P, L, G values
   */
  const calculateRecipeMacros = useCallback((ingredients: Ingredient[]) => {
    return ingredients.reduce(
      (total, ingredient) => ({
        kcal: total.kcal + ingredient.macros.kcal,
        P: total.P + ingredient.macros.P,
        L: total.L + ingredient.macros.L,
        G: total.G + ingredient.macros.G,
      }),
      { kcal: 0, P: 0, L: 0, G: 0 }
    );
  }, []);

  /**
   * Creates a new recipe and saves it to storage
   * @param {Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>} recipeData - Recipe data without auto-generated fields
   * @throws {Error} When recipe creation fails
   */
  const createRecipe = useCallback(async (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    try {
      const now = new Date().toISOString();
      const newRecipe: Recipe = {
        ...recipeData,
        id: generateRecipeId(),
        createdAt: now,
        updatedAt: now,
      };

      await recipeStorage.saveRecipe(newRecipe);
      setRecipes(prev => [...prev, newRecipe]);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [generateRecipeId]);

  /**
   * Updates an existing recipe with new data
   * @param {string} id - The ID of the recipe to update
   * @param {Partial<Recipe>} updates - Partial recipe data to update
   * @throws {Error} When recipe is not found or update fails
   */
  const updateRecipe = useCallback(async (id: string, updates: Partial<Recipe>): Promise<void> => {
    try {
      const existingRecipe = recipes.find(r => r.id === id);
      if (!existingRecipe) {
        throw new Error('Recette non trouvée');
      }

      const updatedRecipe: Recipe = {
        ...existingRecipe,
        ...updates,
        id,
        updatedAt: new Date().toISOString(),
      };

      await recipeStorage.saveRecipe(updatedRecipe);
      setRecipes(prev => prev.map(r => r.id === id ? updatedRecipe : r));
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [recipes]);

  /**
   * Deletes a recipe from storage and state
   * @param {string} id - The ID of the recipe to delete
   * @throws {Error} When deletion fails
   */
  const deleteRecipe = useCallback(async (id: string): Promise<void> => {
    try {
      await recipeStorage.deleteRecipe(id);
      setRecipes(prev => prev.filter(r => r.id !== id));
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Filters recipes by meal type
   * @param {Recipe['type']} type - The meal type to filter by
   * @returns {Recipe[]} Array of recipes matching the specified type
   */
  const getRecipesByType = useCallback((type: Recipe['type']): Recipe[] => {
    return recipes.filter(recipe => recipe.type === type);
  }, [recipes]);

  /**
   * Searches recipes by name or ingredient name
   * @param {string} query - The search query string
   * @returns {Recipe[]} Array of recipes matching the search criteria
   */
  const searchRecipes = useCallback((query: string): Recipe[] => {
    if (!query.trim()) return recipes;
    
    const lowercaseQuery = query.toLowerCase();
    return recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(lowercaseQuery) ||
      recipe.ingredients.some(ingredient => 
        ingredient.name.toLowerCase().includes(lowercaseQuery)
      )
    );
  }, [recipes]);

  /**
   * Exports all recipes as a JSON blob
   * @returns {Promise<Blob>} A blob containing the exported recipe data
   * @throws {Error} When export fails
   */
  const exportRecipes = useCallback(async (): Promise<Blob> => {
    try {
      const exportData = await recipeStorage.exportAllData();
      const jsonString = JSON.stringify(exportData, null, 2);
      return new Blob([jsonString], { type: 'application/json' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'export';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Imports recipes from a JSON file
   * @param {File} file - The file containing recipe data to import
   * @throws {Error} When file format is invalid or import fails
   */
  const importRecipes = useCallback(async (file: File): Promise<void> => {
    try {
      const text = await file.text();
      const data: ExportData = JSON.parse(text);
      
      if (!data.recipes || !Array.isArray(data.recipes)) {
        throw new Error('Format de fichier invalide');
      }

      await recipeStorage.importData(data);
      const updatedRecipes = await recipeStorage.getAllRecipes();
      setRecipes(updatedRecipes);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'import';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const value: RecipesContextType = useMemo(() => ({
    recipes,
    isLoading,
    error,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipesByType,
    searchRecipes,
    exportRecipes,
    importRecipes,
    generateRecipeId,
    calculateRecipeMacros,
  }), [
    recipes,
    isLoading,
    error,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipesByType,
    searchRecipes,
    exportRecipes,
    importRecipes,
    generateRecipeId,
    calculateRecipeMacros,
  ]);

  return (
    <RecipesContext.Provider value={value}>
      {children}
    </RecipesContext.Provider>
  );
};

export default RecipesContext;
