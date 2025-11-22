# AI Recipe Finder

An AI-powered mobile web app that uses your phone's camera to scan food ingredients and instantly generates personalized recipes based on what you have at home.

## Features

### 🎥 Camera Capture Interface
- Full-screen camera view with professional UI
- Real-time video preview with scanning frame overlay
- Capture button with loading states
- Preview thumbnail of last scanned image
- Permission handling with user-friendly error messages

### 🔍 Ingredient Recognition Display
- Beautiful card-based layout showing detected ingredients
- Confidence scores with visual progress bars
- Manual add/remove ingredient functionality
- Image preview of captured photo
- Smooth loading states during AI processing

### 📋 Recipe Results Screen
- Scrollable list of recipe cards with images
- Cooking time, difficulty level, and servings info
- Ingredient match percentage with visual indicators
- Cuisine type badges
- Empty state handling with helpful suggestions

### 📖 Recipe Detail View
- Full recipe with hero image
- Step-by-step instructions with numbered cards
- Ingredient list highlighting available vs. missing items
- Nutrition information per serving
- Quick stats (cook time, servings, difficulty)
- Share and favorite functionality

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React
- **Routing**: React Router v6

## Component Architecture

```
src/components/
├── home.tsx                    # Main app orchestration
├── CameraCapture.tsx          # Camera interface
├── IngredientRecognition.tsx  # Ingredient management
├── RecipeResults.tsx          # Recipe list view
└── RecipeDetail.tsx           # Recipe detail view
```

## Current Implementation

This version includes:
- ✅ Complete UI/UX implementation
- ✅ Camera access and image capture
- ✅ Mock ingredient detection (simulated AI)
- ✅ Mock recipe database
- ✅ Full navigation flow
- ✅ Responsive mobile-first design
- ✅ Professional styling with gradients and shadows

## Future Enhancements

To make this production-ready, you would need to:

1. **AI Integration**: Connect to an AI vision API (OpenAI Vision, Google Cloud Vision, or Clarifai)
2. **Recipe API**: Integrate with a recipe database (Spoonacular, Edamam, or custom backend)
3. **Backend**: Add user authentication, favorites, and recipe history
4. **PWA**: Convert to Progressive Web App for offline support
5. **Analytics**: Track user behavior and improve recommendations

## Getting Started

```bash
npm install
npm run dev
```

The app will open at `http://localhost:5173`

## Usage

1. **Grant Camera Permission**: Allow camera access when prompted
2. **Capture Image**: Position ingredients in the frame and tap the camera button
3. **Review Ingredients**: Check detected ingredients, add or remove as needed
4. **Find Recipes**: Tap "Find Recipes" to see matching recipes
5. **View Details**: Select a recipe to see full instructions and ingredients
6. **Start Cooking**: Follow the step-by-step instructions

## Design Highlights

- **Modern Gradient UI**: Professional gradients and shadows throughout
- **Smooth Transitions**: Polished animations and state changes
- **Visual Feedback**: Loading states, progress bars, and confidence indicators
- **Mobile-First**: Optimized for touch interactions and mobile screens
- **Accessible**: Clear typography, good contrast, and intuitive navigation

## Notes

- Currently uses mock data for demonstration
- Camera requires HTTPS in production (works on localhost)
- Optimized for mobile devices but works on desktop too