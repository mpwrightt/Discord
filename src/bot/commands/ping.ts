import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { createEmbed, COLORS } from '../../lib/utils.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Check bot latency');

export async function execute(interaction: ChatInputCommandInteraction) {
  const latency = Date.now() - interaction.createdTimestamp;
  const wsLatency = interaction.client.ws.ping;

  const embed = createEmbed(
    '🏓 Pong!',
    `**Latency:** ${latency}ms\n**WebSocket:** ${wsLatency}ms`,
    COLORS.INFO
  );

  await interaction.reply({ embeds: [embed] });
}
