import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Set user's birthday
export const setBirthday = mutation({
  args: {
    discordId: v.string(),
    month: v.number(),
    day: v.number(),
  },
  handler: async (ctx, args) => {
    // Validate date
    if (args.month < 1 || args.month > 12) {
      throw new Error('Invalid month (1-12)');
    }
    if (args.day < 1 || args.day > 31) {
      throw new Error('Invalid day (1-31)');
    }

    // Check if user exists
    const user = await ctx.db
      .query('users')
      .withIndex('by_discord_id', (q) => q.eq('discordId', args.discordId))
      .first();

    if (!user) throw new Error('User not found');

    // Update birthday
    await ctx.db.patch(user._id, {
      birthdayMonth: args.month,
      birthdayDay: args.day,
    });

    return { month: args.month, day: args.day };
  },
});

// Get user's birthday
export const getBirthday = query({
  args: { discordId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_discord_id', (q) => q.eq('discordId', args.discordId))
      .first();

    if (!user) return null;
    if (!user.birthdayMonth || !user.birthdayDay) return null;

    return {
      month: user.birthdayMonth,
      day: user.birthdayDay,
      username: user.username,
    };
  },
});

// Get all birthdays this month
export const getBirthdaysThisMonth = query({
  handler: async (ctx) => {
    const currentMonth = new Date().getMonth() + 1; // 1-12
    
    const users = await ctx.db.query('users').collect();
    
    const birthdays = users
      .filter(user => user.birthdayMonth === currentMonth)
      .map(user => ({
        discordId: user.discordId,
        username: user.username,
        day: user.birthdayDay,
        month: user.birthdayMonth,
      }))
      .sort((a, b) => a.day! - b.day!);

    return birthdays;
  },
});

// Get upcoming birthdays (next 7 days)
export const getUpcomingBirthdays = query({
  handler: async (ctx) => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    const users = await ctx.db.query('users').collect();
    
    const upcoming = users
      .filter(user => {
        if (!user.birthdayMonth || !user.birthdayDay) return false;
        
        // Same month, upcoming days
        if (user.birthdayMonth === currentMonth && user.birthdayDay >= currentDay) {
          return user.birthdayDay - currentDay <= 7;
        }
        
        // Next month, within 7 days
        const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
        if (user.birthdayMonth === nextMonth) {
          const daysLeftInMonth = new Date(today.getFullYear(), currentMonth, 0).getDate() - currentDay;
          return daysLeftInMonth + user.birthdayDay <= 7;
        }
        
        return false;
      })
      .map(user => ({
        discordId: user.discordId,
        username: user.username,
        day: user.birthdayDay,
        month: user.birthdayMonth,
      }))
      .sort((a, b) => {
        // Sort by days until birthday
        const getDaysUntil = (month: number, day: number) => {
          if (month === currentMonth) {
            return day - currentDay;
          } else {
            const daysLeftInMonth = new Date(today.getFullYear(), currentMonth, 0).getDate() - currentDay;
            return daysLeftInMonth + day;
          }
        };
        return getDaysUntil(a.month!, a.day!) - getDaysUntil(b.month!, b.day!);
      });

    return upcoming;
  },
});

// Check if today is user's birthday
export const isTodayBirthday = query({
  args: { discordId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_discord_id', (q) => q.eq('discordId', args.discordId))
      .first();

    if (!user || !user.birthdayMonth || !user.birthdayDay) return false;

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    return user.birthdayMonth === currentMonth && user.birthdayDay === currentDay;
  },
});

// Claim birthday bonus
export const claimBirthdayBonus = mutation({
  args: { discordId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_discord_id', (q) => q.eq('discordId', args.discordId))
      .first();

    if (!user) throw new Error('User not found');
    if (!user.birthdayMonth || !user.birthdayDay) {
      throw new Error('Birthday not set! Use `/birthday set` first');
    }

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    if (user.birthdayMonth !== currentMonth || user.birthdayDay !== currentDay) {
      throw new Error('It\'s not your birthday today!');
    }

    // Check if already claimed today
    const lastClaimed = user.lastBirthdayClaim || 0;
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    
    if (lastClaimed >= todayStart) {
      throw new Error('You already claimed your birthday bonus today!');
    }

    // Give birthday bonus
    const bonus = 500; // Big birthday bonus!
    await ctx.db.patch(user._id, {
      buds: user.buds + bonus,
      totalBudsEarned: user.totalBudsEarned + bonus,
      lastBirthdayClaim: Date.now(),
    });

    return { bonus };
  },
});
