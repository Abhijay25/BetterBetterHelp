import { NextRequest, NextResponse } from 'next/server'
import { ChatSession } from '@/types'

// Mock storage for sessions (replace with actual database)
const sessions: Map<string, ChatSession> = new Map()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('id')

    if (sessionId) {
      const session = sessions.get(sessionId)
      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 })
      }
      return NextResponse.json(session)
    }

    // Return all sessions
    const allSessions = Array.from(sessions.values())
    return NextResponse.json(allSessions)

  } catch (error) {
    console.error('Sessions API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionData = await request.json()

    const newSession: ChatSession = {
      id: Date.now().toString(),
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      title: sessionData.title || 'New Chat',
      ...sessionData
    }

    sessions.set(newSession.id, newSession)

    return NextResponse.json(newSession, { status: 201 })

  } catch (error) {
    console.error('Sessions API error:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sessionData = await request.json()

    if (!sessionData.id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    const existingSession = sessions.get(sessionData.id)
    if (!existingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const updatedSession: ChatSession = {
      ...existingSession,
      ...sessionData,
      updatedAt: new Date()
    }

    sessions.set(updatedSession.id, updatedSession)

    return NextResponse.json(updatedSession)

  } catch (error) {
    console.error('Sessions API error:', error)
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    const session = sessions.get(sessionId)
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    sessions.delete(sessionId)

    return NextResponse.json({ message: 'Session deleted successfully' })

  } catch (error) {
    console.error('Sessions API error:', error)
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    )
  }
}
