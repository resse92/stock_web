import React from 'react'

const SECTOR_ROTATION_URL =
  'http://hot.icfqs.com:7615/site/pcwebcall/html/pc_tcld_fkql.html?disableJump=1&showltg=1&color=0&bkcolor=141212'

export const SectorRotationPage: React.FC = () => {
  return (
    <div className="h-screen overflow-hidden bg-background">
      <main className="container mx-auto flex h-full flex-col px-4 py-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">板块轮动</h2>
            <p className="text-sm text-muted-foreground">
              嵌入外部板块轮动看板，保持与其他页面一致的布局体验。
            </p>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-muted/30">
          <iframe
            src={SECTOR_ROTATION_URL}
            title="板块轮动"
            className="h-full w-full border-0"
            loading="lazy"
          />
        </div>
      </main>
    </div>
  )
}
