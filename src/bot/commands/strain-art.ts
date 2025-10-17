import { SlashCommandBuilder, ChatInputCommandInteraction, AttachmentBuilder, AutocompleteInteraction } from 'discord.js';
import { STRAINS } from '../../lib/strains.js';
import { generateImage } from '../../lib/nano-banana.js';
import { createSuccessEmbed, createErrorEmbed, getRarityEmoji } from '../../lib/utils.js';

export const data = new SlashCommandBuilder()
  .setName('strain-art')
  .setDescription('Generate AI art visualizing a cannabis strain')
  .addStringOption(option =>
    option
      .setName('strain')
      .setDescription('Choose a strain to visualize')
      .setRequired(true)
      .setAutocomplete(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    // Defer immediately (must be within 3 seconds)
    await interaction.deferReply();

    const strainName = interaction.options.getString('strain', true);
    const strain = STRAINS.find(s => s.name.toLowerCase() === strainName.toLowerCase());

    if (!strain) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Strain not found!')]
      });
      return;
    }

    // Create detailed prompt based on strain
    const typeDescriptions = {
      'indica': 'deep purple and dark green colors, relaxing atmosphere, night time vibes',
      'sativa': 'bright green and yellow colors, energetic atmosphere, daytime vibes',
      'hybrid': 'mix of purple, green and gold colors, balanced atmosphere',
    };

    const prompt = 
      `Professional cannabis photography: ${strain.name} strain, ` +
      `${typeDescriptions[strain.type]}, ` +
      `${strain.description}, ` +
      `crystal trichomes, macro photography, studio lighting, high detail, 4K quality`;

    await interaction.editReply({
      embeds: [createSuccessEmbed(
        `🎨 **Visualizing ${strain.name}...**\n\n` +
        `Type: ${strain.type}\n` +
        `Rarity: ${strain.rarity}\n\n` +
        `⏳ Generating artistic representation...`
      )]
    });

    // Generate image using Gemini 2.5 Flash Image (Nano Banana)
    const imageBuffer = await generateImage(prompt);

    if (!imageBuffer) {
      await interaction.editReply({
        embeds: [createErrorEmbed(
          '⚠️ **Image Generation Failed**\n\n' +
          'Could not generate strain art. This might be due to:\n' +
          '• API rate limits\n' +
          '• Invalid prompt\n' +
          '• API key permissions\n\n' +
          '💡 Try again later or try a different strain.'
        )]
      });
      return;
    }

    const attachment = new AttachmentBuilder(imageBuffer, { name: `${strain.name}.png` });

    const embed = createSuccessEmbed(
      `🎨 **${strain.name}** Visualization\n\n` +
      `🧬 Type: **${strain.type}**\n` +
      `💊 THC: **${strain.thc}**\n` +
      `⏱️ Grow Time: **${strain.growTime} days**\n\n` +
      `_"${strain.description}"_`
    );

    await interaction.editReply({ 
      embeds: [embed],
      files: [attachment]
    });
  } catch (error: any) {
    console.error('Strain art error:', error);
    
    // Check if interaction is still valid
    if (interaction.deferred || interaction.replied) {
      try {
        await interaction.editReply({
          embeds: [createErrorEmbed('Failed to generate strain art: ' + error.message)]
        });
      } catch (editError) {
        console.error('Failed to edit reply (interaction may have expired):', editError);
      }
    }
  }
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
