// Service IndexedDB pour GitHub Pages

// Types pour les recettes personnalisées
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
  type: 'dejeuner' | 'diner' | 'collation';
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

export class RecipeStorageService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'E-Protocol-DB';
  private readonly DB_VERSION = 1;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Fonctionne sur TOUS les navigateurs modernes, aucune config requise
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onupgradeneeded = () => {
        this.db = request.result;
        
        // Créer les stores (tables)
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

  // Export pour transfert entre appareils
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

  // Import depuis autre appareil
  async importData(data: ExportData): Promise<void> {
    if (!data.recipes || !Array.isArray(data.recipes)) {
      throw new Error('Format de données invalide');
    }

    for (const recipe of data.recipes) {
      await this.saveRecipe(recipe);
    }
  }
}

// Instance singleton
export const recipeStorage = new RecipeStorageService();
