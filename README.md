# Cannabis Community Discord Bot 🌿

An AI-powered Discord bot for cannabis communities featuring a complete grow simulation game, economy system, and AI personalities.

## ✨ Features

- 🤖 **AI Chat** - 4 personalities via Google Gemini 2.5 Flash
- 🎨 **Image Generation** - AI art via Gemini 2.5 Flash Image (Nano Banana)
- 🌱 **Grow Simulator** - Plant → Water → Harvest → Sell (7-day cycles)
- 💰 **Economy System** - Earn and spend virtual "Buds" currency
- 🎮 **8 Mini-Games** - Trivia, slots, blackjack, coinflip, scramble, hangman, and more
- 🎂 **Birthday System** - 500 Buds birthday rewards
- 📚 **Knowledge Base** - Cannabis education, strain info, grow advice
- 🏆 **Leaderboards** - Rankings by Buds, level, and grams grown

## 📊 Stats

- **45 commands** total
- **42 working** out of the box (93%)
- **3 commands** need 5-min Discord role setup
- **20 cannabis strains** (5 rarity tiers)
- **Full database persistence** via Convex

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Fill in your API keys:
     - `DISCORD_TOKEN` - Your Discord bot token
     - `DISCORD_CLIENT_ID` - Your Discord application ID
     - `GOOGLE_AI_API_KEY` - Google AI API key for Gemini
     - `CONVEX_URL` - Your Convex deployment URL

3. **Initialize Convex:**
   ```bash
   npx convex dev
   ```

4. **Seed the database:**
   ```bash
   npm run db:init
   ```
   This initializes market prices and other essential data.

5. **Run the bot:**
   ```bash
   pnpm dev
   ```

6. **Verify setup:**
   ```bash
   npm run db:stats
   ```
   Check that market price is set and database is ready.

## Project Structure

```
src/
├── bot/
│   ├── commands/     # All slash commands
│   ├── events/       # Discord event handlers
│   └── index.ts      # Bot entry point
├── lib/              # API clients & utilities
├── games/            # Game logic
└── types/            # TypeScript types

convex/               # Database schema & functions
```

## Commands

### AI Chat
- `/chat [personality] [message]` - Talk with AI
- `/ask [question]` - Quick Q&A

### Grow Sim
- `/grow-start [strain]` - Start growing
- `/grow-water` - Water plants
- `/grow-check` - Check status
- `/grow-harvest` - Harvest plants
- `/sell [grams]` - Sell harvest

### Games
- `/trivia` - Cannabis trivia
- `/slots [bet]` - Slot machine
- `/blackjack [bet]` - Card game

### Economy
- `/balance` - Check Buds
- `/shop` - Browse items
- `/market` - Check sell prices

## Development

- `pnpm dev` - Run in development mode
- `pnpm build` - Build for production
- `pnpm start` - Run production build
- `npm run db:init` - Initialize database with seed data
- `npm run db:stats` - View database statistics

## 📚 Documentation

All documentation is organized in the `docs/` directory:

- **[Documentation Index](docs/INDEX.md)** - Complete guide to all docs
- **[Quick Start](docs/setup/QUICKSTART.md)** - Get started in 5 minutes
- **[Setup Guide](docs/setup/SETUP.md)** - Full installation
- **[All Commands](docs/reference/COMPLETE_COMMAND_VERIFICATION.md)** - Every command documented
- **[Troubleshooting](docs/troubleshooting/)** - Common issues and solutions

## License

MIT
