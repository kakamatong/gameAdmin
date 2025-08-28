/**
 * 管理员相关类型定义
 */

// 管理员基础信息
export interface AdminInfo {
  id: number;
  username: string;
  email: string;
  mobile?: string;
  realName: string;
  avatar?: string;
  isSuperAdmin: boolean;
  status: number;
  departmentId?: number;
  note?: string;
  lastLoginIp?: string;
  lastLoginTime: string;
  createdTime: string;
  updatedTime: string;
}

// 管理员登录请求
export interface AdminLoginRequest {
  username: string;
  password: string;
}

// 管理员登录响应
export interface AdminLoginResponse {
  token: string;
  adminInfo: AdminInfo;
}

// 创建管理员请求
export interface CreateAdminRequest {
  username: string;
  password: string;
  email: string;
  mobile?: string;
  realName: string;
  isSuperAdmin: boolean;
  departmentId?: number;
  note?: string;
}

// 管理员信息更新请求
export interface AdminUpdateRequest {
  email?: string;
  mobile?: string;
  realName?: string;
  avatar?: string;
  departmentId?: number;
  note?: string;
}

// JWT Token Claims
export interface AdminJWTClaims {
  adminId: number;
  username: string;
  email: string;
  realName: string;
  isSuperAdmin: boolean;
  departmentId?: number;
  loginIp: string;
  exp: number;
  iat: number;
}

// 注意：管理员状态枚举已移至 ./enums.ts 文件统一管理