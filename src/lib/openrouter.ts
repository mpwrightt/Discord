import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenRouterClient {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model?: string) {
    this.apiKey = apiKey;
    // Use provided model, env var, or fallback to claude-3-haiku
    this.model = model || process.env.OPENROUTER_MODEL || 'anthropic/claude-3-haiku';
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await axios.post<OpenRouterResponse>(
        OPENROUTER_API_URL,
        {
          model: this.model,
          messages,
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://github.com/cannabis-discord-bot',
            'X-Title': 'Cannabis Community Bot'
          }
        }
      );

      return response.data.choices[0]?.message?.content || 'No response generated.';
    } catch (error: any) {
      console.error('OpenRouter API Error:', error.response?.data || error.message);
      throw new Error(`AI chat failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async chatWithPersonality(
    userMessage: string,
    systemPrompt: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    return this.chat(messages);
  }

  getModel(): string {
    return this.model;
  }
}

// Recommended models with pricing info (as of 2024)
export const RECOMMENDED_MODELS = {
  // Fast & Cheap
  'anthropic/claude-3-haiku': { name: 'Claude 3 Haiku', speed: 'fast', cost: 'low', quality: 'good' },
  'openai/gpt-3.5-turbo': { name: 'GPT-3.5 Turbo', speed: 'fastest', cost: 'lowest', quality: 'good' },
  'meta-llama/llama-3.1-8b-instruct': { name: 'Llama 3.1 8B', speed: 'fast', cost: 'very low', quality: 'decent' },
  
  // Balanced
  'google/gemini-pro': { name: 'Gemini Pro', speed: 'fast', cost: 'low', quality: 'very good' },
  'anthropic/claude-3-sonnet': { name: 'Claude 3 Sonnet', speed: 'medium', cost: 'medium', quality: 'excellent' },
  
  // Premium
  'anthropic/claude-3.5-sonnet': { name: 'Claude 3.5 Sonnet', speed: 'medium', cost: 'high', quality: 'best' },
  'openai/gpt-4-turbo': { name: 'GPT-4 Turbo', speed: 'medium', cost: 'high', quality: 'excellent' },
  'openai/gpt-4o': { name: 'GPT-4o', speed: 'fast', cost: 'high', quality: 'best' },
} as const;
