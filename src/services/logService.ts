/**
 * 日志API服务
 */

import { http } from '@/utils/httpClient';
import type {
  LogQueryParams,
  LoginLogsResponse,
  GameLogsResponse,
  LoginStats,
  GameStats,
} from '@/types/log';

export const logService = {
  // 获取登录日志
  getLoginLogs: (params: LogQueryParams): Promise<LoginLogsResponse> =>
    http.get('/admin/logs/auth', params),

  // 获取对局日志
  getGameLogs: (params: LogQueryParams): Promise<GameLogsResponse> =>
    http.get('/admin/logs/game', params),

  // 获取登录统计
  getLoginStats: (userId?: number): Promise<LoginStats> =>
    http.get('/admin/logs/login-stats', { userid: userId }),

  // 获取对局统计
  getGameStats: (userId?: number): Promise<GameStats> =>
    http.get('/admin/logs/game-stats', { userid: userId }),
};