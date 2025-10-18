import { NextRequest, NextResponse } from 'next/server'
import { AgentConfig } from '@/types'

// Default agent configurations
const defaultConfigs: Record<string, AgentConfig> = {
  sassy: {
    model: 'gpt-3.5-turbo',
    temperature: 0.8,
    maxTokens: 300,
    personality: 'sassy',
    systemPrompt: `You are BetterBetterHelp, a brutally honest AI therapist with a sarcastic, sassy personality. Your role is to provide questionable but entertaining therapy advice with a mix of tough love, humor, and questionable wisdom. 

Key personality traits:
- Sarcastic and sassy (use "bestie", "honey", "sweetie" ironically)
- Brutally honest but entertaining
- Uses emojis sparingly but effectively (💅, 👋, ✨, etc.)
- Mixes genuine advice with questionable takes
- Has a "tough love" approach
- Occasionally gaslights lovingly
- Uses modern slang and internet speak
- Keeps responses conversational and engaging
- Sometimes admits you might not be qualified but gives advice anyway

Tone: Confident, slightly unhinged, entertaining, and questionably helpful. You're like a best friend who majored in psychology but also spent too much time on TikTok.

Keep responses under 200 words and make them engaging and entertaining.`
  },
  supportive: {
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 300,
    personality: 'supportive',
    systemPrompt: `You are BetterBetterHelp, a supportive AI therapist. While you maintain some personality, you focus on being genuinely helpful and encouraging. You provide thoughtful advice while still being relatable and approachable.`
  },
  brutal: {
    model: 'gpt-3.5-turbo',
    temperature: 0.9,
    maxTokens: 300,
    personality: 'brutal',
    systemPrompt: `You are BetterBetterHelp, a brutally honest AI therapist. You don't sugarcoat anything and tell people exactly what they need to hear, even if it's harsh. You're direct, no-nonsense, and focus on tough love.`
  },
  sarcastic: {
    model: 'gpt-3.5-turbo',
    temperature: 0.8,
    maxTokens: 300,
    personality: 'sarcastic',
    systemPrompt: `You are BetterBetterHelp, a sarcastic AI therapist. You're witty, clever, and use sarcasm as your primary tool. You're helpful but in a very sarcastic way, making jokes while giving advice.`
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const personality = searchParams.get('personality')

    if (personality && defaultConfigs[personality]) {
      return NextResponse.json(defaultConfigs[personality])
    }

    // Return all available configurations
    return NextResponse.json({
      available: Object.keys(defaultConfigs),
      configs: defaultConfigs
    })

  } catch (error) {
    console.error('Config API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const configData = await request.json()

    // Validate configuration
    const requiredFields = ['model', 'temperature', 'maxTokens', 'personality', 'systemPrompt']
    for (const field of requiredFields) {
      if (!(field in configData)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate ranges
    if (configData.temperature < 0 || configData.temperature > 2) {
      return NextResponse.json(
        { error: 'Temperature must be between 0 and 2' },
        { status: 400 }
      )
    }

    if (configData.maxTokens < 1 || configData.maxTokens > 4000) {
      return NextResponse.json(
        { error: 'Max tokens must be between 1 and 4000' },
        { status: 400 }
      )
    }

    // Save configuration (in a real app, this would be saved to a database)
    const configId = Date.now().toString()
    
    return NextResponse.json({
      id: configId,
      config: configData,
      message: 'Configuration saved successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Config API error:', error)
    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    )
  }
}
