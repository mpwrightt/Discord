import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Start a new grow
export const startGrow = mutation({
  args: {
    userId: v.string(),
    strainName: v.string(),
    strainRarity: v.string(),
    growTime: v.number(),
    seedCost: v.number(),
  },
  handler: async (ctx, args) => {
    // Check user has enough Buds
    const user = await ctx.db
      .query('users')
      .withIndex('by_discord_id', (q) => q.eq('discordId', args.userId))
      .first();

    if (!user) throw new Error('User not found');
    if (user.buds < args.seedCost) throw new Error('Insufficient Buds');

    // Count active plants
    const activePlants = await ctx.db
      .query('grows')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('isHarvested'), false))
      .collect();

    // Base: 2 plants, +1 for extra-slot
    const maxPlants = user.equipmentOwned.includes('extra-slot') ? 3 : 2;

    if (activePlants.length >= maxPlants) {
      throw new Error(`You can only grow ${maxPlants} plants at once!`);
    }

    // Deduct seed cost
    await ctx.db.patch(user._id, { buds: user.buds - args.seedCost });

    // Create plant
    const plantId = await ctx.db.insert('grows', {
      userId: args.userId,
      plantId: `plant-${Date.now()}`,
      strainName: args.strainName,
      strainRarity: args.strainRarity,
      growTime: args.growTime,
      startDate: Date.now(),
      daysGrown: 0,
      lastWatered: Date.now(),
      health: 100,
      boosted: {
        nutrients: false,
        light: false,
        love: 0,
      },
      events: [],
      isHarvested: false,
    });

    return await ctx.db.get(plantId);
  },
});

// Get user's active plants
export const getActivePlants = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('grows')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('isHarvested'), false))
      .collect();
  },
});

// Get all user plants (active and harvested)
export const getUserPlants = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('grows')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();
  },
});

// Water plant
export const waterPlant = mutation({
  args: { plantId: v.id('grows') },
  handler: async (ctx, args) => {
    const plant = await ctx.db.get(args.plantId);
    if (!plant) throw new Error('Plant not found');

    const now = Date.now();
    const hoursSinceWater = (now - plant.lastWatered) / (1000 * 60 * 60);

    if (hoursSinceWater < 20) {
      throw new Error('Plant was recently watered! Wait a bit.');
    }

    // Update health based on time
    let newHealth = plant.health;
    if (hoursSinceWater > 48) {
      newHealth = Math.max(0, plant.health - 30); // Missed 2 days
    } else if (hoursSinceWater > 30) {
      newHealth = Math.max(0, plant.health - 15); // Missed 1+ day
    } else {
      newHealth = Math.min(100, plant.health + 5); // Good watering!
    }

    await ctx.db.patch(args.plantId, {
      lastWatered: now,
      health: newHealth,
    });

    return { health: newHealth, wasLate: hoursSinceWater > 30 };
  },
});

// Feed nutrients
export const feedPlant = mutation({
  args: {
    plantId: v.id('grows'),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const plant = await ctx.db.get(args.plantId);
    if (!plant) throw new Error('Plant not found');
    if (plant.boosted.nutrients) throw new Error('Already used nutrients!');

    // Deduct cost
    const user = await ctx.db
      .query('users')
      .withIndex('by_discord_id', (q) => q.eq('discordId', args.userId))
      .first();

    if (!user) throw new Error('User not found');
    if (user.buds < 15) throw new Error('Need 15 Buds for nutrients');

    await ctx.db.patch(user._id, { buds: user.buds - 15 });
    await ctx.db.patch(args.plantId, {
      boosted: { ...plant.boosted, nutrients: true },
    });

    return { success: true };
  },
});

// Harvest plant
export const harvestPlant = mutation({
  args: {
    plantId: v.id('grows'),
    yieldAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const plant = await ctx.db.get(args.plantId);
    if (!plant) throw new Error('Plant not found');
    if (plant.isHarvested) throw new Error('Already harvested');

    const user = await ctx.db
      .query('users')
      .withIndex('by_discord_id', (q) => q.eq('discordId', plant.userId))
      .first();

    if (!user) throw new Error('User not found');

    // Update plant
    await ctx.db.patch(args.plantId, {
      isHarvested: true,
      yieldAmount: args.yieldAmount,
    });

    // Update user stats
    await ctx.db.patch(user._id, {
      gramsStashed: user.gramsStashed + args.yieldAmount,
      totalGramsGrown: user.totalGramsGrown + args.yieldAmount,
    });

    // Update grower stats
    const growerStats = await ctx.db
      .query('growerStats')
      .withIndex('by_user', (q) => q.eq('userId', plant.userId))
      .first();

    if (growerStats) {
      await ctx.db.patch(growerStats._id, {
        totalHarvests: growerStats.totalHarvests + 1,
        bestYield: Math.max(growerStats.bestYield, args.yieldAmount),
        strainsGrown: [...new Set([...growerStats.strainsGrown, plant.strainName])],
      });
    } else {
      await ctx.db.insert('growerStats', {
        userId: plant.userId,
        level: 1,
        totalHarvests: 1,
        bestYield: args.yieldAmount,
        strainsGrown: [plant.strainName],
      });
    }

    return { yieldAmount: args.yieldAmount };
  },
});

// Sell harvest
export const sellHarvest = mutation({
  args: {
    userId: v.string(),
    grams: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_discord_id', (q) => q.eq('discordId', args.userId))
      .first();

    if (!user) throw new Error('User not found');
    if (user.gramsStashed < args.grams) throw new Error('Not enough grams stashed');

    // Get market price
    const market = await ctx.db.query('marketPrice').first();
    const price = market?.currentPrice || 3.0;

    const budsEarned = Math.floor(args.grams * price);

    await ctx.db.patch(user._id, {
      gramsStashed: user.gramsStashed - args.grams,
      totalGramsSold: user.totalGramsSold + args.grams,
      buds: user.buds + budsEarned,
      totalBudsEarned: user.totalBudsEarned + budsEarned,
    });

    return { budsEarned, price };
  },
});

// Get market price
export const getMarketPrice = query({
  handler: async (ctx) => {
    const market = await ctx.db.query('marketPrice').first();
    if (!market) {
      return 3.0; // Default price if not initialized
    }
    return market.currentPrice;
  },
});

// Initialize market (run once)
export const initializeMarket = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query('marketPrice').first();
    if (!existing) {
      await ctx.db.insert('marketPrice', {
        currentPrice: 3.0,
        lastUpdated: Date.now(),
      });
    }
  },
});

// Apply speed boost to a plant (reduce grow time by moving startDate back)
export const applySpeedBoost = mutation({
  args: {
    plantId: v.id('grows'),
    daysToReduce: v.number(),
  },
  handler: async (ctx, args) => {
    const plant = await ctx.db.get(args.plantId);
    
    if (!plant) throw new Error('Plant not found');
    if (plant.isHarvested) throw new Error('Plant already harvested');

    // Reduce time by moving startDate back by the specified days
    const millisecondsToReduce = args.daysToReduce * 24 * 60 * 60 * 1000;
    const newStartDate = plant.startDate - millisecondsToReduce;

    await ctx.db.patch(args.plantId, {
      startDate: newStartDate,
    });

    return { success: true, newStartDate };
  },
});
