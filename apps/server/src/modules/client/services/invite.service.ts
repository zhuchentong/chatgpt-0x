import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Invite } from 'src/entities/invite.entity'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(Invite)
    private inviteRepository: Repository<Invite>,
  ) {}

  /**
   *  创建
   * @param input
   * @returns
   */
  create(input: Partial<Invite>) {
    const product = this.inviteRepository.create(input)
    return this.inviteRepository.save(product)
  }

  /**
   * 获取当前用户的邀请记录
   * @param user
   * @returns
   */
  getAll(user: User) {
    return this.inviteRepository.find({
      where: {
        inviter: {
          id: user.id,
        },
      },
      relations: {
        inviterReward: true,
        invitee: true,
      },
      order: {
        createdAt: 'DESC',
      },
    })
  }
}
