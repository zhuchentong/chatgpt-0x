import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OpenAIKey } from 'src/entities/openai-key.entity'
import { HttpModule } from '@nestjs/axios'
import { KeyController } from './controllers/key.controller'
import { KeyService } from './services/key.service'

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([OpenAIKey])],
  controllers: [KeyController],
  providers: [KeyService],
  exports: [KeyService],
})
export class OpenAIModule {}
