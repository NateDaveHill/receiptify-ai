import { useState } from 'react';
import CameraCapture from './CameraCapture';
import IngredientRecognition, { Ingredient } from './IngredientRecognition';
import RecipeResults, { Recipe } from './RecipeResults';
import RecipeDetail, { RecipeDetailData } from './RecipeDetail';

type AppState = 'camera' | 'ingredients' | 'results' | 'detail';

// Mock data for demonstration
const mockIngredients: Ingredient[] = [
  { name: 'tomatoes', confidence: 0.95 },
  { name: 'onions', confidence: 0.88 },
  { name: 'garlic', confidence: 0.92 },
  { name: 'chicken breast', confidence: 0.85 },
  { name: 'olive oil', confidence: 0.78 }
];

const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Classic Chicken Tomato Pasta',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
    cookingTime: 30,
    difficulty: 'Easy',
    matchPercentage: 95,
    servings: 4,
    cuisine: 'Italian'
  },
  {
    id: '2',
    title: 'Garlic Herb Roasted Chicken',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80',
    cookingTime: 45,
    difficulty: 'Medium',
    matchPercentage: 88,
    servings: 4,
    cuisine: 'American'
  },
  {
    id: '3',
    title: 'Mediterranean Chicken Bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
    cookingTime: 25,
    difficulty: 'Easy',
    matchPercentage: 82,
    servings: 2,
    cuisine: 'Mediterranean'
  },
  {
    id: '4',
    title: 'Tomato Basil Bruschetta',
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&q=80',
    cookingTime: 15,
    difficulty: 'Easy',
    matchPercentage: 75,
    servings: 6,
    cuisine: 'Italian'
  },
  {
    id: '5',
    title: 'Chicken Stir Fry with Vegetables',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80',
    cookingTime: 20,
    difficulty: 'Easy',
    matchPercentage: 70,
    servings: 3,
    cuisine: 'Asian'
  }
];

const mockRecipeDetails: Record<string, RecipeDetailData> = {
  '1': {
    ...mockRecipes[0],
    description: 'A delicious and comforting pasta dish featuring tender chicken pieces in a rich tomato sauce. Perfect for a weeknight dinner that the whole family will love.',
    ingredients: [
      { name: 'Chicken breast', amount: '500g', available: true },
      { name: 'Tomatoes', amount: '4 large', available: true },
      { name: 'Garlic', amount: '4 cloves', available: true },
      { name: 'Onions', amount: '1 large', available: true },
      { name: 'Olive oil', amount: '3 tbsp', available: true },
      { name: 'Pasta', amount: '400g', available: false },
      { name: 'Basil', amount: '1 bunch', available: false },
      { name: 'Parmesan cheese', amount: '50g', available: false }
    ],
    instructions: [
      'Bring a large pot of salted water to boil and cook pasta according to package directions.',
      'While pasta cooks, heat olive oil in a large skillet over medium-high heat.',
      'Season chicken with salt and pepper, then cook until golden brown and cooked through, about 6-7 minutes per side. Remove and set aside.',
      'In the same skillet, sauté diced onions until softened, about 3 minutes.',
      'Add minced garlic and cook for 1 minute until fragrant.',
      'Add diced tomatoes and cook until they break down into a sauce, about 10 minutes.',
      'Slice the cooked chicken and return it to the skillet with the tomato sauce.',
      'Drain pasta and add to the skillet, tossing everything together.',
      'Garnish with fresh basil and grated Parmesan cheese before serving.'
    ],
    nutrition: {
      calories: 485,
      protein: '32g',
      carbs: '58g',
      fat: '12g'
    }
  },
  '2': {
    ...mockRecipes[1],
    description: 'Juicy roasted chicken infused with aromatic garlic and fresh herbs. A simple yet impressive dish that delivers restaurant-quality results at home.',
    ingredients: [
      { name: 'Chicken breast', amount: '4 pieces', available: true },
      { name: 'Garlic', amount: '6 cloves', available: true },
      { name: 'Olive oil', amount: '4 tbsp', available: true },
      { name: 'Onions', amount: '2 medium', available: true },
      { name: 'Fresh rosemary', amount: '3 sprigs', available: false },
      { name: 'Fresh thyme', amount: '4 sprigs', available: false },
      { name: 'Lemon', amount: '1', available: false },
      { name: 'Butter', amount: '2 tbsp', available: false }
    ],
    instructions: [
      'Preheat oven to 200°C (400°F).',
      'Pat chicken dry with paper towels and season generously with salt and pepper.',
      'Mince garlic and mix with olive oil, chopped rosemary, and thyme.',
      'Rub the herb mixture all over the chicken pieces.',
      'Slice onions and arrange in a roasting pan as a bed for the chicken.',
      'Place chicken on top of onions and add lemon slices around.',
      'Dot with butter and roast for 35-40 minutes until golden and cooked through.',
      'Let rest for 5 minutes before serving with the roasted onions and pan juices.'
    ],
    nutrition: {
      calories: 380,
      protein: '42g',
      carbs: '8g',
      fat: '20g'
    }
  },
  '3': {
    ...mockRecipes[2],
    description: 'A fresh and healthy Mediterranean-inspired bowl packed with flavor. Light yet satisfying, perfect for lunch or a quick dinner.',
    ingredients: [
      { name: 'Chicken breast', amount: '300g', available: true },
      { name: 'Tomatoes', amount: '2 medium', available: true },
      { name: 'Garlic', amount: '2 cloves', available: true },
      { name: 'Olive oil', amount: '2 tbsp', available: true },
      { name: 'Cucumber', amount: '1', available: false },
      { name: 'Feta cheese', amount: '100g', available: false },
      { name: 'Quinoa', amount: '1 cup', available: false },
      { name: 'Lemon juice', amount: '2 tbsp', available: false }
    ],
    instructions: [
      'Cook quinoa according to package instructions and let cool.',
      'Season chicken with salt, pepper, and minced garlic.',
      'Heat olive oil in a pan and cook chicken until done, about 6 minutes per side.',
      'Slice chicken and set aside to rest.',
      'Dice tomatoes and cucumber into bite-sized pieces.',
      'Assemble bowls with quinoa as the base.',
      'Top with sliced chicken, tomatoes, cucumber, and crumbled feta.',
      'Drizzle with olive oil and lemon juice, season with salt and pepper to taste.'
    ],
    nutrition: {
      calories: 420,
      protein: '35g',
      carbs: '38g',
      fat: '15g'
    }
  },
  '4': {
    ...mockRecipes[3],
    description: 'Fresh and vibrant Italian appetizer featuring ripe tomatoes on crispy bread. Perfect for entertaining or as a light snack.',
    ingredients: [
      { name: 'Tomatoes', amount: '4 large', available: true },
      { name: 'Garlic', amount: '3 cloves', available: true },
      { name: 'Olive oil', amount: '4 tbsp', available: true },
      { name: 'Baguette', amount: '1', available: false },
      { name: 'Fresh basil', amount: '1 bunch', available: false },
      { name: 'Balsamic vinegar', amount: '1 tbsp', available: false }
    ],
    instructions: [
      'Dice tomatoes and place in a bowl.',
      'Mince garlic and add to tomatoes with chopped basil.',
      'Add olive oil, balsamic vinegar, salt, and pepper. Mix well and let marinate for 15 minutes.',
      'Slice baguette into 1/2 inch thick slices.',
      'Brush bread slices with olive oil and toast until golden.',
      'Rub toasted bread with a cut garlic clove for extra flavor.',
      'Top each slice with the tomato mixture just before serving.'
    ],
    nutrition: {
      calories: 180,
      protein: '5g',
      carbs: '28g',
      fat: '6g'
    }
  },
  '5': {
    ...mockRecipes[4],
    description: 'Quick and flavorful stir fry with tender chicken and crisp vegetables. A healthy weeknight meal ready in minutes.',
    ingredients: [
      { name: 'Chicken breast', amount: '400g', available: true },
      { name: 'Garlic', amount: '3 cloves', available: true },
      { name: 'Onions', amount: '1 large', available: true },
      { name: 'Olive oil', amount: '2 tbsp', available: true },
      { name: 'Bell peppers', amount: '2', available: false },
      { name: 'Soy sauce', amount: '3 tbsp', available: false },
      { name: 'Ginger', amount: '1 inch', available: false },
      { name: 'Broccoli', amount: '200g', available: false }
    ],
    instructions: [
      'Slice chicken into thin strips and season with salt and pepper.',
      'Heat oil in a wok or large skillet over high heat.',
      'Add chicken and stir fry until cooked through, about 5 minutes. Remove and set aside.',
      'Add more oil if needed, then stir fry sliced onions and bell peppers for 3 minutes.',
      'Add minced garlic and ginger, cook for 30 seconds.',
      'Add broccoli florets and stir fry for 2 minutes.',
      'Return chicken to the wok and add soy sauce.',
      'Toss everything together for 1-2 minutes until well combined and heated through.'
    ],
    nutrition: {
      calories: 320,
      protein: '38g',
      carbs: '18g',
      fat: '10g'
    }
  }
};

function Home() {
  const [appState, setAppState] = useState<AppState>('camera');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [detectedIngredients, setDetectedIngredients] = useState<Ingredient[]>([]);
  const [confirmedIngredients, setConfirmedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetailData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const handleImageCaptured = async (imageData: string) => {
    setCapturedImage(imageData);
    setIsProcessing(true);
    setAppState('ingredients');
    setError('');

    try {
      console.log('Sending image to API for ingredient detection...');
      console.log('Image data length:', imageData.length);
      console.log('Image starts with:', imageData.substring(0, 30));

      // Call serverless API to detect ingredients
      const response = await fetch('/api/detect-ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageData })
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error response:', errorData);
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response data:', data);

      const ingredientsData = data.ingredients;
      console.log('Detected ingredients:', ingredientsData);

      if (!ingredientsData || ingredientsData.length === 0) {
        console.log('No ingredients found, setting empty array');
        setError('⚠️ No ingredients detected in the image. Please try again with a clearer photo showing food items.');
        setDetectedIngredients([]);
      } else {
        console.log('Setting detectedIngredients state to:', ingredientsData);
        setDetectedIngredients(ingredientsData);
        setError('');
      }
      setIsProcessing(false);
      console.log('After setting state, detectedIngredients should be:', ingredientsData);
    } catch (error) {
      console.error('Error detecting ingredients:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`❌ Failed to detect ingredients: ${errorMessage}`);
      setDetectedIngredients([]);
      setIsProcessing(false);
    }
  };

  const handleIngredientsConfirmed = async (ingredients: string[]) => {
    setConfirmedIngredients(ingredients);
    setAppState('results');
    setIsProcessing(true);
    setError('');

    try {
      // Call serverless API to generate recipes
      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ingredients })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const recipesData = data.recipes;

      if (recipesData.length === 0) {
        setError('⚠️ No recipes found. Using demo recipes.');
        setRecipes(mockRecipes);
      } else {
        setRecipes(recipesData);
      }
      setIsProcessing(false);
    } catch (error) {
      console.error('Error generating recipes:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`❌ Failed to generate recipes: ${errorMessage}. Using demo recipes.`);
      setRecipes(mockRecipes);
      setIsProcessing(false);
    }
  };

  const handleRecipeSelected = async (recipe: Recipe) => {
    setIsProcessing(true);
    setError('');

    try {
      // Call serverless API to get detailed recipe information
      const response = await fetch('/api/recipe-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipeTitle: recipe.title,
          availableIngredients: confirmedIngredients
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const detailData = data.details;

      // Combine recipe info with detail data
      const fullDetail: RecipeDetailData = {
        ...recipe,
        description: detailData.description,
        ingredients: detailData.ingredients,
        instructions: detailData.instructions,
        nutrition: detailData.nutrition
      };

      setSelectedRecipe(fullDetail);
      setAppState('detail');
      setIsProcessing(false);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`❌ Failed to load recipe details: ${errorMessage}`);

      // Fallback to mock data if available
      const detailData = mockRecipeDetails[recipe.id];
      if (detailData) {
        const updatedDetail = {
          ...detailData,
          ingredients: detailData.ingredients.map(ing => ({
            ...ing,
            available: confirmedIngredients.some(
              confirmed => confirmed.toLowerCase().includes(ing.name.toLowerCase().split(' ')[0])
            )
          }))
        };
        setSelectedRecipe(updatedDetail);
        setAppState('detail');
      }
      setIsProcessing(false);
    }
  };

  const handleBackToIngredients = () => {
    setAppState('ingredients');
  };

  const handleBackToResults = () => {
    setAppState('results');
  };

  const handleNewScan = () => {
    setCapturedImage('');
    setDetectedIngredients([]);
    setConfirmedIngredients([]);
    setRecipes([]);
    setSelectedRecipe(null);
    setError('');
    setAppState('camera');
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-white">
      {appState === 'camera' && (
        <CameraCapture
          onImageCaptured={handleImageCaptured}
          isProcessing={isProcessing}
        />
      )}

      {appState === 'ingredients' && (
        <IngredientRecognition
          imageData={capturedImage}
          detectedIngredients={detectedIngredients}
          onConfirm={handleIngredientsConfirmed}
          onRescan={handleNewScan}
          isLoading={isProcessing}
          error={error}
        />
      )}

      {appState === 'results' && (
        <RecipeResults
          recipes={recipes}
          onSelectRecipe={handleRecipeSelected}
          onBack={handleBackToIngredients}
          onNewScan={handleNewScan}
          isLoading={isProcessing}
          error={error}
        />
      )}

      {appState === 'detail' && selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onBack={handleBackToResults}
        />
      )}
    </div>
  );
}

export default Home;