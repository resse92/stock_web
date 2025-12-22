import { useEffect, useMemo, useState } from 'react'
import { Layers, Loader2, Search } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import Button from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { getSupabaseClient } from '@/lib/supabase'

interface Concept {
  id: number
  name: string
}

interface MatchedStock {
  stockCode: string
  conceptCount: number
  latestTradeDate?: string
}

export const ConceptsPage = () => {
  const [concepts, setConcepts] = useState<Concept[]>([])
  const [conceptsLoading, setConceptsLoading] = useState(true)
  const [conceptsError, setConceptsError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedConceptIds, setSelectedConceptIds] = useState<number[]>([])
  const [matchedStocks, setMatchedStocks] = useState<MatchedStock[]>([])
  const [stocksLoading, setStocksLoading] = useState(false)
  const [stocksError, setStocksError] = useState<string | null>(null)

  const { toast } = useToast()

  useEffect(() => {
    const fetchConcepts = async () => {
      try {
        setConceptsLoading(true)
        setConceptsError(null)
        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from('ths_concepts')
          .select('id, name')
          .order('name')

        if (error) {
          throw new Error(error.message)
        }

        setConcepts(data ?? [])
      } catch (err) {
        const message = err instanceof Error ? err.message : '加载概念失败'
        setConceptsError(message)
        toast({
          variant: 'destructive',
          title: '获取概念失败',
          description: message,
        })
      } finally {
        setConceptsLoading(false)
      }
    }

    fetchConcepts()
  }, [toast])

  useEffect(() => {
    const fetchMatchedStocks = async () => {
      if (selectedConceptIds.length === 0) {
        setMatchedStocks([])
        setStocksError(null)
        return
      }

      try {
        setStocksLoading(true)
        setStocksError(null)
        const supabase = getSupabaseClient()

        const { data, error } = await supabase
          .from('ths_stock_concepts')
          .select('stock_code, concept_id, trade_date')
          .in('concept_id', selectedConceptIds)

        if (error) {
          throw new Error(error.message)
        }

        const grouped = (data ?? []).reduce(
          (acc, item) => {
            const existing = acc.get(item.stock_code) ?? { conceptIds: new Set<number>(), latestTradeDate: '' }
            existing.conceptIds.add(item.concept_id)

            if (!existing.latestTradeDate || (item.trade_date && item.trade_date > existing.latestTradeDate)) {
              existing.latestTradeDate = item.trade_date ?? existing.latestTradeDate
            }

            acc.set(item.stock_code, existing)
            return acc
          },
          new Map<string, { conceptIds: Set<number>; latestTradeDate?: string }>()
        )

        const matched = Array.from(grouped.entries())
          .filter(([, value]) => selectedConceptIds.every(id => value.conceptIds.has(id)))
          .map(([stockCode, value]) => ({
            stockCode,
            conceptCount: value.conceptIds.size,
            latestTradeDate: value.latestTradeDate,
          }))
          .sort((a, b) => a.stockCode.localeCompare(b.stockCode))

        setMatchedStocks(matched)
      } catch (err) {
        const message = err instanceof Error ? err.message : '加载股票失败'
        setStocksError(message)
        toast({
          variant: 'destructive',
          title: '获取股票失败',
          description: message,
        })
      } finally {
        setStocksLoading(false)
      }
    }

    fetchMatchedStocks()
  }, [selectedConceptIds, toast])

  const filteredConcepts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return concepts

    return concepts.filter(concept => concept.name.toLowerCase().includes(term))
  }, [concepts, searchTerm])

  const toggleConcept = (id: number) => {
    setSelectedConceptIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id].sort((a, b) => a - b)
    )
  }

  const clearSelections = () => {
    setSelectedConceptIds([])
  }

  return (
    <div className="h-screen overflow-hidden bg-background">
      <main className="container mx-auto px-4 py-4 h-full flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Layers className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold leading-tight">A股概念库</h1>
              <p className="text-muted-foreground">查看并筛选同花顺概念，匹配关联股票</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索概念"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" onClick={clearSelections} disabled={selectedConceptIds.length === 0}>
              清空选择
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
          <Card className="lg:col-span-5 flex flex-col min-h-0">
            <CardHeader className="space-y-1">
              <CardTitle>全部概念</CardTitle>
              <CardDescription>
                {conceptsLoading
                  ? '正在加载概念...'
                  : conceptsError
                    ? conceptsError
                    : `共 ${concepts.length} 个概念，可多选叠加筛选股票`}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              <div className="border rounded-lg overflow-hidden h-full">
                {conceptsLoading ? (
                  <div className="flex items-center justify-center py-10 text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    正在加载...
                  </div>
                ) : filteredConcepts.length === 0 ? (
                  <div className="p-4 text-muted-foreground">未找到匹配的概念</div>
                ) : (
                  <div className="max-h-[520px] overflow-y-auto p-3">
                    <div className="flex flex-wrap gap-2">
                      {filteredConcepts.map(concept => {
                        const selected = selectedConceptIds.includes(concept.id)
                        return (
                          <label
                            key={concept.id}
                            className={`inline-flex items-center gap-2 rounded-md border px-2 py-1 text-sm cursor-pointer transition-colors ${selected ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-muted'}`}
                          >
                            <Checkbox checked={selected} onCheckedChange={() => toggleConcept(concept.id)} />
                            <span className="font-medium leading-none">{concept.name}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-7 flex flex-col min-h-0">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <CardTitle>匹配股票</CardTitle>
                  <CardDescription>
                    {selectedConceptIds.length === 0
                      ? '选择左侧概念后展示匹配的股票'
                      : `已选择 ${selectedConceptIds.length} 个概念，显示同时属于这些概念的股票`}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  {selectedConceptIds.map(id => {
                    const concept = concepts.find(item => item.id === id)
                    if (!concept) return null
                    return (
                      <Badge key={id} variant="secondary" className="flex items-center gap-1">
                        {concept.name}
                        <button
                          type="button"
                          onClick={() => toggleConcept(id)}
                          className="ml-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              <div className="border rounded-lg h-full flex flex-col overflow-hidden">
                {stocksLoading ? (
                  <div className="flex items-center justify-center py-10 text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    正在加载股票数据...
                  </div>
                ) : selectedConceptIds.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    请选择至少一个概念
                  </div>
                ) : stocksError ? (
                  <div className="flex-1 flex items-center justify-center text-destructive">
                    {stocksError}
                  </div>
                ) : matchedStocks.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    暂无匹配的股票
                  </div>
                ) : (
                  <div className="flex-1 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-32">股票代码</TableHead>
                          <TableHead>覆盖概念数量</TableHead>
                          <TableHead className="w-40">最新交易日</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {matchedStocks.map(stock => (
                          <TableRow key={stock.stockCode}>
                            <TableCell className="font-mono font-medium">{stock.stockCode}</TableCell>
                            <TableCell>{stock.conceptCount}</TableCell>
                            <TableCell>{stock.latestTradeDate ?? '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default ConceptsPage
