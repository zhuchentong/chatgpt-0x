/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Product } from './Product';
import type { User } from './User';

export type Order = {
  /**
   * ID
   */
  id: string;
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
   * 订单状态
   */
  state: 'PENDING' | 'PAID' | 'EXPIRED' | 'REFUNDED';
  /**
   * 订单金额
   */
  amount: number;
  /**
   * 产品
   */
  product: Product;
  /**
   * 用户
   */
  user: User;
  /**
   * 微信支付交易号
   */
  transactionId: string;
  /**
   * 支付时间
   */
  paidTime: string;
}
