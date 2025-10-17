#!/usr/bin/env tsx

/**
 * Database Initialization Script
 * Run this to seed initial data into Convex database
 * 
 * Usage: npm run db:init
 */

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config();

const CONVEX_URL = process.env.CONVEX_URL;

if (!CONVEX_URL) {
  console.error('❌ ERROR: CONVEX_URL not found in environment variables');
  console.error('Make sure you have a .env file with CONVEX_URL set');
  process.exit(1);
}

const convex = new ConvexHttpClient(CONVEX_URL);

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...\n');

  try {
    // Check current status
    console.log('📊 Checking current database status...');
    const status = await convex.query(api.seed.checkDatabaseStatus);
    
    console.log(`\nCurrent Status:`);
    console.log(`  • Market Price: ${status.marketPrice ? status.marketPrice + ' Buds/gram ✅' : 'Not set ❌'}`);
    console.log(`  • Strains: ${status.strainCount > 0 ? status.strainCount + ' strains ✅' : 'Not seeded ❌'}`);
    console.log(`  • Users: ${status.userCount}`);
    console.log(`  • Plants: ${status.plantCount}`);
    console.log(`  • Inventory Items: ${status.inventoryCount}`);
    console.log(`  • Initialized: ${status.isInitialized ? '✅' : '❌'}\n`);

    if (status.isInitialized) {
      console.log('✅ Database is already initialized!');
      console.log('💡 If you want to re-initialize, use the reset function\n');
      
      // Show stats
      console.log('📊 Getting detailed statistics...');
      const stats = await convex.query(api.seed.getDatabaseStats);
      
      console.log(`\nDetailed Statistics:`);
      console.log(`  Users: ${stats.users.total}`);
      console.log(`  Total Buds in circulation: ${stats.users.totalBuds.toLocaleString()}`);
      console.log(`  Total Grams grown: ${stats.users.totalGramsGrown.toLocaleString()}g`);
      console.log(`  Active Plants: ${stats.plants.active}`);
      console.log(`  Strains: ${stats.strains.total}`);
      console.log(`  Market Price: ${stats.market.currentPrice} Buds/gram\n`);
      
      return;
    }

    // Initialize
    console.log('🔧 Initializing database with seed data...');
    const result = await convex.mutation(api.seed.initializeDatabase);
    
    console.log('\n✅ Database initialization complete!\n');
    console.log('Seeded data:');
    console.log(`  • Market Price: ${result.created.marketPrice ? 'Created ✅' : 'Already existed'}`);
    console.log(`  • Strains: ${result.created.strains > 0 ? result.created.strains + ' strains created ✅' : 'Already existed'}`);
    
    // Show final status
    console.log('\n📊 Final status:');
    const finalStatus = await convex.query(api.seed.checkDatabaseStatus);
    console.log(`  • Market Price: ${finalStatus.marketPrice} Buds/gram ✅`);
    console.log(`  • Strains: ${finalStatus.strainCount} strains ✅`);
    console.log(`  • Initialized: ✅\n`);
    
    console.log('🎉 Your bot database is ready to use!');
    console.log('💡 You can now start your bot with: npm run dev\n');
    
  } catch (error: any) {
    console.error('\n❌ Error initializing database:', error.message);
    console.error(error);
    process.exit(1);
  }
}

async function showStats() {
  console.log('📊 Getting database statistics...\n');
  
  try {
    const stats = await convex.query(api.seed.getDatabaseStats);
    
    console.log('='.repeat(50));
    console.log('DATABASE STATISTICS');
    console.log('='.repeat(50) + '\n');
    
    console.log('👥 USERS');
    console.log(`  Total Users: ${stats.users.total}`);
    console.log(`  Total Buds: ${stats.users.totalBuds.toLocaleString()} 💰`);
    console.log(`  Total Grams Stashed: ${stats.users.totalGrams.toLocaleString()}g 🌿`);
    console.log(`  Total Grams Grown: ${stats.users.totalGramsGrown.toLocaleString()}g\n`);
    
    if (stats.users.topByBuds.length > 0) {
      console.log('🏆 TOP USERS (by Buds)');
      stats.users.topByBuds.forEach((user, i) => {
        console.log(`  ${i + 1}. ${user.username} - ${user.buds.toLocaleString()} Buds`);
      });
      console.log('');
    }
    
    console.log('🌱 PLANTS');
    console.log(`  Total Plants: ${stats.plants.total}`);
    console.log(`  Active: ${stats.plants.active}`);
    console.log(`  Harvested: ${stats.plants.harvested}\n`);
    
    console.log('🌿 STRAINS');
    console.log(`  Total Strains: ${stats.strains.total}`);
    console.log(`  Common: ${stats.strains.byRarity.common}`);
    console.log(`  Uncommon: ${stats.strains.byRarity.uncommon}`);
    console.log(`  Rare: ${stats.strains.byRarity.rare}`);
    console.log(`  Epic: ${stats.strains.byRarity.epic}`);
    console.log(`  Legendary: ${stats.strains.byRarity.legendary}\n`);
    
    console.log('💼 ECONOMY');
    console.log(`  Inventory Items: ${stats.inventory.totalItems}`);
    console.log(`  Images Generated: ${stats.images.total}`);
    console.log(`  Achievements Unlocked: ${stats.achievements.total}`);
    console.log(`  Game Stats: ${stats.gameStats.total}\n`);
    
    console.log('💰 MARKET');
    console.log(`  Current Price: ${stats.market.currentPrice} Buds/gram`);
    console.log(`  Last Updated: ${new Date(stats.market.lastUpdated).toLocaleString()}\n`);
    
    console.log('='.repeat(50) + '\n');
    
  } catch (error: any) {
    console.error('❌ Error getting stats:', error.message);
    process.exit(1);
  }
}

// Main
const command = process.argv[2];

(async () => {
  if (command === 'stats') {
    await showStats();
  } else {
    await initializeDatabase();
  }
  process.exit(0);
})();
