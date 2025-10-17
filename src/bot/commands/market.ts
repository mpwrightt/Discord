import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { COLORS } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export const data = new SlashCommandBuilder()
  .setName('market')
  .setDescription('Check the current market price for selling buds');

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const price = await convex.query(api.grows.getMarketPrice);

    const embed = new EmbedBuilder()
      .setTitle('📊 Cannabis Market')
      .setColor(COLORS.CANNABIS)
      .setDescription('Current market rates for selling your harvest')
      .addFields(
        { name: '💵 Current Price', value: `**${price.toFixed(1)} Buds per gram**`, inline: false },
        { name: '💰 Example Sales', value: 
          `50g = **${Math.floor(50 * price)} Buds**\n` +
          `100g = **${Math.floor(100 * price)} Buds**\n` +
          `200g = **${Math.floor(200 * price)} Buds**`,
          inline: true 
        },
        { name: '📈 How It Works', value: 'Prices fluctuate between 2.5-3.5 Buds/gram based on market conditions', inline: false }
      )
      .setFooter({ text: 'Use /sell <grams> to sell your stash' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    console.error('Market error:', error);
    await interaction.editReply({ content: 'Failed to fetch market data' });
  }
}
