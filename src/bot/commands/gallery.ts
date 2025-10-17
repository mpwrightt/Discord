import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { COLORS, createErrorEmbed } from '../../lib/utils.js';

export const data = new SlashCommandBuilder()
  .setName('gallery')
  .setDescription('View community-generated cannabis art');

export async function execute(interaction: ChatInputCommandInteraction) {
  // This is a placeholder - would need to connect to Convex to fetch saved images
  
  const embed = new EmbedBuilder()
    .setTitle('🖼️ Community Art Gallery')
    .setColor(COLORS.CANNABIS)
    .setDescription(
      '**Welcome to the Cannabis Art Gallery!**\n\n' +
      'This feature showcases art created by community members using `/generate` and `/strain-art`.\n\n' +
      '🎨 **How to Contribute:**\n' +
      '1. Use `/generate` to create unique cannabis art\n' +
      '2. Use `/strain-art` to visualize strain aesthetics\n' +
      '3. Your best creations will be featured here!\n\n' +
      '🌟 **Coming Soon:**\n' +
      '• Featured artist of the week\n' +
      '• Art competitions with Buds prizes\n' +
      '• Downloadable community art packs\n' +
      '• NFT minting of top artwork\n\n' +
      '💡 **Pro Tip:** Use detailed prompts for better results!'
    )
    .addFields(
      { name: '📊 Stats', value: 'Total Generations: Coming Soon\nTop Artist: Coming Soon', inline: false },
      { name: '🎯 Quick Links', value: 'Use `/generate` to create art now!', inline: false }
    )
    .setFooter({ text: 'Database integration coming soon!' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
