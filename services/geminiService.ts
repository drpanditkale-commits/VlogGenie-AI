
import { GoogleGenAI, Type } from "@google/genai";
import { VideoAnalysis } from "../types";

export const analyzeVideo = async (base64Data: string, mimeType: string): Promise<VideoAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    You are an expert content strategist for high-traffic blogs. 
    Analyze this video and provide:
    1. A comprehensive summary suitable for a blog post (2-3 paragraphs).
    2. Five attention-grabbing, SEO-friendly titles.
    3. A list of key chapters with timestamps and a brief description for each.

    Be insightful, engaging, and professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: mimeType } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A detailed summary of the video content."
            },
            titles: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of 5 suggested titles."
            },
            chapters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.STRING, description: "Timestamp in format MM:SS or HH:MM:SS" },
                  label: { type: Type.STRING, description: "Title of the chapter" },
                  details: { type: Type.STRING, description: "Brief description of what happens in this chapter" }
                },
                required: ["timestamp", "label", "details"]
              }
            }
          },
          required: ["summary", "titles", "chapters"]
        }
      }
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    const data = JSON.parse(response.text.trim());
    return data as VideoAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze video. Please ensure the file is valid and not too large.");
  }
};
