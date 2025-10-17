import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { COLORS } from '../../lib/utils.js';
import { createErrorEmbed } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export const data = new SlashCommandBuilder()
  .setName('inventory')
  .setDescription('View your purchased items and upgrades');

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const user = await convex.mutation(api.users.getOrCreateUser, {
      discordId: interaction.user.id,
      username: interaction.user.username,
    });

    if (user.equipmentOwned.length === 0) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Your inventory is empty! Visit `/shop` to buy items.')]
      });
      return;
    }

    const itemNames: Record<string, string> = {
      'extra-slot': '🌱 Extra Plant Slot',
      'auto-water': '💧 Auto-Water System',
      'better-lights': '💡 Better Grow Lights',
      'nutrients-pack': '🌟 Nutrients Pack',
      'advanced-hydroponics': '⚡ Advanced Hydroponics',
      'growth-booster': '💊 Growth Booster',
      'vip': '👑 VIP Role',
      'connoisseur': '🏆 Connoisseur Role',
      'master-grower': '🌿 Master Grower Role',
    };

    let inventoryText = '**🛡️ Permanent Upgrades:**\n';
    if (user.equipmentOwned.length > 0) {
      for (const item of user.equipmentOwned) {
        inventoryText += `${itemNames[item] || item}\n`;
      }
    } else {
      inventoryText += '_None yet_\n';
    }

    inventoryText += '\n**⚡ Consumables:**\n';
    const consumables = user.consumables || {};
    const consumableEntries = Object.entries(consumables).filter(([_, count]) => (count as number) > 0);
    if (consumableEntries.length > 0) {
      for (const [item, count] of consumableEntries) {
        inventoryText += `${itemNames[item] || item} x**${count}**\n`;
      }
    } else {
      inventoryText += '_None_\n';
    }

    const embed = new EmbedBuilder()
      .setTitle(`🎒 ${interaction.user.username}'s Inventory`)
      .setColor(COLORS.CANNABIS)
      .setDescription(inventoryText)
      .addFields(
        { name: '📦 Total Items', value: `**${user.equipmentOwned.length}**`, inline: true },
        { name: '💚 Buds', value: `**${user.buds}**`, inline: true }
      )
      .setFooter({ text: 'Use /shop to buy more items!' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    console.error('Inventory error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Failed to load inventory')]
    });
  }
}
