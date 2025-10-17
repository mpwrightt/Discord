import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api.js';
import { COLORS } from '../../lib/utils.js';
import { createSuccessEmbed, createErrorEmbed } from '../../lib/utils.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const data = new SlashCommandBuilder()
  .setName('birthday')
  .setDescription('Manage birthdays and get birthday reminders')
  .addSubcommand(subcommand =>
    subcommand
      .setName('set')
      .setDescription('Set your birthday')
      .addIntegerOption(option =>
        option
          .setName('month')
          .setDescription('Birth month (1-12)')
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(12)
      )
      .addIntegerOption(option =>
        option
          .setName('day')
          .setDescription('Birth day (1-31)')
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(31)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('view')
      .setDescription('View your birthday')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('upcoming')
      .setDescription('See upcoming birthdays in the next 7 days')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('month')
      .setDescription('See all birthdays this month')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('claim')
      .setDescription('Claim your birthday bonus (500 Buds!)')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('remove')
      .setDescription('Remove your birthday from the system')
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const subcommand = interaction.options.getSubcommand();

  try {
    // Ensure user exists
    await convex.mutation(api.users.getOrCreateUser, {
      discordId: interaction.user.id,
      username: interaction.user.username,
    });

    if (subcommand === 'set') {
      const month = interaction.options.getInteger('month', true);
      const day = interaction.options.getInteger('day', true);

      await convex.mutation(api.birthdays.setBirthday, {
        discordId: interaction.user.id,
        month: month,
        day: day,
      });

      const embed = createSuccessEmbed(
        `🎂 **Birthday Set!**\n\n` +
        `Your birthday: **${MONTH_NAMES[month - 1]} ${day}**\n\n` +
        `💰 You'll get **500 Buds** on your birthday!\n` +
        `🎉 The server will celebrate with you!\n\n` +
        `Use \`/birthday claim\` on your birthday to get your bonus!`
      );

      await interaction.editReply({ embeds: [embed] });

    } else if (subcommand === 'view') {
      const birthday = await convex.query(api.birthdays.getBirthday, {
        discordId: interaction.user.id,
      });

      if (!birthday) {
        await interaction.editReply({
          embeds: [createErrorEmbed('You haven\'t set your birthday yet! Use `/birthday set`')]
        });
        return;
      }

      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentDay = today.getDate();
      
      const isBirthdayToday = birthday.month === currentMonth && birthday.day === currentDay;

      // Calculate days until birthday
      let daysUntil = 0;
      if (!isBirthdayToday) {
        const thisYear = today.getFullYear();
        let birthdayDate = new Date(thisYear, birthday.month - 1, birthday.day);
        
        if (birthdayDate < today) {
          birthdayDate = new Date(thisYear + 1, birthday.month - 1, birthday.day);
        }
        
        daysUntil = Math.ceil((birthdayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      }

      const embed = new EmbedBuilder()
        .setTitle(isBirthdayToday ? '🎉 HAPPY BIRTHDAY! 🎉' : '🎂 Your Birthday')
        .setColor(isBirthdayToday ? '#FFD700' : COLORS.CANNABIS)
        .setDescription(
          `**${MONTH_NAMES[birthday.month - 1]} ${birthday.day}**\n\n` +
          (isBirthdayToday 
            ? `🎊 **IT'S YOUR BIRTHDAY TODAY!**\n\n` +
              `Use \`/birthday claim\` to get your **500 Buds** bonus!`
            : `⏰ **${daysUntil} days** until your birthday!\n\n` +
              `You'll get **500 Buds** on your special day!`)
        )
        .setFooter({ text: 'Use /birthday remove to delete your birthday' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } else if (subcommand === 'upcoming') {
      const upcoming = await convex.query(api.birthdays.getUpcomingBirthdays);

      if (upcoming.length === 0) {
        await interaction.editReply({
          embeds: [createErrorEmbed('No birthdays in the next 7 days!')]
        });
        return;
      }

      const today = new Date();
      const currentDay = today.getDate();
      const currentMonth = today.getMonth() + 1;

      let listText = '';
      for (const bday of upcoming) {
        const daysUntil = bday.month === currentMonth 
          ? bday.day! - currentDay
          : (new Date(today.getFullYear(), currentMonth, 0).getDate() - currentDay) + bday.day!;

        const dayText = daysUntil === 0 ? '🎉 **TODAY!**' : 
                       daysUntil === 1 ? '🎂 **Tomorrow**' :
                       `⏰ In ${daysUntil} days`;

        listText += `${dayText} - **${bday.username}** (${MONTH_NAMES[bday.month! - 1]} ${bday.day})\n`;
      }

      const embed = new EmbedBuilder()
        .setTitle('🎂 Upcoming Birthdays')
        .setColor(COLORS.CANNABIS)
        .setDescription(
          `**Next 7 days:**\n\n${listText}\n` +
          `💡 Set yours with \`/birthday set\`!`
        )
        .setFooter({ text: `${upcoming.length} birthday${upcoming.length > 1 ? 's' : ''} coming up!` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } else if (subcommand === 'month') {
      const birthdays = await convex.query(api.birthdays.getBirthdaysThisMonth);

      if (birthdays.length === 0) {
        const currentMonth = MONTH_NAMES[new Date().getMonth()];
        await interaction.editReply({
          embeds: [createErrorEmbed(`No birthdays set for ${currentMonth}!`)]
        });
        return;
      }

      const currentMonth = MONTH_NAMES[new Date().getMonth()];
      const currentDay = new Date().getDate();

      let listText = '';
      for (const bday of birthdays) {
        const isToday = bday.day === currentDay;
        const isPast = bday.day! < currentDay;
        
        const prefix = isToday ? '🎉' : isPast ? '✅' : '📅';
        listText += `${prefix} **${bday.username}** - ${currentMonth} ${bday.day}\n`;
      }

      const embed = new EmbedBuilder()
        .setTitle(`🎂 ${currentMonth} Birthdays`)
        .setColor(COLORS.CANNABIS)
        .setDescription(
          `**Birthdays this month:**\n\n${listText}\n` +
          `🎉 = Today | ✅ = Past | 📅 = Upcoming`
        )
        .setFooter({ text: `${birthdays.length} birthday${birthdays.length > 1 ? 's' : ''} in ${currentMonth}` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } else if (subcommand === 'claim') {
      const result = await convex.mutation(api.birthdays.claimBirthdayBonus, {
        discordId: interaction.user.id,
      });

      const embed = createSuccessEmbed(
        `🎉 **HAPPY BIRTHDAY!** 🎉\n\n` +
        `🎁 You received **${result.bonus} Buds**!\n\n` +
        `🎊 Have an amazing day!\n` +
        `🌿 The whole community celebrates with you!\n\n` +
        `_From all of us at the cannabis community_ 💚`
      );

      await interaction.editReply({ embeds: [embed] });

      // Try to add a fun reaction
      try {
        await interaction.followUp('🎂🎉🎁🎊🥳');
      } catch (e) {
        // Ignore if fails
      }

    } else if (subcommand === 'remove') {
      await convex.mutation(api.birthdays.setBirthday, {
        discordId: interaction.user.id,
        month: 0,
        day: 0,
      });

      const embed = createSuccessEmbed(
        `✅ **Birthday Removed**\n\n` +
        `Your birthday has been removed from the system.\n\n` +
        `You can set it again anytime with \`/birthday set\`!`
      );

      await interaction.editReply({ embeds: [embed] });
    }

  } catch (error: any) {
    console.error('Birthday error:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed(error.message || 'Failed to process birthday command')]
    });
  }
}
