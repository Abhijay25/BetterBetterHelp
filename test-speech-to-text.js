#!/usr/bin/env node

// Test script for ElevenLabs Speech-to-Text
// Run with: node test-speech-to-text.js

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: '.env.local' });

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

async function testSpeechToText() {
  try {
    console.log("🎤 Testing ElevenLabs Speech-to-Text...");
    console.log("📥 Fetching test audio file...");
    
    const response = await fetch(
      "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3"
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch audio: ${response.statusText}`);
    }
    
    const audioBlob = new Blob([await response.arrayBuffer()], { type: "audio/mp3" });
    console.log(`📊 Audio file size: ${audioBlob.size} bytes`);

    console.log("🔄 Converting speech to text...");
    const transcription = await elevenlabs.speechToText.convert({
      file: audioBlob,
      modelId: "scribe_v1", // Model to use, for now only "scribe_v1" is supported.
      tagAudioEvents: true, // Tag audio events like laughter, applause, etc.
      languageCode: "eng", // Language of the audio file. If set to null, the model will detect the language automatically.
      diarize: true, // Whether to annotate who is speaking
    });

    console.log("✅ Transcription successful!");
    console.log("📝 Result:");
    console.log(JSON.stringify(transcription, null, 2));
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.message.includes('API key')) {
      console.log("💡 Make sure you've added ELEVENLABS_API_KEY to your .env.local file");
    }
  }
}

testSpeechToText();
