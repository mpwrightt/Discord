import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Get or create user
export const getOrCreateUser = mutation({
  args: {
    discordId: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existing = await ctx.db
      .query('users')
      .withIndex('by_discord_id', (q) => q.eq('discordId', args.discordId))
      .first();

    if (existing) {
      return existing;
    }

    // Create new user with starting values
    const userId = await ctx.db.insert('users', {
      discordId: args.discordId,
      username: args.username,
      buds: 100, // Starting Buds
      level: 1,
      xp: 0,
      gramsStashed: 0,
      totalGramsGrown: 0,
      totalGramsSold: 0,
      totalBudsEarned: 0,
      dailyStreak: 0,
      imageGenerationsToday: 0,
      imageGenerationsDate: new Date().toISOString().split('T')[0],
      equipmentOwned: [],
      createdAt: Date.now(),
    });

    return await ctx.db.get(userId);
  },
});

// Get user by Discord ID
export const getUserByDiscordId = query({
  args: { discordId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_discord_id', (q) => q.eq('discordId', args.discordId))
      .first();
  },
});

// Update user buds
export const updateBuds = mutation({
  args: {
    discordId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_discord_id', (q) => q.eq('discordId', args.discordId))
      .first();

    if (!user) throw new Error('User not found');

    const newBuds = user.buds + args.amount;
    if (newBuds < 0) throw new Error('Insufficient Buds');

    await ctx.db.patch(user._id, { buds: newBuds });
    return newBuds;
  },
});

// Update user XP and level
export const addXP = mutation({
  args: {
    discordId: v.string(),
    xp: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_discord_id', (q) => q.eq('discordId', args.discordId))
      .first();

    if (!user) throw new Error('User not found');

    const newXP = user.xp + args.xp;
    const newLevel = Math.floor(Math.pow(newXP / 100, 1 / 1.5)) + 1;

    await ctx.db.patch(user._id, {
      xp: newXP,
      level: newLevel,
    });

    return { newXP, newLevel, leveledUp: newLevel > user.level };
  },
});

// Claim daily bonus
export const claimDaily = mutation({
  args: { discordId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_discord_id', (q) => q.eq('discordId', args.discordId))
      .first();

    if (!user) throw new Error('User not found');

    const now = Date.now();
    const lastDaily = user.lastDaily || 0;
    const hoursSince = (now - lastDaily) / (1000 * 60 * 60);

    if (hoursSince < 20) {
      const hoursLeft = Math.ceil(20 - hoursSince);
      throw new Error(`Already claimed! Try again in ${hoursLeft} hours`);
    }

    // Check if streak continues (claimed within 48 hours)
    const streak = hoursSince < 48 ? user.dailyStreak + 1 : 1;
    const bonus = 50 + Math.min(streak * 5, 50); // Up to 100 Buds with streak

    await ctx.db.patch(user._id, {
      buds: user.buds + bonus,
      dailyStreak: streak,
      lastDaily: now,
      totalBudsEarned: user.totalBudsEarned + bonus,
    });

    return { bonus, streak };
  },
});

// Claim weekly bonus
export const claimWeekly = mutation({
  args: { discordId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_discord_id', (q) => q.eq('discordId', args.discordId))
      .first();

    if (!user) throw new Error('User not found');

    const now = Date.now();
    const lastWeekly = user.lastWeekly || 0;
    const hoursSince = (now - lastWeekly) / (1000 * 60 * 60);

    if (hoursSince < 168) { // 7 days
      const hoursLeft = Math.ceil(168 - hoursSince);
      const daysLeft = Math.ceil(hoursLeft / 24);
      throw new Error(`Already claimed! Try again in ${daysLeft} days`);
    }

    const bonus = 250;

    await ctx.db.patch(user._id, {
      buds: user.buds + bonus,
      lastWeekly: now,
      totalBudsEarned: user.totalBudsEarned + bonus,
    });

    return { bonus };
  },
});

// Add item to user's inventory
export const addItemToInventory = mutation({
  args: {
    discordId: v.string(),
    itemId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_discord_id', (q) => q.eq('discordId', args.discordId))
      .first();

    if (!user) throw new Error('User not found');

    // Check if already owned
    if (user.equipmentOwned.includes(args.itemId)) {
      throw new Error('Item already owned');
    }

    // Add item to inventory
    await ctx.db.patch(user._id, {
      equipmentOwned: [...user.equipmentOwned, args.itemId],
    });

    return { success: true };
  },
});

// Add consumable to user inventory
export const addConsumable = mutation({
  args: {
    discordId: v.string(),
    itemId: v.string(),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_discord_id', (q) => q.eq('discordId', args.discordId))
      .first();

    if (!user) throw new Error('User not found');

    const consumables = user.consumables || {};
    const currentQuantity = (consumables as any)[args.itemId] || 0;
    const newConsumables = {
      ...consumables,
      [args.itemId]: currentQuantity + args.quantity,
    };

    await ctx.db.patch(user._id, { consumables: newConsumables });

    return newConsumables;
  },
});

// Use/consume a consumable item
export const useConsumable = mutation({
  args: {
    discordId: v.string(),
    itemId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_discord_id', (q) => q.eq('discordId', args.discordId))
      .first();

    if (!user) throw new Error('User not found');

    const consumables = user.consumables || {};
    const currentQuantity = (consumables as any)[args.itemId] || 0;

    if (currentQuantity <= 0) {
      throw new Error(`You don't have any ${args.itemId}!`);
    }

    const newConsumables = {
      ...consumables,
      [args.itemId]: currentQuantity - 1,
    };

    await ctx.db.patch(user._id, { consumables: newConsumables });

    return { remaining: currentQuantity - 1 };
  },
});

// Get leaderboard
export const getLeaderboard = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    if (args.type === 'buds') {
      return await ctx.db.query('users').order('desc').take(10);
    } else if (args.type === 'level') {
      return await ctx.db.query('users').order('desc').take(10);
    }
    return [];
  },
});
