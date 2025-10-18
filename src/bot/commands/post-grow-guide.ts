import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('post-grow-guide')
  .setDescription('Post the grow simulation guide (Moderator+)')
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const embed = new EmbedBuilder()
      .setTitle('🌿 Cannabis Grow Simulation Guide')
      .setColor('#43B581')
      .setDescription(
        '**Welcome to the grow simulation!** Plant, nurture, and harvest cannabis plants to earn Buds (currency).\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .addFields(
        {
          name: '🌱 Getting Started',
          value: 
            '**`/grow-plant <strain>`** - Start growing a plant\n' +
            '• Choose from available strains\n' +
            '• Each plant takes time to grow\n' +
            '• Costs Buds to plant (you start with some!)\n',
          inline: false
        },
        {
          name: '💧 Plant Care',
          value:
            '**`/grow-water`** - Water your plants\n' +
            '• Water regularly to keep plants healthy\n' +
            '• Missing waterings affects plant health\n' +
            '• Healthy plants = better harvests!\n',
          inline: false
        },
        {
          name: '🌾 Harvesting',
          value:
            '**`/grow-harvest`** - Harvest mature plants\n' +
            '• Wait for plants to fully mature\n' +
            '• Harvest to earn Buds\n' +
            '• Plant health affects yield\n',
          inline: false
        },
        {
          name: '📊 Tracking Progress',
          value:
            '**`/grow-status`** - Check your plants\n' +
            '**`/balance`** - View your Buds\n' +
            '**`/inventory`** - See your harvests\n' +
            '**`/stats`** - View your grow stats\n',
          inline: false
        },
        {
          name: '🎮 Other Commands',
          value:
            '**`/strains`** - View available strains\n' +
            '**`/profile`** - View your profile\n' +
            '**`/gift <user> <amount>`** - Send Buds to others\n',
          inline: false
        },
        {
          name: '💡 Tips',
          value:
            '• Water your plants daily for best results\n' +
            '• Different strains have different characteristics\n' +
            '• Check `/grow-status` regularly\n' +
            '• Use your Buds wisely - plant more or play games!\n',
          inline: false
        }
      )
      .setFooter({ text: '🌿 Happy Growing! Check back daily to water your plants.' })
      .setTimestamp();

    // Send to channel
    if (interaction.channel && 'send' in interaction.channel) {
      await interaction.channel.send({ embeds: [embed] });
      await interaction.editReply({ content: '✅ Grow guide posted!' });
    } else {
      await interaction.editReply({ content: '❌ Cannot post in this channel type.' });
    }
  } catch (error: any) {
    console.error('Post grow guide error:', error);
    await interaction.editReply({
      content: `❌ Failed to post guide: ${error.message}`,
    });
  }
}
