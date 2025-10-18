import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ChatState, Message, ChatSession, AgentConfig, VoiceOption } from '@/types'

const defaultAgentConfig: AgentConfig = {
  model: 'gpt-3.5-turbo',
  temperature: 0.8,
  maxTokens: 300,
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

Keep responses under 200 words and make them engaging and entertaining.`,
  personality: 'sassy'
}

const defaultVoice: VoiceOption = {
  id: "21m00Tcm4TlvDq8ikWAM",
  name: "Rachel",
  gender: "female",
  accent: "American",
  description: "Clear, professional American female voice"
}

const createNewSession = (): ChatSession => ({
  id: Date.now().toString(),
  messages: [
    {
      id: '1',
      content: "Hey bestie! 👋 Ready for some *questionable* life advice? I'm here to tell you what you probably don't want to hear, but definitely need to hear. What's got you spiraling today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  title: 'New Chat',
  selectedVoice: defaultVoice
})

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      sessions: [],
      isLoading: false,
      error: null,
      agentConfig: defaultAgentConfig,
      isTTSEnabled: false,
      selectedVoice: defaultVoice,
      ttsVolume: 0.7, // Default volume at 70%
      isDarkMode: true, // Default to dark mode

      // Actions
      createNewSession: () => {
        const newSession = createNewSession()
        set(state => ({
          sessions: [newSession, ...state.sessions],
          currentSession: newSession,
          error: null
        }))
        return newSession
      },

      updateSessionTitle: (sessionId: string, title: string) => {
        set(state => {
          const updatedSessions = state.sessions.map(session => 
            session.id === sessionId 
              ? { ...session, title, updatedAt: new Date() }
              : session
          )
          
          const updatedCurrentSession = state.currentSession?.id === sessionId
            ? { ...state.currentSession, title, updatedAt: new Date() }
            : state.currentSession

          return {
            sessions: updatedSessions,
            currentSession: updatedCurrentSession
          }
        })
      },

      setCurrentSession: (session: ChatSession) => {
        set({ 
          currentSession: session, 
          error: null,
          selectedVoice: session.selectedVoice || defaultVoice
        })
      },

      addMessage: (message: Message) => {
        const state = get()
        if (!state.currentSession) return

        const updatedSession = {
          ...state.currentSession,
          messages: [...state.currentSession.messages, message],
          updatedAt: new Date()
        }

        // Generate title from first user message if it's still "New Chat"
        if (updatedSession.title === 'New Chat' && message.role === 'user') {
          updatedSession.title = message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '')
        }

        set({
          currentSession: updatedSession,
          sessions: state.sessions.map(session => 
            session.id === updatedSession.id ? updatedSession : session
          )
        })
      },

      updateMessage: (messageId: string, updates: Partial<Message>) => {
        const state = get()
        if (!state.currentSession) return

        const updatedSession = {
          ...state.currentSession,
          messages: state.currentSession.messages.map(msg =>
            msg.id === messageId ? { ...msg, ...updates } : msg
          ),
          updatedAt: new Date()
        }

        set({
          currentSession: updatedSession,
          sessions: state.sessions.map(session => 
            session.id === updatedSession.id ? updatedSession : session
          )
        })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      updateAgentConfig: (config: Partial<AgentConfig>) => {
        set(state => ({
          agentConfig: { ...state.agentConfig, ...config }
        }))
      },

      deleteSession: (sessionId: string) => {
        console.log('🗑️ Store: Deleting session with ID:', sessionId)
        set(state => {
          const newSessions = state.sessions.filter(session => session.id !== sessionId)
          const newCurrentSession = state.currentSession?.id === sessionId ? null : state.currentSession
          console.log('🗑️ Store: Remaining sessions:', newSessions.length)
          console.log('🗑️ Store: Current session after delete:', newCurrentSession?.id || 'null')
          return {
            sessions: newSessions,
            currentSession: newCurrentSession
          }
        })
      },

      clearAllSessions: () => {
        set({
          sessions: [],
          currentSession: null,
          error: null
        })
      },

      toggleTTS: () => {
        set(state => ({
          isTTSEnabled: !state.isTTSEnabled
        }))
      },

      setSelectedVoice: (voice: VoiceOption) => {
        set({ selectedVoice: voice })
        // Also update the current session's voice
        const state = get()
        if (state.currentSession) {
          const updatedSession = {
            ...state.currentSession,
            selectedVoice: voice,
            updatedAt: new Date()
          }
          set({
            currentSession: updatedSession,
            sessions: state.sessions.map(session => 
              session.id === updatedSession.id ? updatedSession : session
            )
          })
        }
      },

      setTTSVolume: (volume: number) => {
        set({ ttsVolume: Math.max(0, Math.min(1, volume)) }) // Clamp between 0 and 1
      },

      toggleDarkMode: () => {
        set(state => ({
          isDarkMode: !state.isDarkMode
        }))
      }
    }),
    {
      name: 'better-better-help-chat',
      partialize: (state) => ({
        sessions: state.sessions,
        currentSession: state.currentSession,
        agentConfig: state.agentConfig,
        isTTSEnabled: state.isTTSEnabled,
        selectedVoice: state.selectedVoice,
        ttsVolume: state.ttsVolume,
        isDarkMode: state.isDarkMode
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert date strings back to Date objects for sessions
          state.sessions = state.sessions.map(session => ({
            ...session,
            createdAt: new Date(session.createdAt),
            updatedAt: new Date(session.updatedAt),
            messages: session.messages.map(message => ({
              ...message,
              timestamp: new Date(message.timestamp)
            }))
          }))
          
          // Convert date strings back to Date objects for current session
          if (state.currentSession) {
            state.currentSession = {
              ...state.currentSession,
              createdAt: new Date(state.currentSession.createdAt),
              updatedAt: new Date(state.currentSession.updatedAt),
              messages: state.currentSession.messages.map(message => ({
                ...message,
                timestamp: new Date(message.timestamp)
              }))
            }
          }
        }
      }
    }
  )
)
