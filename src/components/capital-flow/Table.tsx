import React, { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import type { CapitalFlowData } from '@/types/stock'
import { Loader2 } from 'lucide-react'
import type {
  ColumnsDefine,
  ListTableConstructorOptions,
} from '@visactor/vtable'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Button from '@/components/ui/button'

type VTableSortOrder = 'asc' | 'desc' | 'normal' | 'ASC' | 'DESC' | 'NORMAL'
type VTableSortState = {
  field: string | number | string[]
  order: VTableSortOrder
}
type ListTableComponentType =
  | (typeof import('@visactor/react-vtable'))['ListTable']
  | null
type ColumnField =
  | 'name'
  | 'change_pct'
  | 'net_amount_main'
  | 'net_pct_main'
  | 'net_amount_xl'
  | 'net_pct_xl'
  | 'net_amount_l'
  | 'net_pct_l'
  | 'net_amount_m'
  | 'net_pct_m'
  | 'net_amount_s'
  | 'net_pct_s'

interface CapitalFlowTableProps {
  data?: CapitalFlowData[]
  loading?: boolean
  loadingMore?: boolean
  error?: string | null
  hasMore?: boolean
  onLoadMore?: () => void
}

const formatNumber = (value: number | undefined, decimals = 2): string => {
  return typeof value === 'number' ? value.toFixed(decimals) : ''
}

export const CapitalFlowTable: React.FC<CapitalFlowTableProps> = ({
  data: propData,
  loading = false,
  loadingMore = false,
  error = null,
  hasMore = false,
  onLoadMore,
}) => {
  const [sorting, setSorting] = React.useState<VTableSortState | null>(null)
  const [visibleColumns, setVisibleColumns] = React.useState<ColumnField[]>([
    'name',
    'change_pct',
    'net_amount_main',
    'net_amount_xl',
    'net_amount_l',
    'net_amount_m',
    'net_amount_s',
  ])
  const [ListTableComponent, setListTableComponent] =
    React.useState<ListTableComponentType>(null)
  type LoadMoreRow = CapitalFlowData & {
    __kind: 'loadMore'
    __loadStatus: 'more' | 'done' | 'loading'
  }
  type DataRow = CapitalFlowData & { __kind?: undefined }
  type ExtendedRow = DataRow | LoadMoreRow

  React.useEffect(() => {
    // react-vtable依赖React 18内部字段，React 19需要做兼容填充
    const reactWithSecret = React as typeof React & {
      __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?: {
        ReactCurrentOwner?: { current: unknown }
      }
    }
    const secretKey = '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED'
    if (!reactWithSecret[secretKey]) {
      reactWithSecret[secretKey] = { ReactCurrentOwner: { current: null } }
    } else if (!reactWithSecret[secretKey]?.ReactCurrentOwner) {
      reactWithSecret[secretKey]!.ReactCurrentOwner = { current: null }
    }

    import('@visactor/react-vtable')
      .then(module => {
        setListTableComponent(() => module.ListTable)
      })
      .catch(err => {
        console.error('Failed to load react-vtable:', err)
      })
  }, [])

  const isLoadMoreRow = (record?: ExtendedRow | null): record is LoadMoreRow =>
    (record as LoadMoreRow | null)?.__kind === 'loadMore'

  const tableData = useMemo(() => {
    if (propData && propData.length > 0) {
      return propData
    }
    return []
  }, [propData])

  const displayData = useMemo<ExtendedRow[]>(() => {
    const loadStatus: LoadMoreRow['__loadStatus'] = loadingMore
      ? 'loading'
      : hasMore
        ? 'more'
        : 'done'
    const rows: ExtendedRow[] = [...tableData] as ExtendedRow[]
    const shouldShowLoadRow =
      (!loading && tableData.length > 0) || hasMore || loadingMore
    if (shouldShowLoadRow) {
      rows.push({
        date: '',
        sec_code: '',
        name: '',
        change_pct: Number.NaN,
        net_amount_main: Number.NaN,
        net_pct_main: Number.NaN,
        net_amount_xl: Number.NaN,
        net_pct_xl: Number.NaN,
        net_amount_l: Number.NaN,
        net_pct_l: Number.NaN,
        net_amount_m: Number.NaN,
        net_pct_m: Number.NaN,
        net_amount_s: Number.NaN,
        net_pct_s: Number.NaN,
        __kind: 'loadMore',
        __loadStatus: loadStatus,
      })
    }
    return rows
  }, [hasMore, loading, loadingMore, tableData])

  const allColumns = useMemo<ColumnsDefine>(
    () => [
      {
        field: 'name',
        title: '股票',
        width: 200,
        showSort: true,
        sort: true,
        fieldFormat: (record: ExtendedRow) =>
          isLoadMoreRow(record)
            ? record.__loadStatus === 'loading'
              ? '加载中...'
              : record.__loadStatus === 'more'
                ? '点击加载更多'
                : '已加载全部'
            : `${record.name ?? ''}(${record.sec_code ?? ''})`,
      },
      {
        field: 'change_pct',
        title: '涨跌幅',
        width: 120,
        showSort: true,
        sort: true,
        fieldFormat: (record: ExtendedRow) =>
          isLoadMoreRow(record) || record.change_pct === undefined
            ? ''
            : `${formatNumber(record.change_pct)}%`,
        style: {
          fontFamily: 'Menlo, Monaco, Consolas, monospace',
        },
      },
      {
        field: 'net_amount_main',
        title: '主力净额(万)',
        width: 140,
        showSort: true,
        sort: true,
        fieldFormat: (record: ExtendedRow) =>
          isLoadMoreRow(record) ? '' : formatNumber(record.net_amount_main),
        style: {
          fontFamily: 'Menlo, Monaco, Consolas, monospace',
        },
      },
      {
        field: 'net_pct_main',
        title: '主力净占比',
        width: 140,
        showSort: true,
        sort: true,
        fieldFormat: (record: ExtendedRow) =>
          isLoadMoreRow(record) || record.net_pct_main === undefined
            ? ''
            : `${formatNumber(record.net_pct_main)}%`,
        style: {
          fontFamily: 'Menlo, Monaco, Consolas, monospace',
        },
      },
      {
        field: 'net_amount_xl',
        title: '超大单净额(万)',
        width: 150,
        showSort: true,
        sort: true,
        fieldFormat: (record: ExtendedRow) =>
          isLoadMoreRow(record) ? '' : formatNumber(record.net_amount_xl),
        style: {
          fontFamily: 'Menlo, Monaco, Consolas, monospace',
        },
      },
      {
        field: 'net_pct_xl',
        title: '超大单净占比',
        width: 160,
        showSort: true,
        sort: true,
        fieldFormat: (record: ExtendedRow) =>
          isLoadMoreRow(record) || record.net_pct_xl === undefined
            ? ''
            : `${formatNumber(record.net_pct_xl)}%`,
        style: {
          fontFamily: 'Menlo, Monaco, Consolas, monospace',
        },
      },
      {
        field: 'net_amount_l',
        title: '大单净额(万)',
        width: 140,
        showSort: true,
        sort: true,
        fieldFormat: (record: ExtendedRow) =>
          isLoadMoreRow(record) ? '' : formatNumber(record.net_amount_l),
        style: {
          fontFamily: 'Menlo, Monaco, Consolas, monospace',
        },
      },
      {
        field: 'net_pct_l',
        title: '大单净占比',
        width: 140,
        showSort: true,
        sort: true,
        fieldFormat: (record: ExtendedRow) =>
          isLoadMoreRow(record) || record.net_pct_l === undefined
            ? ''
            : `${formatNumber(record.net_pct_l)}%`,
        style: {
          fontFamily: 'Menlo, Monaco, Consolas, monospace',
        },
      },
      {
        field: 'net_amount_m',
        title: '中单净额(万)',
        width: 140,
        showSort: true,
        sort: true,
        fieldFormat: (record: ExtendedRow) =>
          isLoadMoreRow(record) ? '' : formatNumber(record.net_amount_m),
        style: {
          fontFamily: 'Menlo, Monaco, Consolas, monospace',
        },
      },
      {
        field: 'net_pct_m',
        title: '中单净占比',
        width: 140,
        showSort: true,
        sort: true,
        fieldFormat: (record: ExtendedRow) =>
          isLoadMoreRow(record) || record.net_pct_m === undefined
            ? ''
            : `${formatNumber(record.net_pct_m)}%`,
        style: {
          fontFamily: 'Menlo, Monaco, Consolas, monospace',
        },
      },
      {
        field: 'net_amount_s',
        title: '小单净额(万)',
        width: 140,
        showSort: true,
        sort: true,
        fieldFormat: (record: ExtendedRow) =>
          isLoadMoreRow(record) ? '' : formatNumber(record.net_amount_s),
        style: {
          fontFamily: 'Menlo, Monaco, Consolas, monospace',
        },
      },
      {
        field: 'net_pct_s',
        title: '小单净占比',
        width: 140,
        showSort: true,
        sort: true,
        fieldFormat: (record: ExtendedRow) =>
          isLoadMoreRow(record) || record.net_pct_s === undefined
            ? ''
            : `${formatNumber(record.net_pct_s)}%`,
        style: {
          fontFamily: 'Menlo, Monaco, Consolas, monospace',
        },
      },
    ],
    []
  )

  const columns = useMemo<ColumnsDefine>(
    () =>
      allColumns.filter(column =>
        visibleColumns.includes(column.field as ColumnField)
      ),
    [allColumns, visibleColumns]
  )

  const handleAfterSort = React.useCallback((params: VTableSortState) => {
    setSorting({ field: params.field, order: params.order })
  }, [])

  const tableOption: ListTableConstructorOptions = useMemo(
    () => ({
      columns,
      records: displayData,
      sortState: sorting ?? undefined,
      select: {
        disableSelect: true,
        disableHeaderSelect: true,
        disableDragSelect: true,
      },
    }),
    [columns, displayData, sorting]
  )

  const handleClickCell = React.useCallback(
    (params: { originData?: ExtendedRow | null }) => {
      if (!params.originData) return
      if (
        isLoadMoreRow(params.originData) &&
        params.originData.__loadStatus === 'more'
      ) {
        onLoadMore?.()
      }
    },
    [onLoadMore]
  )

  const toggleColumn = React.useCallback((field: ColumnField) => {
    setVisibleColumns(prev => {
      if (prev.includes(field)) {
        if (prev.length === 1) return prev
        return prev.filter(item => item !== field)
      }
      return [...prev, field]
    })
  }, [])

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>正在加载资金流向数据...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="flex items-center justify-center text-destructive">
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!loading && tableData.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="flex items-center justify-center text-muted-foreground">
            <span>暂无数据，请选择日期后查询</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative h-full flex flex-col gap-2  overflow-hidden">
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              自定义列
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>选择显示字段</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allColumns.map(column => (
              <DropdownMenuCheckboxItem
                key={column.field as string}
                checked={visibleColumns.includes(column.field as ColumnField)}
                onCheckedChange={() =>
                  toggleColumn(column.field as ColumnField)
                }
              >
                {column.title as string}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative h-full flex-1 min-h-0 flex flex-col gap-2">
        <div className="flex-1 min-h-[360px] border border-border rounded-md overflow-hidden">
          {ListTableComponent ? (
            <ListTableComponent
              {...tableOption}
              onAfterSort={handleAfterSort}
              onClickCell={handleClickCell}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>加载表格组件...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
