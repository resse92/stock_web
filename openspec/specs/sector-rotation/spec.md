# sector-rotation Specification

## Purpose
TBD - created by archiving change add-sector-rotation-tab. Update Purpose after archive.
## Requirements
### Requirement: 板块轮动嵌入页
应用 SHALL 在主界面提供名为「板块轮动」的入口，并在当前 SPA 布局内嵌入指定外部网页。

#### Scenario: 导航可见
- **WHEN** 用户查看应用主界面或侧边导航
- **THEN** 可看到名为「板块轮动」的标签页/入口，并与现有页面同级展示

#### Scenario: 页面内嵌外部地址
- **WHEN** 用户点击「板块轮动」入口
- **THEN** 应用在当前布局内渲染 iframe，加载 `http://hot.icfqs.com:7615/site/pcwebcall/html/pc_tcld_fkql.html?disableJump=1&showltg=1&color=0&bkcolor=141212`，iframe 填满可视区域并支持滚动，无需额外跳转

