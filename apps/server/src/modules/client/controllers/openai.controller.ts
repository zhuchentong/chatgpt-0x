import { Controller, Query, Sse } from '@nestjs/common'
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { OpenAIService } from '../services/openai.service'
import { Observable } from 'rxjs'
import { ChatMessageInput } from '../dtos/openai.dto'
import { RequestUser } from 'src/decorators/request-user.decorator'
import { User } from 'src/entities/user.entity'
import { KeyService } from 'src/shared/openai/services/key.service'
import { OpenAIKeyState } from 'src/config/enum.config'

@Controller('openai')
@ApiTags('openai')
@ApiSecurity('access-token')
export class OpenaiController {
  constructor(
    private readonly openai: OpenAIService,
    private keyService: KeyService,
  ) {}

  @ApiOperation({ operationId: 'message', summary: '发送消息' })
  @Sse('message')
  message(
    @Query() { message, parentMessageId, prompt }: ChatMessageInput,
    @RequestUser() _user: User,
  ): Observable<MessageEvent> {
    let retryCount = 0
    const keyService = this.keyService
    const openai = this.openai
    return new Observable((subscriber) => {
      async function send() {
        const key = await keyService.getOpenAIKey()

        openai
          .sendMessage(
            message,
            {
              parentMessageId,
              systemMessage: prompt,
              onProgress: (chat) => {
                subscriber.next({ data: chat } as MessageEvent)
              },
            },
            key,
          )
          .then(() => {
            subscriber.next({ data: '[DONE]' } as MessageEvent)
            subscriber.complete()
          })
          .catch(async () => {
            if (retryCount > 2) {
              subscriber.next({ data: '[DONE]' } as MessageEvent)
              subscriber.complete()
              return
            }

            // 设置key为无效
            await keyService.update(key, { state: OpenAIKeyState.Invalid })

            retryCount += 1
            // 更新key
            send()
          })
      }

      send()
    })
  }
}
