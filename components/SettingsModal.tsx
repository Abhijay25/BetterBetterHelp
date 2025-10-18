'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Settings, Bot, Zap, MessageSquare } from 'lucide-react'
import { useChatStore } from '@/store/chatStore'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { agentConfig, updateAgentConfig } = useChatStore()

  const personalityOptions = [
    { value: 'sassy', label: 'Sassy & Sarcastic', description: 'Brutally honest with a side of attitude' },
    { value: 'supportive', label: 'Supportive', description: 'Warm and encouraging (boring)' },
    { value: 'brutal', label: 'Brutally Honest', description: 'No sugarcoating, just truth bombs' },
    { value: 'sarcastic', label: 'Pure Sarcasm', description: 'Maximum sass, minimum help' }
  ]

  const modelOptions = [
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: 'Fast and efficient' },
    { value: 'gpt-4', label: 'GPT-4', description: 'More intelligent responses' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', description: 'Latest and greatest' }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 max-w-2xl mx-auto bg-bbh-dark border border-bbh-light-gray rounded-xl z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-bbh-light-gray">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-bbh-pink to-bbh-purple rounded-full flex items-center justify-center">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Agent Settings</h2>
                      <p className="text-sm text-gray-400">Customize your questionable therapist</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-bbh-light-gray rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Model Selection */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    <Bot className="w-4 h-4 inline mr-2" />
                    AI Model
                  </label>
                  <div className="space-y-2">
                    {modelOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`block p-3 rounded-lg border cursor-pointer transition-colors ${
                          agentConfig.model === option.value
                            ? 'border-bbh-pink bg-bbh-pink/10'
                            : 'border-bbh-light-gray hover:border-gray-500'
                        }`}
                      >
                        <input
                          type="radio"
                          name="model"
                          value={option.value}
                          checked={agentConfig.model === option.value}
                          onChange={(e) => updateAgentConfig({ model: e.target.value })}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-medium">{option.label}</div>
                            <div className="text-sm text-gray-400">{option.description}</div>
                          </div>
                          {agentConfig.model === option.value && (
                            <div className="w-2 h-2 bg-bbh-pink rounded-full"></div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Personality */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Personality
                  </label>
                  <div className="space-y-2">
                    {personalityOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`block p-3 rounded-lg border cursor-pointer transition-colors ${
                          agentConfig.personality === option.value
                            ? 'border-bbh-pink bg-bbh-pink/10'
                            : 'border-bbh-light-gray hover:border-gray-500'
                        }`}
                      >
                        <input
                          type="radio"
                          name="personality"
                          value={option.value}
                          checked={agentConfig.personality === option.value}
                          onChange={(e) => updateAgentConfig({ personality: e.target.value as any })}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-medium">{option.label}</div>
                            <div className="text-sm text-gray-400">{option.description}</div>
                          </div>
                          {agentConfig.personality === option.value && (
                            <div className="w-2 h-2 bg-bbh-pink rounded-full"></div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Advanced Settings */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    <Zap className="w-4 h-4 inline mr-2" />
                    Advanced Settings
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Temperature: {agentConfig.temperature}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={agentConfig.temperature}
                        onChange={(e) => updateAgentConfig({ temperature: parseFloat(e.target.value) })}
                        className="w-full h-2 bg-bbh-light-gray rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Conservative</span>
                        <span>Creative</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Max Tokens: {agentConfig.maxTokens}
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="1000"
                        step="50"
                        value={agentConfig.maxTokens}
                        onChange={(e) => updateAgentConfig({ maxTokens: parseInt(e.target.value) })}
                        className="w-full h-2 bg-bbh-light-gray rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Short</span>
                        <span>Long</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-bbh-light-gray">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
