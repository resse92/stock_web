import { useState } from 'react'
import { StockCard } from '@/components/StockCard'
import { StockChart } from '@/components/StockChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { mockStockData, generateChartData } from '@/utils/mockData'
import type { ChartData } from '@/types/stock'
import { RefreshCw, TrendingUp, DollarSign, Activity } from 'lucide-react'

export const Dashboard = () => {
  const [exampleChartData, setExampleChartData] = useState<ChartData[]>(() =>
    generateChartData(30)
  )

  const displayStocks = mockStockData
  const displayChartData = exampleChartData

  const handleRefresh = () => {
    // Regenerate demo chart data to keep the example interactive
    setExampleChartData(generateChartData(30))
  }

  const totalValue = displayStocks.reduce(
    (sum, stock) => sum + stock.price * 100,
    0
  )
  const totalChange = displayStocks.reduce(
    (sum, stock) => sum + stock.change,
    0
  )
  const averageChange = totalChange / displayStocks.length

  return (
    <div className="min-h-svh bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Dashboard
            </h2>
            <p className="text-muted-foreground">
              Example dashboard with static demo data (no API requests)
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleRefresh}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Data</span>
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Portfolio Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalValue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Change
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  averageChange >= 0 ? 'text-primary' : 'text-destructive'
                }`}
              >
                {averageChange >= 0 ? '+' : ''}
                {averageChange.toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Market performance today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Positions
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayStocks.length}</div>
              <p className="text-xs text-muted-foreground">
                Currently tracking stocks
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <StockChart
            data={displayChartData}
            title="Market Overview - 30 Days (Demo Data)"
            type="area"
          />
        </div>

        {/* Stock Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {displayStocks.map(stock => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            Stock data is simulated for demonstration purposes. Real-time data
            integration can be added through financial APIs.
          </p>
        </footer>
      </main>
    </div>
  )
}
