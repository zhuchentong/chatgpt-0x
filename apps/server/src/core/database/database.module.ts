import { Module, Global } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseService } from './services/database.service'

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseService,
    }),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
