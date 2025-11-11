import { useState, useEffect } from "react";
import { StockCard } from "@/components/StockCard";
import { StockChart } from "@/components/StockChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { mockStockData, generateChartData } from "@/utils/mockData";
import {
  useStockDataWithStore,
  useChartDataWithStore,
} from "@/hooks/useStockDataWithStore";
import type { ChartData } from "@/types/stock";
import {
  RefreshCw,
  TrendingUp,
  DollarSign,
  Activity,
  AlertCircle,
} from "lucide-react";

export const Dashboard = () => {
  const [localChartData, setLocalChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    stocks,
    loading: stocksLoading,
    error: stocksError,
    refetch: refetchStocks,
  } = useStockDataWithStore();
  const {
    chartData: apiChartData,
    loading: chartLoading,
    error: chartError,
    refetch: refetchChart,
  } = useChartDataWithStore("AAPL", "1M");

  // Use API data if available, otherwise fallback to mock data
  const displayStocks = stocks.length > 0 ? stocks : mockStockData;
  const displayChartData =
    apiChartData.length > 0 ? apiChartData : localChartData;
  const isApiMode = stocks.length > 0 || apiChartData.length > 0;

  useEffect(() => {
    // Initialize local chart data as fallback
    setLocalChartData(generateChartData(30));
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);

    try {
      if (isApiMode) {
        // Refresh API data
        await Promise.all([refetchStocks(), refetchChart()]);
      } else {
        // Simulate API call delay for mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLocalChartData(generateChartData(30));
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalValue = displayStocks.reduce(
    (sum, stock) => sum + stock.price * 100,
    0,
  );
  const totalChange = displayStocks.reduce(
    (sum, stock) => sum + stock.change,
    0,
  );
  const averageChange = totalChange / displayStocks.length;
  const loading = stocksLoading || chartLoading || isLoading;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Monitor your investments and market trends
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh Data</span>
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {(stocksError || chartError) && (
          <div className="mb-6 p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800">
                API unavailable, using mock data. Errors:{" "}
                {stocksError || chartError}
              </span>
            </div>
          </div>
        )}

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
                  averageChange >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {averageChange >= 0 ? "+" : ""}
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
            title={`Market Overview - 30 Days ${
              isApiMode ? "(Live Data)" : "(Demo Data)"
            }`}
            type="area"
          />
        </div>

        {/* Stock Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {displayStocks.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            {isApiMode
              ? "Connected to API for real-time data. Mock data is used as fallback when API is unavailable."
              : "Stock data is simulated for demonstration purposes. Real-time data integration can be added through financial APIs."}
          </p>
        </footer>
      </main>
    </div>
  );
};
