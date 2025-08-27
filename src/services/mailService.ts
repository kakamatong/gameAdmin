/**
 * 邮件API服务
 */

import { http } from '@/utils/httpClient';
import type {
  SendMailRequest,
  MailListRequest,
  MailListResponse,
  MailItem,
  UpdateMailStatusRequest,
  MailStats,
} from '@/types/mail';

export const mailService = {
  // 发送系统邮件
  sendMail: (data: SendMailRequest): Promise<void> =>
    http.post('/admin/mails/send', data),

  // 获取邮件列表
  getMailList: (params: MailListRequest): Promise<MailListResponse> =>
    http.get('/admin/mails', params),

  // 获取邮件详情
  getMailDetail: (mailId: number): Promise<MailItem> =>
    http.get(`/admin/mails/${mailId}`),

  // 更新邮件状态
  updateMailStatus: (mailId: number, data: UpdateMailStatusRequest): Promise<void> =>
    http.put(`/admin/mails/${mailId}/status`, data),

  // 获取邮件统计
  getMailStats: (): Promise<MailStats> =>
    http.get('/admin/mails/stats'),
};