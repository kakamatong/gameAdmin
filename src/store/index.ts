/**
 * Redux Store配置
 */

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import logSlice from './slices/logSlice';
import mailSlice from './slices/mailSlice';
import uiSlice from './slices/uiSlice';

import type { RootState } from '@/types';

// 配置store
export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    log: logSlice,
    mail: mailSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略这些action types的序列化检查
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // 忽略这些字段的序列化检查
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['items.dates'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;

// 类型化的hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 导出store类型
export type { RootState } from '@/types';