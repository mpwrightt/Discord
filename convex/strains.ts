import { query } from './_generated/server';
import { v } from 'convex/values';

// Get all strains
export const getAllStrains = query({
  handler: async (ctx) => {
    const strains = await ctx.db.query('strains').collect();
    return strains.sort((a, b) => a.unlockLevel - b.unlockLevel);
  },
});

// Get strains by rarity
export const getStrainsByRarity = query({
  args: { rarity: v.string() },
  handler: async (ctx, args) => {
    const strains = await ctx.db
      .query('strains')
      .withIndex('by_rarity', (q) => q.eq('rarity', args.rarity))
      .collect();
    return strains;
  },
});

// Get strain by name
export const getStrainByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const strain = await ctx.db
      .query('strains')
      .withIndex('by_name', (q) => q.eq('name', args.name))
      .first();
    return strain;
  },
});

// Get available strains for user level
export const getAvailableStrains = query({
  args: { userLevel: v.number() },
  handler: async (ctx, args) => {
    const allStrains = await ctx.db.query('strains').collect();
    return allStrains.filter(s => s.unlockLevel <= args.userLevel);
  },
});

// Count strains by type
export const getStrainStats = query({
  handler: async (ctx) => {
    const strains = await ctx.db.query('strains').collect();
    
    const byType = {
      indica: strains.filter(s => s.type === 'indica').length,
      sativa: strains.filter(s => s.type === 'sativa').length,
      hybrid: strains.filter(s => s.type === 'hybrid').length,
    };
    
    const byRarity = {
      common: strains.filter(s => s.rarity === 'common').length,
      uncommon: strains.filter(s => s.rarity === 'uncommon').length,
      rare: strains.filter(s => s.rarity === 'rare').length,
      epic: strains.filter(s => s.rarity === 'epic').length,
      legendary: strains.filter(s => s.rarity === 'legendary').length,
    };
    
    const byDifficulty = {
      easy: strains.filter(s => s.difficulty === 'easy').length,
      medium: strains.filter(s => s.difficulty === 'medium').length,
      hard: strains.filter(s => s.difficulty === 'hard').length,
      expert: strains.filter(s => s.difficulty === 'expert').length,
    };
    
    return {
      total: strains.length,
      byType,
      byRarity,
      byDifficulty,
      avgGrowTime: strains.reduce((sum, s) => sum + s.growTime, 0) / strains.length,
    };
  },
});
