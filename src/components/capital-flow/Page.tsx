import React, { useState } from 'react'
import { CapitalFlowTable } from './Table'
import CapitalFlowFilters, {
  type CapitalFlowFilterValues,
} from './CapitalFlowFilters'
import type { CapitalFlowData } from '@/types/stock'
import { useToast } from '@/hooks/use-toast'
import { getSupabaseClient } from '@/lib/supabase'
import { format, subDays } from 'date-fns'

type RpsRow = {
  code: string
  name: string
  date: string
}

export const CapitalFlowPage: React.FC = () => {
  const [capitalFlowData, setCapitalFlowData] = useState<CapitalFlowData[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [lastFilters, setLastFilters] =
    useState<CapitalFlowFilterValues | null>(null)
  const { toast } = useToast()
  const PAGE_SIZE = 100

  const fetchCapitalFlowData = React.useCallback(
    async (filters: CapitalFlowFilterValues, append = false) => {
      if (!filters.date) {
        toast({
          variant: 'destructive',
          title: '请选择日期',
          description: '请先选择一个交易日期',
        })
        return
      }

      try {
        if (append) {
          setLoadingMore(true)
        } else {
          setLoading(true)
        }
        setError(null)

        const supabase = getSupabaseClient()

        // Calculate the start date based on days
        const endDate = new Date(filters.date)
        const startDate = subDays(endDate, filters.days - 1)
        const startDateStr = format(startDate, 'yyyy-MM-dd')
        const endDateStr = filters.date

        // Query Supabase for capital flow data
        const offset = append ? capitalFlowData.length : 0
        const { data, error: queryError } = await supabase
          .from('joinquant_fund_flow')
          .select('*')
          .gte('date', startDateStr)
          .lte('date', endDateStr)
          .order('date', { ascending: false })
          .order('net_amount_main', { ascending: false })
          .range(offset, offset + PAGE_SIZE - 1)

        if (queryError) {
          throw new Error(`查询资金流向数据失败: ${queryError.message}`)
        }

        const typedData = (data ?? []) as CapitalFlowData[]

        let enrichedData = typedData
        const uniqueCodes = Array.from(
          new Set(typedData.map(item => item.sec_code).filter(Boolean))
        )

        if (uniqueCodes.length > 0) {
          const { data: rpsData, error: rpsError } = await supabase
            .from('rps')
            .select('code,name,date')
            .in('code', uniqueCodes)

            .gte('date', startDateStr)
            .lte('date', endDateStr)
            .order('date', { ascending: false })

          if (rpsError) {
            console.error('获取RPS名称数据失败:', rpsError)
          } else if (rpsData && rpsData.length > 0) {
            const nameMap = new Map<string, string>()
            ;(rpsData as RpsRow[]).forEach(row => {
              if (!nameMap.has(row.code)) {
                nameMap.set(row.code, row.name)
              }
            })
            enrichedData = typedData.map(item => ({
              ...item,
              name: nameMap.get(item.sec_code) ?? item.name,
            }))
          }
        }

        const mergedData = append
          ? [...capitalFlowData, ...enrichedData]
          : enrichedData

        setCapitalFlowData(mergedData)
        setHasMore(typedData.length === PAGE_SIZE)
        setLastFilters(filters)

        if (mergedData.length === 0) {
          toast({
            title: '无数据',
            description: '该时间段内没有资金流向数据',
          })
        }
      } catch (err) {
        console.error('获取资金流向数据失败:', err)
        const errorMessage =
          err instanceof Error ? err.message : '获取数据失败，请稍后重试'

        setCapitalFlowData([])
        setError(errorMessage)

        toast({
          variant: 'destructive',
          title: '请求失败',
          description: errorMessage,
        })
      } finally {
        if (append) {
          setLoadingMore(false)
        } else {
          setLoading(false)
        }
      }
    },
    [PAGE_SIZE, capitalFlowData, toast]
  )

  const handleFiltersChange = React.useCallback(
    async (filters: CapitalFlowFilterValues) => {
      await fetchCapitalFlowData(filters)
    },
    [fetchCapitalFlowData]
  )

  const handleLoadMore = React.useCallback(async () => {
    if (loading || loadingMore || !hasMore || !lastFilters) return
    await fetchCapitalFlowData(lastFilters, true)
  }, [fetchCapitalFlowData, hasMore, lastFilters, loading, loadingMore])

  return (
    <div className="min-h-svh bg-background">
      <main className="container mx-auto flex min-h-svh h-svh flex-col gap-4 px-4 py-4 overflow-hidden">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            资金流向
          </h2>

          <CapitalFlowFilters onFiltersChange={handleFiltersChange} />
        </div>

        <div className="flex-1 min-h-0">
          <CapitalFlowTable
            data={capitalFlowData}
            loading={loading}
            loadingMore={loadingMore}
            error={error}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
          />
        </div>
      </main>
    </div>
  )
}
