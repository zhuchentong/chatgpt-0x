import { registerAs } from '@nestjs/config'
import { ProductType } from './enum.config'

export const AppConfig = registerAs('app', () => ({
  port: process.env.APP_PORT,
  secret: process.env.APP_SECRET,
  saltRounds: process.env.APP_SALT_ROUNDS,
}))

export const DatabaseConfig = registerAs('database', () => ({
  type: process.env.DATABASE_TYPE as any,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
}))

export const RedisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DB,
  ttl: 60 * 60 * 24,
}))

export const JwtConfig = registerAs('jwd', () => ({
  accessTokenSecret: process.env.JWT_ACCESS_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenExpiresIn: 60 * 60 * 12,
  refreshTokenExpiresIn: 60 * 60 * 24 * 30,
}))

export const QiniuConfig = registerAs('qiniu', () => ({
  storage: {
    main: {
      bucket: process.env.QINIU_MAIN_BUCKET,
      domain: process.env.QINIU_MAIN_DOMAIN,
    },
    temp: {
      bucket: process.env.QINIU_TEMP_BUCKET,
      domain: process.env.QINIU_TEMP_DOMAIN,
    },
  },
  accessKey: process.env.QINIU_ACCESS_KEY,
  secretKey: process.env.QINIU_SECRET_KEY,
}))

export const WeappConfig = registerAs('weapp', () => ({
  appid: process.env.WEAPP_APPID,
  secret: process.env.WEAPP_SECRET,
}))

export const WxmpConfig = registerAs('wxmp', () => ({
  appid: process.env.WXMP_APPID,
  secret: process.env.WXMP_SECRET,
  token: process.env.WXMP_TOKEN,
  aeskey: process.env.WXMP_AESKEY,
}))

export const WxpayConfig = registerAs('wxpay', () => ({
  appid: process.env.WECHAT_PAY_APPID,
  mchId: process.env.WECHAT_PAY_MCHID,
  serialNo: process.env.WECHAT_PAY_SERIAL,
  keyPath: process.env.WECHAT_PAY_KEYPATH,
  certPath: process.env.WECHAT_PAY_CERTPATH,
  privateKey: process.env.WECHAT_PAY_PRIVATE_KEY,
}))

export const EmailConfig = registerAs('email', () => ({
  service: process.env.EMAIL_SERVICE,
  username: process.env.EMAIL_USERNAME,
  password: process.env.EMAIL_PASSWORD,
}))

export const OpenaiConfig = registerAs('openai', () => ({
  apiurl: process.env.OPENAI_APIURL,
  apikey: process.env.OPENAI_APIKEY,
}))

export const SettingConfig = registerAs('setting', () => ({
  balance: {
    enable: true,
    events: {
      register: {
        type: ProductType.Count,
        value: 20,
      },
      inviter: {
        type: ProductType.Count,
        value: 30,
      },
      invitee: {
        type: ProductType.Count,
        value: 10,
      },
    },
  },
}))

export default [
  AppConfig,
  DatabaseConfig,
  RedisConfig,
  JwtConfig,
  QiniuConfig,
  WeappConfig,
  WxmpConfig,
  WxpayConfig,
  EmailConfig,
  OpenaiConfig,
  SettingConfig,
]
