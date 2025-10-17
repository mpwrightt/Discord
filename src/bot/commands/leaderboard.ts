import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { COLORS, formatNumber } from '../../lib/utils.js';
import { createErrorEmbed } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export const data = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('View the top growers')
  .addStringOption(option =>
    option
      .setName('type')
      .setDescription('Leaderboard type')
      .setRequired(false)
      .addChoices(
        { name: 'Buds', value: 'buds' },
        { name: 'Level', value: 'level' },
        { name: 'Total Grown', value: 'grown' }
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const type = interaction.options.getString('type') || 'buds';

    // Get leaderboard data
    const leaders = await convex.query(api.users.getLeaderboard, {
      type: type,
    });

    if (leaders.length === 0) {
      await interaction.editReply({
        embeds: [createErrorEmbed('No data available yet!')]
      });
      return;
    }

    // Build leaderboard text
    let description = '';
    const medals = ['🥇', '🥈', '🥉'];
    
    for (let i = 0; i < Math.min(10, leaders.length); i++) {
      const leader = leaders[i];
      const medal = i < 3 ? medals[i] : `**${i + 1}.**`;
      
      let value = '';
      if (type === 'buds') {
        value = `${formatNumber(leader.buds)} Buds`;
      } else if (type === 'level') {
        value = `Level ${leader.level}`;
      } else if (type === 'grown') {
        value = `${leader.totalGramsGrown}g grown`;
      }
      
      description += `${medal} **${leader.username}** - ${value}\n`;
    }

    const titles: Record<string, string> = {
      'buds': '💰 Top Ballers',
      'level': '⭐ Top Levels',
      'grown': '🌾 Top Growers',
    };

    const embed = new EmbedBuilder()
      .setTitle(titles[type] || '🏆 Leaderboard')
      .setColor(COLORS.CANNABIS)
      .setDescription(description)
      .setFooter({ text: 'Keep growing to climb the ranks!' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    console.error('Leaderboard error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Failed to load leaderboard')]
    });
  }
}
