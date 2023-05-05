/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreateActiveCodeInput = {
  /**
   * 开始时间
   */
  startTime: string;
  /**
   * 结束时间
   */
  endTime: string;
  /**
   * 总量
   */
  count: number;
  /**
   * 兑换类型
   */
  type: 'COUNT' | 'TIME' | 'CYCLE';
  /**
   * 兑换值
   */
  value: number;
  /**
   * 状态
   */
  enable: boolean;
}
