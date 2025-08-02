export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  macros: {
    kcal: number;
    P: number;
    L: number;
    G: number;
  };
}

export interface Recipe {
  id: string;
  name: string;
  kcal: number;
  P: number;
  L: number;
  G: number;
  type: 'petitDejeuner' | 'dejeuner' | 'diner' | 'collation';
  ingredients: Ingredient[];
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
}

export interface ExportData {
  version: string;
  exportDate: string;
  recipes: Recipe[];
  metadata: {
    userAgent: string;
    appVersion: string;
  };
}

/**
 * IndexedDB service for managing recipe storage in browser
 * Provides CRUD operations for recipes with offline support
 */
export class RecipeStorageService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'E-Protocol-DB';
  private readonly DB_VERSION = 1;

  /**
   * Initializes the IndexedDB database and creates necessary object stores
   * @returns {Promise<void>} Resolves when database is ready
   * @throws {Error} When database initialization fails
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onupgradeneeded = () => {
        this.db = request.result;
        
        if (!this.db.objectStoreNames.contains('recipes')) {
          const recipeStore = this.db.createObjectStore('recipes', { keyPath: 'id' });
          recipeStore.createIndex('type', 'type', { unique: false });
          recipeStore.createIndex('name', 'name', { unique: false });
        }

        if (!this.db.objectStoreNames.contains('ingredients')) {
          const ingredientStore = this.db.createObjectStore('ingredients', { keyPath: 'id' });
          ingredientStore.createIndex('name', 'name', { unique: false });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ IndexedDB initialisé avec succès');
        resolve();
      };

      request.onerror = () => {
        console.error('❌ Erreur IndexedDB:', request.error);
        reject(new Error('Failed to initialize IndexedDB'));
      };
    });
  }

  /**
   * Saves a recipe to the database (create or update)
   * @param {Recipe} recipe - The recipe object to save
   * @returns {Promise<void>} Resolves when recipe is saved
   * @throws {Error} When save operation fails
   */
  async saveRecipe(recipe: Recipe): Promise<void> {
    if (!this.db) throw new Error('DB not initialized');
    
    const transaction = this.db.transaction(['recipes'], 'readwrite');
    const store = transaction.objectStore('recipes');
    
    return new Promise((resolve, reject) => {
      const request = store.put(recipe);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to save recipe'));
    });
  }

  /**
   * Retrieves all recipes from the database
   * @returns {Promise<Recipe[]>} Array of all stored recipes
   * @throws {Error} When retrieval fails
   */
  async getAllRecipes(): Promise<Recipe[]> {
    if (!this.db) throw new Error('DB not initialized');
    
    const transaction = this.db.transaction(['recipes'], 'readonly');
    const store = transaction.objectStore('recipes');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to fetch recipes'));
    });
  }

  /**
   * Deletes a recipe from the database by ID
   * @param {string} id - The ID of the recipe to delete
   * @returns {Promise<void>} Resolves when recipe is deleted
   * @throws {Error} When deletion fails
   */
  async deleteRecipe(id: string): Promise<void> {
    if (!this.db) throw new Error('DB not initialized');
    
    const transaction = this.db.transaction(['recipes'], 'readwrite');
    const store = transaction.objectStore('recipes');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete recipe'));
    });
  }

  /**
   * Exports all recipe data for backup or transfer between devices
   * @returns {Promise<ExportData>} Complete export data with metadata
   * @throws {Error} When export fails
   */
  async exportAllData(): Promise<ExportData> {
    const recipes = await this.getAllRecipes();
    
    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      recipes,
      metadata: {
        userAgent: navigator.userAgent,
        appVersion: '1.0'
      }
    };
  }

  /**
   * Imports recipe data from another device or backup
   * @param {ExportData} data - The exported data containing recipes to import
   * @returns {Promise<void>} Resolves when all recipes are imported
   * @throws {Error} When data format is invalid or import fails
   */
  async importData(data: ExportData): Promise<void> {
    if (!data.recipes || !Array.isArray(data.recipes)) {
      throw new Error('Format de données invalide');
    }

    for (const recipe of data.recipes) {
      await this.saveRecipe(recipe);
    }
  }
}

export const recipeStorage = new RecipeStorageService();
