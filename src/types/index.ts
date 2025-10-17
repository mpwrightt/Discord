import { ChatInputCommandInteraction, AutocompleteInteraction, Client, Collection } from 'discord.js';

export interface BotCommand {
  data: any;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}

export interface DMChatMessage {
  role: 'user' | 'model';
  parts: string;
}

export interface ExtendedClient extends Client {
  commands: Collection<string, BotCommand>;
  dmConversations: Map<string, DMChatMessage[]>;
}

export interface AIPersonality {
  name: string;
  emoji: string;
  systemPrompt: string;
  description: string;
}

export interface GrowPlant {
  userId: string;
  plantId: string;
  strainName: string;
  strainRarity: 'common' | 'uncommon' | 'rare' | 'exotic' | 'legendary';
  growTime: number;
  startDate: number;
  daysGrown: number;
  lastWatered: number;
  health: number;
  boosted: {
    nutrients: boolean;
    light: boolean;
    love: number;
  };
  events: string[];
  isHarvested: boolean;
  yieldAmount?: number;
}

export interface Strain {
  name: string;
  type: 'indica' | 'sativa' | 'hybrid';
  rarity: 'common' | 'uncommon' | 'rare' | 'exotic' | 'legendary';
  growTime: number;
  minYield: number;
  maxYield: number;
  difficulty: 'easy' | 'medium' | 'hard';
  thc: string;
  cbd: string;
  unlockLevel: number;
  description: string;
}

export interface UserStats {
  userId: string;
  buds: number;
  level: number;
  xp: number;
  gramsStashed: number;
  totalGramsGrown: number;
  totalGramsSold: number;
  totalBudsEarned: number;
}

export interface MarketData {
  currentPrice: number;
  lastUpdated: number;
}

export const AI_PERSONALITIES: Record<string, AIPersonality> = {
  budtender: {
    name: 'Budtender AI',
    emoji: '🌿',
    systemPrompt: 'You are a knowledgeable and friendly cannabis budtender. You provide expert advice on strains, effects, growing techniques, and cannabis culture. Be informative, supportive, and always promote safe and legal use. Keep responses concise and helpful.',
    description: 'Expert cannabis knowledge and strain recommendations'
  },
  chill: {
    name: 'Chill Companion',
    emoji: '😎',
    systemPrompt: 'You are a laid-back, friendly companion who loves cannabis culture. You make jokes, share good vibes, and have casual conversations. Use some cannabis slang naturally, be funny and relatable. Keep it light and fun.',
    description: 'Casual chat, jokes, and good vibes'
  },
  trivia: {
    name: 'Trivia Master',
    emoji: '🧠',
    systemPrompt: 'You are an educational expert on cannabis history, science, legalization, and culture. You provide interesting facts, answer questions with accuracy, and help people learn. Be informative but not preachy. Keep responses clear and educational.',
    description: 'Cannabis facts, history, and education'
  },
  creative: {
    name: 'Creative Guide',
    emoji: '🎨',
    systemPrompt: 'You are a creative guide who helps with art prompts, inspiration, and creative projects. You understand cannabis culture and aesthetics. Help users brainstorm ideas for images, art, and creative content. Be imaginative and supportive.',
    description: 'Art prompts and creative inspiration'
  }
};
