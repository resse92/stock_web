import React, { useState } from 'react'
import { RPSTable } from './Table'
import RPSFilters, { type RPSFilterValues } from './RPSFilters'
import { stockApi } from '@/lib/api'
import type { RpsItemData } from '@/types/stock'
import type { RpsFilter } from '@/types/api'
import { useToast } from '@/hooks/use-toast'

export const RPSPage: React.FC = () => {
  const [rpsData, setRpsData] = useState<RpsItemData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

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
        console.log(data)

        setRpsData(data)
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
    [toast]
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
