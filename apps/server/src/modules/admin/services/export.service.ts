import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import dayjs from 'dayjs'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'
import fs from 'node:fs'
import os from 'node:os'

const ROOT = '/data'
@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private exportAccountData(user: User, datetime: string) {
    const indexFile = `${ROOT}/exports/${datetime}/data.json`
    const accountFile = `${ROOT}/exports/${datetime}/${user.id}.json`

    fs.writeFileSync(indexFile, user.id + os.EOL, {
      flag: 'a',
    })

    fs.writeFileSync(accountFile, JSON.stringify(user))
  }

  async exportUserAccount() {
    const users = []
    const userCount = await this.userRepository.count()
    const datetime = dayjs().format('YYYYMMDDHHmmss')

    if (!fs.existsSync(`${ROOT}/exports`)) {
      fs.mkdirSync(`${ROOT}/exports`)
    }

    if (!fs.existsSync(`${ROOT}/exports/${datetime}`)) {
      fs.mkdirSync(`${ROOT}/exports/${datetime}`)
    }

    while (users.length < userCount) {
      const data = await this.userRepository.find({
        take: 2,
        skip: users.length,
        relations: {
          balances: true,
        },
        order: {
          createdAt: 'DESC',
        },
      })

      users.push(...data.map((x) => x.id))
      // 导出文件

      for (const user of data) {
        await this.exportAccountData(user, datetime)
      }
    }
  }
}
