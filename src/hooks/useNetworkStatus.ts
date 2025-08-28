/**
 * 网络状态检测 Hook
 */

import { useState, useEffect } from 'react';
import { useMessage } from '@/utils/message';

interface NetworkStatus {
  isOnline: boolean;
  isBackendReachable: boolean;
  lastCheck: Date;
}

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isBackendReachable: false,
    lastCheck: new Date(),
  });

  const message = useMessage();

  // 检查后端连通性
  const checkBackendHealth = async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      // 使用一个轻量级的API请求来检查后端状态
      const response = await fetch('/api/admin/info', {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Authorization': localStorage.getItem('adminToken') ? `Bearer ${localStorage.getItem('adminToken')}` : '',
        },
      });

      clearTimeout(timeoutId);
      
      // 即使是401错误也表示后端服务正常，只是没有认证
      return response.status < 500;
    } catch (error: any) {
      console.warn('Backend health check failed:', error);
      // 如果是取消错误，不算作后端问题
      if (error.name === 'AbortError') {
        return false;
      }
      return false;
    }
  };

  // 更新网络状态
  const updateNetworkStatus = async () => {
    const isOnline = navigator.onLine;
    const isBackendReachable = isOnline ? await checkBackendHealth() : false;
    
    setNetworkStatus(prev => {
      const newStatus = {
        isOnline,
        isBackendReachable,
        lastCheck: new Date(),
      };

      // 如果状态发生变化，显示通知
      if (prev.isOnline !== isOnline) {
        if (isOnline) {
          message.success('网络连接已恢复');
        } else {
          message.warning('网络连接已断开');
        }
      }

      if (prev.isBackendReachable !== isBackendReachable && isOnline) {
        if (isBackendReachable) {
          message.success('后端服务连接正常');
        } else {
          message.error('无法连接到后端服务，请检查服务状态');
        }
      }

      return newStatus;
    });
  };

  useEffect(() => {
    // 初始检查
    updateNetworkStatus();

    // 监听网络状态变化
    const handleOnline = () => updateNetworkStatus();
    const handleOffline = () => updateNetworkStatus();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 定期检查后端连通性（每30秒）
    const interval = setInterval(updateNetworkStatus, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return {
    ...networkStatus,
    checkBackendHealth: updateNetworkStatus,
  };
};