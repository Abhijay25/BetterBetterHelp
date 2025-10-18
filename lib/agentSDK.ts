import { AgentSDK, AgentResponse, AgentConfig, ChatSession } from '@/types'

/**
 * Agent SDK Integration Framework
 * 
 * This is a placeholder implementation that you can replace with your actual agent SDK.
 * The interface is designed to be flexible and work with various LLM providers.
 */
export class BetterBetterHelpAgentSDK implements AgentSDK {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl: string = '/api', apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  /**
   * Send a message to the agent and get a response
   */
  async sendMessage(message: string, config?: Partial<AgentConfig>, conversationHistory?: Array<{role: string, content: string, timestamp?: string}>): Promise<AgentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        body: JSON.stringify({
          message,
          config,
          conversationHistory
        })
      })

      if (!response.ok) {
        throw new Error(`Agent API error: ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        content: data.response,
        metadata: data.metadata || {
          model: config?.model || 'gpt-3.5-turbo',
          tokens: 0,
          processingTime: 0
        }
      }
    } catch (error) {
      console.error('Agent SDK error:', error)
      throw new Error(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Create a new chat session
   */
  async createSession(): Promise<ChatSession> {
    try {
      const response = await fetch(`${this.baseUrl}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        body: JSON.stringify({
          title: 'New Chat',
          messages: []
        })
      })

      if (!response.ok) {
        throw new Error(`Sessions API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Agent SDK error:', error)
      throw new Error(`Failed to create session: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get a chat session by ID
   */
  async getSession(id: string): Promise<ChatSession> {
    try {
      const response = await fetch(`${this.baseUrl}/sessions?id=${id}`, {
        headers: {
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        }
      })

      if (!response.ok) {
        throw new Error(`Sessions API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Agent SDK error:', error)
      throw new Error(`Failed to get session: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Update a chat session
   */
  async updateSession(session: ChatSession): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/sessions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        body: JSON.stringify(session)
      })

      if (!response.ok) {
        throw new Error(`Sessions API error: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Agent SDK error:', error)
      throw new Error(`Failed to update session: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Delete a chat session
   */
  async deleteSession(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/sessions?id=${id}`, {
        method: 'DELETE',
        headers: {
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        }
      })

      if (!response.ok) {
        throw new Error(`Sessions API error: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Agent SDK error:', error)
      throw new Error(`Failed to delete session: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get agent configuration
   */
  async getConfig(personality?: string): Promise<AgentConfig> {
    try {
      const url = personality 
        ? `${this.baseUrl}/config?personality=${personality}`
        : `${this.baseUrl}/config`
      
      const response = await fetch(url, {
        headers: {
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        }
      })

      if (!response.ok) {
        throw new Error(`Config API error: ${response.statusText}`)
      }

      const data = await response.json()
      return personality ? data : data.configs.sassy // Default to sassy if no personality specified
    } catch (error) {
      console.error('Agent SDK error:', error)
      throw new Error(`Failed to get config: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Update agent configuration
   */
  async updateConfig(config: AgentConfig): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        body: JSON.stringify(config)
      })

      if (!response.ok) {
        throw new Error(`Config API error: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Agent SDK error:', error)
      throw new Error(`Failed to update config: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

// Export a default instance
export const agentSDK = new BetterBetterHelpAgentSDK()

// Export factory function for custom configurations
export const createAgentSDK = (baseUrl?: string, apiKey?: string) => {
  return new BetterBetterHelpAgentSDK(baseUrl, apiKey)
}
