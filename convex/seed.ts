import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Strains data - imported from the hardcoded strains file
const STRAINS_DATA = [
  // COMMON STRAINS
  { name: 'Northern Lights', type: 'indica', rarity: 'common', growTime: 5, minYield: 40, maxYield: 60, difficulty: 'easy', thc: '16-20%', cbd: '<1%', unlockLevel: 1, description: 'Classic indica, easy to grow, perfect for beginners' },
  { name: 'Early Skunk', type: 'hybrid', rarity: 'common', growTime: 5, minYield: 35, maxYield: 55, difficulty: 'easy', thc: '14-18%', cbd: '<1%', unlockLevel: 1, description: 'Fast-growing hybrid, very forgiving' },
  { name: 'White Widow', type: 'hybrid', rarity: 'common', growTime: 7, minYield: 50, maxYield: 70, difficulty: 'easy', thc: '18-22%', cbd: '<1%', unlockLevel: 1, description: 'Legendary hybrid, reliable and potent' },
  { name: 'AK-47', type: 'sativa', rarity: 'common', growTime: 7, minYield: 45, maxYield: 65, difficulty: 'easy', thc: '16-20%', cbd: '<1%', unlockLevel: 1, description: 'Energizing sativa, stable genetics' },
  // UNCOMMON STRAINS
  { name: 'Blue Dream', type: 'hybrid', rarity: 'uncommon', growTime: 8, minYield: 60, maxYield: 85, difficulty: 'medium', thc: '19-24%', cbd: '<1%', unlockLevel: 3, description: 'Popular hybrid, balanced effects' },
  { name: 'Gorilla Glue', type: 'hybrid', rarity: 'uncommon', growTime: 8, minYield: 55, maxYield: 80, difficulty: 'medium', thc: '20-25%', cbd: '<1%', unlockLevel: 3, description: 'Heavy yields, sticky resinous buds' },
  { name: 'Sour Diesel', type: 'sativa', rarity: 'uncommon', growTime: 9, minYield: 50, maxYield: 75, difficulty: 'medium', thc: '18-23%', cbd: '<1%', unlockLevel: 3, description: 'Fuel aroma, energizing effects' },
  { name: 'Girl Scout Cookies', type: 'hybrid', rarity: 'uncommon', growTime: 9, minYield: 55, maxYield: 80, difficulty: 'medium', thc: '20-26%', cbd: '<1%', unlockLevel: 3, description: 'Sweet flavor, strong effects' },
  // RARE STRAINS
  { name: 'Gelato', type: 'hybrid', rarity: 'rare', growTime: 10, minYield: 70, maxYield: 100, difficulty: 'medium', thc: '21-26%', cbd: '<1%', unlockLevel: 5, description: 'Dessert strain, premium quality' },
  { name: 'Wedding Cake', type: 'hybrid', rarity: 'rare', growTime: 10, minYield: 65, maxYield: 95, difficulty: 'medium', thc: '22-27%', cbd: '<1%', unlockLevel: 5, description: 'Tangy vanilla flavor, relaxing' },
  { name: 'Purple Punch', type: 'indica', rarity: 'rare', growTime: 11, minYield: 70, maxYield: 100, difficulty: 'hard', thc: '20-25%', cbd: '<1%', unlockLevel: 5, description: 'Grape candy flavor, knockout potency' },
  { name: 'Jack Herer', type: 'sativa', rarity: 'rare', growTime: 11, minYield: 65, maxYield: 95, difficulty: 'hard', thc: '19-24%', cbd: '<1%', unlockLevel: 5, description: 'Named after the activist, uplifting' },
  // EPIC STRAINS
  { name: 'Zkittlez', type: 'indica', rarity: 'epic', growTime: 12, minYield: 80, maxYield: 120, difficulty: 'hard', thc: '22-28%', cbd: '<1%', unlockLevel: 8, description: 'Fruit salad terps, beautiful colors' },
  { name: 'Forbidden Fruit', type: 'indica', rarity: 'epic', growTime: 12, minYield: 75, maxYield: 115, difficulty: 'hard', thc: '21-27%', cbd: '<1%', unlockLevel: 8, description: 'Tropical mystery, deeply relaxing' },
  { name: 'Runtz', type: 'hybrid', rarity: 'epic', growTime: 13, minYield: 85, maxYield: 125, difficulty: 'hard', thc: '23-29%', cbd: '<1%', unlockLevel: 8, description: 'Candy-like, extremely popular' },
  { name: 'Ice Cream Cake', type: 'indica', rarity: 'epic', growTime: 13, minYield: 80, maxYield: 120, difficulty: 'hard', thc: '22-28%', cbd: '<1%', unlockLevel: 8, description: 'Creamy vanilla, frosty buds' },
  // LEGENDARY STRAINS
  { name: 'Godfather OG', type: 'indica', rarity: 'legendary', growTime: 14, minYield: 100, maxYield: 150, difficulty: 'expert', thc: '25-32%', cbd: '<1%', unlockLevel: 10, description: 'Most potent strain, ultimate indica' },
  { name: 'Ghost Train Haze', type: 'sativa', rarity: 'legendary', growTime: 14, minYield: 95, maxYield: 145, difficulty: 'expert', thc: '24-30%', cbd: '<1%', unlockLevel: 10, description: 'Extremely potent sativa, energizing' },
  { name: 'Bruce Banner', type: 'hybrid', rarity: 'legendary', growTime: 15, minYield: 100, maxYield: 150, difficulty: 'expert', thc: '25-30%', cbd: '<1%', unlockLevel: 10, description: 'Incredible strength, balanced hybrid' },
  { name: 'Death Star', type: 'indica', rarity: 'legendary', growTime: 15, minYield: 95, maxYield: 145, difficulty: 'expert', thc: '24-29%', cbd: '<1%', unlockLevel: 10, description: 'Powerful indica, massive yields' },
];

// Seed initial market price
export const seedMarketPrice = mutation({
  handler: async (ctx) => {
    // Check if market price already exists
    const existing = await ctx.db.query('marketPrice').first();
    
    if (!existing) {
      await ctx.db.insert('marketPrice', {
        currentPrice: 3.0, // Default: 3 Buds per gram
        lastUpdated: Date.now(),
      });
      console.log('✅ Market price initialized: 3.0 Buds/gram');
      return { success: true, message: 'Market price initialized' };
    }
    
    return { success: true, message: 'Market price already exists' };
  },
});

// Seed strains database
export const seedStrains = mutation({
  handler: async (ctx) => {
    // Check if strains already exist
    const existingStrains = await ctx.db.query('strains').collect();
    
    if (existingStrains.length > 0) {
      console.log(`✅ Strains already seeded (${existingStrains.length} strains)`);
      return { success: true, message: `${existingStrains.length} strains already exist`, count: existingStrains.length };
    }
    
    // Insert all strains
    let count = 0;
    for (const strain of STRAINS_DATA) {
      await ctx.db.insert('strains', strain);
      count++;
    }
    
    console.log(`✅ ${count} strains seeded successfully`);
    return { success: true, message: `${count} strains seeded`, count };
  },
});

// Check database status
export const checkDatabaseStatus = query({
  handler: async (ctx) => {
    const marketPrice = await ctx.db.query('marketPrice').first();
    const strains = await ctx.db.query('strains').collect();
    const userCount = (await ctx.db.query('users').collect()).length;
    const plantCount = (await ctx.db.query('grows').collect()).length;
    const inventoryCount = (await ctx.db.query('inventory').collect()).length;
    
    return {
      marketPrice: marketPrice?.currentPrice || null,
      strainCount: strains.length,
      userCount,
      plantCount,
      inventoryCount,
      isInitialized: !!marketPrice && strains.length > 0,
    };
  },
});

// Reset everything (DANGER: Use with caution!)
export const resetDatabase = mutation({
  handler: async (ctx) => {
    // Delete all users
    const users = await ctx.db.query('users').collect();
    for (const user of users) {
      await ctx.db.delete(user._id);
    }
    
    // Delete all plants
    const plants = await ctx.db.query('grows').collect();
    for (const plant of plants) {
      await ctx.db.delete(plant._id);
    }
    
    // Delete all inventory
    const inventory = await ctx.db.query('inventory').collect();
    for (const item of inventory) {
      await ctx.db.delete(item._id);
    }
    
    // Delete all stats
    const stats = await ctx.db.query('growerStats').collect();
    for (const stat of stats) {
      await ctx.db.delete(stat._id);
    }
    
    // Delete all game stats
    const gameStats = await ctx.db.query('gameStats').collect();
    for (const stat of gameStats) {
      await ctx.db.delete(stat._id);
    }
    
    // Reset market price
    const marketPrice = await ctx.db.query('marketPrice').first();
    if (marketPrice) {
      await ctx.db.patch(marketPrice._id, {
        currentPrice: 3.0,
        lastUpdated: Date.now(),
      });
    } else {
      await ctx.db.insert('marketPrice', {
        currentPrice: 3.0,
        lastUpdated: Date.now(),
      });
    }
    
    return { 
      success: true, 
      message: 'Database reset complete',
      deletedUsers: users.length,
      deletedPlants: plants.length,
      deletedInventory: inventory.length,
    };
  },
});

// Initialize all required data
export const initializeDatabase = mutation({
  handler: async (ctx) => {
    const results = {
      marketPrice: false,
      strains: 0,
    };
    
    // 1. Initialize market price
    const existingPrice = await ctx.db.query('marketPrice').first();
    if (!existingPrice) {
      await ctx.db.insert('marketPrice', {
        currentPrice: 3.0,
        lastUpdated: Date.now(),
      });
      results.marketPrice = true;
      console.log('✅ Market price initialized');
    }
    
    // 2. Seed strains
    const existingStrains = await ctx.db.query('strains').collect();
    if (existingStrains.length === 0) {
      for (const strain of STRAINS_DATA) {
        await ctx.db.insert('strains', strain);
      }
      results.strains = STRAINS_DATA.length;
      console.log(`✅ ${STRAINS_DATA.length} strains seeded`);
    }
    
    return {
      success: true,
      message: 'Database initialized',
      created: results,
    };
  },
});

// Get database statistics
export const getDatabaseStats = query({
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    const plants = await ctx.db.query('grows').collect();
    const activePlants = plants.filter(p => !p.isHarvested);
    const inventory = await ctx.db.query('inventory').collect();
    const images = await ctx.db.query('images').collect();
    const achievements = await ctx.db.query('achievements').collect();
    const gameStats = await ctx.db.query('gameStats').collect();
    const marketPrice = await ctx.db.query('marketPrice').first();
    const strains = await ctx.db.query('strains').collect();
    
    // Strain breakdown by rarity
    const strainsByRarity = {
      common: strains.filter(s => s.rarity === 'common').length,
      uncommon: strains.filter(s => s.rarity === 'uncommon').length,
      rare: strains.filter(s => s.rarity === 'rare').length,
      epic: strains.filter(s => s.rarity === 'epic').length,
      legendary: strains.filter(s => s.rarity === 'legendary').length,
    };
    
    // Calculate totals
    const totalBuds = users.reduce((sum, u) => sum + u.buds, 0);
    const totalGrams = users.reduce((sum, u) => sum + u.gramsStashed, 0);
    const totalGramsGrown = users.reduce((sum, u) => sum + u.totalGramsGrown, 0);
    
    // Top users
    const topByBuds = [...users]
      .sort((a, b) => b.buds - a.buds)
      .slice(0, 5)
      .map(u => ({ username: u.username, buds: u.buds }));
    
    const topByLevel = [...users]
      .sort((a, b) => b.level - a.level)
      .slice(0, 5)
      .map(u => ({ username: u.username, level: u.level }));
    
    return {
      users: {
        total: users.length,
        totalBuds,
        totalGrams,
        totalGramsGrown,
        topByBuds,
        topByLevel,
      },
      plants: {
        total: plants.length,
        active: activePlants.length,
        harvested: plants.length - activePlants.length,
      },
      strains: {
        total: strains.length,
        byRarity: strainsByRarity,
      },
      inventory: {
        totalItems: inventory.length,
      },
      images: {
        total: images.length,
      },
      achievements: {
        total: achievements.length,
      },
      gameStats: {
        total: gameStats.length,
      },
      market: {
        currentPrice: marketPrice?.currentPrice || 0,
        lastUpdated: marketPrice?.lastUpdated || 0,
      },
    };
  },
});
