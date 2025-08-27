/**
 * 权限检查Hook
 */

import { useAppSelector } from '@/store';

export const useAuth = () => {
  const { isAuthenticated, token, adminInfo, loading, error } = useAppSelector(state => state.auth);

  return {
    isAuthenticated,
    token,
    adminInfo,
    loading,
    error,
    isSuperAdmin: adminInfo?.isSuperAdmin || false,
  };
};

export const usePermission = () => {
  const { adminInfo } = useAppSelector(state => state.auth);

  const checkPermission = (permission: string): boolean => {
    if (!adminInfo) return false;

    // 超级管理员拥有所有权限
    if (adminInfo.isSuperAdmin) return true;

    // 这里可以根据实际需求扩展权限检查逻辑
    // 目前简化处理，非超级管理员拥有基础权限
    const basicPermissions = [
      'user:read',
      'log:read',
      'mail:read',
      'mail:send',
    ];

    const adminPermissions = [
      'user:write',
      'mail:write',
      'admin:read',
    ];

    const superAdminPermissions = [
      'admin:write',
      'admin:create',
      'system:config',
    ];

    if (basicPermissions.includes(permission)) return true;
    if (adminPermissions.includes(permission)) return !adminInfo.isSuperAdmin ? false : true;
    if (superAdminPermissions.includes(permission)) return adminInfo.isSuperAdmin;

    return false;
  };

  const canRead = (resource: string) => checkPermission(`${resource}:read`);
  const canWrite = (resource: string) => checkPermission(`${resource}:write`);
  const canCreate = (resource: string) => checkPermission(`${resource}:create`);
  const canDelete = (resource: string) => checkPermission(`${resource}:delete`);

  return {
    checkPermission,
    canRead,
    canWrite,
    canCreate,
    canDelete,
    isSuperAdmin: adminInfo?.isSuperAdmin || false,
  };
};