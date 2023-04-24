import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { AuthModule } from 'src/core/auth/auth.module'
import { AppController } from './controllers/app.controller'
import { AppService } from './services/app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmailService } from './services/email.service'
import { UserService } from './services/user.service'
import { User } from 'src/entities/user.entity'
import { OpenAIService } from './services/openai.service'
import { OpenaiController } from './controllers/openai.controller'
import { WechatModule } from 'src/shared/wechat/wechat.module'
import { AssistantService } from './services/assistant.service'
import { Assistant } from 'src/entities/assistant.entity'
import { AssistantController } from './controllers/assistant.controller'
import { OpenAIModule } from 'src/shared/openai/openai.module'

@Module({
  imports: [
    HttpModule,
    AuthModule,
    WechatModule,
    TypeOrmModule.forFeature([User, Assistant]),
    OpenAIModule,
  ],
  controllers: [AppController, OpenaiController, AssistantController],
  providers: [
    AppService,
    EmailService,
    UserService,
    OpenAIService,
    AssistantService,
  ],
  exports: [OpenAIService],
})
export class ClientModule {}
