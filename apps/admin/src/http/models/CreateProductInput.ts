/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreateProductInput = {
  name: string;
  description: string;
  type: 'COUNT' | 'TIME' | 'CYCLE';
  /**
   * 周期类型
   */
  cycleType?: 'MINUTE' | 'DAY' | 'WEEK' | 'MONTH';
  /**
   * 周期时长
   */
  cycleTime?: number;
  value: number;
  price: number;
  enable: boolean;
}
