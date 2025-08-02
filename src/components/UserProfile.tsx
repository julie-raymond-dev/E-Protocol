import React, { useState, useEffect } from 'react';
import { X, User, Calculator, Save, Trash2 } from 'lucide-react';
import { UserProfile as UserProfileType } from '../types';
import { userProfileService } from '../services/userProfileService';
import { parseLocalFloat } from '../utils/numberUtils';

interface UserProfileProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onProfileChange?: () => void;
}

/**
 * Composant de gestion du profil utilisateur
 * Permet de saisir les informations personnelles et calcule automatiquement les macros
 */
export default function UserProfile({ isOpen, onClose, onProfileChange }: UserProfileProps) {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    poids: 0,
    taille: 0,
    age: 0,
    sexe: 'femme' as 'femme' | 'homme',
    niveau_activite: 1.375,
    objectif: 'maintien' as 'perte' | 'maintien' | 'prise',
    regime_type: 'standard' as 'standard' | 'proteine_glucides_reduits'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

    // Chargement du profil existant
  useEffect(() => {
    if (isOpen) {
      const loadProfile = async () => {
        try {
          const existingProfile = await userProfileService.getUserProfile();
          setProfile(existingProfile);
          
          if (existingProfile) {
            setFormData({
              poids: existingProfile.poids,
              taille: existingProfile.taille,
              age: existingProfile.age,
              sexe: existingProfile.sexe,
              niveau_activite: existingProfile.niveau_activite,
              objectif: existingProfile.objectif,
              regime_type: existingProfile.regime_type || 'standard'
            });
            setIsEditing(false);
          } else {
            setIsEditing(true);
          }
        } catch (error) {
          console.error('Erreur lors du chargement du profil:', error);
          setIsEditing(true);
        }
      };
      
      loadProfile();
    }
  }, [isOpen]);

  /**
   * Valide les données du formulaire
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.poids || formData.poids <= 0) {
      newErrors.poids = 'Le poids doit être supérieur à 0';
    }
    if (!formData.taille || formData.taille <= 0) {
      newErrors.taille = 'La taille doit être supérieure à 0';
    }
    if (!formData.age || formData.age <= 0) {
      newErrors.age = 'L\'âge doit être supérieur à 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Sauvegarde le profil
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const savedProfile = await userProfileService.createOrUpdateProfile(formData);
      setProfile(savedProfile);
      setIsEditing(false);
      // Notify parent component of profile change
      if (onProfileChange) {
        onProfileChange();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({ submit: 'Erreur lors de la sauvegarde' });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Supprime le profil
   */
  const handleDeleteProfile = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre profil ?')) {
      try {
        await userProfileService.deleteUserProfile();
        setProfile(null);
        setIsEditing(true);
        // Notify parent component of profile change
        if (onProfileChange) {
          onProfileChange();
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setErrors({ submit: 'Erreur lors de la suppression' });
      }
    }
  };

  /**
   * Options de niveau d'activité
   */
  const niveauxActivite = [
    { value: 1.2, label: 'Sédentaire (pas de sport)' },
    { value: 1.375, label: 'Légèrement actif (1-3 séances/semaine)' },
    { value: 1.55, label: 'Modérément actif (4-6 séances/semaine)' },
    { value: 1.725, label: 'Très actif (quotidien)' },
    { value: 1.9, label: 'Extrêmement actif (2×/jour)' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between flex-shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Mon Profil</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!isEditing && profile ? (
            /* Mode affichage */
            <div className="space-y-6">
              {/* Informations personnelles */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Poids</span>
                    <p className="font-semibold">{profile.poids} kg</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Taille</span>
                    <p className="font-semibold">{profile.taille} cm</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Âge</span>
                    <p className="font-semibold">{profile.age} ans</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Sexe</span>
                    <p className="font-semibold capitalize">{profile.sexe}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-600">Niveau d'activité</span>
                  <p className="font-semibold">{profile.niveau_activite_label}</p>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-600">Objectif</span>
                  <p className="font-semibold capitalize">{profile.objectif} de poids</p>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-600">Type de régime</span>
                  <p className="font-semibold">
                    {profile.regime_type === 'proteine_glucides_reduits' 
                      ? 'High Protein Low Carb (40/40/20)' 
                      : 'Standard (Équilibré)'
                    }
                  </p>
                </div>
              </div>

              {/* Calculs métaboliques */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Calculs métaboliques</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Métabolisme de base (BMR)</span>
                    <p className="text-xl font-bold text-blue-600">{profile.bmr} kcal/jour</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Dépense totale (TDEE)</span>
                    <p className="text-xl font-bold text-blue-600">{profile.tdee} kcal/jour</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Calories cibles</span>
                    <p className="text-xl font-bold text-green-600">{profile.calories_cibles} kcal/jour</p>
                  </div>
                </div>
              </div>

              {/* Macronutriments cibles */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Macronutriments cibles</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{profile.macros_cibles.proteines}g</div>
                    <div className="text-sm text-gray-600">Protéines</div>
                    <div className="text-xs text-gray-500">{profile.macros_cibles.proteines * 4} kcal</div>
                    <div className="text-xs text-purple-600 font-medium">
                      {Math.round((profile.macros_cibles.proteines * 4 / profile.calories_cibles) * 100)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{profile.macros_cibles.lipides}g</div>
                    <div className="text-sm text-gray-600">Lipides</div>
                    <div className="text-xs text-gray-500">{profile.macros_cibles.lipides * 9} kcal</div>
                    <div className="text-xs text-purple-600 font-medium">
                      {Math.round((profile.macros_cibles.lipides * 9 / profile.calories_cibles) * 100)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{profile.macros_cibles.glucides}g</div>
                    <div className="text-sm text-gray-600">Glucides</div>
                    <div className="text-xs text-gray-500">{profile.macros_cibles.glucides * 4} kcal</div>
                    <div className="text-xs text-purple-600 font-medium">
                      {Math.round((profile.macros_cibles.glucides * 4 / profile.calories_cibles) * 100)}%
                    </div>
                  </div>
                </div>
                
                {/* Détail du calcul pour régime High Protein Low Carb */}
                {profile.regime_type === 'proteine_glucides_reduits' && (
                  <div className="mt-4 p-3 bg-white rounded border-l-4 border-purple-500">
                    <h4 className="text-sm font-semibold text-purple-900 mb-2">
                      📊 Détail du calcul "High Protein Low Carb"
                    </h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>🧬 Protéines : 40% des calories = {profile.macros_cibles.proteines}g ({profile.macros_cibles.proteines * 4} kcal)</div>
                      <div>🧈 Lipides : 40% des calories = {profile.macros_cibles.lipides}g ({profile.macros_cibles.lipides * 9} kcal)</div>
                      <div>🍚 Glucides : 20% des calories = {profile.macros_cibles.glucides}g ({profile.macros_cibles.glucides * 4} kcal)</div>
                      <div className="pt-1 text-purple-700 font-medium">
                        ✨ Idéal pour : Sèche musculaire, recomposition corporelle, régime cétogène modéré
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between">
                <button
                  onClick={handleDeleteProfile}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer le profil
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Modifier
                </button>
              </div>
            </div>
          ) : (
            /* Mode édition */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {profile ? 'Modifier mes informations' : 'Créer mon profil'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Poids */}
                  <div>
                    <label htmlFor="poids" className="block text-sm font-medium text-gray-700 mb-2">
                      Poids (kg) *
                    </label>
                    <input
                      id="poids"
                      type="number"
                      value={formData.poids || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, poids: parseLocalFloat(e.target.value) }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.poids ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="51"
                      min="1"
                      step="0.1"
                    />
                    {errors.poids && <p className="text-sm text-red-600 mt-1">{errors.poids}</p>}
                  </div>

                  {/* Taille */}
                  <div>
                    <label htmlFor="taille" className="block text-sm font-medium text-gray-700 mb-2">
                      Taille (cm) *
                    </label>
                    <input
                      id="taille"
                      type="number"
                      value={formData.taille || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, taille: parseLocalFloat(e.target.value) }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.taille ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="158"
                      min="1"
                      step="1"
                    />
                    {errors.taille && <p className="text-sm text-red-600 mt-1">{errors.taille}</p>}
                  </div>

                  {/* Âge */}
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                      Âge (ans) *
                    </label>
                    <input
                      id="age"
                      type="number"
                      value={formData.age || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: parseLocalFloat(e.target.value) }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.age ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="32"
                      min="1"
                      step="1"
                    />
                    {errors.age && <p className="text-sm text-red-600 mt-1">{errors.age}</p>}
                  </div>

                  {/* Sexe */}
                  <div>
                    <label htmlFor="sexe" className="block text-sm font-medium text-gray-700 mb-2">
                      Sexe *
                    </label>
                    <select
                      id="sexe"
                      value={formData.sexe}
                      onChange={(e) => setFormData(prev => ({ ...prev, sexe: e.target.value as 'femme' | 'homme' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="femme">Femme</option>
                      <option value="homme">Homme</option>
                    </select>
                  </div>

                  {/* Niveau d'activité */}
                  <div className="md:col-span-2">
                    <label htmlFor="niveau-activite" className="block text-sm font-medium text-gray-700 mb-2">
                      Niveau d'activité physique *
                    </label>
                    <select
                      id="niveau-activite"
                      value={formData.niveau_activite}
                      onChange={(e) => setFormData(prev => ({ ...prev, niveau_activite: parseLocalFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      {niveauxActivite.map(niveau => (
                        <option key={niveau.value} value={niveau.value}>
                          {niveau.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Objectif */}
                  <div className="md:col-span-2">
                    <label htmlFor="objectif" className="block text-sm font-medium text-gray-700 mb-2">
                      Objectif *
                    </label>
                    <select
                      id="objectif"
                      value={formData.objectif}
                      onChange={(e) => setFormData(prev => ({ ...prev, objectif: e.target.value as 'perte' | 'maintien' | 'prise' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="perte">Perte de poids (déficit 15%)</option>
                      <option value="maintien">Maintien du poids</option>
                      <option value="prise">Prise de poids (surplus 10%)</option>
                    </select>
                  </div>

                  {/* Type de régime */}
                  <div className="md:col-span-2">
                    <label htmlFor="regime_type" className="block text-sm font-medium text-gray-700 mb-2">
                      Type de régime *
                    </label>
                    <select
                      id="regime_type"
                      value={formData.regime_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, regime_type: e.target.value as 'standard' | 'proteine_glucides_reduits' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="standard">Standard - Équilibré (2g/kg protéines, 1g/kg lipides, ~50% glucides)</option>
                      <option value="proteine_glucides_reduits">High Protein Low Carb (40% protéines, 40% lipides, 20% glucides)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.regime_type === 'proteine_glucides_reduits' 
                        ? '� Sèche/Low carb : ~30% protéines, ~15-20% glucides, ~50% lipides - Idéal pour la perte de gras avec maintien musculaire'
                        : '⚖️ Équilibré : ~25% protéines, ~25% lipides, ~50% glucides - Recomposition corporelle classique'
                      }
                    </p>                    {/* Détail des paramètres nutritionnels */}
                    {formData.regime_type === 'proteine_glucides_reduits' && (
                      <div className="mt-3 p-3 bg-purple-50 rounded border">
                        <h4 className="text-xs font-semibold text-purple-900 mb-2">
                          ⚙️ Paramètres nutritionnels "High Protein Low Carb"
                        </h4>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>🧬 <strong>Protéines :</strong> 40% des calories totales</div>
                          <div>🧈 <strong>Lipides :</strong> 40% des calories totales</div>
                          <div>🍚 <strong>Glucides :</strong> 20% des calories totales</div>
                          <div className="pt-1 text-purple-700">
                            <strong>✨ Idéal pour :</strong> Sèche musculaire, recomposition corporelle, régime cétogène modéré
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {errors.submit && (
                <p className="text-sm text-red-600">{errors.submit}</p>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3">
                {profile && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="h-4 w-4" />
                  {(() => {
                    if (isSubmitting) return 'Sauvegarde...';
                    return profile ? 'Modifier' : 'Créer le profil';
                  })()}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
