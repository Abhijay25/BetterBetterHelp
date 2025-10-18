import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🎤 TTS API called');
    
    const { text, voiceId } = await request.json();
    console.log('📝 Text received:', text?.substring(0, 50) + '...');
    console.log('🎵 Voice ID received:', voiceId);

    if (!text) {
      console.log('❌ No text provided');
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Check if API key is available
    if (!process.env.ELEVENLABS_API_KEY) {
      console.log('❌ ElevenLabs API key not found');
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    // Use provided voice ID or default
    const selectedVoiceId = voiceId || "21m00Tcm4TlvDq8ikWAM";
    console.log('🎵 Using voice ID:', selectedVoiceId);
    
    // Use direct HTTP API instead of SDK
    const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`;
    const headers = {
      "Accept": "audio/mpeg",
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
      "Content-Type": "application/json"
    };

    const requestBody = JSON.stringify({
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
        style: 0.0,
        use_speaker_boost: true
      }
    });

    console.log('📡 Making request to ElevenLabs API...');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: requestBody
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ ElevenLabs API error:', response.status, errorText);
      throw new Error(`ElevenLabs API error: ${response.status} ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    console.log('🔊 Generated audio buffer size:', audioBuffer.byteLength, 'bytes');

    // Return the audio buffer
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('❌ Text-to-speech API error:', error);
    return NextResponse.json(
      { error: `Failed to convert text to speech: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
