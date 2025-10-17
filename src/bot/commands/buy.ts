import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { createSuccessEmbed, createErrorEmbed } from '../../lib/utils.js';
import { getOrCreateUserOrThrow } from '../../lib/convex-helpers.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

const SHOP_ITEMS: Record<string, { name: string; cost: number; description: string; consumable?: boolean }> = {
  'extra-slot': { name: 'Extra Plant Slot', cost: 500, description: 'Grow 1 more plant at once' },
  'auto-water': { name: 'Auto-Water System', cost: 800, description: 'Never miss watering' },
  'better-lights': { name: 'Better Grow Lights', cost: 800, description: '+10% yield on all grows' },
  'nutrients-pack': { name: 'Nutrients Pack', cost: 400, description: 'Permanent +15% yield' },
  'advanced-hydroponics': { name: 'Advanced Hydroponics', cost: 1500, description: 'Permanent -3 days off all grow times' },
  'growth-booster': { name: 'Growth Booster', cost: 100, description: 'Speed up one plant by 1 day', consumable: true },
  'vip': { name: 'VIP Role', cost: 1000, description: 'Green name, priority support' },
  'connoisseur': { name: 'Connoisseur Role', cost: 2500, description: 'Gold name, exclusive channels' },
  'master-grower': { name: 'Master Grower Role', cost: 5000, description: 'Purple name, all perks' },
};

export const data = new SlashCommandBuilder()
  .setName('buy')
  .setDescription('Purchase an item from the shop')
  .addStringOption(option =>
    option
      .setName('item')
      .setDescription('Item to buy')
      .setRequired(true)
      .addChoices(
        { name: 'Extra Plant Slot (500 Buds)', value: 'extra-slot' },
        { name: 'Better Grow Lights (800 Buds)', value: 'better-lights' },
        { name: 'Nutrients Pack (400 Buds)', value: 'nutrients-pack' },
        { name: 'Advanced Hydroponics (1,500 Buds) -3 days!', value: 'advanced-hydroponics' },
        { name: 'Growth Booster (100 Buds) -1 day consumable', value: 'growth-booster' },
        { name: 'VIP Role (1,000 Buds)', value: 'vip' },
        { name: 'Connoisseur Role (2,500 Buds)', value: 'connoisseur' },
        { name: 'Master Grower Role (5,000 Buds)', value: 'master-grower' }
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const itemKey = interaction.options.getString('item', true);
    const item = SHOP_ITEMS[itemKey];

    if (!item) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Invalid item')]
      });
      return;
    }

    // Get user
    const user = await getOrCreateUserOrThrow(convex, {
      id: interaction.user.id,
      username: interaction.user.username,
    });

    // Check if already owned (skip for consumables)
    if (!item.consumable && user.equipmentOwned.includes(itemKey)) {
      await interaction.editReply({
        embeds: [createErrorEmbed('You already own this item!')]
      });
      return;
    }

    // Check balance
    if (user.buds < item.cost) {
      await interaction.editReply({
        embeds: [createErrorEmbed(`You need ${item.cost} Buds but only have ${user.buds} Buds`)]
      });
      return;
    }

    // Deduct buds
    await convex.mutation(api.users.updateBuds, {
      discordId: interaction.user.id,
      amount: -item.cost,
    });

    // Add item to inventory
    if (item.consumable) {
      // Consumable - add to consumables count
      await convex.mutation(api.users.addConsumable, {
        discordId: interaction.user.id,
        itemId: itemKey,
        quantity: 1,
      });
    } else {
      // Permanent item - add to equipment
      await convex.mutation(api.users.addItemToInventory, {
        discordId: interaction.user.id,
        itemId: itemKey,
      });
    }

    // Try to assign Discord role if it's a role purchase
    let roleAssigned = false;
    let roleNote = '';
    
    if (itemKey === 'vip' || itemKey === 'connoisseur' || itemKey === 'master-grower') {
      try {
        const roleNames: Record<string, string> = {
          'vip': 'VIP',
          'connoisseur': 'Connoisseur',
          'master-grower': 'Master Grower',
        };
        
        const roleName = roleNames[itemKey];
        const guild = interaction.guild;
        
        if (guild) {
          // Find the role by name
          const role = guild.roles.cache.find(r => r.name === roleName);
          
          if (role) {
            const member = await guild.members.fetch(interaction.user.id);
            await member.roles.add(role);
            roleAssigned = true;
            roleNote = `\n\n✅ **${roleName}** role assigned!`;
          } else {
            roleNote = `\n\n⚠️ Role purchased but not assigned.\nAsk an admin to create a "${roleName}" role and assign it to you.`;
          }
        }
      } catch (error) {
        console.error('Role assignment error:', error);
        roleNote = '\n\n⚠️ Role purchased but couldn\'t auto-assign. Contact an admin.';
      }
    }

    const itemType = item.consumable ? 'consumable' : 'inventory';
    const embed = createSuccessEmbed(
      `🛒 **Purchase Complete!**\n\n` +
      `You bought **${item.name}**!\n` +
      `💰 Cost: **${item.cost} Buds**\n` +
      `📝 ${item.description}${roleNote}\n\n` +
      `_Item has been added to your ${itemType}_` +
      (item.consumable ? '\n💡 Use `/grow-boost` to activate it!' : '')
    );

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    console.error('Buy error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed(error.message || 'Failed to purchase item')]
    });
  }
}
