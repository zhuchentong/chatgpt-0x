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
}

export enum BalanceOrigin {
  Code = 'CODE',
  Order = 'ORDER',
}

/**
 * OpenAIKEY状态
 */
export enum OpenAIKeyState {
  Valid = 'VALID',
  Invalid = 'INVALID',
}
