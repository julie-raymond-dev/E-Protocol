import { Edit2, Trash2, Clock, Users } from 'lucide-react';
import { Recipe } from '../services/recipeStorage';
import { useRecipes } from '../hooks/useRecipes';

/**
 * Props for the RecipeCard component
 */
interface RecipeCardProps {
  readonly recipe: Recipe;
  readonly onEdit: () => void;
}

/**
 * Recipe card component displaying recipe information with edit/delete actions
 * @param {RecipeCardProps} props - Component props
 * @param {Recipe} props.recipe - Recipe data to display
 * @param {function} props.onEdit - Callback function to edit the recipe
 * @returns {JSX.Element} Recipe card component
 */
export default function RecipeCard({ recipe, onEdit }: RecipeCardProps) {
  const { deleteRecipe } = useRecipes();

  /**
   * Handles recipe deletion with confirmation dialog
   */
  const handleDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la recette "${recipe.name}" ?`)) {
      try {
        await deleteRecipe(recipe.id);
      } catch (err) {
        console.error('Erreur suppression:', err);
      }
    }
  };

  /**
   * Returns the appropriate color class for recipe type
   * @param {Recipe['type']} type - Recipe type
   * @returns {string} CSS class for type color
   */
  const getTypeColor = (type: Recipe['type']) => {
    switch (type) {
      case 'dejeuner':
        return 'bg-yellow-100 text-yellow-800';
      case 'diner':
        return 'bg-orange-100 text-orange-800';
      case 'collation':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Returns the display label for recipe type
   * @param {Recipe['type']} type - Recipe type
   * @returns {string} Human-readable type label
   */
  const getTypeLabel = (type: Recipe['type']) => {
    switch (type) {
      case 'dejeuner':
        return 'Déjeuner';
      case 'diner':
        return 'Dîner';
      case 'collation':
        return 'Collation';
      default:
        return type;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-purple-200 transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">{recipe.name}</h3>
          <div className="flex gap-1 ml-2">
            <button
              onClick={onEdit}
              className="p-1.5 rounded-full hover:bg-purple-100 text-purple-600 transition-colors"
              title="Modifier"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            {!recipe.isDefault && (
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(recipe.type)}`}>
            {getTypeLabel(recipe.type)}
          </span>
          {recipe.isDefault && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Par défaut
            </span>
          )}
        </div>
      </div>

      {/* Macros */}
      <div className="p-4 border-b border-gray-100">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">{Math.round(recipe.kcal)}</div>
            <div className="text-xs text-gray-500">kcal</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-600">{Math.round(recipe.P)}g</div>
            <div className="text-xs text-gray-500">P</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{Math.round(recipe.L)}g</div>
            <div className="text-xs text-gray-500">L</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{Math.round(recipe.G)}g</div>
            <div className="text-xs text-gray-500">G</div>
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {recipe.ingredients.length} ingrédient(s)
          </span>
        </div>
        
        <div className="space-y-1 max-h-24 overflow-y-auto">
          {recipe.ingredients.slice(0, 3).map((ingredient) => (
            <div key={ingredient.id || ingredient.name} className="text-sm text-gray-600 flex justify-between">
              <span className="truncate">{ingredient.name}</span>
              <span className="text-gray-500 ml-2 flex-shrink-0">
                {ingredient.quantity}{ingredient.unit}
              </span>
            </div>
          ))}
          {recipe.ingredients.length > 3 && (
            <div className="text-xs text-gray-500 italic">
              +{recipe.ingredients.length - 3} autres ingrédients...
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              Créé le {new Date(recipe.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
          {recipe.updatedAt !== recipe.createdAt && (
            <span>
              Modifié le {new Date(recipe.updatedAt).toLocaleDateString('fr-FR')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
