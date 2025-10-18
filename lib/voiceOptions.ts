import { VoiceOption } from '@/types'

export const voiceOptions: VoiceOption[] = [
  {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    gender: "female",
    accent: "American",
    description: "Clear, professional American female voice"
  },
  {
    id: "AZnzlk1XvdvUeBnXmlld",
    name: "Domi",
    gender: "female",
    accent: "American",
    description: "Confident, warm American female voice"
  },
  {
    id: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella",
    gender: "female",
    accent: "American",
    description: "Friendly, conversational American female voice"
  },
  {
    id: "ErXwobaYiN019PkySvjV",
    name: "Antoni",
    gender: "male",
    accent: "American",
    description: "Smooth, professional American male voice"
  },
  {
    id: "MF3mGyEYCl7XYWbV9V6O",
    name: "Elli",
    gender: "female",
    accent: "American",
    description: "Young, energetic American female voice"
  },
  {
    id: "TxGEqnHWrfWFTfGW9XjX",
    name: "Josh",
    gender: "male",
    accent: "American",
    description: "Deep, authoritative American male voice"
  },
  {
    id: "VR6AewLTigWG4xSOukaG",
    name: "Arnold",
    gender: "male",
    accent: "American",
    description: "Strong, commanding American male voice"
  },
  {
    id: "pNInz6obpgDQGcFmaJgB",
    name: "Adam",
    gender: "male",
    accent: "American",
    description: "Calm, soothing American male voice"
  },
  {
    id: "yoZ06aMxZJJ28mfd3POQ",
    name: "Sam",
    gender: "male",
    accent: "British",
    description: "Refined British male voice"
  },
  {
    id: "2EiwWnXFnvU5JabPnv8n",
    name: "Clyde",
    gender: "male",
    accent: "American",
    description: "Casual, friendly American male voice"
  },
  {
    id: "9BWtw2W0fVqKd3T4Cb8l",
    name: "Freya",
    gender: "female",
    accent: "British",
    description: "Elegant British female voice"
  },
  {
    id: "CYw3kZ02Hs0563khs1Fj",
    name: "Dave",
    gender: "male",
    accent: "British",
    description: "Charming British male voice"
  }
]

export const getVoiceById = (id: string): VoiceOption | undefined => {
  return voiceOptions.find(voice => voice.id === id)
}

export const getVoicesByGender = (gender: 'male' | 'female'): VoiceOption[] => {
  return voiceOptions.filter(voice => voice.gender === gender)
}

export const getVoicesByAccent = (accent: string): VoiceOption[] => {
  return voiceOptions.filter(voice => voice.accent === accent)
}
