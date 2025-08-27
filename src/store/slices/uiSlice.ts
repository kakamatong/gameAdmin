/**
 * UI状态管理
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UIState } from '@/types';

// 初始状态
const initialState: UIState = {
  sidebarCollapsed: false,
  theme: 'light',
  language: 'zh',
  loading: false,
};

// 创建slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // 切换侧边栏折叠状态
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      localStorage.setItem('sidebarCollapsed', String(state.sidebarCollapsed));
    },
    
    // 设置侧边栏折叠状态
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
      localStorage.setItem('sidebarCollapsed', String(action.payload));
    },
    
    // 切换主题
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    
    // 设置主题
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    
    // 设置语言
    setLanguage: (state, action: PayloadAction<'zh' | 'en'>) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    
    // 设置全局加载状态
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // 从localStorage恢复UI状态
    restoreUIState: (state) => {
      const sidebarCollapsed = localStorage.getItem('sidebarCollapsed');
      const theme = localStorage.getItem('theme');
      const language = localStorage.getItem('language');
      
      if (sidebarCollapsed !== null) {
        state.sidebarCollapsed = sidebarCollapsed === 'true';
      }
      
      if (theme && (theme === 'light' || theme === 'dark')) {
        state.theme = theme;
      }
      
      if (language && (language === 'zh' || language === 'en')) {
        state.language = language;
      }
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleTheme,
  setTheme,
  setLanguage,
  setGlobalLoading,
  restoreUIState,
} = uiSlice.actions;

export default uiSlice.reducer;