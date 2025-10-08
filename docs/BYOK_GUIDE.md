# Bring Your Own Keys (BYOK) Guide

## 🔑 Overview

The Web3Privacy AI Chat supports **two AI providers**:

1. **Ollama** (Default) - Self-hosted, free, private
2. **Anthropic Claude** - Bring your own API key

This gives you flexibility to choose based on your needs:
- Use Ollama for free, private, self-hosted AI
- Use Claude for maximum quality with your own API key

---

## 🎯 Why Bring Your Own Key?

### Benefits:
- ✅ **Maximum Quality**: Claude 3.5 Sonnet (latest model)
- ✅ **Guaranteed Availability**: No reliance on self-hosted infrastructure
- ✅ **Privacy**: Your key, your data - requests go directly to Anthropic
- ✅ **Control**: You manage your own usage and costs

### When to Use BYOK:
- You need the highest quality AI responses
- You want guaranteed availability
- You already have an Anthropic account
- You're doing research that benefits from Claude's capabilities
- Ollama server is unavailable or slow

---

## 🚀 Quick Setup

### Step 1: Get an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com/settings/keys)
2. Sign up or log in
3. Create a new API key
4. Copy the key (starts with `sk-ant-`)

**Pricing**: Claude API is pay-as-you-go
- ~$3 per million input tokens
- ~$15 per million output tokens
- Typical chat: ~$0.001 per message

### Step 2: Configure in Chat Interface

1. Open the Web3Privacy AI Chat
2. Click the **Settings** button in the top-right
3. Select **Anthropic Claude** as your provider
4. Paste your API key
5. Click **Save Settings**

### Step 3: Start Chatting

Your API key is saved in browser localStorage and used for all subsequent chats!

---

## 🔒 Security & Privacy

### How Your Key is Stored:
- ✅ **Browser localStorage only** (never sent to our servers)
- ✅ **Client-side encryption** (stored locally on your device)
- ✅ **Direct API calls** (your browser → Anthropic, no intermediary)
- ✅ **No logging** (we never see your key or requests)

### Best Practices:
1. **Never share your API key** with anyone
2. **Set spending limits** in Anthropic console
3. **Rotate keys regularly** (every 90 days recommended)
4. **Use browser profiles** to isolate keys per device
5. **Clear browser data** when done if using shared computer

### To Clear Your Key:
1. Open Settings
2. Click the "X" button next to the API key field
3. Or clear browser localStorage: `localStorage.removeItem('anthropic_api_key')`

---

## 📊 Provider Comparison

| Feature | Ollama (Default) | Anthropic BYOK |
|---------|------------------|----------------|
| **Cost** | Free | Pay per use (~$0.001/msg) |
| **Privacy** | Self-hosted | Direct to Anthropic |
| **Setup** | Server required | Just API key |
| **Quality** | Very Good | Excellent |
| **Speed** | 1-2s | 1-3s |
| **Model** | Llama 3.1 8B | Claude 3.5 Sonnet |
| **Availability** | Depends on server | 99.9% uptime |
| **Best For** | Regular use | Research, quality |

---

## 🎛️ Switching Between Providers

You can easily switch between Ollama and Anthropic:

### Option 1: Via Settings UI
1. Click **Settings** button
2. Select provider
3. Enter API key if using Anthropic
4. Save

### Option 2: Via Browser Console
```javascript
// Switch to Ollama
localStorage.setItem('ai_provider', 'ollama');

// Switch to Anthropic (with key)
localStorage.setItem('ai_provider', 'anthropic');
localStorage.setItem('anthropic_api_key', 'sk-ant-...');

// Then refresh the page
location.reload();
```

---

## 🧪 Testing Your Setup

### Test Anthropic Connection:
```javascript
// Open browser console on chat page
const testKey = 'sk-ant-...'; // Your key

fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': testKey,
    'anthropic-version': '2023-06-01',
  },
  body: JSON.stringify({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 100,
    messages: [{ role: 'user', content: 'Hello' }]
  })
})
.then(r => r.json())
.then(d => console.log('✅ Key works!', d))
.catch(e => console.error('❌ Key failed:', e));
```

### Expected Response:
```json
{
  "id": "msg_...",
  "type": "message",
  "role": "assistant",
  "content": [{ "type": "text", "text": "Hello! How can I help?" }],
  "model": "claude-3-5-sonnet-20241022"
}
```

---

## 💡 Advanced: Environment Variables

For development/testing, you can set a default API key:

**Create `.env.local`:**
```bash
# Optional: Set a default Anthropic key for testing
NEXT_PUBLIC_DEFAULT_ANTHROPIC_KEY=sk-ant-...

# This won't override user-provided keys
```

**Note**: User-provided keys always take precedence over env vars!

---

## 🔧 Troubleshooting

### "Invalid API key" Error:
- ✅ Check key starts with `sk-ant-`
- ✅ Verify key is active in Anthropic console
- ✅ Check for extra spaces when copying
- ✅ Ensure you have credits available

### "API key required" Error:
- ✅ Make sure you saved the key in Settings
- ✅ Try switching to Ollama and back to Anthropic
- ✅ Check browser console for localStorage errors

### Requests Failing:
- ✅ Check network tab in browser DevTools
- ✅ Verify CORS isn't blocking requests
- ✅ Try opening in incognito mode
- ✅ Check Anthropic API status

### Key Not Saving:
- ✅ Enable localStorage in browser settings
- ✅ Disable privacy extensions temporarily
- ✅ Check browser console for errors
- ✅ Try a different browser

---

## 📝 API Key Management Best Practices

### 1. Use Project Keys (Not User Keys)
Create project-specific keys in Anthropic console for better organization

### 2. Set Spending Limits
Configure monthly spending limits to avoid surprises:
- Settings → Billing → Set monthly limit

### 3. Monitor Usage
Track your API usage in Anthropic console:
- Dashboard → Usage → View detailed logs

### 4. Rotate Keys Regularly
- Create new key every 90 days
- Delete old keys after rotation
- Update in chat settings

### 5. Use Different Keys Per Device
- Desktop: One key
- Laptop: Another key
- Mobile: Third key
This helps track usage per device!

---

## 🎓 Example Use Cases

### Research Mode (BYOK):
```
User: "Analyze the cryptographic security of Aztec's zk-SNARKs implementation"

Claude (via BYOK):
- Provides deep technical analysis
- Cites specific cryptographic primitives
- Compares to other implementations
- Suggests improvements
```

### Casual Browsing (Ollama):
```
User: "What privacy projects are good for DeFi?"

Ollama:
- Quick recommendations
- Project overview
- Basic comparison
- Fast responses
```

---

## 🚦 Rate Limits

### Anthropic API Limits:
- **Tier 1**: 5 requests/minute, 25,000 tokens/day
- **Tier 2**: 50 requests/minute, 250,000 tokens/day
- **Tier 3**: 200 requests/minute, 1M tokens/day

Upgrade tiers by using the API more!

### Ollama Limits:
- No rate limits (self-hosted)
- Only limited by server resources

---

## 📞 Support

### Need Help?
- 📧 Email: support@web3privacy.info
- 💬 GitHub Issues: [github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research](https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research/issues)
- 🌐 Discord: [Link to Discord if available]

### Anthropic Support:
- 📚 API Docs: [docs.anthropic.com](https://docs.anthropic.com)
- 💬 Support: [support.anthropic.com](https://support.anthropic.com)

---

**Bottom Line**: BYOK gives you flexibility! Use Ollama for everyday browsing, switch to Claude when you need maximum quality for research. Your choice, your control! 🚀
