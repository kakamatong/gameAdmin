/**
 * 邮件相关类型定义
 */

import type { ListQueryParams } from './api';

// 邮件奖励项（用于发送邮件时的表单）
export interface MailAwardItem {
  id: number;   // 道具ID
  cnt: number;  // 道具数量
}

// 发送邮件请求
export interface SendMailRequest {
  type: number;           // 0-全服邮件, 1-个人邮件
  title: string;          // 邮件标题
  content: string;        // 邮件内容
  awards: string;         // 奖励JSON字符串，格式: {"props":[{"id":2,"cnt":20000}]}
  startTime: string;      // 生效开始时间
  endTime: string;        // 生效结束时间
  targetUsers?: number[]; // 个人邮件时的目标用户ID列表（仅在type=1时使用）
}

// 用户邮件项（管理后台查询结果）
export interface UserMailItem {
  id: number;         // 邮件ID
  type: number;       // 邮件类型 (0-全服邮件, 1-个人邮件)
  title: string;      // 邮件标题
  content: string;    // 邮件内容
  awards: string;     // 奖励内容（JSON格式）
  createdAt: string;  // 邮件创建时间
  userid: number;     // 用户ID
  status: number;     // 邮件状态 (0-未读, 1-已读, 2-已领取)
  startTime: string;  // 邮件生效开始时间
  endTime: string;    // 邮件生效结束时间
  updateAt: string;   // 最后更新时间
}

// 用户邮件列表查询参数
export interface UserMailListRequest extends ListQueryParams {
  title?: string;   // 邮件标题模糊搜索
  userid?: number;  // 用户ID筛选
}

// 用户邮件列表响应
export interface UserMailListResponse {
  list: UserMailItem[];   // 邮件列表
  total: number;          // 总记录数
  page: number;           // 当前页码
  pageSize: number;       // 每页数量
  summary: {
    description: string;  // 查询结果描述
    filterTime: string;   // 查询时间点
  };
}

// 注意：邮件类型、状态和奖励类型枚举已移至 ./enums.ts 文件统一管理