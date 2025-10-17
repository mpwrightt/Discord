import { Events, ActivityType } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';

export const name = Events.ClientReady;
export const once = true;

export async function execute(client: ExtendedClient) {
  console.log(`\n✅ Logged in as ${client.user?.tag}`);
  console.log(`📊 Serving ${client.guilds.cache.size} servers`);
  console.log(`👥 With ${client.users.cache.size} users\n`);

  // Set bot status
  client.user?.setActivity('🌿 /help for commands', { type: ActivityType.Playing });
}
