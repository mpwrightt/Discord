import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { createSuccessEmbed, createErrorEmbed, formatNumber } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export const data = new SlashCommandBuilder()
  .setName('sell')
  .setDescription('Sell your harvested buds for Buds currency')
  .addIntegerOption(option =>
    option
      .setName('grams')
      .setDescription('How many grams to sell (or use "all")')
      .setRequired(true)
      .setMinValue(1)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const grams = interaction.options.getInteger('grams', true);

    // Ensure user exists
    await convex.mutation(api.users.getOrCreateUser, {
      discordId: interaction.user.id,
      username: interaction.user.username,
    });

    // Sell harvest
    const result = await convex.mutation(api.grows.sellHarvest, {
      userId: interaction.user.id,
      grams: grams,
    });

    const embed = createSuccessEmbed(
      `💰 **Harvest Sold!**\n\n` +
      `You sold **${grams}g** for **${formatNumber(result.budsEarned)} Buds**!\n\n` +
      `📊 Market Price: **${result.price.toFixed(1)} Buds/gram**\n` +
      `💚 Total Earned: **${formatNumber(result.budsEarned)} Buds**`
    );

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    console.error('Sell error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed(error.message || 'Failed to sell harvest')]
    });
  }
}
