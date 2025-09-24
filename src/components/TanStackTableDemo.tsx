import React, { useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateLargeStockDataset } from '@/utils/demoData';
import { formatCurrency, formatMarketCap, formatVolume } from '@/utils/mockData';
import type { StockData } from '@/types/stock';
import { TrendingUp, TrendingDown } from 'lucide-react';

const columnHelper = createColumnHelper<StockData>();

export const TanStackTableDemo: React.FC = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  
  // Generate large dataset for demonstration
  const data = useMemo(() => generateLargeStockDataset(5000), []);

  const columns = useMemo(
    () => [
      columnHelper.accessor('symbol', {
        header: 'Symbol',
        cell: info => (
          <div className="font-semibold text-primary">
            {info.getValue()}
          </div>
        ),
        size: 80,
      }),
      columnHelper.accessor('name', {
        header: 'Company Name',
        cell: info => (
          <div className="max-w-xs truncate" title={info.getValue()}>
            {info.getValue()}
          </div>
        ),
        size: 200,
      }),
      columnHelper.accessor('price', {
        header: 'Price',
        cell: info => (
          <div className="font-mono text-right">
            {formatCurrency(info.getValue())}
          </div>
        ),
        size: 100,
      }),
      columnHelper.accessor('change', {
        header: 'Change',
        cell: info => {
          const value = info.getValue();
          const isPositive = value >= 0;
          return (
            <div className={`flex items-center font-mono text-right ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {isPositive ? '+' : ''}{formatCurrency(value)}
            </div>
          );
        },
        size: 120,
      }),
      columnHelper.accessor('changePercent', {
        header: 'Change %',
        cell: info => {
          const value = info.getValue();
          const isPositive = value >= 0;
          return (
            <div className={`font-mono text-right ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? '+' : ''}{value.toFixed(2)}%
            </div>
          );
        },
        size: 100,
      }),
      columnHelper.accessor('volume', {
        header: 'Volume',
        cell: info => (
          <div className="font-mono text-right">
            {formatVolume(info.getValue())}
          </div>
        ),
        size: 100,
      }),
      columnHelper.accessor('marketCap', {
        header: 'Market Cap',
        cell: info => (
          <div className="font-mono text-right">
            {formatMarketCap(info.getValue())}
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
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();

  // Virtual scrolling setup
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Row height
    overscan: 10,
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>TanStack Table + React Virtual Demo</span>
          <span className="text-sm text-muted-foreground font-normal">
            {data.length.toLocaleString()} rows
          </span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Virtualized table with {data.length.toLocaleString()} stock records. 
          Click column headers to sort.
        </p>
      </CardHeader>
      <CardContent>
        <div
          ref={parentRef}
          className="h-96 overflow-auto border rounded-md"
        >
          <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-background border-b z-10">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-2 py-2 text-left bg-muted/50"
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? 'cursor-pointer select-none flex items-center'
                                : '',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {virtualizer.getVirtualItems().map(virtualRow => {
                  const row = rows[virtualRow.index];
                  return (
                    <tr
                      key={row.id}
                      className="border-b hover:bg-muted/50 transition-colors"
                      style={{
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                        position: 'absolute',
                        width: '100%',
                      }}
                    >
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className="px-2 py-2"
                          style={{ width: cell.column.getSize() }}
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
      </CardContent>
    </Card>
  );
};