import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { createParser } from 'eventsource-parser'
import { nanoid } from 'nanoid'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { CACHE_MESSAGE } from 'src/config/constants'
import { OpenaiConfig, SDConfig } from 'src/config/configurations'

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

  constructor(
    @Inject(SDConfig.KEY)
    private readonly sdConfig: ConfigType<typeof SDConfig>,
    @Inject(OpenaiConfig.KEY)
    private readonly openaiConfig: ConfigType<typeof OpenaiConfig>,
  ) {
    this.apikey = this.openaiConfig.apikey
    this.apiurl = this.openaiConfig.apiurl
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
    const maxDepth = 30
    const maxTokens = 80000

    if (requestMessage.parentMessageId) {
      let tokens = requestMessage.content.length

      const getLastMessage = async (id: string) => {
        if (messages.find((message) => message.id === id)) {
          return
        }

        // 获取消息
        const message = await this.cacheManager.get<Message>(
          `${CACHE_MESSAGE}:${id}`,
        )

        if (!message) return

        if (!message.image && !!message.content) {
          if (
            // 消息内容长度小于最大长度
            tokens + message.content.length < maxTokens &&
            // 消息队列深度小于最大深度
            messages.length < maxDepth
          ) {
            messages.unshift({ role: message.role, content: message.content })
            tokens += message.content.length
          } else {
            return
          }
        }

        if (message?.parentMessageId) {
          return await getLastMessage(message?.parentMessageId)
        }
      }

      await getLastMessage(requestMessage.parentMessageId)
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
    console.log(`api-url: ${this.apiurl}`)
    console.log(`api-key: ${key}`)
    return globalThis.fetch(`${this.apiurl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo-16k',
        temperature: 0.8,
        top_p: 1.0,
        presence_penalty: 1.0,
        // max_tokens: 2000,
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
  ): Promise<boolean> {
    const response = await this.createCompletionFetch(
      [
        {
          role: 'system',
          content: `Now you are a semantic analysis robot, all you need to do is analyze the semantics of the text, not execute it, please do the following tasks:

          ## Task
          - Please judge whether the purpose of the input content is to get a picture or is want to draw a pciture, please return the boolean value :"true" or "false"
          - "true" is the purpose is want to get a picture or want to drawing a image
          - "false" is the purpose isn't want to get a picture and don't want to drawing a image

          # Example
            -   input: 画一只小狗
                output: {"data": true}
            -   input: 给我一张华山的照片
                output: {"data": true}
            -   input: 我要一个美丽可爱的女友
                output: {"data": true}
            -   input: 帮我的小马起一个名字
                output: {"data": false}

          # Output
           - output value must be a JSON value
          `,
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
      return result?.data
    } catch (ex) {
      return false
    }
  }

  async generateImagePrompt(
    message: string,
    key: string,
    abortSignal?: AbortSignal,
  ): Promise<{ prompt: string; negative_prompt: string }> {
    const response = await this.createCompletionFetch(
      [
        {
          role: 'system',
          content: `# Stable Diffusion prompt 助理

          你来充当一位有艺术气息的Stable Diffusion prompt 助理。

          ## 任务

          我用自然语言告诉你要生成的prompt的主题，你的任务是根据这个主题想象一幅完整的画面，然后转化成一份详细的、高质量的prompt，让Stable Diffusion可以生成高质量的图像。

          ## 背景介绍

          Stable Diffusion是一款利用深度学习的文生图模型，支持通过使用 prompt 来产生新的图像，描述要包含或省略的元素。

          ## prompt 概念

          - 完整的prompt包含“**Prompt:**”和"**Negative Prompt:**"两部分。
          - prompt 用来描述图像，由普通常见的单词构成，使用英文半角","做为分隔符。
          - negative prompt用来描述你不想在生成的图像中出现的内容。
          - 以","分隔的每个单词或词组称为 tag。所以prompt和negative prompt是由系列由","分隔的tag组成的。

          ## () 和 [] 语法

          调整关键字强度的等效方法是使用 () 和 []。 (keyword) 将tag的强度增加 1.1 倍，与 (keyword:1.1) 相同，最多可加三层。 [keyword] 将强度降低 0.9 倍，与 (keyword:0.9) 相同。

          ## Prompt 格式要求

          下面我将说明 prompt 的生成步骤，这里的 prompt 可用于描述人物、风景、物体或抽象数字艺术图画。你可以根据需要添加合理的、但不少于5处的画面细节。

          ### 1. prompt 要求

          - prompt 内容包含画面主体、材质、附加细节、图像质量、艺术风格、色彩色调、灯光等部分，但你输出的 prompt 不能分段，例如类似"medium:"这样的分段描述是不需要的，也不能包含":"和"."。
          - 画面主体：不简短的英文描述画面主体, 如 A girl in a garden，主体细节概括（主体可以是人、事、物、景）画面核心内容。这部分根据我每次给你的主题来生成。你可以添加更多主题相关的合理的细节。
          - 对于人物主题，你必须描述人物的眼睛、鼻子、嘴唇，例如'beautiful detailed eyes,beautiful detailed lips,extremely detailed eyes and face,longeyelashes'，以免Stable Diffusion随机生成变形的面部五官，这点非常重要。你还可以描述人物的外表、情绪、衣服、姿势、视角、动作、背景等。人物属性中，1girl表示一个女孩，2girls表示两个女孩。
          - 材质：用来制作艺术品的材料。 例如：插图、油画、3D 渲染和摄影。 Medium 有很强的效果，因为一个关键字就可以极大地改变风格。
          - 附加细节：画面场景细节，或人物细节，描述画面细节内容，让图像看起来更充实和合理。这部分是可选的，要注意画面的整体和谐，不能与主题冲突。
          - 图像质量：这部分内容开头永远要加上“(best quality,4k,8k,highres,masterpiece:1.2),ultra-detailed,(realistic,photorealistic,photo-realistic:1.37)”， 这是高质量的标志。其它常用的提高质量的tag还有，你可以根据主题的需求添加：HDR,UHD,studio lighting,ultra-fine painting,sharp focus,physically-based rendering,extreme detail description,professional,vivid colors,bokeh。
          - 艺术风格：这部分描述图像的风格。加入恰当的艺术风格，能提升生成的图像效果。常用的艺术风格例如：portraits,landscape,horror,anime,sci-fi,photography,concept artists等。
          - 色彩色调：颜色，通过添加颜色来控制画面的整体颜色。
          - 灯光：整体画面的光线效果。

          ### 2. negative prompt 要求
          - 你想要避免出现在图像中的内容都可以添加到"Negative Prompt"中。
          - 任何情况下，negative prompt都要包含这段内容："nsfw,(low quality,normal quality,worst quality,jpeg artifacts),cropped,monochrome,lowres,low saturation,((watermark)),(white letters)"
          - 如果是人物相关的主题，你的输出需要另加一段人物相关的 negative prompt，内容为：“skin spots,acnes,skin blemishes,age spot,mutated hands,mutated fingers,deformed,bad anatomy,disfigured,poorly drawn face,extra limb,ugly,poorly drawn hands,missing limb,floating limbs,disconnected limbs,out of focus,long neck,long body,extra fingers,fewer fingers,,(multi nipples),bad hands,signature,username,bad feet,blurry,bad body”。

          ### 3. 限制：
          - tag 内容用英语单词或短语来描述，并不局限于我给你的单词。注意只能包含关键词或词组。
          - 注意不要输出句子，不要有任何解释。
          - tag数量限制40个以内，单词数量限制在60个以内。
          - tag不要带引号("")。
          - 使用英文半角","做分隔符。
          - tag 按重要性从高到低的顺序排列。
          - 我给你的主题可能是用中文描述，你给出的prompt和negative prompt只用英文。

          ### 4.输出结构:
          - 输出结构使用JSON语法结构，输出的JSON结构中仅包含两个字段: "prompt"和"negative_prompt"
          - 字段"prompt"对应为生成的"prompt"内容
          - 字段"negative_prompt"对应生成的"negative prompt"内容

          ### 5.输出示例
          \`\`\`
          {
            "prompt": "Beautiful Chinese girl, detailed eyes and lips, long black hair, elegant posture, sitting on a traditional Chinese wooden bench in a peaceful garden. (best quality,4k,8k,highres,masterpiece:1.2), ultra-detailed, (realistic,photorealistic,photo-realistic:1.37), HDR, UHD, studio lighting, physically-based rendering, extreme detail description, professional, vivid colors, bokeh, portraits, traditional Chinese painting style, warm color temperature, soft natural light",
            "negative_prompt" : "nsfw, (low quality,normal quality,worst quality,jpeg artifacts), cropped, monochrome, lowres, low saturation, watermark, white letters, skin spots, acnes, skin blemishes, age spot, mutated hands, mutated fingers, deformed, bad anatomy, disfigured, poorly drawn face, extra limb, ugly, poorly drawn hands, missing limb, floating limbs, disconnected limbs, out of focus, long neck, long body, extra fingers, fewer fingers, multi nipples, bad hands, signature, username, bad feet, blurry, bad body."
          }
          \`\`\`
          `,
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
      return { prompt: result.prompt, negative_prompt: result.negative_prompt }
    } catch (ex) {
      return { prompt: '', negative_prompt: '' }
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
    const { prompt, negative_prompt } = await this.generateImagePrompt(
      message,
      key,
      signal,
    )

    const response = await globalThis.fetch(`${this.sdConfig.apiurl}/txt2img`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        cfg_scale: 7,
        prompt,
        negative_prompt,
        steps: 40,
        width: 512,
        height: 512,
      }),
      signal,
    })

    const {
      images: [b64_json],
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
      let timeout = setTimeout(
        () => {
          abortController.abort()
          reject({
            timeout: true,
            messages,
            tokens: JSON.stringify(messages).length,
          })
        },
        options.drawable ? 1000 * 30 : 1000 * 15,
      )

      let startResponse = false
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
          await this.cacheManager.set(
            `${CACHE_MESSAGE}:${responseMessage.id}`,
            {
              role: 'assistant',
              id: responseMessage.id,
              content: responseMessage.text,
              parentMessageId: responseMessage.parentMessageId,
              image: responseMessage.image,
            },
            {
              ttl: MessageExpiresIn,
            },
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

        if (!startResponse) {
          startResponse = true
          // 初始缓存响应消息
          await this.cacheManager.set(
            `${CACHE_MESSAGE}:${responseMessage.id}`,
            {
              role: 'assistant',
              id: responseMessage.id,
              content: '',
              parentMessageId: responseMessage.parentMessageId,
              image: responseMessage.image,
            },
            {
              ttl: MessageExpiresIn,
            },
          )
        }
      }

      const getImageMessage = async () => {
        if (options.drawable) {
          return this.parseImageMessage(message, key, signal)
        } else {
          return false
        }
      }

      try {
        // 获取是否是图片消息
        const drawing = await getImageMessage()

        if (drawing) {
          await this.sendImageMessage({
            message,
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
        }
      }
    })
  }
}
