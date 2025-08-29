/**
 * 邮件状态管理
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { mailService } from '@/services';
import type { 
  SendMailRequest, 
  UserMailListRequest, 
  UserMailItem
} from '@/types';

// 状态类型
interface MailState {
  userMailList: UserMailItem[];  // 用户邮件列表
  currentMail: UserMailItem | null;  // 当前查看的邮件
  total: number;                 // 总数
  loading: boolean;              // 加载状态
  error: string | null;          // 错误信息
}

// 初始状态
const initialState: MailState = {
  userMailList: [],
  currentMail: null,
  total: 0,
  loading: false,
  error: null,
};

// 异步actions
export const sendMailAsync = createAsyncThunk(
  'mail/sendMail',
  async (data: SendMailRequest, { rejectWithValue }) => {
    try {
      const result = await mailService.sendMail(data);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || '发送邮件失败');
    }
  }
);

export const getUserMailListAsync = createAsyncThunk(
  'mail/getUserMailList',
  async (params: UserMailListRequest, { rejectWithValue }) => {
    try {
      const response = await mailService.getUserMailList(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取用户邮件列表失败');
    }
  }
);

// 创建slice
const mailSlice = createSlice({
  name: 'mail',
  initialState,
  reducers: {
    // 重置错误状态
    clearError: (state) => {
      state.error = null;
    },
    
    // 设置当前邮件
    setCurrentMail: (state, action: PayloadAction<UserMailItem | null>) => {
      state.currentMail = action.payload;
    },
    
    // 清除邮件列表
    clearUserMailList: (state) => {
      state.userMailList = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    // 发送邮件
    builder
      .addCase(sendMailAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMailAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(sendMailAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // 获取用户邮件列表
    builder
      .addCase(getUserMailListAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserMailListAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.userMailList = action.payload.list;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(getUserMailListAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  setCurrentMail, 
  clearUserMailList
} = mailSlice.actions;

export default mailSlice.reducer;