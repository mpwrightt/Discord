import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { COLORS } from '../../lib/utils.js';

export const data = new SlashCommandBuilder()
  .setName('poll')
  .setDescription('Create a community poll')
  .addStringOption(option =>
    option
      .setName('question')
      .setDescription('Poll question')
      .setRequired(true)
      .setMaxLength(200)
  )
  .addStringOption(option =>
    option
      .setName('option1')
      .setDescription('First option')
      .setRequired(true)
      .setMaxLength(100)
  )
  .addStringOption(option =>
    option
      .setName('option2')
      .setDescription('Second option')
      .setRequired(true)
      .setMaxLength(100)
  )
  .addStringOption(option =>
    option
      .setName('option3')
      .setDescription('Third option (optional)')
      .setRequired(false)
      .setMaxLength(100)
  )
  .addStringOption(option =>
    option
      .setName('option4')
      .setDescription('Fourth option (optional)')
      .setRequired(false)
      .setMaxLength(100)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const question = interaction.options.getString('question', true);
  const option1 = interaction.options.getString('option1', true);
  const option2 = interaction.options.getString('option2', true);
  const option3 = interaction.options.getString('option3');
  const option4 = interaction.options.getString('option4');

  const options = [option1, option2, option3, option4].filter(Boolean);
  const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];

  let optionsText = '';
  for (let i = 0; i < options.length; i++) {
    optionsText += `${emojis[i]} ${options[i]}\n`;
  }

  const embed = new EmbedBuilder()
    .setTitle('📊 Community Poll')
    .setColor(COLORS.CANNABIS)
    .setDescription(`**${question}**\n\n${optionsText}`)
    .setFooter({ text: `Poll created by ${interaction.user.username}` })
    .setTimestamp();

  const message = await interaction.reply({ embeds: [embed], fetchReply: true });

  // Add reactions
  for (let i = 0; i < options.length; i++) {
    await message.react(emojis[i]);
  }
}
