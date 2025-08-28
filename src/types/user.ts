/**
 * 用户相关类型定义
 */

import type { ListQueryParams } from './api';

// 用户财富信息
export interface UserRich {
  richType: number;
  richNums: number;
}

// 用户基础信息
export interface UserInfo {
  userid: number;
  nickname: string;
  headurl: string;
  sex: number; // 0-未知, 1-男, 2-女
  province: string;
  city: string;
  ip: string;
  status: number; // 0-禁用, 1-正常
  gameid: number;
  roomid: number;
  riches: UserRich[];
  createTime: string;
  updateTime: string;
}

// 用户列表查询参数
export interface UserListRequest extends ListQueryParams {
  userid?: number;
}

// 用户列表响应
export interface UserListResponse {
  total: number;
  users: UserInfo[];
}

// 用户信息更新请求
export interface UserUpdateRequest {
  nickname?: string;
  sex?: number;
  province?: string;
  city?: string;
  status?: number;
  riches?: UserRich[];
  createTime?: string;
}

// 注意：用户状态、性别和财富类型枚举已移至 ./enums.ts 文件统一管理