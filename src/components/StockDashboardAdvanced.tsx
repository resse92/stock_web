import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { StockCard } from '@/components/StockCard';
import { StockChart } from '@/components/StockChart';
import { 
  useStockDataWithStore, 
  useChartDataWithStore, 
  useStockQuoteWithStore 
} from '@/hooks/useStockDataWithStore';
import { 
  useWatchlist, 
  usePortfolio, 
  useUserSettings, 
  useViewPreferences,
  useFavorites 
} from '@/stores';
import { 
  Star, 
  Plus, 
  Trash2, 
  TrendingUp, 
  DollarSign,
  Activity,
  Settings 
} from 'lucide-react';

/**
 * Advanced Stock Dashboard Component
 * Demonstrates comprehensive Zustand integration patterns
 */
export const StockDashboardAdvanced = () => {
  // Global stock data with caching
  const { stocks, loading: stocksLoading, refetch: refetchStocks } = useStockDataWithStore();
  
  // Chart data with caching for a specific symbol
  const { chartData, loading: chartLoading, refetch: refetchChart } = useChartDataWithStore('AAPL', '1M');
  
  // Real-time quote with auto-refresh
  const { quote, loading: quoteLoading } = useStockQuoteWithStore('AAPL', 30000); // 30s refresh
  
  // User preferences and data
  const { 
    watchlist, 
    addToWatchlist, 
    removeFromWatchlist 
  } = useWatchlist();
  
  const { 
    portfolio, 
    addToPortfolio, 
    removeFromPortfolio 
  } = usePortfolio();
  
  const { 
    settings, 
    updateSettings 
  } = useUserSettings();
  
  const { 
    viewPreferences, 
    updateViewPreferences 
  } = useViewPreferences();
  
  const { 
    favoriteSymbols, 
    addToFavorites, 
    removeFromFavorites 
  } = useFavorites();

  // Filter stocks based on user preferences
  const watchlistStocks = stocks.filter(stock => watchlist.includes(stock.symbol));
  const favoriteStocks = stocks.filter(stock => favoriteSymbols.includes(stock.symbol));
  
  // Calculate portfolio value
  const portfolioValue = portfolio.reduce((total, position) => {
    const stock = stocks.find(s => s.symbol === position.symbol);
    return total + (stock ? stock.price * position.shares : 0);
  }, 0);

  // Handlers for user interactions
  const handleAddToWatchlist = (symbol: string) => {
    addToWatchlist(symbol);
  };

  const handleRemoveFromWatchlist = (symbol: string) => {
    removeFromWatchlist(symbol);
  };

  const handleToggleFavorite = (symbol: string) => {
    if (favoriteSymbols.includes(symbol)) {
      removeFromFavorites(symbol);
    } else {
      addToFavorites(symbol);
    }
  };

  const handleAddToPortfolio = (symbol: string) => {
    // For demo purposes, add 10 shares at current price
    const stock = stocks.find(s => s.symbol === symbol);
    if (stock) {
      addToPortfolio(symbol, 10, stock.price);
    }
  };

  const handleUpdateRefreshInterval = (interval: number) => {
    updateSettings({ refreshInterval: interval });
  };

  const handleToggleLayout = () => {
    const newLayout = viewPreferences.dashboardLayout === 'grid' ? 'list' : 'grid';
    updateViewPreferences({ dashboardLayout: newLayout });
  };

  // Auto-refresh based on user settings
  useEffect(() => {
    if (settings.refreshInterval > 0) {
      const interval = setInterval(() => {
        refetchStocks(true);
      }, settings.refreshInterval);
      
      return () => clearInterval(interval);
    }
  }, [settings.refreshInterval, refetchStocks]);

  return (
    <div className="space-y-6">
      {/* Settings Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Dashboard Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Refresh Interval:</span>
              <select 
                value={settings.refreshInterval}
                onChange={(e) => handleUpdateRefreshInterval(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={0}>Manual</option>
                <option value={30000}>30s</option>
                <option value={60000}>1m</option>
                <option value={300000}>5m</option>
              </select>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleToggleLayout}
            >
              Layout: {viewPreferences.dashboardLayout}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {portfolio.length} positions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Watchlist</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{watchlist.length}</div>
            <p className="text-xs text-muted-foreground">
              Stocks being watched
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Quote (AAPL)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {quoteLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : quote ? (
              <div>
                <div className="text-2xl font-bold">${quote.price.toFixed(2)}</div>
                <p className={`text-xs ${quote.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
                </p>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No data</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Favorites Section */}
      {favoriteStocks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Favorite Stocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-4 ${
              viewPreferences.dashboardLayout === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {favoriteStocks.map((stock) => (
                <div key={stock.symbol} className="relative">
                  <StockCard stock={stock} />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleToggleFavorite(stock.symbol)}
                  >
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Watchlist Section */}
      <Card>
        <CardHeader>
          <CardTitle>Watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          {watchlistStocks.length === 0 ? (
            <p className="text-muted-foreground">No stocks in watchlist</p>
          ) : (
            <div className={`grid gap-4 ${
              viewPreferences.dashboardLayout === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {watchlistStocks.map((stock) => (
                <div key={stock.symbol} className="relative group">
                  <StockCard stock={stock} />
                  
                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFavorite(stock.symbol)}
                      >
                        <Star className={`h-4 w-4 ${
                          favoriteSymbols.includes(stock.symbol)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`} />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddToPortfolio(stock.symbol)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFromWatchlist(stock.symbol)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>AAPL Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <StockChart 
            data={chartData} 
            loading={chartLoading}
            height={300}
          />
        </CardContent>
      </Card>

      {/* All Stocks Section */}
      <Card>
        <CardHeader>
          <CardTitle>All Stocks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-4 ${
            viewPreferences.dashboardLayout === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {stocks.map((stock) => (
              <div key={stock.symbol} className="relative group">
                <StockCard stock={stock} />
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFavorite(stock.symbol)}
                    >
                      <Star className={`h-4 w-4 ${
                        favoriteSymbols.includes(stock.symbol)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddToWatchlist(stock.symbol)}
                      disabled={watchlist.includes(stock.symbol)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};