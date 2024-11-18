import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateStudyMaterial(topic: string) {
    try {
      const prompt = `Create comprehensive study notes for the topic: ${topic}. 
                     Include key concepts, examples, and explanations.
                     Format the response in markdown with clear sections.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating study material:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService(import.meta.env.VITE_GEMINI_API_KEY);