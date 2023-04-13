import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as qiniu from 'qiniu'
import { TokenService } from './token.service'
import { nanoid } from 'nanoid'
import { RequestContext } from 'src/middlewaves/request-context.middlewave'
import { Logger } from 'src/core/logger/services/logger.service'

@Injectable()
export class FileService {
  constructor(
    private readonly config: ConfigService,
    private readonly tokenService: TokenService,
    private readonly requestContext: RequestContext,
    private logger: Logger,
  ) {}

  /**
   * 获取BucketManager
   * @returns
   */
  private getBucketManager() {
    const sign = this.tokenService.getSign()

    return new qiniu.rs.BucketManager(
      sign,
      new qiniu.conf.Config({
        zone: qiniu.zone.Zone_z2,
      }),
    )
  }

  public listFile(bucket: string, prefix: string) {
    const bucketManager = this.getBucketManager()

    return new Promise<any[]>((resolve) =>
      bucketManager.listPrefix(bucket, { prefix }, (_, files) => {
        return resolve(files.items)
      }),
    )
  }

  private copyFile(sourceBucket, targetBucket, key) {
    const bucketManager = this.getBucketManager()

    return new Promise<void>((resolve, reject) => {
      bucketManager.copy(
        sourceBucket,
        key,
        targetBucket,
        key,
        { force: true },
        (err) => {
          if (err) {
            return reject()
          }

          // 保存成功
          resolve()
        },
      )
    })
  }

  /**
   * 保存文件
   * @param key
   */
  public async save(key: string) {
    const tempBucket = this.config.get('qiniu.storage.temp.bucket')
    const mainBucket = this.config.get('qiniu.storage.main.bucket')

    const [tempFile] = await this.listFile(tempBucket, key)
    const [mainFile] = await this.listFile(mainBucket, key)

    if (!tempFile) {
      this.logger.warn(`无法找到素材(${key})`)
      return
    }

    if (mainFile) {
      this.logger.warn(`素材(${key})已存在`)
      return
    }

    await this.copyFile(tempBucket, mainBucket, key)
  }

  /**
   * 下载外部资源
   * @param url
   * @param key
   * @returns
   */
  public download(url: string, key: string = nanoid()) {
    const mainBucket = this.config.get('qiniu.storage.main.bucket')

    const bucketManager = this.getBucketManager()

    return new Promise<string>((resolve, reject) => {
      bucketManager.fetch(url, mainBucket, key, (err, respBody, respInfo) => {
        if (err) {
          return reject(`外部资源${key}下载失败`)
        }

        resolve(key)
      })
    })
  }
}
