import { GoogleGenerativeAI } from '@google/generative-ai';
import { ImageSource } from '@nativescript/core';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(AIzaSyDBrVy_u_z0PswpZlpB9x5yRXvw_a9BaIQ);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateStudyMaterial(topic: string): Promise<{
    content: string;
    imagePrompts: string[];
  }> {
    try {
      const prompt = `Create comprehensive study notes for the topic: ${topic}. 
                     Include key concepts, examples, and suggest relevant images.
                     Format the response in markdown with clear sections.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract image prompts from the response
      const imagePrompts = this.extractImagePrompts(text);

      return {
        content: text,
        imagePrompts
      };
    } catch (error) {
      console.error('Error generating study material:', error);
      throw error;
    }
  }

  private extractImagePrompts(text: string): string[] {
    // Extract image suggestions from the generated content
    const imageRegex = /\[Image:([^\]]+)\]/g;
    const matches = [...text.matchAll(imageRegex)];
    return matches.map(match => match[1].trim());
  }
}