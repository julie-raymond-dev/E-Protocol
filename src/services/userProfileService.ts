import { UserProfile } from '../types';

/**
 * Service for managing user profile with IndexedDB storage and metabolic calculations
 * Handles BMR, TDEE, and macro calculations for both standard and protein diets
 */
export class UserProfileService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'E-Protocol-DB';
  private readonly DB_VERSION = 2; // Increment version to add userProfile store

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
        
        // Create recipes store if it doesn't exist (for compatibility)
        if (!this.db.objectStoreNames.contains('recipes')) {
          const recipeStore = this.db.createObjectStore('recipes', { keyPath: 'id' });
          recipeStore.createIndex('type', 'type', { unique: false });
          recipeStore.createIndex('name', 'name', { unique: false });
        }

        // Create ingredients store if it doesn't exist (for compatibility)
        if (!this.db.objectStoreNames.contains('ingredients')) {
          const ingredientStore = this.db.createObjectStore('ingredients', { keyPath: 'id' });
          ingredientStore.createIndex('name', 'name', { unique: false });
        }

        // Create userProfile store
        if (!this.db.objectStoreNames.contains('userProfile')) {
          this.db.createObjectStore('userProfile', { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ UserProfile IndexedDB initialisé avec succès');
        resolve();
      };

      request.onerror = () => {
        console.error('❌ Erreur UserProfile IndexedDB:', request.error);
        reject(new Error('Failed to initialize UserProfile IndexedDB'));
      };
    });
  }

  /**
   * Calculates Basal Metabolic Rate using Mifflin-St Jeor equation
   * @param {number} poids - Weight in kg
   * @param {number} taille - Height in cm
   * @param {number} age - Age in years
   * @param {'femme' | 'homme'} sexe - Gender
   * @returns {number} BMR in calories
   */
  calculateBMR(poids: number, taille: number, age: number, sexe: 'femme' | 'homme'): number {
    const baseBMR = 10 * poids + 6.25 * taille - 5 * age;
    return sexe === 'homme' ? baseBMR + 5 : baseBMR - 161;
  }

  /**
   * Calculates Total Daily Energy Expenditure
   * @param {number} bmr - Basal Metabolic Rate
   * @param {number} niveauActivite - Activity level multiplier (1.2-1.9)
   * @returns {number} TDEE in calories
   */
  calculateTDEE(bmr: number, niveauActivite: number): number {
    return Math.round(bmr * niveauActivite);
  }

  /**
   * Calculates target calories based on objective
   * @param {number} tdee - Total Daily Energy Expenditure
   * @param {'perte' | 'maintien' | 'prise'} objectif - Weight goal
   * @returns {number} Target calories
   */
  calculateTargetCalories(tdee: number, objectif: 'perte' | 'maintien' | 'prise'): number {
    switch (objectif) {
      case 'perte':
        return Math.round(tdee * 0.8); // -20% pour perte de poids
      case 'maintien':
        return tdee;
      case 'prise':
        return Math.round(tdee * 1.1); // +10% pour prise de poids
      default:
        return tdee;
    }
  }

  /**
   * Calculates macro distribution based on diet type
   * @param {number} calories - Target calories
   * @param {number} poids - Weight in kg for protein calculation
   * @param {'standard' | 'proteine_glucides_reduits'} regimeType - Diet type
   * @returns {object} Macros in grams
   */
  calculateMacros(calories: number, poids: number, regimeType: 'standard' | 'proteine_glucides_reduits'): {
    proteines: number;
    lipides: number;
    glucides: number;
  } {
    if (regimeType === 'proteine_glucides_reduits') {
      // Régime Ultra-Protéiné / Low Carb (sèche)
      // Protéines: 2.2 à 2.8 g/kg (30-35% des calories)
      // Glucides: ≤75g/jour (15-20% max des calories)
      // Lipides: Le reste (45-55% des calories)
      
      const proteines = Math.round(poids * 2.5); // 2.5g/kg (milieu de la fourchette)
      const glucides = Math.min(75, Math.round((calories * 0.18) / 4)); // Max 75g ou 18% des calories
      
      const proteinCalories = proteines * 4;
      const glucideCalories = glucides * 4;
      const lipides = Math.round((calories - proteinCalories - glucideCalories) / 9);
      
      return { proteines, lipides, glucides };
    } else {
      // Régime Standard (équilibré)
      // Protéines: 2g/kg (~25% des calories)
      // Lipides: 1g/kg (~25% des calories) 
      // Glucides: Le reste (~50% des calories)
      
      const proteines = Math.round(poids * 2); // 2g/kg
      const lipides = Math.round(poids * 1); // 1g/kg
      
      const proteinCalories = proteines * 4;
      const lipidCalories = lipides * 9;
      const glucides = Math.round((calories - proteinCalories - lipidCalories) / 4);
      
      return { proteines, lipides, glucides };
    }
  }  /**
   * Saves user profile to IndexedDB
   * @param {UserProfile} profile - The profile to save
   * @returns {Promise<void>} Resolves when profile is saved
   * @throws {Error} When save operation fails
   */
  async saveUserProfile(profile: UserProfile): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error('DB not initialized');
    
    const transaction = this.db.transaction(['userProfile'], 'readwrite');
    const store = transaction.objectStore('userProfile');
    
    return new Promise((resolve, reject) => {
      const request = store.put(profile);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to save user profile'));
    });
  }

  /**
   * Retrieves user profile from IndexedDB
   * @param {string} userId - The user ID (typically 'current')
   * @returns {Promise<UserProfile | null>} The user profile or null if not found
   * @throws {Error} When retrieval fails
   */
  async getUserProfile(userId: string = 'current'): Promise<UserProfile | null> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error('DB not initialized');
    
    const transaction = this.db.transaction(['userProfile'], 'readonly');
    const store = transaction.objectStore('userProfile');
    
    return new Promise((resolve, reject) => {
      const request = store.get(userId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(new Error('Failed to fetch user profile'));
    });
  }

  /**
   * Creates or updates a complete user profile with calculated values
   * @param {Partial<UserProfile>} profileData - Profile data without calculated fields
   * @returns {Promise<UserProfile>} The complete profile with calculations
   */
  async createOrUpdateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const { poids, taille, age, sexe, niveau_activite, niveau_activite_label, objectif, regime_type } = profileData;
    
    if (!poids || !taille || !age || !sexe || !niveau_activite || !objectif || !regime_type) {
      throw new Error('Données de profil incomplètes');
    }

    // Calculate metabolic values
    const bmr = this.calculateBMR(poids, taille, age, sexe);
    const tdee = this.calculateTDEE(bmr, niveau_activite);
    const calories_cibles = this.calculateTargetCalories(tdee, objectif);
    const macros_cibles = this.calculateMacros(calories_cibles, poids, regime_type);

    const now = new Date().toISOString();
    const existingProfile = await this.getUserProfile();
    
    const profile: UserProfile = {
      id: 'current',
      poids,
      taille,
      age,
      sexe,
      niveau_activite,
      niveau_activite_label: niveau_activite_label || this.getActivityLabel(niveau_activite),
      objectif,
      regime_type,
      bmr,
      tdee,
      calories_cibles,
      macros_cibles,
      createdAt: existingProfile?.createdAt || now,
      updatedAt: now,
    };

    await this.saveUserProfile(profile);
    return profile;
  }

  /**
   * Gets descriptive label for activity level
   * @param {number} niveau - Activity level number
   * @returns {string} Descriptive label
   */
  private getActivityLabel(niveau: number): string {
    if (niveau <= 1.2) return 'Sédentaire';
    if (niveau <= 1.375) return 'Légèrement actif';
    if (niveau <= 1.55) return 'Modérément actif';
    if (niveau <= 1.725) return 'Très actif';
    return 'Extrêmement actif';
  }

  /**
   * Deletes user profile from IndexedDB
   * @param {string} userId - The user ID to delete
   * @returns {Promise<void>} Resolves when profile is deleted
   */
  async deleteUserProfile(userId: string = 'current'): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) throw new Error('DB not initialized');
    
    const transaction = this.db.transaction(['userProfile'], 'readwrite');
    const store = transaction.objectStore('userProfile');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(userId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete user profile'));
    });
  }
}

export const userProfileService = new UserProfileService();
