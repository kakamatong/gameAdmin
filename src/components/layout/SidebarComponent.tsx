/**
 * 侧边栏组件
 */

import React from 'react';
import { Layout, Menu, theme } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  MailOutlined,
  SettingOutlined,
  LineChartOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { usePermission } from '@/hooks/useAuth';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const SidebarComponent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed } = useAppSelector(state => state.ui);
  const { canRead, isSuperAdmin } = usePermission();
  const { token } = theme.useToken();

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path === '/') return ['dashboard'];
    if (path.startsWith('/users')) return ['users'];
    if (path.startsWith('/logs/login')) return ['login-logs'];
    if (path.startsWith('/logs/game')) return ['game-logs'];
    if (path.startsWith('/logs/stats')) return ['log-stats'];
    if (path.startsWith('/mails')) return ['mails'];
    if (path.startsWith('/admin')) return ['admin'];
    return [];
  };

  // 获取展开的菜单项
  const getOpenKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/logs')) return ['logs'];
    return [];
  };

  // 创建菜单项
  const createMenuItem = (
    key: string,
    icon: React.ReactNode,
    label: string,
    children?: MenuItem[],
    permission?: string
  ): MenuItem => {
    // 如果需要权限检查且没有权限，返回null
    if (permission && !canRead(permission)) {
      return null;
    }

    return {
      key,
      icon,
      label,
      children,
    } as MenuItem;
  };

  // 菜单配置
  const menuItems: MenuItem[] = [
    createMenuItem('dashboard', <DashboardOutlined />, '控制台'),
    
    createMenuItem('users', <UserOutlined />, '用户管理', undefined, 'user'),
    
    createMenuItem('logs', <FileTextOutlined />, '日志查询', [
      createMenuItem('login-logs', <UserOutlined />, '登录日志', undefined, 'log'),
      createMenuItem('game-logs', <TrophyOutlined />, '对局日志', undefined, 'log'),
      createMenuItem('log-stats', <LineChartOutlined />, '统计分析', undefined, 'log'),
    ], 'log'),
    
    createMenuItem('mails', <MailOutlined />, '邮件管理', undefined, 'mail'),
    
    // 只有超级管理员才能看到管理员管理
    ...(isSuperAdmin ? [createMenuItem('admin', <SettingOutlined />, '管理员管理', undefined, 'admin')] : []),
  ].filter(Boolean); // 过滤掉null值

  // 处理菜单点击
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'dashboard':
        navigate('/');
        break;
      case 'users':
        navigate('/users');
        break;
      case 'login-logs':
        navigate('/logs/login');
        break;
      case 'game-logs':
        navigate('/logs/game');
        break;
      case 'log-stats':
        navigate('/logs/stats');
        break;
      case 'mails':
        navigate('/mails');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        break;
    }
  };

  return (
    <Sider 
      className="main-sidebar"
      collapsed={sidebarCollapsed}
      width={256}
      collapsedWidth={80}
      theme="light"
      style={{
        backgroundColor: token.colorBgContainer,
        borderRight: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <div className="sidebar-logo">
        {!sidebarCollapsed ? (
          <div className="logo-text">游戏后台</div>
        ) : (
          <div className="logo-icon">G</div>
        )}
      </div>
      
      <Menu
        mode="inline"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
        items={menuItems}
        onClick={handleMenuClick}
        className="sidebar-menu"
        style={{ 
          backgroundColor: 'transparent',
          border: 'none',
        }}
      />
    </Sider>
  );
};

export default SidebarComponent;