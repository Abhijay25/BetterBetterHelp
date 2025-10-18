# Vercel Environment Configuration

## Production Environment Variables
Set these in Vercel Dashboard → Project Settings → Environment Variables

```bash
# Required for production
OPENAI_API_KEY=sk-your-production-api-key-here
NODE_ENV=production

# Optional
PORT=3000
```

## Preview Environment Variables
For pull request previews, use the same variables as production.

## Development Environment Variables
Keep these in your local `.env.local` file:

```bash
# Development only
OPENAI_API_KEY=sk-your-development-api-key-here
NODE_ENV=development
PORT=3000
```

## Environment Variable Security
- ✅ Production keys stored in Vercel (secure)
- ✅ Development keys in local `.env.local` (gitignored)
- ✅ No secrets committed to repository
- ✅ Automatic validation on deployment
