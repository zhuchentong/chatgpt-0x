import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthService } from 'src/core/auth/services/auth.service'
import { PaginatorMode } from 'src/config/enum.config'
import { Administrator } from 'src/entities/administrator.entity'
import { QueryInputParam } from 'src/common/typeorm/interfaces'
import { buildPaginator } from 'src/common/typeorm/query/paginator'
import { Repository } from 'typeorm'

@Injectable()
export class AdministratorService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Administrator)
    private administratorRepository: Repository<Administrator>,
  ) {}

  /**
   * 添加管理员
   * @param username
   * @param password
   * @returns
   */
  public async create(username: string, password: string) {
    const hash = await this.authService.hashPassword(password)

    const administrator = this.administratorRepository.create({
      username,
      password: hash,
    })

    return administrator.save({ reload: true })
  }

  /**
   * 删除管理员
   * @returns
   */
  public async delete(id: string) {
    await this.administratorRepository.delete(id)
  }

  /**
   * 查找管理员
   * @returns
   */
  findAll({ buildWhereQuery, page, order }: QueryInputParam<Administrator>) {
    const builder =
      this.administratorRepository.createQueryBuilder('administrator')

    builder.andWhere(buildWhereQuery())

    const paginator = buildPaginator({
      mode: PaginatorMode.Index,
      entity: Administrator,
      query: {
        order: order,
        skip: page.skip,
        limit: page.limit,
      },
    })

    return paginator.paginate(builder)
  }

  /**
   * 获取管理员
   * @param id
   * @returns
   */
  findOne(id: string) {
    return this.administratorRepository.findOneBy({ id })
  }

  /**
   * 更新管理员
   * @param id
   * @param updateTestDto
   * @returns
   */
  update(id: string, input: Partial<Administrator>) {
    return this.administratorRepository.update(id, input)
  }

  /**
   * 添加管理员
   * @param username
   * @param password
   * @returns
   */
  public async resetAdministratorPassword(id: string) {
    // 生成随机密码
    const password = Math.random().toString(36).slice(-6)

    const hash = await this.authService.hashPassword(password)

    await this.administratorRepository.update(id, {
      password: hash,
    })

    return password
  }

  /**
   * 添加管理员
   * @param username
   * @param password
   * @returns
   */
  public async updateAdministratorPassword(id: string, password: string) {
    // 生成随机密码
    const hash = await this.authService.hashPassword(password)

    await this.administratorRepository.update(id, {
      password: hash,
    })
  }

  /**
   * 添加管理员
   * @param username
   * @param password
   * @returns
   */
  public async countAdministrator() {
    return await this.administratorRepository.count()
  }
}
