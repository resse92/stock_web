## Context

现有应用基于 Vite + React Router 7 的 SPA 架构，数据获取通过 hooks + Jotai 缓存，接口兜底（mock）与错误处理分散在客户端。迁移到 TanStack Start 需要：
- 保留 UI/状态管理（Tailwind/shadcn/Jotai），但切换到 Start 的文件路由与 SSR 水合管线。
- 将股票/RPS/操作日志/Deepseek SSE 请求整合进 route loader/action，以便服务端预取、统一环境变量与降级处理。
- 确保 Supabase 与 HTTP 客户端在 server/client 都能安全使用（最小权限、仅在需要时暴露）。

## Goals / Non-Goals

- Goals: 提供 TanStack Start 应用壳与文件路由；复刻现有页面与导航；统一数据加载（含 mock fallback）到 loader/action；兼容 SSR/流式渲染；保持样式与 Jotai 持久化。
- Non-Goals: 变更业务字段/接口契约；新增新功能（超出现有页面）；重写 UI 主题或设计语言。

## Decisions

- 使用 TanStack Start 官方布局/route 结构（app/routes/...），根布局提供 sidebar shell 和 `<Meta/>`/`<Links/>` 头部注入。
- 数据获取优先在 loader 内调用现有 api lib（stockApi/deepseekApi/supabase 客户端），在 dev 且接口不可用时回退本地 mock；loader 抛错交由 ErrorBoundary 渲染错误态。
- SSE（Deepseek）在 action 侧发起并通过 Start Response 流式转发，客户端使用 useAction/useStream 消费；确保密码与端点从环境读取。
- 保持 Tailwind 入口（app/styles.css 或等效）与 shadcn 组件导入路径，别名 `@/*` 通过 tsconfig/tanstack.config 统一配置。

## Risks / Trade-offs

- SSR + loader 对现有纯客户端 hooks 侵入较大，需要梳理哪些逻辑留在客户端（如交互状态）与哪些搬到服务器。
- SSE 透传在 Start 可能需要自定义 headers/AbortController，需验证兼容性。
- Supabase 客户端在服务器端使用时需注意长连接与密钥暴露；可能需要拆 server/client 版本。

## Migration Plan

1) 初始化 Start 配置与入口，确保 Tailwind/shadcn 与别名可用；2) 迁移根布局/侧边栏；3) 逐路由迁移页面至文件路由；4) 将数据请求移动到 loader/action 并复用现有 api util；5) 处理 SSE 与 Supabase 调用路径；6) 运行 lint/build + 手测 SSR 水合。

## Open Questions

- Supabase 是否需要服务端 service key 访问，还是继续使用 anon key？
- 部署目标是否需要适配 Start 的 SSR 运行时（Node/Edge），相关 ENV 注入方式？
