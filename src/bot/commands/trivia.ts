import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { COLORS } from '../../lib/utils.js';
import { createSuccessEmbed, createErrorEmbed } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

// Trivia questions database
const TRIVIA_QUESTIONS = [
  {
    question: 'What is the main psychoactive compound in cannabis?',
    options: ['CBD', 'THC', 'CBN', 'CBG'],
    correct: 1,
    difficulty: 'easy',
    reward: 10,
  },
  {
    question: 'Which terpene gives cannabis a citrus smell?',
    options: ['Myrcene', 'Pinene', 'Limonene', 'Linalool'],
    correct: 2,
    difficulty: 'medium',
    reward: 20,
  },
  {
    question: 'What does "Indica" strains typically help with?',
    options: ['Energy', 'Focus', 'Relaxation', 'Creativity'],
    correct: 2,
    difficulty: 'easy',
    reward: 10,
  },
  {
    question: 'How many days does Blue Dream typically take to grow?',
    options: ['5 days', '7 days', '10 days', '14 days'],
    correct: 1,
    difficulty: 'easy',
    reward: 10,
  },
  {
    question: 'What is the "entourage effect"?',
    options: [
      'Multiple users getting high together',
      'THC and CBD working together',
      'All cannabinoids working synergistically',
      'The effect of terpenes alone'
    ],
    correct: 2,
    difficulty: 'hard',
    reward: 30,
  },
  {
    question: 'What does CBD stand for?',
    options: ['Cannabis Bud Derivative', 'Cannabidiol', 'Cannabis Base Drug', 'Cannaboid'],
    correct: 1,
    difficulty: 'easy',
    reward: 10,
  },
  {
    question: 'Which is typically higher in THC?',
    options: ['Sativa', 'Indica', 'Hybrid', 'All the same'],
    correct: 3,
    difficulty: 'medium',
    reward: 20,
  },
];

export const data = new SlashCommandBuilder()
  .setName('trivia')
  .setDescription('Test your cannabis knowledge and earn Buds')
  .addStringOption(option =>
    option
      .setName('difficulty')
      .setDescription('Difficulty level')
      .setRequired(false)
      .addChoices(
        { name: 'Easy (10 Buds)', value: 'easy' },
        { name: 'Medium (20 Buds)', value: 'medium' },
        { name: 'Hard (30 Buds)', value: 'hard' }
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const difficulty = interaction.options.getString('difficulty');

    // Filter questions by difficulty if specified
    let questions = difficulty 
      ? TRIVIA_QUESTIONS.filter(q => q.difficulty === difficulty)
      : TRIVIA_QUESTIONS;

    if (questions.length === 0) {
      questions = TRIVIA_QUESTIONS;
    }

    // Pick random question
    const question = questions[Math.floor(Math.random() * questions.length)];

    // Create buttons for options
    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        question.options.map((option, index) =>
          new ButtonBuilder()
            .setCustomId(`trivia_${index}`)
            .setLabel(option)
            .setStyle(ButtonStyle.Primary)
        )
      );

    const embed = new EmbedBuilder()
      .setTitle('🧠 Cannabis Trivia!')
      .setColor(COLORS.CANNABIS)
      .setDescription(`**${question.question}**`)
      .addFields(
        { name: '🎯 Difficulty', value: question.difficulty.toUpperCase(), inline: true },
        { name: '💰 Reward', value: `${question.reward} Buds`, inline: true }
      )
      .setFooter({ text: 'You have 30 seconds to answer!' })
      .setTimestamp();

    const message = await interaction.editReply({ 
      embeds: [embed],
      components: [row]
    });

    // Wait for button click
    try {
      const buttonInteraction = await message.awaitMessageComponent({ 
        filter: i => i.user.id === interaction.user.id,
        time: 30000 
      });

      const answerId = parseInt(buttonInteraction.customId.split('_')[1]);
      const isCorrect = answerId === question.correct;

      if (isCorrect) {
        // Award Buds
        await convex.mutation(api.users.getOrCreateUser, {
          discordId: interaction.user.id,
          username: interaction.user.username,
        });

        await convex.mutation(api.users.updateBuds, {
          discordId: interaction.user.id,
          amount: question.reward,
        });

        const successEmbed = createSuccessEmbed(
          `🎉 **Correct!**\n\n` +
          `You earned **${question.reward} Buds**!\n\n` +
          `✨ Great job! Use \`/trivia\` again to earn more!`
        );

        await buttonInteraction.update({ 
          embeds: [successEmbed],
          components: []
        });
      } else {
        const correctAnswer = question.options[question.correct];
        const failEmbed = createErrorEmbed(
          `❌ **Wrong!**\n\n` +
          `The correct answer was: **${correctAnswer}**\n\n` +
          `Better luck next time! Try \`/trivia\` again!`
        );

        await buttonInteraction.update({ 
          embeds: [failEmbed],
          components: []
        });
      }
    } catch (error) {
      // Timeout
      await interaction.editReply({
        embeds: [createErrorEmbed('⏱️ Time\'s up! Try again with `/trivia`')],
        components: []
      });
    }
  } catch (error: any) {
    console.error('Trivia error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Failed to load trivia question')]
    });
  }
}
