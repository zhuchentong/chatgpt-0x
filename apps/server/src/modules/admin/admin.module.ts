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

@Module({
  imports: [
    AuthModule,
    QiniuModule,
    TypeOrmModule.forFeature([Administrator, User, Assistant]),
  ],
  providers: [UserService, AdministratorService, AssistantService],
  controllers: [
    AdministratorController,
    UserController,
    AppController,
    AssistantController,
  ],
})
export class AdminModule {}
