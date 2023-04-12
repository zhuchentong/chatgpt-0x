import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { AuthModule } from 'src/auth/auth.module'
import { AppController } from './controllers/app.controller'
import { AppService } from './services/app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmailService } from './services/email.service'
import { UserService } from './services/user.service'
import { User } from 'src/entities/user.entity'
import { OpenAIService } from './services/openai.service'
import { OpenaiController } from './controllers/openai.controller'

@Module({
  imports: [HttpModule, AuthModule, TypeOrmModule.forFeature([User])],
  controllers: [AppController, OpenaiController],
  providers: [AppService, EmailService, UserService, OpenAIService],
})
export class ClientModule {}
