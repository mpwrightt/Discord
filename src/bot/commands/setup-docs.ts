import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ChannelType, TextChannel } from 'discord.js';
import { COLORS } from '../../lib/utils.js';

export const data = new SlashCommandBuilder()
  .setName('setup-docs')
  .setDescription('Post all command documentation to a channel (Admin only)')
  .addChannelOption(option =>
    option
      .setName('channel')
      .setDescription('Channel to post documentation')
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText)
  )
  .setDefaultMemberPermissions('0'); // Admin only

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  const channel = interaction.options.getChannel('channel', true) as TextChannel;

  try {
    // Introduction Embed
    const introEmbed = new EmbedBuilder()
      .setTitle('🌿 Cannabis Community Bot - Command Guide')
      .setColor(COLORS.CANNABIS)
      .setDescription(
        '**Welcome to your complete cannabis community bot!**\n\n' +
        'This bot features a complete grow simulation, economy system, mini-games, AI chat, and more!\n\n' +
        '📚 **Command Categories:**\n' +
        '🌱 Growing System\n' +
        '💰 Economy\n' +
        '🎮 Mini-Games\n' +
        '🎨 AI & Images\n' +
        '📖 Knowledge Base\n' +
        '👥 Community\n' +
        '🤖 Tools & Help\n\n' +
        '**Scroll down to see all commands organized by category!**'
      )
      .setFooter({ text: '43 total commands available' })
      .setTimestamp();

    await channel.send({ embeds: [introEmbed] });

    // GROWING SYSTEM
    const growingEmbed = new EmbedBuilder()
      .setTitle('🌱 GROWING SYSTEM')
      .setColor('#2ECC71')
      .setDescription('Plant, care for, and harvest cannabis plants!')
      .addFields(
        {
          name: '`/grow-start`',
          value: '**Start growing a cannabis plant**\nChoose from 20+ strains with different rarities, grow times, and yields.\n\n' +
                 '**Usage:** `/grow-start strain:Blue Dream`\n' +
                 '**Cost:** 50-200 Buds (depends on rarity)\n' +
                 '**Grow Time:** 5-14 days\n',
          inline: false
        },
        {
          name: '`/grow-check`',
          value: '**Check your growing plants**\nSee health, progress, days remaining, and when to water.\n\n' +
                 '**Usage:** `/grow-check`\n' +
                 '**Shows:** Health, progress bar, days left, watering status',
          inline: false
        },
        {
          name: '`/grow-water`',
          value: '**Water your plants**\nKeep plants healthy by watering every 20-24 hours.\n\n' +
                 '**Usage:** `/grow-water`\n' +
                 '**Frequency:** Once per day\n' +
                 '**Effect:** Maintains/improves plant health',
          inline: false
        },
        {
          name: '`/grow-feed`',
          value: '**Apply nutrients for better yield**\nBoost your harvest by +15% with nutrients.\n\n' +
                 '**Usage:** `/grow-feed`\n' +
                 '**Cost:** 15 Buds per plant\n' +
                 '**Effect:** +15% yield boost',
          inline: false
        },
        {
          name: '`/grow-harvest`',
          value: '**Harvest mature plants**\nCollect buds when plants are ready (shows in `/grow-check`).\n\n' +
                 '**Usage:** `/grow-harvest`\n' +
                 '**Reward:** 50-200+ grams (depends on strain & health)\n' +
                 '**Requirement:** Plant must be fully grown',
          inline: false
        },
        {
          name: '`/sell`',
          value: '**Sell your harvested buds**\nConvert grams to Buds currency at market rate.\n\n' +
                 '**Usage:** `/sell grams:100`\n' +
                 '**Rate:** ~3 Buds per gram (fluctuates)\n' +
                 '**Example:** 100g = 300 Buds',
          inline: false
        },
        {
          name: '`/market`',
          value: '**Check current market prices**\nSee the current selling price for your harvest.\n\n' +
                 '**Usage:** `/market`\n' +
                 '**Shows:** Current price, example sales, market trends',
          inline: false
        }
      );

    await channel.send({ embeds: [growingEmbed] });

    // ECONOMY SYSTEM
    const economyEmbed = new EmbedBuilder()
      .setTitle('💰 ECONOMY SYSTEM')
      .setColor('#F1C40F')
      .setDescription('Earn, spend, and manage your Buds currency!')
      .addFields(
        {
          name: '`/balance`',
          value: '**Check your Buds and stats**\nView currency, level, XP, stash, and more.\n\n' +
                 '**Usage:** `/balance` or `/balance user:@Friend`\n' +
                 '**Shows:** Buds, level, XP, grams stashed, total grown',
          inline: false
        },
        {
          name: '`/daily`',
          value: '**Claim daily bonus**\nGet 50-100 Buds every day with streak bonuses!\n\n' +
                 '**Usage:** `/daily`\n' +
                 '**Reward:** 50 Buds + (streak × 5) Buds\n' +
                 '**Cooldown:** 20 hours\n' +
                 '**Max Bonus:** 100 Buds with 10-day streak',
          inline: false
        },
        {
          name: '`/weekly`',
          value: '**Claim weekly bonus**\nBig weekly reward of 250 Buds!\n\n' +
                 '**Usage:** `/weekly`\n' +
                 '**Reward:** 250 Buds\n' +
                 '**Cooldown:** 7 days',
          inline: false
        },
        {
          name: '`/shop`',
          value: '**Browse the shop**\nSee all items, upgrades, and roles you can purchase.\n\n' +
                 '**Usage:** `/shop`\n' +
                 '**Categories:** Roles, grow upgrades, boosts, customization',
          inline: false
        },
        {
          name: '`/buy`',
          value: '**Purchase items**\nBuy upgrades, roles, and boosts with your Buds.\n\n' +
                 '**Usage:** `/buy item:extra-slot`\n' +
                 '**Popular Items:**\n' +
                 '• Extra Plant Slot (500 Buds)\n' +
                 '• VIP Role (1,000 Buds)\n' +
                 '• 2x XP Boost (400 Buds)',
          inline: false
        },
        {
          name: '`/gift`',
          value: '**Send Buds to friends**\nShare your wealth with the community!\n\n' +
                 '**Usage:** `/gift user:@Friend amount:100`\n' +
                 '**Min:** 1 Bud\n' +
                 '**Note:** Can\'t send to yourself or bots',
          inline: false
        },
        {
          name: '`/inventory`',
          value: '**View your items**\nSee all upgrades and items you\'ve purchased.\n\n' +
                 '**Usage:** `/inventory`\n' +
                 '**Shows:** All owned equipment, roles, and boosts',
          inline: false
        }
      );

    await channel.send({ embeds: [economyEmbed] });

    // MINI-GAMES
    const gamesEmbed = new EmbedBuilder()
      .setTitle('🎮 MINI-GAMES')
      .setColor('#9B59B6')
      .setDescription('Play fun games to earn Buds!')
      .addFields(
        {
          name: '`/trivia`',
          value: '**Cannabis knowledge quiz**\nAnswer questions to earn 10-30 Buds!\n\n' +
                 '**Usage:** `/trivia` or `/trivia difficulty:Hard`\n' +
                 '**Rewards:** Easy=10, Medium=20, Hard=30 Buds\n' +
                 '**Interactive:** Uses buttons to answer',
          inline: false
        },
        {
          name: '`/coinflip`',
          value: '**Double or nothing**\nFlip a coin - guess right to double your bet!\n\n' +
                 '**Usage:** `/coinflip bet:100 choice:Heads`\n' +
                 '**Win:** 2x your bet\n' +
                 '**Lose:** Lose your bet',
          inline: false
        },
        {
          name: '`/slots`',
          value: '**Slot machine**\nSpin the slots for big multiplier wins!\n\n' +
                 '**Usage:** `/slots bet:100`\n' +
                 '**Jackpot:** 50x payout (💎💎💎)\n' +
                 '**Payouts:** 8x to 50x on matches',
          inline: false
        },
        {
          name: '`/higher-lower`',
          value: '**Guess THC levels**\nGuess if the next strain has higher or lower THC!\n\n' +
                 '**Usage:** `/higher-lower bet:100`\n' +
                 '**Win:** 2x your bet\n' +
                 '**Interactive:** Button-based gameplay',
          inline: false
        },
        {
          name: '`/scramble`',
          value: '**Unscramble strain names**\nRace against time to unscramble cannabis strains!\n\n' +
                 '**Usage:** `/scramble`\n' +
                 '**Reward:** 3 Buds per letter\n' +
                 '**Time Limit:** 30 seconds',
          inline: false
        },
        {
          name: '`/blackjack`',
          value: '**Classic card game**\nPlay blackjack against the dealer!\n\n' +
                 '**Usage:** `/blackjack bet:100`\n' +
                 '**Win:** 2x bet (2.5x on blackjack)\n' +
                 '**Interactive:** Hit or stand with buttons',
          inline: false
        },
        {
          name: '`/wordchain`',
          value: '**Create word chains**\nLink cannabis words by first/last letter!\n\n' +
                 '**Usage:** `/wordchain`\n' +
                 '**Reward:** 10 Buds per word\n' +
                 '**Max:** 5 words (50 Buds total)',
          inline: false
        },
        {
          name: '`/hangman`',
          value: '**Guess the strain**\nClassic hangman with cannabis strain names!\n\n' +
                 '**Usage:** `/hangman`\n' +
                 '**Reward:** 5 Buds per letter in strain name\n' +
                 '**Tries:** 6 wrong guesses allowed',
          inline: false
        }
      );

    await channel.send({ embeds: [gamesEmbed] });

    // AI & IMAGES
    const aiEmbed = new EmbedBuilder()
      .setTitle('🎨 AI & IMAGE GENERATION')
      .setColor('#E91E63')
      .setDescription('Create stunning AI art and chat with AI personalities!')
      .addFields(
        {
          name: '`/chat`',
          value: '**Talk with AI personalities**\nConversation powered by Google Gemini 2.5 Flash!\n\n' +
                 '**Usage:** `/chat personality:Budtender AI message:What\'s a good indica?`\n' +
                 '**Personalities:**\n' +
                 '• 🌿 Budtender AI (Expert)\n' +
                 '• 😌 Chill Companion (Casual)\n' +
                 '• 🧠 Trivia Master (Knowledge)\n' +
                 '• 🎨 Creative Guide (Artistic)',
          inline: false
        },
        {
          name: '`/generate`',
          value: '**Create AI art**\nGenerate cannabis-themed images with Google Nano Banana!\n\n' +
                 '**Usage:** `/generate prompt:Purple cannabis macro shot`\n' +
                 '**Limit:** 5 images per day\n' +
                 '**Quality:** High-quality AI generation',
          inline: false
        },
        {
          name: '`/strain-art`',
          value: '**Visualize strains**\nCreate artistic representations of specific strains!\n\n' +
                 '**Usage:** `/strain-art strain:Blue Dream`\n' +
                 '**Features:** Strain-specific prompts, optimized results',
          inline: false
        },
        {
          name: '`/gallery`',
          value: '**Community art gallery**\nView amazing AI art created by the community!\n\n' +
                 '**Usage:** `/gallery`\n' +
                 '**Shows:** Featured artwork, top creators, stats',
          inline: false
        }
      );

    await channel.send({ embeds: [aiEmbed] });

    // KNOWLEDGE BASE
    const knowledgeEmbed = new EmbedBuilder()
      .setTitle('📚 KNOWLEDGE BASE')
      .setColor('#3498DB')
      .setDescription('Learn everything about cannabis!')
      .addFields(
        {
          name: '`/strain`',
          value: '**Detailed strain information**\nLearn about any strain in the database!\n\n' +
                 '**Usage:** `/strain name:Blue Dream`\n' +
                 '**Info:** Type, THC, CBD, effects, grow time, tips\n' +
                 '**Database:** 20+ strains',
          inline: false
        },
        {
          name: '`/effects`',
          value: '**Get strain recommendations**\nFind the perfect strain for your desired effect!\n\n' +
                 '**Usage:** `/effects mood:Relaxation`\n' +
                 '**Options:** Relaxation, Energy, Creativity, Euphoria, Stress, Pain\n' +
                 '**AI-Powered:** Smart recommendations',
          inline: false
        },
        {
          name: '`/grow-help`',
          value: '**AI growing advice**\nGet expert tips powered by Google Gemini!\n\n' +
                 '**Usage:** `/grow-help question:How often should I water?`\n' +
                 '**Topics:** Watering, lighting, nutrients, problems, harvest timing',
          inline: false
        },
        {
          name: '`/compare`',
          value: '**Compare strains**\nSide-by-side comparison of two strains!\n\n' +
                 '**Usage:** `/compare strain1:OG Kush strain2:Sour Diesel`\n' +
                 '**Compares:** Type, THC, yield, grow time, difficulty',
          inline: false
        },
        {
          name: '`/legality`',
          value: '**Check legal status**\nLearn about cannabis laws by location!\n\n' +
                 '**Usage:** `/legality location:California`\n' +
                 '**Covers:** 12 US states + Canada\n' +
                 '**Info:** Medical/recreational status, possession limits, home grow',
          inline: false
        },
        {
          name: '`/dosage`',
          value: '**Safe dosing guide**\nGet personalized dosing recommendations!\n\n' +
                 '**Usage:** `/dosage experience:Beginner method:Edibles`\n' +
                 '**Methods:** Smoking, edibles, tinctures, concentrates\n' +
                 '**Safety:** Experience-based recommendations',
          inline: false
        },
        {
          name: '`/terps`',
          value: '**Learn about terpenes**\nUnderstand the aromatic compounds in cannabis!\n\n' +
                 '**Usage:** `/terps terpene:Limonene`\n' +
                 '**Covers:** 7 major terpenes\n' +
                 '**Info:** Aroma, effects, medical benefits, strains',
          inline: false
        }
      );

    await channel.send({ embeds: [knowledgeEmbed] });

    // COMMUNITY
    const communityEmbed = new EmbedBuilder()
      .setTitle('👥 COMMUNITY FEATURES')
      .setColor('#E67E22')
      .setDescription('Connect, compete, and celebrate with the community!')
      .addFields(
        {
          name: '`/profile`',
          value: '**View user profiles**\nBeautiful profile cards with stats!\n\n' +
                 '**Usage:** `/profile` or `/profile user:@Friend`\n' +
                 '**Shows:** Level, XP, Buds, growing stats, streaks, activity',
          inline: false
        },
        {
          name: '`/leaderboard`',
          value: '**View rankings**\nSee who\'s leading the community!\n\n' +
                 '**Usage:** `/leaderboard type:Buds`\n' +
                 '**Types:** Buds, Level, Total Grown\n' +
                 '**Shows:** Top 10 users',
          inline: false
        },
        {
          name: '`/stats`',
          value: '**Detailed statistics**\nView comprehensive stats!\n\n' +
                 '**Usage:** `/stats type:Personal`\n' +
                 '**Types:** Personal, Server, Growing\n' +
                 '**Shows:** Economy, progression, efficiency',
          inline: false
        },
        {
          name: '`/poll`',
          value: '**Create polls**\nAsk the community questions!\n\n' +
                 '**Usage:** `/poll question:"Best strain?" option1:Indica option2:Sativa`\n' +
                 '**Options:** 2-4 choices\n' +
                 '**Interactive:** React with numbers to vote',
          inline: false
        },
        {
          name: '`/event`',
          value: '**Schedule events**\nCreate event announcements!\n\n' +
                 '**Usage:** `/event title:"Grow Competition" description:"..." time:"Friday 8PM"`\n' +
                 '**Features:** Time display, RSVP reactions',
          inline: false
        },
        {
          name: '`/birthday`',
          value: '**Birthday management**\nCelebrate birthdays with the community!\n\n' +
                 '**Commands:**\n' +
                 '• `/birthday set` - Set your birthday (500 Buds reward!)\n' +
                 '• `/birthday view` - See your birthday\n' +
                 '• `/birthday upcoming` - Next 7 days\n' +
                 '• `/birthday month` - This month\'s birthdays\n' +
                 '• `/birthday claim` - Claim 500 Buds bonus!\n' +
                 '**Privacy:** Only month/day, no year needed',
          inline: false
        },
        {
          name: '`/celebrate`',
          value: '**Celebrate users**\nSend celebration messages!\n\n' +
                 '**Usage:** `/celebrate user:@Friend message:Happy Birthday!`\n' +
                 '**Perfect For:** Birthdays, achievements, milestones',
          inline: false
        }
      );

    await channel.send({ embeds: [communityEmbed] });

    // TOOLS & HELP
    const toolsEmbed = new EmbedBuilder()
      .setTitle('🤖 TOOLS & HELP')
      .setColor('#95A5A6')
      .setDescription('Bot information and utilities')
      .addFields(
        {
          name: '`/help`',
          value: '**Complete command list**\nQuick reference for all commands!\n\n' +
                 '**Usage:** `/help`\n' +
                 '**Shows:** All 43 commands organized by category',
          inline: false
        },
        {
          name: '`/ping`',
          value: '**Check bot latency**\nTest bot responsiveness!\n\n' +
                 '**Usage:** `/ping`\n' +
                 '**Shows:** API latency, websocket ping',
          inline: false
        },
        {
          name: '`/model-info`',
          value: '**AI model information**\nLearn about the AI models powering the bot!\n\n' +
                 '**Usage:** `/model-info`\n' +
                 '**Shows:** Google Gemini 2.5 Flash & Nano Banana details',
          inline: false
        }
      );

    await channel.send({ embeds: [toolsEmbed] });

    // QUICK START GUIDE
    const quickStartEmbed = new EmbedBuilder()
      .setTitle('🚀 QUICK START GUIDE')
      .setColor('#1ABC9C')
      .setDescription('**New to the bot? Start here!**')
      .addFields(
        {
          name: '1️⃣ Get Started',
          value: '`/daily` - Claim your first 50 Buds\n' +
                 '`/balance` - Check your stats\n' +
                 '`/birthday set` - Set your birthday',
          inline: false
        },
        {
          name: '2️⃣ Start Growing',
          value: '`/grow-start strain:Blue Dream` - Plant your first seed\n' +
                 '`/grow-water` - Water it daily\n' +
                 '`/grow-check` - Check progress',
          inline: false
        },
        {
          name: '3️⃣ Have Fun',
          value: '`/trivia` - Play a quick game\n' +
                 '`/chat` - Talk with AI\n' +
                 '`/generate` - Create AI art',
          inline: false
        },
        {
          name: '4️⃣ Harvest & Profit',
          value: '`/grow-harvest` - Collect buds (after 7 days)\n' +
                 '`/sell` - Sell for Buds\n' +
                 '`/buy` - Upgrade your setup',
          inline: false
        },
        {
          name: '5️⃣ Engage',
          value: '`/profile` - View your stats\n' +
                 '`/leaderboard` - Compete\n' +
                 '`/celebrate` - Celebrate friends',
          inline: false
        }
      )
      .setFooter({ text: 'Need help? Ask in the community!' });

    await channel.send({ embeds: [quickStartEmbed] });

    // TIPS & TRICKS
    const tipsEmbed = new EmbedBuilder()
      .setTitle('💡 TIPS & TRICKS')
      .setColor('#16A085')
      .setDescription('**Pro strategies to maximize your success!**')
      .addFields(
        {
          name: '🌱 Growing Tips',
          value: '• Water plants every 20-24 hours for best health\n' +
                 '• Use `/grow-feed` on rare strains for max profit\n' +
                 '• Buy extra plant slots early to scale up\n' +
                 '• Start with easy strains like Blue Dream',
          inline: false
        },
        {
          name: '💰 Earning Buds',
          value: '• Never miss `/daily` - streak bonuses add up!\n' +
                 '• Claim `/weekly` every 7 days (250 Buds)\n' +
                 '• Set birthday for 500 Buds bonus once per year\n' +
                 '• Play `/trivia` for quick 10-30 Buds\n' +
                 '• Grow multiple plants at once',
          inline: false
        },
        {
          name: '🎮 Gaming Strategy',
          value: '• Start with small bets to learn games\n' +
                 '• `/trivia` is the safest way to earn\n' +
                 '• `/slots` has the biggest payouts\n' +
                 '• Don\'t bet more than you can afford to lose',
          inline: false
        },
        {
          name: '⭐ Leveling Fast',
          value: '• Complete daily and weekly bonuses\n' +
                 '• Grow and sell continuously\n' +
                 '• Play games regularly\n' +
                 '• Buy 2x XP boosts when available',
          inline: false
        },
        {
          name: '👥 Community',
          value: '• Use `/celebrate` to make friends\n' +
                 '• Check `/birthday upcoming` weekly\n' +
                 '• Gift Buds to help new members\n' +
                 '• Participate in polls and events',
          inline: false
        }
      );

    await channel.send({ embeds: [tipsEmbed] });

    // SUCCESS MESSAGE
    await interaction.editReply({
      content: `✅ **Documentation posted to ${channel}!**\n\nAll 43 commands have been documented with examples and tips.`
    });

  } catch (error: any) {
    console.error('Setup docs error:', error);
    await interaction.editReply({
      content: `❌ Failed to post documentation: ${error.message}`
    });
  }
}
