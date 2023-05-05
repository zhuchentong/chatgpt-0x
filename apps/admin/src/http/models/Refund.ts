/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Order } from './Order';
import type { User } from './User';

export type Refund = {
  /**
   * 创建日期
   */
  createdAt: string;
  /**
   * 更新日期
   */
  updatedAt: string;
  /**
   * 删除时间
   */
  deletedAt: string;
  /**
   * 创建人
   */
  creator: string;
  /**
   * 退款ID
   */
  id: string;
  /**
   * 退款状态
   */
  state: 'PROCESSING' | 'ABNORMAL' | 'SUCCESS' | 'CLOSED';
  /**
   * 退款渠道
   */
  channel: 'ORIGINAL' | 'BALANCE' | 'OTHER_BALANCE' | 'OTHER_BANKCARD';
  /**
   * 收款帐号
   */
  receivedAccount: string;
  /**
   * 退款金额
   */
  amount: number;
  /**
   * 订单
   */
  order: Order;
  /**
   * 用户
   */
  user: User;
  /**
   * 微信退款交易号
   */
  wxRefundId: string;
  /**
   * 退款成功时间
   */
  refundTime: string;
}
