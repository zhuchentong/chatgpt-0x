import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class AdminPasswordAuthGuard extends AuthGuard('admin-password') {}
