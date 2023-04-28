import { ProductType } from './enum.config'

export default () => ({
  app: {
    port: process.env.APP_PORT,
    secret: process.env.APP_SECRET,
    saltRounds: process.env.APP_SALT_ROUNDS,
  },
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB,
  },
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
  },
  qiniu: {
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
  },
  weapp: {
    appid: process.env.WEAPP_APPID,
    secret: process.env.WEAPP_SECRET,
  },
  wxmp: {
    appid: process.env.WXMP_APPID,
    secret: process.env.WXMP_SECRET,
    token: process.env.WXMP_TOKEN,
    aeskey: process.env.WXMP_AESKEY,
  },
  wxpay: {
    appId: process.env.WECHAT_PEY_APPID,
    mchId: process.env.WECHAT_PAY_MCHID,
    serialNo: process.env.WECHAT_PAY_SERIAL,
    keyPath: process.env.WECHAT_PAY_KEYPATH,
    certPath: process.env.WECHAT_PAY_CERTPATH,
    privateKey: process.env.WECHAT_PAY_PRIVATE_KEY,
  },
  email: {
    service: process.env.EMAIL_SERVICE,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
  },
  openai: {
    apiurl: process.env.OPENAI_APIURL,
    apikey: process.env.OPENAI_APIKEY,
  },
  // TODO: 迁移到配置中心
  setting: {
    balance: {
      enable: true,
      events: {
        register: {
          type: ProductType.Count,
          value: 3,
        },
        inviter: {
          type: ProductType.Count,
          value: 5,
        },
        invitee: {
          type: ProductType.Count,
          value: 2,
        },
      },
    },
  },
})
