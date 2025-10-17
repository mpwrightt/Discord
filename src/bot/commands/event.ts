import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { COLORS, createSuccessEmbed } from '../../lib/utils.js';

export const data = new SlashCommandBuilder()
  .setName('event')
  .setDescription('Create a community event announcement')
  .addStringOption(option =>
    option
      .setName('title')
      .setDescription('Event title')
      .setRequired(true)
      .setMaxLength(100)
  )
  .addStringOption(option =>
    option
      .setName('description')
      .setDescription('Event description')
      .setRequired(true)
      .setMaxLength(500)
  )
  .addStringOption(option =>
    option
      .setName('time')
      .setDescription('Event time (e.g., "Tomorrow 7PM EST")')
      .setRequired(true)
      .setMaxLength(100)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const title = interaction.options.getString('title', true);
  const description = interaction.options.getString('description', true);
  const time = interaction.options.getString('time', true);

  const embed = new EmbedBuilder()
    .setTitle(`📅 ${title}`)
    .setColor(COLORS.CANNABIS)
    .setDescription(description)
    .addFields(
      { name: '⏰ When', value: time, inline: true },
      { name: '👤 Host', value: interaction.user.username, inline: true }
    )
    .setFooter({ text: 'React with 👍 if you\'re attending!' })
    .setTimestamp();

  const message = await interaction.reply({ embeds: [embed], fetchReply: true });
  await message.react('👍');
}
