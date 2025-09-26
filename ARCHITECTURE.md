# Architecture Guide

## Project Architecture Overview

This document outlines the architectural decisions and patterns used in the StockWeb application, designed for maintainability and extensibility.

## 🏗️ Architecture Principles

### 1. Component-Based Architecture
- **Single Responsibility**: Each component has one clear purpose
- **Composition over Inheritance**: Build complex UIs by combining simple components
- **Prop Drilling Avoidance**: Use React Context or state management for deep data passing

### 2. Type Safety
- **TypeScript First**: All components and utilities are fully typed
- **Interface-Driven**: Clear contracts between components
- **Runtime Safety**: Type guards for external data

### 3. Separation of Concerns
- **Presentation**: React components handle UI rendering
- **Logic**: Custom hooks manage stateful logic
- **Data**: Utility functions handle data transformation
- **Styling**: Tailwind CSS for consistent styling

## 📁 Directory Structure

```
src/
├── components/           # UI Components
│   ├── ui/              # Base UI components (shadcn/ui)
│   ├── Dashboard.tsx    # Page-level components
│   ├── Header.tsx       # Layout components  
│   ├── StockCard.tsx    # Feature components
│   └── StockChart.tsx   # Visualization components
│
├── hooks/               # Custom React Hooks
│   └── useStockData.ts  # (Future: data fetching hooks)
│
├── lib/                 # Core Utilities
│   └── utils.ts         # Common utility functions
│
├── types/               # Type Definitions
│   ├── stock.ts         # Domain-specific types
│   └── api.ts           # API response types (future)
│
├── utils/               # Helper Functions
│   ├── mockData.ts      # Data generation & formatting
│   ├── api.ts           # API client (future)
│   └── constants.ts     # App constants (future)
│
└── styles/              # Global Styles (if needed)
    └── globals.css      # Global CSS overrides
```

## 🔧 Component Patterns

### 1. Functional Components with TypeScript

```tsx
interface ComponentProps {
  data: StockData;
  onAction?: (id: string) => void;
}

export const Component = ({ data, onAction }: ComponentProps) => {
  // Component logic
  return <div>...</div>;
};
```

### 2. Props Interface Pattern

```tsx
// Define props interface
interface StockCardProps {
  stock: StockData;
  onClick?: (symbol: string) => void;
  className?: string;
}

// Use with React.forwardRef if needed
const StockCard = React.forwardRef<HTMLDivElement, StockCardProps>(
  ({ stock, onClick, className }, ref) => {
    // Component implementation
  }
);
```

### 3. Compound Components

```tsx
// Export multiple related components
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };

// Usage
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

## 🎨 Styling Architecture

### Tailwind CSS Strategy

1. **Utility-First**: Use Tailwind utilities for most styling
2. **Component Classes**: Create reusable component classes when needed
3. **CSS Variables**: Use CSS custom properties for theming
4. **Responsive Design**: Mobile-first responsive approach

### Theme System

```css
/* CSS Custom Properties for consistent theming */
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  --background: 0 0% 100%;
  /* ... */
}

/* Dark mode support */
.dark {
  --primary: 217.2 91.2% 59.8%;
  --background: 222.2 84% 4.9%;
  /* ... */
}
```

### Responsive Breakpoints

```tsx
// Mobile-first responsive design
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
  {/* Responsive grid */}
</div>
```

## 📊 Data Management

### Current Approach (Mock Data)

```tsx
// Static mock data for demonstration
export const mockStockData: StockData[] = [
  // ... stock data
];

// Dynamic data generation
export const generateChartData = (days: number): ChartData[] => {
  // Generate time-series data
};
```

### Future Data Architecture

```tsx
// API integration layer
class StockAPI {
  async getStockData(symbol: string): Promise<StockData> {
    // API call implementation
  }
  
  async getHistoricalData(symbol: string, period: string): Promise<ChartData[]> {
    // Historical data fetching
  }
}

// Custom hooks for data management
export const useStock = (symbol: string) => {
  const [data, setData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch and manage stock data
  
  return { data, loading, refetch };
};
```

## 🔌 Integration Points

### 1. Real-time Data Integration

```tsx
// WebSocket hook for real-time updates
export const useRealtimeStock = (symbol: string) => {
  const [price, setPrice] = useState<number>(0);
  
  useEffect(() => {
    const ws = new WebSocket(`ws://api.example.com/stocks/${symbol}`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(data.price);
    };
    
    return () => ws.close();
  }, [symbol]);
  
  return price;
};
```

### 2. State Management (✅ Implemented with Zustand)

```tsx
// Zustand-based state management with TypeScript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// UI Store for application-wide UI state
export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        isSidebarCollapsed: false,
        theme: 'system',
        toggleSidebar: () => set((state) => ({ 
          isSidebarCollapsed: !state.isSidebarCollapsed 
        })),
        setTheme: (theme) => set({ theme }),
      }),
      { name: 'stock-web-ui-store' }
    ),
    { name: 'UIStore' }
  )
);

// Stock Data Store with caching
export const useStockStore = create<StockStore>()(
  devtools((set) => ({
    stocks: [],
    stockCache: {},
    chartDataCache: {},
    quotesCache: {},
    setStocks: (stocks) => set({ stocks }),
    setStockInCache: (symbol, stock) => set((state) => ({
      stockCache: { ...state.stockCache, [symbol]: stock }
    })),
    // ... more actions
  }))
);

// User Preferences Store
export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        watchlist: [],
        portfolio: [],
        settings: { refreshInterval: 30000 },
        addToWatchlist: (symbol) => set((state) => ({
          watchlist: [...state.watchlist, symbol]
        })),
        // ... more actions
      }),
      { name: 'stock-web-user-store' }
    )
  )
);

// Enhanced hooks that integrate Zustand with React patterns
export const useStockDataWithStore = () => {
  const { stocks, setStocks, setStocksLoading } = useStocksData();
  
  const fetchStocks = useCallback(async () => {
    setStocksLoading(true);
    const data = await stockApi.getStocks();
    setStocks(data);
    setStocksLoading(false);
  }, [setStocks, setStocksLoading]);
  
  return { stocks, refetch: fetchStocks };
};
```

**Key Features:**
- **Multi-domain stores**: UI, Stock Data, User Preferences
- **TypeScript integration**: Full type safety with interfaces
- **Persistence**: Critical data saved to localStorage
- **DevTools support**: Redux DevTools integration
- **Caching strategy**: Automatic API response caching
- **Performance optimization**: Selective subscriptions
- **Backward compatibility**: Existing components work unchanged

**Global vs Local State Guidelines:**
- **Global (Zustand)**: User preferences, cached API data, cross-component UI state
- **Local (useState)**: Form inputs, component-specific UI, temporary states

See [ZUSTAND_INTEGRATION.md](./ZUSTAND_INTEGRATION.md) for detailed implementation guide.

## 🧪 Testing Strategy

### Component Testing

```tsx
// Unit tests for components
describe('StockCard', () => {
  it('displays stock information correctly', () => {
    const mockStock: StockData = {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 150.00,
      change: 2.50,
      changePercent: 1.69,
    };
    
    render(<StockCard stock={mockStock} />);
    
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('$150.00')).toBeInTheDocument();
  });
});
```

### Integration Testing

```tsx
// Test component interactions
describe('Dashboard Integration', () => {
  it('updates data when refresh button is clicked', async () => {
    render(<Dashboard />);
    
    const refreshButton = screen.getByText('Refresh Data');
    fireEvent.click(refreshButton);
    
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
});
```

## 🚀 Performance Considerations

### 1. Code Splitting

```tsx
// Lazy load components for better performance
const Dashboard = lazy(() => import('./components/Dashboard'));
const Portfolio = lazy(() => import('./components/Portfolio'));

// Route-based code splitting
<Routes>
  <Route path="/" element={<Suspense fallback={<Loading />}><Dashboard /></Suspense>} />
  <Route path="/portfolio" element={<Suspense fallback={<Loading />}><Portfolio /></Suspense>} />
</Routes>
```

### 2. Memoization

```tsx
// Memoize expensive calculations
const ExpensiveChart = memo(({ data }: { data: ChartData[] }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      movingAverage: calculateMovingAverage(item.price)
    }));
  }, [data]);
  
  return <Chart data={processedData} />;
});
```

### 3. Virtual Scrolling

```tsx
// For large datasets
import { FixedSizeList as List } from 'react-window';

const VirtualizedStockList = ({ stocks }: { stocks: StockData[] }) => (
  <List
    height={600}
    itemCount={stocks.length}
    itemSize={80}
    itemData={stocks}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <StockCard stock={data[index]} />
      </div>
    )}
  </List>
);
```

## 🔐 Security Considerations

### 1. Input Validation

```tsx
// Validate all external data
const validateStockData = (data: unknown): StockData => {
  if (!isStockData(data)) {
    throw new Error('Invalid stock data format');
  }
  return data;
};

// Type guards
const isStockData = (data: unknown): data is StockData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'symbol' in data &&
    'price' in data
  );
};
```

### 2. Environment Variables

```tsx
// Use environment variables for configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.VITE_API_KEY;

// Never expose sensitive data in frontend code
```

## 📈 Scalability Patterns

### 1. Feature-Based Organization

```
src/
├── features/
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── utils/
│   ├── portfolio/
│   └── watchlist/
└── shared/
    ├── components/
    ├── hooks/
    └── utils/
```

### 2. Micro-Frontend Architecture

```tsx
// Module federation for large applications
const RemotePortfolio = lazy(() => import('portfolio/Portfolio'));
const RemoteWatchlist = lazy(() => import('watchlist/Watchlist'));
```

This architecture provides a solid foundation for building maintainable, scalable financial applications while following React and TypeScript best practices.