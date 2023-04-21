import { Module } from '@nestjs/common'
import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './controllers/app.controller'
import { User } from 'src/entities/user.entity'
import { AuthModule } from 'src/core/auth/auth.module'
import { QiniuModule } from '../../shared/qiniu/qiniu.module'
import { AdministratorController } from './controllers/administrator.controller'
import { AdministratorService } from './services/administrator.service'
import { Administrator } from 'src/entities/administrator.entity'
import { AssistantController } from './controllers/assistant.controller'
import { AssistantService } from './services/assistant.service'
import { Assistant } from 'src/entities/assistant.entity'
import { ProductController } from './controllers/product.controller'
import { ActiveCodeController } from './controllers/active-code.controller'
import { OrderController } from './controllers/order.controller'
import { BalanceController } from './controllers/balance.controller'
import { ProductService } from './services/product.service'
import { BalanceService } from './services/balance.service'
import { OrderService } from './services/order.service'
import { ActiveCodeService } from './services/active-code.service'
import { Product } from 'src/entities/product.entity'
import { ActiveCode } from 'src/entities/active-code.entity'
import { Balance } from 'src/entities/balance.entity'
import { Order } from 'src/entities/order.entity'

@Module({
  imports: [
    AuthModule,
    QiniuModule,
    TypeOrmModule.forFeature([
      Administrator,
      User,
      Assistant,
      Product,
      Balance,
      Order,
      ActiveCode,
    ]),
  ],
  providers: [
    UserService,
    AdministratorService,
    AssistantService,
    ProductService,
    BalanceService,
    OrderService,
    ActiveCodeService,
  ],
  controllers: [
    AdministratorController,
    UserController,
    AppController,
    AssistantController,
    ProductController,
    ActiveCodeController,
    OrderController,
    BalanceController,
  ],
})
export class AdminModule {}
