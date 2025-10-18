'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, MessageSquare, Trash2 } from 'lucide-react'
import { ChatSession } from '@/types'
import { formatTimestamp, truncateText } from '@/lib/utils'

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
  sessions: ChatSession[]
  currentSession: ChatSession | null
  onSelectSession: (session: ChatSession) => void
  onNewChat: () => void
}

export default function ChatSidebar({
  isOpen,
  onClose,
  sessions,
  currentSession,
  onSelectSession,
  onNewChat
}: ChatSidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-80 bg-bbh-dark border-r border-bbh-light-gray z-50 lg:relative lg:translate-x-0"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-bbh-light-gray">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Chat History</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={onNewChat}
                      className="p-2 hover:bg-bbh-light-gray rounded-lg transition-colors"
                      title="New Chat"
                    >
                      <Plus className="w-5 h-5 text-gray-400" />
                    </button>
                    <button
                      onClick={onClose}
                      className="lg:hidden p-2 hover:bg-bbh-light-gray rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sessions List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
                {sessions.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No conversations yet</p>
                    <p className="text-sm">Start a new chat to begin!</p>
                  </div>
                ) : (
                  sessions.map((session) => (
                    <motion.button
                      key={session.id}
                      onClick={() => {
                        onSelectSession(session)
                        onClose()
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentSession?.id === session.id
                          ? 'bg-gradient-to-r from-bbh-pink/20 to-bbh-purple/20 border border-bbh-pink/30'
                          : 'hover:bg-bbh-light-gray'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-white truncate">
                            {session.title || 'New Chat'}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTimestamp(session.updatedAt)}
                          </p>
                          {session.messages.length > 1 && (
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {truncateText(session.messages[session.messages.length - 1]?.content || '', 50)}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          <span className="text-xs text-gray-500">
                            {session.messages.length}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-bbh-light-gray">
                <div className="text-xs text-gray-500 text-center">
                  BetterBetterHelp v1.0
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
