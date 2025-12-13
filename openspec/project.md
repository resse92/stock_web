# 项目背景

## 目标与定位

StockWeb 是一个基于 React/Vite 的股票看板：提供投资组合概览、价格/成交量图表、股票卡片明细、RPS 排行查询，以及 Deepseek 驱动的网页调研工具。开发环境下在 API 不可用时会回退到本地模拟数据，优先使用实时接口数据。

## 技术栈

- React 19 + TypeScript + Vite 7（脚本与依赖使用 pnpm）
- Tailwind CSS 4 搭配 shadcn/ui（Radix UI）与 lucide-react 图标
- Jotai 状态管理（atomWithStorage 持久化至 localStorage）
- React Router 7 管理路由与布局
- Recharts 绘图；TanStack Table + TanStack Virtual 支撑大数据量 RPS 表格
- Supabase JS 客户端（可直接连接数据库读取业务数据）
- 工具：clsx、class-variance-authority、tailwind-merge
- 使用supabase进行数据存储和读写

## 项目约定

### 代码风格

- Prettier（.prettierrc）：无分号、单引号、trailingComma=es5、tabWidth=2、arrowParens=avoid。
- ESLint（eslint.config.js）：@eslint/js 推荐、typescript-eslint 推荐、react-hooks recommended-latest、react-refresh、prettier；忽略 dist。
- TypeScript 严格模式，bundler moduleResolution，`@/*` 路径别名（tsconfig.app.json）。
- Tailwind 设计令牌位于 src/index.css；优先使用 shadcn/ui 原语并通过 `cn` 组合类名。
- 使用 pnpm 脚本（`pnpm dev/build/lint/preview/format`）；保持 pnpm-lock.yaml 同步。

### 架构模式

- BrowserRouter 外壳 + shadcn 侧边栏布局；路由包含 Dashboard (/)、RPS (/rps)、Deepseek 网页调研 (/web-research)。
- 状态拆分为 Jotai 原子（uiAtoms、userAtoms、stockAtoms），部分持久化；src/stores 与 src/hooks 提供封装好的读写钩子。
- 数据层 src/lib：ConfigManager 读取环境变量；HttpClient 封装 fetch、统一头与错误处理；stockApi 拼装 REST 端点并在开发环境回退 mock；deepseekApi 处理 SSE 流。
- Supabase 直连：通过 Supabase JS 客户端直接查询数据库表（可用于股票、排行或配置数据），按需跳过中间 API 层，需配合最小权限与 RLS。
- 股票数据钩子（useStockDataWithStore、useChartDataWithStore、useStockQuoteWithStore）按 symbol/period 管理缓存键，返回 loading/error/refetch，并避免重复拉取。
- UI 基于 shadcn/ui 组件 + Tailwind 工具类；Recharts 绘图；TanStack Table + react-virtual 提供高性能 RPS 表格。

### 测试策略

- 当前无自动化测试套件（未配置 Jest/Cypress）；依赖 TypeScript + ESLint 与手动 UI 验证。
- `pnpm lint` 运行 ESLint；`pnpm build` 先 `tsc -b` 后 Vite build 做类型与静态检查。

### Git 工作流

- 未定义特定流程；默认使用功能分支 + PR，提交前保持 pnpm-lock.yaml 同步并执行 lint/build。无强制的 commit 约定或 git hooks。

## 领域上下文

- 股票模型：StockData {symbol, name, price, change, changePercent, volume, marketCap}；ChartData {date, price, volume}；StockQuote 额外包含 timestamp。
- Dashboard 展示概览卡片、价格图（area/line）与股票卡片；开发环境中 API 失败时回退 mock 数据。
- RPS 页面调用 `stockApi.getRps` 查询排行，支持 rps3/rps5/rps15/rps30（0–100）、marketCap、listingDays、date 筛选；表格可排序并虚拟滚动。
- 用户偏好原子覆盖自选股、持仓、收藏、刷新间隔/默认周期、通知、视图偏好。
- Deepseek 网页调研：提交 URL 列表 + 可选 Prompt/密码到分析端点，消费 SSE 流，累积日志/流式文本，收到结构化结果后呈现摘要、洞察与来源。
- Supabase 直连场景：可直接查询业务表以减少 API 跳数；需考虑鉴权、速率与字段最小化返回。

## 重要约束

- Node 18+ 与 pnpm 必备（见 README）；所有脚本使用 pnpm 运行。
- 环境变量：VITE_API_BASE_URL、VITE_API_TIMEOUT、VITE_APP_ENV、VITE_WS_URL（预留）；可选 VITE_WEB_INSIGHTS_ANALYZE_ENDPOINT / VITE_DEEPSEEK_ANALYZE_ENDPOINT 覆盖 Deepseek 分析端点；Supabase 直连需要 VITE_SUPABASE_URL、VITE_SUPABASE_ANON_KEY（或具备所需读权限的 Service Key），RLS/权限需在服务端配置。
- stockApi 仅在 `config.isDevelopment`（VITE_APP_ENV=development）时回退 mock 数据；生产环境需依赖真实接口。
- Deepseek 分析端点需密码并要求服务端支持 `text/event-stream`；可通过 AbortController 中断流。
- SPA 使用 BrowserRouter，部署需将未知路由回退到 index.html。

## 外部依赖

- Stock API：由 `VITE_API_BASE_URL` 提供（.env 示例为 https://pystock.82512138.xyz/，.env.example 为 http://localhost:3000），端点包括 `/api/stocks`、`/api/stocks/:symbol`、`/api/stocks/:symbol/historical?period=`、`/api/stocks/:symbol/quote`、`/api/v1/joinquant/rps`（接受 rps3/rps5/rps15/rps30、circulating_market_cap、listed_days 参数）；仅开发环境回退 mock。
- Supabase 数据库：通过 `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`（或具备读权限的 Service Key）连接，使用 Supabase JS 客户端查询；需遵守最小权限与 RLS 策略。
- Deepseek 网页洞察 API：默认 `/api/v1/web-insights/analyze`（基于同一 base URL），可用环境变量覆盖；POST 体包含 `urls`、`password`、可选 `prompt_template`、`stream=true`，返回 SSE。
- WebSocket 基址 `VITE_WS_URL` 预留给未来实时特性（当前未用）。
