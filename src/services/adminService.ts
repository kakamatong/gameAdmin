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
import type { ListQueryParams, PaginationResponse } from '@/types/api';

// 管理员列表查询参数
export interface AdminListRequest extends ListQueryParams {
  keyword?: string;       // 关键词搜索（用户名、邮箱、真实姓名）
  status?: number;        // 管理员状态（0-禁用，1-正常）
  isSuperAdmin?: number;  // 是否为超级管理员（0-普通，1-超级）
}

// 管理员列表响应
export interface AdminListResponse {
  list: AdminInfo[];
  total: number;
  page: number;
  pageSize: number;
}

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
  createAdmin: (data: CreateAdminRequest): Promise<{ id: number; username: string }> =>
    http.post('/admin/create-admin', data),

  // 获取管理员列表（仅超级管理员）
  getAdminList: (params: AdminListRequest): Promise<AdminListResponse> =>
    http.get('/admin/admins', params),

  // 删除管理员（仅超级管理员）
  deleteAdmin: (id: number): Promise<void> =>
    http.delete(`/admin/delete/${id}`),
};