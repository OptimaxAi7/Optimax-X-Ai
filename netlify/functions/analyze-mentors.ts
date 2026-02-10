import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // 1. Get your secure keys from Netlify Environment
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const X_TOKEN = process.env.X_BEARER_TOKEN;
  const X_TIER = process.env.X_TIER || 'free';

  try {
    const { niche, mentors } = JSON.parse(event.body || '{}');

    // 2. Initialize Gemini
    const genAI = new GoogleGenerativeAI(GEMINI_KEY || '');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. SaaS Logic: Extract Style DNA
    // This prompt tells the AI to create a 'Writing Profile' based on your input
    const prompt = `
      You are an AI Social Media Strategist. 
      Niche: ${niche}
      Target Mentors: ${mentors.join(', ')}
      
      Analyze these mentors and provide a JSON profile including:
      1. dominant_tone (e.g., 'Aggressive Value', 'Philosophical')
      2. hook_style (How they start tweets)
      3. formatting_rules (List, short sentences, etc.)
      4. x_tier_status: "${X_TIER}"
      
      Return ONLY valid JSON.
    `;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    
    // Clean the AI response to ensure it's pure JSON
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    const finalData = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Analysis format error" };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...finalData,
        timestamp: new Date().toISOString(),
        engine_status: "Active"
      }),
    };
  } catch (error) {
    console.error("Neural Engine Error:", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Neural Engine Stall', details: error.message }) 
    };
  }
};
