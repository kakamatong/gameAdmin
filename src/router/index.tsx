/**
 * 路由配置
 */

import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthGuard from '@/components/common/AuthGuard';
import { MainLayout } from '@/components/layout';
import { LoginPage } from '@/pages/auth';
import { UserManagement } from '@/pages/users';
import { MailManagement } from '@/pages/mails';
import DashboardPage from '@/pages/dashboard/DashboardPage';

// 创建路由配置
export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthGuard requireAuth={false}>
        <LoginPage />
      </AuthGuard>
    ),
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'users',
        element: <UserManagement />,
      },
      {
        path: 'logs',
        children: [
          {
            path: 'login',
            element: <div>登录日志页面（待实现）</div>,
          },
          {
            path: 'game',
            element: <div>对局日志页面（待实现）</div>,
          },
          {
            path: 'stats',
            element: <div>统计分析页面（待实现）</div>,
          },
        ],
      },
      {
        path: 'mails',
        element: <MailManagement />,
      },
      {
        path: 'admin',
        element: <div>管理员管理页面（待实现）</div>,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);