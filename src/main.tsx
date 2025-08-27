import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 添加错误处理
window.addEventListener('error', (e) => {
  console.error('JavaScript错误:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('未处理的Promise拒绝:', e.reason);
});

const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('开始渲染React应用...');
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('React应用渲染成功');
  } catch (error) {
    console.error('React渲染错误:', error);
    // 备用方案：使用原生HTML
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red; font-family: Arial;">
        <h1>React加载失败</h1>
        <p>错误信息: ${error.message}</p>
        <p>请检查浏览器控制台获取更多信息。</p>
      </div>
    `;
  }
} else {
  console.error('找不到root元素');
  document.body.innerHTML = '<div style="padding: 20px; color: red;">HTML结构错误：找不到root元素</div>';
}
