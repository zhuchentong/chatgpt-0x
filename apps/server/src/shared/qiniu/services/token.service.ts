import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import * as qiniu from 'qiniu'
import { QiniuConfig } from 'src/config/configurations'

@Injectable()
export class TokenService {
  constructor(
    @Inject(QiniuConfig.KEY)
    private readonly qiniuConfig: ConfigType<typeof QiniuConfig>,
  ) {}

  /**
   * 获取Token
   */
  public getUploadToken() {
    const storage = this.qiniuConfig.storage

    const sign = this.getSign()

    const options = {
      scope: storage.temp.bucket,
      expires: 60 * 60 * 2,
    }

    const putPolicy = new qiniu.rs.PutPolicy(options)
    const uploadToken = putPolicy.uploadToken(sign)

    return uploadToken
  }

  /**
   * 获取签名
   * @returns
   */
  public getSign() {
    const { accessKey, secretKey } = this.qiniuConfig

    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    return mac
  }
}
