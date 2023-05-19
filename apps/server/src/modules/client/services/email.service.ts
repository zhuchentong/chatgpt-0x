import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import * as nodemailer from 'nodemailer'
import { EmailConfig } from 'src/config/configurations'

@Injectable()
export class EmailService {
  constructor(
    @Inject(EmailConfig.KEY)
    private readonly emailConfig: ConfigType<typeof EmailConfig>,
  ) {}

  /**
   * 发送邮件
   * @param to
   * @param title
   * @param content
   * @returns
   */
  async sendEmail(to: string, title: string, content: string) {
    const { service, username, password } = this.emailConfig

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
