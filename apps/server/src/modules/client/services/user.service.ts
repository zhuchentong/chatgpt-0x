import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthService } from 'src/core/auth/services/auth.service'
import { User } from 'src/entities/user.entity'
import { FindOptionsWhere, Repository } from 'typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  /**
   * 创建用户
   * @param username
   * @param password
   * @returns
   */
  public async createByEmailPassword(email: string, password: string) {
    const hash = await this.authService.hashPassword(password)

    const user = this.userRepository.create({
      email,
      password: hash,
    })

    return user.save({ reload: true })
  }

  /**
   * 添加管理员
   * @param username
   * @param password
   * @returns
   */
  public async createByOpenID(openid: string) {
    const user = this.userRepository.create({
      openid,
    })

    return user.save({ reload: true })
  }

  /**
   * 获取管理员
   * @param id
   * @returns
   */
  findOne(id: string) {
    return this.userRepository.findOneBy({ id })
  }

  /**
   * 获取管理员
   * @param id
   * @returns
   */
  findOneBy(user: FindOptionsWhere<User>) {
    return this.userRepository.findOneBy(user)
  }
}
