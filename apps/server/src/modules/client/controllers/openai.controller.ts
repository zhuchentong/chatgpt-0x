import { Controller, Query, Sse } from '@nestjs/common'
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { OpenAIService } from '../services/openai.service'
import { Public } from 'src/decorators/public.decorator'
import { Observable } from 'rxjs'
import { ChatMessageInput } from '../dtos/openai.dto'

@Controller('openai')
@ApiTags('openai')
@ApiSecurity('access-token')
export class OpenaiController {
  constructor(private readonly openai: OpenAIService) {}

  @Public()
  @ApiOperation({ operationId: 'message', summary: '发送消息' })
  @Sse('message')
  message(
    @Query() { message, parentMessageId, prompt }: ChatMessageInput,
  ): Observable<MessageEvent> {
    return new Observable((subscriber) => {
      this.openai
        .sendMessage(message, {
          parentMessageId,
          systemMessage: prompt,
          onProgress: (chat) => {
            subscriber.next({ data: chat } as MessageEvent)
          },
        })
        .then(() => {
          subscriber.next({ data: '[DONE]' } as MessageEvent)
          subscriber.complete()
        })
    })
  }
}
