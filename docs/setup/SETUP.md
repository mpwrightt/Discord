# 🌿 Setup Guide - Cannabis Community Discord Bot

## Prerequisites

- **Node.js 18+** installed
- **pnpm** package manager (`npm install -g pnpm`)
- **Discord Bot Token** (from Discord Developer Portal)
- **OpenRouter API Key** (from openrouter.ai)
- **Google AI API Key** (from ai.google.dev)
- **Convex Account** (free at convex.dev)

---

## Step 1: Install Dependencies

```bash
cd "/Users/tek/Discord bot"
pnpm install
```

---

## Step 2: Set Up Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" → Give it a name
3. Go to "Bot" tab → Click "Add Bot"
4. **Enable these Intents:**
   - ✅ Presence Intent
   - ✅ Server Members Intent
   - ✅ Message Content Intent
5. Copy the **Bot Token** (keep it secret!)
6. Go to "OAuth2" → "URL Generator"
   - Select scopes: `bot` + `applications.commands`
   - Select permissions:
     - Send Messages
     - Embed Links
     - Attach Files
     - Read Message History
     - Use Slash Commands
     - Connect (for voice)
     - Speak (for voice)
7. Copy the generated URL and invite bot to your server

---

## Step 3: Get API Keys

### OpenRouter (AI Chat)
1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up / Log in
3. Go to "Keys" → Create new key
4. Copy the API key

### Google AI (Nano Banana - Image Generation)
1. Go to [ai.google.dev](https://ai.google.dev)
2. Sign in with Google account
3. Click "Get API Key"
4. Create a new project or use existing
5. Copy the API key

---

## Step 4: Set Up Convex Database

```bash
# Install Convex CLI globally
npm install -g convex

# Initialize Convex in project
npx convex dev
```

This will:
- Open browser to log in to Convex
- Create a new Convex project
- Generate deployment URL
- Start local dev server

**Keep this terminal window open!**

---

## Step 5: Configure Environment Variables

Create `.env` file in project root:

```bash
cp .env.example .env
```

Edit `.env` with your keys:

```env
# Discord
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id_here

# AI Services
OPENROUTER_API_KEY=sk-or-v1-xxxxx
GOOGLE_AI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXX

# Convex (automatically set by 'npx convex dev')
CONVEX_DEPLOYMENT=https://xxxx.convex.cloud
```

**To get Discord Client ID:**
1. Discord Developer Portal → Your Application
2. Copy "Application ID" from General Information

---

## Step 6: Run the Bot

In a **new terminal** (keep Convex dev running):

```bash
pnpm dev
```

You should see:
```
🌿 Starting Cannabis Community Bot...

✅ Loaded command: ping
✅ Loaded command: help
✅ Loaded command: chat
✅ Loaded command: balance
✅ Loaded command: grow-start
✅ Loaded command: grow-check
✅ Loaded event: ready
✅ Loaded event: interactionCreate
✅ Successfully reloaded application (/) commands.

✅ Logged in as YourBot#1234
📊 Serving 1 servers
👥 With 10 users

🚀 Bot is online and ready!
```

---

## Step 7: Test the Bot

In your Discord server, try these commands:

```
/ping              - Test if bot is responsive
/help              - See all commands
/chat budtender What's a good strain for relaxation?
/balance           - Check your Buds balance
/grow-start        - Start growing a plant
```

---

## 🎉 You're All Set!

The bot is now running with:
- ✅ AI Chat (OpenRouter)
- ✅ Image Generation (Google Nano Banana)
- ✅ Database (Convex)
- ✅ Basic commands
- ✅ Grow simulator foundation

---

## Next Steps

### Add More Commands

Check the `src/bot/commands/` folder for examples. Create new commands by:

1. Copy existing command file
2. Update `data` (SlashCommandBuilder)
3. Update `execute` function
4. Bot auto-loads new commands on restart

### Connect Convex Database

Currently commands use placeholder data. To connect real database:

1. Create Convex functions in `convex/` folder
2. Import and use in commands
3. See [Convex docs](https://docs.convex.dev)

### Deploy to Production

```bash
# Build TypeScript
pnpm build

# Deploy Convex
npx convex deploy

# Run production
pnpm start
```

Consider hosting on:
- [Railway.app](https://railway.app) (easy, $5/mo)
- [Render.com](https://render.com) (free tier available)
- [Fly.io](https://fly.io) (generous free tier)

---

## Troubleshooting

**Bot doesn't respond:**
- Check bot is online in Discord
- Verify bot has permissions in server
- Check console for errors
- Ensure slash commands are registered

**Commands not showing:**
- Wait 1-5 minutes for Discord to sync
- Try kicking and re-inviting bot
- Check DISCORD_CLIENT_ID is correct

**Convex errors:**
- Make sure `npx convex dev` is running
- Check CONVEX_DEPLOYMENT URL is set
- Verify schema matches in convex/schema.ts

**API errors:**
- Verify all API keys in .env
- Check API key quotas/limits
- Ensure .env is in project root

---

## Support & Resources

- **Discord.js Docs**: https://discord.js.org
- **Convex Docs**: https://docs.convex.dev
- **OpenRouter Docs**: https://openrouter.ai/docs
- **Google AI Docs**: https://ai.google.dev/docs

Happy growing! 🌿💚
