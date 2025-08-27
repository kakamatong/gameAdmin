/**
 * 类型定义索引文件
 */

// API相关类型
export type * from './api';

// 管理员相关类型
export type * from './admin';

// 用户相关类型
export type * from './user';

// 日志相关类型
export type * from './log';

// 邮件相关类型
export type * from './mail';

// 组件相关类型
export type * from './component';

// 全局状态类型
export interface RootState {
  auth: AuthState;
  user: UserState;
  log: LogState;
  mail: MailState;
  ui: UIState;
}

// 认证状态
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  adminInfo: import('./admin').AdminInfo | null;
  loading: boolean;
  error: string | null;
}

// 用户管理状态
export interface UserState {
  userList: import('./user').UserInfo[];
  currentUser: import('./user').UserInfo | null;
  total: number;
  loading: boolean;
  error: string | null;
}

// 日志状态
export interface LogState {
  loginLogs: import('./log').LoginLogItem[];
  gameLogs: import('./log').GameLogItem[];
  loginStats: import('./log').LoginStats | null;
  gameStats: import('./log').GameStats | null;
  loading: boolean;
  error: string | null;
}

// 邮件状态
export interface MailState {
  mailList: import('./mail').MailItem[];
  currentMail: import('./mail').MailItem | null;
  mailStats: import('./mail').MailStats | null;
  total: number;
  loading: boolean;
  error: string | null;
}

// UI状态
export interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  loading: boolean;
}