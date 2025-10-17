#!/usr/bin/env tsx

/**
 * Manual Command Registration Script
 * Forces Discord to sync all slash commands
 */

import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  console.error('❌ Missing DISCORD_TOKEN or DISCORD_CLIENT_ID in .env');
  process.exit(1);
}

async function registerCommands() {
  console.log('🔄 Loading commands...\n');

  const commands = [];
  const commandsPath = join(__dirname, '../src/bot/commands');
  const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

  for (const file of commandFiles) {
    try {
      const filePath = join(commandsPath, file);
      const command = await import(filePath);
      
      if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        console.log(`  ✅ ${command.data.name}`);
      } else {
        console.log(`  ⚠️  ${file} - missing data or execute`);
      }
    } catch (error: any) {
      console.error(`  ❌ ${file} - ${error.message}`);
    }
  }

  console.log(`\n📊 Total commands loaded: ${commands.length}\n`);

  // Register with Discord
  const rest = new REST().setToken(DISCORD_TOKEN);

  try {
    console.log('🚀 Registering commands with Discord...\n');

    const data = await rest.put(
      Routes.applicationCommands(DISCORD_CLIENT_ID),
      { body: commands },
    ) as any[];

    console.log(`✅ Successfully registered ${data.length} commands!\n`);
    
    console.log('📋 Registered commands:');
    data.forEach((cmd: any, i: number) => {
      console.log(`  ${i + 1}. /${cmd.name} - ${cmd.description}`);
    });

    console.log('\n🎉 Done! Commands should appear in Discord within 1-2 minutes.');
    console.log('💡 Tip: If commands don\'t appear, try kicking and re-inviting the bot.\n');

  } catch (error: any) {
    console.error('❌ Error registering commands:', error);
    if (error.rawError?.message) {
      console.error('   Message:', error.rawError.message);
    }
    process.exit(1);
  }
}

registerCommands();
