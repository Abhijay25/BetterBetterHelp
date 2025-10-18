'use client'

import { motion } from 'framer-motion'
import { Bot, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Message } from '@/types'
import { formatTimestamp } from '@/lib/utils'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-start space-x-3 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-gradient-to-r from-bbh-pink to-bbh-purple' 
            : 'bg-bbh-gray border border-bbh-light-gray'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`chat-bubble ${isUser ? 'user-bubble' : 'ai-bubble'}`}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-strong:text-white prose-code:text-bbh-pink prose-pre:bg-bbh-dark prose-blockquote:border-bbh-purple"
          >
            {message.content}
          </ReactMarkdown>
          
          {/* Timestamp and Metadata */}
          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
            <span>{formatTimestamp(message.timestamp)}</span>
            {message.metadata && (
              <div className="flex items-center space-x-2">
                {message.metadata.processingTime && (
                  <span>{message.metadata.processingTime}ms</span>
                )}
                {message.metadata.tokens && (
                  <span>{message.metadata.tokens} tokens</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
