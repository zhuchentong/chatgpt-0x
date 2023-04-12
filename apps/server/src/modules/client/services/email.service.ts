import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * 发送邮件
   * @param to
   * @param title
   * @param content
   * @returns
   */
  async sendEmail(to: string, title: string, content: string) {
    const { service, username, password } = await this.configService.get(
      'email',
    )

    const transport = nodemailer.createTransport({
      service,
      secure: true,
      auth: {
        user: username,
        pass: password,
      },
    })

    return transport.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: to,
      subject: title,
      html: content,
    })
  }
}
