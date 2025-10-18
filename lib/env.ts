// lib/env.ts - Environment variable validation and security
import { z } from 'zod'

// Define environment schema with validation
const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required').optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  // Add other environment variables as needed
})

// Validate environment variables
function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env)
    
    // Only validate API key if we're not in build mode
    if (process.env.NODE_ENV !== 'production' || process.env.NEXT_PHASE !== 'phase-production-build') {
      if (!parsed.OPENAI_API_KEY) {
        console.warn('⚠️  OPENAI_API_KEY is not set - API calls will fail')
      }
    }
    
    return parsed
  } catch (error) {
    // During build time, be more lenient with environment validation
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn('⚠️  Environment validation warning during build:', error)
      return {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        NODE_ENV: process.env.NODE_ENV || 'development',
        PORT: process.env.PORT || '3000'
      }
    }
    console.error('❌ Invalid environment variables:', error)
    throw new Error('Environment validation failed')
  }
}

// Export validated environment variables
export const env = validateEnv()

// Security helper functions
export const security = {
  // Mask API key for logging (only show first 8 and last 4 characters)
  maskApiKey: (apiKey?: string): string => {
    if (!apiKey || apiKey.length < 12) return '***'
    return `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`
  },

  // Validate OpenAI API key format
  isValidOpenAIKey: (apiKey?: string): boolean => {
    if (!apiKey) return false
    return /^sk-[a-zA-Z0-9_-]{20,}$/.test(apiKey)
  },

  // Check if running in production
  isProduction: (): boolean => {
    return env.NODE_ENV === 'production'
  },

  // Get safe environment info for debugging
  getSafeEnvInfo: () => ({
    NODE_ENV: env.NODE_ENV,
    PORT: env.PORT,
    OPENAI_API_KEY_PRESENT: !!env.OPENAI_API_KEY,
    OPENAI_API_KEY_MASKED: security.maskApiKey(env.OPENAI_API_KEY),
  })
}
