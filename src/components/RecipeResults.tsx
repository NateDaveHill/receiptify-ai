import { Clock, ChefHat, TrendingUp, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface Recipe {
  id: string;
  title: string;
  image: string;
  cookingTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  matchPercentage: number;
  servings: number;
  cuisine?: string;
}

interface RecipeResultsProps {
  recipes?: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onBack: () => void;
  onNewScan: () => void;
  isLoading?: boolean;
  error?: string;
}

export default function RecipeResults({
  recipes = [],
  onSelectRecipe,
  onBack,
  onNewScan,
  isLoading = false,
  error = ''
}: RecipeResultsProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-emerald-600';
    if (percentage >= 60) return 'text-amber-600';
    return 'text-slate-600';
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Button onClick={onBack} variant="ghost" size="icon" className="text-slate-600">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900">Recipe Suggestions</h2>
              <p className="text-sm text-slate-500">
                {isLoading ? 'Finding recipes...' : `${recipes.length} recipes found`}
              </p>
            </div>
            <Button
              onClick={onNewScan}
              variant="outline"
              size="sm"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              New Scan
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-slate-200 rounded-lg" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                      <div className="h-3 bg-slate-200 rounded w-1/3" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-amber-800">{error}</p>
            </div>
          )}

          {/* No Results */}
          {!isLoading && recipes.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Recipes Found</h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                We couldn't find recipes matching your ingredients. Try adding more items or scanning again.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={onBack} variant="outline">
                  Edit Ingredients
                </Button>
                <Button onClick={onNewScan} className="bg-emerald-600 hover:bg-emerald-700">
                  New Scan
                </Button>
              </div>
            </div>
          )}

          {/* Recipe Cards */}
          {!isLoading && recipes.length > 0 && (
            <div className="space-y-4">
              {recipes.map((recipe) => (
                <Card
                  key={recipe.id}
                  onClick={() => onSelectRecipe(recipe)}
                  className="overflow-hidden border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all cursor-pointer bg-white"
                >
                  <div className="flex gap-4 p-4">
                    {/* Recipe Image */}
                    <div className="relative w-28 h-28 flex-shrink-0">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {recipe.matchPercentage >= 80 && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Recipe Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                        {recipe.title}
                      </h3>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className={getDifficultyColor(recipe.difficulty)}>
                          {recipe.difficulty}
                        </Badge>
                        {recipe.cuisine && (
                          <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
                            {recipe.cuisine}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{recipe.cookingTime} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ChefHat className="w-4 h-4" />
                          <span>{recipe.servings} servings</span>
                        </div>
                      </div>

                      {/* Match Percentage */}
                      <div className="mt-3 flex items-center gap-2">
                        <TrendingUp className={`w-4 h-4 ${getMatchColor(recipe.matchPercentage)}`} />
                        <div className="flex-1">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                              style={{ width: `${recipe.matchPercentage}%` }}
                            />
                          </div>
                        </div>
                        <span className={`text-sm font-semibold ${getMatchColor(recipe.matchPercentage)}`}>
                          {recipe.matchPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}