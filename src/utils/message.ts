/**
 * 消息通知工具函数
 */

import { App } from 'antd';

// 全局消息实例
let messageInstance: any = null;

// 设置消息实例
export const setMessageInstance = (instance: any) => {
  messageInstance = instance;
};

// 消息通知函数
export const showMessage = {
  success: (content: string) => {
    if (messageInstance?.success) {
      messageInstance.success(content);
    } else {
      console.log('[Success]', content);
    }
  },
  error: (content: string) => {
    if (messageInstance?.error) {
      messageInstance.error(content);
    } else {
      console.error('[Error]', content);
    }
  },
  warning: (content: string) => {
    if (messageInstance?.warning) {
      messageInstance.warning(content);
    } else {
      console.warn('[Warning]', content);
    }
  },
  info: (content: string) => {
    if (messageInstance?.info) {
      messageInstance.info(content);
    } else {
      console.info('[Info]', content);
    }
  },
};

// React Hook for using message in components
export const useMessage = () => {
  try {
    const { message } = App.useApp();
    return message;
  } catch {
    // 如果在 App 组件外使用，返回安全的消息函数
    return showMessage;
  }
};