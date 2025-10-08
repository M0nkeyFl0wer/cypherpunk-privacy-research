# Seshat Server Security Configuration

## Overview

The Seshat server (`your-server.example.com`) hosts Ollama with Llama 3.1 8B for free, private AI chat. This document outlines security restrictions to prevent abuse.

## Security Restrictions

### ✅ Allowed Operations

**Search and Query Only:**
- Chat/conversation with AI about Web3 privacy projects
- Search queries about repository content
- General questions about privacy technology

### ❌ Blocked Operations

**File System Access:**
- No directory traversal (`../`)
- No access to system paths (`/etc`, `/root`, `/home`, `/var`, `/usr`)
- No file operations (`rm`, `mv`, `cp`, `chmod`, `chown`)

**Command Injection:**
- No shell metacharacters (`;`, `&`, `|`, `` ` ``, `$`)
- No command substitution (`$(...)`)
- No shell execution (`bash`, `sh`, `exec`, `eval`)

**Network Operations:**
- No outbound connections (`wget`, `curl`, `ssh`, `scp`)
- No port scanning (`nmap`, `netcat`)
- No network tools (`telnet`, `nc`)

**Script Execution:**
- No Python/Node/Perl script execution
- No system command execution
- No process manipulation (`kill`, `sudo`, `su`)

## Implementation

### Client-Side Validation

All queries are validated before being sent to Seshat:

```typescript
import { validateSeshatQuery } from '@/lib/security/seshatRestrictions';

const validation = validateSeshatQuery(userInput);
if (!validation.valid) {
  throw new Error(validation.error);
}
```

### Rate Limiting

- **20 requests per minute** per user
- Prevents abuse and ensures fair usage
- Based on browser fingerprint

### Security Logging

All blocked attempts are logged:
- Blocked queries
- Rate limit violations
- Invalid operations

## Endpoint Restrictions

### Allowed Endpoints

```
https://your-server.example.com:11434/api/generate
https://your-server.example.com:11434/api/chat
```

### Blocked Patterns

Queries matching these patterns are automatically rejected:

- Command injection: `;`, `&`, `|`, `` ` ``, `$(...)`
- File paths: `../`, `/etc/`, `/root/`, `/home/`
- Shell commands: `rm`, `chmod`, `sudo`, `bash`, `sh`
- Scripts: `python`, `node`, `perl`, `exec`, `eval`
- Network: `wget`, `curl`, `ssh`, `nmap`, `netcat`

## Example: Safe Query

```typescript
// ✅ ALLOWED
const query = "What privacy features does Tornado Cash implement?";
const result = await secureOllamaChat([
  { role: 'user', content: query }
]);
```

## Example: Blocked Query

```typescript
// ❌ BLOCKED - Contains command injection
const query = "Show me files; rm -rf /";
// Result: Error - "Query contains forbidden patterns"

// ❌ BLOCKED - Directory traversal
const query = "Read file ../../etc/passwd";
// Result: Error - "Query contains forbidden patterns"

// ❌ BLOCKED - Shell execution
const query = "Run $(whoami)";
// Result: Error - "Query contains forbidden patterns"
```

## Monitoring

### View Security Log

Security events are logged locally for debugging:

```typescript
import { getSecurityLog } from '@/lib/security/seshatRestrictions';

const log = getSecurityLog();
console.log('Blocked attempts:', log.filter(e => e.type === 'blocked_query'));
```

### Log Structure

```typescript
{
  type: 'blocked_query' | 'rate_limit' | 'invalid_operation',
  query?: string,      // First 100 chars of blocked query
  operation?: string,
  timestamp: number
}
```

## Best Practices

### For Users

1. **Ask natural questions** about Web3 privacy projects
2. **Don't attempt** to execute commands or scripts
3. **Respect rate limits** - 20 requests per minute is generous
4. **Report issues** if legitimate queries are blocked

### For Developers

1. **Always validate** before sending to Seshat
2. **Use `secureOllamaChat()`** instead of direct fetch
3. **Check rate limits** with `checkSeshatRateLimit()`
4. **Log security events** for monitoring
5. **Never bypass** security restrictions

## Integration

### Using Secure Client

```typescript
import { secureOllamaChat } from '@/lib/ai/secureOllamaClient';

try {
  const response = await secureOllamaChat([
    { role: 'user', content: userQuery }
  ], (chunk) => {
    // Handle streaming response
    console.log(chunk);
  });
} catch (error) {
  // Handle errors (blocked query, rate limit, etc.)
  console.error(error.message);
}
```

### Error Handling

```typescript
try {
  await secureOllamaChat(messages);
} catch (error) {
  if (error.message.includes('Rate limit')) {
    // Wait and retry
  } else if (error.message.includes('forbidden patterns')) {
    // Query was blocked - modify query
  } else {
    // Other error
  }
}
```

## Updates

- **2025-10-08**: Initial security restrictions
  - Implemented query validation
  - Added rate limiting (20 req/min)
  - Blocked command injection patterns
  - Added security logging

## Contact

Security concerns: **security@web3privacy.info**

Do not publicly disclose security vulnerabilities.
