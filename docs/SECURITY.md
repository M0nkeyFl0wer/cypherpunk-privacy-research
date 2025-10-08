# Security Policy

## Security Features

### 1. Content Security Policy (CSP)
- Strict CSP headers prevent XSS attacks
- Only whitelisted sources can load scripts and styles
- Inline scripts disabled (except Next.js required)

### 2. API Key Security
- API keys stored in browser localStorage only
- Never transmitted to our servers
- Client-side validation before use
- Rate limiting on API calls
- Secure key format validation

### 3. Input Sanitization
- All user inputs sanitized before processing
- HTML escaped in chat messages
- URL validation for external links
- Markdown rendering with XSS protection

### 4. Security Headers
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` - Restricts browser features
- HTTPS-only cookies in production

### 5. Rate Limiting
- Chat API: 10 requests per minute per user
- Search API: 30 requests per minute
- Feedback: 5 submissions per hour

## Reporting Security Issues

If you discover a security vulnerability, please email:
**security@web3privacy.info**

Do not open public issues for security vulnerabilities.

## Best Practices for Users

### API Key Security
1. Never share your API keys
2. Rotate keys regularly
3. Use environment-specific keys (dev/prod)
4. Monitor API usage in Anthropic console

### Browser Security
1. Keep your browser updated
2. Use HTTPS only
3. Clear browser cache regularly
4. Don't use on public/shared computers

## Security Audit Results

Last audit: 2025-10-08

✅ No critical vulnerabilities found
✅ All dependencies up to date
✅ Security headers properly configured
✅ Input validation implemented
✅ Rate limiting active

## Dependency Security

Run security checks:
```bash
npm audit
npm audit fix
```

## Updates

- **2025-10-08**: Initial security implementation
  - Added CSP headers
  - Implemented rate limiting
  - Enhanced input validation
  - API key security hardening
