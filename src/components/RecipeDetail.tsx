import { ArrowLeft, Clock, ChefHat, Users, Check, X, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col">
      {/* Header with Image */}
      <div className="relative">
        <div className="h-64 overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-white/90 hover:bg-white text-slate-900 shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/90 hover:bg-white text-slate-900 shadow-lg"
          >
            <Share2 className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/90 hover:bg-white text-slate-900 shadow-lg"
          >
            <Heart className="w-5 h-5" />
          </Button>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-2xl font-bold text-white mb-2">{recipe.title}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={`${getDifficultyColor(recipe.difficulty)} backdrop-blur-sm`}>
              {recipe.difficulty}
            </Badge>
            {recipe.cuisine && (
              <Badge variant="outline" className="bg-white/90 text-slate-700 border-white/50 backdrop-blur-sm">
                {recipe.cuisine}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <Card className="p-4 border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Clock className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-sm font-semibold text-slate-900">{recipe.cookingTime} min</p>
                <p className="text-xs text-slate-500">Cook Time</p>
              </div>
              <div>
                <Users className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-sm font-semibold text-slate-900">{recipe.servings}</p>
                <p className="text-xs text-slate-500">Servings</p>
              </div>
              <div>
                <ChefHat className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-sm font-semibold text-slate-900">{recipe.difficulty}</p>
                <p className="text-xs text-slate-500">Difficulty</p>
              </div>
            </div>
          </Card>

          {/* Description */}
          {recipe.description && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">About This Recipe</h2>
              <p className="text-slate-600 leading-relaxed">{recipe.description}</p>
            </div>
          )}

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-900">Ingredients</h2>
              <div className="text-sm text-slate-600">
                <span className="text-emerald-600 font-semibold">{availableCount}</span> available
                {missingCount > 0 && (
                  <span className="ml-2">
                    <span className="text-amber-600 font-semibold">{missingCount}</span> missing
                  </span>
                )}
              </div>
            </div>

            <Card className="divide-y divide-slate-100 border-slate-200 bg-white shadow-sm overflow-hidden">
              {recipe.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className={`p-4 flex items-center gap-3 ${
                    ingredient.available ? 'bg-white' : 'bg-amber-50/50'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      ingredient.available
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    {ingredient.available ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{ingredient.name}</p>
                  </div>
                  <p className="text-sm text-slate-600 font-medium">{ingredient.amount}</p>
                </div>
              ))}
            </Card>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Instructions</h2>
            <div className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <Card key={index} className="p-4 border-slate-200 bg-white shadow-sm">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-slate-700 leading-relaxed flex-1 pt-1">{instruction}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Nutrition (Optional) */}
          {recipe.nutrition && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Nutrition Per Serving</h2>
              <Card className="p-4 border-slate-200 bg-white shadow-sm">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{recipe.nutrition.calories}</p>
                    <p className="text-xs text-slate-500 mt-1">Calories</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{recipe.nutrition.protein}</p>
                    <p className="text-xs text-slate-500 mt-1">Protein</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{recipe.nutrition.carbs}</p>
                    <p className="text-xs text-slate-500 mt-1">Carbs</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{recipe.nutrition.fat}</p>
                    <p className="text-xs text-slate-500 mt-1">Fat</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Bottom Spacing */}
          <div className="h-20" />
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-6 bg-white border-t border-slate-200 shadow-lg">
        <Button className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-lg font-semibold shadow-lg">
          Start Cooking
        </Button>
      </div>
    </div>
  );
}