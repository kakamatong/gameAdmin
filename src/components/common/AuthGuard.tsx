/**
 * 路由守卫组件
 */

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store';
import { restoreAuth, getAdminInfoAsync } from '@/store/slices/authSlice';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAuth = true }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isAuthenticated, token, loading, adminInfo } = useAppSelector(state => state.auth);

  useEffect(() => {
    // 如果有token但没有认证状态，尝试恢复认证状态
    if (token && !isAuthenticated) {
      dispatch(restoreAuth());
    }

    // 如果已认证但没有管理员信息，获取管理员信息
    if (isAuthenticated && !adminInfo && !loading) {
      dispatch(getAdminInfoAsync());
    }
  }, [dispatch, token, isAuthenticated, adminInfo, loading]);

  // 如果正在加载中，显示加载画面
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  // 如果需要认证但未认证，重定向到登录页
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果不需要认证但已认证，重定向到首页（防止已登录用户访问登录页）
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;