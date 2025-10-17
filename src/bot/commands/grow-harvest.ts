import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { getStrainByName, calculateYield } from '../../lib/strains.js';
import { createSuccessEmbed, createErrorEmbed, getRarityEmoji } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export const data = new SlashCommandBuilder()
  .setName('grow-harvest')
  .setDescription('Harvest your mature plants');

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    // Get user to check equipment
    const user = await convex.mutation(api.users.getOrCreateUser, {
      discordId: interaction.user.id,
      username: interaction.user.username,
    });

    // Get active plants
    const plants = await convex.query(api.grows.getActivePlants, {
      userId: interaction.user.id,
    });

    if (plants.length === 0) {
      await interaction.editReply({
        embeds: [createErrorEmbed('You have no plants to harvest!')]
      });
      return;
    }

    // Find ready plants
    const readyPlants = plants.filter(p => {
      const daysSinceStart = (Date.now() - p.startDate) / (1000 * 60 * 60 * 24);
      return daysSinceStart >= p.growTime;
    });

    if (readyPlants.length === 0) {
      await interaction.editReply({
        embeds: [createErrorEmbed('None of your plants are ready yet! Use `/grow-check` to see progress.')]
      });
      return;
    }

    // Check for permanent yield upgrades
    const hasBetterLights = user.equipmentOwned.includes('better-lights');
    const hasNutrientsPack = user.equipmentOwned.includes('nutrients-pack');

    // Harvest all ready plants
    let totalYield = 0;
    const harvests = [];

    for (const plant of readyPlants) {
      const strain = getStrainByName(plant.strainName);
      if (!strain) continue;

      // Apply permanent upgrades to boosted object
      const boostedWithUpgrades = {
        ...plant.boosted,
        light: plant.boosted.light || hasBetterLights, // +10% from better-lights
        nutrients: plant.boosted.nutrients || hasNutrientsPack, // +15% from nutrients-pack
      };

      const yieldAmount = calculateYield(strain, plant.health, boostedWithUpgrades);

      await convex.mutation(api.grows.harvestPlant, {
        plantId: plant._id,
        yieldAmount: yieldAmount,
      });

      totalYield += yieldAmount;
      harvests.push({
        strain: plant.strainName,
        yield: yieldAmount,
        rarity: plant.strainRarity,
      });
    }

    // Build response
    let message = '🎉 **Harvest Complete!**\n\n';
    for (const h of harvests) {
      message += `${getRarityEmoji(h.rarity)} **${h.strain}**: ${h.yield}g\n`;
    }
    message += `\n💚 **Total: ${totalYield}g added to stash!**\n\n`;
    message += `💰 Use \`/sell ${totalYield}\` to sell for Buds!`;

    const embed = createSuccessEmbed(message);
    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    console.error('Harvest error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed(error.message || 'Failed to harvest plants')]
    });
  }
}
