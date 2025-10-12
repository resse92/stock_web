import React, { useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatVolume } from '@/utils/mockData';
import type { RPSData } from '@/types/stock';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface RPSTableProps {
  data: RPSData[];
  loading?: boolean;
}

const columnHelper = createColumnHelper<RPSData>();

export const RPSTable: React.FC<RPSTableProps> = ({ data, loading = false }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('symbol', {
        header: '股票代码',
        cell: (info) => (
          <div className="font-semibold text-primary">{info.getValue()}</div>
        ),
        size: 100,
      }),
      columnHelper.accessor('name', {
        header: '名称',
        cell: (info) => (
          <div className="truncate" title={info.getValue()}>
            {info.getValue()}
          </div>
        ),
        size: 200,
      }),
      columnHelper.accessor('price', {
        header: '价格',
        cell: (info) => (
          <div className="font-mono text-right">
            {formatCurrency(info.getValue())}
          </div>
        ),
        size: 100,
      }),
      columnHelper.accessor('rps', {
        header: 'RPS',
        cell: (info) => {
          const value = info.getValue();
          const colorClass = value >= 80 ? 'text-green-600' : value >= 60 ? 'text-blue-600' : value >= 40 ? 'text-yellow-600' : 'text-red-600';
          return (
            <div className={`font-semibold text-right ${colorClass}`}>
              {value.toFixed(1)}
            </div>
          );
        },
        size: 80,
      }),
      columnHelper.accessor('rps_50', {
        header: 'RPS 50',
        cell: (info) => (
          <div className="font-mono text-right">{info.getValue().toFixed(1)}</div>
        ),
        size: 80,
      }),
      columnHelper.accessor('rps_120', {
        header: 'RPS 120',
        cell: (info) => (
          <div className="font-mono text-right">{info.getValue().toFixed(1)}</div>
        ),
        size: 80,
      }),
      columnHelper.accessor('rps_250', {
        header: 'RPS 250',
        cell: (info) => (
          <div className="font-mono text-right">{info.getValue().toFixed(1)}</div>
        ),
        size: 80,
      }),
      columnHelper.accessor('changePercent', {
        header: '涨跌幅',
        cell: (info) => {
          const value = info.getValue();
          const isPositive = value >= 0;
          return (
            <div
              className={`flex items-center justify-end font-mono ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {isPositive ? '+' : ''}
              {value.toFixed(2)}%
            </div>
          );
        },
        size: 120,
      }),
      columnHelper.accessor('volume', {
        header: '成交量',
        cell: (info) => (
          <div className="font-mono text-right">
            {formatVolume(info.getValue())}
          </div>
        ),
        size: 120,
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 10,
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-muted-foreground">加载中...</div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-muted-foreground">没有符合条件的数据</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative">
          {/* Fixed Header */}
          <div className="sticky top-0 z-20 bg-background border-b">
            <table
              className="w-full text-sm"
              style={{ tableLayout: 'fixed', width: '100%' }}
            >
              <colgroup>
                <col style={{ width: '100px' }} />
                <col style={{ width: '200px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: '120px' }} />
              </colgroup>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left font-semibold bg-muted/50"
                        style={{ width: `${header.getSize()}px` }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
            </table>
          </div>

          {/* Virtualized Body */}
          <div
            ref={parentRef}
            className="overflow-auto"
            style={{ height: '600px' }}
          >
            <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
              <table
                className="w-full text-sm"
                style={{ tableLayout: 'fixed', width: '100%' }}
              >
                <colgroup>
                  <col style={{ width: '100px' }} />
                  <col style={{ width: '200px' }} />
                  <col style={{ width: '100px' }} />
                  <col style={{ width: '80px' }} />
                  <col style={{ width: '80px' }} />
                  <col style={{ width: '80px' }} />
                  <col style={{ width: '80px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '120px' }} />
                </colgroup>
                <tbody>
                  {virtualizer.getVirtualItems().map((virtualRow) => {
                    const row = rows[virtualRow.index];
                    return (
                      <tr
                        key={row.id}
                        className="border-b hover:bg-muted/50 transition-colors"
                        style={{
                          position: 'absolute',
                          transform: `translateY(${virtualRow.start}px)`,
                          width: '100%',
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-4 py-3"
                            style={{ width: `${cell.column.getSize()}px` }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer with stats */}
        <div className="border-t p-4 bg-muted/20">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>共 {data.length} 条记录</span>
            <span>显示 {virtualizer.getVirtualItems().length} 行</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
