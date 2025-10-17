import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { STRAINS } from '../../lib/strains.js';
import { COLORS } from '../../lib/utils.js';
import { createSuccessEmbed, createErrorEmbed } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export const data = new SlashCommandBuilder()
  .setName('higher-lower')
  .setDescription('Guess if the next strain has higher or lower THC!')
  .addIntegerOption(option =>
    option
      .setName('bet')
      .setDescription('Amount of Buds to bet')
      .setRequired(true)
      .setMinValue(10)
      .setMaxValue(300)
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
        embeds: [createErrorEmbed(`You only have ${user.buds} Buds! You need ${bet} Buds to bet.`)]
      });
      return;
    }

    // Pick two random strains
    const strain1 = STRAINS[Math.floor(Math.random() * STRAINS.length)];
    const strain2 = STRAINS[Math.floor(Math.random() * STRAINS.length)];

    // Extract THC percentage (e.g., "18-22%" -> average of 20)
    const getThcValue = (thcStr: string): number => {
      const match = thcStr.match(/(\d+)-(\d+)/);
      if (match) {
        return (parseInt(match[1]) + parseInt(match[2])) / 2;
      }
      return parseInt(thcStr);
    };

    const thc1 = getThcValue(strain1.thc);
    const thc2 = getThcValue(strain2.thc);

    // Create buttons
    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('higher')
          .setLabel('📈 HIGHER')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('lower')
          .setLabel('📉 LOWER')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('same')
          .setLabel('➡️ SAME')
          .setStyle(ButtonStyle.Secondary)
      );

    const embed = new EmbedBuilder()
      .setTitle('🎮 Higher or Lower?')
      .setColor(COLORS.CANNABIS)
      .setDescription(
        `**Current Strain:** ${strain1.name}\n` +
        `**THC Level:** ${strain1.thc}\n\n` +
        `Will the next strain have **HIGHER** or **LOWER** THC?\n\n` +
        `💰 Bet: **${bet} Buds**`
      )
      .setFooter({ text: 'You have 20 seconds to guess!' })
      .setTimestamp();

    const message = await interaction.editReply({ 
      embeds: [embed],
      components: [row]
    });

    // Wait for button click
    try {
      const buttonInteraction = await message.awaitMessageComponent({ 
        filter: i => i.user.id === interaction.user.id,
        time: 20000 
      });

      const guess = buttonInteraction.customId;
      let correct = false;

      if (guess === 'higher' && thc2 > thc1) correct = true;
      if (guess === 'lower' && thc2 < thc1) correct = true;
      if (guess === 'same' && thc2 === thc1) correct = true;

      // Update balance
      const winAmount = bet * 2;
      const amount = correct ? bet : -bet;
      
      await convex.mutation(api.users.updateBuds, {
        discordId: interaction.user.id,
        amount: amount,
      });

      const newBalance = user.buds + amount;

      if (correct) {
        const successEmbed = createSuccessEmbed(
          `🎉 **CORRECT!**\n\n` +
          `**Previous:** ${strain1.name} (${strain1.thc})\n` +
          `**Next:** ${strain2.name} (${strain2.thc})\n\n` +
          `💰 You won **${bet} Buds**!\n` +
          `💚 New Balance: **${newBalance} Buds**\n\n` +
          `Play again with \`/higher-lower\`!`
        );
        await buttonInteraction.update({ 
          embeds: [successEmbed],
          components: []
        });
      } else {
        const failEmbed = createErrorEmbed(
          `💔 **WRONG!**\n\n` +
          `**Previous:** ${strain1.name} (${strain1.thc})\n` +
          `**Next:** ${strain2.name} (${strain2.thc})\n\n` +
          `💸 You lost **${bet} Buds**\n` +
          `💚 New Balance: **${newBalance} Buds**\n\n` +
          `Better luck next time!`
        );
        await buttonInteraction.update({ 
          embeds: [failEmbed],
          components: []
        });
      }
    } catch (error) {
      // Timeout
      await interaction.editReply({
        embeds: [createErrorEmbed('⏱️ Time\'s up! No bet placed.')],
        components: []
      });
    }
  } catch (error: any) {
    console.error('Higher-lower error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed(error.message || 'Failed to start game')]
    });
  }
}
