import { Module } from '@nestjs/common'
import { TokenService } from './services/token.service'
import { QiniuController } from './controllers/qiniu.controller'
import { FileService } from './services/file.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RequestContext } from 'src/middlewaves/request-context.middlewave'

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [QiniuController],
  providers: [TokenService, FileService, RequestContext],
  exports: [TokenService, FileService],
})
export class QiniuModule {}
