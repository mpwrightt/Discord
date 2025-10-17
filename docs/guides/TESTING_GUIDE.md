# 🧪 Testing Guide - Cannabis Community Bot

## Quick Start Testing

### Step 1: Verify Bot is Online
In Discord, look at the members list - your bot should show as **Online** (green dot)

### Step 2: Check Commands Load
Type `/` in any channel - you should see these commands:
- `/ping`
- `/help`
- `/chat`
- `/balance`
- `/model-info`
- `/grow-start`
- `/grow-check`

If commands don't appear, wait 1-2 minutes (Discord syncs slowly) or try kicking and re-inviting the bot.

---

## Test Commands in Order

### ✅ Test 1: Basic Commands

**Test `/ping`:**
```
/ping
```
**Expected:** Shows latency in milliseconds

**Test `/help`:**
```
/help
```
**Expected:** Beautiful embed showing all commands organized by category

---

### ✅ Test 2: AI Chat (Tests OpenRouter)

**This will use your OpenRouter API key!**

**Test Budtender AI:**
```
/chat personality:Budtender AI message:What's the difference between indica and sativa?
```
**Expected:** 
- Takes 2-5 seconds (AI is thinking)
- Returns detailed, knowledgeable response about strains
- Footer shows: "Asked by YourName • Model: anthropic/claude-3-haiku"

**Test Chill Companion:**
```
/chat personality:Chill Companion message:What's your favorite strain?
```
**Expected:** Casual, friendly response with cannabis slang

**Test Trivia Master:**
```
/chat personality:Trivia Master message:Tell me about cannabis history
```
**Expected:** Educational, fact-based response

**Test Creative Guide:**
```
/chat personality:Creative Guide message:Give me an idea for a cannabis-themed artwork
```
**Expected:** Creative, artistic suggestions

**💡 Tip:** Try different questions with each personality!

---

### ✅ Test 3: Model Info

**Test `/model-info`:**
```
/model-info
```
**Expected:** 
- Shows current AI model (from your .env.local)
- Shows speed, cost, quality ratings
- Private message (only you can see it)

---

### ✅ Test 4: Balance & Economy

**Test `/balance`:**
```
/balance
```
**Expected:** 
- Shows 500 Buds (placeholder)
- Shows level 5
- Shows 125g stashed
- Shows market price

**Note:** This uses fake data for now - we'll connect to Convex database next!

**Test checking another user:**
```
/balance user:@SomeoneElse
```
**Expected:** Shows their balance (also placeholder data)

---

### ✅ Test 5: Grow Simulator

**Test `/grow-start`:**
```
/grow-start strain:
```
**Expected:** 
- Autocomplete appears showing strain names!
- Try typing "Blue" and "Blue Dream" should appear
- Select a strain

After selecting a strain:
**Expected:**
- Beautiful embed showing strain details
- Rarity color (green for uncommon, blue for rare, etc.)
- Shows: Type, Grow Time, Difficulty, Expected Yield, THC %, Cost
- Message about watering daily

**Try different strains:**
```
/grow-start strain:Northern Lights
/grow-start strain:Girl Scout Cookies
/grow-start strain:OG Kush
```

**Test `/grow-check`:**
```
/grow-check
```
**Expected:**
- Shows your active plants (placeholder data)
- Shows progress bar
- Shows days remaining
- Shows health percentage
- Warning if needs watering

**Note:** Currently shows example data - will be real once connected to database!

---

## 🔍 Common Issues & Solutions

### Commands Don't Show Up
**Problem:** Type `/` and bot commands don't appear

**Solutions:**
1. Wait 1-5 minutes (Discord is slow to sync)
2. Check bot has "Use Application Commands" permission
3. Try in a different channel
4. Kick bot and re-invite with fresh URL
5. Check bot is online (green dot in members list)

### Bot Doesn't Respond
**Problem:** Commands show but nothing happens

**Solutions:**
1. Check terminal - bot should be running
2. Look for errors in console
3. Check bot has "Send Messages" and "Embed Links" permissions
4. Try `/ping` - if this works, others should too

### AI Chat Errors
**Problem:** `/chat` returns an error

**Solutions:**
1. Check OPENROUTER_API_KEY in .env.local
2. Verify you have OpenRouter credits
3. Check console for API error messages
4. Try a simpler message first
5. Check your OpenRouter dashboard for API status

### "Interaction Failed"
**Problem:** Discord shows "This interaction failed"

**Solutions:**
1. Bot took too long (>3 seconds to respond)
2. Check internet connection
3. Check API keys are valid
4. Look at console for error details

---

## 🎯 What to Test Next

Once basic commands work:

### Test AI Personalities Thoroughly
Try asking each personality different types of questions:
- **Budtender:** Strain recommendations, growing tips, effects
- **Chill:** Casual chat, jokes, opinions
- **Trivia:** Facts, history, science
- **Creative:** Art ideas, inspiration, aesthetics

### Test Edge Cases
- Very long messages (up to 500 characters)
- Rapid-fire commands
- Multiple users at once
- Commands in different channels

### Monitor Performance
Watch the console for:
- Response times
- Any error messages
- API call logs
- Command execution logs

### Check Costs (Important!)
After testing AI chat:
1. Go to https://openrouter.ai/activity
2. Check your usage/costs
3. Each `/chat` costs ~$0.0002-0.001 depending on model
4. 100 test messages = $0.02-0.10

---

## ✅ Success Checklist

Before moving to next phase, verify:
- [ ] Bot shows as online in Discord
- [ ] All 7 commands appear when typing `/`
- [ ] `/ping` returns latency
- [ ] `/help` shows full command list
- [ ] `/chat` works with all 4 personalities
- [ ] AI responses are relevant and good quality
- [ ] `/model-info` shows correct model
- [ ] `/balance` displays properly
- [ ] `/grow-start` shows strain autocomplete
- [ ] `/grow-check` displays plant info
- [ ] No errors in console
- [ ] Commands respond in under 3 seconds

---

## 📊 What's Working vs. What's Not

### ✅ Fully Working (No Database Needed)
- `/ping` - Basic connectivity
- `/help` - Command documentation
- `/chat` - AI conversations (uses OpenRouter API)
- `/model-info` - Shows current model
- All command UI/embeds look correct

### ⚠️ Partially Working (Placeholder Data)
- `/balance` - Shows hardcoded 500 Buds
- `/grow-start` - Validates strain but doesn't save to database
- `/grow-check` - Shows example plant data

### ❌ Not Yet Implemented
- `/grow-water` - Water plants
- `/grow-harvest` - Harvest buds
- `/sell` - Sell harvest for Buds
- `/daily` - Daily bonus
- `/shop` - Browse items
- `/trivia` - Trivia game
- `/slots` - Casino games
- Image generation commands
- Database persistence for grows/economy

---

## 🚀 Next Phase: Database Integration

Once testing confirms everything works:
1. Create Convex functions to save/load user data
2. Connect `/balance` to real Convex data
3. Make `/grow-start` actually save plants
4. Implement `/grow-water` and `/grow-harvest`
5. Build economy transactions (spend/earn Buds)

---

## 💡 Tips for Testing

1. **Test in a private channel** first
2. **Keep console open** to see errors
3. **Try commands multiple times** to ensure consistency
4. **Test with friends** to verify multi-user works
5. **Document any bugs** you find
6. **Monitor API costs** on OpenRouter dashboard
7. **Screenshot** any errors for debugging

---

## 🆘 Getting Help

If something doesn't work:

1. **Check console output** - errors show there first
2. **Verify .env.local** - all keys set correctly?
3. **Check Discord permissions** - bot has all needed perms?
4. **Test API keys separately**:
   - OpenRouter: https://openrouter.ai/playground
   - Google AI: https://ai.google.dev/
5. **Review logs** - what was the last successful command?

---

## 🎉 Congratulations!

If all tests pass, you have a working Discord bot with:
- ✅ Real AI conversations
- ✅ Beautiful command UI
- ✅ Grow simulator foundation
- ✅ Economy system framework

Ready to build the rest! 🌿💚
