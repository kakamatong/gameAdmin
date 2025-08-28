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
import { ProfilePage } from '@/pages/profile';
import { LoginLogsPage, GameLogsPage } from '@/pages/logs';
import LogTestPage from '@/pages/logs/LogTestPage';
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
            element: <LoginLogsPage />,
          },
          {
            path: 'game',
            element: <GameLogsPage />,
          },
          {
            path: 'stats',
            element: <div>统计分析页面（待实现）</div>,
          },
          {
            path: 'test',
            element: <LogTestPage />,
          },
        ],
      },
      {
        path: 'mails',
        element: <MailManagement />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
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