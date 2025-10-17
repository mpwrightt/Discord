import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { createSuccessEmbed, createErrorEmbed } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export const data = new SlashCommandBuilder()
  .setName('grow-feed')
  .setDescription('Give nutrients to your plants for better yield');

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    // Get active plants
    const plants = await convex.query(api.grows.getActivePlants, {
      userId: interaction.user.id,
    });

    if (plants.length === 0) {
      await interaction.editReply({
        embeds: [createErrorEmbed('You have no plants growing!')]
      });
      return;
    }

    // Feed all unfed plants
    const results = [];
    for (const plant of plants) {
      if (!plant.boosted.nutrients) {
        try {
          await convex.mutation(api.grows.feedPlant, {
            plantId: plant._id,
            userId: interaction.user.id,
          });
          results.push({ plant: plant.strainName, success: true });
        } catch (error: any) {
          results.push({ plant: plant.strainName, success: false, error: error.message });
        }
      } else {
        results.push({ plant: plant.strainName, alreadyFed: true });
      }
    }

    // Build response
    let message = '🌟 **Nutrients Applied!**\n\n';
    for (const result of results) {
      if (result.alreadyFed) {
        message += `⚠️ ${result.plant}: Already has nutrients\n`;
      } else if (result.success) {
        message += `✅ ${result.plant}: Fed! (+15% yield boost)\n`;
      } else {
        message += `❌ ${result.plant}: ${result.error}\n`;
      }
    }

    message += '\n💡 Nutrients cost 15 Buds per plant';

    const embed = createSuccessEmbed(message);
    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    console.error('Feed error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed(error.message || 'Failed to feed plants')]
    });
  }
}
