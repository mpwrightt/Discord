import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { createSuccessEmbed, createErrorEmbed } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export const data = new SlashCommandBuilder()
  .setName('grow-water')
  .setDescription('Water your growing plants');

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    // Get active plants
    const plants = await convex.query(api.grows.getActivePlants, {
      userId: interaction.user.id,
    });

    if (plants.length === 0) {
      await interaction.editReply({
        embeds: [createErrorEmbed('You have no plants growing! Start one with `/grow-start`')]
      });
      return;
    }

    // Water all plants
    const results: Array<{ plant: string; health?: number; wasLate?: boolean; error?: string }> = [];
    for (const plant of plants) {
      try {
        const result = await convex.mutation(api.grows.waterPlant, {
          plantId: plant._id,
        });
        results.push({ plant: plant.strainName, ...result });
      } catch (error: any) {
        results.push({ plant: plant.strainName, error: error.message });
      }
    }

    // Build response
    let message = '💧 **Plants Watered!**\n\n';
    for (const result of results) {
      if (result.error) {
        message += `❌ ${result.plant}: ${result.error}\n`;
      } else {
        message += `✅ ${result.plant}: Health ${result.health}%`;
        if (result.wasLate) message += ' (⚠️ Was late!)';
        message += '\n';
      }
    }

    message += '\n💡 Come back tomorrow to water again!';

    const embed = createSuccessEmbed(message);
    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    console.error('Water error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed(error.message || 'Failed to water plants')]
    });
  }
}
