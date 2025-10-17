import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { COLORS } from '../../lib/utils.js';

export const data = new SlashCommandBuilder()
  .setName('shop')
  .setDescription('Browse items you can buy with Buds');

export async function execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setTitle('🛒 Buds Shop')
    .setColor(COLORS.CANNABIS)
    .setDescription('Spend your Buds on upgrades and perks!')
    .addFields(
      {
        name: '🌱 **Growing Upgrades** (Permanent)',
        value:
          '✅ `extra-slot` - 500 Buds - Grow 3 plants at once (instead of 2)\n' +
          '✅ `better-lights` - 800 Buds - +10% yield on all harvests\n' +
          '✅ `nutrients-pack` - 400 Buds - +15% yield on all harvests\n' +
          '✅ `advanced-hydroponics` - 1,500 Buds - **-3 days** off all grow times!\n' +
          '⚠️ `auto-water` - 800 Buds - (Coming soon)',
        inline: false
      },
      {
        name: '⚡ **Consumables** (One-time use)',
        value:
          '✅ `growth-booster` - 100 Buds - Speed up ONE plant by 1 day\n' +
          '_Use with `/grow-boost` command_',
        inline: false
      },
      {
        name: '👑 **Server Roles** (Auto-assigned!)',
        value: 
          '✅ `vip` - 1,000 Buds - VIP role with green name\n' +
          '✅ `connoisseur` - 2,500 Buds - Connoisseur role with gold name\n' +
          '✅ `master-grower` - 5,000 Buds - Master Grower role with purple\n\n' +
          '_Note: Bot will attempt to assign role automatically_',
        inline: false
      },
      {
        name: '📊 **Item Effects**',
        value:
          '**Extra Slot:** Start 3 plants instead of 2\n' +
          '**Better Lights:** Every harvest gets +10% yield\n' +
          '**Nutrients Pack:** Every harvest gets +15% yield\n' +
          '**Advanced Hydroponics:** All plants grow 3 days faster\n' +
          '**Growth Booster:** Speed up one plant by 1 day\n' +
          '**Stack bonuses:** Lights + Nutrients = +27.5% yield!',
        inline: false
      },
      {
        name: '📝 **How to Buy**',
        value: 
          'Use `/buy item:<name>` to purchase\n' +
          'Examples:\n' +
          '• `/buy item:extra-slot`\n' +
          '• `/buy item:nutrients-pack`\n' +
          '• `/buy item:vip`',
        inline: false
      }
    )
    .setFooter({ text: 'Check /balance to see your Buds' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
