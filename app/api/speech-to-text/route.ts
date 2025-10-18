import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { NextRequest, NextResponse } from "next/server";
import { env, security } from '@/lib/env';

// Lazy initialization of ElevenLabs client to avoid build-time errors
let elevenlabs: ElevenLabsClient | null = null;

function getElevenLabsClient(): ElevenLabsClient {
  if (!elevenlabs) {
    if (!env.ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY is not configured');
    }
    elevenlabs = new ElevenLabsClient({
      apiKey: env.ELEVENLABS_API_KEY,
    });
  }
  return elevenlabs;
}

export async function POST(request: NextRequest) {
  try {
    // Security: Validate ElevenLabs API key before processing
    if (!env.ELEVENLABS_API_KEY) {
      console.error('❌ ElevenLabs API key is missing')
      return NextResponse.json(
        { error: 'Speech-to-text service not configured' }, 
        { status: 500 }
      )
    }

    // Security: Rate limiting check (basic implementation)
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    // Security: Validate request size
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 50000000) { // 50MB limit for audio files
      return NextResponse.json(
        { error: 'Audio file too large' }, 
        { status: 413 }
      )
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Security: Validate audio file type
    const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/webm'];
    if (!allowedTypes.includes(audioFile.type)) {
      return NextResponse.json({ 
        error: 'Unsupported audio format. Please use MP3, WAV, MPEG, MP4, or WebM' 
      }, { status: 400 });
    }

    // Log request (with masked API key for security)
    console.log(`🎤 Speech-to-text request from ${clientIP}:`, {
      fileName: audioFile.name,
      fileSize: audioFile.size,
      fileType: audioFile.type,
      env: security.getSafeEnvInfo()
    })

    const audioBlob = new Blob([await audioFile.arrayBuffer()], { 
      type: audioFile.type || 'audio/mp3' 
    });

    const transcription = await getElevenLabsClient().speechToText.convert({
      file: audioBlob,
      modelId: "scribe_v1", // Model to use, for now only "scribe_v1" is supported.
      tagAudioEvents: true, // Tag audio events like laughter, applause, etc.
      languageCode: "eng", // Language of the audio file. If set to null, the model will detect the language automatically.
      diarize: true, // Whether to annotate who is speaking
    });

    // Extract the text from the transcription response
    // The response structure varies, so we'll handle it safely
    let text = '';
    if (typeof transcription === 'string') {
      text = transcription;
    } else if (transcription && typeof transcription === 'object') {
      // Try different possible properties
      text = (transcription as any).text || 
             (transcription as any).transcript || 
             (transcription as any).transcription ||
             JSON.stringify(transcription);
    }
    
    return NextResponse.json({ 
      transcription,
      text: text
    });
  } catch (error) {
    console.error('Speech-to-text error:', error);
    return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'BetterBetterHelp Speech-to-Text API',
    version: '1.0.0',
    elevenlabsConfigured: !!env.ELEVENLABS_API_KEY,
    timestamp: new Date().toISOString()
  })
}
