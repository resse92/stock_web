# Change: 添加第三方导航页并下线板块联动内嵌

## Why

- 需要在应用内提供多个第三方行情/复盘入口，方便跳转
- 现有板块联动 iframe 单页用途被替换，需要移除原入口

## What Changes

- 新增“第三方导航”页面，集中列出柚子复盘、连板天梯、板块联动等外链入口
- 更新路由与侧边栏文案/路径，替换旧的板块联动嵌入页
- 外部链接统一新标签打开，避免跨域嵌入问题

## Impact

- Affected specs: sector-rotation
- Affected code: src/components/sector-rotation/SectorRotationPage.tsx, src/App.tsx, src/components/Sidebar.tsx
