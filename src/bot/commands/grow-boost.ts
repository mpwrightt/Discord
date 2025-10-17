import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { createSuccessEmbed, createErrorEmbed } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export const data = new SlashCommandBuilder()
  .setName('grow-boost')
  .setDescription('Use a Growth Booster to speed up a plant by 1 day');

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    // Get user
    const user = await convex.mutation(api.users.getOrCreateUser, {
      discordId: interaction.user.id,
      username: interaction.user.username,
    });

    if (!user) {
      await interaction.editReply({
        embeds: [createErrorEmbed('User not found')]
      });
      return;
    }

    // Check if user has any growth boosters
    const consumables = user.consumables || {};
    const boosterCount = (consumables as any)['growth-booster'] || 0;

    if (boosterCount <= 0) {
      await interaction.editReply({
        embeds: [createErrorEmbed(
          '⚠️ **No Growth Boosters!**\n\n' +
          'You don\'t have any Growth Boosters.\n' +
          'Buy them from the shop: `/buy item:growth-booster` (100 Buds)'
        )]
      });
      return;
    }

    // Get active plants
    const plants = await convex.query(api.grows.getUserPlants, {
      userId: interaction.user.id,
    });

    const activePlants = plants.filter(p => !p.isHarvested);

    if (activePlants.length === 0) {
      await interaction.editReply({
        embeds: [createErrorEmbed(
          '🌱 **No Active Plants!**\n\n' +
          'You don\'t have any growing plants to speed up.\n' +
          'Start growing with `/grow-start`'
        )]
      });
      return;
    }

    // If multiple plants, ask user which one (for now, just boost the first one)
    // TODO: Add plant selection dropdown in future
    const plant = activePlants[0];

    // Calculate days remaining
    const now = Date.now();
    const daysSinceStart = (now - plant.startDate) / (1000 * 60 * 60 * 24);
    const daysRemaining = Math.max(0, plant.growTime - daysSinceStart);

    if (daysRemaining < 0.5) {
      await interaction.editReply({
        embeds: [createErrorEmbed(
          '⏱️ **Plant Almost Ready!**\n\n' +
          `Your **${plant.strainName}** is ready to harvest in less than half a day.\n` +
          'No need to use a booster! Use `/grow-harvest`'
        )]
      });
      return;
    }

    // Use the consumable
    const result = await convex.mutation(api.users.useConsumable, {
      discordId: interaction.user.id,
      itemId: 'growth-booster',
    });

    // Apply speed boost by reducing startDate by 1 day
    await convex.mutation(api.grows.applySpeedBoost, {
      plantId: plant._id,
      daysToReduce: 1,
    });

    const newDaysRemaining = Math.max(0, daysRemaining - 1);
    const readyIn = newDaysRemaining < 0.1 ? 'NOW!' : `${newDaysRemaining.toFixed(1)} days`;

    const embed = createSuccessEmbed(
      `⚡ **Growth Booster Applied!**\n\n` +
      `🌱 Plant: **${plant.strainName}**\n` +
      `⏱️ Time reduced: **-1 day**\n` +
      `📅 Ready in: **${readyIn}**\n\n` +
      `💊 Growth Boosters remaining: **${result.remaining}**\n\n` +
      `_${newDaysRemaining < 0.1 ? 'Your plant is ready to harvest! Use `/grow-harvest`' : 'Your plant will be ready sooner!'}_`
    );

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    console.error('Grow boost error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed(error.message || 'Failed to apply growth booster')]
    });
  }
}
