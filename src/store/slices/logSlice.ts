/**
 * 日志状态管理
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { logService } from '@/services';
import type { 
  LogState, 
  LogQueryParams, 
  LoginStats, 
  GameStats 
} from '@/types';

// 初始状态
const initialState: LogState = {
  loginLogs: [],
  gameLogs: [],
  loginStats: null,
  gameStats: null,
  loading: false,
  error: null,
};

// 异步actions
export const getLoginLogsAsync = createAsyncThunk(
  'log/getLoginLogs',
  async (params: LogQueryParams, { rejectWithValue }) => {
    try {
      const response = await logService.getLoginLogs(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取登录日志失败');
    }
  }
);

export const getGameLogsAsync = createAsyncThunk(
  'log/getGameLogs',
  async (params: LogQueryParams, { rejectWithValue }) => {
    try {
      const response = await logService.getGameLogs(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取对局日志失败');
    }
  }
);

export const getLoginStatsAsync = createAsyncThunk(
  'log/getLoginStats',
  async (userId?: number, { rejectWithValue }) => {
    try {
      const stats = await logService.getLoginStats(userId);
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取登录统计失败');
    }
  }
);

export const getGameStatsAsync = createAsyncThunk(
  'log/getGameStats',
  async (userId?: number, { rejectWithValue }) => {
    try {
      const stats = await logService.getGameStats(userId);
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取对局统计失败');
    }
  }
);

// 创建slice
const logSlice = createSlice({
  name: 'log',
  initialState,
  reducers: {
    // 重置错误状态
    clearError: (state) => {
      state.error = null;
    },
    
    // 清除登录日志
    clearLoginLogs: (state) => {
      state.loginLogs = [];
    },
    
    // 清除对局日志
    clearGameLogs: (state) => {
      state.gameLogs = [];
    },
    
    // 清除统计数据
    clearStats: (state) => {
      state.loginStats = null;
      state.gameStats = null;
    },
  },
  extraReducers: (builder) => {
    // 获取登录日志
    builder
      .addCase(getLoginLogsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLoginLogsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.loginLogs = action.payload.data;
        state.error = null;
      })
      .addCase(getLoginLogsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // 获取对局日志
    builder
      .addCase(getGameLogsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGameLogsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.gameLogs = action.payload.data;
        state.error = null;
      })
      .addCase(getGameLogsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // 获取登录统计
    builder
      .addCase(getLoginStatsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLoginStatsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.loginStats = action.payload;
        state.error = null;
      })
      .addCase(getLoginStatsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // 获取对局统计
    builder
      .addCase(getGameStatsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGameStatsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.gameStats = action.payload;
        state.error = null;
      })
      .addCase(getGameStatsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  clearLoginLogs, 
  clearGameLogs, 
  clearStats 
} = logSlice.actions;

export default logSlice.reducer;