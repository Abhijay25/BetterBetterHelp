'use client'

import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 rounded-full bg-bbh-gray border border-bbh-light-gray flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="chat-bubble ai-bubble">
          <div className="typing-indicator">
            <div className="typing-dot" style={{ animationDelay: '0ms' }}></div>
            <div className="typing-dot" style={{ animationDelay: '150ms' }}></div>
            <div className="typing-dot" style={{ animationDelay: '300ms' }}></div>
            <span className="ml-2 text-gray-400 text-sm">Thinking...</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
