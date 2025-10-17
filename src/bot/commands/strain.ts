import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, AutocompleteInteraction } from 'discord.js';
import { STRAINS, getSeedCost } from '../../lib/strains.js';
import { getRarityColor, getRarityEmoji, COLORS } from '../../lib/utils.js';
import { createErrorEmbed } from '../../lib/utils.js';

export const data = new SlashCommandBuilder()
  .setName('strain')
  .setDescription('Get detailed information about a cannabis strain')
  .addStringOption(option =>
    option
      .setName('name')
      .setDescription('Strain name')
      .setRequired(true)
      .setAutocomplete(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const strainName = interaction.options.getString('name', true);
  const strain = STRAINS.find(s => s.name.toLowerCase() === strainName.toLowerCase());

  if (!strain) {
    await interaction.reply({
      embeds: [createErrorEmbed('Strain not found! Use autocomplete to see available strains.')],
      ephemeral: true
    });
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle(`${getRarityEmoji(strain.rarity)} ${strain.name}`)
    .setColor(getRarityColor(strain.rarity))
    .setDescription(`**${strain.description}**`)
    .addFields(
      { name: '🧬 Type', value: strain.type.charAt(0).toUpperCase() + strain.type.slice(1), inline: true },
      { name: '🌟 Rarity', value: strain.rarity.charAt(0).toUpperCase() + strain.rarity.slice(1), inline: true },
      { name: '💊 THC Content', value: strain.thc, inline: true },
      { name: '⏱️ Grow Time', value: `${strain.growTime} days`, inline: true },
      { name: '📊 Difficulty', value: strain.difficulty.charAt(0).toUpperCase() + strain.difficulty.slice(1), inline: true },
      { name: '🔓 Unlock Level', value: `Level ${strain.unlockLevel}`, inline: true },
      { name: '🌾 Yield Range', value: `${strain.minYield}g - ${strain.maxYield}g`, inline: true },
      { name: '💰 Seed Cost', value: `${strain.rarity === 'legendary' ? '200' : strain.rarity === 'rare' ? '100' : '50'} Buds`, inline: true },
      { name: '🎯 Best For', value: 
        strain.type === 'indica' ? 'Relaxation, Sleep, Pain Relief' :
        strain.type === 'sativa' ? 'Energy, Creativity, Focus' :
        'Balanced Effects, Versatile',
        inline: false
      },
      { name: '📝 Grow Tips', value: 
        strain.difficulty === 'easy' ? '✅ Great for beginners! Water regularly and provide good light.' :
        strain.difficulty === 'medium' ? '⚠️ Moderate experience needed. Pay attention to nutrients and pH.' :
        '🔥 Expert level! Requires careful monitoring of all growth parameters.',
        inline: false
      }
    )
    .setFooter({ text: `Use /grow-start strain:${strain.name} to plant this strain!` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

// Autocomplete handler
export async function autocomplete(interaction: AutocompleteInteraction) {
  const focusedValue = interaction.options.getFocused().toLowerCase();
  
  const filtered = STRAINS
    .filter(strain => strain.name.toLowerCase().includes(focusedValue))
    .slice(0, 25)
    .map(strain => ({
      name: `${getRarityEmoji(strain.rarity)} ${strain.name} (${strain.type})`,
      value: strain.name
    }));

  await interaction.respond(filtered);
}
