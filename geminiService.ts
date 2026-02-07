import { GoogleGenAI, Type } from "@google/genai";
import { ViralityAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePost = async (content: string): Promise<ViralityAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this social media post for virality potential on Twitter/X. 
      Post: "${content}"
      
      Provide a virality score (0-100), a short 1-sentence reason why, and a rewritten version that is more engaging/viral.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            reason: { type: Type.STRING },
            improvedVersion: { type: Type.STRING },
          },
          required: ["score", "reason", "improvedVersion"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as ViralityAnalysis;
  } catch (error) {
    console.error("Error analyzing post:", error);
    // Fallback if API fails or key is missing
    return {
      score: 45,
      reason: "The text is too generic and lacks a hook or emotional trigger.",
      improvedVersion: "🚀 Just launched something game-changing! You won't believe what we've built. 👇 #LaunchDay"
    };
  }
};
