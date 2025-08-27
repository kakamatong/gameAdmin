/**
 * 邮件相关类型定义
 */

import type { PaginationParams, ListQueryParams } from './api';

// 邮件奖励项
export interface MailAwardItem {
  type: number;
  count: number;
}

// 邮件基础信息
export interface MailItem {
  id: number;
  type: number; // 0-全服邮件, 1-个人邮件
  title: string;
  content: string;
  awards: string; // JSON格式的奖励数据
  startTime: string;
  endTime: string;
  status: number; // 0-禁用, 1-启用
  createTime: string;
  updateTime: string;
}

// 发送邮件请求
export interface SendMailRequest {
  type: number;
  title: string;
  content: string;
  awards: string;
  startTime: string;
  endTime: string;
  targetUsers: number[]; // 个人邮件时的目标用户ID列表
}

// 邮件列表查询参数
export interface MailListRequest extends ListQueryParams {
  status?: number;
  type?: number;
}

// 邮件列表响应
export interface MailListResponse {
  total: number;
  page: number;
  pageSize: number;
  data: MailItem[];
}

// 邮件统计信息
export interface MailStats {
  totalMails: number;
  activeMails: number;
  globalMails: number;
  personalMails: number;
  todayMails: number;
}

// 邮件状态更新请求
export interface UpdateMailStatusRequest {
  status: number;
}

// 用户邮件信息
export interface UserMailItem {
  id: number;
  mailId: number;
  userid: number;
  isRead: number;     // 0-未读, 1-已读
  isReceived: number; // 0-未领取, 1-已领取
  readTime?: string;
  receiveTime?: string;
  createTime: string;
}

// 邮件类型枚举
export enum MailType {
  GLOBAL = 0,   // 全服邮件
  PERSONAL = 1, // 个人邮件
}

// 邮件状态枚举
export enum MailStatus {
  DISABLED = 0, // 禁用
  ACTIVE = 1,   // 启用
}

// 奖励类型枚举
export enum AwardType {
  GOLD = 1,      // 金币
  DIAMOND = 2,   // 钻石
  TICKET = 3,    // 门票
  ENERGY = 4,    // 体力
  ITEM = 5,      // 道具
  VIP_EXP = 6,   // VIP经验
}