import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { createSuccessEmbed, createErrorEmbed } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

const SYMBOLS = ['🌿', '💚', '🌱', '🍀', '💎', '⭐', '🔥'];
const PAYOUTS = {
  '💎💎💎': 50,  // Jackpot!
  '⭐⭐⭐': 25,
  '🔥🔥🔥': 20,
  '🌿🌿🌿': 10,
  '💚💚💚': 10,
  '🌱🌱🌱': 8,
  '🍀🍀🍀': 8,
};

export const data = new SlashCommandBuilder()
  .setName('slots')
  .setDescription('Spin the slot machine and win Buds!')
  .addIntegerOption(option =>
    option
      .setName('bet')
      .setDescription('Amount of Buds to bet')
      .setRequired(true)
      .setMinValue(10)
      .setMaxValue(200)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const bet = interaction.options.getInteger('bet', true);

    // Get user
    const user = await convex.mutation(api.users.getOrCreateUser, {
      discordId: interaction.user.id,
      username: interaction.user.username,
    });

    // Check balance
    if (user.buds < bet) {
      await interaction.editReply({
        embeds: [createErrorEmbed(`You only have ${user.buds} Buds! You need ${bet} Buds to play.`)]
      });
      return;
    }

    // Spin the slots
    const slot1 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const slot2 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const slot3 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

    const result = `${slot1}${slot2}${slot3}`;
    const payout = PAYOUTS[result as keyof typeof PAYOUTS];

    let winAmount = 0;
    let message = '';

    if (payout) {
      // Win!
      winAmount = bet * payout;
      await convex.mutation(api.users.updateBuds, {
        discordId: interaction.user.id,
        amount: winAmount - bet, // Net win (payout - bet)
      });

      message = `🎰 **SLOT MACHINE** 🎰\n\n` +
        `${slot1} | ${slot2} | ${slot3}\n\n` +
        `🎉 **${result}** - YOU WIN!\n\n` +
        `💰 Multiplier: **x${payout}**\n` +
        `💚 You won **${winAmount} Buds**!\n` +
        `📊 Net Profit: **+${winAmount - bet} Buds**\n\n` +
        `Keep spinning with \`/slots\`!`;

      const embed = createSuccessEmbed(message);
      await interaction.editReply({ embeds: [embed] });
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
      // Two matching - small consolation
      const consolation = Math.floor(bet * 0.5);
      await convex.mutation(api.users.updateBuds, {
        discordId: interaction.user.id,
        amount: consolation - bet,
      });

      message = `🎰 **SLOT MACHINE** 🎰\n\n` +
        `${slot1} | ${slot2} | ${slot3}\n\n` +
        `😅 **Two matching!**\n\n` +
        `💚 Consolation: **${consolation} Buds**\n` +
        `📊 Net Loss: **-${bet - consolation} Buds**\n\n` +
        `Better luck next time!`;

      const embed = createErrorEmbed(message);
      await interaction.editReply({ embeds: [embed] });
    } else {
      // Loss
      await convex.mutation(api.users.updateBuds, {
        discordId: interaction.user.id,
        amount: -bet,
      });

      message = `🎰 **SLOT MACHINE** 🎰\n\n` +
        `${slot1} | ${slot2} | ${slot3}\n\n` +
        `💔 **No Match**\n\n` +
        `💸 You lost **${bet} Buds**\n\n` +
        `Try again with \`/slots\`!`;

      const embed = createErrorEmbed(message);
      await interaction.editReply({ embeds: [embed] });
    }
  } catch (error: any) {
    console.error('Slots error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed(error.message || 'Failed to play slots')]
    });
  }
}
