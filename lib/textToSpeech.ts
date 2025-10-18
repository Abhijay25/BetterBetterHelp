// Client-side function for browser usage
export async function playTextToSpeechClient(text: string, voiceId?: string, volume: number = 0.7) {
  try {
    console.log('🎤 Starting TTS for text:', text.substring(0, 50) + '...');
    console.log('🎵 Using voice ID:', voiceId || 'default');
    console.log('🔊 Volume level:', volume);
    
    const response = await fetch('/api/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, voiceId }),
    });

    console.log('📡 TTS API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ TTS API error:', errorText);
      throw new Error(`Failed to generate speech: ${response.status} ${errorText}`);
    }

    const audioBlob = await response.blob();
    console.log('🔊 Audio blob size:', audioBlob.size, 'bytes');
    
    if (audioBlob.size === 0) {
      throw new Error('Received empty audio blob');
    }

    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    // Set the volume
    audio.volume = Math.max(0, Math.min(1, volume));
    console.log('🔊 Audio volume set to:', audio.volume);
    
    // Add event listeners for debugging
    audio.onloadstart = () => console.log('🎵 Audio loading started');
    audio.oncanplay = () => console.log('🎵 Audio can play');
    audio.onplay = () => console.log('🎵 Audio started playing');
    audio.onended = () => {
      console.log('🎵 Audio finished playing');
      URL.revokeObjectURL(audioUrl);
    };
    audio.onerror = (e) => {
      console.error('❌ Audio playback error:', e);
      URL.revokeObjectURL(audioUrl);
    };
    
    console.log('▶️ Attempting to play audio...');
    await audio.play();
    console.log('✅ Audio playback started successfully');
    return audio;
  } catch (error) {
    console.error('❌ Error playing text-to-speech:', error);
    throw error;
  }
}
