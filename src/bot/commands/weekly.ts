import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { createSuccessEmbed, createErrorEmbed } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export const data = new SlashCommandBuilder()
  .setName('weekly')
  .setDescription('Claim your weekly Buds bonus');

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    await convex.mutation(api.users.getOrCreateUser, {
      discordId: interaction.user.id,
      username: interaction.user.username,
    });

    const result = await convex.mutation(api.users.claimWeekly, {
      discordId: interaction.user.id,
    });

    const embed = createSuccessEmbed(
      `🎉 **Weekly Bonus Claimed!**\n\n` +
      `You received **${result.bonus} Buds**!\n\n` +
      `Come back next week for another bonus!`
    );

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    console.error('Weekly claim error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed(error.message || 'Failed to claim weekly bonus')]
    });
  }
}
