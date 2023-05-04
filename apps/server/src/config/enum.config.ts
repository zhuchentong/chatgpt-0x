/**
 * 分页类型
 */
export enum PaginatorMode {
  Cursor = 'CURSOR',
  Index = 'INDEX',
}

export enum OrderMode {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum WhereOperator {
  In = 'IN',
  Like = 'LIKE',
  Equal = 'EQUAL',
  Between = 'BETWEEN',
}

/**
 * 管理员角色
 */
export enum AdminRole {
  Normal = 'NORMAL_ADMIN',
  Super = 'SUPER_ADMIN',
}

/**
 * TOKEN来源
 */
export enum AppOrigin {
  Admin = 'admin',
  Weapp = 'weapp',
  App = 'app',
  Web = 'web',
  Api = 'api',
}

/**
 * 文件类型
 */
export enum FileType {
  Image = 'IMAGE',
  Video = 'VIDEO',
  Audio = 'AUDIO',
  Document = 'DOCUMENT',
  Other = 'OTHER',
}

// /**
//  * 商品订单状态
//  */
// export enum OrderState {
//   Pending = 'PENDING', // 待支付
//   Processing = 'PROCESSING', // 进行中
//   Finished = 'FINISHED', // 已完成
//   Expired = 'EXPIRED', // 已过期
//   Refunded = 'REFUNDED', // 已退款
//   Closed = 'CLOSED', // 已关闭
// }

/**
 * 支付订单状态
 */
export enum OrderState {
  // 待支付
  Pending = 'PENDING',
  // 已支付
  Paid = 'PAID',
  // 已过期
  Expired = 'EXPIRED',
  // 已退款
  Refunded = 'REFUNDED',
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
  // 原路退回
  Original = 'ORIGINAL',
  // 余额退回
  Balance = 'BALANCE',
  // 其他余额退回
  OtherBalance = 'OTHER_BALANCE',
  // 其他银行卡退回
  OtherBankcard = 'OTHER_BANKCARD',
}

export enum ProductType {
  // 次数
  Count = 'COUNT',
  // 时间
  Time = 'TIME',
  // 周期
  Cycle = 'CYCLE',
}

export enum CycleType {
  // 分钟
  Minute = 'MINUTE',
  // 天
  Day = 'DAY',
  // 周
  Week = 'WEEK',
  // 月
  Month = 'MONTH',
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

/**
 * OpenAIKEY状态
 */
export enum OpenAIKeyState {
  // 有效
  Valid = 'VALID',
  // 无效
  Invalid = 'INVALID',
}
