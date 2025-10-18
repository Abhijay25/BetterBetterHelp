# Security Configuration for BetterBetterHelp

## Environment Variables Security

### Required Environment Variables
```bash
# .env.local (DO NOT COMMIT TO GIT)
OPENAI_API_KEY=sk-your-actual-api-key-here
NODE_ENV=development
PORT=3000
```

### Security Best Practices

1. **Never commit .env.local to git** ✅ (Already in .gitignore)
2. **Use strong API keys** ✅ (Validated format)
3. **Rotate keys regularly** ⚠️ (Manual process)
4. **Monitor usage** ✅ (Logging implemented)
5. **Rate limiting** ✅ (Basic implementation)

## API Security Features

### Input Validation
- ✅ Message length limits (2000 chars)
- ✅ Request size limits (10KB)
- ✅ Conversation history limits (20 messages)
- ✅ Type validation for all inputs

### API Key Security
- ✅ Format validation (sk-...)
- ✅ Masked logging (shows only first 8 + last 4 chars)
- ✅ Environment validation on startup

### Rate Limiting
- ✅ Basic IP tracking
- ✅ Request size limits
- ✅ Message length limits

## Production Security Checklist

### Before Deploying:
- [ ] Set NODE_ENV=production
- [ ] Use production OpenAI API key
- [ ] Enable HTTPS
- [ ] Set up proper rate limiting (Redis/memory store)
- [ ] Configure CORS properly
- [ ] Set up monitoring and alerting
- [ ] Enable request logging
- [ ] Set up API key rotation schedule

### Environment Variables for Production:
```bash
NODE_ENV=production
OPENAI_API_KEY=sk-your-production-key
PORT=3000
# Add production-specific variables
```

## Security Monitoring

The application now logs:
- Request IP addresses
- Message lengths
- Conversation history presence
- Environment status (masked)
- API key validation status

## Common Security Issues to Avoid

1. **Never log full API keys** ✅ (Masked)
2. **Never expose API keys in client-side code** ✅ (Server-side only)
3. **Validate all inputs** ✅ (Implemented)
4. **Limit request sizes** ✅ (Implemented)
5. **Monitor for abuse** ✅ (Basic logging)
