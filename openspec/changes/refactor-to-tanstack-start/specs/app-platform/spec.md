## ADDED Requirements

### Requirement: TanStack Start 应用外壳与路由

系统 SHALL 以 TanStack Start 构建 SSR 应用，使用文件路由提供根布局/metadata/links 与 `/`、`/rps`、`/web-research`、`/operations` 页面，并包含自定义 404 处理；侧边栏与主题切换保持现有体验。

#### Scenario: 首屏 SSR 与水合

- **WHEN** 用户首次访问任一受支持路由
- **THEN** 服务器返回包含侧边栏布局和对应页面内容的 HTML，客户端成功水合后继续无刷新导航，持久化的主题/偏好生效。

#### Scenario: 未知路由降级

- **WHEN** 用户访问不存在的路由
- **THEN** 系统展示自定义 404 页面，并提供返回仪表盘的导航入口。

### Requirement: 统一数据加载与兜底

系统 SHALL 使用 TanStack Start 的 loader/action 获取股票列表、行情图、报价、RPS、操作日志/复盘与 Deepseek 请求所需数据；环境配置在服务器端安全读取（适配 dev/prod），在开发环境接口失败时 MUST 回退本地 mock 并继续渲染。

#### Scenario: loader 成功返回

- **WHEN** 外部 API 或 Supabase 可用
- **THEN** loader 按配置的 base URL/keys 拉取数据，页面展示 loading/error 状态并最终按预期渲染数据。

#### Scenario: 开发兜底

- **WHEN** 配置为开发环境且接口失败或超时
- **THEN** loader/action 透明使用本地 mock 数据并提示降级，但页面保持可交互。

### Requirement: Deepseek SSE 与 Supabase 兼容

系统 SHALL 在 Start 架构下支持 Deepseek SSE 流式响应与 Supabase 查询：SSE 通过 action/Response 流式透传并可被用户取消；Supabase 客户端按 server/client 场景实例化并避免暴露敏感 key。

#### Scenario: Deepseek 流式分析

- **WHEN** 用户在 `/web-research` 发起分析
- **THEN** action 建立到 Deepseek 端点的 SSE，向客户端流式传递数据，用户可中断请求且连接被关闭。

#### Scenario: Supabase 安全访问

- **WHEN** 需要读写操作日志或复盘数据
- **THEN** 系统在服务器端使用安全配置的 Supabase 客户端执行查询/写入，客户端仅接收必要字段，不暴露 service key。
