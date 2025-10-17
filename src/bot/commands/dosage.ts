import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { COLORS } from '../../lib/utils.js';

export const data = new SlashCommandBuilder()
  .setName('dosage')
  .setDescription('Get safe dosing recommendations')
  .addStringOption(option =>
    option
      .setName('experience')
      .setDescription('Your experience level')
      .setRequired(true)
      .addChoices(
        { name: '🆕 First Time', value: 'first' },
        { name: '🌱 Beginner (1-10 times)', value: 'beginner' },
        { name: '🌿 Moderate (Regular user)', value: 'moderate' },
        { name: '🔥 Experienced (Daily user)', value: 'experienced' }
      )
  )
  .addStringOption(option =>
    option
      .setName('method')
      .setDescription('Consumption method')
      .setRequired(true)
      .addChoices(
        { name: '💨 Smoking/Vaping', value: 'smoke' },
        { name: '🍪 Edibles', value: 'edible' },
        { name: '💧 Tinctures', value: 'tincture' },
        { name: '🌿 Concentrates/Dabs', value: 'concentrate' }
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const experience = interaction.options.getString('experience', true);
  const method = interaction.options.getString('method', true);

  const dosageGuide: Record<string, Record<string, { dose: string; effects: string; duration: string }>> = {
    'first': {
      'smoke': { dose: '1-2 small puffs (2-5mg THC)', effects: 'Mild relaxation, slight euphoria', duration: '1-3 hours' },
      'edible': { dose: '2.5-5mg THC', effects: 'Gentle body relaxation', duration: '4-6 hours' },
      'tincture': { dose: '2.5-5mg THC (2-3 drops)', effects: 'Mild calming effect', duration: '2-4 hours' },
      'concentrate': { dose: '⚠️ NOT RECOMMENDED - Too strong for first time', effects: 'Overwhelming', duration: 'N/A' },
    },
    'beginner': {
      'smoke': { dose: '2-4 puffs (5-10mg THC)', effects: 'Noticeable relaxation, euphoria', duration: '2-4 hours' },
      'edible': { dose: '5-10mg THC', effects: 'Strong body high, relaxation', duration: '4-8 hours' },
      'tincture': { dose: '5-10mg THC (4-6 drops)', effects: 'Moderate calming, pain relief', duration: '3-5 hours' },
      'concentrate': { dose: 'Small dab (10-20mg THC)', effects: 'Strong, fast-acting high', duration: '2-4 hours' },
    },
    'moderate': {
      'smoke': { dose: '0.25-0.5g (15-30mg THC)', effects: 'Strong effects, full experience', duration: '3-5 hours' },
      'edible': { dose: '10-20mg THC', effects: 'Powerful body and mind effects', duration: '6-8 hours' },
      'tincture': { dose: '10-20mg THC (8-12 drops)', effects: 'Strong therapeutic effects', duration: '4-6 hours' },
      'concentrate': { dose: 'Regular dab (20-40mg THC)', effects: 'Very strong, immediate effects', duration: '3-5 hours' },
    },
    'experienced': {
      'smoke': { dose: '0.5-1g (30-60mg+ THC)', effects: 'Maximum effects, high tolerance', duration: '4-6 hours' },
      'edible': { dose: '20-50mg+ THC', effects: 'Very strong, long-lasting', duration: '8-12 hours' },
      'tincture': { dose: '20-40mg THC (12-20 drops)', effects: 'Strong medical benefits', duration: '5-8 hours' },
      'concentrate': { dose: 'Large dab (40-80mg+ THC)', effects: 'Extremely potent', duration: '4-6 hours' },
    },
  };

  const guide = dosageGuide[experience][method];

  const embed = new EmbedBuilder()
    .setTitle('💊 Safe Dosage Guide')
    .setColor(COLORS.CANNABIS)
    .setDescription(
      `**Experience Level:** ${experience.charAt(0).toUpperCase() + experience.slice(1)}\n` +
      `**Method:** ${method.charAt(0).toUpperCase() + method.slice(1)}`
    )
    .addFields(
      { name: '📊 Recommended Dose', value: guide.dose, inline: false },
      { name: '✨ Expected Effects', value: guide.effects, inline: false },
      { name: '⏱️ Duration', value: guide.duration, inline: false },
      { 
        name: '⚠️ Safety Tips', 
        value: 
          method === 'edible' 
            ? '• Start low and go slow\n• Wait 2 hours before taking more\n• Effects take 30-90 minutes to start\n• Have food and water ready'
            : method === 'smoke'
            ? '• Wait 10-15 minutes between puffs\n• Stay hydrated\n• Have snacks ready\n• Don\'t mix with alcohol'
            : method === 'concentrate'
            ? '• Use proper dab equipment\n• Start with rice grain size\n• Be in a safe environment\n• Have a sober friend nearby'
            : '• Start with low dose\n• Wait 30-60 minutes\n• Hold under tongue for better absorption\n• Don\'t drive or operate machinery',
        inline: false 
      }
    )
    .setFooter({ text: '⚠️ For educational purposes only • Consult healthcare provider for medical use' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
