import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { STRAINS } from '../../lib/strains.js';
import { COLORS } from '../../lib/utils.js';
import { createSuccessEmbed, createErrorEmbed } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

function scrambleWord(word: string): string {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

export const data = new SlashCommandBuilder()
  .setName('scramble')
  .setDescription('Unscramble a cannabis strain name and win Buds!');

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    // Get user
    await convex.mutation(api.users.getOrCreateUser, {
      discordId: interaction.user.id,
      username: interaction.user.username,
    });

    // Pick random strain
    const strain = STRAINS[Math.floor(Math.random() * STRAINS.length)];
    const scrambled = scrambleWord(strain.name.replace(/\s/g, '').toLowerCase());
    const reward = strain.name.length * 3; // Longer names = more reward

    const embed = new EmbedBuilder()
      .setTitle('🔤 Word Scramble!')
      .setColor(COLORS.CANNABIS)
      .setDescription(
        `Unscramble this cannabis strain name:\n\n` +
        `**${scrambled.toUpperCase()}**\n\n` +
        `Type your answer in chat! (You have 30 seconds)\n\n` +
        `💰 Reward: **${reward} Buds**`
      )
      .setFooter({ text: 'Hint: It\'s a cannabis strain from the game!' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });

    // Wait for message
    const filter = (m: any) => m.author.id === interaction.user.id;
    
    try {
      const collected = await interaction.channel?.awaitMessages({ 
        filter, 
        max: 1, 
        time: 30000,
        errors: ['time'] 
      });

      const answer = collected?.first()?.content.toLowerCase().replace(/\s/g, '');
      const correct = answer === strain.name.toLowerCase().replace(/\s/g, '');

      if (correct) {
        // Award Buds
        await convex.mutation(api.users.updateBuds, {
          discordId: interaction.user.id,
          amount: reward,
        });

        const successEmbed = createSuccessEmbed(
          `🎉 **CORRECT!**\n\n` +
          `The answer was: **${strain.name}**\n\n` +
          `💰 You earned **${reward} Buds**!\n\n` +
          `Play again with \`/scramble\`!`
        );

        await interaction.followUp({ embeds: [successEmbed] });
      } else {
        const failEmbed = createErrorEmbed(
          `❌ **Wrong!**\n\n` +
          `The correct answer was: **${strain.name}**\n\n` +
          `You guessed: **${collected?.first()?.content}**\n\n` +
          `Try again with \`/scramble\`!`
        );

        await interaction.followUp({ embeds: [failEmbed] });
      }
    } catch (error) {
      // Timeout
      const timeoutEmbed = createErrorEmbed(
        `⏱️ **Time's up!**\n\n` +
        `The answer was: **${strain.name}**\n\n` +
        `Try again with \`/scramble\`!`
      );
      await interaction.followUp({ embeds: [timeoutEmbed] });
    }
  } catch (error: any) {
    console.error('Scramble error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Failed to start game')]
    });
  }
}
