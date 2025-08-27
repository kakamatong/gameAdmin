/**
 * 主布局组件
 */

import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { restoreUIState } from '@/store/slices/uiSlice';
import HeaderComponent from './HeaderComponent';
import SidebarComponent from './SidebarComponent';
import './MainLayout.less';

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 恢复UI状态
    dispatch(restoreUIState());
  }, [dispatch]);

  return (
    <Layout className="main-layout">
      <SidebarComponent />
      <Layout className="main-content-layout">
        <HeaderComponent />
        <Content className="main-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;