import React, { useState, useEffect, useCallback } from 'react';
import { X, Plus, Trash2, Calculator } from 'lucide-react';
import { Recipe, Ingredient } from '../services/recipeStorage';
import { useRecipes } from '../hooks/useRecipes';

interface RecipeFormProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly editingRecipe?: Recipe | null;
}

interface FormIngredient extends Ingredient {
  tempId: string; // Pour la gestion locale avant sauvegarde
}

export default function RecipeForm({ isOpen, onClose, editingRecipe }: RecipeFormProps) {
  const { createRecipe, updateRecipe, calculateRecipeMacros, generateRecipeId } = useRecipes();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'dejeuner' as Recipe['type'],
  });
  
  const [ingredients, setIngredients] = useState<FormIngredient[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Générer un ID temporaire pour les ingrédients
  const generateTempId = () => `temp_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

  // Fonction pour créer un ingrédient vide
  const createEmptyIngredient = useCallback((): FormIngredient => ({
    id: '',
    tempId: generateTempId(),
    name: '',
    quantity: 0,
    unit: 'g',
    macros: {
      kcal: 0,
      P: 0,
      L: 0,
      G: 0,
    },
  }), []);

  // Initialiser le formulaire
  useEffect(() => {
    if (editingRecipe) {
      setFormData({
        name: editingRecipe.name,
        type: editingRecipe.type,
      });
      setIngredients(editingRecipe.ingredients.map(ing => ({
        ...ing,
        tempId: generateTempId(),
      })));
    } else {
      // Nouveau formulaire
      setFormData({
        name: '',
        type: 'dejeuner',
      });
      setIngredients([createEmptyIngredient()]);
    }
    setErrors({});
  }, [editingRecipe, isOpen, createEmptyIngredient]);

  // Calculer les macros totales
  const totalMacros = calculateRecipeMacros(ingredients);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la recette est obligatoire';
    }

    if (ingredients.length === 0) {
      newErrors.ingredients = 'Au moins un ingrédient est requis';
    }

    const validIngredients = ingredients.filter(ing => 
      ing.name.trim() && ing.quantity > 0
    );

    if (validIngredients.length === 0) {
      newErrors.ingredients = 'Au moins un ingrédient valide est requis';
    }

    // Vérifier que chaque ingrédient a des macros valides
    const hasValidMacros = validIngredients.some(ing => 
      ing.macros.kcal > 0 || ing.macros.P > 0 || ing.macros.L > 0 || ing.macros.G > 0
    );

    if (!hasValidMacros) {
      newErrors.macros = 'Au moins un ingrédient doit avoir des macros renseignées';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const validIngredients = ingredients
        .filter(ing => ing.name.trim() && ing.quantity > 0)
        .map(ing => ({
          id: ing.id || generateRecipeId(),
          name: ing.name.trim(),
          quantity: ing.quantity,
          unit: ing.unit,
          macros: ing.macros,
        }));

      const recipeData = {
        name: formData.name.trim(),
        type: formData.type,
        kcal: totalMacros.kcal,
        P: totalMacros.P,
        L: totalMacros.L,
        G: totalMacros.G,
        ingredients: validIngredients,
      };

      if (editingRecipe) {
        await updateRecipe(editingRecipe.id, recipeData);
      } else {
        await createRecipe(recipeData);
      }

      onClose();
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      setErrors({ submit: 'Erreur lors de la sauvegarde' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gestion des ingrédients
  const updateIngredient = (tempId: string, updates: Partial<FormIngredient>) => {
    setIngredients(prev => 
      prev.map(ing => 
        ing.tempId === tempId ? { ...ing, ...updates } : ing
      )
    );
  };

  const addIngredient = () => {
    setIngredients(prev => [...prev, createEmptyIngredient()]);
  };

  const removeIngredient = (tempId: string) => {
    setIngredients(prev => prev.filter(ing => ing.tempId !== tempId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">
            {editingRecipe ? 'Modifier la recette' : 'Nouvelle recette'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          {/* Contenu */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Informations de base */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Informations générales</h3>
              
              {/* Nom */}
              <div>
                <label htmlFor="recipe-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la recette *
                </label>
                <input
                  id="recipe-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Poulet tikka quinoa maison"
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>

              {/* Type */}
              <div>
                <label htmlFor="recipe-type" className="block text-sm font-medium text-gray-700 mb-2">
                  Type de repas *
                </label>
                <select
                  id="recipe-type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Recipe['type'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="dejeuner">Déjeuner</option>
                  <option value="diner">Dîner</option>
                  <option value="collation">Collation</option>
                </select>
              </div>
            </div>

            {/* Ingrédients */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Ingrédients</h3>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter
                </button>
              </div>

              {errors.ingredients && (
                <p className="text-sm text-red-600">{errors.ingredients}</p>
              )}

              <div className="space-y-4">
                {ingredients.map((ingredient) => (
                  <IngredientForm
                    key={ingredient.tempId}
                    ingredient={ingredient}
                    onUpdate={(updates) => updateIngredient(ingredient.tempId, updates)}
                    onRemove={() => removeIngredient(ingredient.tempId)}
                    canRemove={ingredients.length > 1}
                  />
                ))}
              </div>
            </div>

            {/* Récapitulatif macros */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Macros totales calculées</h3>
              </div>
              
              {errors.macros && (
                <p className="text-sm text-red-600 mb-3">{errors.macros}</p>
              )}

              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{Math.round(totalMacros.kcal)}</div>
                  <div className="text-sm text-gray-500">kcal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{Math.round(totalMacros.P)}g</div>
                  <div className="text-sm text-gray-500">Protéines</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(totalMacros.L)}g</div>
                  <div className="text-sm text-gray-500">Lipides</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{Math.round(totalMacros.G)}g</div>
                  <div className="text-sm text-gray-500">Glucides</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex justify-end gap-3 flex-shrink-0">
            {errors.submit && (
              <p className="text-sm text-red-600 mr-auto self-center">{errors.submit}</p>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {(() => {
                if (isSubmitting) return 'Sauvegarde...';
                return editingRecipe ? 'Modifier' : 'Créer';
              })()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Composant pour un ingrédient
interface IngredientFormProps {
  readonly ingredient: FormIngredient;
  readonly onUpdate: (updates: Partial<FormIngredient>) => void;
  readonly onRemove: () => void;
  readonly canRemove: boolean;
}

function IngredientForm({ ingredient, onUpdate, onRemove, canRemove }: IngredientFormProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Ingrédient</h4>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-1 rounded-full hover:bg-red-100 text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Nom */}
        <div>
          <label htmlFor={`ingredient-name-${ingredient.tempId}`} className="block text-sm font-medium text-gray-700 mb-1">
            Nom *
          </label>
          <input
            id={`ingredient-name-${ingredient.tempId}`}
            type="text"
            value={ingredient.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Ex: Quinoa"
          />
        </div>

        {/* Quantité */}
        <div>
          <label htmlFor={`ingredient-quantity-${ingredient.tempId}`} className="block text-sm font-medium text-gray-700 mb-1">
            Quantité *
          </label>
          <input
            id={`ingredient-quantity-${ingredient.tempId}`}
            type="number"
            value={ingredient.quantity || ''}
            onChange={(e) => onUpdate({ quantity: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="100"
            min="0"
            step="0.1"
          />
        </div>

        {/* Unité */}
        <div>
          <label htmlFor={`ingredient-unit-${ingredient.tempId}`} className="block text-sm font-medium text-gray-700 mb-1">
            Unité
          </label>
          <select
            id={`ingredient-unit-${ingredient.tempId}`}
            value={ingredient.unit}
            onChange={(e) => onUpdate({ unit: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="g">grammes (g)</option>
            <option value="ml">millilitres (ml)</option>
            <option value="pièce">pièce(s)</option>
            <option value="cuillère">cuillère(s)</option>
            <option value="tasse">tasse(s)</option>
          </select>
        </div>
      </div>

      {/* Macros */}
      <div>
        <div className="block text-sm font-medium text-gray-700 mb-2">
          Macronutriments (pour la quantité indiquée)
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label htmlFor={`ingredient-kcal-${ingredient.tempId}`} className="block text-xs text-gray-600 mb-1">Calories</label>
            <input
              id={`ingredient-kcal-${ingredient.tempId}`}
              type="number"
              value={ingredient.macros.kcal || ''}
              onChange={(e) => onUpdate({ 
                macros: { ...ingredient.macros, kcal: parseFloat(e.target.value) || 0 }
              })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label htmlFor={`ingredient-P-${ingredient.tempId}`} className="block text-xs text-gray-600 mb-1">Protéines (g)</label>
            <input
              id={`ingredient-P-${ingredient.tempId}`}
              type="number"
              value={ingredient.macros.P || ''}
              onChange={(e) => onUpdate({ 
                macros: { ...ingredient.macros, P: parseFloat(e.target.value) || 0 }
              })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label htmlFor={`ingredient-L-${ingredient.tempId}`} className="block text-xs text-gray-600 mb-1">Lipides (g)</label>
            <input
              id={`ingredient-L-${ingredient.tempId}`}
              type="number"
              value={ingredient.macros.L || ''}
              onChange={(e) => onUpdate({ 
                macros: { ...ingredient.macros, L: parseFloat(e.target.value) || 0 }
              })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label htmlFor={`ingredient-G-${ingredient.tempId}`} className="block text-xs text-gray-600 mb-1">Glucides (g)</label>
            <input
              id={`ingredient-G-${ingredient.tempId}`}
              type="number"
              value={ingredient.macros.G || ''}
              onChange={(e) => onUpdate({ 
                macros: { ...ingredient.macros, G: parseFloat(e.target.value) || 0 }
              })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
