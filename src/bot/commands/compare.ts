import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, AutocompleteInteraction } from 'discord.js';
import { STRAINS } from '../../lib/strains.js';
import { COLORS, getRarityEmoji } from '../../lib/utils.js';
import { createErrorEmbed } from '../../lib/utils.js';

export const data = new SlashCommandBuilder()
  .setName('compare')
  .setDescription('Compare two cannabis strains side-by-side')
  .addStringOption(option =>
    option
      .setName('strain1')
      .setDescription('First strain')
      .setRequired(true)
      .setAutocomplete(true)
  )
  .addStringOption(option =>
    option
      .setName('strain2')
      .setDescription('Second strain')
      .setRequired(true)
      .setAutocomplete(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const strain1Name = interaction.options.getString('strain1', true);
  const strain2Name = interaction.options.getString('strain2', true);

  const strain1 = STRAINS.find(s => s.name.toLowerCase() === strain1Name.toLowerCase());
  const strain2 = STRAINS.find(s => s.name.toLowerCase() === strain2Name.toLowerCase());

  if (!strain1 || !strain2) {
    await interaction.reply({
      embeds: [createErrorEmbed('One or both strains not found!')],
      ephemeral: true
    });
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle('⚖️ Strain Comparison')
    .setColor(COLORS.CANNABIS)
    .setDescription(`Comparing **${strain1.name}** vs **${strain2.name}**`)
    .addFields(
      { name: '━━━━━━━━━━━━━━━━━', value: '\u200B', inline: false },
      { 
        name: `${getRarityEmoji(strain1.rarity)} ${strain1.name}`, 
        value: 
          `**Type:** ${strain1.type}\n` +
          `**THC:** ${strain1.thc}\n` +
          `**Grow Time:** ${strain1.growTime} days\n` +
          `**Yield:** ${strain1.minYield}-${strain1.maxYield}g\n` +
          `**Difficulty:** ${strain1.difficulty}\n` +
          `**Rarity:** ${strain1.rarity}`,
        inline: true 
      },
      { 
        name: `${getRarityEmoji(strain2.rarity)} ${strain2.name}`, 
        value: 
          `**Type:** ${strain2.type}\n` +
          `**THC:** ${strain2.thc}\n` +
          `**Grow Time:** ${strain2.growTime} days\n` +
          `**Yield:** ${strain2.minYield}-${strain2.maxYield}g\n` +
          `**Difficulty:** ${strain2.difficulty}\n` +
          `**Rarity:** ${strain2.rarity}`,
        inline: true 
      },
      { name: '━━━━━━━━━━━━━━━━━', value: '\u200B', inline: false },
      {
        name: '📊 Key Differences',
        value: 
          `• **Grow Speed:** ${strain1.growTime < strain2.growTime ? strain1.name : strain2.name} is faster (${Math.abs(strain1.growTime - strain2.growTime)} days)\n` +
          `• **Yield:** ${strain1.maxYield > strain2.maxYield ? strain1.name : strain2.name} produces more\n` +
          `• **Difficulty:** ${strain1.difficulty === 'easy' ? strain1.name : strain2.name} is easier to grow\n` +
          `• **Type:** ${strain1.type !== strain2.type ? `Different types (${strain1.type} vs ${strain2.type})` : 'Same type'}`,
        inline: false
      }
    )
    .setFooter({ text: 'Use /strain <name> for full details on either strain' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

// Autocomplete handler (works for both strain1 and strain2)
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
