# 变更：新增股票操作日志页面

## Why

需要一个持久化的买入/卖出/调仓记录页面，便于审计历史、快速过滤和搜索；同时希望封装每日复盘，记录当天操作摘要与复盘总结。

## What Changes

- 基于 Supabase 表 `operation_logs`（或等效 API）落库存储，字段：id、symbol、action（buy/sell/adjust）、quantity、price、fee、account（证券账户标识）、strategy_tag（可新建策略名）、tags(string[])、executed_at、note、created_at、updated_at。
- 提供 `/operations` 页面与侧边栏入口“操作日志”，包含列表、筛选（日期范围/股票/类型/策略/账户/标签/关键词）、排序（成交时间倒序）、加载/错误/空状态。
- 支持在页面内创建操作日志，校验必填与正数金额，策略 tag 支持即时创建，保存后刷新列表并提示成功/失败；开发环境提供本地兜底存储。
- 新增“每日复盘”记录能力：复盘记录包含日期、当日账户操作摘要（关联或选取当天操作日志）、复盘总结/心得，支持创建、查看历史复盘。

## Impact

- Affected specs: stock-operation-logs
- Affected code: 新增路由与页面 UI，操作日志数据访问层（Supabase 客户端 + dev fallback）、筛选/创建表单状态管理、侧边栏导航。
