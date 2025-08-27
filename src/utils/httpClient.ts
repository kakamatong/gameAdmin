/**
 * HTTP客户端配置
 */

import axios from 'axios';
import type { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';
import type { BaseResponse, ApiError } from '@/types';

// 创建axios实例
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从localStorage获取token
    const token = localStorage.getItem('adminToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
httpClient.interceptors.response.use(
  (response: AxiosResponse<BaseResponse>) => {
    const { code, message: msg, data } = response.data;
    
    // 成功响应
    if (code === 200) {
      return { ...response, data };
    }
    
    // 业务错误
    const errorMessage = msg || '请求失败';
    message.error(errorMessage);
    
    const error: ApiError = {
      code,
      message: errorMessage,
      data: response.data.data,
    };
    
    return Promise.reject(error);
  },
  (error: AxiosError) => {
    console.error('Response error:', error);
    
    // 处理不同类型的错误
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // 未认证，清除token并跳转到登录页
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminInfo');
          window.location.href = '/login';
          message.error('登录已过期，请重新登录');
          break;
          
        case 403:
          message.error('权限不足，无法执行此操作');
          break;
          
        case 404:
          message.error('请求的资源不存在');
          break;
          
        case 429:
          message.error('操作过于频繁，请稍后重试');
          break;
          
        case 500:
        case 502:
        case 503:
        case 504:
          message.error('服务器错误，请稍后重试');
          break;
          
        default:
          const errorMsg = (data as any)?.message || error.message || '网络错误';
          message.error(errorMsg);
      }
      
      const apiError: ApiError = {
        code: status,
        message: (data as any)?.message || error.message,
        data: data,
      };
      
      return Promise.reject(apiError);
    } else if (error.request) {
      // 网络错误
      message.error('网络连接失败，请检查网络状态');
      return Promise.reject({
        code: -1,
        message: '网络连接失败',
        data: null,
      });
    } else {
      // 其他错误
      message.error(error.message || '未知错误');
      return Promise.reject({
        code: -1,
        message: error.message || '未知错误',
        data: null,
      });
    }
  }
);

// 封装常用的请求方法
export const http = {
  get: <T = any>(url: string, params?: any): Promise<T> =>
    httpClient.get(url, { params }).then(res => res.data),
    
  post: <T = any>(url: string, data?: any): Promise<T> =>
    httpClient.post(url, data).then(res => res.data),
    
  put: <T = any>(url: string, data?: any): Promise<T> =>
    httpClient.put(url, data).then(res => res.data),
    
  delete: <T = any>(url: string, params?: any): Promise<T> =>
    httpClient.delete(url, { params }).then(res => res.data),
    
  patch: <T = any>(url: string, data?: any): Promise<T> =>
    httpClient.patch(url, data).then(res => res.data),
};

// 上传文件专用方法
export const uploadFile = (url: string, file: File, onProgress?: (progress: number) => void) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return httpClient.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
};

export default httpClient;