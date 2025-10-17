import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync, existsSync } from 'fs';
import { ExtendedClient, BotCommand } from '../types/index.js';

// Load environment variables - check for .env.local first, then .env
const envPath = existsSync('.env.local') ? '.env.local' : '.env';
config({ path: envPath });
console.log(`📝 Loaded environment from: ${envPath}`);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
}) as ExtendedClient;

client.commands = new Collection();

// Load commands
async function loadCommands() {
  const commandsPath = join(__dirname, 'commands');
  const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

  for (const file of commandFiles) {
    try {
      const filePath = join(commandsPath, file);
      const command = await import(filePath);
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Loaded command: ${command.data.name}`);
      } else {
        console.log(`⚠️  Command ${file} missing required "data" or "execute" property`);
      }
    } catch (error) {
      console.error(`❌ Error loading command ${file}:`, error);
    }
  }
}

// Load events
async function loadEvents() {
  const eventsPath = join(__dirname, 'events');
  const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

  for (const file of eventFiles) {
    try {
      const filePath = join(eventsPath, file);
      const event = await import(filePath);
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
      console.log(`✅ Loaded event: ${event.name}`);
    } catch (error) {
      console.error(`❌ Error loading event ${file}:`, error);
    }
  }
}

// Register slash commands
async function registerCommands() {
  const commands = Array.from(client.commands.values()).map(cmd => cmd.data.toJSON());
  
  const rest = new REST().setToken(process.env.DISCORD_TOKEN!);
  
  try {
    console.log(`🔄 Started refreshing ${commands.length} application (/) commands.`);
    
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
      { body: commands },
    );
    
    console.log(`✅ Successfully reloaded application (/) commands.`);
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
}

// Start bot
async function start() {
  console.log('🌿 Starting Cannabis Community Bot...\n');
  
  try {
    // Load everything
    await loadCommands();
    await loadEvents();
    await registerCommands();
    
    // Login
    await client.login(process.env.DISCORD_TOKEN);
    
    console.log('\n🚀 Bot is online and ready!');
  } catch (error) {
    console.error('❌ Fatal error starting bot:', error);
    process.exit(1);
  }
}

// Error handlers
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

// Start the bot
start();
