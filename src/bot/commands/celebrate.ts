import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { COLORS } from '../../lib/utils.js';
import { createSuccessEmbed, createErrorEmbed } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

export const data = new SlashCommandBuilder()
  .setName('celebrate')
  .setDescription('Celebrate someone\'s special day!')
  .addUserOption(option =>
    option
      .setName('user')
      .setDescription('User to celebrate')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('message')
      .setDescription('Your celebration message')
      .setRequired(false)
      .setMaxLength(200)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const targetUser = interaction.options.getUser('user', true);
  const message = interaction.options.getString('message') || 'Wishing you an amazing day!';

  // Check if it's their birthday
  const isBirthday = await convex.query(api.birthdays.isTodayBirthday, {
    discordId: targetUser.id,
  });

  const embed = new EmbedBuilder()
    .setTitle(`🎉 Celebration for ${targetUser.username}!`)
    .setColor('#FFD700')
    .setDescription(
      `${interaction.user.username} is celebrating with you!\n\n` +
      `💬 *"${message}"*\n\n` +
      (isBirthday 
        ? `🎂 **HAPPY BIRTHDAY!** 🎂\n🎊 Have the most wonderful day! 🎊`
        : `🎉 Sending good vibes your way! 🌿`)
    )
    .setThumbnail(targetUser.displayAvatarURL())
    .setFooter({ text: `Celebrated by ${interaction.user.username}` })
    .setTimestamp();

  await interaction.reply({ content: `<@${targetUser.id}>`, embeds: [embed] });
}
