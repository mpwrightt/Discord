import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { STRAINS } from '../../lib/strains.js';
import { COLORS } from '../../lib/utils.js';
import { createSuccessEmbed, createErrorEmbed } from '../../lib/utils.js';
import { getOrCreateUserOrThrow } from '../../lib/convex-helpers.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

const HANGMAN_STAGES = [
  '```\n  ____\n  |  |\n     |\n     |\n     |\n     |\n_____|\n```',
  '```\n  ____\n  |  |\n  O  |\n     |\n     |\n     |\n_____|\n```',
  '```\n  ____\n  |  |\n  O  |\n  |  |\n     |\n     |\n_____|\n```',
  '```\n  ____\n  |  |\n  O  |\n /|  |\n     |\n     |\n_____|\n```',
  '```\n  ____\n  |  |\n  O  |\n /|\\ |\n     |\n     |\n_____|\n```',
  '```\n  ____\n  |  |\n  O  |\n /|\\ |\n /   |\n     |\n_____|\n```',
  '```\n  ____\n  |  |\n  O  |\n /|\\ |\n / \\ |\n     |\n_____|\n```',
];

export const data = new SlashCommandBuilder()
  .setName('hangman')
  .setDescription('Play hangman with cannabis strain names!');

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    // Get user
    await getOrCreateUserOrThrow(convex, {
      id: interaction.user.id,
      username: interaction.user.username,
    });

    // Pick random strain
    const strain = STRAINS[Math.floor(Math.random() * STRAINS.length)];
    const word = strain.name.toUpperCase();
    const guessedLetters: string[] = [];
    let wrongGuesses = 0;
    const maxWrong = 6;

    function getDisplay(): string {
      return word.split('').map(char => {
        if (char === ' ') return ' ';
        if (guessedLetters.includes(char)) return char;
        return '_';
      }).join(' ');
    }

    const reward = word.length * 5;

    const embed = new EmbedBuilder()
      .setTitle('🎮 Hangman - Cannabis Strains!')
      .setColor(COLORS.CANNABIS)
      .setDescription(
        `${HANGMAN_STAGES[wrongGuesses]}\n` +
        `**Word:** ${getDisplay()}\n\n` +
        `**Guessed:** ${guessedLetters.length > 0 ? guessedLetters.join(', ') : 'None'}\n` +
        `**Wrong:** ${wrongGuesses}/${maxWrong}\n\n` +
        `💰 Reward: **${reward} Buds**\n\n` +
        `Type a letter in chat! (You have 60 seconds)`
      )
      .setFooter({ text: 'Guess one letter at a time!' });

    await interaction.editReply({ embeds: [embed] });

    // Game loop
    const gameLoop = async () => {
      if (wrongGuesses >= maxWrong) {
        // Lost
        const loseEmbed = createErrorEmbed(
          `${HANGMAN_STAGES[maxWrong]}\n` +
          `💀 **Game Over!**\n\n` +
          `The strain was: **${word}**\n\n` +
          `Better luck next time!`
        );
        await interaction.followUp({ embeds: [loseEmbed] });
        return;
      }

      if (!getDisplay().includes('_')) {
        // Won!
        await convex.mutation(api.users.updateBuds, {
          discordId: interaction.user.id,
          amount: reward,
        });

        const winEmbed = createSuccessEmbed(
          `🎉 **YOU WIN!**\n\n` +
          `The strain was: **${word}**\n` +
          `Type: ${strain.type} | THC: ${strain.thc}\n\n` +
          `💰 You earned **${reward} Buds**!`
        );
        await interaction.followUp({ embeds: [winEmbed] });
        return;
      }

      try {
        const channel = interaction.channel;
        if (!channel || !('awaitMessages' in channel)) {
          await interaction.followUp({ embeds: [createErrorEmbed('Channel unavailable for game responses.')] });
          return;
        }

        const filter = (m: any) => m.author.id === interaction.user.id;
        const collected = await channel.awaitMessages({ 
          filter, 
          max: 1, 
          time: 60000,
          errors: ['time'] 
        });

        const guess = collected?.first()?.content.toUpperCase().trim();

        if (!guess || guess.length !== 1 || !/[A-Z]/.test(guess)) {
          await interaction.followUp({ 
            content: '⚠️ Please guess a single letter!',
            ephemeral: true 
          });
          setTimeout(gameLoop, 500);
          return;
        }

        if (guessedLetters.includes(guess)) {
          await interaction.followUp({ 
            content: '⚠️ You already guessed that letter!',
            ephemeral: true 
          });
          setTimeout(gameLoop, 500);
          return;
        }

        guessedLetters.push(guess);

        if (!word.includes(guess)) {
          wrongGuesses++;
        }

        const updateEmbed = new EmbedBuilder()
          .setTitle('🎮 Hangman - Cannabis Strains!')
          .setColor(COLORS.CANNABIS)
          .setDescription(
            `${HANGMAN_STAGES[wrongGuesses]}\n` +
            `**Word:** ${getDisplay()}\n\n` +
            `**Guessed:** ${guessedLetters.join(', ')}\n` +
            `**Wrong:** ${wrongGuesses}/${maxWrong}\n\n` +
            `💰 Reward: **${reward} Buds**`
          )
          .setFooter({ text: 'Keep guessing!' });

        await interaction.followUp({ embeds: [updateEmbed] });

        setTimeout(gameLoop, 1000);

      } catch (error) {
        // Timeout
        const timeoutEmbed = createErrorEmbed(
          `⏱️ **Time's up!**\n\n` +
          `The strain was: **${word}**`
        );
        await interaction.followUp({ embeds: [timeoutEmbed] });
      }
    };

    // Start game loop
    setTimeout(gameLoop, 2000);

  } catch (error: any) {
    console.error('Hangman error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Failed to start hangman')]
    });
  }
}
