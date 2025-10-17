# 👑 Discord Role Setup Guide

## ✅ **NOW FIXED - ROLES AUTO-ASSIGN!**

I just added automatic role assignment! When users buy roles, the bot will now try to assign them automatically.

---

## 🎯 **HOW IT WORKS**

### **When a user buys VIP, Connoisseur, or Master Grower:**

1. ✅ Bot deducts Buds from their balance
2. ✅ Bot saves purchase to inventory
3. ✅ Bot searches for Discord role by name
4. ✅ Bot assigns role to user (if found)
5. ✅ User gets confirmation message

### **Three Possible Outcomes:**

**✅ Success:**
```
🛒 Purchase Complete!
You bought VIP Role!
💰 Cost: 1,000 Buds
📝 Green name, priority support

✅ VIP role assigned!
```

**⚠️ Role Doesn't Exist:**
```
🛒 Purchase Complete!
You bought VIP Role!

⚠️ Role purchased but not assigned.
Ask an admin to create a "VIP" role and assign it to you.
```

**❌ Permission Error:**
```
🛒 Purchase Complete!

⚠️ Role purchased but couldn't auto-assign. Contact an admin.
```

---

## 🔧 **SETUP INSTRUCTIONS**

### **Step 1: Create the Roles in Discord**

1. Go to **Server Settings** → **Roles**
2. Click **Create Role**
3. Create these exact role names:
   - `VIP`
   - `Connoisseur`
   - `Master Grower`

### **Step 2: Set Role Colors**

**VIP (Green):**
- Color: `#2ECC71` (Green)
- Permissions: Default member permissions

**Connoisseur (Gold):**
- Color: `#F1C40F` (Gold)
- Permissions: Same as VIP or slightly elevated

**Master Grower (Purple):**
- Color: `#9B59B6` (Purple)
- Permissions: Same or elevated (optional perks)

### **Step 3: Set Bot Permissions**

Make sure your bot has these permissions:
- ✅ **Manage Roles** (REQUIRED for auto-assignment)
- ✅ **View Channels**
- ✅ **Send Messages**

**How to check:**
1. Server Settings → Roles
2. Find your bot's role
3. Enable "Manage Roles" permission

### **Step 4: Role Hierarchy**

IMPORTANT: Your bot's role must be **above** the roles it assigns!

**Correct Hierarchy:**
```
1. Admin
2. Moderator
3. Bot Role (e.g., "Hobbie Bot")  ← Must be here
4. Master Grower                   ← Below bot
5. Connoisseur                     ← Below bot
6. VIP                             ← Below bot
7. @everyone
```

**How to set:**
1. Server Settings → Roles
2. Drag your bot's role **above** VIP/Connoisseur/Master Grower
3. Save

---

## 🧪 **TESTING**

### **Test 1: Manual Role Assignment**
Before users buy anything, test manually:
1. Create the three roles
2. Try manually assigning them to yourself
3. Verify colors work

### **Test 2: Auto-Assignment**
1. Use `/daily` a few times to get 1,000+ Buds
2. Use `/buy item:vip`
3. Check if role was assigned automatically
4. Check your name color changed to green

### **Test 3: Error Handling**
1. Delete the VIP role temporarily
2. Try buying VIP again (different account)
3. Should get "Role purchased but not assigned" message
4. Recreate role and manually assign

---

## 🎨 **RECOMMENDED ROLE PERKS**

### **VIP (1,000 Buds)**
- ✅ Green name color
- ✅ Access to #vip-lounge channel (create this)
- ✅ Priority support
- ✅ Custom emoji use

### **Connoisseur (2,500 Buds)**
- ✅ Gold name color
- ✅ All VIP perks
- ✅ Access to #connoisseur-lounge
- ✅ Voice channel priority
- ✅ Can create custom roles (optional)

### **Master Grower (5,000 Buds)**
- ✅ Purple name color
- ✅ All Connoisseur perks
- ✅ Access to #master-grower-lounge
- ✅ Mention @everyone (optional)
- ✅ Can help moderate (optional)
- ✅ Special badge/recognition

---

## 🔍 **TROUBLESHOOTING**

### **"Role purchased but not assigned"**
**Cause:** Role doesn't exist in Discord
**Fix:** Create role with exact name (case-sensitive)

### **"Couldn't auto-assign"**
**Cause:** Bot lacks "Manage Roles" permission
**Fix:** Give bot "Manage Roles" permission

### **"Missing Permissions"**
**Cause:** Bot role is below the role it's trying to assign
**Fix:** Move bot role above VIP/Connoisseur/Master Grower

### **Role assigned but no color**
**Cause:** Role has no color set
**Fix:** Edit role and set color

### **Multiple roles not working**
**Cause:** "Display role members separately" may be off
**Fix:** Edit each role → Enable "Display role members separately"

---

## 📋 **CHECKING WHO BOUGHT WHAT**

### **Option 1: Check Inventory**
```
/inventory
→ Shows their purchased items including roles
```

### **Option 2: Check Database**
1. Open Convex dashboard
2. Go to `users` table
3. Find user by `discordId`
4. Check `equipmentOwned` array
5. Look for: 'vip', 'connoisseur', or 'master-grower'

### **Option 3: Bot Logs**
Check your bot console for:
```
Role assignment error: ...
```
This shows if auto-assignment failed.

---

## 🎯 **WHAT'S AUTOMATED NOW**

✅ **Deducting Buds** - Automatic
✅ **Saving to inventory** - Automatic  
✅ **Finding Discord role** - Automatic
✅ **Assigning role to user** - Automatic (if bot has permissions)
✅ **Confirmation message** - Automatic

---

## ⚠️ **IMPORTANT NOTES**

### **Role Names Must Match Exactly:**
- ✅ `VIP` (correct)
- ❌ `vip` (wrong - lowercase)
- ❌ `V.I.P.` (wrong - has dots)
- ❌ `VIP Role` (wrong - extra word)

### **Bot Must Have Permission:**
- Bot role must have "Manage Roles"
- Bot role must be above roles it assigns
- Bot must be in the server (obviously)

### **Users Can't Buy Same Role Twice:**
Code checks `equipmentOwned` and prevents duplicate purchases.

---

## 🚀 **QUICK SETUP (5 Minutes)**

```
1. Create 3 roles:
   - VIP (Green: #2ECC71)
   - Connoisseur (Gold: #F1C40F)
   - Master Grower (Purple: #9B59B6)

2. Give bot "Manage Roles" permission

3. Move bot role above the 3 roles

4. Test with /buy item:vip

5. Done! Auto-assignment works!
```

---

## 💡 **OPTIONAL: Role Channels**

Create exclusive channels for role holders:

**#vip-lounge:**
- Private channel
- Only VIP+ can see
- General chat, relaxed rules

**#connoisseur-lounge:**
- Only Connoisseur+ can see
- Advanced discussions

**#master-grower-lounge:**
- Only Master Growers
- Elite growers chat
- Strategy discussions

---

## 🎨 **COLOR REFERENCE**

**VIP Green:** `#2ECC71` (rgb: 46, 204, 113)
**Connoisseur Gold:** `#F1C40F` (rgb: 241, 196, 15)
**Master Grower Purple:** `#9B59B6` (rgb: 155, 89, 182)

---

## ✅ **FINAL CHECKLIST**

Before launching:
- [ ] Three roles created with exact names
- [ ] Roles have colors set
- [ ] Bot has "Manage Roles" permission
- [ ] Bot role is above VIP/Connoisseur/Master Grower
- [ ] Tested purchasing VIP role
- [ ] Verified role auto-assigns
- [ ] Verified name color changes

---

**Your role system is now fully automated!** Users buy roles and get them instantly. 🎉👑
