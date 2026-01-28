import React from 'react'
import { ArrowUpRight, ExternalLink } from 'lucide-react'

type ExternalNavItem = {
  name: string
  href: string
  description: string
}

const EXTERNAL_LINKS: ExternalNavItem[] = [
  {
    name: '柚子复盘',
    href: 'http://hot.icfqs.com:7615/site/tdx-pc-find/page_yzfp.html',
    description: '盘后复盘入口，查看热门题材与个股表现',
  },
  {
    name: '连板天梯',
    href: 'http://hot.icfqs.com:7615/site/tdx-pc-hqpage/page-lbtt.html?color=0&bkcolor=141212',
    description: '连板梯队与高度榜单，支持夜盘深色背景',
  },
  {
    name: '板块联动',
    href: 'http://hot.icfqs.com:7615/site/pcwebcall/html/pc_tcld_fkql.html?disableJump=1&showltg=1&color=0&bkcolor=141212',
    description: '板块联动监控，原 iframe 页面改为外链打开',
  },
]

export const ExternalNavPage: React.FC = () => {
  return (
    <div className="min-h-svh bg-background">
      <main className="container mx-auto flex min-h-svh flex-col px-4 py-6">
        <div className="mb-6 flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <ExternalLink className="h-4 w-4" />
            <span>第三方导航</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            外部工具与看板导航
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            这些链接会在新标签页打开，保持当前 StockWeb
            布局可用。请根据需求选择对应工具。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {EXTERNAL_LINKS.map(link => (
            <div
              key={link.href}
              className="flex flex-col justify-between gap-3 rounded-lg border border-border bg-card/60 p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-lg font-semibold leading-tight">
                    {link.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {link.description}
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  前往
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-md border border-dashed border-border/60 bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          链接均指向第三方网站，若被浏览器拦截，请允许新窗口或复制地址后直接访问。
        </div>
      </main>
    </div>
  )
}
