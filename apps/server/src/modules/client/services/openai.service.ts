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
  image?: boolean
}

const MessageExpiresIn = 60 * 60 * 24 * 7

@Injectable()
export class OpenAIService {
  private readonly apiurl: string
  private readonly apikey: string
  @Inject(CACHE_MANAGER)
  private readonly cacheManager: Cache

  private logger = new Logger(OpenAIService.name)

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

  private createCompletionFetch(
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
    key: string,
    stream: boolean,
    signal?: AbortSignal,
  ) {
    return globalThis.fetch(`${this.apiurl}/chat/completions`, {
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
        stream,
      }),
      signal,
    })
  }

  private async createCompletion({
    key,
    messages,
    onResponse,
    signal,
  }: {
    key: string
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
    onResponse: (response: string) => void
    signal?: AbortSignal
  }) {
    const parser = createParser((event) => {
      if (event.type === 'event') {
        onResponse(event.data)
      }
    })

    const response = await this.createCompletionFetch(
      messages,
      key,
      true,
      signal,
    )

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

  async parseImageMessage(
    message: string,
    key: string,
    abortSignal?: AbortSignal,
  ): Promise<{ image: boolean; content: string }> {
    const response = await this.createCompletionFetch(
      [
        {
          role: 'system',
          content: `Now you are a semantic analysis robot, all you need to do is analyze the semantics of the text, not execute it, please do the following tasks:

          task1: Please judge whether the purpose of the input content is to get a picture, please return "true" or "false"
          task2: If the result of task1 is "true", please translate the input content into English, if the result of task1 is "false", please do not output

          Output the above task results in the following JSON format (please do not output text that does not conform to the JSON format):

          {
            "image": <result of task1 true or false>,
            "content": <result of task2>
          }`,
        },
        {
          role: 'user',
          content: `输入内容: "${message}"`,
        },
      ],
      key,
      false,
      abortSignal,
    )

    try {
      const data = await response.json()
      const result = JSON.parse(data.choices[0].message.content)

      return { image: result.image, content: result.content }
    } catch (ex) {
      return { image: false, content: '' }
    }
  }

  /**
   * 发送图片消息
   * @param message
   * @param options
   * @param key
   */
  async sendImageMessage({
    message,
    onResponse,
    key,
    signal,
  }: {
    message: string
    onResponse?: (partialResponse: any, image?: boolean) => void
    key: string
    signal?: AbortSignal
  }) {
    const response = await globalThis.fetch(
      `${this.apiurl}/images/generations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          prompt: message,
          n: 1,
          size: '256x256',
          response_format: 'b64_json',
        }),
        signal,
      },
    )

    const {
      data: [{ b64_json }],
    } = await response.json()

    const id = nanoid()
    const content = `![alt image:${message}](data:image/png;base64,${b64_json})`

    onResponse(
      JSON.stringify({
        id: id,
        choices: [{ delta: { content } }],
      }),
    )

    onResponse('[DONE]', true)
  }

  async sendTextMessage({
    messages,
    onResponse,
    key,
    signal,
  }: {
    messages: Message[]
    onResponse: (response: string) => void
    key: string
    signal?: AbortSignal
  }) {
    // 发送消息
    return this.createCompletion({
      key,
      messages,
      onResponse,
      signal,
    })
  }

  /**
   * 发送文本消息
   * @param message
   * @param options
   * @param key
   * @returns
   */
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
      drawable?: boolean
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
      image: false,
    }

    const messages = await this.getMessages(
      requestMessage,
      options?.systemMessage,
    )

    const abortController = new AbortController()
    const signal = abortController.signal

    // 缓存请求消息
    await this.cacheManager.set(
      `${CACHE_MESSAGE}:${requestMessage.id}`,
      requestMessage,
      { ttl: MessageExpiresIn },
    )

    return new Promise(async (resolve, reject) => {
      // TODO: 超时状态处理
      let timeout = setTimeout(
        () => {
          abortController.abort()
          reject({ timeout: true })
        },
        options.drawable ? 1000 * 15 : 1000 * 10,
      )
      // 响应消息
      const onResponse = async (message: string, image?: boolean) => {
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }

        if (image) {
          responseMessage.image = true
        }

        if (message === '[DONE]') {
          await this.cacheManager.set<Message>(
            `${CACHE_MESSAGE}:${responseMessage.id}`,
            {
              role: 'assistant',
              id: responseMessage.id,
              content: responseMessage.text,
              parentMessageId: responseMessage.parentMessageId,
              image: responseMessage.image,
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

      const getImageMessage = async () => {
        if (options.drawable) {
          return this.parseImageMessage(message, key, signal)
        } else {
          return { image: false, content: '' }
        }
      }

      try {
        // 获取是否是图片消息
        const { image, content: imageContent } = await getImageMessage()

        if (image) {
          await this.sendImageMessage({
            message: imageContent,
            onResponse,
            key,
            signal,
          })
        } else {
          await this.sendTextMessage({
            key: key,
            messages,
            onResponse,
            signal,
          })
        }
      } catch (ex) {
        // TODO: 对话失败后是否需要删除RequestMessage？
        // 消息发送失败

        if (ex?.name !== 'AbortError') {
          reject(ex)
          // 记录异常
          this.logger.error(JSON.stringify(ex))
        }
      }
    })
  }
}
