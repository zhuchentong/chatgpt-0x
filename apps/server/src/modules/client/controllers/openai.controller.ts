import { Controller, Query, Sse } from '@nestjs/common'
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { OpenAIService } from '../services/openai.service'
import { Observable } from 'rxjs'
import { ChatMessageInput } from '../dtos/openai.dto'
import { RequestUser } from 'src/decorators/request-user.decorator'
import { User } from 'src/entities/user.entity'
import { KeyService } from 'src/shared/openai/services/key.service'
import { OpenAIKeyState } from 'src/config/enum.config'
import { Logger } from 'src/core/logger/services/logger.service'

@Controller('openai')
@ApiTags('openai')
@ApiSecurity('access-token')
export class OpenaiController {
  constructor(
    private readonly openai: OpenAIService,
    private readonly keyService: KeyService,
    private readonly logger: Logger,
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
    const logger = this.logger
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
          .catch(async (ex) => {
            if (retryCount > 2) {
              subscriber.next({ data: '[DONE]' } as MessageEvent)
              subscriber.complete()
              return
            }

            logger.error('消息发送错误:', { ex }, JSON.stringify(ex))
            // 设置key为无效
            await keyService.update(key, { state: OpenAIKeyState.Invalid })
            // 重试
            retryCount += 1
            // 更新key
            send()
          })
      }

      send()
    })
  }
}
