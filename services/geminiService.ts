import { GoogleGenAI } from "@google/genai";

const getAI = () =>
  new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const askRamadanAssistant = async (question: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: question,
    config: {
      systemInstruction: `You are a helpful, empathetic, and knowledgeable Muslim Assistant named Imam AI. 
      Your goal is to provide guidance on Ramadan, including fasting rules, spiritual advice, Suhoor/Iftar ideas, Quran and Duas. 
      Always provide references to Quran or Hadith where appropriate and authenticity. 
      Keep answers concise, respectful, and encouraging. 
      If a question is beyond basic Fiqh, suggest consulting a local scholar.`,
      temperature: 0.7,
    },
  });

  return response.text;
};
