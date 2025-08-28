/**
 * 管理员API服务
 */

import { http } from '@/utils/httpClient';
import type {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminInfo,
  CreateAdminRequest,
  AdminUpdateRequest,
} from '@/types/admin';

export const adminService = {
  // 管理员登录
  login: (params: AdminLoginRequest): Promise<AdminLoginResponse> =>
    http.post('/admin/login', params),

  // 管理员登出
  logout: (): Promise<void> =>
    http.post('/admin/logout'),

  // 获取管理员信息
  getAdminInfo: (): Promise<AdminInfo> =>
    http.get('/admin/info'),

  // 更新管理员信息
  updateAdminInfo: (id: number, data: AdminUpdateRequest): Promise<void> =>
    http.put(`/admin/update/${id}`, data),

  // 创建管理员（仅超级管理员）
  createAdmin: (data: CreateAdminRequest): Promise<void> =>
    http.post('/admin/create-admin', data),
};