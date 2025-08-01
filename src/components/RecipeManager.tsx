import React, { useState } from 'react';
import { ChefHat, Plus, Search, Download, Upload, Filter, X } from 'lucide-react';
import { useRecipes } from '../hooks/useRecipes';
import { Recipe } from '../services/recipeStorage';
import RecipeCard from './RecipeCard';
import RecipeForm from './RecipeForm';

interface RecipeManagerProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export default function RecipeManager({ isOpen, onClose }: RecipeManagerProps) {
  const { 
    recipes, 
    isLoading, 
    error, 
    searchRecipes, 
    exportRecipes, 
    importRecipes 
  } = useRecipes();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | Recipe['type']>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  if (!isOpen) return null;

  // Filtrage des recettes
  const getFilteredRecipes = (): Recipe[] => {
    let filtered = searchQuery ? searchRecipes(searchQuery) : recipes;
    
    if (filterType !== 'all') {
      filtered = filtered.filter(recipe => recipe.type === filterType);
    }
    
    return filtered;
  };

  const filteredRecipes = getFilteredRecipes();

  // Export des recettes
  const handleExport = async () => {
    try {
      const blob = await exportRecipes();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mes-recettes-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur export:', err);
    }
  };

  // Import des recettes
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importRecipes(file).catch(err => {
        console.error('Erreur import:', err);
      });
    }
    // Reset l'input
    event.target.value = '';
  };

  const handleCreateNew = () => {
    setEditingRecipe(null);
    setShowCreateForm(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowCreateForm(true);
  };

  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingRecipe(null);
  };

  if (showCreateForm) {
    return (
      <RecipeForm
        isOpen={true}
        onClose={handleFormClose}
        editingRecipe={editingRecipe}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <ChefHat className="h-6 w-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Mes Recettes</h2>
              <p className="text-sm text-gray-600">{filteredRecipes.length} recette(s)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 border-b bg-gray-50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Recherche et filtres */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Barre de recherche */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une recette..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Filtre par type */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                >
                  <option value="all">Tous les types</option>
                  <option value="dejeuner">Déjeuners</option>
                  <option value="diner">Dîners</option>
                  <option value="collation">Collations</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {/* Import */}
              <label className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <Upload className="h-4 w-4" />
                Importer
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              {/* Export */}
              <button
                onClick={handleExport}
                disabled={recipes.length === 0}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="h-4 w-4" />
                Exporter
              </button>

              {/* Créer nouvelle recette */}
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Nouvelle Recette
              </button>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto p-6">
          {(() => {
            if (isLoading) {
              return (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des recettes...</p>
                  </div>
                </div>
              );
            }

            if (error) {
              return (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="text-red-500 text-lg mb-2">❌</div>
                    <p className="text-red-600 font-medium">Erreur</p>
                    <p className="text-gray-600">{error}</p>
                  </div>
                </div>
              );
            }

            if (filteredRecipes.length === 0) {
              const isFiltered = searchQuery || filterType !== 'all';
              return (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium mb-2">
                      {isFiltered ? 'Aucune recette trouvée' : 'Aucune recette encore'}
                    </p>
                    <p className="text-gray-500 mb-4">
                      {isFiltered
                        ? 'Essayez de modifier vos critères de recherche'
                        : 'Commencez par créer votre première recette'
                      }
                    </p>
                    <button
                      onClick={handleCreateNew}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Créer ma première recette
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onEdit={() => handleEditRecipe(recipe)}
                  />
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
