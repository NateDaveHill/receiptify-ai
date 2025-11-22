import { useState, useEffect } from 'react';
import { X, Plus, Sparkles, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
    <div className="fixed inset-0 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-orange-50 flex flex-col overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-violet-300 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-fuchsia-300 rounded-full blur-3xl animate-pulse delay-75" />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 shadow-2xl">
        <div className="p-6 pb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Your Ingredient Receipt</h2>
                <p className="text-sm text-white/90 font-medium">AI detected • Review & confirm</p>
              </div>
            </div>
            <button
              onClick={onRescan}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-xl rounded-xl text-white font-semibold text-sm transition-all hover:scale-105 active:scale-95"
            >
              Rescan
            </button>
          </div>
        </div>
      </div>

      {/* Content - Receipt Style */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="p-6 space-y-6 max-w-2xl mx-auto">
          {/* Captured Image with retro border */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 rounded-3xl opacity-30 group-hover:opacity-50 blur transition-all" />
            <div className="relative overflow-hidden rounded-3xl border-4 border-white shadow-2xl">
              <img
                src={imageData}
                alt="Captured ingredients"
                className="w-full h-56 object-cover"
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16">
              <div className="inline-flex flex-col items-center gap-4 px-8 py-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-violet-200">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-violet-200 rounded-full" />
                  <div className="absolute inset-0 w-12 h-12 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-slate-900 font-bold text-lg">Scanning ingredients...</p>
                  <p className="text-slate-500 text-sm mt-1">AI is working its magic ✨</p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-5 shadow-lg">
              <p className="text-sm text-orange-900 font-medium">{error}</p>
            </div>
          )}

          {/* Receipt-Style Ingredients List */}
          {!isLoading && (
            <>
              {/* Receipt Header */}
              <div className="bg-white rounded-3xl shadow-2xl border-4 border-white overflow-hidden">
                <div className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 p-6 text-center">
                  <p className="text-white/90 text-xs font-mono uppercase tracking-widest">Receiptify Kitchen</p>
                  <h3 className="text-2xl font-black text-white mt-1 tracking-tight">
                    INGREDIENT RECEIPT
                  </h3>
                  <p className="text-white/90 text-xs font-mono mt-2">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Receipt Body */}
                <div className="p-6 space-y-1 font-mono text-sm bg-white" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.02) 1px, rgba(0,0,0,0.02) 2px)' }}>
                  <div className="border-b-2 border-dashed border-slate-300 pb-3 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">ITEMS DETECTED</span>
                      <button
                        onClick={() => setShowAddInput(true)}
                        className="px-3 py-1 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-xs font-bold rounded-lg hover:scale-105 transition-transform"
                      >
                        + ADD
                      </button>
                    </div>
                  </div>

                  {ingredients.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="text-slate-400 text-xs">NO ITEMS SCANNED</p>
                      <p className="text-slate-500 text-xs mt-2">Add ingredients manually</p>
                    </div>
                  )}

                  {/* Receipt Items */}
                  {ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="group py-3 border-b border-slate-200 hover:bg-violet-50/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-xs font-mono">{String(index + 1).padStart(2, '0')}</span>
                            <p className="font-bold text-slate-900 uppercase tracking-wide truncate">
                              {ingredient.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5 ml-6">
                            <div className="h-1.5 flex-1 max-w-[120px] bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all"
                                style={{ width: `${ingredient.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-500 font-bold">
                              {Math.round(ingredient.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeIngredient(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-100 rounded-lg"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {ingredients.length > 0 && (
                    <div className="pt-4 mt-4 border-t-2 border-dashed border-slate-300">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-900">TOTAL ITEMS:</span>
                        <span className="text-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                          {ingredients.length}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Receipt Footer */}
                <div className="bg-slate-50 px-6 py-4 text-center border-t-2 border-dashed border-slate-300">
                  <p className="text-xs text-slate-500 font-mono">THANK YOU FOR SCANNING</p>
                  <p className="text-xs text-slate-400 font-mono mt-1">★★★ AI POWERED ★★★</p>
                </div>
              </div>

              {/* Add Ingredient Input */}
              {showAddInput && (
                <div className="bg-white rounded-2xl shadow-xl border-2 border-violet-200 p-5">
                  <div className="flex gap-2">
                    <Input
                      value={newIngredient}
                      onChange={(e) => setNewIngredient(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
                      placeholder="Type ingredient name..."
                      className="flex-1 border-2 border-violet-200 focus:border-fuchsia-500 rounded-xl font-medium"
                      autoFocus
                    />
                    <button
                      onClick={addIngredient}
                      className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setShowAddInput(false);
                        setNewIngredient('');
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Action */}
      {!isLoading && ingredients.length > 0 && (
        <div className="relative z-10 p-6 bg-white/80 backdrop-blur-xl border-t-2 border-white shadow-2xl">
          <button
            onClick={handleConfirm}
            className="group relative w-full h-16 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 rounded-2xl font-black text-xl text-white shadow-2xl hover:scale-105 active:scale-95 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative flex items-center justify-center gap-2">
              Find My Recipes
              <ChevronRight className="w-6 h-6" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}