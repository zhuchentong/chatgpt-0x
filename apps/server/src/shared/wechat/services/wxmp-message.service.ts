import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache } from 'cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import {
  InAuthEvent,
  InAuthMpEvent,
  InBatchJobResult,
  InBatchJobResultEvent,
  InComponentVerifyTicket,
  InEnterAgentEvent,
  InExternalContact,
  InExternalContactEvent,
  InFollowEvent,
  InImageMsg,
  InLinkMsg,
  InLocationEvent,
  InLocationMsg,
  InMassEvent,
  InMenuEvent,
  InMsg,
  InNotDefinedMsg,
  InQrCodeEvent,
  InRegisterCorp,
  InShakearoundUserShakeEvent,
  InShortVideoMsg,
  InSpeechRecognitionResults,
  InSuiteTicket,
  InTaskEvent,
  InTemplateMsgEvent,
  InTextMsg,
  InUpdatePartyEvent,
  InUpdateTagEvent,
  InUpdateUserEvent,
  InVideoMsg,
  InVoiceMsg,
  InWxVerifyDispatchEvent,
  MsgAdapter,
  OutImageMsg,
  OutMsg,
  OutTextMsg,
  OutVideoMsg,
  OutVoiceMsg,
} from 'tnwx'
import { OpenAIService } from 'src/modules/client/services/openai.service'

@Injectable()
export class WXMPMessageService implements MsgAdapter {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly openAIService: OpenAIService,
  ) {}

  async processInTextMsg(inTextMsg: InTextMsg): Promise<OutMsg> {
    const content = inTextMsg.getContent

    switch (true) {
      case !!content:
        const outTextMsg = new OutTextMsg(inTextMsg)
        const { text } = await this.openAIService.sendMessage(content, {
          stream: false,
        })
        outTextMsg.setContent(text)
        return outTextMsg
    }
    // let content = 'IJPay 让支付触手可及 \n\nhttps://gitee.com/javen205/IJPay'
    // if ('极速开发微信公众号' == inTextMsg.getContent) {
    //   // 多公众号支持 分别给不同的公众号发送不同的消息
    //   if (ApiConfigKit.getApiConfig.getAppId == 'wx614c453e0d1dcd12') {
    //     content =
    //       '极速开发微信公众号 \n\nhttps://github.com/javen205/weixin_guide'
    //     outMsg = new OutTextMsg(inTextMsg)
    //     outMsg.setContent(content)
    //   } else {
    //     content = '极速开发微信公众号 \n\nhttps://github.com/javen205/TNWX'
    //     outMsg = new OutTextMsg(inTextMsg)
    //     outMsg.setContent(content)
    //   }
    // } else if ('聚合支付' == inTextMsg.getContent) {
    //   // 最新规则：开发者只能回复1条图文消息；其余场景最多可回复8条图文消息
    //   outMsg = new OutNewsMsg(inTextMsg)
    //   outMsg.addArticle(
    //     '聚合支付了解下',
    //     'IJPay 让支付触手可及',
    //     'https://gitee.com/javen205/IJPay/raw/master/assets/img/IJPay-t.png',
    //     'https://gitee.com/javen205/IJPay',
    //   )
    //   outMsg.addArticle(
    //     'jfinal-weixin',
    //     '极速开发微信公众号',
    //     'https://gitee.com/javen205/IJPay/raw/master/assets/img/IJPay-t.png',
    //     'https://gitee.com/JFinal/jfinal-weixin',
    //   )
    // } else {
    //   // outMsg = new OutTextMsg(inTextMsg);
    //   // outMsg.setContent(content);
    //   // 转发给多客服PC客户端
    //   outMsg = new OutCustomMsg(inTextMsg)
    //   console.log('转发给多客服PC客户端')
    // }
    // return outMsg
  }

  async processInImageMsg(inImageMsg: InImageMsg): Promise<OutMsg> {
    const outMsg = new OutImageMsg(inImageMsg)
    outMsg.setMediaId = inImageMsg.getMediaId
    return outMsg
  }
  async processInVoiceMsg(inVoiceMsg: InVoiceMsg): Promise<OutMsg> {
    const outMsg = new OutVoiceMsg(inVoiceMsg)
    outMsg.setMediaId = inVoiceMsg.getMediaId
    return outMsg
  }
  async processInVideoMsg(inVideoMsg: InVideoMsg): Promise<OutMsg> {
    const outMsg = new OutVideoMsg(inVideoMsg)
    outMsg.setMediaId = inVideoMsg.getMediaId
    outMsg.setDescription = 'IJPay 让支付触手可及'
    outMsg.setTitle = '视频消息'
    return outMsg
  }
  async processInShortVideoMsg(
    inShortVideoMsg: InShortVideoMsg,
  ): Promise<OutMsg> {
    const outMsg = new OutVideoMsg(inShortVideoMsg)
    outMsg.setMediaId = inShortVideoMsg.getMediaId
    outMsg.setDescription = 'TypeScript + Node.js 开发微信公众号'
    outMsg.setTitle = '短视频消息'
    return outMsg
  }
  async processInLocationMsg(inLocationMsg: InLocationMsg): Promise<OutMsg> {
    return this.renderOutTextMsg(
      inLocationMsg,
      '位置消息... \n\nX:' +
        inLocationMsg.getLocation_X +
        ' Y:' +
        inLocationMsg.getLocation_Y +
        '\n\n' +
        inLocationMsg.getLabel,
    )
  }
  async processInLinkMsg(inLinkMsg: InLinkMsg): Promise<OutMsg> {
    const text = new OutTextMsg(inLinkMsg)
    text.setContent('链接频消息...' + inLinkMsg.getUrl)
    return text
  }
  async processInSpeechRecognitionResults(
    inSpeechRecognitionResults: InSpeechRecognitionResults,
  ): Promise<OutMsg> {
    const text = new OutTextMsg(inSpeechRecognitionResults)
    text.setContent(
      '语音识别消息...' + inSpeechRecognitionResults.getRecognition,
    )
    return text
  }

  async processInFollowEvent(inFollowEvent: InFollowEvent): Promise<OutMsg> {
    if (InFollowEvent.EVENT_INFOLLOW_SUBSCRIBE == inFollowEvent.getEvent) {
      return this.renderOutTextMsg(
        inFollowEvent,
        '感谢你的关注 么么哒 \n\n QQ：25463204',
      )
    } else if (
      InFollowEvent.EVENT_INFOLLOW_UNSUBSCRIBE == inFollowEvent.getEvent
    ) {
      console.error('取消关注：' + inFollowEvent.getFromUserName)
      return this.renderOutTextMsg(inFollowEvent)
    } else {
      return this.renderOutTextMsg(inFollowEvent)
    }
  }

  async processInQrCodeEvent(inQrCodeEvent: InQrCodeEvent): Promise<OutMsg> {
    const openid = inQrCodeEvent.getFromUserName

    switch (true) {
      case inQrCodeEvent.getEventKey.startsWith('QRCODE_LOGIN:'):
        this.cacheManager.set(inQrCodeEvent.getEventKey, openid, 60 * 5)
        break
    }

    // 回复消息
    switch (inQrCodeEvent.getEvent) {
      case InQrCodeEvent.EVENT_INQRCODE_SUBSCRIBE:
        return this.renderOutTextMsg(inQrCodeEvent, '感谢您的关注')
      case InQrCodeEvent.EVENT_INQRCODE_SCAN:
      default:
        return this.renderOutTextMsg(inQrCodeEvent)
    }
  }

  async processInLocationEvent(
    inLocationEvent: InLocationEvent,
  ): Promise<OutMsg> {
    console.debug('发送地理位置事件：' + inLocationEvent.getFromUserName)

    return this.renderOutTextMsg(
      inLocationEvent,
      '地理位置是：' + inLocationEvent.getLatitude,
    )
  }
  async processInMenuEvent(inMenuEvent: InMenuEvent): Promise<OutMsg> {
    console.debug('菜单事件：' + inMenuEvent.getFromUserName)

    return this.renderOutTextMsg(
      inMenuEvent,
      '菜单事件内容是：' + inMenuEvent.getEventKey,
    )
  }
  async processInTemplateMsgEvent(
    inTemplateMsgEvent: InTemplateMsgEvent,
  ): Promise<OutMsg> {
    console.debug(
      '模板消息事件：' +
        inTemplateMsgEvent.getFromUserName +
        ' ' +
        inTemplateMsgEvent.getStatus,
    )
    return this.renderOutTextMsg(
      inTemplateMsgEvent,
      '消息发送状态：' + inTemplateMsgEvent.getStatus,
    )
  }

  async processInShakearoundUserShakeEvent(
    inShakearoundUserShakeEvent: InShakearoundUserShakeEvent,
  ): Promise<OutMsg> {
    console.debug(
      '摇一摇事件：' +
        inShakearoundUserShakeEvent.getFromUserName +
        ' ' +
        inShakearoundUserShakeEvent.getUuid,
    )
    return this.renderOutTextMsg(
      inShakearoundUserShakeEvent,
      'uuid：' + inShakearoundUserShakeEvent.getUuid,
    )
  }

  async processIsNotDefinedMsg(
    inNotDefinedMsg: InNotDefinedMsg,
  ): Promise<OutMsg> {
    return this.renderOutTextMsg(inNotDefinedMsg, '未知消息')
  }

  async renderOutTextMsg(inMsg: InMsg, content?: string): Promise<OutTextMsg> {
    const outMsg = new OutTextMsg(inMsg)
    outMsg.setContent(content ? content : ' ')
    return outMsg
  }

  processInWxVerifyDispatchEvent(
    inWxVerifyDispatchEvent: InWxVerifyDispatchEvent,
  ): Promise<OutMsg> {
    throw new Error('Method not implemented.')
  }
  processInTaskEvent(inTaskEvent: InTaskEvent): Promise<OutMsg> {
    throw new Error('Method not implemented.')
  }
  processInEnterAgentEvent(
    inEnterAgentEvent: InEnterAgentEvent,
  ): Promise<OutMsg> {
    throw new Error('Method not implemented.')
  }
  processInBatchJobResultEvent(
    inBatchJobResultEvent: InBatchJobResultEvent,
  ): Promise<OutMsg> {
    throw new Error('Method not implemented.')
  }
  processInUpdateUserEvent(
    inUpdateUserEvent: InUpdateUserEvent,
  ): Promise<OutMsg> {
    throw new Error('Method not implemented.')
  }
  processInUpdatePartyEvent(
    inUpdatePartyEvent: InUpdatePartyEvent,
  ): Promise<OutMsg> {
    throw new Error('Method not implemented.')
  }
  processInUpdateTagEvent(inUpdateTagEvent: InUpdateTagEvent): Promise<OutMsg> {
    throw new Error('Method not implemented.')
  }
  processInMassEvent(inMassEvent: InMassEvent): Promise<OutMsg> {
    throw new Error('Method not implemented.')
  }
  processInSuiteTicket(inSuiteTicket: InSuiteTicket): Promise<string> {
    throw new Error('Method not implemented.')
  }
  processInComponentVerifyTicket(
    inComponentVerifyTicket: InComponentVerifyTicket,
  ): Promise<string> {
    throw new Error('Method not implemented.')
  }
  processInAuthEvent(inAuthEvent: InAuthEvent): Promise<string> {
    throw new Error('Method not implemented.')
  }
  processInAuthMpEvent(inAuthMpEvent: InAuthMpEvent): Promise<string> {
    throw new Error('Method not implemented.')
  }
  processInBatchJobResult(inBatchJobResult: InBatchJobResult): Promise<string> {
    throw new Error('Method not implemented.')
  }
  processInExternalContactEvent(
    inExternalContactEvent: InExternalContactEvent,
  ): Promise<string> {
    throw new Error('Method not implemented.')
  }
  processInExternalContact(
    inExternalContact: InExternalContact,
  ): Promise<string> {
    throw new Error('Method not implemented.')
  }
  processInRegisterCorp(inRegisterCorp: InRegisterCorp): Promise<string> {
    throw new Error('Method not implemented.')
  }
}
