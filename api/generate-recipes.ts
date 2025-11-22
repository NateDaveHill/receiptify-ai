import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ingredients } = req.body;

  if (!ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: 'Ingredients array is required' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `You are a professional chef and recipe expert. Based on these ingredients: ${ingredients.join(', ')}, suggest 5 creative and delicious recipes that can be made using these ingredients (you can assume basic pantry staples like salt, pepper, oil, butter are available).

Return ONLY a valid JSON array with this exact format:
[{
  "id": "1",
  "title": "Recipe Name",
  "image": "https://images.unsplash.com/photo-XXXXXXX?w=800&q=80",
  "cookingTime": 30,
  "difficulty": "Easy",
  "matchPercentage": 95,
  "servings": 4,
  "cuisine": "Cuisine Type"
}]

Rules:
- Generate 5 different recipes
- Use IDs from "1" to "5"
- Use real Unsplash food image URLs that match the recipe
- cookingTime should be realistic in minutes
- difficulty: "Easy", "Medium", or "Hard"
- matchPercentage: how well the recipe matches the available ingredients (higher if more ingredients from the list are used)
- servings: number of servings the recipe makes
- cuisine: type of cuisine (e.g., "Italian", "Asian", "American", etc.)
- Do not include any text outside the JSON array`
          }
        ],
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Clean up the response
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/```\n?/g, '');
    }

    const recipesData = JSON.parse(cleanContent);

    return res.status(200).json({ recipes: recipesData });
  } catch (error) {
    console.error('Error generating recipes:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: errorMessage });
  }
}
