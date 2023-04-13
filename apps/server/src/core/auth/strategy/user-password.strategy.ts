import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { AuthService } from '../services/auth.service'
import { Strategy } from 'passport-custom'
import { IncomingMessage } from 'http'

@Injectable()
export class UserPasswordStrategy extends PassportStrategy(
  Strategy,
  'user-password',
) {
  constructor(private authService: AuthService) {
    super()
  }

  async validate(req: any): Promise<any> {
    const { email, password } = req.body
    // 用户登录
    const user = this.authService.userLogin(email, password)

    if (user) {
      return user
    }
  }
}
