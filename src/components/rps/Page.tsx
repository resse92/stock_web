import React, { useState, useEffect } from 'react'
import { RPSTable } from './Table'
import { Header } from '../Header'
import { useSidebarZustand } from '@/contexts/SidebarContextZustand'
import RPSFilters, { type RPSFilterValues } from './RPSFilters'
import { stockApi } from '@/lib/api'
import type { StockData } from '@/types/stock'
import type { RpsFilter } from '@/types/api'
import { useToast } from '@/hooks/use-toast'

export const RPSPage: React.FC = () => {
  const { isCollapsed } = useSidebarZustand()
  const [rpsData, setRpsData] = useState<StockData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFiltersChange = React.useCallback(
    async (filters: RPSFilterValues) => {
      console.log('筛选条件变化:', filters)

      // 转换筛选条件为API格式
      const rpsFilter: RpsFilter = {
        rps3: { min: filters.rps3.min, max: filters.rps3.max },
        rps5: { min: filters.rps5.min, max: filters.rps5.max },
        rps15: { min: filters.rps15.min, max: filters.rps15.max },
        rps30: { min: filters.rps30.min, max: filters.rps30.max },
        marketCap: filters.marketCap,
        listingDays: filters.listingDays,
      }

      try {
        setLoading(true)
        setError(null)

        // TODO: 这里需要根据筛选条件中的enabled状态来构建正确的API请求
        // 目前API接口需要所有RPS参数，但筛选器中有enabled状态控制
        // 需要处理以下逻辑：
        // 1. 只传递enabled=true的RPS条件给API
        // 2. 对于disabled的RPS条件，可能需要传递默认范围或忽略
        const data = await stockApi.getRps(filters.date, rpsFilter)

        // TODO: 根据筛选条件处理返回的数据
        // 1. 客户端过滤：根据enabled状态过滤数据
        // 2. 应用市值和上市天数筛选（如果API没有处理）
        // 3. 数据排序和格式化
        // 4. 添加RPS相关字段到表格显示
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
      <Header />

      {/* Main content with dynamic left margin for sidebar */}
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? 'ml-16' : 'ml-64'
        } h-full overflow-hidden`}
      >
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
    </div>
  )
}
