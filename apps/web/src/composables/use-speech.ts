import {
  AudioConfig,
  SpeechConfig,
  SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk'
import { appConfig } from '@/config/app.config'

export function synthesizeSpeech(content: string) {
  // TODO:FOR TEST
  const speechConfig = SpeechConfig.fromSubscription(
    appConfig.azure.key,
    appConfig.azure.region,
  )

  speechConfig.speechSynthesisLanguage = 'zh-CN'
  speechConfig.speechSynthesisVoiceName = 'zh-CN-YunfengNeural'
  const audioConfig = AudioConfig.fromDefaultSpeakerOutput()

  const speechSynthesizer = new SpeechSynthesizer(speechConfig, audioConfig)
  speechSynthesizer.speakTextAsync(
    content,
    (result) => {
      if (result) {
        speechSynthesizer.close()
        return result.audioData
      }
    },
    (error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      speechSynthesizer.close()
    },
  )
}

export function useSpeech() {
  return {
    synthesizeSpeech,
  }
}
