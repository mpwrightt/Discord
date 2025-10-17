#!/usr/bin/env tsx

import { REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  console.error('❌ Missing DISCORD_TOKEN or DISCORD_CLIENT_ID');
  process.exit(1);
}

async function listCommands() {
  const rest = new REST().setToken(DISCORD_TOKEN);

  try {
    console.log('🔍 Fetching commands from Discord...\n');

    const commands = await rest.get(
      Routes.applicationCommands(DISCORD_CLIENT_ID)
    ) as any[];

    console.log(`📊 Total commands registered: ${commands.length}\n`);
    
    // Group by category
    const imageCommands = commands.filter(c => 
      ['generate', 'strain-art', 'gallery', 'model-info'].includes(c.name)
    );
    
    const allCommands = commands.sort((a, b) => a.name.localeCompare(b.name));

    console.log('🎨 IMAGE GENERATION COMMANDS:');
    console.log('─'.repeat(50));
    imageCommands.forEach(cmd => {
      console.log(`  ✅ /${cmd.name}`);
      console.log(`     ${cmd.description}`);
      console.log('');
    });

    console.log('\n📋 ALL COMMANDS:');
    console.log('─'.repeat(50));
    allCommands.forEach((cmd, i) => {
      const icon = ['generate', 'strain-art', 'gallery', 'model-info'].includes(cmd.name) ? '🎨' : '  ';
      console.log(`${icon} ${i + 1}. /${cmd.name}`);
    });

    console.log('\n' + '='.repeat(50));
    console.log(`Total: ${commands.length} commands`);
    console.log('='.repeat(50) + '\n');

  } catch (error: any) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

listCommands();
