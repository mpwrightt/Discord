import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { COLORS } from '../../lib/utils.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Show all available commands');

export async function execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setTitle('🌿 Cannabis Community Bot - Commands')
    .setColor(COLORS.CANNABIS)
    .setDescription('Welcome to the ultimate cannabis community bot!')
    .addFields(
      {
        name: '🤖 AI Chat',
        value: '`/chat` - Talk with AI personalities\n`/ask` - Quick question & answer',
        inline: false
      },
      {
        name: '🌱 Grow Sim',
        value: '`/grow-start` - Start growing a plant\n`/grow-water` - Water your plants\n`/grow-check` - Check plant status\n`/grow-harvest` - Harvest your buds\n`/sell` - Sell harvested buds',
        inline: false
      },
      {
        name: '💰 Economy',
        value: '`/balance` - Check your Buds\n`/shop` - Browse the shop\n`/market` - Check current prices\n`/daily` - Claim daily bonus',
        inline: false
      },
      {
        name: '🎮 Games',
        value: '`/trivia` - Cannabis trivia\n`/slots` - Slot machine\n`/higher-lower` - THC guessing game',
        inline: false
      },
      {
        name: '🎨 Image Generation',
        value: '`/generate` - Create AI art\n`/gallery` - Browse community art',
        inline: false
      },
      {
        name: '📚 Info',
        value: '`/strain` - Get strain information\n`/effects` - Get strain recommendations\n`/profile` - View user profile',
        inline: false
      }
    )
    .setFooter({ text: 'More commands coming soon! 🚀' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
