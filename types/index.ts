export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: Date
  metadata?: {
    model?: string
    tokens?: number
    processingTime?: number
  }
}

export interface ChatSession {
  id: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  title?: string
}

export interface AgentConfig {
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  personality: 'sassy' | 'supportive' | 'brutal' | 'sarcastic'
}

export interface AgentResponse {
  content: string
  metadata: {
    model: string
    tokens: number
    processingTime: number
  }
}

export interface ChatState {
  currentSession: ChatSession | null
  sessions: ChatSession[]
  isLoading: boolean
  error: string | null
  agentConfig: AgentConfig
  
  // Actions
  createNewSession: () => ChatSession
  setCurrentSession: (session: ChatSession) => void
  addMessage: (message: Message) => void
  updateMessage: (messageId: string, updates: Partial<Message>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateAgentConfig: (config: Partial<AgentConfig>) => void
  deleteSession: (sessionId: string) => void
  clearAllSessions: () => void
}

export interface AgentSDK {
  sendMessage: (message: string, config?: Partial<AgentConfig>) => Promise<AgentResponse>
  createSession: () => Promise<ChatSession>
  getSession: (id: string) => Promise<ChatSession>
  updateSession: (session: ChatSession) => Promise<void>
  deleteSession: (id: string) => Promise<void>
}
