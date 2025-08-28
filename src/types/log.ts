/**
 * 日志相关类型定义
 */

import type { PaginationParams, TimeRangeParams } from './api';

// 登录日志信息
export interface LoginLogItem {
  id: number;
  userid: number;
  nickname: string;
  ip: string;
  loginType: string;   // 认证类型（渠道）
  status: number;      // 1-成功, 0-失败
  ext: string;         // 扩展数据
  createTime: string;  // 创建时间
}

// 对局日志信息
export interface GameLogItem {
  id: number;
  type: number;        // 计分类型
  userid: number;
  gameid: number;
  roomid: number;
  result: number;      // 0-无，1-赢，2-输，3-平，4-逃跑
  score1: number;      // 财富1
  score2: number;      // 财富2
  score3: number;      // 财富3
  score4: number;      // 财富4
  score5: number;      // 财富5
  time: string;        // 发生时间
  ext: string;         // 扩展数据
}

// 日志查询参数
export interface LogQueryParams extends PaginationParams, TimeRangeParams {
  userid?: number;
}

// 登录统计信息
export interface LoginStats {
  totalLogins: number;
  lastLoginTime?: string;
  todayLogins: number;
  weekLogins: number;
  successLogins: number;  // 成功登录次数
}

// 对局统计信息
export interface GameStats {
  totalGames: number;
  winGames: number;
  winRate: string;         // 胜率百分比
  totalScore1: number;     // 财富1总计
  totalScore2: number;     // 财富2总计
  totalScore3: number;     // 财富3总计
  totalScore4: number;     // 财富4总计
  totalScore5: number;     // 财富5总计
  totalScore: number;      // 所有财富总计
  lastGameTime?: string;   // 最后对局时间
  todayGames: number;      // 今日对局次数
}

// 登录日志响应
export interface LoginLogsResponse {
  total: number;
  page: number;
  pageSize: number;
  data: LoginLogItem[];
}

// 对局日志响应
export interface GameLogsResponse {
  total: number;
  page: number;
  pageSize: number;
  data: GameLogItem[];
}

// 注意：游戏结果和登录状态枚举已移至 ./enums.ts 文件统一管理