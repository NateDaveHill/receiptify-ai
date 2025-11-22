import { Clock, ChefHat, TrendingUp, ArrowLeft, Sparkles, Camera } from 'lucide-react';

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
      case 'Easy': return 'from-emerald-400 to-teal-400';
      case 'Medium': return 'from-amber-400 to-orange-400';
      case 'Hard': return 'from-red-400 to-pink-400';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  const getMatchGradient = (percentage: number) => {
    if (percentage >= 80) return 'from-emerald-500 via-teal-500 to-cyan-500';
    if (percentage >= 60) return 'from-amber-500 via-orange-500 to-red-500';
    return 'from-slate-400 via-slate-500 to-slate-600';
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400 flex flex-col overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-300 rounded-full blur-3xl animate-pulse delay-75" />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h2 className="text-2xl font-black text-white tracking-tight">Your Recipe Mix</h2>
              <p className="text-sm text-white/80 font-medium">
                {isLoading ? 'Curating your playlist...' : `${recipes.length} perfect matches`}
              </p>
            </div>
            <button
              onClick={onNewScan}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-xl rounded-xl text-white font-semibold text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              New Scan
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="p-6 pb-24 space-y-4 max-w-4xl mx-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 animate-pulse border border-white/20"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-white/20 rounded-2xl" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-white/20 rounded-lg w-3/4" />
                      <div className="h-4 bg-white/20 rounded-lg w-1/2" />
                      <div className="h-4 bg-white/20 rounded-lg w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="bg-orange-100 border-2 border-orange-300 rounded-2xl p-5 shadow-xl">
              <p className="text-sm text-orange-900 font-semibold">{error}</p>
            </div>
          )}

          {/* No Results */}
          {!isLoading && recipes.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl items-center justify-center mx-auto mb-6 border-2 border-white/20">
                <ChefHat className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-black text-white mb-3">No Recipes Found</h3>
              <p className="text-white/80 mb-8 max-w-sm mx-auto text-lg">
                Couldn't find the perfect match. Try different ingredients!
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={onBack}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-xl rounded-xl text-white font-bold transition-all hover:scale-105 active:scale-95"
                >
                  Edit Ingredients
                </button>
                <button
                  onClick={onNewScan}
                  className="px-6 py-3 bg-white hover:bg-white/90 rounded-xl text-fuchsia-600 font-black transition-all hover:scale-105 active:scale-95"
                >
                  New Scan
                </button>
              </div>
            </div>
          )}

          {/* Recipe Cards - Spotify Style */}
          {!isLoading && recipes.length > 0 && (
            <div className="space-y-3">
              {recipes.map((recipe, index) => (
                <div
                  key={recipe.id}
                  onClick={() => onSelectRecipe(recipe)}
                  className="group relative bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/20 rounded-3xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex gap-4 p-4">
                    {/* Album Art Style Image */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <div className={`absolute -inset-1 bg-gradient-to-br ${getDifficultyColor(recipe.difficulty)} rounded-2xl opacity-60 blur-sm group-hover:opacity-100 transition-opacity`} />
                      <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-xl">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Track number badge */}
                      <div className="absolute -top-2 -left-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg font-black text-sm text-slate-900">
                        {index + 1}
                      </div>
                      {recipe.matchPercentage >= 80 && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-black text-white text-lg mb-1 line-clamp-2 group-hover:underline">
                          {recipe.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getDifficultyColor(recipe.difficulty)}`}>
                            {recipe.difficulty}
                          </span>
                          {recipe.cuisine && (
                            <span className="text-white/70 text-sm font-medium">
                              {recipe.cuisine}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-white/80 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{recipe.cookingTime}m</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ChefHat className="w-4 h-4" />
                          <span>{recipe.servings}</span>
                        </div>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-black text-white">{recipe.matchPercentage}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Match percentage bar */}
                  <div className="h-1 bg-white/10">
                    <div
                      className={`h-full bg-gradient-to-r ${getMatchGradient(recipe.matchPercentage)} transition-all duration-500`}
                      style={{ width: `${recipe.matchPercentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed stats footer */}
      {!isLoading && recipes.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 via-black/40 to-transparent backdrop-blur-xl border-t border-white/10 pointer-events-none z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-between text-white/90">
            <div className="text-center">
              <p className="text-2xl font-black">{recipes.length}</p>
              <p className="text-xs font-medium opacity-80">Recipes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black">
                {Math.round(recipes.reduce((sum, r) => sum + r.matchPercentage, 0) / recipes.length)}%
              </p>
              <p className="text-xs font-medium opacity-80">Avg Match</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black">
                {Math.round(recipes.reduce((sum, r) => sum + r.cookingTime, 0) / recipes.length)}m
              </p>
              <p className="text-xs font-medium opacity-80">Avg Time</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
