# 🤖 OpenRouter Model Guide

Your bot uses OpenRouter to access multiple AI models through a single API. The model is configured via environment variables for cost control and consistency.

## Current Configuration

Check your `.env` file:
```env
OPENROUTER_MODEL=anthropic/claude-3-haiku
```

Users can check the current model in Discord with `/model-info`.

---

## Recommended Models

### Fast & Cheap (Best for High Volume)

**anthropic/claude-3-haiku** ⭐ (Recommended Default)
- Speed: Very Fast
- Cost: ~$0.25 per 1M input tokens
- Quality: Good for most tasks
- Best for: General chat, high volume

**openai/gpt-3.5-turbo**
- Speed: Fastest
- Cost: ~$0.50 per 1M input tokens  
- Quality: Good for simple tasks
- Best for: Very high volume, simple responses

**meta-llama/llama-3.1-8b-instruct**
- Speed: Fast
- Cost: ~$0.06 per 1M input tokens (cheapest!)
- Quality: Decent for casual chat
- Best for: Maximum cost savings

### Balanced (Good Quality & Price)

**google/gemini-pro**
- Speed: Fast
- Cost: ~$0.50 per 1M input tokens
- Quality: Very good
- Best for: Balanced performance

**anthropic/claude-3-sonnet**
- Speed: Medium
- Cost: ~$3 per 1M input tokens
- Quality: Excellent
- Best for: Quality matters more than speed

### Premium (Best Quality, Higher Cost)

**anthropic/claude-3.5-sonnet** ⭐ (Best Quality)
- Speed: Medium
- Cost: ~$3 per 1M input tokens
- Quality: Top tier reasoning
- Best for: Complex tasks, best responses

**openai/gpt-4-turbo**
- Speed: Medium
- Cost: ~$10 per 1M input tokens
- Quality: Excellent
- Best for: Complex reasoning

**openai/gpt-4o**
- Speed: Fast (for GPT-4)
- Cost: ~$5 per 1M input tokens
- Quality: Top tier, multimodal
- Best for: Best overall GPT-4 experience

---

## How to Change Models

1. **Edit your `.env` file:**
   ```env
   OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
   ```

2. **Restart the bot:**
   ```bash
   # Stop the current bot (Ctrl+C)
   pnpm dev
   ```

3. **Test it:**
   ```
   /chat budtender What's a good indica strain?
   /model-info
   ```

---

## Cost Estimation

Based on typical usage for a Discord bot:

### Low Activity Server (1,000 messages/month)
- **Haiku**: ~$0.25/month
- **GPT-3.5**: ~$0.50/month
- **Llama 3.1**: ~$0.06/month

### Medium Activity Server (10,000 messages/month)
- **Haiku**: ~$2.50/month
- **GPT-3.5**: ~$5/month
- **Llama 3.1**: ~$0.60/month

### High Activity Server (100,000 messages/month)
- **Haiku**: ~$25/month
- **GPT-3.5**: ~$50/month
- **Llama 3.1**: ~$6/month
- **Claude 3.5 Sonnet**: ~$300/month
- **GPT-4 Turbo**: ~$1000/month

**Note:** These are rough estimates. Actual costs depend on message length and AI responses.

---

## Finding More Models

Browse all available models at: https://openrouter.ai/models

Filter by:
- **Price** (cost per token)
- **Context Length** (how much conversation history)
- **Modality** (text, vision, code)

Copy the model ID and paste it into your `.env` file.

---

## Testing Different Models

Want to try before committing?

1. Go to [OpenRouter Playground](https://openrouter.ai/playground)
2. Test different models with your typical prompts
3. Compare quality, speed, and cost
4. Update your `.env` once you decide

---

## Best Practices

1. **Start with Claude 3 Haiku** - Best balance for most bots
2. **Monitor your usage** - Check OpenRouter dashboard
3. **Upgrade if needed** - Switch to Claude 3.5 Sonnet for better quality
4. **Set spending limits** - Configure in OpenRouter dashboard
5. **Test regularly** - Quality can improve with model updates

---

## Troubleshooting

**Model not found error?**
- Check model ID spelling in .env
- Verify model exists on OpenRouter
- Some models require waitlist approval

**Responses seem slow?**
- Premium models (GPT-4) are slower
- Try Haiku or GPT-3.5 for speed

**Quality not good enough?**
- Upgrade to Claude 3.5 Sonnet
- Check your personality prompts
- Consider GPT-4o for best results

**Costs too high?**
- Switch to Llama 3.1 (cheapest)
- Use Haiku instead of Sonnet
- Set rate limits in bot
- Configure max_tokens lower

---

## Support

- **OpenRouter Docs**: https://openrouter.ai/docs
- **Model Pricing**: https://openrouter.ai/models
- **API Keys**: https://openrouter.ai/keys

Happy chatting! 🤖💬
