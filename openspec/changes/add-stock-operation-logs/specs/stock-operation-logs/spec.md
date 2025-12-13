## ADDED Requirements

### Requirement: 持久化股票操作日志

系统 SHALL 将股票操作日志存储于可被前端访问的持久化数据源（Supabase 表 `operation_logs` 或等效 API），字段包含：id、symbol、action（buy/sell/adjust）、quantity、price、fee、account 标识、strategy_tag（可创建的字符串）、executed_at、note、tags（string[]）、created_at、updated_at；返回列表需按 executed_at 倒序。

#### Scenario: 加载已有日志

- **WHEN** 用户打开操作日志页面
- **THEN** 系统从主存储按 executed_at 倒序获取日志并渲染。

#### Scenario: 开发兜底

- **WHEN** 开发环境下主存储不可用
- **THEN** 系统透明使用本地兜底读写，并以非阻断的提示/Toast 告知持久性降级。

### Requirement: 操作日志页面

系统 SHALL 提供 `/operations` 路由（侧边栏为“操作日志”），展示包含 symbol、action、quantity、price、fee、account、strategy_tag、executed_at、tags/notes 摘要的表格或卡片，并呈现加载、错误、空状态。

#### Scenario: 查看已有列表

- **WHEN** 存在操作日志
- **THEN** 页面按 executed_at 倒序展示行，数值已格式化，展示可用的备注/标签。

#### Scenario: 空状态

- **WHEN** 没有操作日志
- **THEN** 页面显示空状态指引并提供创建操作的入口。

### Requirement: 筛选与搜索操作日志

系统 SHALL 提供客户端筛选：执行日期范围、symbol（可搜索选择）、action（buy/sell/adjust）、account、strategy_tag（可选/可创建）、tags；并提供关键词搜索（symbol、notes、tags）。

#### Scenario: 应用多重筛选

- **WHEN** 用户设置任意组合的日期范围、symbol、action、account、strategy_tag、tags 或关键词
- **THEN** 列表立即更新为匹配结果，并显示清除筛选的选项。

#### Scenario: 重置筛选

- **WHEN** 用户清除所有筛选/搜索
- **THEN** 列表恢复为 executed_at 倒序的全量数据。

### Requirement: 创建操作日志

系统 SHALL 允许通过表单/弹窗创建操作日志，采集 symbol、action、quantity、price、fee、account、strategy_tag（支持新建）、executed_at、可选 note 与 tags；提交前 MUST 校验必填项与正数（fee 可为 0）。

#### Scenario: 创建成功

- **WHEN** 用户提交有效的操作日志表单
- **THEN** 记录保存到主存储（或开发兜底），表单重置，显示成功提示，新记录出现在列表顶部并受当前筛选约束。

#### Scenario: 校验或保存失败

- **WHEN** 提交未通过校验或持久化失败
- **THEN** 用户看到内联校验信息或失败提示，已有列表不变。

### Requirement: 每日复盘记录

系统 SHALL 提供每日复盘能力，存储 review_date、关联或选取当日操作日志摘要，以及自由文本的复盘总结/心得；创建时 MUST 提供日期与复盘总结或摘要，并能查看历史复盘列表。

#### Scenario: 创建每日复盘

- **WHEN** 用户填写日期、选择当日操作日志（或填写摘要）及复盘总结后保存
- **THEN** 复盘被持久化，显示成功提示，记录出现在复盘列表中。

#### Scenario: 查看历史复盘

- **WHEN** 用户打开每日复盘视图
- **THEN** 系统列出过往复盘，展示日期、关联摘要与复盘总结，并提供加载/空/错误状态。
