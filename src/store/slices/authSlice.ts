/**
 * 认证状态管理
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { adminService } from '@/services';
import type { AuthState, AdminLoginRequest, AdminInfo } from '@/types';

// 初始状态
const initialState: AuthState = {
  isAuthenticated: false,
  token: localStorage.getItem('adminToken'),
  adminInfo: null,
  loading: false,
  error: null,
};

// 异步actions
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: AdminLoginRequest, { rejectWithValue }) => {
    try {
      const response = await adminService.login(credentials);
      
      // 保存token到localStorage
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminInfo', JSON.stringify(response.adminInfo));
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '登录失败');
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await adminService.logout();
      
      // 清除本地存储
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      
      return null;
    } catch (error: any) {
      // 即使API调用失败，也要清除本地存储
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      
      return rejectWithValue(error.message || '登出失败');
    }
  }
);

export const getAdminInfoAsync = createAsyncThunk(
  'auth/getAdminInfo',
  async (_, { rejectWithValue }) => {
    try {
      const adminInfo = await adminService.getAdminInfo();
      
      // 更新本地存储
      localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
      
      return adminInfo;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取管理员信息失败');
    }
  }
);

// 创建slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 重置错误状态
    clearError: (state) => {
      state.error = null;
    },
    
    // 设置认证状态
    setAuth: (state, action: PayloadAction<{ token: string; adminInfo: AdminInfo }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.adminInfo = action.payload.adminInfo;
    },
    
    // 清除认证状态
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.adminInfo = null;
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
    },
    
    // 设置管理员信息
    setAdminInfo: (state, action: PayloadAction<AdminInfo>) => {
      state.adminInfo = action.payload;
      localStorage.setItem('adminInfo', JSON.stringify(action.payload));
    },
    
    // 从localStorage恢复状态
    restoreAuth: (state) => {
      const token = localStorage.getItem('adminToken');
      const adminInfoStr = localStorage.getItem('adminInfo');
      
      if (token && adminInfoStr) {
        try {
          const adminInfo = JSON.parse(adminInfoStr);
          state.isAuthenticated = true;
          state.token = token;
          state.adminInfo = adminInfo;
        } catch (error) {
          // JSON解析失败，清除无效数据
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminInfo');
        }
      }
    },
  },
  extraReducers: (builder) => {
    // 登录
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.adminInfo = action.payload.adminInfo;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.adminInfo = null;
        state.error = action.payload as string;
      });
    
    // 登出
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.adminInfo = null;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.adminInfo = null;
        state.error = action.payload as string;
      });
    
    // 获取管理员信息
    builder
      .addCase(getAdminInfoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.adminInfo = action.payload;
        state.error = null;
      })
      .addCase(getAdminInfoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setAuth, clearAuth, setAdminInfo, restoreAuth } = authSlice.actions;
export default authSlice.reducer;