# 变更：迁移到 TanStack Start 应用架构

## Why

当前为 Vite + React SPA，存在首屏未 SSR、路由与数据加载分散、接口兜底逻辑无法统一在服务端处理的问题；TanStack Start 提供文件路由、SSR/流式渲染、loader/action 数据管道，更适合后续扩展 Supabase、Deepseek SSE 与服务器端数据拼装。

## What Changes

- 基于 TanStack Start 重建应用壳：引入 tanstack.config、entry 组件、根布局/metadata，并保留现有 UI 主题、Tailwind/shadcn 配置。
- 用 Start 文件路由复刻 `/`、`/rps`、`/web-research` 以及操作日志（/operations）等页面，保持侧边栏/导航与页面状态切换体验。
- 将股票数据、RPS、Supabase 查询、Deepseek SSE 等接口接入 route loader/action，统一环境变量读取与开发兜底逻辑（mock fallback）。
- 调整构建/脚本与 TypeScript 配置以兼容 Start（tsconfig、别名、pnpm 脚本），并验证 SSR 构建与客户端水合。

## Impact

- Affected specs: app-platform
- Affected code: 应用入口与路由结构、数据访问层（stockApi/deepseekApi/Supabase 客户端）、环境配置、构建脚本与样式入口。
