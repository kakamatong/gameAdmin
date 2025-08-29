/**
 * 邮件API服务
 */

import { http } from '@/utils/httpClient';
import type {
  SendMailRequest,
  UserMailListRequest,
  UserMailListResponse,
} from '@/types/mail';

export const mailService = {
  // 发送系统邮件
  sendMail: (data: SendMailRequest): Promise<{ mailId: number }> =>
    http.post('/admin/mails/send', data),

  // 搜索用户邮件（管理后台）
  getUserMailList: (params: UserMailListRequest): Promise<UserMailListResponse> =>
    http.get('/admin/mails/', params),
};