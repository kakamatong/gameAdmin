/**
 * 头部组件
 */

import React from 'react';
import { Layout, Button, Avatar, Dropdown, Typography, Space, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { logoutAsync } from '@/store/slices/authSlice';
import { useAuth } from '@/hooks/useAuth';
import { getSafeAvatarProps } from '@/utils/react19Compatibility';

const { Header } = Layout;
const { Text } = Typography;

const HeaderComponent: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { sidebarCollapsed } = useAppSelector(state => state.ui);
  const { adminInfo } = useAuth();
  const { token } = theme.useToken();

  // 处理登出
  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // 即使登出API失败，也跳转到登录页
      navigate('/login', { replace: true });
    }
  };

  // 用户菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
      onClick: () => {
        navigate('/profile');
      },
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => {
        // 跳转到设置页面
        console.log('跳转到设置页面');
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <Header className="main-header" style={{ backgroundColor: token.colorBgContainer }}>
      <div className="header-content">
        <div className="header-left">
          <Button
            type="text"
            icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => dispatch(toggleSidebar())}
            className="sidebar-trigger"
          />
          
          <div className="header-title">
            <Text strong>{import.meta.env.VITE_APP_TITLE || '游戏管理后台'}</Text>
          </div>
        </div>

        <div className="header-right">
          <Space>
            <Text type="secondary">
              欢迎，{adminInfo?.realName || adminInfo?.username || '管理员'}
            </Text>
            
            <Dropdown 
              menu={{ items: userMenuItems }} 
              placement="bottomRight"
              trigger={['click']}
            >
              <div className="user-info">
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />}
                  {...getSafeAvatarProps(adminInfo?.avatar)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </Dropdown>
          </Space>
        </div>
      </div>
    </Header>
  );
};

export default HeaderComponent;