import { ChannelType, Events, Message } from 'discord.js';
import { ExtendedClient, DMChatMessage } from '../../types/index.js';
import { GoogleGeminiClient } from '../../lib/google-gemini.js';

export const name = Events.MessageCreate;

const geminiModel = process.env.GOOGLE_GEMINI_MODEL || 'gemini-1.5-flash';
const neutralSystemPrompt = 'You are a helpful and neutral assistant. Answer questions and chat naturally without any persona embellishments.';
const apiKey = process.env.GOOGLE_AI_API_KEY;
const geminiClient = apiKey ? new GoogleGeminiClient(apiKey, geminiModel) : null;

export async function execute(message: Message) {
  console.log(`[MessageCreate] Received message from ${message.author.tag} in ${message.channel.type}`);
  
  if (message.author.bot) {
    console.log('[MessageCreate] Ignoring bot message');
    return;
  }
  
  if (message.guild) {
    console.log('[MessageCreate] Ignoring guild message');
    return;
  }
  
  if (message.channel.type !== ChannelType.DM) {
    console.log(`[MessageCreate] Ignoring non-DM channel: ${message.channel.type}`);
    return;
  }

  console.log('[MessageCreate] Processing DM message:', message.content);

  if (!geminiClient) {
    console.warn('DM chat requested but GOOGLE_AI_API_KEY is not configured.');
    return;
  }

  const trimmedContent = message.content.trim();
  if (!trimmedContent) {
    return;
  }

  const client = message.client as ExtendedClient;
  const userId = message.author.id;
  const history: DMChatMessage[] = client.dmConversations.get(userId) || [];

  try {
    const response = await geminiClient.chat(
      neutralSystemPrompt,
      trimmedContent,
      history
    );

    const updatedHistory: DMChatMessage[] = [
      ...history,
      { role: 'user' as const, parts: trimmedContent },
      { role: 'model' as const, parts: response }
    ].slice(-20);

    client.dmConversations.set(userId, updatedHistory);

    await message.channel.send(response);
  } catch (error) {
    console.error('DM Chat error:', error);
    await message.channel.send('I had trouble responding just now. Please try again later.');
  }
}
