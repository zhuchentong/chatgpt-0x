/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Balance } from './Balance';

export type User = {
  /**
   * ID
   */
  id: string;
  /**
   * 启用状态
   */
  enable: boolean;
  /**
   * 创建日期
   */
  createdAt: string;
  /**
   * 更新日期
   */
  updatedAt: string;
  /**
   * 用户邮箱
   */
  email: string;
  /**
   * 用户昵称
   */
  nickname: string;
  /**
   * OPENID
   */
  openid: string;
  /**
   * UNIONID
   */
  unionid: string;
  /**
   * 手机号码
   */
  mobile: string;
  /**
   * 用户头像
   */
  avatar: string;
  /**
   * 用户额度
   */
  balances: Balance[];
}
