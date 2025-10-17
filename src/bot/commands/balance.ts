import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { COLORS, formatNumber } from '../../lib/utils.js';
import { createErrorEmbed } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export const data = new SlashCommandBuilder()
  .setName('balance')
  .setDescription('Check your Buds balance and stats')
  .addUserOption(option =>
    option
      .setName('user')
      .setDescription('User to check (default: yourself)')
      .setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const targetUser = interaction.options.getUser('user') || interaction.user;
  
  await interaction.deferReply();

  try {
    // Get or create user
    const user = await convex.mutation(api.users.getOrCreateUser, {
      discordId: targetUser.id,
      username: targetUser.username,
    });

    const marketPrice = await convex.query(api.grows.getMarketPrice);

    const embed = new EmbedBuilder()
      .setTitle(`💰 ${targetUser.username}'s Balance`)
      .setColor(COLORS.CANNABIS)
      .setThumbnail(targetUser.displayAvatarURL())
      .addFields(
        { name: '💚 Buds', value: `**${formatNumber(user.buds)}** Buds`, inline: true },
        { name: '📊 Level', value: `**${user.level}**`, inline: true },
        { name: '🌿 Stashed', value: `**${user.gramsStashed}g**`, inline: true },
        { name: '🌾 Total Grown', value: `**${user.totalGramsGrown}g**`, inline: true },
        { name: '💵 Market Price', value: `**${marketPrice.toFixed(1)}** Buds/gram`, inline: true },
        { name: '🎯 Stash Value', value: `**${Math.floor(user.gramsStashed * marketPrice)}** Buds`, inline: true }
      )
      .setFooter({ text: 'Use /shop to spend your Buds!' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    console.error('Balance error:', error);
    await interaction.editReply({ embeds: [createErrorEmbed('Failed to fetch balance')] });
  }
}
