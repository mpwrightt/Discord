#!/usr/bin/env tsx

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';
import * as dotenv from 'dotenv';

dotenv.config();

const CONVEX_URL = process.env.CONVEX_URL;
if (!CONVEX_URL) {
  console.error('❌ CONVEX_URL not found');
  process.exit(1);
}

const convex = new ConvexHttpClient(CONVEX_URL);

async function listStrains() {
  console.log('🌿 Fetching all strains from database...\n');

  try {
    const strains = await convex.query(api.strains.getAllStrains);
    const stats = await convex.query(api.strains.getStrainStats);

    console.log('='.repeat(80));
    console.log('ALL STRAINS IN DATABASE');
    console.log('='.repeat(80) + '\n');

    // Group by rarity
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    
    for (const rarity of rarities) {
      const rarityStrains = strains.filter(s => s.rarity === rarity);
      if (rarityStrains.length === 0) continue;

      const rarityEmoji = {
        common: '🟢',
        uncommon: '🔵',
        rare: '🟣',
        epic: '🟡',
        legendary: '🔴'
      }[rarity];

      console.log(`${rarityEmoji} ${rarity.toUpperCase()} (${rarityStrains.length} strains)`);
      console.log('-'.repeat(80));

      for (const strain of rarityStrains) {
        const typeIcon = {
          indica: '🌙',
          sativa: '☀️',
          hybrid: '⚖️'
        }[strain.type];

        console.log(`  ${typeIcon} ${strain.name}`);
        console.log(`     Type: ${strain.type} | Difficulty: ${strain.difficulty}`);
        console.log(`     Grow Time: ${strain.growTime} days | Yield: ${strain.minYield}-${strain.maxYield}g`);
        console.log(`     THC: ${strain.thc} | CBD: ${strain.cbd}`);
        console.log(`     Unlock Level: ${strain.unlockLevel}`);
        console.log(`     ${strain.description}`);
        console.log('');
      }
      console.log('');
    }

    console.log('='.repeat(80));
    console.log('STRAIN STATISTICS');
    console.log('='.repeat(80) + '\n');

    console.log(`Total Strains: ${stats.total}`);
    console.log('');

    console.log('By Type:');
    console.log(`  🌙 Indica: ${stats.byType.indica}`);
    console.log(`  ☀️ Sativa: ${stats.byType.sativa}`);
    console.log(`  ⚖️ Hybrid: ${stats.byType.hybrid}`);
    console.log('');

    console.log('By Rarity:');
    console.log(`  🟢 Common: ${stats.byRarity.common}`);
    console.log(`  🔵 Uncommon: ${stats.byRarity.uncommon}`);
    console.log(`  🟣 Rare: ${stats.byRarity.rare}`);
    console.log(`  🟡 Epic: ${stats.byRarity.epic}`);
    console.log(`  🔴 Legendary: ${stats.byRarity.legendary}`);
    console.log('');

    console.log('By Difficulty:');
    console.log(`  Easy: ${stats.byDifficulty.easy}`);
    console.log(`  Medium: ${stats.byDifficulty.medium}`);
    console.log(`  Hard: ${stats.byDifficulty.hard}`);
    console.log(`  Expert: ${stats.byDifficulty.expert}`);
    console.log('');

    console.log(`Average Grow Time: ${stats.avgGrowTime.toFixed(1)} days`);
    console.log('');

    console.log('='.repeat(80) + '\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listStrains().then(() => process.exit(0));
