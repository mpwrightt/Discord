import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { COLORS } from '../../lib/utils.js';

const LEGAL_DATA: Record<string, { status: string; medical: boolean; recreational: boolean; details: string }> = {
  'california': { status: '✅ Legal', medical: true, recreational: true, details: 'Adults 21+ can possess up to 1 oz. Home grow allowed (up to 6 plants).' },
  'colorado': { status: '✅ Legal', medical: true, recreational: true, details: 'Adults 21+ can possess up to 1 oz. Home grow allowed (up to 6 plants).' },
  'washington': { status: '✅ Legal', medical: true, recreational: true, details: 'Adults 21+ can possess up to 1 oz. No home grow for recreational.' },
  'oregon': { status: '✅ Legal', medical: true, recreational: true, details: 'Adults 21+ can possess up to 1 oz. Home grow allowed (up to 4 plants).' },
  'nevada': { status: '✅ Legal', medical: true, recreational: true, details: 'Adults 21+ can possess up to 1 oz. Home grow allowed if 25+ miles from dispensary.' },
  'massachusetts': { status: '✅ Legal', medical: true, recreational: true, details: 'Adults 21+ can possess up to 1 oz. Home grow allowed (up to 6 plants).' },
  'michigan': { status: '✅ Legal', medical: true, recreational: true, details: 'Adults 21+ can possess up to 2.5 oz. Home grow allowed (up to 12 plants).' },
  'illinois': { status: '✅ Legal', medical: true, recreational: true, details: 'Adults 21+ can possess up to 30g. Medical patients can home grow.' },
  'new york': { status: '✅ Legal', medical: true, recreational: true, details: 'Adults 21+ can possess up to 3 oz. Home grow allowed (up to 3 mature plants).' },
  'florida': { status: '🏥 Medical Only', medical: true, recreational: false, details: 'Medical cannabis legal. Recreational use prohibited.' },
  'texas': { status: '⚠️ CBD Only', medical: false, recreational: false, details: 'Very limited medical program. Recreational use illegal.' },
  'canada': { status: '✅ Legal Nationwide', medical: true, recreational: true, details: 'Adults 18-19+ can possess up to 30g. Home grow allowed (up to 4 plants).' },
};

export const data = new SlashCommandBuilder()
  .setName('legality')
  .setDescription('Check cannabis legal status by location')
  .addStringOption(option =>
    option
      .setName('location')
      .setDescription('State or country')
      .setRequired(true)
      .addChoices(
        { name: '🇺🇸 California', value: 'california' },
        { name: '🇺🇸 Colorado', value: 'colorado' },
        { name: '🇺🇸 Washington', value: 'washington' },
        { name: '🇺🇸 Oregon', value: 'oregon' },
        { name: '🇺🇸 Nevada', value: 'nevada' },
        { name: '🇺🇸 Massachusetts', value: 'massachusetts' },
        { name: '🇺🇸 Michigan', value: 'michigan' },
        { name: '🇺🇸 Illinois', value: 'illinois' },
        { name: '🇺🇸 New York', value: 'new york' },
        { name: '🇺🇸 Florida', value: 'florida' },
        { name: '🇺🇸 Texas', value: 'texas' },
        { name: '🇨🇦 Canada', value: 'canada' }
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const location = interaction.options.getString('location', true);
  const data = LEGAL_DATA[location];

  if (!data) {
    await interaction.reply({ 
      content: 'Location data not found!', 
      ephemeral: true 
    });
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle(`⚖️ Cannabis Legality - ${location.charAt(0).toUpperCase() + location.slice(1)}`)
    .setColor(data.recreational ? '#00FF00' : data.medical ? '#FFA500' : '#FF0000')
    .addFields(
      { name: '📋 Status', value: data.status, inline: false },
      { name: '🏥 Medical', value: data.medical ? '✅ Yes' : '❌ No', inline: true },
      { name: '🎉 Recreational', value: data.recreational ? '✅ Yes' : '❌ No', inline: true },
      { name: '📝 Details', value: data.details, inline: false },
      { name: '⚠️ Important', value: 'Laws change frequently. Always verify current local regulations before use or cultivation.', inline: false }
    )
    .setFooter({ text: 'Information current as of 2024 • Not legal advice' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
