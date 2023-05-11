import {
  AudioConfig,
  SpeakerAudioDestination,
  SpeechConfig,
  SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk'
import { appConfig } from '@/config/app.config'

let _audioPlayer: SpeakerAudioDestination | null

function getSpeechSynthesizer() {
  if (_audioPlayer) {
    _audioPlayer.pause()
    _audioPlayer.close()
  }

  const speechConfig = SpeechConfig.fromSubscription(
    appConfig.azure.key,
    appConfig.azure.region,
  )

  speechConfig.speechSynthesisLanguage = 'zh-CN'
  speechConfig.speechSynthesisVoiceName = 'zh-CN-YunfengNeural'

  _audioPlayer = new SpeakerAudioDestination()
  const audioConfig = AudioConfig.fromSpeakerOutput(_audioPlayer)

  const speechSynthesizer = new SpeechSynthesizer(speechConfig, audioConfig)
  return speechSynthesizer
}

export function synthesizeSpeech(content: string) {
  const speechSynthesizer = getSpeechSynthesizer()

  if (speechSynthesizer) {
    speechSynthesizer.speakTextAsync(
      content,
      (result) => {
        if (result) {
          speechSynthesizer.close()
          return result.audioData
        }
      },
      () => {
        speechSynthesizer.close()
      },
    )
  }
}

export function useSpeech() {
  return {
    synthesizeSpeech,
  }
}
