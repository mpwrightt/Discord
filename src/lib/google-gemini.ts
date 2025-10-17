import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

export class GoogleGeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private modelName: string;

  constructor(apiKey: string, modelName = 'gemini-2.5-flash') {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
    this.model = this.genAI.getGenerativeModel({ model: modelName });
  }

  async chat(systemPrompt: string, userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    try {
      // Create chat session with system instruction and history
      const chat = this.model.startChat({
        systemInstruction: {
          role: 'system',
          parts: [{ text: systemPrompt }]
        },
        history: conversationHistory.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.parts }]
        })),
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      });

      const result = await chat.sendMessage(userMessage);
      const response = result.response;
      return response.text();
    } catch (error: any) {
      console.error('Google Gemini API Error:', error.message);
      throw new Error(`AI chat failed: ${error.message}`);
    }
  }

  getModel(): string {
    return this.modelName;
  }
}

// Available Gemini models (as of 2025)
export const GEMINI_MODELS = {
  'gemini-2.5-flash': { name: 'Gemini 2.5 Flash', speed: 'fastest', cost: 'low', quality: 'excellent' },
  'gemini-2.5-pro': { name: 'Gemini 2.5 Pro', speed: 'fast', cost: 'medium', quality: 'best' },
  'gemini-2.5-flash-lite': { name: 'Gemini 2.5 Flash-Lite', speed: 'very fast', cost: 'very low', quality: 'very good' },
  'gemini-2.0-flash-001': { name: 'Gemini 2.0 Flash', speed: 'fast', cost: 'low', quality: 'excellent' },
  'gemini-1.5-flash': { name: 'Gemini 1.5 Flash (deprecated)', speed: 'very fast', cost: 'low', quality: 'very good' },
  'gemini-1.5-pro': { name: 'Gemini 1.5 Pro (deprecated)', speed: 'fast', cost: 'medium', quality: 'excellent' },
} as const;
