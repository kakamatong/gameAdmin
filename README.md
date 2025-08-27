# 游戏管理后台前端

一个基于React + TypeScript + Ant Design的现代化游戏管理后台系统。

## 🚀 项目特性

- 🎯 **现代化技术栈**: React 18 + TypeScript + Vite + Ant Design 5
- 🛡️ **完整认证系统**: JWT认证 + 权限控制 + 路由守卫
- 📱 **响应式设计**: 支持桌面端和移动端访问
- 🎨 **优雅界面**: 基于Ant Design的统一设计语言
- 🔧 **状态管理**: Redux Toolkit + RTK Query
- 📡 **API集成**: 完整的HTTP客户端配置和错误处理
- 🎪 **模块化架构**: 清晰的目录结构和组件划分

## 🏗️ 技术架构

### 核心技术栈
- **前端框架**: React 18.2+
- **类型检查**: TypeScript 5.x
- **构建工具**: Vite 5.x
- **UI组件**: Ant Design 5.x
- **状态管理**: Redux Toolkit + RTK Query
- **路由管理**: React Router v6
- **HTTP客户端**: Axios
- **样式处理**: Less + CSS Modules
- **时间处理**: Day.js

### 项目结构
```
frontend/
├── src/
│   ├── components/          # 通用组件
│   │   ├── common/         # 公共组件
│   │   ├── forms/          # 表单组件
│   │   └── layout/         # 布局组件
│   ├── pages/              # 页面组件
│   │   ├── auth/           # 认证页面
│   │   ├── dashboard/      # 控制台页面
│   │   ├── users/          # 用户管理页面
│   │   ├── mails/          # 邮件管理页面
│   │   ├── logs/           # 日志查询页面
│   │   └── admin/          # 管理员管理页面
│   ├── services/           # API服务层
│   ├── store/              # Redux状态管理
│   │   ├── slices/         # Redux切片
│   │   └── api/            # RTK Query API
│   ├── types/              # TypeScript类型定义
│   ├── utils/              # 工具函数
│   ├── hooks/              # 自定义Hooks
│   ├── constants/          # 常量定义
│   ├── styles/             # 全局样式
│   └── router/             # 路由配置
├── public/                 # 静态资源
└── package.json           # 项目配置
```

## 🎯 核心功能

### 1. 管理员认证
- ✅ 登录/登出功能
- ✅ JWT Token管理
- ✅ 权限验证
- ✅ 路由守卫
- ✅ 自动登录恢复

### 2. 用户管理
- ✅ 用户列表查询（分页、搜索、筛选）
- ✅ 用户详情查看
- ✅ 用户信息编辑（昵称、状态、财富）
- ✅ 用户状态管理
- ✅ 财富信息管理

### 3. 邮件管理
- ✅ 邮件列表查看
- ✅ 发送全服邮件
- ✅ 发送个人邮件
- ✅ 邮件状态管理
- ✅ 奖励配置
- ✅ 邮件统计信息

### 4. 日志查询
- 🚧 登录日志查询（功能框架已就绪）
- 🚧 对局日志查询（功能框架已就绪）
- 🚧 统计分析（功能框架已就绪）

### 5. 系统管理
- ✅ 响应式布局
- ✅ 主题配置
- ✅ 侧边栏折叠
- ✅ 面包屑导航

## 🛠️ 开发环境

### 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装依赖
```bash
cd frontend
npm install
```

### 开发服务器
```bash
npm run dev
```
服务器将在 http://localhost:3000 启动

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 🔧 配置说明

### 环境变量
项目支持以下环境变量配置：

```bash
# .env (开发环境)
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=游戏管理后台
VITE_APP_VERSION=1.0.0

# .env.production (生产环境)
VITE_API_BASE_URL=https://your-production-domain.com/api
VITE_APP_TITLE=游戏管理后台
VITE_APP_VERSION=1.0.0
```

### Vite配置
- 路径别名: `@` 指向 `src` 目录
- API代理: 开发环境自动代理到后端服务
- Less支持: 支持Less预处理器
- TypeScript: 完整的类型检查支持

## 🌐 API集成

### 后端接口对接
项目已完整对接后端Golang服务的所有管理员API：

1. **认证接口**: 
   - POST `/api/admin/login` - 管理员登录
   - POST `/api/admin/logout` - 管理员登出
   - GET `/api/admin/info` - 获取管理员信息

2. **用户管理接口**:
   - GET `/api/admin/users` - 获取用户列表
   - GET `/api/admin/users/:id` - 获取用户详情
   - PUT `/api/admin/users/:id` - 更新用户信息

3. **邮件管理接口**:
   - POST `/api/admin/mails/send` - 发送系统邮件
   - GET `/api/admin/mails` - 获取邮件列表
   - GET `/api/admin/mails/:id` - 获取邮件详情
   - PUT `/api/admin/mails/:id/status` - 更新邮件状态
   - GET `/api/admin/mails/stats` - 获取邮件统计

4. **日志查询接口**:
   - GET `/api/admin/logs/auth` - 获取登录日志
   - GET `/api/admin/logs/game` - 获取对局日志
   - GET `/api/admin/logs/login-stats` - 获取登录统计
   - GET `/api/admin/logs/game-stats` - 获取对局统计

### HTTP客户端特性
- 自动添加JWT Token
- 统一错误处理
- 请求/响应拦截器
- 自动重试机制
- Loading状态管理

## 🎨 UI/UX设计

### 设计原则
- **一致性**: 统一的视觉语言和交互模式
- **易用性**: 直观的操作流程和清晰的信息架构
- **响应性**: 适配不同设备和屏幕尺寸
- **可访问性**: 支持键盘导航和屏幕阅读器

### 主题配置
```typescript
const themeConfig = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
  },
  components: {
    Layout: {
      headerBg: '#001529',
      siderBg: '#001529',
    },
  }
};
```

## 🔒 权限系统

### 权限级别
- **超级管理员**: 拥有所有权限
- **普通管理员**: 基础查看和操作权限
- **权限控制**: 基于角色的动态菜单和按钮权限

### 路由守卫
- 自动检查登录状态
- JWT Token验证
- 权限路由过滤
- 自动重定向

## 🚀 部署指南

### 构建项目
```bash
npm run build
```

### 部署到生产环境
1. 将 `dist` 目录上传到Web服务器
2. 配置Nginx或Apache代理
3. 设置正确的API_BASE_URL
4. 启用HTTPS（推荐）

### Nginx配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend-server:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🐛 问题排查

### 常见问题
1. **编译错误**: 检查Node.js版本和依赖安装
2. **API连接失败**: 检查环境变量和后端服务状态
3. **登录失败**: 检查JWT密钥配置和用户凭据
4. **权限问题**: 检查用户角色和权限配置

### 调试技巧
- 使用浏览器开发者工具
- 检查Redux DevTools状态
- 查看网络请求日志
- 启用详细日志输出

## 📝 开发规范

### 代码规范
- 使用TypeScript严格模式
- 遵循ESLint和Prettier规则
- 采用驼峰命名法
- 编写有意义的注释

### 组件开发
- 使用函数式组件和Hooks
- 遵循单一职责原则
- 正确使用PropTypes或TypeScript
- 编写可复用的组件

### 状态管理
- 使用Redux Toolkit
- 合理划分slice
- 使用RTK Query处理异步数据
- 避免不必要的状态提升

## 🤝 贡献指南

1. Fork项目
2. 创建特性分支
3. 提交代码变更
4. 推送到分支
5. 创建Pull Request

## 📄 开源协议

本项目采用 [MIT](LICENSE) 开源协议。

## 🙏 致谢

感谢以下开源项目：
- [React](https://reactjs.org/)
- [Ant Design](https://ant.design/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

如有问题或建议，欢迎提交Issue或Pull Request！