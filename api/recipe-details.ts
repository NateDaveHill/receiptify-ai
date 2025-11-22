import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { recipeTitle, availableIngredients } = req.body;

  if (!recipeTitle) {
    return res.status(400).json({ error: 'Recipe title is required' });
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
            content: `You are a professional chef. Provide detailed recipe information for: "${recipeTitle}"

${availableIngredients ? `Available ingredients: ${availableIngredients.join(', ')}` : ''}

Return ONLY a valid JSON object with this exact format:
{
  "description": "A brief, appetizing description of the dish (2-3 sentences)",
  "ingredients": [
    {"name": "Ingredient name", "amount": "quantity with unit", "available": true}
  ],
  "instructions": [
    "Step 1 instruction",
    "Step 2 instruction"
  ],
  "nutrition": {
    "calories": 450,
    "protein": "30g",
    "carbs": "40g",
    "fat": "15g"
  }
}

Rules:
- List ALL ingredients needed (including pantry staples)
- Mark "available": true for ingredients from the available list, false otherwise
- Provide clear, step-by-step cooking instructions
- Include realistic nutrition information
- Do not include any text outside the JSON object`
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

    const detailData = JSON.parse(cleanContent);

    return res.status(200).json({ details: detailData });
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: errorMessage });
  }
}
