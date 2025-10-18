import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BetterBetterHelp - Questionable Therapy Advice',
  description: 'A brutally honest AI chat interface for questionable therapy advice',
  keywords: ['therapy', 'AI', 'chat', 'mental health', 'advice'],
  authors: [{ name: 'BetterBetterHelp Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}
