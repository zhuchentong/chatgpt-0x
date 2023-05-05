/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Product = {
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
   * 删除时间
   */
  deletedAt: string;
  /**
   * 创建人
   */
  creator: string;
  /**
   * 操作人
   */
  operator: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 描述
   */
  description: string;
  /**
   * 类型
   */
  type: string;
  /**
   * 数值
   */
  value: number;
  /**
   * 周期类型
   */
  cycleType: 'MINUTE' | 'DAY' | 'WEEK' | 'MONTH';
  /**
   * 周期时长
   */
  cycleTime: number;
  /**
   * 价格
   */
  price: number;
}
