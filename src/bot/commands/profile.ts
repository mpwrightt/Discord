import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { COLORS, formatNumber } from '../../lib/utils.js';
import { createErrorEmbed } from '../../lib/utils.js';
import { getOrCreateUserOrThrow } from '../../lib/convex-helpers.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export const data = new SlashCommandBuilder()
  .setName('profile')
  .setDescription('View your profile or someone else\'s')
  .addUserOption(option =>
    option
      .setName('user')
      .setDescription('User to view (default: yourself)')
      .setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const targetUser = interaction.options.getUser('user') || interaction.user;

    // Get user data
    const user = await getOrCreateUserOrThrow(convex, {
      id: targetUser.id,
      username: targetUser.username,
    });

    // Get active plants
    const activePlants = await convex.query(api.grows.getActivePlants, {
      userId: targetUser.id,
    });

    // Calculate XP for next level
    const xpForCurrentLevel = Math.pow((user.level - 1) * 100, 1.5);
    const xpForNextLevel = Math.pow(user.level * 100, 1.5);
    const xpNeeded = Math.ceil(xpForNextLevel - user.xp);

    const embed = new EmbedBuilder()
      .setTitle(`🌿 ${targetUser.username}'s Profile`)
      .setColor(COLORS.CANNABIS)
      .setThumbnail(targetUser.displayAvatarURL())
      .addFields(
        { name: '📊 Level', value: `**${user.level}**`, inline: true },
        { name: '⭐ XP', value: `**${formatNumber(user.xp)}**\n(${formatNumber(xpNeeded)} to next)`, inline: true },
        { name: '💚 Buds', value: `**${formatNumber(user.buds)}**`, inline: true },
        { name: '🌿 Stashed', value: `**${user.gramsStashed}g**`, inline: true },
        { name: '🌾 Total Grown', value: `**${user.totalGramsGrown}g**`, inline: true },
        { name: '💰 Total Sold', value: `**${user.totalGramsSold}g**`, inline: true },
        { name: '💵 Total Earned', value: `**${formatNumber(user.totalBudsEarned)} Buds**`, inline: true },
        { name: '🔥 Daily Streak', value: `**${user.dailyStreak}** days`, inline: true },
        { name: '🌱 Active Plants', value: `**${activePlants.length}**`, inline: true },
      )
      .setFooter({ text: `Member since ${new Date(user.createdAt).toLocaleDateString()}` })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    console.error('Profile error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Failed to load profile')]
    });
  }
}
