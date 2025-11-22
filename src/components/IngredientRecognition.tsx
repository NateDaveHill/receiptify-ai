import { useState, useEffect } from 'react';
import { X, Plus, Check, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export interface Ingredient {
  name: string;
  confidence: number;
}

interface IngredientRecognitionProps {
  imageData: string;
  detectedIngredients?: Ingredient[];
  onConfirm: (ingredients: string[]) => void;
  onRescan: () => void;
  isLoading?: boolean;
  error?: string;
}

export default function IngredientRecognition({
  imageData,
  detectedIngredients = [],
  onConfirm,
  onRescan,
  isLoading = false,
  error = ''
}: IngredientRecognitionProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(detectedIngredients);
  const [newIngredient, setNewIngredient] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);

  // Update local state when detectedIngredients prop changes
  useEffect(() => {
    console.log('IngredientRecognition received detectedIngredients:', detectedIngredients);
    console.log('Setting local ingredients state to:', detectedIngredients);
    setIngredients(detectedIngredients);
  }, [detectedIngredients]);

  const removeIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients(prev => [...prev, { name: newIngredient.trim(), confidence: 1.0 }]);
      setNewIngredient('');
      setShowAddInput(false);
    }
  };

  const handleConfirm = () => {
    if (ingredients.length > 0) {
      onConfirm(ingredients.map(i => i.name));
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Detected Ingredients</h2>
                <p className="text-sm text-slate-500">Review and edit your ingredients</p>
              </div>
            </div>
            <Button onClick={onRescan} variant="ghost" size="sm" className="text-slate-600">
              Rescan
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Captured Image */}
          <Card className="overflow-hidden border-slate-200 shadow-sm">
            <img
              src={imageData}
              alt="Captured ingredients"
              className="w-full h-48 object-cover"
            />
          </Card>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg border border-slate-200">
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-slate-700 font-medium">Analyzing ingredients...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">{error}</p>
            </div>
          )}

          {/* Ingredients List */}
          {!isLoading && (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Your Ingredients ({ingredients.length})
                  </h3>
                  <Button
                    onClick={() => setShowAddInput(true)}
                    variant="ghost"
                    size="sm"
                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>

                {ingredients.length === 0 && (
                  <Card className="p-8 text-center border-dashed border-2 border-slate-200 bg-slate-50">
                    <p className="text-slate-500">No ingredients detected. Add some manually!</p>
                  </Card>
                )}

                <div className="space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <Card
                      key={index}
                      className="p-4 border-slate-200 hover:border-emerald-300 transition-colors bg-white shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                            <Check className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 capitalize">{ingredient.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                                  style={{ width: `${ingredient.confidence * 100}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-500">
                                {Math.round(ingredient.confidence * 100)}% match
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => removeIngredient(index)}
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Add Ingredient Input */}
              {showAddInput && (
                <Card className="p-4 border-emerald-200 bg-emerald-50/50 shadow-sm">
                  <div className="flex gap-2">
                    <Input
                      value={newIngredient}
                      onChange={(e) => setNewIngredient(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                      placeholder="Enter ingredient name..."
                      className="flex-1 bg-white border-slate-200"
                      autoFocus
                    />
                    <Button onClick={addIngredient} size="icon" className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => {
                        setShowAddInput(false);
                        setNewIngredient('');
                      }}
                      variant="ghost"
                      size="icon"
                      className="text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Action */}
      {!isLoading && ingredients.length > 0 && (
        <div className="p-6 bg-white border-t border-slate-200 shadow-lg">
          <Button
            onClick={handleConfirm}
            className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-lg font-semibold shadow-lg"
          >
            Find Recipes
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}