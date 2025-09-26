/**
 * Comprehensive examples demonstrating Zustand integration patterns
 * This file showcases all the key features and usage patterns
 */

import React, { useEffect } from 'react';
import { 
  useUIStore, 
  useSidebarState, 
  useThemeState,
  useStockStore,
  useStocksData,
  useWatchlist,
  usePortfolio,
  useUserSettings,
  useViewPreferences 
} from '@/stores';
import { useStockDataWithStore, useChartDataWithStore } from '@/hooks/useStockDataWithStore';

// Example 1: Basic Zustand Usage
export const BasicZustandExample = () => {
  // Direct store access (all state)
  const uiStore = useUIStore();
  
  // Selective subscription (only specific parts)
  const { isCollapsed, toggleSidebar } = useSidebarState();
  const { theme, setTheme } = useThemeState();
  
  return (
    <div>
      <h2>Basic Zustand Usage</h2>
      <p>Sidebar collapsed: {isCollapsed ? 'Yes' : 'No'}</p>
      <button onClick={toggleSidebar}>Toggle Sidebar</button>
      
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('dark')}>Set Dark Theme</button>
      <button onClick={() => setTheme('light')}>Set Light Theme</button>
    </div>
  );
};

// Example 2: Stock Data with Caching
export const StockDataExample = () => {
  const { stocks, loading, error, refetch } = useStockDataWithStore();
  const { chartData, loading: chartLoading } = useChartDataWithStore('AAPL', '1M');
  
  return (
    <div>
      <h2>Stock Data with Caching</h2>
      <button onClick={() => refetch()}>Refresh Stocks</button>
      
      {loading && <p>Loading stocks...</p>}
      {error && <p>Error: {error}</p>}
      
      <div>
        <h3>Stocks ({stocks.length})</h3>
        {stocks.slice(0, 3).map(stock => (
          <div key={stock.symbol}>
            {stock.symbol}: ${stock.price} ({stock.changePercent.toFixed(2)}%)
          </div>
        ))}
      </div>
      
      <div>
        <h3>AAPL Chart Data</h3>
        {chartLoading ? (
          <p>Loading chart...</p>
        ) : (
          <p>Chart data points: {chartData.length}</p>
        )}
      </div>
    </div>
  );
};

// Example 3: User Preferences and Watchlist
export const UserPreferencesExample = () => {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { portfolio, addToPortfolio } = usePortfolio();
  const { settings, updateSettings } = useUserSettings();
  const { viewPreferences, updateViewPreferences } = useViewPreferences();
  
  const handleAddToWatchlist = () => {
    const symbols = ['MSFT', 'GOOGL', 'TSLA', 'AMZN'];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    addToWatchlist(randomSymbol);
  };
  
  const handleAddToPortfolio = () => {
    addToPortfolio('AAPL', 10, 150.0);
  };
  
  return (
    <div>
      <h2>User Preferences</h2>
      
      <div>
        <h3>Watchlist ({watchlist.length} stocks)</h3>
        {watchlist.map(symbol => (
          <div key={symbol}>
            {symbol} 
            <button onClick={() => removeFromWatchlist(symbol)}>Remove</button>
          </div>
        ))}
        <button onClick={handleAddToWatchlist}>Add Random Stock</button>
      </div>
      
      <div>
        <h3>Portfolio ({portfolio.length} positions)</h3>
        {portfolio.map(position => (
          <div key={position.symbol}>
            {position.symbol}: {position.shares} shares @ ${position.avgPrice}
          </div>
        ))}
        <button onClick={handleAddToPortfolio}>Add AAPL Position</button>
      </div>
      
      <div>
        <h3>Settings</h3>
        <p>Refresh Interval: {settings.refreshInterval}ms</p>
        <button onClick={() => updateSettings({ refreshInterval: 60000 })}>
          Set 1 minute refresh
        </button>
        
        <p>Layout: {viewPreferences.dashboardLayout}</p>
        <button onClick={() => updateViewPreferences({ 
          dashboardLayout: viewPreferences.dashboardLayout === 'grid' ? 'list' : 'grid' 
        })}>
          Toggle Layout
        </button>
      </div>
    </div>
  );
};

// Example 4: Complex State Interactions
export const ComplexInteractionsExample = () => {
  const { stocks } = useStocksData();
  const { watchlist, addToWatchlist } = useWatchlist();
  const { portfolio } = usePortfolio();
  const { settings } = useUserSettings();
  const { setTheme } = useThemeState();
  
  // Calculate portfolio value
  const portfolioValue = portfolio.reduce((total, position) => {
    const stock = stocks.find(s => s.symbol === position.symbol);
    return total + (stock ? stock.price * position.shares : 0);
  }, 0);
  
  // Get watchlist stocks
  const watchlistStocks = stocks.filter(stock => watchlist.includes(stock.symbol));
  
  // Auto-refresh effect based on settings
  useEffect(() => {
    if (settings.refreshInterval > 0) {
      const interval = setInterval(() => {
        console.log('Auto-refreshing data based on user settings');
        // In real app, this would trigger data refresh
      }, settings.refreshInterval);
      
      return () => clearInterval(interval);
    }
  }, [settings.refreshInterval]);
  
  return (
    <div>
      <h2>Complex State Interactions</h2>
      
      <div>
        <h3>Portfolio Summary</h3>
        <p>Total Value: ${portfolioValue.toFixed(2)}</p>
        <p>Positions: {portfolio.length}</p>
      </div>
      
      <div>
        <h3>Watchlist Stocks</h3>
        {watchlistStocks.map(stock => (
          <div key={stock.symbol}>
            <strong>{stock.symbol}</strong>: ${stock.price} 
            <span style={{ color: stock.change >= 0 ? 'green' : 'red' }}>
              ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        ))}
        
        {watchlistStocks.length === 0 && (
          <p>No stocks in watchlist. Add some from the main list!</p>
        )}
      </div>
      
      <div>
        <h3>Bulk Actions</h3>
        <button onClick={() => {
          // Add top 3 stocks to watchlist
          stocks.slice(0, 3).forEach(stock => addToWatchlist(stock.symbol));
        }}>
          Add Top 3 Stocks to Watchlist
        </button>
        
        <button onClick={() => setTheme('dark')}>
          Switch to Dark Theme
        </button>
      </div>
    </div>
  );
};

// Example 5: Performance Demonstration
export const PerformanceExample = () => {
  // These will only re-render when their specific data changes
  const sidebarState = useSidebarState();
  const themeState = useThemeState();
  const stocksData = useStocksData();
  
  return (
    <div>
      <h2>Performance Example</h2>
      <p>Each section below only re-renders when its specific data changes:</p>
      
      <SidebarSection {...sidebarState} />
      <ThemeSection {...themeState} />
      <StocksSection {...stocksData} />
    </div>
  );
};

// Memoized components to demonstrate performance benefits
const SidebarSection = React.memo(({ isCollapsed, toggleSidebar }: any) => {
  console.log('SidebarSection rendered');
  return (
    <div>
      <h3>Sidebar (only re-renders on sidebar changes)</h3>
      <p>Collapsed: {isCollapsed ? 'Yes' : 'No'}</p>
      <button onClick={toggleSidebar}>Toggle</button>
    </div>
  );
});

const ThemeSection = React.memo(({ theme, setTheme }: any) => {
  console.log('ThemeSection rendered');
  return (
    <div>
      <h3>Theme (only re-renders on theme changes)</h3>
      <p>Current: {theme}</p>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        Toggle Theme
      </button>
    </div>
  );
});

const StocksSection = React.memo(({ stocks, loading }: any) => {
  console.log('StocksSection rendered');
  return (
    <div>
      <h3>Stocks (only re-renders on stock data changes)</h3>
      <p>Count: {stocks.length}</p>
      {loading && <p>Loading...</p>}
    </div>
  );
});

// Main demo component
export const ZustandUsageDemo = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Zustand Integration Demo</h1>
      
      <div style={{ marginBottom: '40px' }}>
        <BasicZustandExample />
      </div>
      
      <div style={{ marginBottom: '40px' }}>
        <StockDataExample />
      </div>
      
      <div style={{ marginBottom: '40px' }}>
        <UserPreferencesExample />
      </div>
      
      <div style={{ marginBottom: '40px' }}>
        <ComplexInteractionsExample />
      </div>
      
      <div style={{ marginBottom: '40px' }}>
        <PerformanceExample />
      </div>
    </div>
  );
};