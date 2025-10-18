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
  title: 'New Chat'
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

      setCurrentSession: (session: ChatSession) => {
        set({ currentSession: session, error: null })
      },

      addMessage: (message: Message) => {
        const state = get()
        if (!state.currentSession) return

        const updatedSession = {
          ...state.currentSession,
          messages: [...state.currentSession.messages, message],
          updatedAt: new Date()
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
        set(state => ({
          sessions: state.sessions.filter(session => session.id !== sessionId),
          currentSession: state.currentSession?.id === sessionId ? null : state.currentSession
        }))
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
      })
    }
  )
)
