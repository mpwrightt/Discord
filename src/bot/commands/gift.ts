import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { createSuccessEmbed, createErrorEmbed } from '../../lib/utils.js';
import { getOrCreateUserOrThrow } from '../../lib/convex-helpers.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export const data = new SlashCommandBuilder()
  .setName('gift')
  .setDescription('Send Buds to another user')
  .addUserOption(option =>
    option
      .setName('user')
      .setDescription('User to send Buds to')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option
      .setName('amount')
      .setDescription('Amount of Buds to send')
      .setRequired(true)
      .setMinValue(1)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const recipient = interaction.options.getUser('user', true);
    const amount = interaction.options.getInteger('amount', true);

    // Can't gift to yourself
    if (recipient.id === interaction.user.id) {
      await interaction.editReply({
        embeds: [createErrorEmbed("You can't send Buds to yourself!")]
      });
      return;
    }

    // Can't gift to bots
    if (recipient.bot) {
      await interaction.editReply({
        embeds: [createErrorEmbed("You can't send Buds to bots!")]
      });
      return;
    }

    // Get sender
    const sender = await getOrCreateUserOrThrow(convex, {
      id: interaction.user.id,
      username: interaction.user.username,
    });

    // Check balance
    if (sender.buds < amount) {
      await interaction.editReply({
        embeds: [createErrorEmbed(`You only have ${sender.buds} Buds!`)]
      });
      return;
    }

    // Get or create recipient
    await convex.mutation(api.users.getOrCreateUser, {
      discordId: recipient.id,
      username: recipient.username,
    });

    // Transfer
    await convex.mutation(api.users.updateBuds, {
      discordId: interaction.user.id,
      amount: -amount,
    });

    await convex.mutation(api.users.updateBuds, {
      discordId: recipient.id,
      amount: amount,
    });

    const embed = createSuccessEmbed(
      `🎁 **Gift Sent!**\n\n` +
      `You sent **${amount} Buds** to ${recipient.username}!\n\n` +
      `💚 Spread the love! 🌿`
    );

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    console.error('Gift error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed(error.message || 'Failed to send gift')]
    });
  }
}
