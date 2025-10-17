import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { COLORS } from '../../lib/utils.js';
import { GEMINI_MODELS } from '../../lib/google-gemini.js';

export const data = new SlashCommandBuilder()
  .setName('model-info')
  .setDescription('Show current AI model configuration');

export async function execute(interaction: ChatInputCommandInteraction) {
  const currentModel = process.env.GOOGLE_GEMINI_MODEL || 'gemini-1.5-flash';
  const modelInfo = GEMINI_MODELS[currentModel as keyof typeof GEMINI_MODELS];

  const embed = new EmbedBuilder()
    .setTitle('🤖 AI Model Configuration')
    .setColor(COLORS.INFO)
    .setDescription('Current Google Gemini model for AI chat')
    .addFields(
      { name: '📝 Model ID', value: `\`${currentModel}\``, inline: false },
      { 
        name: '📊 Details', 
        value: modelInfo 
          ? `**Name:** ${modelInfo.name}\n**Speed:** ${modelInfo.speed}\n**Cost:** ${modelInfo.cost}\n**Quality:** ${modelInfo.quality}`
          : 'Custom model configuration',
        inline: false 
      },
      { 
        name: '💰 Pricing', 
        value: 'Using your Google AI credits!\n**gemini-1.5-flash**: Free tier available\n**gemini-1.5-pro**: $1.25 per 1M tokens',
        inline: false 
      },
      { 
        name: '⚙️ How to Change', 
        value: 'Edit `GOOGLE_GEMINI_MODEL` in your `.env.local` file and restart the bot.\n\nAvailable: `gemini-1.5-flash`, `gemini-1.5-pro`, `gemini-2.0-flash-exp`',
        inline: false 
      }
    )
    .setFooter({ text: 'Using Google AI - same credits as image generation!' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
