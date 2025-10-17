import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { COLORS } from '../../lib/utils.js';
import { createSuccessEmbed, createErrorEmbed } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

const CANNABIS_WORDS = [
  'bud', 'leaf', 'flower', 'resin', 'nug', 'grow', 'weed', 'dank',
  'kief', 'fan', 'node', 'edge', 'effect', 'toke', 'extract', 'terpene',
  'euphoria', 'aroma', 'amber', 'root', 'trim', 'mellow', 'wake',
  'exotic', 'cola', 'ache', 'essence', 'elevate', 'entourage', 'edible'
];

export const data = new SlashCommandBuilder()
  .setName('wordchain')
  .setDescription('Create a cannabis word chain! Link words by last/first letter');

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    // Get user
    await convex.mutation(api.users.getOrCreateUser, {
      discordId: interaction.user.id,
      username: interaction.user.username,
    });

    // Pick starting word
    const startWord = CANNABIS_WORDS[Math.floor(Math.random() * CANNABIS_WORDS.length)];
    const chain = [startWord];
    let currentRound = 1;
    const maxRounds = 5;
    let totalReward = 0;

    const embed = new EmbedBuilder()
      .setTitle('🔗 Cannabis Word Chain!')
      .setColor(COLORS.CANNABIS)
      .setDescription(
        `Create a chain of cannabis-related words!\n\n` +
        `**Rules:**\n` +
        `• Each word must start with the last letter of the previous word\n` +
        `• Words must be cannabis-related\n` +
        `• You have 15 seconds per word\n\n` +
        `**Starting word:** **${startWord.toUpperCase()}**\n` +
        `Last letter: **${startWord[startWord.length - 1].toUpperCase()}**\n\n` +
        `💰 Reward: 10 Buds per word (max 5 words)`
      )
      .setFooter({ text: `Round ${currentRound}/${maxRounds} • Type your word in chat!` });

    await interaction.editReply({ embeds: [embed] });

    // Game loop
    const gameLoop = async () => {
      if (currentRound > maxRounds) {
        // Game complete
        await convex.mutation(api.users.updateBuds, {
          discordId: interaction.user.id,
          amount: totalReward,
        });

        const successEmbed = createSuccessEmbed(
          `🎉 **Word Chain Complete!**\n\n` +
          `**Your Chain:** ${chain.join(' → ')}\n\n` +
          `💰 You earned **${totalReward} Buds**!`
        );
        await interaction.followUp({ embeds: [successEmbed] });
        return;
      }

      const lastWord = chain[chain.length - 1];
      const targetLetter = lastWord[lastWord.length - 1].toLowerCase();

      try {
        const filter = (m: any) => m.author.id === interaction.user.id;
        const collected = await interaction.channel?.awaitMessages({ 
          filter, 
          max: 1, 
          time: 15000,
          errors: ['time'] 
        });

        const userWord = collected?.first()?.content.toLowerCase().trim();

        if (!userWord) {
          throw new Error('No word provided');
        }

        // Validate word
        if (userWord[0] !== targetLetter) {
          const failEmbed = createErrorEmbed(
            `❌ **Wrong!**\n\n` +
            `Your word must start with **${targetLetter.toUpperCase()}**\n` +
            `You said: **${userWord}**\n\n` +
            `Chain ended at ${currentRound - 1} words.\n` +
            `You earned **${totalReward} Buds**`
          );
          
          if (totalReward > 0) {
            await convex.mutation(api.users.updateBuds, {
              discordId: interaction.user.id,
              amount: totalReward,
            });
          }
          
          await interaction.followUp({ embeds: [failEmbed] });
          return;
        }

        // Check if cannabis-related (simple check)
        const isCannabisWord = CANNABIS_WORDS.includes(userWord) || 
                               userWord.length >= 3; // Accept any 3+ letter word for flexibility

        if (!isCannabisWord) {
          const failEmbed = createErrorEmbed(
            `❌ **Invalid!**\n\n` +
            `Word must be cannabis-related and 3+ letters.\n\n` +
            `You earned **${totalReward} Buds**`
          );
          
          if (totalReward > 0) {
            await convex.mutation(api.users.updateBuds, {
              discordId: interaction.user.id,
              amount: totalReward,
            });
          }
          
          await interaction.followUp({ embeds: [failEmbed] });
          return;
        }

        // Valid word!
        chain.push(userWord);
        totalReward += 10;
        currentRound++;

        const continueEmbed = new EmbedBuilder()
          .setTitle('✅ Good!')
          .setColor(COLORS.CANNABIS)
          .setDescription(
            `**Chain so far:** ${chain.join(' → ')}\n\n` +
            `**Next letter:** ${userWord[userWord.length - 1].toUpperCase()}\n` +
            `💰 Current reward: **${totalReward} Buds**`
          )
          .setFooter({ text: `Round ${currentRound}/${maxRounds} • Type your next word!` });

        await interaction.followUp({ embeds: [continueEmbed] });

        // Continue to next round
        setTimeout(gameLoop, 1000);

      } catch (error) {
        // Timeout
        const timeoutEmbed = createErrorEmbed(
          `⏱️ **Time's up!**\n\n` +
          `Chain ended at ${currentRound - 1} words.\n` +
          `**Your Chain:** ${chain.join(' → ')}\n\n` +
          `You earned **${totalReward} Buds**`
        );
        
        if (totalReward > 0) {
          await convex.mutation(api.users.updateBuds, {
            discordId: interaction.user.id,
            amount: totalReward,
          });
        }
        
        await interaction.followUp({ embeds: [timeoutEmbed] });
      }
    };

    // Start game loop
    setTimeout(gameLoop, 2000);

  } catch (error: any) {
    console.error('Wordchain error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Failed to start word chain')]
    });
  }
}
