import React, { useState } from 'react'
import { CapitalFlowTable } from './Table'
import CapitalFlowFilters, {
  type CapitalFlowFilterValues,
} from './CapitalFlowFilters'
import type { CapitalFlowData } from '@/types/stock'
import { useToast } from '@/hooks/use-toast'
import { getSupabaseClient } from '@/lib/supabase'
import { format, subDays } from 'date-fns'

export const CapitalFlowPage: React.FC = () => {
  const [capitalFlowData, setCapitalFlowData] = useState<CapitalFlowData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchCapitalFlowData = React.useCallback(
    async (filters: CapitalFlowFilterValues) => {
      if (!filters.date) {
        toast({
          variant: 'destructive',
          title: '请选择日期',
          description: '请先选择一个交易日期',
        })
        return
      }

      try {
        setLoading(true)
        setError(null)

        const supabase = getSupabaseClient()

        // Calculate the start date based on days
        const endDate = new Date(filters.date)
        const startDate = subDays(endDate, filters.days - 1)
        const startDateStr = format(startDate, 'yyyy-MM-dd')
        const endDateStr = filters.date

        // Query Supabase for capital flow data
        const { data, error: queryError } = await supabase
          .from('joinquant_fund_flow')
          .select('*')
          .gte('date', startDateStr)
          .lte('date', endDateStr)
          .order('date', { ascending: false })
          .order('net_amount_main', { ascending: false })

        if (queryError) {
          throw new Error(`查询资金流向数据失败: ${queryError.message}`)
        }

        const typedData = (data ?? []) as CapitalFlowData[]
        setCapitalFlowData(typedData)

        if (typedData.length === 0) {
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
        setLoading(false)
      }
    },
    [toast]
  )

  const handleFiltersChange = React.useCallback(
    async (filters: CapitalFlowFilterValues) => {
      await fetchCapitalFlowData(filters)
    },
    [fetchCapitalFlowData]
  )

  return (
    <div className="h-screen overflow-hidden bg-background">
      <main className="container mx-auto px-4 py-4 h-full flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h2 className="text-3xl font-bold tracking-tight">资金流向</h2>

          <CapitalFlowFilters onFiltersChange={handleFiltersChange} />
        </div>

        <CapitalFlowTable
          data={capitalFlowData}
          loading={loading}
          error={error}
        />
      </main>
    </div>
  )
}
