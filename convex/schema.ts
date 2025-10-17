import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // User profiles and stats
  users: defineTable({
    discordId: v.string(),
    username: v.string(),
    buds: v.number(),
    level: v.number(),
    xp: v.number(),
    gramsStashed: v.number(),
    totalGramsGrown: v.number(),
    totalGramsSold: v.number(),
    totalBudsEarned: v.number(),
    dailyStreak: v.number(),
    lastDaily: v.optional(v.number()),
    lastWeekly: v.optional(v.number()),
    imageGenerationsToday: v.number(),
    imageGenerationsDate: v.string(),
    equipmentOwned: v.array(v.string()),
    consumables: v.optional(v.object({})), // Dynamic object for consumable items like { 'growth-booster': 5 }
    birthdayMonth: v.optional(v.number()),
    birthdayDay: v.optional(v.number()),
    lastBirthdayClaim: v.optional(v.number()),
    createdAt: v.number(),
  }).index('by_discord_id', ['discordId']),

  // Growing plants
  grows: defineTable({
    userId: v.string(),
    plantId: v.string(),
    strainName: v.string(),
    strainRarity: v.string(),
    growTime: v.number(),
    startDate: v.number(),
    daysGrown: v.number(),
    lastWatered: v.number(),
    health: v.number(),
    boosted: v.object({
      nutrients: v.boolean(),
      light: v.boolean(),
      love: v.number(),
    }),
    events: v.array(v.string()),
    isHarvested: v.boolean(),
    yieldAmount: v.optional(v.number()),
  }).index('by_user', ['userId'])
    .index('by_active', ['isHarvested']),

  // Grower stats
  growerStats: defineTable({
    userId: v.string(),
    level: v.number(),
    totalHarvests: v.number(),
    bestYield: v.number(),
    strainsGrown: v.array(v.string()),
  }).index('by_user', ['userId']),

  // Market data
  marketPrice: defineTable({
    currentPrice: v.number(),
    lastUpdated: v.number(),
  }),

  // Strains database
  strains: defineTable({
    name: v.string(),
    type: v.string(), // indica, sativa, hybrid
    rarity: v.string(), // common, uncommon, rare, epic, legendary
    growTime: v.number(), // days
    minYield: v.number(), // grams
    maxYield: v.number(), // grams
    difficulty: v.string(), // easy, medium, hard
    thc: v.string(), // e.g., "18-22%"
    cbd: v.string(), // e.g., "<1%"
    unlockLevel: v.number(),
    description: v.string(),
  }).index('by_name', ['name'])
    .index('by_rarity', ['rarity'])
    .index('by_unlock_level', ['unlockLevel']),

  // Conversations (for AI chat memory)
  conversations: defineTable({
    userId: v.string(),
    channelId: v.string(),
    personality: v.string(),
    messages: v.array(v.object({
      role: v.string(),
      content: v.string(),
      timestamp: v.number(),
    })),
    lastActive: v.number(),
  }).index('by_user_channel', ['userId', 'channelId']),

  // Generated images gallery
  images: defineTable({
    userId: v.string(),
    prompt: v.string(),
    imageUrl: v.string(),
    upvotes: v.number(),
    createdAt: v.number(),
  }).index('by_user', ['userId'])
    .index('by_date', ['createdAt']),

  // Achievements
  achievements: defineTable({
    userId: v.string(),
    achievementId: v.string(),
    unlockedAt: v.number(),
  }).index('by_user', ['userId']),

  // Game stats
  gameStats: defineTable({
    userId: v.string(),
    gameType: v.string(),
    wins: v.number(),
    losses: v.number(),
    points: v.number(),
    highScore: v.number(),
  }).index('by_user', ['userId'])
    .index('by_game', ['gameType']),

  // Moderation flags
  moderationFlags: defineTable({
    messageId: v.string(),
    userId: v.string(),
    channelId: v.string(),
    flaggedAt: v.number(),
    flagType: v.string(),
    confidence: v.string(),
    aiReasoning: v.string(),
    aiRecommendedAction: v.string(),
    messageContent: v.string(),
    status: v.string(),
    reviewedBy: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    actionTaken: v.optional(v.string()),
    modNotes: v.optional(v.string()),
  }).index('by_status', ['status'])
    .index('by_user', ['userId']),

  // Moderation actions
  moderationActions: defineTable({
    userId: v.string(),
    moderatorId: v.string(),
    actionType: v.string(),
    reason: v.string(),
    duration: v.optional(v.number()),
    timestamp: v.number(),
    relatedFlagId: v.optional(v.string()),
  }).index('by_user', ['userId']),

  // Shop purchases/inventory
  inventory: defineTable({
    userId: v.string(),
    itemId: v.string(),
    itemName: v.string(),
    purchaseDate: v.number(),
  }).index('by_user', ['userId']),
});
