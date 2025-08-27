/**
 * 用户API服务
 */

import { http } from '@/utils/httpClient';
import type {
  UserListRequest,
  UserListResponse,
  UserInfo,
  UserUpdateRequest,
} from '@/types/user';

export const userService = {
  // 获取用户列表
  getUserList: (params: UserListRequest): Promise<UserListResponse> =>
    http.get('/admin/users', params),

  // 获取用户详情
  getUserDetail: (userId: number): Promise<UserInfo> =>
    http.get(`/admin/users/${userId}`),

  // 更新用户信息
  updateUser: (userId: number, data: UserUpdateRequest): Promise<void> =>
    http.put(`/admin/users/${userId}`, data),
};