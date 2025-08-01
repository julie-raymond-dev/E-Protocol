import React, { createContext, useEffect, useState, ReactNode, useMemo, useCallback } from 'react';
import { recipeStorage, Recipe, Ingredient, ExportData } from '../services/recipeStorage';

interface RecipesContextType {
  // État
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  
  // Actions CRUD
  createRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRecipe: (id: string, updates: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  
  // Filtres et recherche
  getRecipesByType: (type: Recipe['type']) => Recipe[];
  searchRecipes: (query: string) => Recipe[];
  
  // Import/Export
  exportRecipes: () => Promise<Blob>;
  importRecipes: (file: File) => Promise<void>;
  
  // Utilitaires
  generateRecipeId: () => string;
  calculateRecipeMacros: (ingredients: Ingredient[]) => { kcal: number; P: number; L: number; G: number };
}

const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

interface RecipesProviderProps {
  children: ReactNode;
}

export const RecipesProvider: React.FC<RecipesProviderProps> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialisation
  useEffect(() => {
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

  // Générer un ID unique
  const generateRecipeId = useCallback((): string => {
    return `recipe_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }, []);

  // Calculer les macros totales d'une recette
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

  // Créer une nouvelle recette
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

  // Mettre à jour une recette
  const updateRecipe = useCallback(async (id: string, updates: Partial<Recipe>): Promise<void> => {
    try {
      const existingRecipe = recipes.find(r => r.id === id);
      if (!existingRecipe) {
        throw new Error('Recette non trouvée');
      }

      const updatedRecipe: Recipe = {
        ...existingRecipe,
        ...updates,
        id, // S'assurer que l'ID ne change pas
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

  // Supprimer une recette
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

  // Filtrer par type
  const getRecipesByType = useCallback((type: Recipe['type']): Recipe[] => {
    return recipes.filter(recipe => recipe.type === type);
  }, [recipes]);

  // Recherche par nom
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

  // Export des recettes
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

  // Import des recettes
  const importRecipes = useCallback(async (file: File): Promise<void> => {
    try {
      const text = await file.text();
      const data: ExportData = JSON.parse(text);
      
      // Validation basique
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
