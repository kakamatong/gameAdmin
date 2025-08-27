/**
 * 组件相关类型定义
 */

import type { ReactNode } from 'react';

// 通用组件Props
export interface CommonComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

// 表格列配置
export interface TableColumnConfig {
  title: string;
  dataIndex: string;
  key?: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right' | boolean;
  sorter?: boolean;
  render?: (value: any, record: any, index: number) => ReactNode;
}

// 表单项配置
export interface FormItemConfig {
  name: string;
  label: string;
  type: 'input' | 'select' | 'textarea' | 'number' | 'date' | 'dateRange' | 'switch' | 'radio' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
  rules?: any[];
  disabled?: boolean;
}

// 搜索表单配置
export interface SearchFormConfig {
  fields: FormItemConfig[];
  layout?: 'horizontal' | 'vertical' | 'inline';
  onSearch: (values: any) => void;
  onReset?: () => void;
}

// 模态框配置
export interface ModalConfig {
  title: string;
  width?: number | string;
  centered?: boolean;
  maskClosable?: boolean;
  footer?: ReactNode | null;
}

// 页面头部配置
export interface PageHeaderConfig {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ title: string; href?: string }>;
  actions?: ReactNode;
}

// 卡片配置
export interface CardConfig {
  title?: string;
  extra?: ReactNode;
  size?: 'default' | 'small';
  bordered?: boolean;
  loading?: boolean;
}

// 统计卡片数据
export interface StatCardData {
  title: string;
  value: string | number;
  trend?: 'up' | 'down';
  trendValue?: string | number;
  icon?: ReactNode;
  color?: string;
}

// 菜单项配置
export interface MenuItemConfig {
  key: string;
  label: string;
  icon?: ReactNode;
  path?: string;
  children?: MenuItemConfig[];
}

// 面包屑项
export interface BreadcrumbItem {
  title: string;
  href?: string;
}

// 操作按钮配置
export interface ActionButtonConfig {
  key: string;
  label: string;
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  danger?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
  onClick: () => void;
}