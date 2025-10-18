# BetterBetterHelp

When life's falling apart and you just _know_ it's not your fault — we're here to _convince you otherwise!_

**BetterBetterHelp** is your brutally honest, questionably supportive digital friend who specializes in _tough love_ (Don't believe us? Try it out and try again).

Think of it as therapy... if your therapist was your best friend who majored in sarcasm and did a weekend course on psychology (we think).

We're here to listen, to gaslight (lovingly), and to help you realize that maybe, just maybe that you are the problem...or not. !

**No fluff. No sugarcoating. No guarantees.**  
Just questionable advice, misplaced confidence, and the emotional rollercoaster you didn't know you needed.

Because sometimes, being delusionally confident _is_ self-care bestie. 💅

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Optional: OpenAI API key (for real LLM integration)

### Quick Setup

1. **Run the setup script:**
   ```bash
   ./setup.sh
   ```

2. **Or manually install:**
   ```bash
   npm install
   cp env.example .env.local
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS with custom design system
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Agent Integration:** Custom SDK framework
- **Icons:** Lucide React
- **Markdown:** React Markdown with GitHub Flavored Markdown

## 🎨 Features

- **Modern Chat Interface:** Beautiful, responsive chat UI with smooth animations
- **AI Personality System:** Multiple personality types (sassy, supportive, brutal, sarcastic)
- **Real-time Typing Indicators:** See when the AI is "thinking"
- **Message History:** Persistent conversation flow with session management
- **Markdown Support:** Rich text formatting in AI responses
- **Mobile Responsive:** Works perfectly on all devices
- **Dark Theme:** Easy on the eyes with custom color scheme
- **Settings Panel:** Customize AI personality and behavior
- **Agent SDK Framework:** Ready for integration with your preferred LLM provider

## 🔧 Agent SDK Integration

The app includes a flexible agent SDK framework that you can easily integrate with your preferred LLM provider:

### Agent SDK Interface

```typescript
interface AgentSDK {
  sendMessage: (message: string, config?: Partial<AgentConfig>) => Promise<AgentResponse>
  createSession: () => Promise<ChatSession>
  getSession: (id: string) => Promise<ChatSession>
  updateSession: (session: ChatSession) => Promise<void>
  deleteSession: (id: string) => Promise<void>
}
```

### Integration Example

```typescript
import { createAgentSDK } from '@/lib/agentSDK'

// Create SDK instance with your API
const agentSDK = createAgentSDK('https://your-api.com', 'your-api-key')

// Send a message
const response = await agentSDK.sendMessage('Hello!', {
  model: 'gpt-4',
  temperature: 0.8,
  personality: 'sassy'
})
```

### Available Hooks

- `useAgent()` - Main agent interaction hook
- `useChatSessions()` - Session management hook

## 🎭 AI Personalities

The app supports multiple AI personalities:

- **Sassy & Sarcastic** (default) - Brutally honest with attitude
- **Supportive** - Warm and encouraging 
- **Brutally Honest** - No sugarcoating, just truth bombs
- **Pure Sarcasm** - Maximum sass, minimum help

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```env
# Optional: External LLM Provider Keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
COHERE_API_KEY=your_cohere_api_key_here

# Agent Configuration
AGENT_API_URL=http://localhost:3000/api
AGENT_API_KEY=your_agent_api_key_here
```

### Styling Customization

The app uses a custom design system defined in `tailwind.config.js`:
- **bbh-pink:** #FF69B4
- **bbh-purple:** #8A2BE2  
- **bbh-dark:** #1A1A1A
- **bbh-gray:** #2D2D2D
- **bbh-light-gray:** #404040

## 📱 Usage

1. Start a conversation by typing your problem or question
2. The AI will respond with personality-driven advice
3. Use the settings panel to customize the AI's behavior
4. Manage multiple chat sessions
5. Enjoy the emotional rollercoaster! 🎢

## 🏗️ Project Structure

```
BetterBetterHelp/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── chat/         # Chat endpoint
│   │   ├── sessions/     # Session management
│   │   └── config/       # Configuration
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main chat interface
├── components/           # React components
│   ├── ChatSidebar.tsx   # Session sidebar
│   ├── MessageBubble.tsx # Message component
│   ├── SettingsModal.tsx # Settings panel
│   └── TypingIndicator.tsx
├── hooks/                # Custom hooks
│   └── useAgent.ts       # Agent interaction hook
├── lib/                  # Utilities
│   ├── agentSDK.ts      # Agent SDK implementation
│   └── utils.ts          # Helper functions
├── store/                # State management
│   └── chatStore.ts      # Zustand store
├── types/                # TypeScript types
│   └── index.ts          # Type definitions
└── package.json          # Dependencies
```

## 🔌 API Endpoints

- `POST /api/chat` - Send message to agent
- `GET /api/sessions` - Get all sessions
- `POST /api/sessions` - Create new session
- `PUT /api/sessions` - Update session
- `DELETE /api/sessions` - Delete session
- `GET /api/config` - Get agent configuration
- `POST /api/config` - Update agent configuration

## ⚠️ Disclaimer

This is a parody application for entertainment purposes. The advice provided is intentionally questionable and should not be taken seriously. For real mental health support, please consult qualified professionals.

## 🤝 Contributing

Feel free to submit issues and enhancement requests! This is meant to be a fun, entertaining project.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Remember: Sometimes being delusionally confident IS self-care, bestie! 💅✨*
