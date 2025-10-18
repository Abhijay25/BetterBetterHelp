'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, MessageSquare, Trash2, Volume2, Edit3, Trash } from 'lucide-react'
import { ChatSession } from '@/types'
import { formatTimestamp, truncateText } from '@/lib/utils'
import { useChatStore } from '@/store/chatStore'
import { useState } from 'react'

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
  const { isDarkMode, deleteSession, updateSessionTitle, clearAllSessions } = useChatStore()
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteSession(sessionId)
  }

  const handleClearAllChats = () => {
    if (showClearConfirm) {
      clearAllSessions()
      setShowClearConfirm(false)
    } else {
      setShowClearConfirm(true)
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowClearConfirm(false), 3000)
    }
  }

  const handleRightClick = (sessionId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setEditingSessionId(sessionId)
    const session = sessions.find(s => s.id === sessionId)
    setEditTitle(session?.title || 'New Chat')
  }

  const handleSaveTitle = (sessionId: string) => {
    if (editTitle.trim()) {
      updateSessionTitle(sessionId, editTitle.trim())
    }
    setEditingSessionId(null)
    setEditTitle('')
  }

  const handleCancelEdit = () => {
    setEditingSessionId(null)
    setEditTitle('')
  }

  const handleKeyDown = (e: React.KeyboardEvent, sessionId: string) => {
    if (e.key === 'Enter') {
      handleSaveTitle(sessionId)
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`p-4 border-b ${isDarkMode ? 'border-bbh-light-gray' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Chat History</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onNewChat}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-bbh-light-gray' : 'hover:bg-gray-100'
              }`}
              title="New Chat"
            >
              <Plus className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
            {sessions.length > 0 && (
              <button
                onClick={handleClearAllChats}
                className={`p-2 rounded-lg transition-colors ${
                  showClearConfirm 
                    ? (isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600')
                    : (isDarkMode ? 'hover:bg-bbh-light-gray' : 'hover:bg-gray-100')
                }`}
                title={showClearConfirm ? "Click again to confirm" : "Clear All Chats"}
              >
                <Trash className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg transition-colors hover:bg-gray-100"
            >
              <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
        {sessions.length === 0 ? (
          <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No conversations yet</p>
            <p className="text-sm">Start a new chat to begin!</p>
          </div>
        ) : (
          sessions.map((session) => (
            <motion.button
              key={session.id}
              onClick={() => {
                if (editingSessionId !== session.id) {
                  onSelectSession(session)
                  onClose()
                }
              }}
              onContextMenu={(e) => handleRightClick(session.id, e)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                currentSession?.id === session.id
                  ? 'bg-gradient-to-r from-bbh-pink/20 to-bbh-green/20 border border-bbh-pink/30'
                  : isDarkMode ? 'hover:bg-bbh-light-gray' : 'hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {editingSessionId === session.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => handleSaveTitle(session.id)}
                      onKeyDown={(e) => handleKeyDown(e, session.id)}
                      className={`w-full text-sm font-medium bg-transparent border-b-2 focus:outline-none ${
                        isDarkMode 
                          ? 'text-white border-bbh-pink focus:border-bbh-pink' 
                          : 'text-gray-900 border-gray-400 focus:border-gray-600'
                      }`}
                      autoFocus
                    />
                  ) : (
                    <h3 className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {session.title || 'New Chat'}
                    </h3>
                  )}
                  <div className="flex items-center space-x-2 mt-1">
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatTimestamp(session.updatedAt)}
                    </p>
                    {session.selectedVoice && (
                      <div className="flex items-center space-x-1">
                        <Volume2 className={`w-3 h-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`} />
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {session.selectedVoice.name}
                        </span>
                      </div>
                    )}
                  </div>
                  {session.messages.length > 1 && (
                    <p className={`text-xs mt-1 truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {truncateText(session.messages[session.messages.length - 1]?.content || '', 50)}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  {editingSessionId !== session.id && (
                    <button
                      onClick={(e) => handleRightClick(session.id, e)}
                      className={`p-1 rounded transition-colors ${
                        isDarkMode ? 'hover:bg-blue-500/20' : 'hover:bg-blue-100'
                      }`}
                      title="Rename Chat (Right-click)"
                    >
                      <Edit3 className={`w-3 h-3 ${isDarkMode ? 'text-gray-500 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'}`} />
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className={`p-1 rounded transition-colors ${
                      isDarkMode ? 'hover:bg-red-500/20' : 'hover:bg-red-100'
                    }`}
                    title="Delete Chat"
                  >
                    <Trash2 className={`w-3 h-3 ${isDarkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-500 hover:text-red-600'}`} />
                  </button>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {session.messages.length}
                  </span>
                </div>
              </div>
            </motion.button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className={`p-4 border-t ${isDarkMode ? 'border-bbh-light-gray' : 'border-gray-200'}`}>
        <div className={`text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          BetterBetterHelp v1.0
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block transition-all duration-300 ${isOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
        <div className={`h-full border-r ${isDarkMode ? 'bg-bbh-dark border-bbh-light-gray' : 'bg-white border-gray-200'}`}>
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
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

            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={`fixed left-0 top-0 h-full w-80 border-r z-50 lg:hidden ${
                isDarkMode ? 'bg-bbh-dark border-bbh-light-gray' : 'bg-white border-gray-200'
              }`}
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}