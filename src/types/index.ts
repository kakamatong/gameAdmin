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

// 公用枚举类型
// 注意：由于 TypeScript 配置限制，请直接从 './enums' 文件导入
// export * from './enums';
// export type * from './enums';

// 全局状态类型
export interface RootState {
  auth: AuthState;
  user: UserState;
  log: LogState;
  mail: MailState;
  ui: UIState;
  admin: AdminState;
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
  loginLogs: import('./log').LoginLogsResponse;
  gameLogs: import('./log').GameLogsResponse;
  loginStats: import('./log').LoginStats | null;
  gameStats: import('./log').GameStats | null;
  loading: boolean;
  error: string | null;
}

// 邮件状态
export interface MailState {
  userMailList: import('./mail').UserMailItem[];  // 用户邮件列表
  currentMail: import('./mail').UserMailItem | null;  // 当前查看的邮件
  total: number;                                   // 总数
  loading: boolean;                                // 加载状态
  error: string | null;                            // 错误信息
}

// UI状态
export interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  loading: boolean;
}

// 管理员管理状态
export interface AdminState {
  adminList: import('./admin').AdminInfo[];           // 管理员列表
  currentAdmin: import('./admin').AdminInfo | null;   // 当前查看的管理员
  total: number;                                      // 总数
  loading: boolean;                                   // 加载状态
  error: string | null;                               // 错误信息
}