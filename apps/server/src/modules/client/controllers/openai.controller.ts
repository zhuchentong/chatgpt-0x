import { Controller, Query, Sse } from '@nestjs/common'
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { OpenAIService } from '../services/openai.service'
import { Observable, Subscriber, from } from 'rxjs'
import { ChatMessageInput } from '../dtos/openai.dto'
import { BalanceService } from '../services/balance.service'
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
    private readonly balanceService: BalanceService,
    private readonly keyService: KeyService,
    private readonly logger: Logger,
  ) {}

  /**
   * 尝试发送消息
   * @param input
   * @param subscriber
   * @param key
   * @param user
   * @returns
   */
  private async trySendMessage(
    { message, parentMessageId, prompt }: ChatMessageInput,
    subscriber: Subscriber<MessageEvent<any>>,
    key: string,
    user: User,
  ) {
    return this.openai
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
        this.balanceService.consumeUserBalance(user.id)
      })
  }

  @ApiOperation({ operationId: 'message', summary: '发送消息' })
  @Sse('message')
  async message(
    @Query() input: ChatMessageInput,
    @RequestUser() user: User,
  ): Promise<Observable<MessageEvent>> {
    // 获取用户余额
    const balance = await this.balanceService.getUserBalance(user.id)

    // 输入余额日志
    this.logger.debug(balance)

    if (!balance) {
      return from([
        {
          data: '[ERROR]余额不足,添加微信群可以领取更多免费额度哦~',
        } as MessageEvent,
      ])
    }

    // 获取key
    let key = await this.keyService.getOpenAIKey()
    // 重置次数
    let retryCount = 0
    return new Observable((subscriber) => {
      this.trySendMessage(input, subscriber, key, user).catch(async (ex) => {
        // 增加重试次数
        retryCount += 1
        // 监测最大重试次数
        if (retryCount > 2) {
          subscriber.next({
            data: '[ERROR]对话失败,请稍候重新尝试',
          } as MessageEvent)
          subscriber.complete()
          return
        }

        this.logger.error('消息发送错误:', ex)

        // 设置key为无效
        if (ex?.statusCode !== 429) {
          await this.keyService.update(key, { state: OpenAIKeyState.Invalid })
        }
        //  获取新的Key
        key = await this.keyService.getOpenAIKey()
        // 重试通化
        this.trySendMessage(input, subscriber, key, user)
      })
    })
  }
}
