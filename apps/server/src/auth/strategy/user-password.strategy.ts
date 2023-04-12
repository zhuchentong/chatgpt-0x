import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { AuthService } from '../services/auth.service'

@Injectable()
export class UserPasswordStrategy extends PassportStrategy(
  Strategy,
  'user-password',
) {
  constructor(private authService: AuthService) {
    super()
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.userLogin(email, password)

    if (user) {
      return user
    }
  }
}
