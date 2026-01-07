import React, { useMemo } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Card, CardContent } from '@/components/ui/card'
import type { RpsItemData } from '@/types/stock'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const columnHelper = createColumnHelper<RpsItemData>()

interface RPSTableProps {
  data?: RpsItemData[]
  loading?: boolean
  error?: string | null
}

export const RPSTable: React.FC<RPSTableProps> = ({
  data: propData,
  loading = false,
  error = null,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [conceptDetail, setConceptDetail] = React.useState<{
    code: string
    name: string
    concepts: string[]
  } | null>(null)

  // Use prop data directly, no fallback to demo data
  const tableData = useMemo(() => {
    if (propData && propData.length > 0) {
      return propData
    }
    // Return empty array when no data
    return []
  }, [propData])

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: '公司',
        cell: info => {
          const name = info.getValue()
          const code = info.row.original.code
          const value = `${name}(${code})`
          return (
            <div className="truncate h-full flex items-center" title={value}>
              {value}
            </div>
          )
        },
        size: 180,
      }),
      columnHelper.accessor(
        row => row.concepts?.join('、') ?? row.concept ?? '',
        {
          id: 'concepts',
          header: '概念',
          cell: info => {
            const concepts =
              info.row.original.concepts ??
              (info.row.original.concept ? [info.row.original.concept] : [])
            const value = concepts.join('、')
            const hasConcepts = concepts.length > 0
            return (
              <button
                type="button"
                className={cn(
                  'text-left w-full whitespace-normal break-words leading-5 overflow-hidden max-h-10 h-full flex items-center',
                  hasConcepts
                    ? 'text-primary hover:underline'
                    : 'text-muted-foreground cursor-not-allowed'
                )}
                title={hasConcepts ? value : '暂无概念信息'}
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
                onClick={() =>
                  hasConcepts &&
                  setConceptDetail({
                    code: info.row.original.code,
                    name: info.row.original.name,
                    concepts,
                  })
                }
                disabled={!hasConcepts}
              >
                {hasConcepts ? value : '—'}
              </button>
            )
          },
          size: 240,
        }
      ),
      columnHelper.accessor('rps3', {
        header: 'RPS3',
        cell: info => (
          <div
            className="truncate h-full flex items-center"
            title={info.getValue().toFixed(2)}
          >
            {info.getValue().toFixed(2)}
          </div>
        ),
        size: 100,
      }),
      columnHelper.accessor('rps5', {
        header: 'RPS5',
        cell: info => {
          return (
            <div
              className="truncate h-full flex items-center"
              title={info.getValue().toFixed(2)}
            >
              {info.getValue().toFixed(2)}
            </div>
          )
        },
        size: 100,
      }),
      columnHelper.accessor('rps15', {
        header: 'RPS15',
        cell: info => {
          return (
            <div
              className="truncate h-full flex items-center"
              title={info.getValue().toFixed(2)}
            >
              {info.getValue().toFixed(2)}
            </div>
          )
        },
        size: 100,
      }),
      columnHelper.accessor('rps30', {
        header: 'RPS30',
        cell: info => (
          <div className="font-mono h-full flex items-center">
            {info.getValue().toFixed(2)}
          </div>
        ),
        size: 100,
      }),
      columnHelper.accessor('listed_days', {
        header: '上市天数',
        cell: info => (
          <div className="font-mono h-full flex items-center">
            {info.getValue().toFixed(2)}
          </div>
        ),
        size: 100,
      }),
      columnHelper.accessor('market_cap', {
        header: '市值(亿)',
        cell: info => (
          <div className="font-mono h-full flex items-center">
            {info.getValue()}
          </div>
        ),
        size: 100,
      }),
      columnHelper.accessor('circulating_market_cap', {
        header: '流通市值(亿)',
        cell: info => (
          <div className="font-mono h-full flex items-center">
            {info.getValue()}
          </div>
        ),
        size: 100,
      }),
    ],
    []
  )

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const { rows } = table.getRowModel()

  // Virtual scrolling setup
  const parentRef = React.useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 10,
  })

  // Show loading state
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>正在加载RPS数据...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show error state
  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="flex items-center justify-center text-red-600">
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show empty state when no data
  if (!loading && tableData.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="flex items-center justify-center text-muted-foreground">
            <span>暂无数据，请调整筛选条件后重试</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="w-full h-full flex flex-col">
        <CardContent className="p-0 flex-1 overflow-hidden">
          <div className="relative h-full">
            {/* 统一的滚动容器，包含Header和Body */}
            <div
              ref={parentRef}
              className="h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            >
              {/* Fixed Header - 现在在滚动容器内部 */}
              <div className="sticky top-0 z-20 bg-background border-b">
                <table
                  className="w-full min-w-[1100px] text-sm"
                  style={{ tableLayout: 'fixed', width: '100%' }}
                >
                  <colgroup>
                    {columns.map(column => (
                      <col
                        key={column.id}
                        style={{ width: `${column.size || 100}px` }}
                      />
                    ))}
                  </colgroup>
                  <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                          <th
                            key={header.id}
                            className="px-3 py-3 text-left bg-muted/50 border-r border-border/50 bg-gray-100"
                          >
                            {header.isPlaceholder ? null : (
                              <div
                                {...{
                                  className: header.column.getCanSort()
                                    ? 'cursor-pointer select-none flex items-center'
                                    : '',
                                  onClick:
                                    header.column.getToggleSortingHandler(),
                                }}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {{
                                  asc: ' 🔼',
                                  desc: ' 🔽',
                                }[header.column.getIsSorted() as string] ??
                                  null}
                              </div>
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                </table>
              </div>

              {/* Scrollable Body */}
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  position: 'relative',
                }}
              >
                <table
                  className="w-full min-w-[1100px] text-sm"
                  style={{ tableLayout: 'fixed', width: '100%' }}
                >
                  <colgroup>
                    {columns.map(column => (
                      <col
                        key={column.id}
                        style={{ width: `${column.size || 100}px` }}
                      />
                    ))}
                  </colgroup>
                  <tbody>
                    {virtualizer.getVirtualItems().map(virtualRow => {
                      const row = rows[virtualRow.index]
                      return (
                        <tr
                          key={row.id}
                          className="border-b hover:bg-muted/50 transition-colors"
                          style={{
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)`,
                            position: 'absolute',
                            width: '100%',
                            left: 0,
                            right: 0,
                            display: 'table',
                            tableLayout: 'fixed',
                          }}
                        >
                          {row.getVisibleCells().map(cell => (
                            <td
                              key={cell.id}
                              className="px-3 py-0 border-r border-border/50 align-middle"
                              style={{
                                width: `${cell.column.getSize()}px`,
                                minWidth: `${cell.column.getSize()}px`,
                                maxWidth: `${cell.column.getSize()}px`,
                                height: `${virtualRow.size}px`,
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog
        open={!!conceptDetail}
        onOpenChange={open => {
          if (!open) setConceptDetail(null)
        }}
      >
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>
              {conceptDetail?.name}（{conceptDetail?.code}）
            </DialogTitle>
            <DialogDescription>概念</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-auto pr-1">
            {conceptDetail?.concepts?.length ? (
              <div className="flex flex-wrap gap-2">
                {conceptDetail.concepts.map(concept => (
                  <Badge key={concept} variant="secondary">
                    {concept}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">暂无概念信息</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
