import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
// import { ChatGPTAPI, SendMessageOptions } from 'chatgpt'
import { Logger } from 'src/core/logger/services/logger.service'

export const importDynamic = new Function(
  'modulePath',
  'return import(modulePath)',
)

@Injectable()
export class OpenAIService {
  chatgptAPI: any

  constructor(
    private readonly config: ConfigService,
    private readonly logger: Logger,
  ) {}

  async onModuleInit() {
    await this.initGPT()
  }

  async initGPT() {
    const { ChatGPTAPI } = await importDynamic('chatgpt')
    const { apikey, apiurl } = this.config.get('openai')

    if (!apikey) {
      throw new Error('OPENAI_API_KEY missing')
    }

    try {
      this.chatgptAPI = new ChatGPTAPI({
        apiKey: apikey,
        apiBaseUrl: apiurl,
      })
    } catch (e) {
      this.logger.error(e)
    }
  }

  async sendMessage(
    message: string,
    options?: {
      name?: string
      parentMessageId?: string
      conversationId?: string
      messageId?: string
      stream?: boolean
      systemMessage?: string
      timeoutMs?: number
      onProgress?: (partialResponse: any) => void
      abortSignal?: AbortSignal
      completionParams?: any
    },
  ) {
    return this.chatgptAPI.sendMessage(message, options)
  }
}
