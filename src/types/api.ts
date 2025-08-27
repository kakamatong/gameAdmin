/**
 * 基础API响应类型定义
 */

// 基础API响应格式
export interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 分页查询参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 分页响应格式
export interface PaginationResponse<T> {
  total: number;
  page: number;
  pageSize: number;
  data: T[];
}

// 时间范围查询参数
export interface TimeRangeParams {
  startTime?: string;
  endTime?: string;
}

// 通用列表查询参数
export interface ListQueryParams extends PaginationParams {
  keyword?: string;
}

// API错误类型
export interface ApiError {
  code: number;
  message: string;
  data?: any;
}

// 请求状态枚举
export enum RequestStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}