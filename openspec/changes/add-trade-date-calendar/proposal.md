# Change: 新增 Supabase 交易日历组件

## Why

当前日期筛选基于原生输入框，无法限制用户选择非交易日，也缺少与数据库中实际交易日期的同步。

## What Changes

- 新增一个基于 Supabase `trade_dates` 表的交易日历组件，只读取 `trade_date` 字段并按日期倒序分批加载
- 组件交互仅允许选择返回的交易日，支持继续加载更早的日期
- 预留组件在现有筛选场景（如 RPS 页面）中的替换接入

## Impact

- Affected specs: trade-calendar
- Affected code: `src/lib/supabase.ts`、`src/components/ui`、`src/components/rps/RPSFilters.tsx`
