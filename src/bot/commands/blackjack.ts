import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { COLORS } from '../../lib/utils.js';
import { createSuccessEmbed, createErrorEmbed } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

interface Card {
  suit: string;
  rank: string;
  value: number;
}

const SUITS = ['♠️', '♥️', '♣️', '♦️'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let i = 0; i < RANKS.length; i++) {
      const rank = RANKS[i];
      let value = i + 2;
      if (rank === 'J' || rank === 'Q' || rank === 'K') value = 10;
      if (rank === 'A') value = 11;
      deck.push({ suit, rank, value });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
}

function calculateHand(cards: Card[]): number {
  let sum = cards.reduce((acc, card) => acc + card.value, 0);
  let aces = cards.filter(card => card.rank === 'A').length;
  
  while (sum > 21 && aces > 0) {
    sum -= 10;
    aces--;
  }
  
  return sum;
}

function displayHand(cards: Card[]): string {
  return cards.map(c => `${c.rank}${c.suit}`).join(' ');
}

export const data = new SlashCommandBuilder()
  .setName('blackjack')
  .setDescription('Play blackjack and win Buds!')
  .addIntegerOption(option =>
    option
      .setName('bet')
      .setDescription('Amount of Buds to bet')
      .setRequired(true)
      .setMinValue(20)
      .setMaxValue(500)
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

    // Create deck and deal
    const deck = createDeck();
    const playerHand: Card[] = [deck.pop()!, deck.pop()!];
    const dealerHand: Card[] = [deck.pop()!, deck.pop()!];

    let playerTotal = calculateHand(playerHand);
    let dealerTotal = calculateHand(dealerHand);

    // Check for immediate blackjack
    if (playerTotal === 21) {
      const winAmount = Math.floor(bet * 2.5);
      await convex.mutation(api.users.updateBuds, {
        discordId: interaction.user.id,
        amount: winAmount - bet,
      });

      const embed = createSuccessEmbed(
        `🎰 **BLACKJACK!** 🎰\n\n` +
        `Your Hand: ${displayHand(playerHand)} = 21\n` +
        `Dealer: ${displayHand([dealerHand[0]])} ?\n\n` +
        `💰 You won **${winAmount} Buds**! (2.5x payout)\n` +
        `📊 Net Profit: **+${winAmount - bet} Buds**`
      );
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Create buttons
    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('hit')
          .setLabel('🃏 HIT')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('stand')
          .setLabel('✋ STAND')
          .setStyle(ButtonStyle.Success)
      );

    const embed = new EmbedBuilder()
      .setTitle('🎰 Blackjack')
      .setColor(COLORS.CANNABIS)
      .setDescription(
        `**Your Hand:** ${displayHand(playerHand)} = **${playerTotal}**\n` +
        `**Dealer:** ${displayHand([dealerHand[0]])} ? = **?**\n\n` +
        `💰 Bet: **${bet} Buds**`
      )
      .setFooter({ text: 'Hit to draw a card, Stand to hold' });

    const message = await interaction.editReply({ 
      embeds: [embed],
      components: [row]
    });

    // Game loop
    const collector = message.createMessageComponentCollector({ 
      filter: i => i.user.id === interaction.user.id,
      time: 60000 
    });

    collector.on('collect', async (buttonInteraction) => {
      if (buttonInteraction.customId === 'hit') {
        playerHand.push(deck.pop()!);
        playerTotal = calculateHand(playerHand);

        if (playerTotal > 21) {
          // Bust
          await convex.mutation(api.users.updateBuds, {
            discordId: interaction.user.id,
            amount: -bet,
          });

          const bustEmbed = createErrorEmbed(
            `💥 **BUST!** 💥\n\n` +
            `Your Hand: ${displayHand(playerHand)} = **${playerTotal}**\n` +
            `Dealer: ${displayHand(dealerHand)} = **${dealerTotal}**\n\n` +
            `💸 You lost **${bet} Buds**`
          );
          await buttonInteraction.update({ embeds: [bustEmbed], components: [] });
          collector.stop();
        } else {
          // Continue game
          const continueEmbed = new EmbedBuilder()
            .setTitle('🎰 Blackjack')
            .setColor(COLORS.CANNABIS)
            .setDescription(
              `**Your Hand:** ${displayHand(playerHand)} = **${playerTotal}**\n` +
              `**Dealer:** ${displayHand([dealerHand[0]])} ? = **?**\n\n` +
              `💰 Bet: **${bet} Buds**`
            )
            .setFooter({ text: 'Hit to draw a card, Stand to hold' });

          await buttonInteraction.update({ embeds: [continueEmbed] });
        }
      } else if (buttonInteraction.customId === 'stand') {
        // Dealer's turn
        while (calculateHand(dealerHand) < 17) {
          dealerHand.push(deck.pop()!);
        }
        dealerTotal = calculateHand(dealerHand);

        // Determine winner
        let resultMessage = '';
        let amount = 0;

        if (dealerTotal > 21) {
          // Dealer bust
          amount = bet;
          resultMessage = `🎉 **DEALER BUST - YOU WIN!**\n\n`;
        } else if (playerTotal > dealerTotal) {
          // Player wins
          amount = bet;
          resultMessage = `🎉 **YOU WIN!**\n\n`;
        } else if (playerTotal < dealerTotal) {
          // Dealer wins
          amount = -bet;
          resultMessage = `💔 **DEALER WINS**\n\n`;
        } else {
          // Push
          amount = 0;
          resultMessage = `🤝 **PUSH - TIE!**\n\n`;
        }

        await convex.mutation(api.users.updateBuds, {
          discordId: interaction.user.id,
          amount: amount,
        });

        const finalEmbed = amount >= 0 ? createSuccessEmbed(
          `${resultMessage}` +
          `Your Hand: ${displayHand(playerHand)} = **${playerTotal}**\n` +
          `Dealer: ${displayHand(dealerHand)} = **${dealerTotal}**\n\n` +
          `${amount > 0 ? `💰 You won **${bet} Buds**!` : '💚 No Buds lost or gained'}`
        ) : createErrorEmbed(
          `${resultMessage}` +
          `Your Hand: ${displayHand(playerHand)} = **${playerTotal}**\n` +
          `Dealer: ${displayHand(dealerHand)} = **${dealerTotal}**\n\n` +
          `💸 You lost **${bet} Buds**`
        );

        await buttonInteraction.update({ embeds: [finalEmbed], components: [] });
        collector.stop();
      }
    });

    collector.on('end', async (collected, reason) => {
      if (reason === 'time') {
        await interaction.editReply({
          embeds: [createErrorEmbed('⏱️ Game timed out! No Buds were bet.')],
          components: []
        });
      }
    });

  } catch (error: any) {
    console.error('Blackjack error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed(error.message || 'Failed to start blackjack')]
    });
  }
}
