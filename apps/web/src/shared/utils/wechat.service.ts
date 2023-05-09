import { useRequest } from 'virtual:request'

declare const wx: any

interface WxPayConfig {
  timestamp: number // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
  nonceStr: string // 支付签名随机串，不长于 32 位
  package: string // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
  signType: string // 微信支付V3的传入RSA,微信支付V2的传入格式与V2统一下单的签名格式保持一致
  paySign: string // 支付签名
  success?: (res: any) => void
  fail?: (res: any) => void
}

const wechatApiList = [
  'chooseWXPay',
  'chooseImage',
  'uploadImage',
  'updateAppMessageShareData',
]

interface wxConfig {
  beta?: boolean // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
  debug?: boolean // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
  appId: string // 必填，企业微信的corpID
  timestamp: number // 必填，生成签名的时间戳
  nonceStr: string // 必填，生成签名的随机串
  signature: string // 必填，签名，见 附录-JS-SDK使用权限签名算法
  jsApiList: string[]
  agentid: number
}

class BaseType {}

class tempConfig extends BaseType {
  count: number // 默认9
  sizeType: string[] // 可以指定是原图还是压缩图，默认二者都有
  sourceType: string[] // 可以指定来源是相册还是相机，默认二者都有
  defaultCameraMode: string // 表示进入拍照界面的默认模式，目前有normal与batch两种选择，normal表示普通单拍模式，batch表示连拍模式，不传该参数则为normal模式。从3.0.26版本开始支持front和batch_front两种值，其中front表示默认为前置摄像头单拍模式，batch_front表示默认为前置摄像头连拍模式。（注：用户进入拍照界面仍然可自由切换两种模式）
  isSaveToAlbum: number
}

class shareConfig extends BaseType {
  title: string // 默认9
  desc: string // 可以指定是原图还是压缩图，默认二者都有
  link: string // 可以指定来源是相册还是相机，默认二者都有
  imgUrl: string // 表示进入拍照界面的默认模式，目前有normal与batch两种选择，normal表示普通单拍模式，batch表示连拍模式，不传该参数则为normal模式。从3.0.26版本开始支持front和batch_front两种值，其中front表示默认为前置摄像头单拍模式，batch_front表示默认为前置摄像头连拍模式。（注：用户进入拍照界面仍然可自由切换两种模式）
}

class uploadType extends BaseType {
  localId: string // 需要上传的图片的本地ID，由chooseImage接口获得
  isShowProgressTips: number // 默认为1，显示进度提示
}

export class WechatService {
  private static sites: string[] = []
  private wechatService = useRequest((service) => service.WechatService)

  private wechatConfig(config: Partial<wxConfig>) {
    return new Promise<void>((resolve, reject) => {
      wx.ready(resolve)
      wx.error(reject)

      wx.config({
        ...config,
        beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        jsApiList: wechatApiList, // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
      })
    })
  }

  private async configSite() {
    const url = location.href
    if (WechatService.sites.includes(url)) return Promise.resolve()

    const { appId, signature, timestamp, nonceStr } =
      await this.wechatService.getJSSignature({
        url,
      })

    await this.wechatConfig({ appId, signature, timestamp, nonceStr })

    WechatService.sites.push(url)
  }

  /**
   * 检测API
   */
  private async checkJsApi(api: string) {
    return new Promise<void>((resolve, reject) => {
      wx.checkJsApi({
        jsApiList: [api], // 需要检测的JS接口列表
        success: ({
          checkResult,
        }: {
          checkResult: { [key: string]: number }
        }) => {
          if (!checkResult[api]) return reject()

          resolve()
        },
        fail: () => {
          reject()
        },
      })
    })
  }

  /**
   * 执行api
   * @param api
   * @param config
   * @returns
   */
  private async invoke(api: string, config: BaseType) {
    // 配置检查
    await this.configSite()
    // api检查
    await this.checkJsApi(api)

    return wx[api].bind(wx)(config)
  }

  public updateAppMessageShareData(config: shareConfig) {
    return this.invoke('updateAppMessageShareData', config)
  }

  public choiceImage(config: tempConfig) {
    return this.invoke('chooseImage', config)
  }

  public uploadImage(config: uploadType) {
    return this.invoke('uploadImage', config)
  }

  public chooseWXPay(config: WxPayConfig) {
    return this.invoke('chooseWXPay', config)
  }
}
