# Ollama Integration - Self-Hosted AI Chat

## 🎯 Overview

Instead of using Anthropic API (costs money, requires credits), we use **Ollama running on Seshat server** for free, private, self-hosted AI chat.

### Benefits
- ✅ **Free**: No API costs or credit limits
- ✅ **Private**: Data stays on your server
- ✅ **Fast**: Local inference on powerful hardware
- ✅ **Ethical**: Aligns with Web3 privacy ethos
- ✅ **Flexible**: Can use any Ollama-compatible model

---

## 🖥️ Seshat Server Setup

### Step 1: Install Ollama on Seshat

SSH into Seshat:
```bash
ssh -p8888 your-username@your-server.example.com
```

Install Ollama:
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Verify installation
ollama --version

# Pull a good model for chat (mistral is recommended for balance of speed/quality)
ollama pull mistral

# Or use a larger model:
# ollama pull llama2:13b
# ollama pull mixtral
```

### Step 2: Configure Ollama API Server

Create systemd service for Ollama with CORS enabled:

```bash
# Create service file
sudo tee /etc/systemd/system/ollama-api.service > /dev/null <<'EOF'
[Unit]
Description=Ollama API Server with CORS
After=network.target

[Service]
Type=simple
User=your-username
Environment="OLLAMA_HOST=0.0.0.0:11434"
Environment="OLLAMA_ORIGINS=https://m0nkeyfl0wer.github.io"
ExecStart=/usr/local/bin/ollama serve
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable ollama-api
sudo systemctl start ollama-api

# Check status
sudo systemctl status ollama-api
```

### Step 3: Set Up Reverse Proxy (Nginx)

Create Nginx config for Ollama:

```bash
# Create nginx site config
sudo tee /etc/nginx/sites-available/ollama > /dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name ollama.noosworx.com;

    # CORS headers
    add_header Access-Control-Allow-Origin "https://m0nkeyfl0wer.github.io" always;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;

    # Handle preflight requests
    if ($request_method = OPTIONS) {
        add_header Access-Control-Allow-Origin "https://m0nkeyfl0wer.github.io";
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type, Authorization";
        add_header Content-Length 0;
        add_header Content-Type text/plain;
        return 204;
    }

    location /api/ {
        proxy_pass http://localhost:11434/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support (for streaming)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Timeouts for long responses
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    location / {
        return 200 "Ollama API Server\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/ollama /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4: Optional - Set Up SSL with Let's Encrypt

```bash
# Install certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d ollama.noosworx.com

# Certbot will auto-update nginx config with SSL
```

### Step 5: Test Ollama API

```bash
# Test locally on Seshat
curl http://localhost:11434/api/tags

# Test via public URL
curl https://ollama.noosworx.com/api/tags

# Test chat completion
curl -X POST https://ollama.noosworx.com/api/chat -d '{
  "model": "mistral",
  "messages": [
    {"role": "user", "content": "Hello, test message"}
  ],
  "stream": false
}'
```

Expected response:
```json
{
  "model": "mistral",
  "created_at": "2025-10-08T...",
  "message": {
    "role": "assistant",
    "content": "Hello! I'm working correctly. How can I help you today?"
  }
}
```

---

## 🌐 Frontend Configuration

### Update Environment Variables

Create `.env.local` for development:
```bash
# Ollama API endpoint
NEXT_PUBLIC_OLLAMA_URL=https://ollama.noosworx.com/api
NEXT_PUBLIC_OLLAMA_MODEL=mistral

# Fallback to Anthropic (optional)
NEXT_PUBLIC_USE_ANTHROPIC_FALLBACK=false
ANTHROPIC_API_KEY=sk-ant-xxx
```

### Update Chat API Client

File: `lib/ai/ollamaClient.ts`

```typescript
export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

const OLLAMA_URL = process.env.NEXT_PUBLIC_OLLAMA_URL || 'https://ollama.noosworx.com/api';
const OLLAMA_MODEL = process.env.NEXT_PUBLIC_OLLAMA_MODEL || 'mistral';

export async function chatWithOllama(
  messages: OllamaMessage[],
  onStream?: (chunk: string) => void
): Promise<string> {
  const response = await fetch(`${OLLAMA_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: !!onStream,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.statusText}`);
  }

  if (onStream) {
    // Handle streaming response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.message?.content) {
              fullResponse += json.message.content;
              onStream(json.message.content);
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }

    return fullResponse;
  } else {
    // Handle non-streaming response
    const data: OllamaResponse = await response.json();
    return data.message.content;
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch(`${OLLAMA_URL}/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama embeddings error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.embedding;
}
```

---

## 🔧 Chat Component Integration

Update `app/chat/page.tsx` to use Ollama:

```typescript
import { chatWithOllama } from '@/lib/ai/ollamaClient';
import { getAllProjectSummaries } from '@/lib/data/client-data';

// ...

const handleSendMessage = async (input: string) => {
  const userMessage: Message = {
    role: 'user',
    content: input,
    timestamp: new Date(),
  };

  setMessages(prev => [...prev, userMessage]);
  setIsProcessing(true);

  try {
    // Get project data for context
    const projects = await getAllProjectSummaries();

    // Build context for Ollama
    const projectContext = projects
      .slice(0, 20)
      .map(p => `${p.name}: ${p.category}, ${p.privacyTechniques.join(', ')}`)
      .join('\n');

    const systemPrompt = {
      role: 'system' as const,
      content: `You are an AI assistant helping users explore Web3 privacy projects.

Available Projects (sample):
${projectContext}

When users ask about privacy projects, search through the available data and provide relevant recommendations. Include project names, categories, and technologies.

Keep responses concise and focused on Web3 privacy solutions.`,
    };

    const userPrompt = {
      role: 'user' as const,
      content: input,
    };

    // Call Ollama
    let responseText = '';
    await chatWithOllama(
      [systemPrompt, userPrompt],
      (chunk) => {
        // Stream response
        responseText += chunk;
        setStreamingMessage(responseText);
      }
    );

    // Find relevant projects based on response
    const relevantProjects = projects.filter(p =>
      responseText.toLowerCase().includes(p.name.toLowerCase()) ||
      p.privacyTechniques.some(tech =>
        responseText.toLowerCase().includes(tech.toLowerCase())
      )
    );

    const assistantMessage: Message = {
      role: 'assistant',
      content: responseText,
      projects: relevantProjects.slice(0, 5),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
  } catch (error) {
    console.error('Chat error:', error);

    const errorMessage: Message = {
      role: 'assistant',
      content: 'Sorry, I encountered an error. Please try again or check if the Ollama server is running.',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsProcessing(false);
    setStreamingMessage('');
  }
};
```

---

## 🔐 Security Considerations

### Rate Limiting

Add to Nginx config:
```nginx
limit_req_zone $binary_remote_addr zone=ollama:10m rate=10r/m;

location /api/ {
    limit_req zone=ollama burst=5;
    # ... rest of config
}
```

### Authentication (Optional)

For production, consider adding API key authentication:

```nginx
location /api/ {
    if ($http_x_api_key != "your-secret-key") {
        return 401;
    }
    # ... rest of config
}
```

Then in frontend:
```typescript
headers: {
  'Content-Type': 'application/json',
  'X-API-Key': process.env.NEXT_PUBLIC_OLLAMA_API_KEY,
}
```

---

## 📊 Monitoring

### Check Ollama Status

```bash
# On Seshat
sudo systemctl status ollama-api

# Check logs
sudo journalctl -u ollama-api -f

# Monitor resource usage
htop  # Filter for 'ollama'

# Test API
curl https://ollama.noosworx.com/api/tags
```

### Performance Metrics

```bash
# Check model performance
ollama run mistral --verbose

# View loaded models
ollama list

# Check GPU usage (if available)
nvidia-smi
```

---

## 🚀 Testing

### Test Script

Save as `scripts/test-ollama.sh`:
```bash
#!/bin/bash

OLLAMA_URL="https://ollama.noosworx.com/api"

echo "🧪 Testing Ollama API..."

# Test 1: List models
echo ""
echo "1️⃣ Testing /api/tags..."
curl -s "$OLLAMA_URL/tags" | jq .

# Test 2: Simple chat
echo ""
echo "2️⃣ Testing /api/chat..."
curl -s -X POST "$OLLAMA_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mistral",
    "messages": [
      {"role": "user", "content": "What are Web3 privacy mixers?"}
    ],
    "stream": false
  }' | jq .

echo ""
echo "✅ Tests complete!"
```

---

## 🔄 Switching Between Ollama and Anthropic

Create `lib/ai/aiProvider.ts`:

```typescript
import { chatWithOllama } from './ollamaClient';
import { chatWithAnthropic } from './anthropicClient';

const USE_OLLAMA = process.env.NEXT_PUBLIC_USE_OLLAMA !== 'false';

export async function chat(
  messages: Array<{role: string; content: string}>,
  onStream?: (chunk: string) => void
): Promise<string> {
  if (USE_OLLAMA) {
    return chatWithOllama(messages, onStream);
  } else {
    return chatWithAnthropic(messages, onStream);
  }
}
```

Then in components:
```typescript
import { chat } from '@/lib/ai/aiProvider';

// Use unified interface
const response = await chat(messages);
```

---

## 📝 Recommended Models

### For Speed (< 2 sec response):
- `mistral` (7B) - Best balance
- `llama2` (7B) - Good quality
- `phi` (2.7B) - Very fast, lower quality

### For Quality (2-5 sec response):
- `mixtral` (8x7B) - Excellent quality
- `llama2:13b` (13B) - Better reasoning
- `codellama` (13B) - Better for technical queries

### Model Management:
```bash
# Pull a model
ollama pull mistral

# Remove unused models
ollama rm old-model

# List installed models
ollama list

# Check model size
du -sh ~/.ollama/models/
```

---

**Next Step**: Create the integration files? Let me know if you want me to implement the full Ollama chat client!
