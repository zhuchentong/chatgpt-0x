import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createParser } from 'eventsource-parser'
import { nanoid } from 'nanoid'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { CACHE_MESSAGE } from 'src/config/constants'

type Message = {
  id?: string
  role: 'system' | 'user' | 'assistant'
  content: string
  parentMessageId?: string
}

const MessageExpiresIn = 60 * 60 * 24 * 7

@Injectable()
export class OpenAIService {
  private readonly apiurl: string
  private readonly apikey: string
  @Inject(CACHE_MANAGER)
  private readonly cacheManager: Cache

  constructor(private readonly config: ConfigService) {
    const { apikey, apiurl } = this.config.get('openai')

    this.apikey = apikey
    this.apiurl = apiurl
  }

  /**
   *  获取消息队列
   * @param requestMessage
   * @param systemMessage
   * @returns
   */
  private async getMessages(
    requestMessage: Message,
    systemMessage?: string,
  ): Promise<Message[]> {
    // 消息队列
    const messages: Message[] = []
    // 最大深度
    const maxDepth = 14

    if (requestMessage.parentMessageId) {
      let id = requestMessage.parentMessageId

      do {
        const message = await this.cacheManager.get<Message>(
          `${CACHE_MESSAGE}:${id}`,
        )

        if (!message) {
          break
        }

        messages.unshift({ role: message.role, content: message.content })

        if (messages.length >= maxDepth) {
          break
        }

        if (!message.parentMessageId) {
          break
        }

        id = message.parentMessageId
      } while (true)
    }

    if (systemMessage) {
      messages.unshift({
        role: 'system',
        content: systemMessage,
      })
    }

    messages.push({
      role: 'user',
      content: requestMessage.content,
    })

    return messages
  }

  /**
   * 转换响应消息
   **/
  private parseResponse(response: string) {
    try {
      return JSON.parse(response)
    } catch (e) {
      return
    }
  }

  private async createCompletion({
    key,
    messages,
    onResponse,
  }: {
    key: string
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
    onResponse: (response: string) => void
  }) {
    const parser = createParser((event) => {
      if (event.type === 'event') {
        onResponse(event.data)
      }
    })

    const response = await globalThis.fetch(`${this.apiurl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },

      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        temperature: 0.8,
        top_p: 1.0,
        presence_penalty: 1.0,
        max_tokens: 2000,
        messages,
        stream: true,
      }),
    })

    async function* streamAsyncIterable(stream: ReadableStream) {
      const reader = stream.getReader()

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            return
          }
          yield value
        }
      } finally {
        reader.releaseLock()
      }
    }

    for await (const chunk of streamAsyncIterable(response.body)) {
      const str = new TextDecoder().decode(chunk)
      parser.feed(str)
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
    key: string = this.apikey,
  ) {
    // 请求消息结构
    const requestMessage: Message = {
      id: options.messageId || nanoid(),
      role: 'user',
      content: message,
      parentMessageId: options.parentMessageId,
    }

    // 响应消息结构
    const responseMessage = {
      id: nanoid(),
      role: 'assistant',
      parentMessageId: requestMessage.id,
      text: '',
      delta: '',
    }

    const messages = await this.getMessages(
      requestMessage,
      options?.systemMessage,
    )

    // 缓存请求消息
    await this.cacheManager.set(
      `${CACHE_MESSAGE}:${requestMessage.id}`,
      requestMessage,
      { ttl: MessageExpiresIn },
    )

    return new Promise((resolve, reject) => {
      // 响应消息
      const onResponse = async (message: string) => {
        if (message === '[DONE]') {
          await this.cacheManager.set<Message>(
            `${CACHE_MESSAGE}:${responseMessage.id}`,
            {
              role: 'assistant',
              id: responseMessage.id,
              content: responseMessage.text,
              parentMessageId: responseMessage.parentMessageId,
            },
            { ttl: MessageExpiresIn },
          )

          return resolve(responseMessage)
        }

        const response = this.parseResponse(message)

        if (typeof response === 'object') {
          responseMessage.id = response.id
          responseMessage.text += response.choices[0].delta.content || ''
          responseMessage.delta = response.choices[0].delta.content || ''

          options.onProgress({
            ...responseMessage,
            detail: response,
          })
        }
      }

      // 发送消息
      this.createCompletion({
        key: key,
        messages,
        onResponse,
      }).catch((ex) => {
        // TODO: 对话失败后是否需要删除RequestMessage？
        // 消息发送失败
        reject(ex)
        // 记录异常
        Logger.error(ex)
      })
    })
  }
}
