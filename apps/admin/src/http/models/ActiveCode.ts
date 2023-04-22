/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ActiveCode = {
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
   * 激活码
   */
  key: string;
  /**
   * 激活码
   */
  startTime: string;
  /**
   * 激活码
   */
  endTime: string;
  /**
   * 总量
   */
  count: number;
  /**
   * 兑换类型
   */
  type: string;
  /**
   * 兑换数值
   */
  value: number;
  /**
   * 备注
   */
  remark: string;
  /**
   * 使用记录
   */
  balances: string[];
}
