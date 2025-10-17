import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { createSuccessEmbed, createErrorEmbed } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export const data = new SlashCommandBuilder()
  .setName('coinflip')
  .setDescription('Flip a coin and double your Buds or lose them!')
  .addIntegerOption(option =>
    option
      .setName('bet')
      .setDescription('Amount of Buds to bet')
      .setRequired(true)
      .setMinValue(10)
      .setMaxValue(500)
  )
  .addStringOption(option =>
    option
      .setName('choice')
      .setDescription('Heads or Tails?')
      .setRequired(true)
      .addChoices(
        { name: '🌿 Heads', value: 'heads' },
        { name: '💚 Tails', value: 'tails' }
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const bet = interaction.options.getInteger('bet', true);
    const choice = interaction.options.getString('choice', true);

    // Get user
    const user = await convex.mutation(api.users.getOrCreateUser, {
      discordId: interaction.user.id,
      username: interaction.user.username,
    });

    // Check balance
    if (user.buds < bet) {
      await interaction.editReply({
        embeds: [createErrorEmbed(`You only have ${user.buds} Buds! You need ${bet} Buds to bet.`)]
      });
      return;
    }

    // Flip the coin
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const won = result === choice;

    // Update balance
    const amount = won ? bet : -bet;
    await convex.mutation(api.users.updateBuds, {
      discordId: interaction.user.id,
      amount: amount,
    });

    const newBalance = user.buds + amount;

    if (won) {
      const embed = createSuccessEmbed(
        `🎉 **YOU WON!**\n\n` +
        `The coin landed on **${result === 'heads' ? '🌿 Heads' : '💚 Tails'}**!\n\n` +
        `💰 You won **${bet} Buds**!\n` +
        `💚 New Balance: **${newBalance} Buds**\n\n` +
        `Try your luck again with \`/coinflip\`!`
      );
      await interaction.editReply({ embeds: [embed] });
    } else {
      const embed = createErrorEmbed(
        `💔 **You Lost!**\n\n` +
        `The coin landed on **${result === 'heads' ? '🌿 Heads' : '💚 Tails'}**\n\n` +
        `You bet on **${choice === 'heads' ? '🌿 Heads' : '💚 Tails'}**\n\n` +
        `💸 You lost **${bet} Buds**\n` +
        `💚 New Balance: **${newBalance} Buds**\n\n` +
        `Better luck next time!`
      );
      await interaction.editReply({ embeds: [embed] });
    }
  } catch (error: any) {
    console.error('Coinflip error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed(error.message || 'Failed to flip coin')]
    });
  }
}
