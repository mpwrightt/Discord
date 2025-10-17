import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { COLORS, createErrorEmbed, createSuccessEmbed } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export const data = new SlashCommandBuilder()
  .setName('admin-db')
  .setDescription('Database administration commands (Admin only)')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand(subcommand =>
    subcommand
      .setName('init')
      .setDescription('Initialize database with seed data')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('stats')
      .setDescription('View database statistics')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('status')
      .setDescription('Check database initialization status')
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });
  
  const subcommand = interaction.options.getSubcommand();

  try {
    switch (subcommand) {
      case 'init': {
        // Initialize database with seed data
        const result = await convex.mutation(api.seed.initializeDatabase);
        
        const embed = createSuccessEmbed(
          '✅ **Database Initialized**\n\n' +
          'The following data has been seeded:\n' +
          `• Market Price: ${result.created.marketPrice ? 'Created ✅' : 'Already exists'}\n\n` +
          'Your bot is ready to use!'
        );
        
        await interaction.editReply({ embeds: [embed] });
        break;
      }

      case 'status': {
        // Check database status
        const status = await convex.query(api.seed.checkDatabaseStatus);
        
        const embed = new EmbedBuilder()
          .setTitle('📊 Database Status')
          .setColor(status.isInitialized ? COLORS.SUCCESS : COLORS.WARNING)
          .addFields(
            { name: '💰 Market Price', value: status.marketPrice ? `${status.marketPrice} Buds/gram` : '❌ Not initialized', inline: true },
            { name: '👥 Total Users', value: status.userCount.toString(), inline: true },
            { name: '🌱 Active Plants', value: status.plantCount.toString(), inline: true },
            { name: '🎒 Inventory Items', value: status.inventoryCount.toString(), inline: true },
            { name: '✅ Status', value: status.isInitialized ? 'Initialized' : '⚠️ Needs initialization', inline: true }
          )
          .setTimestamp();

        if (!status.isInitialized) {
          embed.setDescription('⚠️ Database needs initialization. Run `/admin-db init` to set up.');
        }
        
        await interaction.editReply({ embeds: [embed] });
        break;
      }

      case 'stats': {
        // Get detailed database statistics
        const stats = await convex.query(api.seed.getDatabaseStats);
        
        const embed = new EmbedBuilder()
          .setTitle('📊 Database Statistics')
          .setColor(COLORS.CANNABIS)
          .addFields(
            { 
              name: '👥 Users', 
              value: 
                `Total: **${stats.users.total}**\n` +
                `Total Buds: **${stats.users.totalBuds.toLocaleString()}** 💰\n` +
                `Total Grams: **${stats.users.totalGrams.toLocaleString()}g** 🌿\n` +
                `Total Grown: **${stats.users.totalGramsGrown.toLocaleString()}g**`,
              inline: false 
            },
            { 
              name: '🌱 Plants', 
              value: 
                `Total: **${stats.plants.total}**\n` +
                `Active: **${stats.plants.active}** 🌱\n` +
                `Harvested: **${stats.plants.harvested}** ✅`,
              inline: true 
            },
            { 
              name: '💼 Economy', 
              value: 
                `Inventory Items: **${stats.inventory.totalItems}**\n` +
                `Images: **${stats.images.total}**\n` +
                `Achievements: **${stats.achievements.total}**`,
              inline: true 
            },
            {
              name: '💰 Market',
              value: `Current Price: **${stats.market.currentPrice} Buds/gram**`,
              inline: false
            }
          )
          .setTimestamp();

        // Add top users if they exist
        if (stats.users.topByBuds.length > 0) {
          const topBuds = stats.users.topByBuds
            .map((u, i) => `${i + 1}. **${u.username}** - ${u.buds.toLocaleString()} Buds`)
            .join('\n');
          embed.addFields({ name: '🏆 Top by Buds', value: topBuds, inline: false });
        }
        
        await interaction.editReply({ embeds: [embed] });
        break;
      }
    }
  } catch (error: any) {
    console.error('Admin DB command error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed(`Failed to execute command: ${error.message}`)]
    });
  }
}
