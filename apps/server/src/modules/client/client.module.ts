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
import { BalanceController } from './controllers/balance.controller'
import { ActiveCodeController } from './controllers/active-code.controller'
import { OrderController } from './controllers/order.controller'
import { ProductController } from './controllers/product.controller'
import { ActiveCodeService } from './services/active-code.service'
import { OrderService } from './services/order.service'
import { ProductService } from './services/product.service'
import { BalanceService } from './services/balance.service'
import { ActiveCode } from 'src/entities/active-code.entity'
import { Balance } from 'src/entities/balance.entity'
import { Order } from 'src/entities/order.entity'
import { Product } from 'src/entities/product.entity'
import { OpenAIModule } from 'src/shared/openai/openai.module'
import { Invite } from 'src/entities/invite.entity'
import { InviteService } from './services/invite.service'
import { InviteController } from './controllers/invite.controller'

@Module({
  imports: [
    HttpModule,
    AuthModule,
    WechatModule,
    OpenAIModule,
    TypeOrmModule.forFeature([
      User,
      Assistant,
      ActiveCode,
      Balance,
      Order,
      Product,
      Invite,
    ]),
  ],
  controllers: [
    AppController,
    OpenaiController,
    AssistantController,
    BalanceController,
    ActiveCodeController,
    OrderController,
    ProductController,
    InviteController,
  ],
  providers: [
    AppService,
    EmailService,
    BalanceService,
    UserService,
    OpenAIService,
    AssistantService,
    ActiveCodeService,
    OrderService,
    ProductService,
    InviteService,
  ],
  exports: [OpenAIService],
})
export class ClientModule {}
