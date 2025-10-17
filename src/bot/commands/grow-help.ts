import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { COLORS, createErrorEmbed } from '../../lib/utils.js';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export const data = new SlashCommandBuilder()
  .setName('grow-help')
  .setDescription('Get AI-powered growing advice from an expert')
  .addStringOption(option =>
    option
      .setName('question')
      .setDescription('Ask anything about growing cannabis')
      .setRequired(true)
      .setMaxLength(500)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const question = interaction.options.getString('question', true);

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      systemInstruction: {
        role: 'system',
        parts: [{
          text: `You are an expert cannabis cultivation advisor. Provide helpful, educational growing advice. 
          Keep responses concise (under 500 characters). Focus on practical tips about:
          - Watering schedules
          - Lighting requirements
          - Nutrient management
          - Common problems and solutions
          - Harvest timing
          - Strain-specific advice
          Always remind users to check local laws. Be encouraging and supportive.`
        }]
      }
    });

    const result = await model.generateContent(question);
    const response = result.response.text();

    const embed = new EmbedBuilder()
      .setTitle('🌱 Growing Expert Advice')
      .setColor(COLORS.CANNABIS)
      .addFields(
        { name: '❓ Your Question', value: question, inline: false },
        { name: '💡 Expert Answer', value: response.slice(0, 1000), inline: false }
      )
      .setFooter({ text: 'Powered by Google Gemini AI • Always check local laws' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    console.error('Grow help error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Failed to get growing advice')]
    });
  }
}
