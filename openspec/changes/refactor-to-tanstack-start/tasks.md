## 1. 实施

- [ ] 1.1 添加 TanStack Start 依赖与基础配置（tanstack.config.ts、entry、tsconfig 路径别名、pnpm 脚本），保留 Tailwind/shadcn 设置。
- [ ] 1.2 构建根布局与全局样式接入（侧边栏壳、主题切换、头部 metadata/links），确保 SSR + 客户端水合正常。
- [ ] 1.3 用 Start 文件路由实现 `/` 仪表盘、`/rps`、`/web-research`、`/operations` 页面，保持现有组件与导航体验。
- [ ] 1.4 将股票数据、行情图、RPS 列表、操作日志、每日复盘等数据获取迁移到 route loader/action，统一错误处理与加载状态。
- [ ] 1.5 兼容 Deepseek SSE、Supabase/HTTP 客户端在服务器/客户端的调用（含开发 mock fallback），校正环境变量读取与类型定义。
- [ ] 1.6 更新构建/验证流程（pnpm lint/build），手工验证关键页面 SSR/水合，完成后勾选任务。
