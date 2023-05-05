// #region 系统字典
/**
 * Tab操作
 */
export enum TabAction {
  CLOSE_OTHER,
  CLOSE_RIGHT,
}

export enum DisplayScene {
  List = 'LIST',
  Cover = 'COVER',
  Normal = 'NORMAL',
  Avatar = 'AVATAR',
}

export enum FileType {
  Image = 'IMAGE',
  Video = 'VIDEO',
  Document = 'DOCUMENT',
  Other = 'OTHER',
}

/**
 * 支付订单状态
 */
export enum OrderState {
  Pending = 'PENDING', // 待支付
  Paid = 'PAID', // 已支付
  Expired = 'EXPIRED', // 已过期
  Refunded = 'REFUNDED', // 已退款
}

/**
 * 支付订单状态
 */
export enum RefundState {
  // 退款处理中
  Processing = 'PROCESSING',
  // 退款异常
  Abnormal = 'ABNORMAL',
  // 退款成功
  Success = 'SUCCESS',
  // 退款关闭
  Closed = 'CLOSED',
}

export enum RefundChannel {
  Original = 'ORIGINAL',
  Balance = 'BALANCE',
  OtherBalance = 'OTHER_BALANCE',
  OtherBankcard = 'OTHER_BANKCARD',
}

export enum ProductType {
  Count = 'COUNT',
  Time = 'TIME',
  Cycle = 'CYCLE',
}

export enum BalanceOrigin {
  Code = 'CODE',
  Order = 'ORDER',
  Register = 'REGISTER',
  Invite = 'INVITE',
}

// #endregion

export enum OpenAIKeyState {
  Valid = 'VALID',
  Invalid = 'INVALID',
}

export enum CycleType {
  Minute = 'MINUTE',
  Day = 'DAY',
  Week = 'WEEK',
  Month = 'MONTH',
}
