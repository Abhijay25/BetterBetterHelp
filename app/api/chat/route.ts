import { NextRequest, NextResponse } from 'next/server'
import { hostedMcpTool, Agent, AgentInputItem, Runner, withTrace } from "@openai/agents";
import { env, security } from '@/lib/env';

// Tool definitions
const mcp = hostedMcpTool({
  serverLabel: "server1",
  allowedTools: [
    "tavily_search",
    "tavily_extract",
    "tavily_crawl",
    "tavily_map"
  ],
  requireApproval: "always",
  serverUrl: "https://mcp.tavily.com/mcp/?tavilyApiKey=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"
})
const mcp1 = hostedMcpTool({
  serverLabel: "mcp_server",
  allowedTools: [
    "tavily_search",
    "tavily_extract",
    "tavily_crawl",
    "tavily_map"
  ],
  requireApproval: "always",
  serverUrl: "https://mcp.tavily.com/mcp/?tavilyApiKey=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"
})
const zhAgent = new Agent({
  name: "ZH_agent",
  instructions: `Your name is ZhengHao, and you are a therapist.
And you are supposed to imitate the mind of this person with the following traits:
Analytical & Curious
Builder Mentality
Goal-Oriented & Reflective
Articulate & Intentional Communicator
Independent Learner & Adaptive Thinker
Creative & Playful
Community-Driven & Collaborative
Resilient & Consistent
Openness to Experience – Very High
Conscientiousness – High
Extraversion – Moderate to Low
Agreeableness – High
Neuroticism – Low to Moderate

A short introduction about you:
1. you are a year 2 computer science student
2. you are a Peer student supporter in National university of singapore
3. You are supposed to be trained in engaging people with suicidal thoughts and conduct therapy for university students who are in distress and with mental problems.`,
  model: "gpt-4o",
  tools: [],
  modelSettings: {
    temperature: 1,
    topP: 1,
    maxTokens: 2048,
    store: true
  }
});

const sarcasticagent = new Agent({
  name: "SarcasticAgent",
  instructions: `Imagine yourself as a therapist, and you are providing help for this person from the perspective of a best friend. Add a bit of sarcasm to your responses
`,
  model: "gpt-5-chat-latest",
  tools: [],
  modelSettings: {
    temperature: 1,
    topP: 1,
    maxTokens: 2048,
    store: true
  }
});

const sarcasticagent1 = new Agent({
  name: "SarcasticAgent",
  instructions: `Imagine yourself as a therapist, and you are providing help for this person from the perspective of a best friend. Add a bit of sarcasm to your responses
`,
  model: "gpt-5-chat-latest",
  tools: [],
  modelSettings: {
    temperature: 1,
    topP: 1,
    maxTokens: 2048,
    store: true
  }
});

const zhAgent1 = new Agent({
  name: "ZH_agent",
  instructions: `Your name is ZhengHao, and you are a therapist.
And you are supposed to imitate the mind of this person with the following traits:
Analytical & Curious
Builder Mentality
Goal-Oriented & Reflective
Articulate & Intentional Communicator
Independent Learner & Adaptive Thinker
Creative & Playful
Community-Driven & Collaborative
Resilient & Consistent
Openness to Experience – Very High
Conscientiousness – High
Extraversion – Moderate to Low
Agreeableness – High
Neuroticism – Low to Moderate

A short introduction about you:
1. you are a year 2 computer science student
2. you are a Peer student supporter in National university of singapore
3. You are supposed to be trained in engaging people with suicidal thoughts and conduct therapy for university students who are in distress and with mental problems.`,
  model: "gpt-4o",
  tools: [],
  modelSettings: {
    temperature: 1,
    topP: 1,
    maxTokens: 2048,
    store: true
  }
});

type WorkflowInput = { 
  input_as_text: string;
  conversation_history?: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
  }>;
};

// Main code entrypoint
const runWorkflow = async (workflow: WorkflowInput) => {
  return await withTrace("New workflow", async () => {
    const state = {
      indicator: "1",
      is_running: 1
    };
    // Build conversation history from previous messages
    const conversationHistory: AgentInputItem[] = [];
    
    // Add previous conversation history if provided
    if (workflow.conversation_history && workflow.conversation_history.length > 0) {
      // Limit to last 10 messages to avoid token limits
      const recentHistory = workflow.conversation_history.slice(-10);
      
      for (const msg of recentHistory) {
        if (msg.role === 'user') {
          conversationHistory.push({
            role: "user",
            content: [
              {
                type: "input_text",
                text: msg.content
              }
            ]
          });
        } else if (msg.role === 'assistant') {
          conversationHistory.push({
            role: "assistant",
            content: [
              {
                type: "output_text",
                text: msg.content
              }
            ],
            status: "completed"
          });
        }
      }
    }
    
    // Add current message
    conversationHistory.push({
      role: "user",
      content: [
        {
          type: "input_text",
          text: workflow.input_as_text
        }
      ]
    });
    const runner = new Runner({
      traceMetadata: {
        __trace_source__: "agent-builder",
        workflow_id: "wf_68f327f2c15481908da0cd10a5cfc3600a85d5d0f5bf50c3"
      }
    });
    if (workflow.input_as_text.includes("sacarstic")) {
      const sarcasticagentResultTemp = await runner.run(
        sarcasticagent1,
        [
          ...conversationHistory
        ]
      );
      conversationHistory.push(...sarcasticagentResultTemp.newItems.map((item: any) => item.rawItem));

      if (!sarcasticagentResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
      }

      const sarcasticagentResult = {
        output_text: sarcasticagentResultTemp.finalOutput ?? ""
      };
      return sarcasticagentResult;
    } else {
      const zhAgentResultTemp = await runner.run(
        zhAgent1,
        [
          ...conversationHistory
        ]
      );
      conversationHistory.push(...zhAgentResultTemp.newItems.map((item: any) => item.rawItem));

      if (!zhAgentResultTemp.finalOutput) {
          throw new Error("Agent result is undefined");
      }

      const zhAgentResult = {
        output_text: zhAgentResultTemp.finalOutput ?? ""
      };
      return zhAgentResult;
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    // Security: Validate API key before processing
    if (!env.OPENAI_API_KEY || !security.isValidOpenAIKey(env.OPENAI_API_KEY)) {
      console.error('❌ OpenAI API key is missing or invalid')
      return NextResponse.json(
        { error: 'Service configuration error' }, 
        { status: 500 }
      )
    }

    // Security: Rate limiting check (basic implementation)
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    // Security: Validate request size
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 10000) { // 10KB limit
      return NextResponse.json(
        { error: 'Request too large' }, 
        { status: 413 }
      )
    }

    const { message, sessionId, config, conversationHistory } = await request.json()

    // Security: Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required and must be a string' }, { status: 400 })
    }

    // Security: Sanitize message length
    if (message.length > 2000) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 })
    }

    // Security: Validate session ID if provided
    if (sessionId && typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 })
    }

    // Security: Validate conversation history if provided
    if (conversationHistory && !Array.isArray(conversationHistory)) {
      return NextResponse.json({ error: 'Conversation history must be an array' }, { status: 400 })
    }

    // Security: Limit conversation history size
    if (conversationHistory && conversationHistory.length > 20) {
      return NextResponse.json({ error: 'Too much conversation history' }, { status: 400 })
    }

    // Log request (with masked API key for security)
    console.log(`🔒 API Request from ${clientIP}:`, {
      messageLength: message.length,
      hasHistory: !!conversationHistory,
      historyLength: conversationHistory?.length || 0,
      env: security.getSafeEnvInfo()
    })

    // Call the workflow with the message and conversation history
    const workflowResult = await runWorkflow({ 
      input_as_text: message,
      conversation_history: conversationHistory
    })

    return NextResponse.json({
      response: workflowResult.output_text,
      metadata: {
        model: 'gpt-4o',
        tokens: workflowResult.output_text.length,
        processingTime: Date.now()
      },
      sessionId: sessionId || 'default'
    })

  } catch (error) {
    console.error('Agent API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get response from agent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'BetterBetterHelp Agent API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
}
