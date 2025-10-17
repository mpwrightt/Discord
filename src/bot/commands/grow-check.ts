import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { COLORS, getHealthColor, getHealthEmoji, getGrowthStageEmoji, getProgressBar, getRarityEmoji } from '../../lib/utils.js';
import { createErrorEmbed } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export const data = new SlashCommandBuilder()
  .setName('grow-check')
  .setDescription('Check the status of your growing plants');

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    // Fetch active plants from database
    const plants = await convex.query(api.grows.getActivePlants, {
      userId: interaction.user.id,
    });

    if (plants.length === 0) {
      await interaction.editReply({
        embeds: [createErrorEmbed('You have no plants growing! Start one with `/grow-start`')]
      });
      return;
    }

    const embeds: EmbedBuilder[] = plants.map((plant, index) => {
      const daysSinceStart = (Date.now() - plant.startDate) / (1000 * 60 * 60 * 24);
      const daysGrown = Math.floor(daysSinceStart);
      const daysRemaining = Math.max(0, plant.growTime - daysGrown);
      const progress = (daysGrown / plant.growTime) * 100;
      const stageEmoji = getGrowthStageEmoji(daysGrown, plant.growTime);
      const healthEmoji = getHealthEmoji(plant.health);
      const progressBar = getProgressBar(daysGrown, plant.growTime);
      
      // Check if needs watering (more than 20 hours since last watered)
      const hoursSinceWatered = (Date.now() - plant.lastWatered) / (1000 * 60 * 60);
      const needsWater = hoursSinceWatered > 20;
    
      const embed = new EmbedBuilder()
        .setTitle(`${stageEmoji} ${plant.strainName} ${getRarityEmoji(plant.strainRarity)}`)
        .setColor(getHealthColor(plant.health))
        .setDescription(`**Plant #${index + 1}** - Growing nicely!`)
        .addFields(
          { 
            name: '📅 Progress', 
            value: `Day ${daysGrown}/${plant.growTime}\n${progressBar} ${Math.round(progress)}%`, 
            inline: false 
          },
          { 
            name: `${healthEmoji} Health`, 
            value: `**${plant.health}%**`, 
            inline: true 
          },
          { 
            name: '⏰ Days Left', 
            value: daysRemaining === 0 ? '**Ready!**' : `**${daysRemaining}** days`, 
            inline: true 
          },
          { 
            name: '🌟 Boosts', 
            value: plant.boosted.nutrients ? '✅ Nutrients' : '❌ None', 
            inline: true 
          },
          {
            name: '💧 Last Watered',
            value: needsWater 
              ? '⚠️ **NEEDS WATER NOW!**' 
              : `${Math.round(hoursSinceWatered)}h ago`,
            inline: true
          }
        )
        .setFooter({ 
          text: daysRemaining === 0 
            ? '🎉 Ready to harvest! Use /grow-harvest' 
            : needsWater 
              ? '⚠️ Water your plant with /grow-water' 
              : 'Keep caring for your plant daily!'
        })
        .setTimestamp();

      if (needsWater) {
        embed.addFields({
          name: '⚠️ Warning',
          value: 'Your plant needs water! Health will drop if not watered soon.',
          inline: false
        });
      }

      return embed;
    });

    await interaction.editReply({ embeds });
  } catch (error: any) {
    console.error('Grow check error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Failed to check plants')]
    });
  }
}
