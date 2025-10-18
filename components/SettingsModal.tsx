'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Settings, MessageSquare, Sun, Moon } from 'lucide-react'
import { useChatStore } from '@/store/chatStore'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { agentConfig, updateAgentConfig, isDarkMode, toggleDarkMode } = useChatStore()

  const personalityOptions = [
    { value: 'sassy', label: 'Sassy & Sarcastic', description: 'Brutally honest with a side of attitude', color: 'bbh-red' },
    { value: 'supportive', label: 'Supportive', description: 'Warm and encouraging (boring)', color: 'bbh-green' },
    { value: 'brutal', label: 'Brutally Honest', description: 'No sugarcoating, just truth bombs', color: 'bbh-red' },
    { value: 'sarcastic', label: 'Pure Sarcasm', description: 'Maximum sass, minimum help', color: 'bbh-pink' }
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
                            ? `border-${option.color} bg-${option.color}/10`
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
                            <div className={`w-2 h-2 bg-${option.color} rounded-full`}></div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Theme Toggle */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    {isDarkMode ? <Moon className="w-4 h-4 inline mr-2" /> : <Sun className="w-4 h-4 inline mr-2" />}
                    Theme
                  </label>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-bbh-light-gray">
                    <div>
                      <div className="text-white font-medium">
                        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                      </div>
                      <div className="text-sm text-gray-400">
                        {isDarkMode ? 'Easy on the eyes (default)' : 'Bright and cheerful'}
                      </div>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isDarkMode ? 'bg-bbh-green' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isDarkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
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
