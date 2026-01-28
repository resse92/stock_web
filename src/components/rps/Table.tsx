import React, { useMemo } from 'react'
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
type TableClickArgs = {
  col: number
  row: number
  field?: string | number | string[]
  originData?: RpsItemData
}

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
  const [sorting, setSorting] = React.useState<VTableSortState | null>(null)
  const [conceptDetail, setConceptDetail] = React.useState<{
    code: string
    name: string
    concepts: string[]
  } | null>(null)
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

  // Use prop data directly, no fallback to demo data
  const tableData = useMemo(() => {
    if (propData && propData.length > 0) {
      return propData
    }
    // Return empty array when no data
    return []
  }, [propData])

  const columns = useMemo<ColumnsDefine>(
    () => [
      {
        field: 'name',
        title: '公司',
        width: 180,
        showSort: true,
        sort: true,
        fieldFormat: (record: RpsItemData) =>
          `${record?.name ?? ''}(${record?.code ?? ''})`,
      },
      {
        field: 'concepts',
        title: '概念',
        width: 240,
        showSort: false,
        sort: false,
        fieldFormat: (record: RpsItemData) => {
          const concepts =
            record?.concepts ??
            (record?.concept ? [record.concept] : ([] as string[]))
          if (!concepts.length) return '—'
          return concepts.join('、')
        },
        style: {
          lineClamp: 2,
          textOverflow: 'ellipsis',
          cursor: 'pointer',
          underline: true,
        },
      },
      {
        field: 'rps3',
        title: 'RPS3',
        width: 100,
        showSort: true,
        sort: true,
        fieldFormat: (record: RpsItemData) =>
          typeof record?.rps3 === 'number' ? record.rps3.toFixed(2) : '',
      },
      {
        field: 'rps5',
        title: 'RPS5',
        width: 100,
        showSort: true,
        sort: true,
        fieldFormat: (record: RpsItemData) =>
          typeof record?.rps5 === 'number' ? record.rps5.toFixed(2) : '',
      },
      {
        field: 'rps15',
        title: 'RPS15',
        width: 100,
        showSort: true,
        sort: true,
        fieldFormat: (record: RpsItemData) =>
          typeof record?.rps15 === 'number' ? record.rps15.toFixed(2) : '',
      },
      {
        field: 'rps30',
        title: 'RPS30',
        width: 100,
        showSort: true,
        sort: true,
        fieldFormat: (record: RpsItemData) =>
          typeof record?.rps30 === 'number' ? record.rps30.toFixed(2) : '',
        style: {
          fontFamily: 'Menlo, Monaco, Consolas, monospace',
        },
      },
      {
        field: 'listed_days',
        title: '上市天数',
        width: 110,
        showSort: true,
        sort: true,
        fieldFormat: (record: RpsItemData) =>
          typeof record?.listed_days === 'number'
            ? record.listed_days.toFixed(2)
            : '',
        style: {
          fontFamily: 'Menlo, Monaco, Consolas, monospace',
        },
      },
      {
        field: 'market_cap',
        title: '市值(亿)',
        width: 110,
        showSort: true,
        sort: true,
        style: {
          fontFamily: 'Menlo, Monaco, Consolas, monospace',
        },
      },
      {
        field: 'circulating_market_cap',
        title: '流通市值(亿)',
        width: 130,
        showSort: true,
        sort: true,
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

  const handleClickCell = React.useCallback(
    (params: TableClickArgs) => {
      if (conceptDetail) return
      const columnField = columns[params.col]?.field
      if (columnField !== 'concepts') return

      const record = params.originData
      if (!record) return
      const concepts =
        record.concepts ?? (record.concept ? [record.concept] : undefined)
      if (!concepts || !concepts.length) return
      setConceptDetail({
        code: record.code,
        name: record.name,
        concepts,
      })
    },
    [columns, conceptDetail]
  )

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
          <div className="flex items-center justify-center text-destructive">
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
      <div className="relative h-full min-h-[400px]">
        {ListTableComponent ? (
          <ListTableComponent
            {...tableOption}
            style={{ width: '100%', height: '100%' }}
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
      {/*</CardContent>*/}
      {/*</Card>*/}
      <Dialog
        open={!!conceptDetail}
        onOpenChange={open => {
          if (!open) {
            setTimeout(() => {
              setConceptDetail(null)
            }, 150)
          }
        }}
        modal
      >
        <DialogContent>
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
