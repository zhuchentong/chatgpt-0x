import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { AuthModule } from 'src/auth/auth.module'
import { AppController } from './controllers/app.controller'
import { AppService } from './services/app.service'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [HttpModule, AuthModule, TypeOrmModule.forFeature([])],
  controllers: [AppController],
  providers: [AppService],
})
export class ClientModule {}
