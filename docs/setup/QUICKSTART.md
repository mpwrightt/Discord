# ⚡ Quick Start Guide

Get your Cannabis Community Bot running in 10 minutes!

## 1. Install Everything

```bash
# Install dependencies
pnpm install

# Install Convex CLI
npm install -g convex
```

## 2. Get Your API Keys

You need 3 API keys:

| Service | Get Key From | Purpose |
|---------|-------------|---------|
| **Discord** | [Discord Developer Portal](https://discord.com/developers/applications) | Bot token |
| **OpenRouter** | [openrouter.ai](https://openrouter.ai) | AI chat |
| **Google AI** | [ai.google.dev](https://ai.google.dev) | Image generation |

## 3. Set Up Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your keys
nano .env
```

Fill in:
```env
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_application_id
OPENROUTER_API_KEY=sk-or-v1-xxxxx
GOOGLE_AI_API_KEY=AIzaSyXXXXX
```

## 4. Initialize Convex

```bash
# Start Convex (opens browser)
npx convex dev
```

Leave this terminal open!

## 5. Run the Bot

In a **new terminal**:

```bash
pnpm dev
```

## 6. Invite Bot to Server

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to OAuth2 → URL Generator
4. Check: `bot` + `applications.commands`
5. Permissions: Administrator (or specific perms)
6. Copy URL and open in browser
7. Select server and authorize

## 7. Test It!

In Discord:
```
/ping
/help
/chat budtender Tell me about indica vs sativa
/balance
```

## ✅ Done!

Your bot is live! See `SETUP.md` for detailed configuration.

## Common Issues

**Bot offline?**
- Check `pnpm dev` is running
- Verify bot token in .env

**Commands not appearing?**
- Wait 1-5 minutes
- Re-invite bot with fresh URL
- Check client ID is correct

**Convex errors?**
- Ensure `npx convex dev` is running
- Check CONVEX_DEPLOYMENT in .env

## What's Next?

- Read full `SETUP.md` for details
- Check `README.md` for all commands
- Explore `src/bot/commands/` to add features
- Join our community for support

Happy coding! 🌿
