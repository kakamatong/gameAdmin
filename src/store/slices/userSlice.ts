/**
 * 用户状态管理
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { userService } from '@/services';
import type { 
  UserState, 
  UserListRequest, 
  UserInfo, 
  UserUpdateRequest 
} from '@/types';

// 初始状态
const initialState: UserState = {
  userList: [],
  currentUser: null,
  total: 0,
  loading: false,
  error: null,
};

// 异步actions
export const getUserListAsync = createAsyncThunk(
  'user/getUserList',
  async (params: UserListRequest, { rejectWithValue }) => {
    try {
      const response = await userService.getUserList(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取用户列表失败');
    }
  }
);

export const getUserDetailAsync = createAsyncThunk(
  'user/getUserDetail',
  async (userId: number, { rejectWithValue }) => {
    try {
      const userInfo = await userService.getUserDetail(userId);
      return userInfo;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取用户详情失败');
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  'user/updateUser',
  async ({ userId, data }: { userId: number; data: UserUpdateRequest }, { rejectWithValue }) => {
    try {
      await userService.updateUser(userId, data);
      // 返回更新后的用户ID和数据，用于更新本地状态
      return { userId, data };
    } catch (error: any) {
      return rejectWithValue(error.message || '更新用户信息失败');
    }
  }
);

// 创建slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 重置错误状态
    clearError: (state) => {
      state.error = null;
    },
    
    // 设置当前用户
    setCurrentUser: (state, action: PayloadAction<UserInfo | null>) => {
      state.currentUser = action.payload;
    },
    
    // 清除用户列表
    clearUserList: (state) => {
      state.userList = [];
      state.total = 0;
    },
    
    // 更新用户列表中的单个用户
    updateUserInList: (state, action: PayloadAction<UserInfo>) => {
      const index = state.userList.findIndex(user => user.userid === action.payload.userid);
      if (index !== -1) {
        state.userList[index] = action.payload;
      }
      
      // 同时更新当前用户（如果是同一个用户）
      if (state.currentUser?.userid === action.payload.userid) {
        state.currentUser = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // 获取用户列表
    builder
      .addCase(getUserListAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserListAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload.users;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(getUserListAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // 获取用户详情
    builder
      .addCase(getUserDetailAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetailAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(getUserDetailAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // 更新用户信息
    builder
      .addCase(updateUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        
        // 更新用户列表中的数据
        const { userId, data } = action.payload;
        const userIndex = state.userList.findIndex(user => user.userid === userId);
        
        if (userIndex !== -1) {
          // 合并更新数据
          state.userList[userIndex] = {
            ...state.userList[userIndex],
            ...data,
          };
        }
        
        // 更新当前用户数据
        if (state.currentUser?.userid === userId) {
          state.currentUser = {
            ...state.currentUser,
            ...data,
          };
        }
        
        state.error = null;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  setCurrentUser, 
  clearUserList, 
  updateUserInList 
} = userSlice.actions;

export default userSlice.reducer;