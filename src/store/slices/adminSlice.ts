/**
 * 管理员管理状态
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { adminService } from '@/services';
import type { 
  AdminInfo,
  CreateAdminRequest,
} from '@/types/admin';
import type { AdminListRequest } from '@/services/adminService';

// 状态类型
interface AdminState {
  adminList: AdminInfo[];           // 管理员列表
  currentAdmin: AdminInfo | null;   // 当前查看的管理员
  total: number;                    // 总数
  loading: boolean;                 // 加载状态
  error: string | null;             // 错误信息
}

// 初始状态
const initialState: AdminState = {
  adminList: [],
  currentAdmin: null,
  total: 0,
  loading: false,
  error: null,
};

// 异步actions
export const getAdminListAsync = createAsyncThunk(
  'admin/getAdminList',
  async (params: AdminListRequest, { rejectWithValue }) => {
    console.log('🎪 Redux Store - getAdminListAsync 开始执行');
    console.log('🎪 接收到的参数:', params);
    
    try {
      const response = await adminService.getAdminList(params);
      console.log('🎪 API调用成功，返回结果:', response);
      return response;
    } catch (error: any) {
      console.error('🎪 API调用失败:', error);
      return rejectWithValue(error.message || '获取管理员列表失败');
    }
  }
);

export const createAdminAsync = createAsyncThunk(
  'admin/createAdmin',
  async (data: CreateAdminRequest, { rejectWithValue }) => {
    console.log('🎪 Redux Store - createAdminAsync 开始执行');
    console.log('🎪 接收到的参数:', data);
    
    try {
      const result = await adminService.createAdmin(data);
      console.log('🎪 API调用成功，返回结果:', result);
      return result;
    } catch (error: any) {
      console.error('🎪 API调用失败:', error);
      return rejectWithValue(error.message || '创建管理员失败');
    }
  }
);

export const deleteAdminAsync = createAsyncThunk(
  'admin/deleteAdmin',
  async (id: number, { rejectWithValue }) => {
    console.log('🎪 Redux Store - deleteAdminAsync 开始执行');
    console.log('🎪 要删除的管理员ID:', id);
    
    try {
      await adminService.deleteAdmin(id);
      console.log('🎪 API调用成功，管理员已删除');
      return id;
    } catch (error: any) {
      console.error('🎪 API调用失败:', error);
      return rejectWithValue(error.message || '删除管理员失败');
    }
  }
);

// 创建slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // 重置错误状态
    clearError: (state) => {
      state.error = null;
    },
    
    // 设置当前管理员
    setCurrentAdmin: (state, action: PayloadAction<AdminInfo | null>) => {
      state.currentAdmin = action.payload;
    },
    
    // 清除管理员列表
    clearAdminList: (state) => {
      state.adminList = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    // 获取管理员列表
    builder
      .addCase(getAdminListAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminListAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.adminList = action.payload.list;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(getAdminListAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // 创建管理员
    builder
      .addCase(createAdminAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createAdminAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // 删除管理员
    builder
      .addCase(deleteAdminAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminAsync.fulfilled, (state, action) => {
        state.loading = false;
        // 从列表中移除已删除的管理员
        state.adminList = state.adminList.filter(admin => admin.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
        state.error = null;
      })
      .addCase(deleteAdminAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  setCurrentAdmin, 
  clearAdminList
} = adminSlice.actions;

export default adminSlice.reducer;