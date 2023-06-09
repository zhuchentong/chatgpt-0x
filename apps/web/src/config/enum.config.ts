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

// #endregion

export enum ChatRole {
  Assistant = 'assistant',
  User = 'user',
  System = 'system',
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

export enum ProductType {
  Count = 'COUNT',
  Time = 'TIME',
  Cycle = 'CYCLE',
}

export enum BalanceOrigin {
  // 充值
  Code = 'CODE',
  // 退款
  Order = 'ORDER',
  // 注册
  Register = 'REGISTER',
  // 邀请
  Invite = 'INVITE',
}

export enum CycleType {
  Minute = 'MINUTE',
  Day = 'DAY',
  Week = 'WEEK',
  Month = 'MONTH',
}
