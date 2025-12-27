import React from 'react'

const SECTOR_ROTATION_PATH =
  '/site/pcwebcall/html/pc_tcld_fkql.html?disableJump=1&showltg=1&color=0&bkcolor=141212'

export const SectorRotationPage: React.FC = () => {
  const [hasError, setHasError] = React.useState(false)

  const iframeSrc = React.useMemo(() => {
    const isHttps =
      typeof window !== 'undefined' && window.location.protocol === 'https:'
    const protocol = isHttps ? 'https:' : 'http:'
    return `${protocol}//hot.icfqs.com:7615${SECTOR_ROTATION_PATH}`
  }, [])

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
          {hasError ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center text-sm text-muted-foreground">
              <p>iframe 加载失败，可能是目标站点未支持 HTTPS。</p>
              <a
                className="text-primary underline"
                href={iframeSrc}
                target="_blank"
                rel="noreferrer"
              >
                在新标签页打开
              </a>
            </div>
          ) : (
            <iframe
              src={iframeSrc}
              title="板块轮动"
              className="h-full w-full border-0"
              loading="lazy"
              onError={() => setHasError(true)}
            />
          )}
        </div>
      </main>
    </div>
  )
}
