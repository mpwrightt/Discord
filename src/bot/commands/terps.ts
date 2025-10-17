import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { COLORS } from '../../lib/utils.js';

const TERPENES: Record<string, { name: string; aroma: string; effects: string; strains: string; medical: string }> = {
  'myrcene': {
    name: 'Myrcene',
    aroma: '🌿 Earthy, musky, herbal (like cloves)',
    effects: 'Sedating, relaxing, muscle relaxant',
    strains: 'Blue Dream, OG Kush, Granddaddy Purple',
    medical: 'Pain relief, insomnia, muscle tension'
  },
  'limonene': {
    name: 'Limonene',
    aroma: '🍋 Citrus, lemon, orange',
    effects: 'Uplifting, mood-enhancing, stress relief',
    strains: 'Sour Diesel, Wedding Cake, Durban Poison',
    medical: 'Anxiety, depression, stress'
  },
  'pinene': {
    name: 'Pinene',
    aroma: '🌲 Pine, forest, fresh',
    effects: 'Alertness, memory retention, bronchodilator',
    strains: 'Jack Herer, Blue Dream, Dutch Treat',
    medical: 'Asthma, pain, inflammation, memory'
  },
  'linalool': {
    name: 'Linalool',
    aroma: '💜 Floral, lavender, spicy',
    effects: 'Calming, sedating, anti-anxiety',
    strains: 'Amnesia Haze, Lavender, LA Confidential',
    medical: 'Anxiety, depression, insomnia, seizures'
  },
  'caryophyllene': {
    name: 'Caryophyllene',
    aroma: '🌶️ Spicy, peppery, woody',
    effects: 'Anti-inflammatory, pain relief, neuroprotective',
    strains: 'Girl Scout Cookies, Sour Diesel, Bubba Kush',
    medical: 'Chronic pain, inflammation, anxiety'
  },
  'humulene': {
    name: 'Humulene',
    aroma: '🌳 Earthy, woody, hoppy',
    effects: 'Appetite suppressant, anti-inflammatory',
    strains: 'White Widow, Headband, Sour Diesel',
    medical: 'Weight loss, pain, inflammation'
  },
  'terpinolene': {
    name: 'Terpinolene',
    aroma: '🌸 Floral, herbal, piney',
    effects: 'Uplifting, sedating (complex), antioxidant',
    strains: 'Jack Herer, XJ-13, Dutch Treat',
    medical: 'Insomnia, anxiety, bacterial infections'
  },
};

export const data = new SlashCommandBuilder()
  .setName('terps')
  .setDescription('Learn about cannabis terpenes and their effects')
  .addStringOption(option =>
    option
      .setName('terpene')
      .setDescription('Select a terpene to learn about')
      .setRequired(true)
      .addChoices(
        { name: '🌿 Myrcene (Most common)', value: 'myrcene' },
        { name: '🍋 Limonene (Citrus)', value: 'limonene' },
        { name: '🌲 Pinene (Pine)', value: 'pinene' },
        { name: '💜 Linalool (Lavender)', value: 'linalool' },
        { name: '🌶️ Caryophyllene (Spicy)', value: 'caryophyllene' },
        { name: '🌳 Humulene (Earthy)', value: 'humulene' },
        { name: '🌸 Terpinolene (Floral)', value: 'terpinolene' }
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const terpeneKey = interaction.options.getString('terpene', true);
  const terp = TERPENES[terpeneKey];

  const embed = new EmbedBuilder()
    .setTitle(`🧪 ${terp.name}`)
    .setColor(COLORS.CANNABIS)
    .setDescription('**What are Terpenes?**\nTerpenes are aromatic compounds found in cannabis that give strains their unique scents and contribute to their effects. They work synergistically with cannabinoids in what\'s called the "entourage effect."')
    .addFields(
      { name: '👃 Aroma Profile', value: terp.aroma, inline: false },
      { name: '✨ Effects', value: terp.effects, inline: false },
      { name: '🌿 Found In', value: terp.strains, inline: false },
      { name: '🏥 Medical Benefits', value: terp.medical, inline: false },
      { 
        name: '💡 Did You Know?', 
        value: terpeneKey === 'myrcene' 
          ? 'Myrcene is believed to enhance THC\'s effects by allowing cannabinoids to cross the blood-brain barrier more easily!'
          : terpeneKey === 'limonene'
          ? 'Limonene is also found in citrus fruit peels and is used in cleaning products!'
          : terpeneKey === 'pinene'
          ? 'Pinene is the most common terpene in nature and is found in pine needles, rosemary, and basil!'
          : terpeneKey === 'linalool'
          ? 'Linalool is also found in lavender and has been used for centuries as a calming agent!'
          : terpeneKey === 'caryophyllene'
          ? 'Caryophyllene is unique because it can bind to CB2 receptors, making it act like a cannabinoid!'
          : terpeneKey === 'humulene'
          ? 'Humulene gives beer its hoppy aroma and is a natural appetite suppressant!'
          : 'Terpinolene is one of the least common terpenes but creates unique complex effects!',
        inline: false 
      }
    )
    .setFooter({ text: 'Use /strain <name> to see which terpenes are in specific strains!' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
