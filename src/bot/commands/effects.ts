import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { STRAINS } from '../../lib/strains.js';
import { COLORS, getRarityEmoji } from '../../lib/utils.js';

export const data = new SlashCommandBuilder()
  .setName('effects')
  .setDescription('Get strain recommendations based on desired effects')
  .addStringOption(option =>
    option
      .setName('mood')
      .setDescription('What effect are you looking for?')
      .setRequired(true)
      .addChoices(
        { name: '😴 Relaxation & Sleep', value: 'relaxation' },
        { name: '⚡ Energy & Focus', value: 'energy' },
        { name: '🎨 Creativity', value: 'creativity' },
        { name: '😊 Euphoria & Happiness', value: 'euphoria' },
        { name: '🧘 Stress Relief', value: 'stress' },
        { name: '💪 Pain Relief', value: 'pain' }
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const mood = interaction.options.getString('mood', true);

  // Recommendation logic
  const recommendations: Record<string, { type: string[]; strains: string[]; description: string }> = {
    'relaxation': {
      type: ['indica'],
      strains: ['Northern Lights', 'Granddaddy Purple', 'Purple Kush', 'Blueberry'],
      description: 'Indica strains are perfect for relaxation and sleep. They provide a calming body high.'
    },
    'energy': {
      type: ['sativa'],
      strains: ['Sour Diesel', 'Durban Poison', 'Jack Herer', 'Green Crack'],
      description: 'Sativa strains provide uplifting energy and mental clarity, great for daytime use.'
    },
    'creativity': {
      type: ['sativa', 'hybrid'],
      strains: ['Jack Herer', 'Blue Dream', 'Sour Diesel', 'Pineapple Express'],
      description: 'These strains enhance creativity and provide cerebral stimulation.'
    },
    'euphoria': {
      type: ['sativa', 'hybrid'],
      strains: ['Wedding Cake', 'Blue Dream', 'Pineapple Express', 'Girl Scout Cookies'],
      description: 'Known for producing strong feelings of happiness and euphoria.'
    },
    'stress': {
      type: ['indica', 'hybrid'],
      strains: ['OG Kush', 'Blue Dream', 'Granddaddy Purple', 'Blueberry'],
      description: 'These strains help melt away stress and promote relaxation.'
    },
    'pain': {
      type: ['indica', 'hybrid'],
      strains: ['Northern Lights', 'OG Kush', 'Granddaddy Purple', 'White Widow'],
      description: 'High THC indica strains are commonly used for pain management.'
    }
  };

  const rec = recommendations[mood];
  
  // Find matching strains from our database
  const matchingStrains = STRAINS.filter(s => 
    rec.strains.some(name => s.name.toLowerCase().includes(name.toLowerCase())) ||
    rec.type.includes(s.type)
  ).slice(0, 5);

  let strainsText = '';
  for (const strain of matchingStrains) {
    strainsText += `${getRarityEmoji(strain.rarity)} **${strain.name}** - ${strain.type} (${strain.thc} THC)\n`;
  }

  const moodTitles: Record<string, string> = {
    'relaxation': '😴 Best for Relaxation',
    'energy': '⚡ Best for Energy',
    'creativity': '🎨 Best for Creativity',
    'euphoria': '😊 Best for Euphoria',
    'stress': '🧘 Best for Stress Relief',
    'pain': '💪 Best for Pain Relief',
  };

  const embed = new EmbedBuilder()
    .setTitle(moodTitles[mood])
    .setColor(COLORS.CANNABIS)
    .setDescription(rec.description)
    .addFields(
      { name: '🌿 Recommended Strains', value: strainsText || 'No strains available yet', inline: false },
      { name: '💡 Tips', value: 
        mood === 'relaxation' ? 'Use in the evening or before bed. Start with a low dose.' :
        mood === 'energy' ? 'Perfect for daytime use. Great with activities and socializing.' :
        mood === 'creativity' ? 'Try during creative projects, music, or art sessions.' :
        mood === 'euphoria' ? 'Best for social gatherings and celebrations.' :
        mood === 'stress' ? 'Create a calm environment. Use with meditation or yoga.' :
        'Consult with a healthcare professional for medical use.',
        inline: false
      }
    )
    .setFooter({ text: 'Use /strain <name> to learn more about a specific strain!' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
