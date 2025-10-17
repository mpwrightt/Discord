import { EmbedBuilder, ColorResolvable } from 'discord.js';

export const COLORS = {
  SUCCESS: '#2ecc71' as ColorResolvable,
  ERROR: '#e74c3c' as ColorResolvable,
  INFO: '#3498db' as ColorResolvable,
  WARNING: '#f39c12' as ColorResolvable,
  CANNABIS: '#6fbd44' as ColorResolvable,
  PURPLE: '#9b59b6' as ColorResolvable
};

export function createEmbed(
  title: string,
  description: string,
  color: ColorResolvable = COLORS.CANNABIS
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp();
}

export function createErrorEmbed(error: string): EmbedBuilder {
  return createEmbed('❌ Error', error, COLORS.ERROR);
}

export function createSuccessEmbed(message: string): EmbedBuilder {
  return createEmbed('✅ Success', message, COLORS.SUCCESS);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function getProgressBar(current: number, max: number, length = 10): string {
  const filled = Math.round((current / max) * length);
  const empty = length - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

export function getGrowthStageEmoji(daysGrown: number, totalDays: number): string {
  const progress = daysGrown / totalDays;
  if (progress < 0.3) return '🌱'; // Seedling
  if (progress < 0.6) return '🌿'; // Vegetative
  if (progress < 1.0) return '🌸'; // Flowering
  return '🎉'; // Ready!
}

export function getHealthColor(health: number): ColorResolvable {
  if (health >= 80) return COLORS.SUCCESS;
  if (health >= 50) return COLORS.WARNING;
  return COLORS.ERROR;
}

export function getHealthEmoji(health: number): string {
  if (health >= 90) return '💚';
  if (health >= 70) return '💛';
  if (health >= 40) return '🧡';
  return '❤️';
}

export function getRarityColor(rarity: string): ColorResolvable {
  const colors: Record<string, ColorResolvable> = {
    common: '#95a5a6',
    uncommon: '#27ae60',
    rare: '#3498db',
    exotic: '#9b59b6',
    legendary: '#f39c12'
  };
  return colors[rarity] || COLORS.INFO;
}

export function getRarityEmoji(rarity: string): string {
  const emojis: Record<string, string> = {
    common: '⚪',
    uncommon: '🟢',
    rare: '🔵',
    exotic: '🟣',
    legendary: '🟡'
  };
  return emojis[rarity] || '⚪';
}

export function calculateXP(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function getLevelFromXP(xp: number): number {
  let level = 1;
  let totalXP = 0;
  while (totalXP <= xp) {
    totalXP += calculateXP(level);
    level++;
  }
  return level - 1;
}

export function msToTime(ms: number): string {
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
