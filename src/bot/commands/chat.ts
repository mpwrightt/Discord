import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { GoogleGeminiClient } from '../../lib/google-gemini.js';
import { AI_PERSONALITIES } from '../../types/index.js';
import { createEmbed, createErrorEmbed, COLORS } from '../../lib/utils.js';

// Initialize Google Gemini client - model configured via .env
const geminiModel = process.env.GOOGLE_GEMINI_MODEL || 'gemini-1.5-flash';
const geminiClient = new GoogleGeminiClient(process.env.GOOGLE_AI_API_KEY!, geminiModel);

export const data = new SlashCommandBuilder()
  .setName('chat')
  .setDescription('Talk with an AI personality')
  .addStringOption(option =>
    option
      .setName('personality')
      .setDescription('Choose an AI personality')
      .setRequired(true)
      .addChoices(
        { name: '🌿 Budtender AI', value: 'budtender' },
        { name: '😎 Chill Companion', value: 'chill' },
        { name: '🧠 Trivia Master', value: 'trivia' },
        { name: '🎨 Creative Guide', value: 'creative' }
      )
  )
  .addStringOption(option =>
    option
      .setName('message')
      .setDescription('Your message')
      .setRequired(true)
      .setMaxLength(500)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const personality = interaction.options.getString('personality', true);
  const message = interaction.options.getString('message', true);

  await interaction.deferReply();

  try {
    const aiPersonality = AI_PERSONALITIES[personality];
    
    if (!aiPersonality) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid personality selected')] });
      return;
    }

    // TODO: Fetch conversation history from Convex
    const response = await geminiClient.chat(
      aiPersonality.systemPrompt,
      message,
      []
    );

    const embed = createEmbed(
      `${aiPersonality.emoji} ${aiPersonality.name}`,
      response,
      COLORS.CANNABIS
    )
      .setFooter({ text: `Asked by ${interaction.user.username} • Model: ${geminiClient.getModel()}` });

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    console.error('Chat error:', error);
    await interaction.editReply({ 
      embeds: [createErrorEmbed('Failed to get AI response. Please try again.')] 
    });
  }
}
