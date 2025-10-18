'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, Sparkles, Settings, Mic, MicOff, Square, Volume2, VolumeX, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatStore } from '@/store/chatStore'
import { Message } from '@/types'
import { generateId } from '@/lib/utils'
import { playTextToSpeechClient } from '@/lib/textToSpeech'
import { voiceOptions } from '@/lib/voiceOptions'
import TypingIndicator from '@/components/TypingIndicator'
import MessageBubble from '@/components/MessageBubble'
import ChatSidebar from '@/components/ChatSidebar'
import SettingsModal from '@/components/SettingsModal'
import BetterBetterHelpLogo from '@/images/BetterBetterHelp.svg'
import Image from 'next/image'

export default function ChatInterface() {
  const {
    currentSession,
    sessions,
    isLoading,
    error,
    isTTSEnabled,
    selectedVoice,
    ttsVolume,
    isDarkMode,
    createNewSession,
    setCurrentSession,
    addMessage,
    setLoading,
    setError,
    toggleTTS,
    setSelectedVoice,
    setTTSVolume
  } = useChatStore()

  const [input, setInput] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessingAudio, setIsProcessingAudio] = useState(false)
  const [showVoiceMenu, setShowVoiceMenu] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleTTSForMessage = async (message: Message) => {
    if (isTTSEnabled && message.role === 'assistant' && message.content) {
      try {
        console.log('🎤 Attempting TTS for message:', message.content.substring(0, 50) + '...');
        await playTextToSpeechClient(message.content, selectedVoice.id, ttsVolume)
        console.log('✅ TTS completed successfully');
      } catch (error) {
        console.error('❌ Error playing TTS:', error)
        // Show a subtle error message to user
        setError('Text-to-speech failed. Check console for details.')
        // Clear the error after 3 seconds
        setTimeout(() => setError(null), 3000)
      }
    }
  }

  const testTTS = async () => {
    try {
      console.log('🧪 Testing TTS with sample text...');
      await playTextToSpeechClient("Hello! This is a test of the text-to-speech functionality.", selectedVoice.id, ttsVolume)
      console.log('✅ TTS test completed');
    } catch (error) {
      console.error('❌ TTS test failed:', error);
      setError('TTS test failed. Check console for details.');
      setTimeout(() => setError(null), 3000);
    }
  }

  const previewVoice = async (voiceId: string) => {
    try {
      console.log('🎵 Previewing voice:', voiceId);
      await playTextToSpeechClient("Hello! This is how I sound.", voiceId, ttsVolume)
    } catch (error) {
      console.error('❌ Voice preview failed:', error);
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentSession?.messages])

  // Close voice menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showVoiceMenu) {
        const target = event.target as Element
        if (!target.closest('.voice-menu-container')) {
          setShowVoiceMenu(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showVoiceMenu])

  useEffect(() => {
    if (!currentSession && sessions.length === 0) {
      createNewSession()
    }
  }, [currentSession, sessions.length, createNewSession])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !currentSession) return

    const userMessage: Message = {
      id: generateId(),
      content: input,
      role: 'user',
      timestamp: new Date()
    }

    addMessage(userMessage)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      // Prepare conversation history (exclude the welcome message)
      const conversationHistory = currentSession.messages
        .filter(msg => msg.id !== '1') // Exclude the initial welcome message
        .map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp.toISOString()
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          sessionId: currentSession.id,
          conversationHistory: conversationHistory
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const aiMessage: Message = {
        id: generateId(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
        metadata: data.metadata
      }

      addMessage(aiMessage)
      
      // Play TTS if enabled
      await handleTTSForMessage(aiMessage)
    } catch (error) {
      console.error('Error:', error)
      setError('Oops! Looks like I\'m having a moment. Try again, bestie! 💅')
      
      const errorMessage: Message = {
        id: generateId(),
        content: "Oops! Looks like I'm having a moment. Try again, bestie! 💅",
        role: 'assistant',
        timestamp: new Date()
      }
      addMessage(errorMessage)
      
      // Play TTS if enabled
      await handleTTSForMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = () => {
    createNewSession()
    setShowSidebar(false)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await processAudioToText(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
      setError('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const processAudioToText = async (audioBlob: Blob) => {
    setIsProcessingAudio(true)
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to process audio')
      }

      const data = await response.json()
      
      if (data.transcription && data.transcription.text) {
        setInput(data.transcription.text)
        inputRef.current?.focus()
      } else {
        setError('Could not transcribe audio. Please try again.')
      }
    } catch (error) {
      console.error('Error processing audio:', error)
      setError('Failed to process audio. Please try again.')
    } finally {
      setIsProcessingAudio(false)
    }
  }

  if (!currentSession) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-bbh-dark via-gray-900 to-bbh-dark">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-bbh-pink to-bbh-purple rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Image src={BetterBetterHelpLogo} alt="BetterBetterHelp Logo" width={32} height={32} className="bg-white rounded-full p-1" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Loading...</h2>
          <p className="text-gray-400">Getting ready to give you questionable advice</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gradient-to-br from-bbh-dark via-gray-900 to-bbh-dark' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
      {/* Sidebar */}
      <ChatSidebar 
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        sessions={sessions}
        currentSession={currentSession}
        onSelectSession={setCurrentSession}
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className={`${isDarkMode ? 'bg-bbh-dark/80 border-bbh-light-gray' : 'bg-white/80 border-gray-200'} backdrop-blur-sm border-b p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSidebar(true)}
                className="lg:hidden p-2 hover:bg-bbh-light-gray rounded-lg transition-colors"
              >
                <Bot className="w-6 h-6 text-white" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-bbh-pink to-bbh-purple rounded-full flex items-center justify-center">
                <Image src={BetterBetterHelpLogo} alt="BetterBetterHelp Logo" width={64} height={64} className="bg-white rounded-full p-1" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>BetterBetterHelp</h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Questionable therapy advice</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Voice Selection Menu */}
              <div className="relative voice-menu-container">
                <button
                  onClick={() => setShowVoiceMenu(!showVoiceMenu)}
                  className="p-2 hover:bg-bbh-light-gray rounded-lg transition-colors flex items-center space-x-1"
                  title="Select Voice"
                >
                  <Volume2 className="w-5 h-5 text-gray-400" />
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>
                
                {showVoiceMenu && (
                  <div className={`absolute right-0 top-full mt-2 w-80 border rounded-lg shadow-lg z-50 h-96 flex flex-col ${
                    isDarkMode 
                      ? 'bg-bbh-dark border-bbh-light-gray' 
                      : 'bg-white border-gray-200'
                  }`}>
                    {/* Header - Fixed */}
                    <div className={`p-3 border-b flex-shrink-0 ${isDarkMode ? 'border-bbh-light-gray' : 'border-gray-200'}`}>
                      <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Select Voice</h3>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Choose how the agent should sound</p>
                    </div>
                    
                    {/* Scrollable Voice List */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                      <div className="p-2 space-y-1">
                        {voiceOptions.map((voice) => (
                          <div
                            key={voice.id}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              selectedVoice.id === voice.id
                                ? 'bg-bbh-pink/20 border border-bbh-pink'
                                : 'hover:bg-bbh-light-gray/50'
                            }`}
                            onClick={() => {
                              setSelectedVoice(voice)
                              setShowVoiceMenu(false)
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-white font-medium text-sm">{voice.name}</span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    voice.gender === 'male' 
                                      ? 'bg-blue-500/20 text-blue-300' 
                                      : 'bg-pink-500/20 text-pink-300'
                                  }`}>
                                    {voice.gender}
                                  </span>
                                  <span className="text-xs px-2 py-1 rounded-full bg-gray-500/20 text-gray-300">
                                    {voice.accent}
                                  </span>
                                </div>
                                <p className="text-gray-400 text-xs mt-1">{voice.description}</p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  previewVoice(voice.id)
                                }}
                                className="p-1 hover:bg-bbh-light-gray rounded transition-colors"
                                title="Preview Voice"
                              >
                                <Volume2 className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Volume Control - Fixed at Bottom */}
                    <div className={`p-3 border-t flex-shrink-0 ${isDarkMode ? 'border-bbh-light-gray' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Volume</span>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{Math.round(ttsVolume * 100)}%</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <VolumeX className="w-4 h-4 text-gray-400" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={ttsVolume}
                          onChange={(e) => setTTSVolume(parseFloat(e.target.value))}
                          className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${ttsVolume * 100}%, #374151 ${ttsVolume * 100}%, #374151 100%)`
                          }}
                        />
                        <Volume2 className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-bbh-light-gray rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          <AnimatePresence>
            {currentSession.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isLoading && <TypingIndicator />}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300"
            >
              {error}
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={`${isDarkMode ? 'bg-bbh-dark/80 border-bbh-light-gray' : 'bg-white/80 border-gray-200'} backdrop-blur-sm border-t p-4`}>
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tell me what's going wrong in your life... 💅"
                className={`w-full pr-32 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bbh-pink focus:border-transparent transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-bbh-gray border border-bbh-light-gray text-white placeholder-gray-400' 
                    : 'bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                disabled={isLoading || isProcessingAudio}
              />
              
              {/* Text-to-Speech Toggle Button */}
              <button
                type="button"
                onClick={toggleTTS}
                disabled={isLoading || isProcessingAudio}
                className={`absolute right-12 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isTTSEnabled 
                    ? 'bg-bbh-pink hover:bg-bbh-purple' 
                    : 'bg-gray-600 hover:bg-gray-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={isTTSEnabled ? 'Disable text-to-speech' : 'Enable text-to-speech'}
              >
                {isTTSEnabled ? (
                  <Volume2 className="w-4 h-4 text-white" />
                ) : (
                  <VolumeX className="w-4 h-4 text-white" />
                )}
              </button>

              {/* Audio Recording Button */}
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading || isProcessingAudio}
                className={`absolute right-24 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-gray-600 hover:bg-gray-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={isRecording ? 'Stop recording' : 'Start voice input'}
              >
                {isRecording ? (
                  <Square className="w-4 h-4 text-white" />
                ) : (
                  <Mic className="w-4 h-4 text-white" />
                )}
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!input.trim() || isLoading || isProcessingAudio}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-bbh-pink to-bbh-purple rounded-full flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </form>
          
          {/* Status Messages */}
          {isRecording && (
            <p className="text-xs text-red-400 mt-2 text-center animate-pulse">
              🎤 Recording... Click the square to stop
            </p>
          )}
          {isProcessingAudio && (
            <p className="text-xs text-blue-400 mt-2 text-center">
              🔄 Processing audio...
            </p>
          )}
          {!isRecording && !isProcessingAudio && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              No guarantees, just questionable advice ✨
            </p>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  )
}
