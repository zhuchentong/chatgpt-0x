/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActiveCode } from './ActiveCode';
import type { Order } from './Order';
import type { User } from './User';

export type Balance = {
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
   * 余额来源
   */
  origin: string;
  /**
   * 余额类型
   */
  type: string;
  /**
   * 激活码
   */
  code: ActiveCode;
  /**
   * 订单
   */
  order: Order;
  /**
   * 初始次数
   */
  startCount: number;
  /**
   * 当前次数
   */
  currentCount: number;
  /**
   * 开始时间
   */
  startTime: string;
  /**
   * 结束时间
   */
  endTime: string;
  /**
   * 周期类型
   */
  cycleType: 'MINUTE' | 'DAY' | 'WEEK' | 'MONTH';
  /**
   * 下次重置周期
   */
  nextCycleTime: string;
  /**
   * 用户
   */
  user: User;
}
