/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type OpenAIKey = {
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
   * Key
   */
  key: string;
  /**
   * 总额度
   */
  limit: number;
  /**
   * 使用量
   */
  usage: number;
  /**
   * 调用次数
   */
  count: number;
  /**
   * 到期时间
   */
  expireAt: string;
  /**
   * 异常总数
   */
  exceptionTotal: number;
  /**
   * 异常次数
   */
  exceptionTimes: number;
  /**
   * 状态
   */
  state: string;
}
