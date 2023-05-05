/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from './User';
import type { Balance } from './Balance';

export type Invite = {
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
   * 接受邀请人
   */
  invitee: User;
  /**
   * 发出邀请人
   */
  inviter: User;
  /**
   * 接受邀请奖励
   */
  inviteeReward: Balance;
  /**
   * 发出邀请奖励
   */
  inviterReward: Balance;
}
