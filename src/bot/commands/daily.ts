import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { createEmbed, createErrorEmbed, createSuccessEmbed, COLORS } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export const data = new SlashCommandBuilder()
  .setName('daily')
  .setDescription('Claim your daily Buds bonus');

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    // Ensure user exists
    await convex.mutation(api.users.getOrCreateUser, {
      discordId: interaction.user.id,
      username: interaction.user.username,
    });

    // Claim daily
    const result = await convex.mutation(api.users.claimDaily, {
      discordId: interaction.user.id,
    });

    const embed = createSuccessEmbed(
      `💰 **Daily Bonus Claimed!**\n\n` +
      `You received **${result.bonus} Buds**!\n` +
      `🔥 Daily Streak: **${result.streak} days**\n\n` +
      `${result.streak > 1 ? `Keep it up! Streak bonus: +${Math.min(result.streak * 5, 50)} Buds` : 'Come back tomorrow to build your streak!'}`
    );

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    console.error('Daily claim error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed(error.message || 'Failed to claim daily bonus')]
    });
  }
}
