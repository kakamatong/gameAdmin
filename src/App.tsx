/**
 * 主应用组件 - 游戏管理后台
 */

import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider, Spin } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store';
import { restoreAuth } from '@/store/slices/authSlice';
import { LoginPage } from '@/pages/auth';
import { DashboardPage } from '@/pages/dashboard';
import 'dayjs/locale/zh-cn';
import './App.css';

// 设置dayjs为中文
import dayjs from 'dayjs';
dayjs.locale('zh-cn');

// 主应用内容组件
const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, token } = useAppSelector(state => state.auth);

  useEffect(() => {
    // 如果有token但没有认证状态，尝试恢复认证状态
    if (token && !isAuthenticated && !loading) {
      dispatch(restoreAuth());
    }
  }, [dispatch, token, isAuthenticated, loading]);

  // 如果正在加载中，显示加载画面
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: '#666' }}>游戏管理后台正在启动...</p>
      </div>
    );
  }

  // 根据认证状态显示不同页面
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // 已登录，显示主应用（目前是Dashboard）
  return <DashboardPage />;
};

// 主应用组件
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ConfigProvider
          locale={zhCN}
          theme={{
            token: {
              colorPrimary: '#1890ff',
              borderRadius: 6,
            },
          }}
        >
          <React.Suspense fallback={
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh'
            }}>
              <Spin size="large" tip="加载中..." />
            </div>
          }>
            <AppContent />
          </React.Suspense>
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
