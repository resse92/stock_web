# trade-calendar Specification

## Purpose
TBD - created by archiving change add-trade-date-calendar. Update Purpose after archive.
## Requirements
### Requirement: 交易日历以倒序分批获取 Supabase 交易日

交易日历组件 MUST 仅从 Supabase `trade_dates` 表读取 `trade_date` 字段，按 `trade_date` 倒序并以固定批次大小（默认 50 条）拉取数据，支持用户请求更多历史数据。

#### Scenario: 初次打开加载最新一批交易日

- **WHEN** 用户展开交易日历
- **THEN** 系统查询 Supabase `trade_dates`，按 `trade_date` 倒序限制至一批大小（默认 50）返回
- **AND** 这些日期会展示为可选交易日

#### Scenario: 加载更多获取更早一批且无重复

- **WHEN** 用户请求加载更多历史交易日
- **THEN** 系统继续按 `trade_date` 倒序获取比当前已加载最早日期更早的一批数据
- **AND** 只追加新增 `trade_date`，保持日期列表倒序且无重复

#### Scenario: 翻到更早月份自动加载历史批次

- **WHEN** 用户切换到比当前已加载最早日期更早的月份
- **THEN** 系统自动按批次继续向前请求交易日，直到覆盖目标月份或无更多数据
- **AND** 过程中不会重复添加已有日期，保持倒序

### Requirement: 日历仅允许选择 Supabase 返回的交易日

交易日历组件 MUST 只允许选择已经从 Supabase 获取到的 `trade_date`，非交易日或未加载日期 MUST 以禁用状态展示且不可触发选择。

#### Scenario: 非交易日禁用

- **WHEN** 日历渲染月视图
- **THEN** 不在已加载交易日列表中的日期均呈现禁用状态，点击不会触发回调

#### Scenario: 选择交易日回调

- **WHEN** 用户点击一个交易日
- **THEN** 组件将该日期的 `YYYY-MM-DD` 字符串传递给外部回调并更新选中态

