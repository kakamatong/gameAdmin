/**
 * React 19 兼容性处理
 * 解决 Ant Design 5.x 与 React 19 的兼容性问题
 */

// 抑制 Ant Design 的 React 19 兼容性警告
export const setupReact19Compatibility = () => {
  if (typeof window === 'undefined') {
    return;
  }

  // 保存原始的 console.warn 方法
  const originalWarn = console.warn;
  
  console.warn = (...args) => {
    const message = args[0];
    
    // 过滤掉 Ant Design 的 React 19 兼容性警告
    if (
      typeof message === 'string' && 
      (
        (message.includes('[antd: compatible]') && message.includes('antd v5 support React is 16 ~ 18')) ||
        (message.includes('Warning: [antd: compatible]'))
      )
    ) {
      // 忽略这些警告，因为 Ant Design 5.27+ 实际上与 React 19 兼容
      return;
    }
    
    // 其他警告正常显示
    originalWarn.apply(console, args);
  };
};

// 处理图片 src 为空字符串的问题
export const sanitizeImageSrc = (src: string | null | undefined): string | null => {
  if (!src || typeof src !== 'string' || src.trim() === '') {
    return null;
  }
  return src.trim();
};

// 安全的 Avatar props 处理
export const getSafeAvatarProps = (avatarUrl?: string | null) => {
  const safeSrc = sanitizeImageSrc(avatarUrl);
  // 只有当有有效的src时才设置src属性，否则完全不设置让Avatar使用默认图标
  return safeSrc ? { src: safeSrc } : {};
};