# 🔍 Missing Commands Troubleshooting

## 🎨 **Issue: Image Generation Commands Not Showing**

You're missing these commands in Discord:
- `/generate` - Generate AI art
- `/strain-art` - Generate strain art
- `/gallery` - View art gallery
- `/model-info` - AI model info

---

## ✅ **Verified: Commands ARE Registered**

I checked Discord's API and confirmed these commands are registered:
```
✅ gallery
✅ generate  
✅ model-info
✅ strain-art
```

**The commands exist in Discord's system, but your client isn't showing them.**

---

## 🔧 **Solutions (Try These in Order):**

### **Solution 1: Restart Discord (Most Common Fix)**

1. Completely quit Discord (Cmd+Q on Mac, not just close window)
2. Wait 10 seconds
3. Reopen Discord
4. Try typing `/generate` again

**Why:** Discord caches slash commands locally. Restarting clears the cache.

---

### **Solution 2: Re-invite the Bot**

The bot might be missing the `applications.commands` scope:

1. **Kick the bot** from your server
2. **Generate new invite URL:**
   ```
   https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
   ```
   Replace `YOUR_CLIENT_ID` with your bot's client ID

3. **Invite bot back**
4. Wait 1-2 minutes
5. Check commands again

**Why:** Old bot invites might not have the `applications.commands` scope.

---

### **Solution 3: Force Re-register Commands**

```bash
npm run register
```

Wait 2-3 minutes, then:
- Restart Discord
- Try commands in a different channel
- Try in DM with the bot

---

### **Solution 4: Check Bot Permissions**

Your bot needs these permissions:
- ✅ Use Application Commands
- ✅ Send Messages
- ✅ Attach Files (for image generation)
- ✅ Embed Links

**To verify:**
1. Right-click bot in member list
2. Click "Roles"
3. Check bot role has these permissions

---

### **Solution 5: Try Different Channel**

Discord sometimes caches commands per channel:

1. Create a new text channel
2. Try `/generate` there
3. If it works, the old channel had stale cache

---

### **Solution 6: Check Command Filtering**

Make sure Discord isn't hiding commands:

1. Type `/` in chat
2. Look for filter/search options
3. Make sure no filters are active
4. Try typing full command name: `/generate`

---

### **Solution 7: Use Developer Mode**

If you have bot testing/development setup:

```bash
# Check what Discord sees
npm run commands:list

# Verify commands are there
# Then try re-registering with fresh restart
npm run register
```

---

## 🧪 **Diagnostic Commands:**

### **Check Registered Commands:**
```bash
npm run commands:list
```

### **Force Re-register:**
```bash
npm run register
```

### **Check Bot Status:**
```bash
npm run dev
# Look for: "✅ Successfully reloaded application (/) commands"
```

---

## 📊 **Quick Test:**

1. **Open Discord**
2. **Type `/`** in any channel
3. **Count how many commands show up**
4. **You should see 45 total commands**

**If you see less than 45:**
- Try Solution 1 (Restart Discord)
- Try Solution 2 (Re-invite bot)

**If you see 45 but not the image commands:**
- Discord might be filtering them
- Try typing the full name: `/generate`

---

## 💡 **Why This Happens:**

### **Common Causes:**
1. **Discord Client Cache** - Most common, fixed by restart
2. **Missing OAuth Scope** - Bot invited before `applications.commands` existed
3. **Slow Sync** - Discord can take 1 hour to sync in worst cases
4. **Permission Issues** - Bot lacks required permissions
5. **Channel Overrides** - Channel permissions blocking commands

---

## 🎯 **Expected Behavior:**

When working correctly, typing `/gen` should show:
```
🎨 /generate
   Generate cannabis-themed AI art with Nano Banana
```

---

## ⚡ **Fast Fix (Works 90% of Time):**

```bash
# Step 1: Force re-register
npm run register

# Step 2: Wait 1 minute

# Step 3: Restart Discord (Cmd+Q, reopen)

# Step 4: Try /generate
```

---

## 🆘 **Still Not Working?**

If commands still don't show after trying all solutions:

1. **Check bot logs** for errors:
   ```bash
   npm run dev
   # Look for registration errors
   ```

2. **Verify bot is online** in Discord (green dot)

3. **Try in DMs** with the bot (if bot allows DMs)

4. **Check Discord Developer Portal:**
   - Go to https://discord.com/developers/applications
   - Select your bot
   - Go to "OAuth2" → "URL Generator"
   - Make sure `bot` AND `applications.commands` are checked

5. **Last resort:** Delete all commands and re-register:
   ```bash
   # This will remove all commands then add them back
   npm run register
   ```

---

## 📋 **Command Checklist:**

Use this to verify which commands are showing:

**Image Commands:**
- [ ] `/generate`
- [ ] `/strain-art`
- [ ] `/gallery`
- [ ] `/model-info`

**Economy Commands:**
- [ ] `/balance`
- [ ] `/daily`
- [ ] `/weekly`
- [ ] `/shop`
- [ ] `/buy`

**Growing Commands:**
- [ ] `/grow-start`
- [ ] `/grow-check`
- [ ] `/grow-water`
- [ ] `/grow-harvest`

**If ANY commands are missing**, try Solution 1 (Restart Discord).

---

## ✅ **Success Indicators:**

You'll know it's fixed when:
1. Type `/gen` and see `/generate` autocomplete
2. See description: "Generate cannabis-themed AI art with Nano Banana"
3. Command has a prompt field when you select it
4. Total of 45 commands appear when you type `/`

---

**90% of the time, simply restarting Discord fixes this!** 🎯
