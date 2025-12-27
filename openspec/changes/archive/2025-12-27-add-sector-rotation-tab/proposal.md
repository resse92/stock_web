# Change: 添加「板块轮动」嵌入页

## Why

- 用户希望在应用内直接查看板块轮动页面，避免跳转外部站点。

## What Changes

- 在导航中新增名为「板块轮动」的标签页。
- 在该标签页内通过 iframe 嵌入 `http://hot.icfqs.com:7615/site/pcwebcall/html/pc_tcld_fkql.html?disableJump=1&showltg=1&color=0&bkcolor=141212`。
- 保持现有布局风格，确保 iframe 自适应高度且不影响其他页面。

## Impact

- Affected specs: sector-rotation
- Affected code: 导航/路由布局、板块轮动页面组件
