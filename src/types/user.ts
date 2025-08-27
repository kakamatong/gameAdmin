/**
 * 用户相关类型定义
 */

import type { PaginationParams, ListQueryParams } from './api';

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
  status?: number;
  riches?: UserRich[];
}

// 用户状态枚举
export enum UserStatus {
  DISABLED = 0,
  ACTIVE = 1,
  BANNED = 2,
}

// 性别枚举
export enum Gender {
  UNKNOWN = 0,
  MALE = 1,
  FEMALE = 2,
}

// 财富类型枚举
export enum RichType {
  GOLD = 1,      // 金币
  DIAMOND = 2,   // 钻石
  TICKET = 3,    // 门票
  ENERGY = 4,    // 体力
  VIP_EXP = 5,   // VIP经验
}