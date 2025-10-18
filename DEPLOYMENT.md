# 🚀 CI/CD Deployment Guide for BetterBetterHelp

## Overview
This project uses GitHub Actions for CI/CD and Vercel for hosting with automated deployments.

## 🏗️ Architecture

```
GitHub Repository
    ↓ (push to main)
GitHub Actions CI/CD
    ↓ (build & test)
Vercel Deployment
    ↓ (production)
Live Application
```

## 📋 Prerequisites

### 1. GitHub Repository Setup
- [ ] Repository is public or has GitHub Actions enabled
- [ ] Main branch is protected (recommended)
- [ ] Branch protection rules configured

### 2. Vercel Account Setup
- [ ] Vercel account created
- [ ] Project connected to GitHub repository
- [ ] Environment variables configured

### 3. Required Secrets
Add these secrets to your GitHub repository:

#### GitHub Secrets (Settings → Secrets and variables → Actions)
```
VERCEL_TOKEN=your_vercel_token_here
```

#### Vercel Environment Variables (Project Settings → Environment Variables)
```
OPENAI_API_KEY=sk-your-production-api-key-here
NODE_ENV=production
```

## 🔧 Setup Instructions

### Step 1: Get Vercel Token
1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Create a new token
3. Copy the token value

### Step 2: Add GitHub Secrets
1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add `VERCEL_TOKEN` with your Vercel token

### Step 3: Configure Vercel Environment Variables
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

```bash
# Production Environment Variables
OPENAI_API_KEY=sk-your-production-api-key-here
NODE_ENV=production
```

### Step 4: Connect Repository to Vercel
1. In Vercel dashboard, click "Add New Project"
2. Import your GitHub repository
3. Configure build settings:
   - Framework Preset: Next.js
   - Root Directory: `./` (or leave default)
   - Build Command: `npm run build`
   - Output Directory: `.next`

## 🚀 Deployment Workflow

### Automatic Deployments
- **Main Branch**: Deploys to production automatically
- **Pull Requests**: Creates preview deployments
- **Other Branches**: No automatic deployment

### Manual Deployments
```bash
# Deploy to production
npm run deploy

# Deploy preview
npm run deploy:preview
```

## 🔍 CI/CD Pipeline Stages

### 1. Lint & Type Check
- ESLint validation
- TypeScript type checking
- Code quality checks

### 2. Build & Test
- Dependency installation
- Application build
- Build artifact validation

### 3. Security Check
- Security audit (`npm audit`)
- Secret scanning
- Environment file validation

### 4. Deploy
- **Production**: Deploys to main domain
- **Preview**: Deploys to preview URL

## 📊 Monitoring & Logs

### GitHub Actions
- View workflow runs in Actions tab
- Check logs for each step
- Monitor deployment status

### Vercel Dashboard
- View deployment history
- Monitor performance metrics
- Check function logs

## 🔒 Security Considerations

### Environment Variables
- ✅ Production API keys stored in Vercel
- ✅ Development keys in local `.env.local`
- ✅ No secrets in code repository

### Deployment Security
- ✅ Automated security checks
- ✅ Secret scanning in CI/CD
- ✅ Environment validation

## 🛠️ Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check build locally
npm run build

# Check for TypeScript errors
npm run type-check
```

#### 2. Environment Variable Issues
- Verify variables are set in Vercel
- Check variable names match exactly
- Ensure production API key is valid

#### 3. Deployment Failures
- Check GitHub Actions logs
- Verify Vercel token is valid
- Ensure repository permissions

### Debug Commands
```bash
# Test build locally
npm run test:ci

# Check environment variables
npm run dev

# Verify Vercel connection
vercel whoami
```

## 📈 Performance Optimization

### Vercel Configuration
- Edge functions for API routes
- Automatic image optimization
- CDN distribution

### Build Optimization
- Tree shaking enabled
- Code splitting
- Bundle analysis

## 🔄 Rollback Strategy

### Automatic Rollback
- Vercel automatically rolls back on deployment failure
- Previous successful deployment remains active

### Manual Rollback
1. Go to Vercel dashboard
2. Navigate to Deployments
3. Click "Promote to Production" on previous deployment

## 📝 Best Practices

1. **Always test locally** before pushing
2. **Use feature branches** for development
3. **Review pull requests** before merging
4. **Monitor deployments** after going live
5. **Keep dependencies updated**
6. **Use semantic versioning**

## 🆘 Support

- GitHub Actions: [Documentation](https://docs.github.com/en/actions)
- Vercel: [Documentation](https://vercel.com/docs)
- Next.js: [Documentation](https://nextjs.org/docs)
