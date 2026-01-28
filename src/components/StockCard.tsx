import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { StockData } from '@/types/stock'
import { formatCurrency, formatMarketCap, formatVolume } from '@/utils/mockData'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StockCardProps {
  stock: StockData
}

export const StockCard = ({ stock }: StockCardProps) => {
  const isPositive = stock.change >= 0

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">{stock.symbol}</CardTitle>
            <p className="text-sm text-muted-foreground">{stock.name}</p>
          </div>
          <div
            className={`flex items-center space-x-1 text-sm font-medium ${
              isPositive ? 'text-primary' : 'text-destructive'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>
              {isPositive ? '+' : ''}
              {stock.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">
              {formatCurrency(stock.price)}
            </span>
            <span
              className={`text-sm font-medium ${
                isPositive ? 'text-primary' : 'text-destructive'
              }`}
            >
              {isPositive ? '+' : ''}
              {formatCurrency(stock.change)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Volume</p>
              <p className="font-medium">{formatVolume(stock.volume)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Market Cap</p>
              <p className="font-medium">{formatMarketCap(stock.marketCap)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
