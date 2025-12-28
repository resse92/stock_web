## RENAMED Requirements

- FROM: `### Requirement: 板块轮动嵌入页`
- TO: `### Requirement: 第三方导航页`

## MODIFIED Requirements

### Requirement: 第三方导航页
应用 SHALL 提供一个“第三方导航”页面，集中展示外部行情/复盘链接，并替换原先的板块联动内嵌页。

#### Scenario: 导航入口可见且路径明确
- **WHEN** 用户查看应用侧边导航
- **THEN** 可看到名为「第三方导航」的入口，点击后路由到 `/external-nav` 页面
- **AND** 侧边栏不再展示「板块联动」或「板块轮动」旧入口

#### Scenario: 页面列出指定外链
- **WHEN** 用户进入 `/external-nav`
- **THEN** 页面展示包含以下三个链接的导航列表，分别标注名称并可点击：
  - 柚子复盘 → `http://hot.icfqs.com:7615/site/tdx-pc-find/page_yzfp.html`
  - 连板天梯 → `http://hot.icfqs.com:7615/site/tdx-pc-hqpage/page-lbtt.html?color=0&bkcolor=141212`
  - 板块联动 → `http://hot.icfqs.com:7615/site/pcwebcall/html/pc_tcld_fkql.html?disableJump=1&showltg=1&color=0&bkcolor=141212`

#### Scenario: 外链新标签打开
- **WHEN** 用户点击上述任一链接
- **THEN** 目标在新标签页打开（`target="_blank"` 且 `rel="noreferrer"`），当前导航页保持可见且无需 iframe 嵌入
