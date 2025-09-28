# Zustand Quick Start Guide

## 🚀 Installation

The Zustand dependency has been added to `package.json`. To install:

```bash
npm install
# or
yarn install
# or 
pnpm install
```

## 🎯 Basic Usage

### 1. UI State Management

```tsx
import { useSidebarState, useThemeState } from '@/stores';

function MyComponent() {
  const { isCollapsed, toggleSidebar } = useSidebarState();
  const { theme, setTheme } = useThemeState();
  
  return (
    <div>
      <button onClick={toggleSidebar}>
        {isCollapsed ? 'Expand' : 'Collapse'} Sidebar
      </button>
      <button onClick={() => setTheme('dark')}>
        Switch to Dark Theme
      </button>
    </div>
  );
}
```

### 2. Stock Data with Caching

```tsx
import { useStockDataWithStore, useChartDataWithStore } from '@/hooks/useStockDataWithStore';

function StockComponent() {
  const { stocks, loading, error, refetch } = useStockDataWithStore();
  const { chartData, loading: chartLoading } = useChartDataWithStore('AAPL', '1M');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      {stocks.map(stock => (
        <div key={stock.symbol}>
          {stock.symbol}: ${stock.price}
        </div>
      ))}
    </div>
  );
}
```

### 3. User Preferences

```tsx
import { useWatchlist, usePortfolio, useUserSettings } from '@/stores';

function UserPreferencesComponent() {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { portfolio, addToPortfolio } = usePortfolio();
  const { settings, updateSettings } = useUserSettings();
  
  return (
    <div>
      <h3>Watchlist ({watchlist.length})</h3>
      {watchlist.map(symbol => (
        <div key={symbol}>
          {symbol}
          <button onClick={() => removeFromWatchlist(symbol)}>Remove</button>
        </div>
      ))}
      
      <button onClick={() => addToWatchlist('MSFT')}>
        Add MSFT
      </button>
      
      <button onClick={() => updateSettings({ refreshInterval: 60000 })}>
        Set 1 minute refresh
      </button>
    </div>
  );
}
```

## 🛠️ Available Stores

### UI Store

- `useSidebarState()` - Sidebar collapse/expand
- `useThemeState()` - Theme management
- `useLoadingState()` - Global loading states
- `useModalState()` - Modal management

### Stock Store

- `useStocksData()` - All stocks data
- `useStockCache()` - Individual stock caching
- `useChartCache()` - Chart data caching
- `useQuoteCache()` - Real-time quotes

### User Store

- `useWatchlist()` - Stock watchlist
- `usePortfolio()` - Portfolio management
- `useUserSettings()` - User preferences
- `useViewPreferences()` - Display preferences
- `useFavorites()` - Favorite stocks

## 🔗 Enhanced Hooks

### useStockDataWithStore()

Enhanced hook that combines Zustand store with API calls:

- Automatic caching
- Error handling
- Loading states
- Force refresh capability

### useChartDataWithStore(symbol, period)

Chart data with intelligent caching:

- Per-symbol and per-period caching
- Automatic invalidation
- Loading states

### useStockQuoteWithStore(symbol, refreshInterval)

Real-time quotes with auto-refresh:

- Configurable refresh intervals
- Automatic caching
- Error recovery

## 🎨 Global vs Local State

### Use Zustand (Global) for

- User preferences and settings
- Cached API data
- Cross-component UI state (theme, sidebar)
- Persistent data (watchlist, portfolio)

### Use React useState (Local) for

- Form inputs
- Component-specific UI (hover states, dropdowns)
- Temporary data (search queries)
- Animation states

## 🔧 Advanced Patterns

### Selective Subscriptions

```tsx
// Only re-renders when sidebar state changes
const { isCollapsed } = useSidebarState();

// Re-renders on any UI state change (avoid this)
const uiStore = useUIStore();
```

### Combining Multiple Stores

```tsx
function DashboardComponent() {
  const { stocks } = useStocksData();
  const { watchlist } = useWatchlist();
  const { viewPreferences } = useViewPreferences();
  
  const watchlistStocks = stocks.filter(stock => 
    watchlist.includes(stock.symbol)
  );
  
  return (
    <div className={`grid ${
      viewPreferences.dashboardLayout === 'grid' 
        ? 'grid-cols-3' 
        : 'grid-cols-1'
    }`}>
      {watchlistStocks.map(stock => (
        <StockCard key={stock.symbol} stock={stock} />
      ))}
    </div>
  );
}
```

## 🚦 Migration from Context API

Existing components using the old `SidebarContext` continue to work:

```tsx
// Old way (still works)
import { useSidebar } from '@/contexts/SidebarContext';

// New way (recommended)
import { useSidebarZustand } from '@/contexts/SidebarContextZustand';
// or directly
import { useSidebarState } from '@/stores';
```

## 📱 Routes

- `/` - Original Dashboard (migrated to Zustand)
- `/advanced` - Advanced Dashboard (full Zustand features)
- `/tanstack` - TanStack Demo

## 🐛 Debugging

Zustand integrates with Redux DevTools. Install the browser extension to inspect store state and actions.

## 📚 Further Reading

- [ZUSTAND_INTEGRATION.md](./ZUSTAND_INTEGRATION.md) - Comprehensive integration guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Updated architecture documentation
- [src/examples/ZustandUsageExamples.tsx](./src/examples/ZustandUsageExamples.tsx) - Complete usage examples
