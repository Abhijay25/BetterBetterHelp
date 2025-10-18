import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function transcribeAudio(audioFile: File) {
  try {
    const audioBlob = new Blob([await audioFile.arrayBuffer()], { 
      type: audioFile.type || 'audio/mp3' 
    });

    const transcription = await elevenlabs.speechToText.convert({
      file: audioBlob,
      modelId: "scribe_v1", // Model to use, for now only "scribe_v1" is supported.
      tagAudioEvents: true, // Tag audio events like laughter, applause, etc.
      languageCode: "eng", // Language of the audio file. If set to null, the model will detect the language automatically.
      diarize: true, // Whether to annotate who is speaking
    });

    return transcription;
  } catch (error) {
    console.error('Speech-to-text error:', error);
    throw new Error('Failed to transcribe audio');
  }
}

// Example usage function
export async function transcribeFromUrl(audioUrl: string) {
  try {
    const response = await fetch(audioUrl);
    const audioBlob = new Blob([await response.arrayBuffer()], { type: "audio/mp3" });

    const transcription = await elevenlabs.speechToText.convert({
      file: audioBlob,
      modelId: "scribe_v1",
      tagAudioEvents: true,
      languageCode: "eng",
      diarize: true,
    });

    return transcription;
  } catch (error) {
    console.error('Speech-to-text error:', error);
    throw new Error('Failed to transcribe audio from URL');
  }
}
