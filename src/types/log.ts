/**
 * 日志相关类型定义
 */

import type { PaginationParams, TimeRangeParams } from './api';

// 登录日志信息
export interface LoginLogItem {
  id: number;
  userid: number;
  channel: string;
  ip: string;
  deviceId: string;
  loginTime: string;
  logoutTime: string;
  duration: number; // 登录时长，秒
  status: number;   // 1-正常, 0-异常
}

// 对局日志信息
export interface GameLogItem {
  id: number;
  userid: number;
  gameid: number;
  roomid: number;
  gameMode: number;
  result: number;    // 1-胜利, 0-失败, 2-平局
  score: number;
  winRiches: number;
  loseRiches: number;
  startTime: string;
  endTime: string;
  createTime: string;
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
  avgDuration: number; // 平均登录时长，分钟
}

// 对局统计信息
export interface GameStats {
  totalGames: number;
  winGames: number;
  loseGames: number;
  drawGames: number;
  winRate: number;
  totalWinRiches: number;
  totalLoseRiches: number;
  netRiches: number;
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

// 游戏结果枚举
export enum GameResult {
  LOSE = 0,
  WIN = 1,
  DRAW = 2,
}

// 登录状态枚举
export enum LoginStatus {
  FAILED = 0,
  SUCCESS = 1,
}