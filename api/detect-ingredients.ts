import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageData } = req.body;

  if (!imageData) {
    return res.status(400).json({ error: 'Image data is required' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  try {
    // Log for debugging
    console.log('Processing image detection request...');
    console.log('Image data length:', imageData?.length || 0);
    console.log('Image data prefix:', imageData?.substring(0, 50) || 'none');

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
            content: [
              {
                type: 'text',
                text: 'You are an expert food ingredient identifier. Analyze this image VERY CAREFULLY and identify ALL food ingredients visible.\n\nLook for:\n- Fresh produce (vegetables, fruits, herbs)\n- Proteins (meats, eggs, fish, tofu)\n- Dairy products (milk, cheese, yogurt, butter)\n- Grains and starches (rice, pasta, bread, flour)\n- Packaged foods and condiments\n- Spices and seasonings\n- Any other edible items\n\nIMPORTANT: Even if you see just 1 or 2 ingredients, list them. If you cannot identify any food items with confidence, return an empty array [].\n\nReturn ONLY a valid JSON array in this EXACT format with NO additional text:\n[{"name":"tomato","confidence":0.95},{"name":"onion","confidence":0.88}]\n\nRules:\n- Use singular form (e.g., "egg" not "eggs")\n- Use common names (e.g., "tomato" not "cherry tomato")\n- Confidence must be between 0.5 and 1.0\n- Include ALL visible ingredients\n- Return empty array [] if no food is visible\n- NO markdown, NO code blocks, ONLY the JSON array'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', JSON.stringify(data, null, 2));

    const content = data.choices[0]?.message?.content;
    console.log('Raw content from GPT:', content);

    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    // Clean up the response - remove markdown code blocks if present
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/```\n?/g, '');
    }

    console.log('Cleaned content:', cleanContent);

    const ingredientsData = JSON.parse(cleanContent);
    console.log('Parsed ingredients:', ingredientsData);

    // Ensure it's an array
    if (!Array.isArray(ingredientsData)) {
      console.error('Response is not an array:', ingredientsData);
      return res.status(200).json({ ingredients: [] });
    }

    return res.status(200).json({ ingredients: ingredientsData });
  } catch (error) {
    console.error('Error detecting ingredients:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: errorMessage });
  }
}
