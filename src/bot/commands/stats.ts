import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { COLORS, formatNumber } from '../../lib/utils.js';
import { createErrorEmbed } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export const data = new SlashCommandBuilder()
  .setName('stats')
  .setDescription('View detailed server and personal statistics')
  .addStringOption(option =>
    option
      .setName('type')
      .setDescription('Type of stats to view')
      .setRequired(false)
      .addChoices(
        { name: '👤 Personal Stats', value: 'personal' },
        { name: '🌍 Server Stats', value: 'server' },
        { name: '🌱 Growing Stats', value: 'growing' }
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const type = interaction.options.getString('type') || 'personal';

    if (type === 'personal') {
      // Personal stats
      const user = await convex.mutation(api.users.getOrCreateUser, {
        discordId: interaction.user.id,
        username: interaction.user.username,
      });

      const activePlants = await convex.query(api.grows.getActivePlants, {
        userId: interaction.user.id,
      });

      const daysActive = Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24));
      const avgBudsPerDay = daysActive > 0 ? Math.floor(user.totalBudsEarned / daysActive) : 0;

      const embed = new EmbedBuilder()
        .setTitle(`📊 ${interaction.user.username}'s Statistics`)
        .setColor(COLORS.CANNABIS)
        .setThumbnail(interaction.user.displayAvatarURL())
        .addFields(
          { name: '━━━━━━ 💰 Economy ━━━━━━', value: '\u200B', inline: false },
          { name: '💚 Current Buds', value: `**${formatNumber(user.buds)}**`, inline: true },
          { name: '💵 Total Earned', value: `**${formatNumber(user.totalBudsEarned)}**`, inline: true },
          { name: '📈 Avg Per Day', value: `**${avgBudsPerDay}** Buds`, inline: true },
          { name: '━━━━━━ 🌱 Growing ━━━━━━', value: '\u200B', inline: false },
          { name: '🌿 Total Grown', value: `**${user.totalGramsGrown}g**`, inline: true },
          { name: '💰 Total Sold', value: `**${user.totalGramsSold}g**`, inline: true },
          { name: '🌱 Active Plants', value: `**${activePlants.length}**`, inline: true },
          { name: '━━━━━━ 📊 Progression ━━━━━━', value: '\u200B', inline: false },
          { name: '⭐ Level', value: `**${user.level}**`, inline: true },
          { name: '🎯 XP', value: `**${formatNumber(user.xp)}**`, inline: true },
          { name: '🔥 Daily Streak', value: `**${user.dailyStreak}** days`, inline: true },
          { name: '━━━━━━ ⏱️ Activity ━━━━━━', value: '\u200B', inline: false },
          { name: '📅 Member Since', value: new Date(user.createdAt).toLocaleDateString(), inline: true },
          { name: '⏰ Days Active', value: `**${daysActive}** days`, inline: true },
          { name: '🎨 Images Generated', value: `**${user.imageGenerationsToday}** today`, inline: true }
        )
        .setFooter({ text: 'Keep growing to improve your stats!' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } else if (type === 'server') {
      // Server-wide stats (placeholder)
      const embed = new EmbedBuilder()
        .setTitle('🌍 Server Statistics')
        .setColor(COLORS.CANNABIS)
        .setDescription('**Community Overview**')
        .addFields(
          { name: '👥 Total Growers', value: 'Coming Soon', inline: true },
          { name: '🌱 Plants Growing', value: 'Coming Soon', inline: true },
          { name: '💰 Total Buds', value: 'Coming Soon', inline: true },
          { name: '🌿 Total Grams Grown', value: 'Coming Soon', inline: true },
          { name: '🎮 Games Played', value: 'Coming Soon', inline: true },
          { name: '🎨 Images Generated', value: 'Coming Soon', inline: true }
        )
        .setFooter({ text: 'Server stats coming soon with database aggregation!' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } else {
      // Growing-specific stats
      const user = await convex.mutation(api.users.getOrCreateUser, {
        discordId: interaction.user.id,
        username: interaction.user.username,
      });

      const activePlants = await convex.query(api.grows.getActivePlants, {
        userId: interaction.user.id,
      });

      const marketPrice = await convex.query(api.grows.getMarketPrice);
      const stashValue = Math.floor(user.gramsStashed * marketPrice);

      const embed = new EmbedBuilder()
        .setTitle('🌱 Your Growing Statistics')
        .setColor(COLORS.CANNABIS)
        .addFields(
          { name: '🌿 Total Grams Grown', value: `**${user.totalGramsGrown}g**`, inline: true },
          { name: '💰 Total Grams Sold', value: `**${user.totalGramsSold}g**`, inline: true },
          { name: '📦 Currently Stashed', value: `**${user.gramsStashed}g**`, inline: true },
          { name: '💵 Stash Value', value: `**${formatNumber(stashValue)} Buds**`, inline: true },
          { name: '📊 Current Market', value: `**${marketPrice.toFixed(1)} Buds/g**`, inline: true },
          { name: '🌱 Active Grows', value: `**${activePlants.length}** plants`, inline: true },
          { name: '📈 Efficiency', value: 
            user.totalGramsGrown > 0 
              ? `${((user.totalGramsSold / user.totalGramsGrown) * 100).toFixed(1)}% sold`
              : 'No harvests yet',
            inline: true
          },
          { name: '💚 Lifetime Revenue', value: 
            user.totalGramsSold > 0
              ? `~${formatNumber(Math.floor(user.totalGramsSold * 3))} Buds`
              : '0 Buds',
            inline: true
          },
          { name: '🎯 Next Milestone', value: 
            user.totalGramsGrown < 100 ? '100g Total Grown' :
            user.totalGramsGrown < 500 ? '500g Total Grown' :
            user.totalGramsGrown < 1000 ? '1kg Total Grown' :
            user.totalGramsGrown < 5000 ? '5kg Total Grown' :
            '10kg Master Grower!',
            inline: true
          }
        )
        .setFooter({ text: 'Use /grow-start to grow more cannabis!' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    }

  } catch (error: any) {
    console.error('Stats error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Failed to load statistics')]
    });
  }
}
