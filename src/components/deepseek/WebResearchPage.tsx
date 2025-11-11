import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Button from '@/components/ui/button'
import { deepseekApi } from '@/lib/deepseek'
import type {
  DeepseekAnalysisRequest,
  DeepseekAnalysisResponse,
  DeepseekAnalysisResultPayload,
  DeepseekSource,
  DeepseekSseEvent,
} from '@/types/deepseek'
import {
  AlertCircle,
  Globe2,
  KeyRound,
  ListChecks,
  Loader2,
  ScrollText,
  Sparkles,
} from 'lucide-react'

const MAX_LOG_ITEMS = 200

interface LogEntry {
  id: string
  timestamp: string
  content: string
  type?: 'stream' | 'log'
}

const parseUrls = (value: string): string[] => {
  return value
    .split(/[\n,]+/)
    .map(url => url.trim())
    .filter(Boolean)
}

const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const asResultPayload = (
  result: DeepseekAnalysisResponse['result']
): DeepseekAnalysisResultPayload | undefined => {
  if (result && typeof result === 'object') {
    return result
  }
  return undefined
}

const extractSummary = (data: DeepseekAnalysisResponse | null): string => {
  if (!data) return ''

  const nested = asResultPayload(data.result)
  const candidates = [
    data.analysis,
    data.summary,
    typeof data.result === 'string' ? data.result : undefined,
    nested?.summary,
    nested?.analysis,
    nested?.content,
  ].filter((value): value is string => Boolean(value && value.trim()))

  return candidates[0] || ''
}

const combineInsights = (data: DeepseekAnalysisResponse | null): string[] => {
  if (!data) return []

  const nested = asResultPayload(data.result)
  const maybeLists = [
    data.insights,
    data.highlights,
    nested?.insights,
    nested?.highlights,
    nested?.keyFindings,
  ]

  return maybeLists.reduce<string[]>((acc, list) => {
    if (Array.isArray(list)) {
      const normalized = list
        .map(item =>
          typeof item === 'string' ? item.trim() : JSON.stringify(item)
        )
        .filter(Boolean)
      acc.push(...normalized)
    }
    return acc
  }, [])
}

const extractSources = (
  data: DeepseekAnalysisResponse | null
): DeepseekSource[] => {
  if (!data) return []

  const nested = asResultPayload(data.result)
  const lists = [data.sources, nested?.sources].filter(
    (list): list is DeepseekSource[] => Array.isArray(list)
  )

  if (lists.length === 0) {
    return []
  }

  return lists.flat().filter(source => Boolean(source?.url))
}

const isPotentialAnalysisPayload = (
  payload: unknown
): payload is DeepseekAnalysisResponse => {
  if (typeof payload !== 'object' || payload === null) {
    return false
  }
  const candidate = payload as Record<string, unknown>
  return (
    'summary' in candidate ||
    'analysis' in candidate ||
    'result' in candidate ||
    'insights' in candidate ||
    'sources' in candidate
  )
}

const normalizeAnalysisPayload = (
  payload: unknown
): DeepseekAnalysisResponse | null => {
  if (isPotentialAnalysisPayload(payload)) {
    return payload
  }

  if (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in (payload as Record<string, unknown>) &&
    isPotentialAnalysisPayload((payload as Record<string, unknown>).data)
  ) {
    return (payload as { data: DeepseekAnalysisResponse }).data
  }

  return null
}

const extractStreamChunk = (payload: unknown): string | null => {
  if (typeof payload !== 'object' || payload === null) {
    return null
  }

  const candidate = payload as {
    status?: string
    chunk?: {
      choices?: Array<{
        delta?: { content?: unknown }
        content?: unknown
        message?: { content?: unknown }
      }>
    }
  }

  if (candidate.status !== 'stream') {
    return null
  }

  const normalizeFragment = (fragment: unknown): string => {
    if (typeof fragment === 'string') {
      return fragment
    }
    if (Array.isArray(fragment)) {
      return fragment
        .map(item => normalizeFragment(item))
        .filter(Boolean)
        .join('')
    }
    if (
      typeof fragment === 'object' &&
      fragment !== null &&
      'text' in fragment
    ) {
      const maybeText = (fragment as { text?: unknown }).text
      return typeof maybeText === 'string'
        ? maybeText
        : normalizeFragment(maybeText)
    }
    if (
      typeof fragment === 'object' &&
      fragment !== null &&
      'content' in fragment
    ) {
      return normalizeFragment((fragment as { content?: unknown }).content)
    }
    return ''
  }

  const fragments =
    candidate.chunk?.choices
      ?.map(choice => {
        if (!choice) return ''
        return (
          normalizeFragment(choice.delta?.content) ||
          normalizeFragment(choice.content) ||
          normalizeFragment(choice.message?.content)
        )
      })
      .filter(Boolean) ?? []

  return fragments.length > 0 ? fragments.join('') : null
}

const formatSseEvent = (event: DeepseekSseEvent): string => {
  const label = event.event || 'message'
  return `${label}: ${event.data}`
}

const createLogEntry = (
  content: string,
  type: LogEntry['type'] = 'log'
): LogEntry => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  timestamp: new Date().toLocaleTimeString(),
  content,
  type,
})

export const WebResearchPage = () => {
  const [urlsInput, setUrlsInput] = useState('')
  const [prompt, setPrompt] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<DeepseekAnalysisResponse | null>(
    null
  )
  const [logs, setLogs] = useState<LogEntry[]>([])
  const streamController = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      streamController.current?.abort()
    }
  }, [])

  const [streamingContent, setStreamingContent] = useState('')

  const parsedUrls = useMemo(() => parseUrls(urlsInput), [urlsInput])
  const invalidUrls = useMemo(
    () => parsedUrls.filter(url => !isValidUrl(url)),
    [parsedUrls]
  )
  const summary = useMemo(() => {
    const finalSummary = extractSummary(analysis)
    return finalSummary || streamingContent
  }, [analysis, streamingContent])
  const insights = useMemo(() => combineInsights(analysis), [analysis])
  const sources = useMemo(() => extractSources(analysis), [analysis])
  const rawDebugPayload = useMemo(() => {
    if (!analysis) return ''
    try {
      return JSON.stringify(analysis, null, 2)
    } catch (stringifyError) {
      console.error(
        'Failed to stringify analysis payload',
        stringifyError,
        analysis
      )
      return '无法格式化返回数据，请检查控制台日志。'
    }
  }, [analysis])

  const appendLog = (content: string, type: LogEntry['type'] = 'log') => {
    setLogs(prev => {
      const next = [...prev, createLogEntry(content, type)]
      return next.length > MAX_LOG_ITEMS ? next.slice(-MAX_LOG_ITEMS) : next
    })
  }

  const appendStreamLog = (fragment: string) => {
    if (!fragment) return
    setLogs(prev => {
      if (prev.length > 0) {
        const last = prev[prev.length - 1]
        if (last.type === 'stream') {
          const updated = [...prev]
          updated[updated.length - 1] = {
            ...last,
            content: `${last.content}${fragment}`,
            timestamp: new Date().toLocaleTimeString(),
          }
          return updated
        }
      }

      const next = [...prev, createLogEntry(fragment, 'stream')]
      return next.length > MAX_LOG_ITEMS ? next.slice(-MAX_LOG_ITEMS) : next
    })
  }

  const resetLogs = (initialMessage?: string) => {
    if (initialMessage) {
      setLogs([createLogEntry(initialMessage)])
    } else {
      setLogs([])
    }
  }

  const resetStreamingContent = () => setStreamingContent('')

  const appendStreamingContent = (fragment: string) => {
    if (!fragment) return
    setStreamingContent(prev => `${prev}${fragment}`)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const urls = parseUrls(urlsInput)
    if (urls.length === 0) {
      setError('请至少输入一个有效的 URL')
      return
    }
    if (urls.some(url => !isValidUrl(url))) {
      setError('存在无法识别的 URL，请检查后重试')
      return
    }
    if (!password.trim()) {
      setError('请输入访问密码')
      return
    }

    const payload: DeepseekAnalysisRequest = {
      urls,
      password: password.trim(),
      prompt_template: prompt.trim() || undefined,
      stream: true,
    }

    streamController.current?.abort()
    const controller = new AbortController()
    streamController.current = controller

    setAnalysis(null)
    resetStreamingContent()
    resetLogs('已提交任务，等待服务器响应...')
    setIsSubmitting(true)

    try {
      let lastStructured: DeepseekAnalysisResponse | null = null

      for await (const event of deepseekApi.streamAnalysis(
        payload,
        controller.signal
      )) {
        let handledStreamChunk = false

        if (event.json) {
          const chunk = extractStreamChunk(event.json)
          if (chunk) {
            appendStreamingContent(chunk)
            appendStreamLog(chunk)
            handledStreamChunk = true
          }

          const normalized = normalizeAnalysisPayload(event.json)
          if (normalized) {
            lastStructured = normalized
            setAnalysis(normalized)
            resetStreamingContent()
          }
        }

        if (!handledStreamChunk) {
          appendLog(formatSseEvent(event))
        }
      }

      appendLog('流式响应已结束。')

      if (!lastStructured) {
        appendLog('未收到结构化分析结果，请参考日志信息。')
        setError('未收到有效分析结果，请查看日志。')
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        appendLog('流式请求已取消。')
      } else {
        const message =
          err instanceof Error ? err.message : '提交失败，请稍后再试'
        appendLog(`错误：${message}`)
        setError(message)
      }
    } finally {
      streamController.current = null
      setIsSubmitting(false)
    }
  }

  const handleClearLogs = () => resetLogs()

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary" />
            Deepseek 网页调研
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            输入需要调研的一组 URL 和自定义 Prompt，后台会爬虫网页内容并交由
            Deepseek 进行分析，最终的洞察会在此页面展示。
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe2 className="h-5 w-5 text-primary" />
                  调研参数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="urls">目标 URL（必填）</Label>
                    <Textarea
                      id="urls"
                      placeholder="每行一个 URL，或使用英文逗号分隔"
                      value={urlsInput}
                      onChange={event => setUrlsInput(event.target.value)}
                      className="font-mono"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      已解析 {parsedUrls.length} 个链接
                      {invalidUrls.length > 0 &&
                        `，其中 ${invalidUrls.length} 个格式不正确`}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prompt">Prompt（可选）</Label>
                    <Textarea
                      id="prompt"
                      placeholder="输入希望 Deepseek 关注的视角或输出格式"
                      value={prompt}
                      onChange={event => setPrompt(event.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">访问密码（必填）</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="请输入授权密码"
                      value={password}
                      onChange={event => setPassword(event.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <KeyRound className="h-3.5 w-3.5" />
                      密码用于保护接口，确保只有授权用户才能发起调研。
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        parsedUrls.length === 0 ||
                        invalidUrls.length > 0 ||
                        !password.trim()
                      }
                      className="flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          请求进行中...
                        </>
                      ) : (
                        <>
                          <ListChecks className="h-4 w-4" />
                          提交调研
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      提交后后台会自动抓取网页并生成分析，耗时取决于网页数量。
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>

            {analysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Deepseek 分析结果
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    {analysis.status && (
                      <span className="rounded-full border px-3 py-1 text-xs uppercase tracking-wide">
                        {analysis.status}
                      </span>
                    )}
                    {analysis.jobId && (
                      <span className="font-mono text-xs">
                        任务 ID：{analysis.jobId}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {summary && (
                    <section className="space-y-2">
                      <h3 className="text-lg font-semibold">核心摘要</h3>
                      <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
                        {summary}
                      </p>
                    </section>
                  )}

                  {insights.length > 0 && (
                    <section className="space-y-2">
                      <h3 className="text-lg font-semibold">重点洞察</h3>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        {insights.map((item, index) => (
                          <li key={`${item}-${index}`}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {sources.length > 0 && (
                    <section className="space-y-2">
                      <h3 className="text-lg font-semibold">引用来源</h3>
                      <div className="space-y-3">
                        {sources.map((source, index) => (
                          <div
                            key={`${source.url}-${index}`}
                            className="rounded-md border p-3 text-sm"
                          >
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-medium text-primary hover:underline break-all"
                            >
                              {source.title || source.url}
                            </a>
                            {source.snippet && (
                              <p className="mt-1 text-muted-foreground">
                                {source.snippet}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  <section className="space-y-2">
                    <details className="group">
                      <summary className="cursor-pointer select-none text-sm font-medium text-primary group-open:mb-2">
                        查看原始返回数据
                      </summary>
                      <pre className="max-h-[420px] overflow-auto rounded-md bg-muted p-4 text-xs">
                        {rawDebugPayload}
                      </pre>
                    </details>
                  </section>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6 lg:sticky lg:top-8">
            <Card>
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ScrollText className="h-5 w-5 text-primary" />
                  实时日志
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearLogs}
                  disabled={logs.length === 0 || isSubmitting}
                >
                  清空
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-64 lg:h-[520px] overflow-auto rounded-md border bg-muted/40 p-3">
                  {logs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      暂无日志输出。提交任务后可在此查看实时返回的数据。
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {logs.map(log => (
                        <li key={log.id}>
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            {log.timestamp}
                          </p>
                          <pre className="whitespace-pre-wrap wrap-break-word text-xs font-mono text-foreground">
                            {log.content}
                          </pre>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {isSubmitting && (
                  <p className="mt-2 text-xs text-primary">
                    正在接收流式响应...
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
