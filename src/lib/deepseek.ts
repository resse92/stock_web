import { httpClient } from './http-client'
import { config } from './config'
import type {
  DeepseekAnalysisRequest,
  DeepseekAnalysisResponse,
  DeepseekSseEvent,
} from '@/types/deepseek'

interface ParsedSseEvent {
  event?: string
  data: string
}

/**
 * API client for the Deepseek web research workflow.
 * Wraps the underlying HTTP client so endpoints can be configured via env.
 */
class DeepseekService {
  private readonly endpoint: string

  constructor() {
    const configuredEndpoint =
      import.meta.env.VITE_WEB_INSIGHTS_ANALYZE_ENDPOINT ||
      import.meta.env.VITE_DEEPSEEK_ANALYZE_ENDPOINT

    this.endpoint = configuredEndpoint || '/api/v1/web-insights/analyze'
  }

  private resolveUrl(): string {
    if (this.endpoint.startsWith('http')) {
      return this.endpoint
    }

    const baseUrl = config.apiBaseUrl.endsWith('/')
      ? config.apiBaseUrl.slice(0, -1)
      : config.apiBaseUrl
    const path = this.endpoint.startsWith('/')
      ? this.endpoint
      : `/${this.endpoint}`

    return `${baseUrl}${path}`
  }

  public async analyzeUrls(
    payload: DeepseekAnalysisRequest
  ): Promise<DeepseekAnalysisResponse> {
    const response = await httpClient.post<DeepseekAnalysisResponse>(
      this.endpoint,
      payload
    )
    return response.data as DeepseekAnalysisResponse
  }

  public async *streamAnalysis(
    payload: DeepseekAnalysisRequest,
    signal?: AbortSignal
  ): AsyncGenerator<DeepseekSseEvent> {
    const response = await fetch(this.resolveUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(payload),
      signal,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    if (!response.body) {
      throw new Error('当前环境不支持读取 SSE 流。')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    try {
      while (true) {
        const { value, done } = await reader.read()

        if (done) {
          buffer += decoder.decode()
          break
        }

        buffer += decoder.decode(value, { stream: true })

        while (true) {
          const boundaryIndex = buffer.indexOf('\n\n')
          if (boundaryIndex === -1) {
            break
          }

          const rawEvent = buffer.slice(0, boundaryIndex).trim()
          buffer = buffer.slice(boundaryIndex + 2)

          if (!rawEvent) continue

          const parsedEvent = parseSseBlock(rawEvent)
          yield this.buildEventPayload(parsedEvent)
        }
      }

      const tail = buffer.trim()
      if (tail) {
        const parsedTail = parseSseBlock(tail)
        yield this.buildEventPayload(parsedTail)
      }
    } finally {
      reader.releaseLock()
    }
  }

  private buildEventPayload(event: ParsedSseEvent): DeepseekSseEvent {
    const payload: DeepseekSseEvent = {
      event: event.event,
      data: event.data,
    }

    const trimmed = event.data.trim()
    if (trimmed && (trimmed.startsWith('{') || trimmed.startsWith('['))) {
      try {
        payload.json = JSON.parse(trimmed)
      } catch {
        // Ignore JSON parse issues for non-JSON logs
      }
    }

    return payload
  }
}

const parseSseBlock = (block: string): ParsedSseEvent => {
  const lines = block.split(/\r?\n/)
  let eventName: string | undefined
  const dataLines: string[] = []

  for (const line of lines) {
    if (line.startsWith('event:')) {
      eventName = line.slice(6).trim()
    } else if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trimStart())
    }
  }

  return {
    event: eventName,
    data: dataLines.join('\n'),
  }
}

export const deepseekApi = new DeepseekService()
export default deepseekApi
