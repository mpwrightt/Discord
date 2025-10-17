import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, AutocompleteInteraction } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { STRAINS, getSeedCost } from '../../lib/strains.js';
import { COLORS, getRarityEmoji, getRarityColor } from '../../lib/utils.js';
import { createErrorEmbed, createSuccessEmbed } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export const data = new SlashCommandBuilder()
  .setName('grow-start')
  .setDescription('Start growing a cannabis plant')
  .addStringOption(option =>
    option
      .setName('strain')
      .setDescription('Choose a strain to grow')
      .setRequired(true)
      .setAutocomplete(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  
  const strainName = interaction.options.getString('strain', true);
  
  try {
    // Find the strain
    const strain = STRAINS.find(s => s.name.toLowerCase() === strainName.toLowerCase());
    
    if (!strain) {
      await interaction.editReply({ 
        embeds: [createErrorEmbed('Strain not found. Use autocomplete to see available strains.')]
      });
      return;
    }

    // Get or create user
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

    const seedCost = getSeedCost(strain.rarity);

    // Check if user has advanced hydroponics for -3 days
    const hasHydroponics = user.equipmentOwned.includes('advanced-hydroponics');
    const adjustedGrowTime = hasHydroponics ? Math.max(1, strain.growTime - 3) : strain.growTime;

    // Start the grow (this checks everything and deducts Buds)
    await convex.mutation(api.grows.startGrow, {
      userId: interaction.user.id,
      strainName: strain.name,
      strainRarity: strain.rarity,
      growTime: adjustedGrowTime,
      seedCost: seedCost,
    });
  
    const speedBoostText = hasHydroponics 
      ? `\n⚡ **Advanced Hydroponics Active!** (${strain.growTime} days → ${adjustedGrowTime} days)` 
      : '';

    const embed = new EmbedBuilder()
      .setTitle('🌱 Plant Started Growing!')
      .setColor(getRarityColor(strain.rarity))
      .setDescription(`You've planted **${strain.name}** ${getRarityEmoji(strain.rarity)}${speedBoostText}`)
      .addFields(
        { name: '🧬 Type', value: strain.type.charAt(0).toUpperCase() + strain.type.slice(1), inline: true },
        { name: '⏱️ Grow Time', value: `${adjustedGrowTime} days`, inline: true },
        { name: '📊 Difficulty', value: strain.difficulty.charAt(0).toUpperCase() + strain.difficulty.slice(1), inline: true },
        { name: '🌾 Expected Yield', value: `${strain.minYield}-${strain.maxYield}g`, inline: true },
        { name: '💊 THC', value: strain.thc, inline: true },
        { name: '💰 Cost', value: `-${seedCost} Buds`, inline: true },
        { name: '💧 Next Step', value: '**Remember to water daily!** Use `/grow-water`', inline: false },
        { name: '📝 Description', value: strain.description, inline: false }
      )
      .setFooter({ text: `You'll be notified when it's ready to harvest! • Days remaining: ${adjustedGrowTime}` })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    console.error('Grow start error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed(error.message || 'Failed to start growing')]
    });
  }
}

// Autocomplete handler for strain selection
export async function autocomplete(interaction: AutocompleteInteraction) {
  const focusedValue = interaction.options.getFocused().toLowerCase();
  
  // Filter strains based on user input
  const filtered = STRAINS
    .filter(strain => strain.name.toLowerCase().includes(focusedValue))
    .slice(0, 25) // Discord limits to 25 choices
    .map(strain => {
      const cost = getSeedCost(strain.rarity);
      const rarityEmoji = getRarityEmoji(strain.rarity);
      
      return {
        name: `${rarityEmoji} ${strain.name} - ${cost} Buds (${strain.growTime}d, ${strain.minYield}-${strain.maxYield}g)`,
        value: strain.name
      };
    });

  await interaction.respond(filtered);
}
