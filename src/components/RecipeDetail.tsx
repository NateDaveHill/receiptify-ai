import { ArrowLeft, Clock, ChefHat, Users, Check, X, Sparkles } from 'lucide-react';
import { Recipe } from './RecipeResults';

export interface RecipeDetailData extends Recipe {
  description: string;
  ingredients: {
    name: string;
    amount: string;
    available: boolean;
  }[];
  instructions: string[];
  nutrition?: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
}

interface RecipeDetailProps {
  recipe: RecipeDetailData;
  onBack: () => void;
}

export default function RecipeDetail({ recipe, onBack }: RecipeDetailProps) {
  const availableCount = recipe.ingredients.filter(i => i.available).length;
  const missingCount = recipe.ingredients.length - availableCount;

  const getDifficultyGradient = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'from-emerald-400 to-teal-400';
      case 'Medium': return 'from-amber-400 to-orange-400';
      case 'Hard': return 'from-red-400 to-pink-400';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-orange-50 flex flex-col overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-violet-300 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-fuchsia-300 rounded-full blur-3xl animate-pulse delay-75" />
      </div>

      {/* Hero Image Section */}
      <div className="relative z-10">
        <div className="relative h-72 overflow-hidden">
          {/* Image with gradient overlay */}
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Floating difficulty badge */}
          <div className={`absolute top-6 right-6 px-4 py-2 bg-gradient-to-r ${getDifficultyGradient(recipe.difficulty)} rounded-full shadow-2xl`}>
            <p className="text-white font-black text-sm uppercase tracking-wide">{recipe.difficulty}</p>
          </div>

          {/* Back button */}
          <button
            onClick={onBack}
            className="absolute top-6 left-6 w-12 h-12 bg-white/10 backdrop-blur-xl hover:bg-white/20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 active:scale-95 border border-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-1">
                  <h1 className="text-3xl font-black text-white drop-shadow-2xl mb-2 leading-tight">
                    {recipe.title}
                  </h1>
                  <p className="text-white/90 text-sm font-medium drop-shadow-lg">
                    {recipe.cuisine && `${recipe.cuisine} • `}{recipe.description}
                  </p>
                </div>
                {recipe.matchPercentage >= 80 && (
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 px-6 py-4 shadow-2xl">
          <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-5 h-5 text-white" />
                <p className="text-2xl font-black text-white">{recipe.cookingTime}</p>
              </div>
              <p className="text-xs text-white/80 font-semibold uppercase tracking-wide">Minutes</p>
            </div>
            <div className="text-center border-x border-white/20">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="w-5 h-5 text-white" />
                <p className="text-2xl font-black text-white">{recipe.servings}</p>
              </div>
              <p className="text-xs text-white/80 font-semibold uppercase tracking-wide">Servings</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ChefHat className="w-5 h-5 text-white" />
                <p className="text-2xl font-black text-white">{recipe.matchPercentage}%</p>
              </div>
              <p className="text-xs text-white/80 font-semibold uppercase tracking-wide">Match</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="p-6 pb-24 space-y-6 max-w-4xl mx-auto">
          {/* Ingredients Section - Receipt Style */}
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-white overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 p-5 text-center">
              <h2 className="text-xl font-black text-white tracking-tight uppercase">Ingredients</h2>
              <p className="text-white/90 text-xs font-mono mt-1">
                {availableCount} of {recipe.ingredients.length} items ready
              </p>
            </div>

            <div className="p-6 space-y-1" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.02) 1px, rgba(0,0,0,0.02) 2px)' }}>
              {recipe.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className={`flex items-start justify-between py-3 border-b border-slate-200 ${
                    ingredient.available ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      ingredient.available
                        ? 'bg-gradient-to-br from-emerald-400 to-teal-400'
                        : 'bg-slate-200'
                    }`}>
                      {ingredient.available ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <X className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm uppercase tracking-wide ${
                        ingredient.available ? 'text-slate-900' : 'text-slate-400'
                      }`}>
                        {ingredient.name}
                      </p>
                    </div>
                  </div>
                  <p className="font-mono text-sm font-bold text-slate-600 ml-3">
                    {ingredient.amount}
                  </p>
                </div>
              ))}

              {missingCount > 0 && (
                <div className="mt-4 pt-4 border-t-2 border-dashed border-orange-300 bg-orange-50 -mx-6 px-6 py-3">
                  <p className="text-xs text-orange-900 font-bold">
                    ⚠️ {missingCount} ingredient{missingCount > 1 ? 's' : ''} missing - add to shopping list
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Instructions Section */}
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-white overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 p-5 text-center">
              <h2 className="text-xl font-black text-white tracking-tight uppercase">Instructions</h2>
              <p className="text-white/90 text-xs font-mono mt-1">
                {recipe.instructions.length} steps to perfection
              </p>
            </div>

            <div className="p-6 space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <div
                  key={index}
                  className="flex gap-4 group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="text-white font-black text-sm">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-1.5">
                    <p className="text-slate-900 leading-relaxed font-medium">
                      {instruction}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition Info */}
          {recipe.nutrition && (
            <div className="bg-white rounded-3xl shadow-2xl border-4 border-white overflow-hidden">
              <div className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 p-5 text-center">
                <h2 className="text-xl font-black text-white tracking-tight uppercase">Nutrition Facts</h2>
                <p className="text-white/90 text-xs font-mono mt-1">
                  Per serving
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl p-4">
                    <p className="text-3xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                      {recipe.nutrition.calories}
                    </p>
                    <p className="text-xs font-bold text-slate-600 mt-1 uppercase">Calories</p>
                  </div>
                  <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl p-4">
                    <p className="text-3xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                      {recipe.nutrition.protein}
                    </p>
                    <p className="text-xs font-bold text-slate-600 mt-1 uppercase">Protein</p>
                  </div>
                  <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl p-4">
                    <p className="text-3xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                      {recipe.nutrition.carbs}
                    </p>
                    <p className="text-xs font-bold text-slate-600 mt-1 uppercase">Carbs</p>
                  </div>
                  <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl p-4">
                    <p className="text-3xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                      {recipe.nutrition.fat}
                    </p>
                    <p className="text-xs font-bold text-slate-600 mt-1 uppercase">Fat</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center py-6">
            <p className="text-slate-400 text-sm font-mono">★★★ AI POWERED RECIPE ★★★</p>
            <p className="text-slate-300 text-xs font-mono mt-2">Receiptify Kitchen</p>
          </div>
        </div>
      </div>
    </div>
  );
}
