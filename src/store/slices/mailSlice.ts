/**
 * 邮件状态管理
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { mailService } from '@/services';
import type { 
  MailState, 
  SendMailRequest, 
  MailListRequest, 
  MailItem, 
  UpdateMailStatusRequest,
  MailStats
} from '@/types';

// 初始状态
const initialState: MailState = {
  mailList: [],
  currentMail: null,
  mailStats: null,
  total: 0,
  loading: false,
  error: null,
};

// 异步actions
export const sendMailAsync = createAsyncThunk(
  'mail/sendMail',
  async (data: SendMailRequest, { rejectWithValue }) => {
    try {
      await mailService.sendMail(data);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || '发送邮件失败');
    }
  }
);

export const getMailListAsync = createAsyncThunk(
  'mail/getMailList',
  async (params: MailListRequest, { rejectWithValue }) => {
    try {
      const response = await mailService.getMailList(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取邮件列表失败');
    }
  }
);

export const getMailDetailAsync = createAsyncThunk(
  'mail/getMailDetail',
  async (mailId: number, { rejectWithValue }) => {
    try {
      const mailItem = await mailService.getMailDetail(mailId);
      return mailItem;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取邮件详情失败');
    }
  }
);

export const updateMailStatusAsync = createAsyncThunk(
  'mail/updateMailStatus',
  async ({ mailId, data }: { mailId: number; data: UpdateMailStatusRequest }, { rejectWithValue }) => {
    try {
      await mailService.updateMailStatus(mailId, data);
      return { mailId, status: data.status };
    } catch (error: any) {
      return rejectWithValue(error.message || '更新邮件状态失败');
    }
  }
);

export const getMailStatsAsync = createAsyncThunk(
  'mail/getMailStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await mailService.getMailStats();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取邮件统计失败');
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
    setCurrentMail: (state, action: PayloadAction<MailItem | null>) => {
      state.currentMail = action.payload;
    },
    
    // 清除邮件列表
    clearMailList: (state) => {
      state.mailList = [];
      state.total = 0;
    },
    
    // 更新邮件列表中的单个邮件
    updateMailInList: (state, action: PayloadAction<MailItem>) => {
      const index = state.mailList.findIndex(mail => mail.id === action.payload.id);
      if (index !== -1) {
        state.mailList[index] = action.payload;
      }
      
      // 同时更新当前邮件（如果是同一个邮件）
      if (state.currentMail?.id === action.payload.id) {
        state.currentMail = action.payload;
      }
    },
    
    // 从列表中移除邮件
    removeMailFromList: (state, action: PayloadAction<number>) => {
      state.mailList = state.mailList.filter(mail => mail.id !== action.payload);
      state.total = Math.max(0, state.total - 1);
      
      // 如果移除的是当前邮件，清除当前邮件
      if (state.currentMail?.id === action.payload) {
        state.currentMail = null;
      }
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
    
    // 获取邮件列表
    builder
      .addCase(getMailListAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMailListAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.mailList = action.payload.data;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(getMailListAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // 获取邮件详情
    builder
      .addCase(getMailDetailAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMailDetailAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMail = action.payload;
        state.error = null;
      })
      .addCase(getMailDetailAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // 更新邮件状态
    builder
      .addCase(updateMailStatusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMailStatusAsync.fulfilled, (state, action) => {
        state.loading = false;
        
        const { mailId, status } = action.payload;
        
        // 更新邮件列表中的状态
        const mailIndex = state.mailList.findIndex(mail => mail.id === mailId);
        if (mailIndex !== -1) {
          state.mailList[mailIndex].status = status;
        }
        
        // 更新当前邮件状态
        if (state.currentMail?.id === mailId) {
          state.currentMail.status = status;
        }
        
        state.error = null;
      })
      .addCase(updateMailStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // 获取邮件统计
    builder
      .addCase(getMailStatsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMailStatsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.mailStats = action.payload;
        state.error = null;
      })
      .addCase(getMailStatsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  setCurrentMail, 
  clearMailList, 
  updateMailInList, 
  removeMailFromList 
} = mailSlice.actions;

export default mailSlice.reducer;