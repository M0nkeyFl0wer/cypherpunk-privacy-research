# AI / LLM Integration

## Overview

This module provides secure AI search capabilities using Ollama running on seshat via SSH tunnel.

## Architecture

```
Browser → secureOllamaClient.ts → localhost:11434 → SSH Tunnel → seshat:11434 → Ollama
                  ↓
        seshatRestrictions.ts
         (security layer)
```

## Setup

### 1. Start the SSH Tunnel

```bash
# From project root
./scripts/start-ollama-tunnel.sh
```

This forwards `localhost:11434` to seshat's Ollama instance.

### 2. Environment Variables (optional)

Create `.env.local`:
```env
NEXT_PUBLIC_OLLAMA_URL=http://localhost:11434/api/generate
NEXT_PUBLIC_OLLAMA_MODEL=qwen3:8b
```

### Available Models on Seshat

| Model | Size | Speed | Best For |
|-------|------|-------|----------|
| qwen3:8b | 8B | Fast | General queries (default) |
| llama3.3:latest | 70B | Slow | Complex analysis |
| deepseek-r1:8b | 8B | Medium | Reasoning tasks |
| gemma3:12b | 12B | Medium | Balanced quality |

## Security Features

### Rate Limiting
- 20 requests per minute per user
- Browser fingerprinting for user identification
- Configurable in `lib/security/rateLimit.ts`

### Input Validation (seshatRestrictions.ts)

**Blocked Patterns:**
- Command injection: `;`, `|`, `&`, backticks, `$()`
- File paths: `..`, `/etc/`, `/home/`, `/root/`
- Shell commands: `rm`, `mv`, `sudo`, `wget`, `curl`, `ssh`, etc.
- Script execution: `bash`, `python`, `node`, `perl`
- Network tools: `nc`, `netcat`, `nmap`, `telnet`

**Query Limits:**
- Max 1000 characters
- Sanitized for control characters
- Backslashes removed

### Security Logging
- All blocked queries logged to localStorage
- Rate limit violations tracked
- Accessible via `getSecurityLog()`

## Usage

```typescript
import { secureOllamaChat } from '@/lib/ai/secureOllamaClient';

// Basic query
const response = await secureOllamaChat([
  { role: 'user', content: 'Which projects use zk-SNARKs?' }
]);

// With streaming
await secureOllamaChat(
  [{ role: 'user', content: 'Compare privacy protocols' }],
  (chunk) => console.log(chunk)
);
```

## What It Can Do

1. **Search Questions**: "Which projects use Rust?"
2. **Comparisons**: "Compare Tornado Cash and Semaphore"
3. **Explanations**: "What is a zk-SNARK?"
4. **Filtering**: "Show me OSINT deep dive projects"

## What It Cannot Do

1. Execute commands on the server
2. Access file system
3. Make network requests
4. Run arbitrary code
5. Process queries > 1000 chars
6. Exceed 20 requests/minute

## Files

| File | Purpose |
|------|---------|
| `ollamaClient.ts` | Basic Ollama API client |
| `secureOllamaClient.ts` | Security-wrapped client |
| `aiProvider.ts` | Provider abstraction |
| `queryProcessor.ts` | Query parsing utilities |
| `anthropicClient.ts` | Anthropic fallback (requires key) |

## Testing Connection

```typescript
import { testSeshatConnection } from '@/lib/ai/secureOllamaClient';

const isConnected = await testSeshatConnection();
console.log('Seshat connected:', isConnected);
```
