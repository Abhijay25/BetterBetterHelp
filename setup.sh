#!/bin/bash

echo "🎉 Welcome to BetterBetterHelp Setup! 💅"
echo ""
echo "Let's get your questionable therapy app running..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully!"

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo ""
    echo "🔧 Creating environment file..."
    cp env.example .env.local
    echo "✅ Created .env.local file"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env.local and add your API keys!"
    echo "   - For OpenAI: https://platform.openai.com/api-keys"
    echo "   - For Anthropic: https://console.anthropic.com/"
    echo "   - For Cohere: https://dashboard.cohere.ai/"
else
    echo "✅ Environment file already exists"
fi

# Type check
echo ""
echo "🔍 Running type check..."
npm run type-check

if [ $? -ne 0 ]; then
    echo "⚠️  Type check failed, but continuing..."
fi

echo ""
echo "🚀 Setup complete! To start the app:"
echo "   1. Add your API keys to .env.local (optional for demo)"
echo "   2. Run: npm run dev"
echo "   3. Open: http://localhost:3000"
echo ""
echo "Ready to get some questionable advice, bestie! 💅✨"
