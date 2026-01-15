import React, { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import type { CapitalFlowData } from '@/types/stock'
import { Loader2 } from 'lucide-react'
import type {
  ColumnsDefine,
  ListTableConstructorOptions,
} from '@visactor/vtable'

type VTableSortOrder = 'asc' | 'desc' | 'normal' | 'ASC' | 'DESC' | 'NORMAL'
type VTableSortState = {
  field: string | number | string[]
  order: VTableSortOrder
}
type ListTableComponentType =
  | (typeof import('@visactor/react-vtable'))['ListTable']
  | null

interface CapitalFlowTableProps {
  data?: CapitalFlowData[]
  loading?: boolean
  error?: string | null
}

const formatNumber = (value: number | undefined, decimals = 2): string => {
  return typeof value === 'number' ? value.toFixed(decimals) : ''
}

export const CapitalFlowTable: React.FC<CapitalFlowTableProps> = ({
  data: propData,
  loading = false,
  error = null,
}) => {
  const [sorting, setSorting] = React.useState<VTableSortState | null>(null)
  const [ListTableComponent, setListTableComponent] =
    React.useState<ListTableComponentType>(null)

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
        console.error('加载 react-vtable 失败', err)
      })
  }, [])

  const tableData = useMemo(() => {
    if (propData && propData.length > 0) {
      return propData
    }
    return []
  }, [propData])

  const columns = useMemo<ColumnsDefine>(
    () => [
      {
        field: 'date',
        title: '日期',
        width: 120,
        showSort: true,
        sort: true,
      },
      {
        field: 'sec_code',
        title: '股票代码',
        width: 120,
        showSort: true,
        sort: true,
      },
      {
        field: 'change_pct',
        title: '涨跌幅(%)',
        width: 120,
        showSort: true,
        sort: true,
        fieldFormat: (record: CapitalFlowData) =>
          formatNumber(record?.change_pct),
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
        fieldFormat: (record: CapitalFlowData) =>
          formatNumber(record?.net_amount_main),
        style: {
          fontFamily: 'Menlo, Monaco, Consolas, monospace',
        },
      },
      {
        field: 'net_pct_main',
        title: '主力净占比(%)',
        width: 140,
        showSort: true,
        sort: true,
        fieldFormat: (record: CapitalFlowData) =>
          formatNumber(record?.net_pct_main),
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
        fieldFormat: (record: CapitalFlowData) =>
          formatNumber(record?.net_amount_xl),
        style: {
          fontFamily: 'Menlo, Monaco, Consolas, monospace',
        },
      },
      {
        field: 'net_pct_xl',
        title: '超大单净占比(%)',
        width: 160,
        showSort: true,
        sort: true,
        fieldFormat: (record: CapitalFlowData) =>
          formatNumber(record?.net_pct_xl),
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
        fieldFormat: (record: CapitalFlowData) =>
          formatNumber(record?.net_amount_l),
        style: {
          fontFamily: 'Menlo, Monaco, Consolas, monospace',
        },
      },
      {
        field: 'net_pct_l',
        title: '大单净占比(%)',
        width: 140,
        showSort: true,
        sort: true,
        fieldFormat: (record: CapitalFlowData) => formatNumber(record?.net_pct_l),
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
        fieldFormat: (record: CapitalFlowData) =>
          formatNumber(record?.net_amount_m),
        style: {
          fontFamily: 'Menlo, Monaco, Consolas, monospace',
        },
      },
      {
        field: 'net_pct_m',
        title: '中单净占比(%)',
        width: 140,
        showSort: true,
        sort: true,
        fieldFormat: (record: CapitalFlowData) => formatNumber(record?.net_pct_m),
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
        fieldFormat: (record: CapitalFlowData) =>
          formatNumber(record?.net_amount_s),
        style: {
          fontFamily: 'Menlo, Monaco, Consolas, monospace',
        },
      },
      {
        field: 'net_pct_s',
        title: '小单净占比(%)',
        width: 140,
        showSort: true,
        sort: true,
        fieldFormat: (record: CapitalFlowData) => formatNumber(record?.net_pct_s),
        style: {
          fontFamily: 'Menlo, Monaco, Consolas, monospace',
        },
      },
    ],
    []
  )

  const handleAfterSort = React.useCallback((params: VTableSortState) => {
    setSorting({ field: params.field, order: params.order })
  }, [])

  const tableOption: ListTableConstructorOptions = useMemo(
    () => ({
      columns,
      records: tableData,
      sortState: sorting ?? undefined,
      width: '100%',
      height: '100%',
      select: {
        disableSelect: true,
        disableHeaderSelect: true,
        disableDragSelect: true,
      },
    }),
    [columns, sorting, tableData]
  )

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
          <div className="flex items-center justify-center text-red-600">
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
    <div className="relative h-full min-h-[400px]">
      {ListTableComponent ? (
        <ListTableComponent
          {...tableOption}
          style={{ width: '100%', height: '100%' }}
          onAfterSort={handleAfterSort}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>加载表格组件...</span>
        </div>
      )}
    </div>
  )
}
