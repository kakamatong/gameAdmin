/**
 * 主应用组件 - 游戏管理后台
 */

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider, Spin, App as AntdApp } from 'antd';
import { RouterProvider } from 'react-router-dom';
import zhCN from 'antd/locale/zh_CN';
import { store } from '@/store';
import { setGlobalMessage } from '@/utils/httpClient';
import { router } from '@/router';
import 'dayjs/locale/zh-cn';
import './App.css';

// 设置dayjs为中文
import dayjs from 'dayjs';
dayjs.locale('zh-cn');

// 内部应用组件，用于获取 message API
const InnerApp: React.FC = () => {
  const { message } = AntdApp.useApp();
  
  useEffect(() => {
    // 设置全局 message API
    setGlobalMessage(message);
  }, [message]);
  
  return <RouterProvider router={router} />;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 6,
          },
        }}
      >
        <AntdApp>
          <React.Suspense fallback={
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh'
            }}>
              <Spin size="large" spinning={true}>
                <div style={{ 
                  minHeight: '100px', 
                  minWidth: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666'
                }}>
                  加载中...
                </div>
              </Spin>
            </div>
          }>
            <InnerApp />
          </React.Suspense>
        </AntdApp>
      </ConfigProvider>
    </Provider>
  );
};

export default App;