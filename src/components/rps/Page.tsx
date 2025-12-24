import React, { useState } from 'react'
import { RPSTable } from './Table'
import RPSFilters, { type RPSFilterValues } from './RPSFilters'
import { stockApi } from '@/lib/api'
import type { RpsItemData } from '@/types/stock'
import type { RpsFilter } from '@/types/api'
import { useToast } from '@/hooks/use-toast'
import { getSupabaseClient } from '@/lib/supabase'

interface StockConceptRow {
  stock_code: string
  concept_id: number
}

interface ConceptRow {
  id: number
  name: string
}

export const RPSPage: React.FC = () => {
  const [rpsData, setRpsData] = useState<RpsItemData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchConceptsByStockCodes = React.useCallback(
    async (codes: string[]): Promise<Record<string, string[]>> => {
      if (codes.length === 0) return {}

      const supabase = getSupabaseClient()

      const { data: stockConceptRows, error: stockConceptError } =
        await supabase
          .from<StockConceptRow>('ths_stock_concepts')
          .select('stock_code, concept_id')
          .in('stock_code', codes)

      if (stockConceptError) {
        throw new Error(`加载股票概念失败: ${stockConceptError.message}`)
      }

      const conceptIds = Array.from(
        new Set((stockConceptRows ?? []).map(row => row.concept_id))
      )

      if (conceptIds.length === 0) return {}

      const { data: conceptRows, error: conceptError } = await supabase
        .from<ConceptRow>('ths_concepts')
        .select('id, name')
        .in('id', conceptIds)

      if (conceptError) {
        throw new Error(`加载概念名称失败: ${conceptError.message}`)
      }

      const conceptNameMap = new Map(
        (conceptRows ?? []).map(row => [row.id, row.name])
      )

      return (stockConceptRows ?? []).reduce<Record<string, string[]>>(
        (acc, row) => {
          const conceptName = conceptNameMap.get(row.concept_id)
          if (!conceptName) return acc

          if (!acc[row.stock_code]) {
            acc[row.stock_code] = []
          }

          if (!acc[row.stock_code].includes(conceptName)) {
            acc[row.stock_code].push(conceptName)
          }
          return acc
        },
        {}
      )
    },
    []
  )

  const handleFiltersChange = React.useCallback(
    async (filters: RPSFilterValues) => {
      // 转换筛选条件为API格式
      const rpsFilter: RpsFilter = {
        rps3: filters.rps3.enabled
          ? { min: filters.rps3.min, max: filters.rps3.max }
          : undefined,
        rps5: filters.rps5.enabled
          ? { min: filters.rps5.min, max: filters.rps5.max }
          : undefined,
        rps15: filters.rps15.enabled
          ? { min: filters.rps15.min, max: filters.rps15.max }
          : undefined,
        rps30: filters.rps30.enabled
          ? { min: filters.rps30.min, max: filters.rps30.max }
          : undefined,
        marketCap: filters.marketCap,
        listingDays: filters.listingDays,
      }

      try {
        setLoading(true)
        setError(null)

        const data = await stockApi.getRps(filters.date, rpsFilter)
        const codes = data.map(item => item.code)

        try {
          const conceptMap = await fetchConceptsByStockCodes(codes)
          const merged = data.map(item => ({
            ...item,
            concepts:
              conceptMap[item.code] ??
              item.concepts ??
              (item.concept ? [item.concept] : undefined),
          }))
          setRpsData(merged)
        } catch (conceptError) {
          console.error('加载概念信息失败:', conceptError)
          toast({
            variant: 'destructive',
            title: '加载概念失败',
            description:
              conceptError instanceof Error
                ? conceptError.message
                : '无法获取概念信息，请稍后再试',
          })
          setRpsData(data)
        }
      } catch (err) {
        console.error('获取RPS数据失败:', err)
        const errorMessage =
          err instanceof Error ? err.message : '获取数据失败，请稍后重试'

        // 清空数据
        setRpsData([])
        setError(errorMessage)

        // 显示toast错误提醒
        toast({
          variant: 'destructive',
          title: '请求失败',
          description: errorMessage,
        })
      } finally {
        setLoading(false)
      }
    },
    [toast, fetchConceptsByStockCodes]
  )

  return (
    <div className="h-screen overflow-hidden bg-background">
      <main className="container mx-auto px-4 py-4 h-full flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h2 className="text-3xl font-bold tracking-tight">RPS</h2>

          <RPSFilters onFiltersChange={handleFiltersChange} />
        </div>

        <div className="w-full flex-1 min-h-0">
          <RPSTable data={rpsData} loading={loading} error={error} />
        </div>
      </main>
    </div>
  )
}
