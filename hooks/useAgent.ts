import { useState, useEffect, useCallback } from 'react'
import { useChatStore } from '@/store/chatStore'
import { agentSDK } from '@/lib/agentSDK'
import { Message, AgentConfig } from '@/types'
import { generateId } from '@/lib/utils'

/**
 * Custom hook for managing agent interactions
 */
export function useAgent() {
  const {
    currentSession,
    addMessage,
    updateMessage,
    setLoading,
    setError,
    agentConfig
  } = useChatStore()

  const [isConnected, setIsConnected] = useState(false)

  // Test connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        await agentSDK.getConfig()
        setIsConnected(true)
      } catch (error) {
        console.error('Agent connection failed:', error)
        setIsConnected(false)
      }
    }

    testConnection()
  }, [])

  /**
   * Send a message to the agent
   */
  const sendMessage = useCallback(async (content: string, customConfig?: Partial<AgentConfig>) => {
    if (!currentSession) {
      throw new Error('No active session')
    }

    const userMessage: Message = {
      id: generateId(),
      content,
      role: 'user',
      timestamp: new Date()
    }

    addMessage(userMessage)
    setLoading(true)
    setError(null)

    try {
      const response = await agentSDK.sendMessage(content, {
        ...agentConfig,
        ...customConfig
      })

      const aiMessage: Message = {
        id: generateId(),
        content: response.content,
        role: 'assistant',
        timestamp: new Date(),
        metadata: response.metadata
      }

      addMessage(aiMessage)
    } catch (error) {
      console.error('Agent error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setError(errorMessage)

      const errorResponse: Message = {
        id: generateId(),
        content: "Oops! Looks like I'm having a moment. Try again, bestie! 💅",
        role: 'assistant',
        timestamp: new Date()
      }

      addMessage(errorResponse)
    } finally {
      setLoading(false)
    }
  }, [currentSession, addMessage, setLoading, setError, agentConfig])

  /**
   * Stream a message (for future implementation with streaming APIs)
   */
  const streamMessage = useCallback(async (content: string, customConfig?: Partial<AgentConfig>) => {
    if (!currentSession) {
      throw new Error('No active session')
    }

    const userMessage: Message = {
      id: generateId(),
      content,
      role: 'user',
      timestamp: new Date()
    }

    addMessage(userMessage)
    setLoading(true)
    setError(null)

    // Create a placeholder message for streaming
    const streamingMessageId = generateId()
    const streamingMessage: Message = {
      id: streamingMessageId,
      content: '',
      role: 'assistant',
      timestamp: new Date()
    }

    addMessage(streamingMessage)

    try {
      // For now, just simulate streaming with a regular response
      const response = await agentSDK.sendMessage(content, {
        ...agentConfig,
        ...customConfig
      })

      // Update the streaming message with the final content
      updateMessage(streamingMessageId, {
        content: response.content,
        metadata: response.metadata
      })
    } catch (error) {
      console.error('Agent streaming error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setError(errorMessage)

      updateMessage(streamingMessageId, {
        content: "Oops! Looks like I'm having a moment. Try again, bestie! 💅"
      })
    } finally {
      setLoading(false)
    }
  }, [currentSession, addMessage, updateMessage, setLoading, setError, agentConfig])

  /**
   * Update agent configuration
   */
  const updateConfig = useCallback(async (config: Partial<AgentConfig>) => {
    try {
      await agentSDK.updateConfig({
        ...agentConfig,
        ...config
      })
    } catch (error) {
      console.error('Config update error:', error)
      throw error
    }
  }, [agentConfig])

  /**
   * Get agent configuration
   */
  const getConfig = useCallback(async (personality?: string) => {
    try {
      return await agentSDK.getConfig(personality)
    } catch (error) {
      console.error('Config fetch error:', error)
      throw error
    }
  }, [])

  return {
    sendMessage,
    streamMessage,
    updateConfig,
    getConfig,
    isConnected,
    isLoading: useChatStore(state => state.isLoading),
    error: useChatStore(state => state.error)
  }
}

/**
 * Hook for managing chat sessions
 */
export function useChatSessions() {
  const {
    sessions,
    currentSession,
    createNewSession,
    setCurrentSession,
    deleteSession,
    clearAllSessions
  } = useChatStore()

  const [isLoading, setIsLoading] = useState(false)

  /**
   * Create a new chat session
   */
  const createSession = useCallback(async (title?: string) => {
    setIsLoading(true)
    try {
      const session = await agentSDK.createSession()
      if (title) {
        session.title = title
        await agentSDK.updateSession(session)
      }
      createNewSession()
      return session
    } catch (error) {
      console.error('Session creation error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [createNewSession])

  /**
   * Load a session
   */
  const loadSession = useCallback(async (sessionId: string) => {
    setIsLoading(true)
    try {
      const session = await agentSDK.getSession(sessionId)
      setCurrentSession(session)
      return session
    } catch (error) {
      console.error('Session load error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [setCurrentSession])

  /**
   * Save current session
   */
  const saveSession = useCallback(async () => {
    if (!currentSession) return

    try {
      await agentSDK.updateSession(currentSession)
    } catch (error) {
      console.error('Session save error:', error)
      throw error
    }
  }, [currentSession])

  /**
   * Delete a session
   */
  const removeSession = useCallback(async (sessionId: string) => {
    setIsLoading(true)
    try {
      await agentSDK.deleteSession(sessionId)
      deleteSession(sessionId)
    } catch (error) {
      console.error('Session deletion error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [deleteSession])

  return {
    sessions,
    currentSession,
    createSession,
    loadSession,
    saveSession,
    removeSession,
    clearAllSessions,
    isLoading
  }
}
