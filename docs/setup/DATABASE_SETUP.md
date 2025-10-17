# 🗄️ Database Setup & Initialization Guide

## 📋 Overview

Your Discord bot uses **Convex** as its serverless database. Before using the bot, you need to initialize the database with essential seed data.

---

## 🚀 Quick Start

### Option 1: Command Line (Recommended)

```bash
# Initialize database with seed data
npm run db:init

# Check database statistics
npm run db:stats
```

### Option 2: Discord Command (After bot is running)

```
/admin-db init      # Initialize database
/admin-db status    # Check initialization status
/admin-db stats     # View detailed statistics
```

---

## 📊 What Gets Seeded

When you run the initialization, the following data is created:

### 1. **Market Price** 💰
- Initial price: **3.0 Buds per gram**
- Required for the `/sell` command to work
- Price fluctuates naturally over time

### 2. **Strains Database** 🌿
- **20 cannabis strains** are available (hardcoded in TypeScript)
- Organized by rarity: Common, Uncommon, Rare, Epic, Legendary
- Each strain has unique growth times, yields, and characteristics

**Strains include:**
- Common: Northern Lights, Early Skunk, White Widow, AK-47
- Uncommon: Blue Dream, Gorilla Glue, Sour Diesel, Girl Scout Cookies
- Rare: Gelato, Wedding Cake, Purple Punch, Jack Herer
- Epic: Zkittlez, Forbidden Fruit, Runtz, Ice Cream Cake
- Legendary: Godfather OG, Ghost Train Haze, Bruce Banner, Death Star

---

## 🔍 Database Status Check

### Using CLI
```bash
npm run db:stats
```

**Example output:**
```
==================================================
DATABASE STATISTICS
==================================================

👥 USERS
  Total Users: 15
  Total Buds: 45,230 💰
  Total Grams Stashed: 1,234g 🌿
  Total Grams Grown: 5,678g

🏆 TOP USERS (by Buds)
  1. CannabisKing - 12,500 Buds
  2. GrowMaster - 8,900 Buds
  3. BudEnthusiast - 7,100 Buds

🌱 PLANTS
  Total Plants: 42
  Active: 28
  Harvested: 14

💼 ECONOMY
  Inventory Items: 23
  Images Generated: 8
  Achievements Unlocked: 45

💰 MARKET
  Current Price: 3.2 Buds/gram
  Last Updated: 10/16/2024, 11:30:15 PM
```

### Using Discord
```
/admin-db status    # Quick status check
/admin-db stats     # Detailed statistics
```

---

## 🔄 Database Schema

The bot uses **13 tables** in Convex:

| Table | Purpose | Auto-Created? |
|-------|---------|---------------|
| `users` | User profiles, Buds, XP, stats | ✅ On first use |
| `grows` | Active plants and grow progress | ✅ When planting |
| `growerStats` | Grower achievements and records | ✅ On first harvest |
| `marketPrice` | Current selling price | ⚠️ **Needs seeding** |
| `inventory` | Purchased items | ✅ When buying |
| `conversations` | AI chat history | ✅ On first chat |
| `images` | Generated image gallery | ✅ When generating |
| `achievements` | Unlocked achievements | ✅ When earned |
| `gameStats` | Game wins/losses/scores | ✅ When playing |
| `moderationFlags` | AI moderation flags | ✅ If triggered |
| `moderationActions` | Mod actions log | ✅ If triggered |

**Note:** Only `marketPrice` needs manual initialization. All others are created automatically when users interact with the bot.

---

## 🛠️ Advanced Operations

### Reset Database (DANGER!)

⚠️ **WARNING:** This deletes ALL user data!

```typescript
// Only available via Convex dashboard or internal mutation
// Use with extreme caution in production!
await convex.mutation(api.seed.resetDatabase);
```

**What gets deleted:**
- All users
- All plants
- All inventory
- All stats
- All game progress
- Market price resets to 3.0

**What survives:**
- Strain definitions (hardcoded)
- Command definitions
- Bot settings

---

## 📝 Manual Database Access

### Via Convex Dashboard

1. Go to your Convex dashboard: https://dashboard.convex.dev
2. Select your project
3. Navigate to "Data" tab
4. View/edit tables directly

### Via Code

```typescript
import { ConvexHttpClient } from 'convex/browser';
import { api } from './convex/_generated/api.js';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

// Query example
const users = await convex.query(api.users.getAllUsers);

// Mutation example
await convex.mutation(api.users.updateBuds, {
  discordId: '123456789',
  amount: 100
});
```

---

## 🐛 Troubleshooting

### "Market price not initialized"
**Solution:** Run `npm run db:init` or `/admin-db init`

### "CONVEX_URL not found"
**Solution:** Make sure `.env` file exists with `CONVEX_URL=your-convex-url`

### "Cannot connect to database"
**Solution:** 
1. Check if Convex dev server is running: `npm run convex:dev`
2. Verify CONVEX_URL is correct
3. Check internet connection

### "Database reset needed"
**Reason:** Schema changed or data corrupted
**Solution:** Use reset function (contact admin for production)

---

## 📚 Related Files

- **Seed Script:** `scripts/init-database.ts`
- **Seed Functions:** `convex/seed.ts`
- **Admin Command:** `src/bot/commands/admin-db.ts`
- **Schema:** `convex/schema.ts`
- **Strains Data:** `src/lib/strains.ts`

---

## ✅ Initialization Checklist

Before launching your bot:

- [ ] Convex project created
- [ ] `.env` file has `CONVEX_URL`
- [ ] Run `npm run db:init`
- [ ] Verify with `npm run db:stats`
- [ ] Market price shows 3.0 Buds/gram
- [ ] Start bot with `npm run dev`
- [ ] Test `/grow-start` command
- [ ] Test `/sell` command (after harvest)

---

## 🎉 Success!

Once initialized, users can:
- Start growing plants
- Earn and spend Buds
- Buy upgrades and roles
- Play games
- Generate images
- Track progress on leaderboards

All data persists across bot restarts! 🚀
